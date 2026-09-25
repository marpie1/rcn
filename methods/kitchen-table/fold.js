// Turn the PAGEFOLD marker item into a real FedWiki pagefold item.
// The converter has no markdown syntax for one, and the manual needs a real
// fold so the debrief is sealed on the page itself, not just by a heading.
const fs = require('fs');
function foldify(page) {
  let n = 0;
  page.story.forEach(it => {
    if (it.type === 'markdown' && it.text.trim() === 'PAGEFOLD') {
      it.type = 'pagefold';
      it.text = 'after you have finished';
      n++;
    }
  });
  return n;
}
let total = 0;
for (const f of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const pages = j.story ? [j] : Object.values(j);
  pages.forEach(p => { total += foldify(p); });
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
}
console.log('folds inserted:', total);
