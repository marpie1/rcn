#!/bin/sh
# Build docs/mech/every-mech-block.json from every-mech-block.md.
# Tables become html items (grid-shaped data), lightly styled so they read in
# FedWiki's narrow column; the credit line in the .md is replaced by the stamped
# attribution item, moved to second place.
#   sh docs/mech/make_every_mech_block.sh
set -e
cd "$(dirname "$0")"
S=../../.claude/skills/fedwiki-page/scripts
node $S/md-to-fedwiki-page.js every-mech-block.md --tables html --map every-mech-block.json
node -e '
const fs=require("fs");const f="every-mech-block.json";const m=JSON.parse(fs.readFileSync(f));
const LINE=/^\*Marc Pierson and Claude .* · .* \d{4}\*$/;
const style=h=>h.replace("<table>","<table style=\"border-collapse:collapse;width:100%\">")
  .replace(/<th>/g,"<th style=\"text-align:left;padding:4px 8px;border-bottom:2px solid #999\">")
  .replace(/<td>/g,"<td style=\"padding:4px 8px;vertical-align:top;border-bottom:1px solid #ddd\">")
  .replace("<th style=\"", "<th style=\"width:1%;white-space:nowrap;");  // block column only as wide as the names
for(const p of Object.values(m)){
  p.story=p.story.filter(i=>!LINE.test(i.text.trim()));
  for(const i of p.story) if(i.type=="html") i.text=style(i.text);
  const t0=p.journal[0].date;
  p.journal=[p.journal[0],...p.story.map((it,k)=>({type:"add",id:it.id,item:{type:it.type,id:it.id,text:it.text},date:t0+k+1,...(k?{after:p.story[k-1].id}:{})}))];
}
fs.writeFileSync(f,JSON.stringify(m,null,2));'
node $S/fedwiki-attribution.js every-mech-block.json --model "Claude Opus 5.5" --date "October 2026" >/dev/null
node -e '
const fs=require("fs");const f="every-mech-block.json";const m=JSON.parse(fs.readFileSync(f));
for(const p of Object.values(m)){
  const k=p.story.findIndex(i=>i.attribution); const [a]=p.story.splice(k,1); p.story.splice(1,0,a);
  p.journal.find(j=>j.type=="add"&&j.id==a.id).after=p.story[0].id;
  const s=[]; for(const j of p.journal) if(j.type=="add"){const at=j.after?s.findIndex(x=>x.id==j.after)+1:0; s.splice(at,0,j.item);}
  if(s.map(x=>x.id).join()!==p.story.map(x=>x.id).join()) throw new Error("journal does not replay");
  const html=p.story.filter(i=>i.type=="html").map(i=>i.text).join("");
  console.log(p.title+": "+p.story.length+" items, "+(html.match(/<tr><td /g)||[]).length+" blocks, "+(html.match(/<a href=/g)||[]).length+" handbook links, credit second, history replays");
}
fs.writeFileSync(f,JSON.stringify(m,null,2));'
