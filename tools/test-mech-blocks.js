#!/usr/bin/env node
// deliberately not strict mode: a direct eval() in strict mode gets its own
// scope, so the model's declarations would not reach the tests.
/*
 * test-mech-blocks.js — round-trip and check tests for Mech Blocks.
 *
 * Extracts the model and the handbook corpus straight out of mech-blocks.html,
 * so the test cannot drift from the tool, and compares against Ward's own
 * tree() from wiki-plugin-mech/src/client/interpreter.js (copied below).
 *
 *   node tools/test-mech-blocks.js [path/to/mech-blocks.html]
 *
 * Exit 0 = all pass, 1 = a failure.
 */
var fs = require('fs'), path = require('path');

var target = process.argv[2] || path.join(__dirname, 'mech-blocks.html');
var html = fs.readFileSync(target, 'utf8');
var from = html.indexOf('/* ── model ──');
var to = html.indexOf('/* ── end model ──', from);
if (from < 0 || to < 0) { console.error('Could not locate the model in mech-blocks.html'); process.exit(1); }
eval(html.slice(from, to).replace(/^const /gm, 'var '));

var cm = html.match(/<script id="corpus" type="application\/json">([\s\S]*?)<\/script>/);
var corpus = JSON.parse(cm[1]);

// Ward's tree(), verbatim from interpreter.js (WardCunningham/wiki-plugin-mech @ a028b4b).
function wardTree(lines, here, indent) {
  while (lines.length) {
    let m = lines[0].match(/( *)(.*)/)
    let spaces = m[1].length
    let command = m[2]
    if (spaces == indent) {
      here.push({ command })
      lines.shift()
    } else if (spaces > indent) {
      var more = []
      here.push(more)
      wardTree(lines, more, spaces)
    } else {
      return here
    }
  }
  return here
}
const ward = text => wardTree(text.split(/\n/), [], 0);
const ours = lines => { const f = s => s.map(el => Array.isArray(el) ? f(el) : { command: lines[el.i].cmd }); return f(nest(lines)); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

let pass = 0, fail = 0;
function ok(cond, name, detail) {
  if (cond) pass++;
  else { fail++; console.log('FAIL', name, detail === undefined ? '' : '\n   ' + detail); }
}

// 1. Every handbook script comes back byte for byte, and nests exactly as Ward's interpreter nests it.
for (const c of corpus) {
  const lines = parse(c.text);
  ok(serialize(lines) === c.text, `round trip ${c.slug}`, JSON.stringify(c.text));
  ok(same(ours(lines), ward(c.text)), `same nesting as Ward ${c.slug}`, JSON.stringify(c.text));
}

// 2. Moving any block anywhere keeps every line's text and the block's own shape;
//    moving it back where it came from restores the original text exactly.
let moves = 0;
for (const c of corpus) {
  const lines = parse(c.text);
  for (let i = 0; i < lines.length; i++) {
    const end = subtreeEnd(lines, i);
    const shape = lines.slice(i, end + 1).map(l => [l.ind - lines[i].ind, l.cmd]);
    const targets = [{ kind: 'end' }];
    for (let j = 0; j < lines.length; j++) targets.push({ kind: 'before', i: j }, { kind: 'after', i: j }, { kind: 'into', i: j });
    for (const t of targets) {
      const next = moveBlock(lines, i, t);
      if (!next) { ok(t.kind != 'end' && t.i >= i && t.i <= end, `refused only self-drops ${c.slug}`, JSON.stringify(t)); continue; }
      moves++;
      ok(same(next.map(l => l.cmd).sort(), lines.map(l => l.cmd).sort()), `move keeps lines ${c.slug}`);
      const place = placeOf(lines, t);
      const at = place.at > end ? place.at - (end - i + 1) : place.at;
      const got = next.slice(at, at + shape.length).map(l => [l.ind - next[at].ind, l.cmd]);
      ok(same(got, shape), `move keeps block shape ${c.slug} line ${i} ${JSON.stringify(t)}`);
      // Ward's parser must agree on the moved text too
      ok(same(ours(next), ward(serialize(next))), `moved text nests as Ward ${c.slug}`);
    }
    // there and back: to the end and then to before its old successor (or end)
    const away = moveBlock(lines, i, { kind: 'end' });
    if (away && lines[i].ind === 0 && end + 1 < lines.length && lines[end + 1].ind === 0) {
      const back = moveBlock(away, away.length - (end - i + 1), { kind: 'before', i });
      ok(serialize(back) === c.text, `there and back ${c.slug} line ${i}`, serialize(back));
    }
  }
}

// 3. Removing and inserting.
{
  const lines = parse('CLICK\n NEIGHBORS\n WALK 10 steps\nHELLO');
  ok(serialize(removeBlock(lines, 0)) === 'HELLO', 'remove takes the indented lines with it');
  ok(serialize(insertNew(lines, 'PREVIEW graph', { kind: 'after', i: 2 })) === 'CLICK\n NEIGHBORS\n WALK 10 steps\n PREVIEW graph\nHELLO', 'insert after uses that indent');
  ok(serialize(insertNew(parse('CLICK'), 'HELLO', { kind: 'into', i: 0 })) === 'CLICK\n HELLO', 'into an empty mouth uses the text\'s own step (1 by default)');
  ok(serialize(insertNew(parse('CLICK\n  HELLO\nTICK'), 'HELLO', { kind: 'into', i: 2 })) === 'CLICK\n  HELLO\nTICK\n  HELLO', 'into an empty mouth matches a 2-space script');
}

// 4. The checks say what Ward's blocks would say, before running.
function notes(text) { return analyze(parse(text)).flatMap((f, i) => f.notes.map(n => `${i + 1}:${n.level}:${n.msg}`)); }
function expectClean(text) { const n = notes(text); ok(n.length === 0, `clean: ${JSON.stringify(text)}`, n.join('\n   ')); }
function expectNote(text, re) { const n = notes(text); ok(n.some(s => re.test(s)), `note ${re} for ${JSON.stringify(text)}`, n.join('\n   ') || '(no notes)'); }

expectClean('NEIGHBORS\nWALK');
expectClean('CLICK\n NEIGHBORS fed.wiki\n WALK 10 steps\n PREVIEW graph');
expectClean('SOURCE aspect\nSOLO');
expectClean('FROM found.ward.fed.wiki/esp8266-datalog\n SENSOR garage\n  REPORT');
expectClean('CLICK\n GET\n  COMMONS\n POPUP images');
expectClean('TICK 5\n FORWARD 150\n TURN 144');
expectClean('NEIGHBORS fed.wiki\n Journal Fork Survey');
expectClean('PLUGIN coauthor\n RESOLVE');
expectNote('WALK', /1:need:WALK expects "neighborhood", like from NEIGHBORS/);
expectNote('CLICK', /CLICK expects indented blocks to follow/);
expectNote('CLICK\nHELLO', /CLICK expects indented blocks to follow/);
expectNote('TICK 10\n UNTIL word', /UNTIL expects "aspect"/);
expectNote('TICK 0\n HELLO', /TICK expects a count from 1 to 99/);
expectNote('CLACK\n  HELLO', /CLACK doesn't name a block we know/);
expectNote('Clunk', /Expected line to begin with all-caps keyword/);
expectNote('NEIGHBORS\n Pattern Links', /Site Survey title/);
expectNote('PREVIEW graf', /"graf" doesn't name an item we can preview/);
expectNote('GET\n DELTA', /DELTA expects "recent"/);
expectNote('POPUP images', /POPUP expects "commons"/);
expectNote('HELLO\n HELLO world', /HELLO doesn't use indented lines/);
expectNote('CLICK\n  HELLO\n HELLO world', /never run/);
expectNote('GET nothere\n UPTIME', /GET expected "nothere" to name state or site/);
// state shared into GET reaches server blocks
expectClean('DELTA have\nGET recent\n DELTA');
// CODE may write anything: needs after it are softened, not flagged
expectClean('CODE\nWALK');
// FILE's text is only for the blocks under it
expectClean('SOURCE assets\nFILE tsv\n KWIC\n  [[$K]]');
expectNote('SOURCE assets\nFILE tsv\n HELLO\nKWIC', /KWIC expects "tsv"/);
// FILE stores under its argument as written, so ".tsv" is not "tsv"
expectNote('SOURCE assets\nFILE .tsv\n KWIC\n  [[$K]]', /KWIC expects "tsv"/);
// SHOW with no argument opens state.info
expectClean('NEIGHBORS\nRANDOM\nSHOW');
expectNote('SHOW', /SHOW expects "info"/);
expectClean('SHOW welcome-visitors');
// CODE may carry indented lines for its function to read
expectClean('CLICK\n CODE greet world\n REPORT greeting');
expectClean('CODE\n some words for api.body()');
// the two new handbook pages' scripts
expectClean('CLICK\n NEIGHBORS\n CODE titles\n DOWNLOAD titles.txt');

// 5. Every handbook script: the checks run without throwing, and every line gets a role.
for (const c of corpus) {
  let f;
  try { f = analyze(parse(c.text)); } catch (e) { ok(false, `analyze ${c.slug}`, e.stack); continue; }
  ok(f.every(r => r.role), `roles ${c.slug}`);
}

// 6. The catalog covers every block Ward ships (blocks.js and server.js, a028b4b).
const wardClient = 'CLICK HELLO FROM SENSOR REPORT SOURCE PREVIEW NEIGHBORS WALK TICK UNTIL FORWARD TURN FILE KWIC SHOW RANDOM SLEEP TOGETHER PLUGIN GET DELTA ROSTER LINEUP LISTEN MESSAGE SOLO POPUP PRINT CODE DOWNLOAD'.split(' ');
const wardServer = 'HELLO UPTIME SLEEP COMMONS DELTA'.split(' ');
ok(same(Object.keys(CATALOG).sort(), wardClient.slice().sort()), 'client catalog matches blocks.js', Object.keys(CATALOG).join(' '));
ok(same(Object.keys(SERVER).sort(), wardServer.slice().sort()), 'server catalog matches server.js');
ok(JSON.parse(catalogJSON()).client.WALK.reads[0] === 'neighborhood', 'catalog exports as plain JSON');

console.log(`${pass} passed, ${fail} failed — ${corpus.length} handbook scripts, ${moves} moves tried`);
process.exit(fail ? 1 : 0);
