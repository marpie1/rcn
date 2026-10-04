# DOWNLOAD

DOWNLOAD saves something a Mech has made as a file on your own computer.

The file name you give chooses what is saved. Its ending picks which state is written, and how:

- `DOWNLOAD notes.txt` saves state.txt as plain text.
- `DOWNLOAD page.html` saves state.html as a web page.
- `DOWNLOAD table.csv` saves state.csv as comma-separated values.
- `DOWNLOAD table.tsv` saves state.tsv as tab-separated values.
- `DOWNLOAD data.json` saves state.json, turned into JSON text first.

The file gets the name exactly as written. After saving, the block shows the size, like ⇒ 2048 bytes.

Click ▶ to save the titles of every page in the neighborhood as a text file. CODE makes the text and DOWNLOAD saves it.

```mech
CLICK
 NEIGHBORS
 CODE titles
 DOWNLOAD titles.txt
```

```code
export function titles() {
  const infos = this.neighborhood
  this.txt = infos.map(info => info.title).join('\n')
  return `${infos.length} titles`
}
```

## Where the text comes from

No built-in block writes state.html, state.csv or state.json, so DOWNLOAD is mostly a partner for [[CODE]]. A function sets `this.csv` or `this.json`, and DOWNLOAD saves it.

[[FILE]] is the other source. FILE stores the chosen file's text under its argument exactly as written, so `FILE tsv` writes state.tsv and DOWNLOAD can save it again. `FILE .tsv` stores it under the name ".tsv", which DOWNLOAD and [[KWIC]] will not find.

## When it goes wrong

- No file name: DOWNLOAD expects an argument, a file name to use when downloaded.
- An ending other than txt, html, csv, tsv or json: DOWNLOAD expects a familiar suffix.
- Nothing in that state yet: DOWNLOAD expects to find "csv" in state, naming the one it looked for.
- Only json is converted. For the other four, the state must already be text; a number or a list will not save as you expect.
- Some browsers ask where to save each file, and some block a page that downloads many files in a row, as a TICK might.

DOWNLOAD reads state.txt, or reads state.html, reads state.csv, reads state.tsv or reads state.json, whichever the file name's ending names. It writes no state.
