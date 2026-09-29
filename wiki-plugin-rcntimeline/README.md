# wiki-plugin-rcntimeline

A small RCN timeline on a Federated Wiki page: intervals as bars with their fuzzy edges, the links between them, and a date axis. Hover a bar for its dates, source, confidence and note; click it to open its page in the lineup.

The full RCN Timeline (`tools/rcn-timeline.html` in the rcn repository) solves and edits. This plugin draws what the item holds — dates as stored, no solving — and its **Open in RCN Timeline ↗** button opens the item's timeline in the full tool, in its own tab. On a localhost wiki that is the working copy on port 8765; elsewhere the site's `/assets/rcn-timeline/rcn-timeline.html`; an item's `tool` field overrides both. A second Open reuses the same tab. Edits made there do not come back to the page yet.

Install on a wiki server:

```
npm install -g wiki-plugin-rcntimeline
```

and restart the wiki. The Factory then offers **RCN Timeline**.

## The item

```json
{
  "type": "rcntimeline",
  "text": "Caption on the first line\nthen the intervals and links in words",
  "timeline": {
    "intervals": [
      {"id": "a1_pre", "label": "A-1 Builders (conventional firm)", "start": "Jul 1 1955", "end": "Jul 1 2017", "startFuzz": 0.5, "color": "#94a3b8", "row": 9, "page": "A1DesignBuild"},
      {"id": "a1", "label": "A1DesignBuild — worker co-op", "start": "Jul 1 2017", "end": "Sep 28 2026", "color": "#c0392b", "row": 9, "page": "A1DesignBuild"}
    ],
    "links": [ {"from": "a1_pre", "to": "a1", "rel": "meets", "who": "a1designbuild.coop"} ]
  }
}
```

- `timeline` is the RCN Timeline's own export format, so a timeline saved from the tool drops straight in. Fields the plugin does not use (`coops`, say) are left alone.
- `page` names the wiki page a bar opens. A bar without one is not a link.
- `rel` may be one relation (`meets`) or a list (`["before", "meets"]`, "one of"), drawn dashed. Lists are not built in the tool yet; the plugin accepts them so it will not break when they are.
- `text`: the first line is the caption; the rest lists the intervals and links in words, for search and for a wiki without this plugin.
- An item with no `timeline` — a fresh one from the Factory — is drawn from its text in the tool's own sentence form: `Label = Jan 2020 .. Jun 2021`, or `Label = 1970 .. 2026`.

## Status

Version 0.1: draws intervals, fuzz, links and an axis; bars open their pages; Open in RCN Timeline opens the item in the full tool. Next: save-back from the tool into the item, and lineup merging (a timeline collecting the timelines of the pages to its left).

Part of the [RCN toolset](https://github.com/marpie1/rcn), MIT.

Marc Pierson and Claude Opus 5.5 · September 2026
