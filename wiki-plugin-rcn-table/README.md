# wiki-plugin-rcntable

A table of records on a Federated Wiki page. The page shows the shape of the table — rows × columns, the column names as chips, the first few names as links — and an **Open Table** button that opens the whole table in a popup: sort, filter, select rows, compare them, follow one row into a drawing of what it is connected to (**Neighbourhood**), or put the selected rows on a map (**Map**). Every name is a link: click one and that subject's page opens in the lineup beside the table.

Install on a wiki server:

```
npm install -g wiki-plugin-rcntable
```

and restart the wiki. The Factory then offers **RCN Table**.

## Where the rows come from

The popup reads a folder in the site's own assets: `/assets/rcn-table/`, holding the three tool pages and one exported database per subfolder. So each site is its own database — whoever owns the site keeps it, anyone who can read the page can read the table, and nothing talks to a database server. Two Assets items put it there: one whose text is `rcn-table` for the tool pages, one whose text is `rcn-table/<database>` for the record files. The record files can be made from a spreadsheet in the table itself (Open spreadsheet… → Publish records ↓) or from Neo4j with `substrate/export.py` in the rcn repository. A folder may carry a seal — a signed statement of who vouches for the records — which the table verifies in the browser.

Double-click the item to edit it; a line `database: whatcom` names the records, `src: https://another-site/assets/rcn-table/whatcom/` reads another site's. Cmd-I in the editor opens the About page.

Part of the [RCN toolset](https://github.com/marpie1/rcn), CC BY 4.0 / MIT.
