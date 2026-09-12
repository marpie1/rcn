---
name: learnings-and-ways-of-working
description: Pedagogical and technical principles that shaped the tooling, plus how Marc works and wants output shaped
sources: [backfill]
aliases: []
---

## Key learnings & principles

- [stated] Lead with invisibility: the most pedagogically honest and effective framing of any modeling tool is what it structurally *cannot* capture, not its capabilities — a corrective to the tendency of teachers and vendors to oversell tools
- [stated] Story Structure as master reference: because it is universally legible, it serves as the common framework against which all other RCN tools are mapped and compared
- [stated] Canvas maps have a scalability ceiling: spatial IBIS maps become unreadable as they grow; collapsible tree structures (as in MORE) solve this better
- [stated] IBIS-MORE architecture: the node-click-to-explore + proposal checklist pattern keeps AI assistance integrated but user-controlled, avoiding uncontrolled map mutation
- [stated] DOM stability matters: rebuilding entire SVG/DOM structures on every state change breaks editing interactions; persistent DOM nodes updated in place is the correct approach
- [stated] Floating panels need `position:fixed` — `position:absolute` causes panels to be clipped by `overflow:hidden` ancestors
- [stated] Double-click detection: native `dblclick` events can be suppressed by `preventDefault()` on `mousedown`; timer-based detection is more reliable
- [stated] Clean diagrams over comprehensive ones: attempting to show everything in one graphic creates illegibility; separate, focused diagrams are preferred

## Approach & patterns

- [stated] Iterative, bug-driven development: Marc identifies specific bugs, reports them precisely, and works through fixes incrementally
- [stated] Strong preference for standalone HTML tools (no build pipeline dependencies) using embedded libraries where needed
- [stated] Post-hoc IBIS mapping of conversations themselves is a regular practice for demonstration and documentation
- [stated] At the start of relevant conversations, Marc should say "Please map this conversation as IBIS JSON when we're done," optionally naming participants and attaching a prior JSON to extend an existing map
- [stated] Prefers output that is clean, separated, and structurally honest over outputs that try to do too much at once
- [stated] Gives direct feedback on output quality; expects clear acknowledgment and correction when errors occur
