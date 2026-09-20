/* ─────────────────────────────────────────────────────────────────────────────
   RCN HOUSE ICON LIBRARY  —  rcn-icons.js
   ─────────────────────────────────────────────────────────────────────────────

   A neighborhood-focused vocabulary of images for RCN drawings.

   WHY THIS FILE EXISTS
   Meaning in an RCN drawing is carried by the PICTURE, not by the node's
   silhouette. Graphviz-style shape zoos (box3d, doubleoctagon, invhouse...) are
   distinguishable but unreadable — an untrained group can't say what they mean.
   An icon needs no legend: a house means house. See the reference example,
   "Vera Report Flow Chart" (OmniGraffle): ~30 node types, ONE shape, all the
   meaning in the glyph plus a two-colour border code.

   THE CAVE DRAWING TEST
   A group in a room. Projector or printout. Nobody trained on the notation.
   Pointing and arguing. If a glyph is not readable under those conditions, it
   does not belong here. Prefer fewer, louder images.

   DEPLOYMENT
   Sidecar file, same pattern as rcn_map.html + rcn_static_data.js. Load it
   before the tool; the tool falls back to an empty library if absent:

       <script src="rcn-icons.js"></script>

   Defines the global RCN_ICONS.

   ─────────────────────────────────────────────────────────────────────────────
   DRAWING RULES  (follow these when adding an icon)
   ─────────────────────────────────────────────────────────────────────────────
   1. viewBox is 0 0 24 24. Draw to the full grid; don't leave timid margins.
   2. Monochrome only. Use currentColor so the node's border colour tints the
      glyph — that is what keeps the red/green moral coding working.
   3. The consumer wraps your markup in:
        <g fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round">
      So: emit bare shapes. For a solid, set fill="currentColor" stroke="none"
      on that element.
   4. Heavy and simple beats detailed. It will be printed small and viewed far.
   5. NO TEXT inside an icon. Words don't scale and don't translate. (Currency
      and mathematical marks drawn as paths are fine — they're symbols, not words.)
   6. Silhouette first: if it's unrecognisable as a solid black blob, redraw it.

   TO ADD AN ICON
   Append to the array with a unique `key` prefixed `rcn_`, a short `label` (the
   word people will say out loud when pointing at it), and a `cat` from the list
   in RCN_ICON_CATS. Then open tools/rcn-icon-sheet.html and check it at the
   small size, which is the size that matters.
   ───────────────────────────────────────────────────────────────────────────── */

var RCN_ICON_LIBRARY_VERSION = '0.1.0';

var RCN_ICON_CATS = [
  'People',       // who is in the picture
  'Place',        // where it happens
  'Institution',  // organised bodies with a door you can walk through
  'Resource',     // what flows
  'Care',         // wellbeing and the systems that tend it
  'Harm',         // what damages people
  'Process',      // what is being done or decided
  'System'        // abstract systems-thinking vocabulary
];

var RCN_ICONS = [

  /* ── PEOPLE ────────────────────────────────────────────────────────────── */
  { key:'rcn_person', label:'Person', cat:'People',
    svg:'<circle cx="12" cy="7" r="3.4" fill="currentColor" stroke="none"/>'
       +'<path d="M4.8 20.5v-1.2a7.2 7.2 0 0 1 14.4 0v1.2"/>' },

  { key:'rcn_pair', label:'Pair', cat:'People',
    svg:'<circle cx="8" cy="7.5" r="2.8" fill="currentColor" stroke="none"/>'
       +'<circle cx="16" cy="7.5" r="2.8" fill="currentColor" stroke="none"/>'
       +'<path d="M2.5 20v-1a5.5 5.5 0 0 1 11 0v1"/>'
       +'<path d="M14 14.2a5.5 5.5 0 0 1 7.5 4.8v1"/>' },

  { key:'rcn_group', label:'Group', cat:'People',
    svg:'<circle cx="12" cy="6.2" r="2.6" fill="currentColor" stroke="none"/>'
       +'<circle cx="5" cy="9.5" r="2.2" fill="currentColor" stroke="none"/>'
       +'<circle cx="19" cy="9.5" r="2.2" fill="currentColor" stroke="none"/>'
       +'<path d="M6.5 17.5a5.5 5.5 0 0 1 11 0v2.8h-11z"/>'
       +'<path d="M1.5 20.3v-2a4 4 0 0 1 3.4-3.9"/>'
       +'<path d="M22.5 20.3v-2a4 4 0 0 0-3.4-3.9"/>' },

  { key:'rcn_gathering', label:'Gathering', cat:'People',
    svg:'<circle cx="12" cy="12" r="5.2"/>'
       +'<circle cx="12" cy="3.4" r="2.1" fill="currentColor" stroke="none"/>'
       +'<circle cx="19.5" cy="7.8" r="2.1" fill="currentColor" stroke="none"/>'
       +'<circle cx="19.5" cy="16.2" r="2.1" fill="currentColor" stroke="none"/>'
       +'<circle cx="12" cy="20.6" r="2.1" fill="currentColor" stroke="none"/>'
       +'<circle cx="4.5" cy="16.2" r="2.1" fill="currentColor" stroke="none"/>'
       +'<circle cx="4.5" cy="7.8" r="2.1" fill="currentColor" stroke="none"/>' },

  { key:'rcn_conversation', label:'Conversation', cat:'People',
    svg:'<path d="M2.2 4.5h12v8h-7l-3.6 3.2v-3.2h-1.4z"/>'
       +'<path d="M9.6 15.2v1.6h6.6l3.6 3.2v-3.2h1.8v-8h-4.6"/>' },

  { key:'rcn_child', label:'Child', cat:'People',
    svg:'<circle cx="12" cy="8" r="4.6" fill="currentColor" stroke="none"/>'
       +'<path d="M6.8 21v-1a5.2 5.2 0 0 1 10.4 0v1"/>' },

  /* ── PLACE ─────────────────────────────────────────────────────────────── */
  { key:'rcn_dwelling', label:'Dwelling', cat:'Place',
    svg:'<path d="M3 11.2 12 3.4l9 7.8"/>'
       +'<path d="M5.4 10v10.4h13.2V10"/>'
       +'<path d="M9.8 20.4v-6h4.4v6"/>' },

  { key:'rcn_neighborhood', label:'Neighborhood', cat:'Place',
    svg:'<path d="M1.6 9.6 6.4 5.4l4.8 4.2"/>'
       +'<path d="M3 8.6v6.2h6.8V8.6"/>'
       +'<path d="M12.8 14.4 17.6 10.2l4.8 4.2"/>'
       +'<path d="M14.2 13.4v6.2H21v-6.2"/>'
       +'<path d="M3 19.6h7.4"/>' },

  { key:'rcn_land', label:'Land', cat:'Place',
    svg:'<path d="M2.4 8.6 12 4.2l9.6 4.4-9.6 4.4z"/>'
       +'<path d="M2.4 8.6v7.2L12 20.2l9.6-4.4V8.6"/>'
       +'<path d="M12 13v7.2"/>' },

  { key:'rcn_water', label:'Water', cat:'Place',
    svg:'<path d="M2 7.4c2.5-2.4 5-2.4 7.5 0s5 2.4 7.5 0 2.5-2.4 5 0"/>'
       +'<path d="M2 13c2.5-2.4 5-2.4 7.5 0s5 2.4 7.5 0 2.5-2.4 5 0"/>'
       +'<path d="M2 18.6c2.5-2.4 5-2.4 7.5 0s5 2.4 7.5 0 2.5-2.4 5 0"/>' },

  { key:'rcn_garden', label:'Garden', cat:'Place',
    svg:'<path d="M12 21v-8.6"/>'
       +'<path d="M12 13.4c0-3.4 2.2-5.6 5.6-5.6 0 3.4-2.2 5.6-5.6 5.6z" fill="currentColor" stroke="none"/>'
       +'<path d="M12 16.2c0-3-2-5-5-5 0 3 2 5 5 5z" fill="currentColor" stroke="none"/>'
       +'<path d="M3.4 21h17.2"/>' },

  { key:'rcn_tree', label:'Tree', cat:'Place',
    svg:'<path d="M12 21v-5.4"/>'
       +'<circle cx="12" cy="9" r="6.2" fill="currentColor" stroke="none"/>'
       +'<path d="M8 21h8"/>' },

  /* ── INSTITUTION ───────────────────────────────────────────────────────── */
  { key:'rcn_clinic', label:'Clinic', cat:'Institution',
    svg:'<path d="M4 20.6V7.2l8-3.8 8 3.8v13.4z"/>'
       +'<path d="M12 9.4v6.4"/><path d="M8.8 12.6h6.4"/>' },

  { key:'rcn_school', label:'School', cat:'Institution',
    svg:'<path d="M2.2 10.4 12 5.4l9.8 5"/>'
       +'<path d="M4.6 12v8.6h14.8V12"/>'
       +'<path d="M9.4 20.6v-4.8h5.2v4.8"/>' },

  { key:'rcn_civic', label:'Civic', cat:'Institution',
    svg:'<path d="M2.4 8.8 12 3.6l9.6 5.2z" fill="currentColor" stroke="none"/>'
       +'<path d="M5.2 11v7.4"/><path d="M9.8 11v7.4"/>'
       +'<path d="M14.2 11v7.4"/><path d="M18.8 11v7.4"/>'
       +'<path d="M2.6 20.8h18.8"/>' },

  { key:'rcn_business', label:'Business', cat:'Institution',
    svg:'<path d="M3 8.6 4.6 4.2h14.8L21 8.6z"/>'
       +'<path d="M4.4 8.6v12h15.2v-12"/>'
       +'<path d="M9 20.6v-6.4h6v6.4"/>' },

  { key:'rcn_coop', label:'Co-op', cat:'Institution',
    svg:'<circle cx="12" cy="12" r="8.8"/>'
       +'<path d="M7.6 13.4 12 9.2l4.4 4.2"/>'
       +'<path d="M7.6 16.6 12 12.4l4.4 4.2"/>' },

  { key:'rcn_hall', label:'Meeting Hall', cat:'Institution',
    svg:'<path d="M3.2 9.6 12 4.4l8.8 5.2"/>'
       +'<path d="M4.8 11v9.6h14.4V11"/>'
       +'<circle cx="9" cy="15" r="1.5" fill="currentColor" stroke="none"/>'
       +'<circle cx="15" cy="15" r="1.5" fill="currentColor" stroke="none"/>'
       +'<path d="M7 20.6a2.6 2.6 0 0 1 4 0"/>'
       +'<path d="M13 20.6a2.6 2.6 0 0 1 4 0"/>' },

  { key:'rcn_bank', label:'Bank', cat:'Institution',
    svg:'<rect x="3.2" y="6.4" width="17.6" height="13.4" rx="1.6"/>'
       +'<circle cx="12" cy="13.1" r="3.4"/>'
       +'<path d="M3.2 10.2h17.6"/>' },

  /* ── RESOURCE ──────────────────────────────────────────────────────────── */
  { key:'rcn_money', label:'Money', cat:'Resource',
    svg:'<ellipse cx="12" cy="6.4" rx="8.4" ry="3"/>'
       +'<path d="M3.6 6.4v5.2c0 1.7 3.8 3 8.4 3s8.4-1.3 8.4-3V6.4"/>'
       +'<path d="M3.6 11.6v5.2c0 1.7 3.8 3 8.4 3s8.4-1.3 8.4-3v-5.2"/>' },

  // Open-end spanner. The jaw is a wide C with a square notch cut out of it —
  // the previous drawing closed the jaw to a small arc and read as a syringe
  // at 13px. Silhouette test: head at top-right, straight handle to bottom-left.
  { key:'rcn_work', label:'Work', cat:'Resource',
    svg:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9L6.7 20.3a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8z"/>' },

  { key:'rcn_energy', label:'Energy', cat:'Resource',
    svg:'<path d="M13.6 2.4 5 13.6h6L10.4 21.6 19 10.4h-6z" fill="currentColor" stroke="none"/>' },

  { key:'rcn_food', label:'Food', cat:'Resource',
    svg:'<path d="M3 11.4h18a9 9 0 0 1-18 0z"/>'
       +'<path d="M2 20.4h20"/>'
       +'<path d="M9 7.6c0-1.6 1.2-2.2 1.2-3.6"/>'
       +'<path d="M14 7.6c0-1.6 1.2-2.2 1.2-3.6"/>' },

  { key:'rcn_transport', label:'Transport', cat:'Resource',
    svg:'<path d="M2.6 15.4V9.6l3-4h9.8l3 4v5.8"/>'
       +'<path d="M2.6 15.4h15.8"/>'
       +'<path d="M5.6 9.6h9.8"/>'
       +'<circle cx="6.4" cy="17.8" r="2.2"/>'
       +'<circle cx="15.4" cy="17.8" r="2.2"/>' },

  { key:'rcn_information', label:'Information', cat:'Resource',
    svg:'<path d="M5.2 2.8h9l4.6 4.6v13.8H5.2z"/>'
       +'<path d="M14 2.8v5h4.6"/>'
       +'<path d="M8.2 12.4h7.4"/><path d="M8.2 15.8h7.4"/>' },

  /* ── CARE ──────────────────────────────────────────────────────────────── */
  { key:'rcn_health', label:'Health', cat:'Care',
    svg:'<path d="M12 20.6C6.4 16.2 2.6 13 2.6 9.2a4.9 4.9 0 0 1 9.4-1.9 4.9 4.9 0 0 1 9.4 1.9c0 3.8-3.8 7-9.4 11.4z" fill="currentColor" stroke="none"/>' },

  { key:'rcn_mental_health', label:'Mental Health', cat:'Care',
    svg:'<path d="M17.6 20.6v-3.4a7.6 7.6 0 1 0-11-6.8v2.8H4.4l1.6 3.2h1.6v4.2z"/>'
       +'<path d="M13.6 8.4a2.4 2.4 0 1 0-3.4 2.2v2"/>' },

  { key:'rcn_medicine', label:'Medicine', cat:'Care',
    svg:'<rect x="1.8" y="8.4" width="20.4" height="7.2" rx="3.6" transform="rotate(-38 12 12)"/>'
       +'<path d="M8.6 15.4 15.4 8.6"/>' },

  { key:'rcn_care_plan', label:'Care Plan', cat:'Care',
    svg:'<path d="M5 2.8h14v18.4H5z"/>'
       +'<path d="M12 17.4c-2.9-2.3-4.8-3.9-4.8-5.9a2.6 2.6 0 0 1 4.8-1 2.6 2.6 0 0 1 4.8 1c0 2-1.9 3.6-4.8 5.9z" fill="currentColor" stroke="none"/>'
       +'<path d="M8.4 6.2h7.2"/>' },

  { key:'rcn_support_network', label:'Support Network', cat:'Care',
    svg:'<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>'
       +'<circle cx="12" cy="3.4" r="2.2"/>'
       +'<circle cx="20" cy="8.4" r="2.2"/>'
       +'<circle cx="17" cy="19" r="2.2"/>'
       +'<circle cx="7" cy="19" r="2.2"/>'
       +'<circle cx="4" cy="8.4" r="2.2"/>'
       +'<path d="M12 9V5.6"/><path d="M14.6 10.6 18.1 9.6"/>'
       +'<path d="M13.6 14.6 15.9 17"/><path d="M10.4 14.6 8.1 17"/>'
       +'<path d="M9.4 10.6 5.9 9.6"/>' },

  { key:'rcn_shelter', label:'Shelter', cat:'Care',
    svg:'<path d="M12 2.6 3.4 6.2v5.6c0 5 3.7 9 8.6 10.2 4.9-1.2 8.6-5.2 8.6-10.2V6.2z"/>'
       +'<circle cx="12" cy="10.4" r="2" fill="currentColor" stroke="none"/>'
       +'<path d="M8.4 17.4a3.8 3.8 0 0 1 7.2 0"/>' },

  /* ── HARM ──────────────────────────────────────────────────────────────── */
  { key:'rcn_harm', label:'Harm', cat:'Harm',
    svg:'<path d="M12 3 1.8 20.8h20.4z"/>'
       +'<path d="M12 9.4v5"/>'
       +'<circle cx="12" cy="17.6" r="1.3" fill="currentColor" stroke="none"/>' },

  { key:'rcn_incarceration', label:'Incarceration', cat:'Harm',
    svg:'<rect x="3" y="3" width="18" height="18" rx="1.4"/>'
       +'<path d="M8 3v18"/><path d="M12 3v18"/><path d="M16 3v18"/>' },

  { key:'rcn_trauma', label:'Trauma', cat:'Harm',
    svg:'<path d="M12 20.6C6.4 16.2 2.6 13 2.6 9.2a4.9 4.9 0 0 1 9.4-1.9 4.9 4.9 0 0 1 9.4 1.9c0 3.8-3.8 7-9.4 11.4z"/>'
       +'<path d="M12 5.6 9.6 10.4h4.4l-2.6 5.2" fill="none"/>' },

  { key:'rcn_displacement', label:'Displacement', cat:'Harm',
    svg:'<path d="M2.4 10.6 9 5l6.6 5.6"/>'
       +'<path d="M4 9.6v10.8h10V9.6"/>'
       +'<path d="M16.4 15.4h5.4"/>'
       +'<path d="M19.2 12.8 21.8 15.4 19.2 18"/>' },

  { key:'rcn_scarcity', label:'Scarcity', cat:'Harm',
    svg:'<path d="M4.4 5.4h15.2l-2 15.2H6.4z"/>'
       +'<path d="M6.2 17.2h11.6"/>'
       +'<path d="M8.6 9.4l6.8 5"/><path d="M15.4 9.4l-6.8 5"/>' },

  { key:'rcn_conflict', label:'Conflict', cat:'Harm',
    svg:'<path d="M2.6 6.4h6.2"/><path d="M6.2 3.8 8.8 6.4 6.2 9"/>'
       +'<path d="M21.4 6.4h-6.2"/><path d="M17.8 3.8 15.2 6.4l2.6 2.6"/>'
       +'<path d="M12 12.4 8.6 17h3.4l-1 4.6 4-6h-3.4z" fill="currentColor" stroke="none"/>' },

  /* ── PROCESS ───────────────────────────────────────────────────────────── */
  { key:'rcn_action', label:'Action', cat:'Process',
    svg:'<path d="M3 4.6h11.6l6 7.4-6 7.4H3l6-7.4z" fill="currentColor" stroke="none"/>' },

  { key:'rcn_decision', label:'Decision', cat:'Process',
    svg:'<path d="M12 21V11.4"/>'
       +'<path d="M12 11.4 5 5.4"/><path d="M12 11.4 19 5.4"/>'
       +'<circle cx="4.2" cy="4.2" r="2.4" fill="currentColor" stroke="none"/>'
       +'<circle cx="19.8" cy="4.2" r="2.4" fill="currentColor" stroke="none"/>' },

  { key:'rcn_agreement', label:'Agreement', cat:'Process',
    svg:'<path d="M2.4 9.6 6 6.6l4.4 3.4h3.2L18 6.6l3.6 3"/>'
       +'<path d="M6 6.6v8.2l6 4.6 6-4.6V6.6"/>'
       +'<path d="M9.4 13.4h5.2"/>' },

  { key:'rcn_question', label:'Question', cat:'Process',
    svg:'<circle cx="12" cy="12" r="9"/>'
       +'<path d="M9.2 9.4a2.9 2.9 0 0 1 5.6 1c0 2-2.8 2.4-2.8 4.2"/>'
       +'<circle cx="12" cy="17.6" r="1.2" fill="currentColor" stroke="none"/>' },

  { key:'rcn_goal', label:'Goal', cat:'Process',
    svg:'<circle cx="12" cy="12" r="9"/>'
       +'<circle cx="12" cy="12" r="5.2"/>'
       +'<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>' },

  { key:'rcn_time', label:'Time', cat:'Process',
    svg:'<circle cx="12" cy="12" r="9"/>'
       +'<path d="M12 6.4V12l4 2.6"/>' },

  /* ── SYSTEM ────────────────────────────────────────────────────────────── */
  { key:'rcn_loop', label:'Feedback Loop', cat:'System',
    svg:'<path d="M20.2 12a8.2 8.2 0 1 1-2.6-6"/>'
       +'<path d="M17.8 2.2v4.2h-4.2"/>' },

  { key:'rcn_stock', label:'Stock', cat:'System',
    svg:'<path d="M4 3.4v17.2h16V3.4"/>'
       +'<path d="M4 12.6h16"/>'
       +'<path d="M4 12.6h16v8H4z" fill="currentColor" stroke="none"/>' },

  { key:'rcn_boundary', label:'Boundary', cat:'System',
    svg:'<path d="M6.6 19.4a4.6 4.6 0 0 1-.6-9.2 6.2 6.2 0 0 1 11.9-1.6 4.4 4.4 0 0 1 .5 8.7z"/>' },

  { key:'rcn_power', label:'Power', cat:'System',
    svg:'<path d="M7.4 21v-6.6a3.4 3.4 0 0 1 .8-2.2V6.4a1.7 1.7 0 0 1 3.4 0v3.8"/>'
       +'<path d="M11.6 10.2V8a1.7 1.7 0 0 1 3.4 0v2.4"/>'
       +'<path d="M15 10.4V9a1.7 1.7 0 0 1 3.4 0v6a6 6 0 0 1-1.2 3.6V21"/>' },

  { key:'rcn_trust', label:'Trust', cat:'System',
    svg:'<circle cx="8.6" cy="12" r="6"/>'
       +'<circle cx="15.4" cy="12" r="6"/>' },

  { key:'rcn_possibility', label:'Possibility', cat:'System',
    svg:'<path d="M9 18.4a6.6 6.6 0 1 1 6 0"/>'
       +'<path d="M9.4 18.4h5.2v2.2H9.4z"/>'
       +'<path d="M10.4 21.6h3.2"/>' },

  // Software that runs: a gear. A machine that does something on its own is
  // what people already read a cog as; the first draft was a terminal prompt
  // (>_), which only programmers parse. The first icon for the toolset itself
  // rather than the neighbourhood — needed the moment a drawing shows the tools
  // as parts (loaders, api.py, the table, a plugin). Distinct from Work (labour,
  // the wrench) and Action (a thing to do). Eight teeth, generated, not traced.
  { key:'rcn_program', label:'Program', cat:'System',
    svg:'<path d="M19.6 12.0 L19.2 14.5 L21.4 15.9 L19.7 18.7 L17.4 17.4 L17.4 17.4 L15.3 18.8 L15.9 21.4 L12.6 22.2 L12.0 19.6 L12.0 19.6 L9.5 19.2 L8.1 21.4 L5.3 19.7 L6.6 17.4 L6.6 17.4 L5.2 15.3 L2.6 15.9 L1.8 12.6 L4.4 12.0 L4.4 12.0 L4.8 9.5 L2.6 8.1 L4.3 5.3 L6.6 6.6 L6.6 6.6 L8.7 5.2 L8.1 2.6 L11.4 1.8 L12.0 4.4 L12.0 4.4 L14.5 4.8 L15.9 2.6 L18.7 4.3 L17.4 6.6 L17.4 6.6 L18.8 8.7 L21.4 8.1 L22.2 11.4 L19.6 12.0z"/>'
       +'<circle cx="12" cy="12" r="3.2"/>' }
];

/* Convenience: look up one icon by key. Returns null if absent. */
function rcnIcon(key){
  for (var i = 0; i < RCN_ICONS.length; i++) {
    if (RCN_ICONS[i].key === key) return RCN_ICONS[i];
  }
  return null;
}

/* Convenience: icons in one category, in declaration order. */
function rcnIconsByCat(cat){
  return RCN_ICONS.filter(function(ic){ return ic.cat === cat; });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RCN_ICONS: RCN_ICONS, RCN_ICON_CATS: RCN_ICON_CATS,
                     RCN_ICON_LIBRARY_VERSION: RCN_ICON_LIBRARY_VERSION,
                     rcnIcon: rcnIcon, rcnIconsByCat: rcnIconsByCat };
}
