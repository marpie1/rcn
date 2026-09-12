#!/usr/bin/env python3
"""Build Design Record/ from the Claude Chat export + Marc's .pages edits.

Reads:  Design Record/chat-export/conversations-000/conversations.json
        Design Record/sources/EDITED SECTION N.pages
        Design Record/chat-export/memories-000/memories/*.json
Writes: Design Record/NN-*.md, 00-prework-conversation.md, 13-drafting-conversation.md,
        chat-memory/**.md, sources/pastes/turn-NNN-*.txt
"""
import json, re, os, sys, glob, zipfile, unicodedata

ROOT = "/Users/marcpierson/rcn/Design Record"
EXPORT = f"{ROOT}/chat-export"
SRC = f"{ROOT}/sources"
CHAT = "Organizing local projects into actionable plans"

# ---------- load turns ----------
convs = json.load(open(f"{EXPORT}/conversations-000/conversations.json"))
conv = [c for c in convs if c["name"] == CHAT][0]
msgs = sorted(conv["chat_messages"], key=lambda m: m["created_at"])

def text_of(m):
    return "\n".join(b.get("text", "") for b in m.get("content", []) if b.get("type") == "text").strip()

def when(m):  # UTC → keep as recorded, label it
    return m["created_at"][:16].replace("T", " ") + " UTC"

def who(m):
    return "Marc" if m["sender"] == "human" else "Claude"

# ---------- save big pastes as files ----------
os.makedirs(f"{SRC}/pastes", exist_ok=True)
paste_refs = {}  # turn index -> list of relative paths
PASTE_NAMES = {
    (136, 0): "fedwiki-customer-scenario-template.json",
    (136, 1): "fedwiki-writing-a-customer-scenario.json",
    (140, 0): "fedwiki-story-structure.json",
    (154, 0): "fedwiki-action-conversation-template.json",
    (154, 1): "dunham-conversation-for-action.svg",
}
for i, m in enumerate(msgs):
    refs = []
    for k, a in enumerate(m.get("attachments", [])):
        content = a.get("extracted_content") or ""
        if not content:
            continue
        name = (a.get("file_name") or "").strip()
        ext = {"application/json": "json", "text/markdown": "md", "text/html": "html"}.get(a.get("file_type"), "txt")
        fn = f"turn-{i:03d}-{k}-{re.sub(r'[^A-Za-z0-9._-]+', '-', name) if name else 'paste'}.{ext}" if not name or not name.endswith("." + ext) else f"turn-{i:03d}-{k}-{re.sub(r'[^A-Za-z0-9._-]+', '-', name)}"
        if (i, k) in PASTE_NAMES:
            fn = f"turn-{i:03d}-{k}-" + PASTE_NAMES[(i, k)]
        with open(f"{SRC}/pastes/{fn}", "w") as f:
            f.write(content)
        refs.append(f"sources/pastes/{fn}")
    if refs:
        paste_refs[i] = refs

# ---------- section map ----------
SECTIONS = {
    1:  dict(slug="01-origin-and-purpose",           draft=[69],       edits="EDITED SECTION 1 fedwiki-lineup 3.pages", disc=(112, 113), rewrite=None),
    2:  dict(slug="02-four-principles",              draft=[81],       edits="EDITED Section 2.pages",                 disc=(114, 115), rewrite=None),
    3:  dict(slug="03-vsm-at-neighborhood-scale",    draft=[83],       edits="EDITED SECTION 3.pages",                 disc=(116, 119), rewrite=None),
    4:  dict(slug="04-founded-commons",              draft=[85],       edits="EDITED SECTION 4.pages",                 disc=(128, 130), rewrite=131),
    5:  dict(slug="05-customer-scenario",            draft=[87],       edits="EDITED SECTION 5.pages",                 disc=(134, 142), rewrite=143),
    6:  dict(slug="06-industry-platform",            draft=[89],       edits="EDITED SECTION 6.pages",                 disc=(144, 146), rewrite=147),
    7:  dict(slug="07-moods-and-speech-acts",        draft=[91],       edits="EDITED SECTION 7.pages",                 disc=(152, 154), rewrite=155),
    8:  dict(slug="08-between-institution-project",  draft=[93],       edits="EDITED SECTION 8.pages",                 disc=(156, 163), rewrite=None),
    9:  dict(slug="09-catalytic-seed-capital",       draft=[95],       edits=None, disc=None, rewrite=None),
    10: dict(slug="10-value-by-residents",           draft=[97],       edits=None, disc=None, rewrite=None),
    11: dict(slug="11-prior-work-substrate",         draft=[99],       edits=None, disc=None, rewrite=None),
    12: dict(slug="12-open-questions",               draft=[101, 103], edits=None, disc=None, rewrite=None),
}

STATE = {
    1: "First draft delivered; edited by Marc; Claude rewrite pending. Ripples to absorb: section-list restated to the actual twelve, kit → field guide, convenor → convener.",
    2: "First draft delivered; edited by Marc; Claude rewrite pending. Ripples: spell out Neighborhood-Catalyzing Industry Platform, drop 'menu of adjacencies', kit → field guide.",
    3: "First draft delivered; edited by Marc; Claude rewrite pending. Expanded scope agreed: shared reference for the e-VSM tool suite lives here (referenced from Section 5); placement of the e-VSM integration subsection deferred until the substrate matures.",
    4: "First draft delivered; edited by Marc; rewrite delivered with all edits absorbed. NEEDS CORRECTION: the rewrite reversed the founded-commons mapping. Correct is Chris at Leo's in Superior, Jerry at The Fledge in Lansing.",
    5: "First draft delivered; edited by Marc; full rewrite delivered (two-level scenario distinction, both origination patterns, 14-element template, bid mechanic, Story Structure integration). Awaiting Marc's reactions.",
    6: "First draft delivered; edited by Marc; full rewrite delivered (all terminology decisions applied, VAM explained at first reference, Zohar cited, non-financial measures subsection, Platform-vs-RCN distinction, gated funding, value chain flow diagram in sources/rcn-value-chain-flow.json). Awaiting Marc's reactions.",
    7: "First draft delivered; edited by Marc; full rewrite delivered (corrected six-moods framework, Beer-mood claim dropped, Wittgenstein/Austin/Searle/Flores lineage, five foundational speech acts, Dunham nine states in four phases, three conversation types, field guide replaces kit). Awaiting Marc's reactions.",
    8: "First draft delivered; extensively edited by Marc with substantive parenthetical questions; REWRITE PENDING — this is where the source chat stopped. Substrate now on disk: Ackoff Bell Labs transcript, value-network-notation.md, the VNA drawings in tools/. Marc's turn-158 answers apply (both 'network of nested systems' and an RCN Graph diagram of the refugee-scenario case). Something Marc meant to add after turn 161 never arrived.",
    9: "First draft delivered; awaiting Marc's edits.",
    10: "First draft delivered; awaiting Marc's edits.",
    11: "First draft delivered; awaiting Marc's edits. Needs the Chris/Jerry founded-commons correction propagated.",
    12: "Drafted twice (the second supersedes the first — different framing and title); awaiting Marc's edits.",
}

# ---------- split a drafting turn into preface / body / delivery notes ----------
def split_draft(t, n):
    m = re.search(rf"^# Section {n} — .*$", t, re.M)
    if not m:
        raise SystemExit(f"no heading for section {n}")
    preface = t[: m.start()].strip()
    preface = re.sub(r"\n?---\s*$", "", preface).strip()
    rest = t[m.start():]
    cut = re.search(r"\n---\n", rest)
    if cut:
        body, notes = rest[: cut.start()].strip(), rest[cut.end():].strip()
    else:
        body, notes = rest.strip(), ""
    return preface, body, notes

# ---------- .pages body extraction ----------
def snappy_decompress(data):
    pos = 0; shift = 0
    while True:
        b = data[pos]; pos += 1
        shift += 7
        if not b & 0x80:
            break
    out = bytearray()
    while pos < len(data):
        tag = data[pos]; pos += 1
        t = tag & 3
        if t == 0:
            l = tag >> 2
            if l < 60:
                l += 1
            else:
                nb = l - 59; l = int.from_bytes(data[pos:pos + nb], "little") + 1; pos += nb
            out += data[pos:pos + l]; pos += l
        else:
            if t == 1:
                l = ((tag >> 2) & 7) + 4; off = ((tag >> 5) << 8) | data[pos]; pos += 1
            elif t == 2:
                l = (tag >> 2) + 1; off = int.from_bytes(data[pos:pos + 2], "little"); pos += 2
            else:
                l = (tag >> 2) + 1; off = int.from_bytes(data[pos:pos + 4], "little"); pos += 4
            for _ in range(l):
                out.append(out[-off])
    return bytes(out)

def pages_body(path):
    raw = zipfile.ZipFile(path).read("Index/Document.iwa")
    buf = bytearray(); pos = 0
    while pos < len(raw):
        ln = int.from_bytes(raw[pos + 1:pos + 4], "little"); pos += 4
        buf += snappy_decompress(raw[pos:pos + ln]); pos += ln
    runs = re.findall(rb"[\x09\x0a\x20-\x7e\xc2-\xf4][\x09\x0a\x20-\x7e\x80-\xbf\xc2-\xf4]{200,}", bytes(buf))
    runs.sort(key=len, reverse=True)
    txt = runs[0].decode("utf-8", "replace")
    txt = txt.replace(" ", "\n").replace("\r", "\n").replace("￼", "").replace(" ", "\n")
    txt = txt.replace(" ", " ")
    txt = "".join(ch for ch in txt if ch in "\n\t" or (ord(ch) >= 32 and ord(ch) not in (0x7f, 0xfffd)))
    txt = txt.rstrip("* \n")
    # trim any leading protobuf junk before the title
    i = txt.find("Section ")
    if 0 < i < 40:
        txt = txt[i:]
    paras = [p.strip() for p in txt.split("\n")]
    return [p for p in paras if p]

def restore_headings(paras, drafts, n):
    heads = {}
    for d in drafts:
        for mm in re.finditer(r"^(#{1,3}) (.+)$", d, re.M):
            heads[mm.group(2).strip().lower()] = mm.group(1)
    out = []
    for p in paras:
        key = p.strip().lower()
        if re.match(rf"^section {n} — ", key):
            out.append("# " + p)
        elif key in heads:
            out.append(heads[key] + " " + p)
        else:
            out.append(p)
    return out

# ---------- transcript rendering ----------
def render_turn(i, pointer=None):
    m = msgs[i]
    t = text_of(m)
    parts = [f"**{who(m)}** — turn {i}, {when(m)}", ""]
    if pointer:
        parts.append(pointer)
    elif t:
        parts.append(t)
    else:
        parts.append("_(empty turn — the chat produced no text here)_")
    atts = [a.get("file_name") for a in m.get("attachments", []) if (a.get("file_name") or "").strip()]
    files = [f.get("file_name") for f in m.get("files", []) if (f.get("file_name") or "").strip()]
    notes = []
    if files:
        notes.append("uploaded files: " + ", ".join(f"`{x}`" for x in files) + " (in `sources/` where found on disk)")
    if i in paste_refs:
        notes.append("pasted text saved as: " + ", ".join(f"`{x}`" for x in paste_refs[i]))
    elif atts:
        notes.append("attachments: " + ", ".join(f"`{x}`" for x in atts))
    if notes:
        parts += ["", "_" + "; ".join(notes) + "_"]
    return "\n".join(parts) + "\n\n---\n"

body_turns = {}  # turn -> pointer text, for turns whose text is a section body
for n, s in SECTIONS.items():
    for d in s["draft"]:
        body_turns[d] = f"_Section {n} draft delivered here — see `{s['slug']}.md`._"
    if s["rewrite"]:
        body_turns[s["rewrite"]] = f"_Section {n} rewrite delivered here — see `{s['slug']}.md`. The non-section prose of this turn is reproduced there too._"

# ---------- write section files ----------
def demote(body):
    return re.sub(r"^(#{1,3}) ", lambda m: "#" * (len(m.group(1)) + 2) + " ", body, flags=re.M)

def hdr(title):
    return f"# {title}\n"

for n, s in SECTIONS.items():
    drafts = []
    out = []
    first_title = None
    for k, d in enumerate(s["draft"]):
        preface, body, notes = split_draft(text_of(msgs[d]), n)
        drafts.append(body)
        title = body.splitlines()[0][2:]
        if first_title is None:
            first_title = title
        label = "First draft" if len(s["draft"]) == 1 else ("First draft (first attempt)" if k == 0 else "First draft (second attempt — supersedes the first)")
        out.append(f"\n\n## {label} — turn {d}, {when(msgs[d])}\n")
        if preface:
            out.append(f"_Claude's preface:_ {preface}\n")
        out.append(demote(body))
        if notes:
            out.append(f"\n### Claude's notes on delivering the draft\n\n{notes}\n")
    if s["edits"]:
        p = f"{SRC}/{s['edits']}"
        paras = restore_headings(pages_body(p), drafts, n)
        out.append(f"\n\n## Marc's edits — `{s['edits']}` (file dated {os.popen(f'stat -f %Sm -t %Y-%m-%d \"{p}\"').read().strip()})\n")
        out.append("_Extracted verbatim from the Pages file on disk. Marc edited the draft in place and added comments and questions as parenthetical paragraphs — a paragraph wrapped entirely in parentheses is Marc talking to Claude, not body text. Headings were restored by matching the draft; everything else is exactly as in the file._\n")
        out.append("\n\n".join(demote(q) for q in paras))
    if s["disc"]:
        a, b = s["disc"]
        out.append(f"\n\n## The conversation about the edits — turns {a}–{b}\n")
        out.append("_Claude's report on Marc's edits, and Marc's answers. Claude read the Pages file in the chat and summarised; the verbatim edits above are the authority where they differ._\n")
        for i in range(a, b + 1):
            if i == s["rewrite"]:
                continue
            out.append(render_turn(i, body_turns.get(i)))
    if s["rewrite"]:
        r = s["rewrite"]
        preface, body, notes = split_draft(text_of(msgs[r]), n)
        out.append(f"\n\n## Rewrite — turn {r}, {when(msgs[r])}\n")
        if preface:
            out.append(f"_What Claude said before the rewrite in the same turn:_\n\n{preface}\n")
        out.append(demote(body))
        if notes:
            out.append(f"\n### Claude's notes on delivering the rewrite\n\n{notes}\n")
    head = [
        hdr(f"Section {n} — {first_title.split(' — ',1)[1] if ' — ' in first_title else first_title}"),
        f"**State (as of 2026-09-11):** {STATE[n]}",
        "",
        f"**Provenance:** recovered from the Claude Chat conversation \"{CHAT}\" (uuid {conv['uuid']}) via the account data export of 2026-09-11; full transcript at `chat-export/organizing-local-projects.md`. Turn numbers index that transcript. Marc's edits come from the `.pages` files in `sources/`.",
        "",
        "**Reading order:** the latest text is the rewrite if there is one, else Marc's edits, else the first draft. Earlier layers are kept so nothing is lost and so the reasoning can be followed.",
    ]
    with open(f"{ROOT}/{s['slug']}.md", "w") as f:
        f.write("\n".join(head) + "\n" + "".join(x if x.endswith("\n") else x + "\n" for x in out))
    print("wrote", s["slug"], sum(len(x) for x in out), "chars")

# ---------- conversations ----------
def write_transcript(path, title, intro, rng):
    with open(path, "w") as f:
        f.write(f"# {title}\n\n{intro}\n\n---\n\n")
        for i in rng:
            f.write(render_turn(i, body_turns.get(i)) + "\n")
    print("wrote", os.path.basename(path))

write_transcript(
    f"{ROOT}/00-prework-conversation.md",
    "The conversation before drafting — Aug 30–31, 2026",
    f"Turns 0–68 of \"{CHAT}\". This is where the theory got settled before a word of the design record was drafted: the two biases, Ashby–Conant, the four conveners, Linkage Mapping and Medford/Spokane as the method, the Ripple ReThink Model, moods and speech acts as the working layer, safe culturally appropriate spaces as a hard filter, the founded commons, McKnight's associational care, catalytic seed capital, Haier's Industry Platform, and 'value created by residents for residents and their neighbors'. Times are UTC as recorded by the export. Uploaded files are in `sources/` where they were found on disk.",
    range(0, 69),
)
write_transcript(
    f"{ROOT}/13-drafting-conversation.md",
    "The conversation around the drafts — Aug 31 – Sep 11, 2026",
    f"Turns 69–166 of \"{CHAT}\": the section requests, the kit discussion (turns 104–107), Marc's edits arriving section by section, the e-VSM and Story Structure substrate, the terminology decisions, and the compaction wall. Section bodies are pointers to their own files; everything else is verbatim. Times are UTC.",
    range(69, len(msgs)),
)

# ---------- memory files ----------
mem = json.load(open(glob.glob(f"{EXPORT}/memories-000/memories/*.json")[0]))
os.makedirs(f"{ROOT}/chat-memory", exist_ok=True)
with open(f"{ROOT}/chat-memory/conversations-memory.md", "w") as f:
    f.write("# Claude Chat's account-level memory (export of 2026-09-11)\n\n" + mem["conversations_memory"] + "\n")
for mf in mem["memory_files"]:
    p = mf.get("path") or mf.get("name")
    content = mf.get("content", "")
    dest = f"{ROOT}/chat-memory{p}"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w") as f:
        f.write(content if content.endswith("\n") else content + "\n")
pm = mem.get("project_memories")
if pm:
    with open(f"{ROOT}/chat-memory/project-memories.json", "w") as f:
        json.dump(pm, f, indent=1)
print("wrote chat-memory:", len(mem["memory_files"]), "files")
