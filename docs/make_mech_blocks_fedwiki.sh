#!/bin/sh
# Build docs/fedwiki-pages/mech-blocks.json from the three Mech Blocks .md sources.
# The intro and manual convert normally; the reference keeps its grids as html tables.
# Fenced code becomes Code items. The credit line in each .md is replaced by the
# stamped attribution item, moved to second place so search shows the first paragraph.
#   sh docs/make_mech_blocks_fedwiki.sh
set -e
cd "$(dirname "$0")/.."
S=.claude/skills/fedwiki-page/scripts
T=$(mktemp -d)
OUT=docs/fedwiki-pages/mech-blocks.json
node $S/md-to-fedwiki-page.js tools/mech-blocks-intro.md tools/mech-blocks-manual.md --map $T/a.json
node $S/md-to-fedwiki-page.js tools/mech-blocks-reference.md --tables html --map $T/b.json
node -e '
const fs=require("fs");const [T,out]=process.argv.slice(1);
const m=Object.assign(JSON.parse(fs.readFileSync(T+"/a.json")),JSON.parse(fs.readFileSync(T+"/b.json")));
const LINE=/^\*Marc Pierson and Claude .* · .* \d{4}\*$/;
for(const p of Object.values(m)){
  p.story=p.story.filter(i=>!LINE.test(i.text.trim()));
  // grid tables: full width, padded, ruled rows, so they read in a narrow column
  for(const i of p.story) if(i.type=="html") i.text=i.text.replace("<table>","<table style=\"border-collapse:collapse;width:100%\">")
    .replace(/<th>/g,"<th style=\"text-align:left;padding:4px 6px;border-bottom:2px solid #999\">")
    .replace(/<td>/g,"<td style=\"padding:4px 6px;vertical-align:top;border-bottom:1px solid #ddd\">")
    .replace("<th style=\"", "<th style=\"width:1%;white-space:nowrap;");  // block column only as wide as the names
  for(const it of p.story){const r=it.text.match(/^```\w*\n([\s\S]*?)\n```$/); if(r){it.type="code";it.text=r[1];}}
  const t0=p.journal[0].date;
  p.journal=[p.journal[0], ...p.story.map((it,k)=>({type:"add",id:it.id,item:{type:it.type,id:it.id,text:it.text},date:t0+k+1,...(k?{after:p.story[k-1].id}:{})}))];
}
fs.writeFileSync(out,JSON.stringify(m,null,2));' $T $OUT
node $S/fedwiki-attribution.js $OUT --model "Claude Opus 5.5" --date "October 2026"
node -e '
const fs=require("fs");const f=process.argv[1];const m=JSON.parse(fs.readFileSync(f));
for(const p of Object.values(m)){
  const k=p.story.findIndex(i=>i.attribution===true); const [a]=p.story.splice(k,1); p.story.splice(1,0,a);
  p.journal.find(j=>j.type=="add"&&j.id==a.id).after=p.story[0].id;
  const s=[]; for(const j of p.journal) if(j.type=="add"){const at=j.after?s.findIndex(x=>x.id==j.after)+1:0; s.splice(at,0,j.item);}
  if(s.map(x=>x.id).join()!==p.story.map(x=>x.id).join()) throw new Error("journal does not replay: "+p.title);
  console.log(p.title+": "+p.story.length+" items, attribution second, journal replays");
}
fs.writeFileSync(f,JSON.stringify(m,null,2));' $OUT
rm -r $T
