#!/usr/bin/env node
// deliberately not strict mode: a direct eval() in strict mode gets its own
// scope, so the solver's function declarations would not reach the tests.
/*
 * test-timeline-solver.js — regression tests for the RCN Timeline solver.
 *
 * Extracts the relation table and solve() straight out of rcn-timeline.html and
 * runs them against hand-built models, so the test cannot drift from the tool.
 * No DOM, no browser: the solver is pure arithmetic over {s,e,pinned}.
 *
 *   node tools/test-timeline-solver.js
 *
 * Exit 0 = all pass, 1 = a failure.
 */
var fs = require('fs'), path = require('path');

// Optional path argument so a modified copy can be checked without touching the
// real file — which is how you confirm a test still has teeth.
var target = process.argv[2] || path.join(__dirname, 'rcn-timeline.html');
var html = fs.readFileSync(target, 'utf8');
var from = html.indexOf('var EPS=1e-6;');
var to   = html.indexOf('/* ── rendering', from);
if (from < 0 || to < 0) { console.error('Could not locate the solver in rcn-timeline.html'); process.exit(1); }
var solverSrc = html.slice(from, to);

// -- stubs the solver needs ---------------------------------------------------
function fmtDur(y){ return (Math.round(y * 10) / 10) + ' yr'; }
var M = { intervals: [], links: [] }, issues = [];
function ivById(id){ for (var i=0;i<M.intervals.length;i++) if (M.intervals[i].id===id) return M.intervals[i]; return null; }
function moveIv(iv, newS){ var d = newS - iv.s; iv.s += d; iv.e += d; }

eval(solverSrc);   // defines EPS, REL_ORDER, REL_META, relRange, solve

// ── tests ───────────────────────────────────────────────
let pass=0, fail=0;
function iv(id,s,e,pinned){return {id,label:id,s,e,pinned:!!pinned};}
function run(name, ivs, links, expect){
  M.intervals=ivs; M.links=links.map((l,i)=>Object.assign({id:'lk'+i},l));
  solve();
  const got = M.intervals.map(v=>`${v.id}:${+v.s.toFixed(3)}..${+v.e.toFixed(3)}`).join(' ');
  const ok = got===expect.state && (expect.issues===undefined || issues.length===expect.issues);
  console.log(`${ok?'  PASS':'X FAIL'}  ${name}`);
  if(!ok){ console.log(`         got      ${got}  issues=${issues.length}`);
           console.log(`         expected ${expect.state}  issues=${expect.issues??'any'}`);
           if(issues.length) console.log('         '+issues.map(i=>i.msg).join('\n         ')); }
  ok?pass++:fail++;
}

// before — unchanged behaviour
run('before: already satisfied, nothing moves',
    [iv('A',0,2), iv('B',5,6)], [{from:'A',to:'B',rel:'before'}],
    {state:'A:0..2 B:5..6', issues:0});
run('before: violated, B pushed to A.e',
    [iv('A',0,2), iv('B',1,3)], [{from:'A',to:'B',rel:'before'}],
    {state:'A:0..2 B:2..4', issues:0});
run('meets: welds B.s to A.e',
    [iv('A',0,2), iv('B',7,9)], [{from:'A',to:'B',rel:'meets'}],
    {state:'A:0..2 B:2..4', issues:0});

// overlaps — A.s < B.s < A.e < B.e
run('overlaps: already true, nothing moves',
    [iv('A',0,4), iv('B',2,6)], [{from:'A',to:'B',rel:'overlaps'}],
    {state:'A:0..4 B:2..6', issues:0});
run('overlaps: B too late, pulled back to A.e',
    [iv('A',0,4), iv('B',9,11)], [{from:'A',to:'B',rel:'overlaps'}],
    {state:'A:0..4 B:4..6', issues:0});
run('overlaps: B too early, pushed so B.e clears A.e',
    [iv('A',0,4), iv('B',-5,-2)], [{from:'A',to:'B',rel:'overlaps'}],
    {state:'A:0..4 B:1..4', issues:0});

// during — A inside B
run('during: already true, nothing moves',
    [iv('A',2,3), iv('B',0,10)], [{from:'A',to:'B',rel:'during'}],
    {state:'A:2..3 B:0..10', issues:0});
run('during: container slid left to cover A',
    [iv('A',2,3), iv('B',2.5,12.5)], [{from:'A',to:'B',rel:'during'}],
    {state:'A:2..3 B:2..12', issues:0});
run('during: container too short -> contradiction, nothing forced',
    [iv('A',0,10), iv('B',0,2)], [{from:'A',to:'B',rel:'during'}],
    {state:'A:0..10 B:0..2', issues:1});

// equals
run('equals: same duration, B aligned to A',
    [iv('A',5,8), iv('B',0,3)], [{from:'A',to:'B',rel:'equals'}],
    {state:'A:5..8 B:5..8', issues:0});
run('equals: different durations -> contradiction',
    [iv('A',0,3), iv('B',0,7)], [{from:'A',to:'B',rel:'equals'}],
    {state:'A:0..3 B:0..7', issues:1});

// pinned still wins
run('during: pinned target cannot move -> contradiction',
    [iv('A',2,3), iv('B',5,15,true)], [{from:'A',to:'B',rel:'during'}],
    {state:'A:2..3 B:5..15', issues:1});

// chains still propagate
// C already contains B once B is pushed, so C must NOT move — the point of
// clamping to the nearest bound instead of snapping to it.
run('chain: before then during, container already covers -> C untouched',
    [iv('A',0,2), iv('B',0,1), iv('C',0,20)],
    [{from:'A',to:'B',rel:'before'},{from:'B',to:'C',rel:'during'}],
    {state:'A:0..2 B:2..3 C:0..20', issues:0});
run('chain: before then during, container must slide right to cover B',
    [iv('A',0,2), iv('B',0,1), iv('C',-30,-10)],
    [{from:'A',to:'B',rel:'before'},{from:'B',to:'C',rel:'during'}],
    {state:'A:0..2 B:2..3 C:-17..3', issues:0});

// the trap that started this
run('THE TRAP: long state + before shoves everything (why during was needed)',
    [iv('RESULT',2022,2030), iv('SOLUTION',2023,2024)],
    [{from:'RESULT',to:'SOLUTION',rel:'before'}],
    {state:'RESULT:2022..2030 SOLUTION:2030..2031', issues:0});
run('...and during expresses what was meant, moving nothing',
    [iv('RESULT',2022,2030), iv('SOLUTION',2023,2024)],
    [{from:'SOLUTION',to:'RESULT',rel:'during'}],
    {state:'RESULT:2022..2030 SOLUTION:2023..2024', issues:0});

// ── link-creation gesture ───────────────────────────────────────────────
// onIvDown decides what a click on a bar means. It used to ask
// `mode==="before"||mode==="meets"`, which silently limited the click gesture
// to two relations after five existed — the other three were reachable only
// from the panel or the sentence box. Test the gesture for every relation.
var gFrom = html.indexOf('function onIvDown');
var gTo   = html.indexOf('function startHandle', gFrom);
if (gFrom < 0 || gTo < 0) { console.error('Could not locate onIvDown'); process.exit(1); }
var mode = 'select', linkStart = null, drag = null, uidN = 0;
function nid(p){ return p + (++uidN); }
function toast(){} function beforeChange(){} function syncModeBtns(){}
function render(){} function renderPanel(){} function selectIv(){}
function cloneModel(){ return JSON.parse(JSON.stringify(M)); }
function svgPt(){ return {x:0,y:0}; } function xt(){ return 0; }
function addLink(fromId,toId,rel){
  if(fromId===toId)return null;
  for(var i=0;i<M.links.length;i++){var L=M.links[i];if(L.from===fromId&&L.to===toId){L.rel=rel;return L;}}
  var lk={id:nid("lk"),from:fromId,to:toId,rel:rel,who:"",note:"",conf:0.8};
  M.links.push(lk);return lk;
}
eval(html.slice(gFrom, gTo));   // defines onIvDown

function gesture(rel){
  M.intervals=[iv('A',0,2), iv('B',10,20)]; M.links=[];
  mode=rel; linkStart=null;
  var ev={stopPropagation:function(){}};
  onIvDown(ev, M.intervals[0]);            // click source
  var latched = linkStart===M.intervals[0].id;
  onIvDown(ev, M.intervals[1]);            // click target
  var made = M.links.length===1 && M.links[0].rel===rel &&
             M.links[0].from==='A' && M.links[0].to==='B';
  var reset = (mode==='select' && linkStart===null);
  var ok = latched && made && reset;
  console.log(`${ok?'  PASS':'X FAIL'}  gesture: arm "${rel}" then click two bars`);
  if(!ok) console.log(`         latched=${latched} made=${made} modeReset=${reset} links=${JSON.stringify(M.links.map(l=>l.rel))}`);
  ok?pass++:fail++;
}
REL_ORDER.forEach(gesture);

// a click in select mode must NOT create a link
M.intervals=[iv('A',0,2), iv('B',10,20)]; M.links=[]; mode='select'; linkStart=null;
onIvDown({stopPropagation:function(){}}, M.intervals[0]);
var selOk = M.links.length===0 && linkStart===null;
console.log(`${selOk?'  PASS':'X FAIL'}  gesture: select mode does not create links`);
selOk?pass++:fail++;

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
