/* wiki-plugin-mechblocks 0.1.0 — includes Ward Cunningham's Mech interpreter (MIT), see vendor/mech */
(() => {
  // src/mech-shim.mjs
  var uniq = (value, index, self) => self.indexOf(value) === index;
  var delay = (time) => new Promise((res) => setTimeout(res, time));
  var asSlug = (title) => title.replace(/\s/g, "-").replace(/[^A-Za-z0-9-]/g, "").toLowerCase();

  // vendor/mech/graph/cypher.js
  function parse(text, log = () => {
  }) {
    const r = {}, x2 = {};
    let left = "", right = text;
    let branch = [];
    const tree2 = [branch];
    r.match = () => x2.sp() && x2.term("match") && x2.node() && x2.chain() && x2.eot();
    r.node = () => x2.ch("(") && x2.elem() && x2.ch(")");
    r.chain = () => any(() => x2.rel() && x2.node() && x2.chain());
    r.rel = () => one(
      () => x2.in(),
      () => x2.out(),
      () => x2.both()
    );
    r.in = () => x2.term("<-") && opt(() => x2.ch("[") && x2.elem() && x2.ch("]")) && x2.ch("-");
    r.out = () => x2.ch("-") && opt(() => x2.ch("[") && x2.elem() && x2.ch("]")) && x2.term("->");
    r.both = () => x2.ch("-") && opt(() => x2.ch("[") && x2.elem() && x2.ch("]")) && x2.ch("-");
    r.elem = () => opt(() => x2.bind()) && opt(() => x2.ch(":") && x2.type()) && opt(() => x2.prop());
    r.prop = () => x2.ch("{") && x2.word() && x2.ch(":") && x2.expr() && x2.ch("}");
    r.expr = () => x2.strn();
    r.bind = () => x2.word();
    r.type = () => x2.word();
    r.word = () => match(/^[A-Za-z][A-Za-z0-9_]*/) && x2.sp();
    r.term = (want) => right.startsWith(want) && accept(want.length) && keep(want) && x2.sp();
    r.strn = () => x2.ch('"') && match(/^[^"]{0,20}/) && x2.ch('"') && x2.sp();
    r.ch = (char) => right.startsWith(char) && accept(1) && keep(char) && x2.sp();
    r.sp = () => match(/^\s*/);
    r.eot = () => !right.length;
    for (const op in r) {
      x2[op] = (...args) => {
        log(`${left}%c${op}%c${right}`, "color:red", "color:black");
        const here = branch;
        branch = [op];
        const success = r[op](...args);
        if (success) here.push(branch);
        branch = here;
        return success;
      };
    }
    function match(regex) {
      const m = right.match(regex);
      m && accept(m[0].length) && keep(m[0]);
      return !!m;
    }
    function keep(text2) {
      branch.push(text2);
      return true;
    }
    function accept(n) {
      left += right.substring(0, n);
      right = right.substring(n);
      return true;
    }
    function any(rule) {
      const save = [left, right];
      if (rule()) {
        any(rule);
      } else {
        ;
        [left, right] = save;
      }
      return true;
    }
    function opt(rule) {
      const save = [left, right];
      if (!rule()) {
        ;
        [left, right] = save;
      }
      return true;
    }
    function one(...rules) {
      const save = [left, right];
      for (const rule of rules) {
        if (rule()) {
          return true;
        }
        ;
        [left, right] = save;
      }
      false;
    }
    x2.match();
    return tree2;
  }
  function gen(level, tree2, code, log = () => {
  }) {
    const tab = () => " |".repeat(level);
    switch (tree2[0]) {
      case "sp":
      case "ch":
      case "term":
        break;
      case "bind":
      case "type":
        log(tab(), tree2[0], `"${tree2[1][1]}"`);
        code[tree2[0]] = tree2[1][1];
        break;
      case "prop":
        log(tab(), tree2[0], `"${tree2[2][1]}"`, tree2[4][1][2]);
        code[tree2[0]] = [tree2[2][1], tree2[4][1][2]];
        break;
      case "node":
      case "rel":
      case "chain":
        log(tab(), tree2[0]);
        {
          const sub = {};
          code[tree2[0]] = sub;
          for (const branch of tree2.slice(1)) gen(level + 1, branch, sub, log);
        }
        break;
      case "in":
      case "out":
      case "both":
        log(tab(), tree2[0]);
        code["dir"] = tree2[0];
        for (const branch of tree2.slice(1)) gen(level + 1, branch, code, log);
        break;
      case "match":
      case "elem":
        log(tab(), tree2[0]);
        for (const branch of tree2.slice(1)) gen(level + 1, branch, code, log);
        break;
      case "eot":
        log(tab(), "end");
        break;
      default:
        log(tab(), "unknown", tree2[0]);
    }
    return code;
  }
  function check(tally, code, errors) {
    if (code?.node?.type && errors) {
      if (!tally.nodes[code.node.type]) {
        errors.push(`No node of type "${code.node.type}" in the graph.`);
      }
    }
    if (code?.rel?.type && errors) {
      if (!tally.rels[code.rel.type]) {
        errors.push(`No relation of type "${code.rel.type}" in the graph.`);
      }
    }
    if (Object.keys(code.chain).length) {
      check(tally, code.chain, errors);
    }
  }
  function apply(graph, code) {
    const nodes = graph.nodes;
    const rels = graph.rels;
    const results = [];
    for (const node of nodes) {
      chain(node, code, {});
    }
    return results;
    function chain(node, code2, maybe) {
      if ((!code2.node.type || node.type == code2.node.type) && (!code2.node.prop || node.props[code2.node.prop[0]] == code2.node.prop[1])) {
        if (code2.node.bind) maybe[code2.node.bind] = node;
        if (code2.chain.rel) {
          if (["in", "both"].includes(code2.chain.rel.dir)) links(node.in, "from");
          if (["out", "both"].includes(code2.chain.rel.dir)) links(node.out, "to");
        } else {
          results.push(maybe);
        }
      }
      function links(rids, dir) {
        rids.forEach((rid) => {
          if ((!code2.chain.rel.type || rels[rid].type == code2.chain.rel.type) && (!code2.chain.rel.prop || rels[rid].props[code2.chain.rel.prop[0]] == code2.chain.rel.prop[1])) {
            maybe = { ...maybe };
            if (code2.chain.rel.bind) maybe[code2.chain.rel.bind] = rels[rid];
            chain(nodes[rels[rid][dir]], code2.chain, maybe);
          }
        });
      }
    }
  }

  // vendor/mech/graph/graph.js
  var uniq2 = (value, index, self) => self.indexOf(value) === index;
  var Graph = class _Graph {
    constructor(nodes = [], rels = []) {
      this.nodes = nodes;
      this.rels = rels;
    }
    addNode(type, props = {}) {
      const obj = { type, in: [], out: [], props };
      this.nodes.push(obj);
      return this.nodes.length - 1;
    }
    addUniqNode(type, props = {}) {
      const nid = this.nodes.findIndex((node) => node.type == type && node.props?.name == props?.name);
      return nid >= 0 ? nid : this.addNode(type, props);
    }
    addRel(type, from, to, props = {}) {
      if (from == null || to == null) return null;
      const obj = { type, from, to, props };
      this.rels.push(obj);
      const rid = this.rels.length - 1;
      this.nodes[from].out.push(rid);
      this.nodes[to].in.push(rid);
      return rid;
    }
    tally() {
      const tally = (list) => list.reduce((s, e) => {
        s[e.type] = s[e.type] ? s[e.type] + 1 : 1;
        return s;
      }, {});
      return { nodes: tally(this.nodes), rels: tally(this.rels) };
    }
    size() {
      return this.nodes.length + this.rels.length;
    }
    static load(obj) {
      return new _Graph(obj.nodes, obj.rels);
    }
    static async fetch(url) {
      const obj = await fetch(url).then((res) => res.json());
      return _Graph.load(obj);
    }
    static async read(path) {
      const json = await Deno.readTextFile(path);
      const obj = JSON.parse(json);
      return _Graph.load(obj);
    }
    // static async import(path) {
    //   let module = await import(path, {assert: {type: "json"}})
    //   return Graph.load(module.default)
    // }
    copy(nid, output) {
      const doing = {};
      const done = [];
      const nodecopy = (nid2) => {
        if (nid2 in doing) return;
        done.push(nid2);
        const node = this.nodes[nid2];
        doing[nid2] = output.addNode(node.type, node.props);
        for (const rid of node.out) nodecopy(this.rels[rid].to);
        for (const rid of node.in) nodecopy(this.rels[rid].from);
        for (const rid of node.out) output.addRel("", doing[nid2], doing[this.rels[rid].to], {});
      };
      nodecopy(nid);
      return done;
    }
    clusters() {
      const result = [];
      const todo = [...this.nodes.keys()];
      const doit = (nid) => {
        const graph = new _Graph();
        const done = this.copy(nid, graph);
        for (const nid2 of done) {
          const index = todo.indexOf(nid2);
          todo.splice(index, 1);
        }
        return graph;
      };
      while (todo.length) {
        result.push(doit(todo[0]));
      }
      return result;
    }
    n(type = null, props = {}) {
      let nids = Object.keys(this.nodes).map((key) => +key);
      if (type) nids = nids.filter((nid) => this.nodes[nid].type == type);
      for (const key in props) nids = nids.filter((nid) => this.nodes[nid].props[key] == props[key]);
      return new Nodes(this, nids);
    }
    /**
     * Converts a graph to a JavaScript Object Notation (JSON) string using JSON.stringify.
     @param - replacer A function that transforms the results.
     @param - space Adds indentation, white space, and line break characters to the return-
     * @returns {string} JSON string containing serialized graph
    */
    stringify(...args) {
      const obj = { nodes: this.nodes, rels: this.rels };
      return JSON.stringify(obj, ...args);
    }
    search(query, opt = {}) {
      const tree2 = parse(query);
      const code = gen(0, tree2[0][0], {});
      check(this.tally(), code, opt.errors);
      return apply(this, code);
    }
  };
  var Nodes = class _Nodes {
    constructor(graph, nids) {
      this.graph = graph;
      this.nids = nids;
    }
    // n(type=null, props={}) {
    //   // console.log('Nodes.n',{type,props})
    //   let nids = this.nids
    //   if (type) nids = nids.filter(nid => this.nodes[nid].type == type)
    //   for (let key in props) nids = nids.filter(nid => this.nodes[nid].props[key] == props[key])
    //   return new Nodes(this.graph, type, nids)
    // }
    i(type = null, props = {}) {
      let rids = this.nids.map((nid) => this.graph.nodes[nid].in).flat().filter(uniq2);
      if (type) rids = rids.filter((rid) => this.graph.rels[rid].type == type);
      for (const key in props) rids = rids.filter((rid) => this.graph.rels[rid].props[key] == props[key]);
      return new Rels(this.graph, rids);
    }
    o(type = null, props = {}) {
      let rids = this.nids.map((nid) => this.graph.nodes[nid].out).flat().filter(uniq2);
      if (type) rids = rids.filter((rid) => this.graph.rels[rid].type == type);
      for (const key in props) rids = rids.filter((rid) => this.graph.rels[rid].props[key] == props[key]);
      return new Rels(this.graph, rids);
    }
    props(key = "name") {
      return this.nids.map((nid) => this.graph.nodes[nid].props[key]).filter(uniq2).sort();
    }
    types() {
      return this.nids.map((nid) => this.graph.nodes[nid].type).filter(uniq2).sort();
    }
    tally() {
      const tally = (list) => list.reduce((s, e) => {
        s[e.type] = s[e.type] ? s[e.type] + 1 : 1;
        return s;
      }, {});
      return { nodes: tally(this.nids.map((nid) => this.graph.nodes[nid])) };
    }
    size() {
      return this.nids.length;
    }
    filter(f) {
      const nodes = this.graph.nodes;
      const nids = this.nids.filter((nid) => {
        const node = nodes[nid];
        return f(node.type, node.props);
      });
      return new _Nodes(this.graph, nids);
    }
    map(f) {
      const nodes = this.graph.nodes;
      const result = this.nids.map((nid) => {
        const node = nodes[nid];
        return f(node);
      });
      return result;
    }
  };
  var Rels = class _Rels {
    constructor(graph, rids) {
      this.graph = graph;
      this.rids = rids;
    }
    f(type = null, props = {}) {
      let nids = this.rids.map((rid) => this.graph.rels[rid].from).filter(uniq2);
      if (type) nids = nids.filter((nid) => this.graph.nodes[nid].type == type);
      for (const key in props) nids = nids.filter((nid) => this.graph.nodes[nid].props[key] == props[key]);
      return new Nodes(this.graph, nids);
    }
    t(type = null, props = {}) {
      let nids = this.rids.map((rid) => this.graph.rels[rid].to).filter(uniq2);
      if (type) nids = nids.filter((nid) => this.graph.nodes[nid].type == type);
      for (const key in props) nids = nids.filter((nid) => this.graph.nodes[nid].props[key] == props[key]);
      return new Nodes(this.graph, nids);
    }
    props(key = "name") {
      return this.rids.map((rid) => this.graph.rels[rid].props[key]).filter(uniq2).sort();
    }
    types() {
      return this.rids.map((rid) => this.graph.rels[rid].type).filter(uniq2).sort();
    }
    tally() {
      const tally = (list) => list.reduce((s, e) => {
        s[e.type] = s[e.type] ? s[e.type] + 1 : 1;
        return s;
      }, {});
      return { rels: tally(this.rids.map((nid) => this.graph.rels[nid])) };
    }
    size() {
      return this.rids.length;
    }
    filter(f) {
      const rels = this.graph.rels;
      const rids = this.rids.filter((rid) => {
        const rel = rels[rid];
        return f(rel.type, rel.props);
      });
      return new _Rels(this.graph, rids);
    }
    map(f) {
      const rels = this.graph.rels;
      const result = this.rids.map((rid) => {
        const rel = rels[rid];
        return f(rel);
      });
      return result;
    }
  };

  // node_modules/marked/lib/marked.esm.js
  function I() {
    return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
  }
  var y = I();
  function W(l3) {
    y = l3;
  }
  var A = { exec: () => null };
  function C(l3) {
    let e = [];
    return (t) => {
      let n = Math.max(0, Math.min(3, t - 1)), s = e[n];
      return s || (s = l3(n), e[n] = s), s;
    };
  }
  function h(l3, e = "") {
    let t = typeof l3 == "string" ? l3 : l3.source, n = { replace: (s, r) => {
      let o = typeof r == "string" ? r : r.source;
      return o = o.replace(x.caret, "$1"), t = t.replace(s, o), n;
    }, getRegex: () => new RegExp(t, e) };
    return n;
  }
  var _e = ((l3 = "") => {
    try {
      return !!new RegExp("(?<=1)(?<!1)" + l3);
    } catch {
      return false;
    }
  })();
  var x = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l3) => new RegExp(`^( {0,3}${l3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: C((l3) => new RegExp(`^ {0,${l3}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: C((l3) => new RegExp(`^ {0,${l3}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: C((l3) => new RegExp(`^ {0,${l3}}(?:\`\`\`|~~~)`)), headingBeginRegex: C((l3) => new RegExp(`^ {0,${l3}}#`)), htmlBeginRegex: C((l3) => new RegExp(`^ {0,${l3}}(?:</?(?:${N})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: C((l3) => new RegExp(`^ {0,${l3}}>`)) };
  var $e = /^(?:[ \t]*(?:\n|$))+/;
  var Le = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var ze = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var G = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var Ae = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var J = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
  var ce = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var he = h(ce).replace(/bull/g, J).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var Ee = h(ce).replace(/bull/g, J).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var V = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/;
  var Me = /^[^\n]+/;
  var Y = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
  var Ie = h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Y).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var Ce = h(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, J).getRegex();
  var N = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var ee = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var Be = h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", ee).replace("tag", N).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var de = (l3) => h(V).replace("hr", G).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", l3).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex();
  var De = de(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/);
  var qe = de(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/);
  var ve = h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", qe).getRegex();
  var te = { blockquote: ve, code: Le, def: Ie, fences: ze, heading: Ae, hr: G, html: Be, lheading: he, list: Ce, newline: $e, paragraph: De, table: A, text: Me };
  var le = h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", G).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex();
  var Ze = { ...te, lheading: Ee, table: le, paragraph: h(V).replace("hr", G).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", le).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex() };
  var He = { ...te, html: h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", ee).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: A, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: h(V).replace("hr", G).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", he).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
  var Ge = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var Ne = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var ke = /^( {2,}|\\)\n(?!\s*$)[ \t]*/;
  var Qe = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var $2 = /[\p{P}\p{S}]/u;
  var B = /[\s\p{P}\p{S}]/u;
  var Q = /[^\s\p{P}\p{S}]/u;
  var je = h(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, B).getRegex();
  var Fe = /[\p{Pi}\p{Ps}"']/u;
  var ge = /(?!~)[\p{P}\p{S}]/u;
  var Ue = /(?!~)[\s\p{P}\p{S}]/u;
  var Ke = /(?:[^\s\p{P}\p{S}]|~)/u;
  var We = h(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", _e ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
  var fe = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
  var Xe = h(fe, "u").replace(/punct/g, $2).getRegex();
  var Je = h(fe, "u").replace(/punct/g, ge).getRegex();
  var Ve = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/;
  var Ye = h(Ve, "u").replace(/openQuote/g, Fe).replace(/punct/g, $2).getRegex();
  var me = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var et = h(me, "gu").replace(/notPunctSpace/g, Q).replace(/punctSpace/g, B).replace(/punct/g, $2).getRegex();
  var tt = h(me, "gu").replace(/notPunctSpace/g, Ke).replace(/punctSpace/g, Ue).replace(/punct/g, ge).getRegex();
  var nt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)";
  var rt = h(nt, "gu").replace(/notPunctSpace/g, Q).replace(/punctSpace/g, B).replace(/punct/g, $2).getRegex();
  var st = h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Q).replace(/punctSpace/g, B).replace(/punct/g, $2).getRegex();
  var it = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)";
  var ot = h(it, "gu").replace(/notPunctSpace/g, Q).replace(/punctSpace/g, B).replace(/punct/g, $2).getRegex();
  var at = h(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, $2).getRegex();
  var lt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
  var ut = h(lt, "gu").replace(/notPunctSpace/g, Q).replace(/punctSpace/g, B).replace(/punct/g, $2).getRegex();
  var pt = h(/\\(punct)/, "gu").replace(/punct/g, $2).getRegex();
  var ct = h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var ht = h(ee).replace("(?:-->|$)", "-->").getRegex();
  var dt = h("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ht).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var xe = /\[(?:\\[\s\S]|[^\[\]\\])*\]/;
  var U = h(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", xe).getRegex();
  var kt = h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", U).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var gt = h(/^!?\[(label)\]\[(ref)\]/).replace("label", U).replace("ref", Y).getRegex();
  var ft = h(/^!?\[(ref)\](?:\[\])?/).replace("ref", Y).getRegex();
  var ue = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/;
  var mt = h(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", xe).getRegex();
  var xt = h("reflink|nolink(?!\\()", "g").replace("reflink", h(/^!?\[(label)\]\[(ref)\]/).replace("label", mt).replace("ref", ue).getRegex()).replace("nolink", h(/^!?\[(ref)\](?:\[\])?/).replace("ref", ue).getRegex()).getRegex();
  var pe = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
  var bt = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/;
  var Rt = h(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, bt).getRegex();
  var ne = { _backpedal: A, anyPunctuation: pt, autolink: ct, blockSkip: We, br: ke, code: Ne, del: A, delLDelim: A, delRDelim: A, emStrongLDelim: Xe, emStrongRDelimAst: et, emStrongRDelimUnd: st, escape: Ge, link: kt, nolink: ft, punctuation: je, reflink: gt, reflinkSearch: xt, tag: dt, text: Qe, url: A };
  var Tt = { ...ne, emStrongLDelim: Ye, emStrongRDelimAst: rt, emStrongRDelimUnd: ot, link: h(/^!?\[(label)\]\((.*?)\)/).replace("label", U).getRegex(), reflink: h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", U).getRegex() };
  var X = { ...ne, emStrongRDelimAst: tt, emStrongLDelim: Je, delLDelim: at, delRDelim: ut, url: h(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Rt).replace("protocol", pe).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: h(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", pe).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() };
  var Ot = { ...X, br: h(ke).replace("{2,}", "*").getRegex(), text: h(X.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
  var j = { normal: te, gfm: Ze, pedantic: He };
  var D = { normal: ne, gfm: X, breaks: Ot, pedantic: Tt };
  var wt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  var be = (l3) => wt[l3];
  function O(l3, e) {
    if (e) {
      if (x.escapeTest.test(l3)) return l3.replace(x.escapeReplace, be);
    } else if (x.escapeTestNoEncode.test(l3)) return l3.replace(x.escapeReplaceNoEncode, be);
    return l3;
  }
  function Re(l3) {
    return l3.replace(x.numericCharacterReference, (e, t, n) => {
      let s = t === void 0 ? Number.parseInt(n, 16) : Number.parseInt(t, 10);
      return s === 0 || s > 1114111 || s >= 55296 && s <= 57343 ? "\uFFFD" : String.fromCodePoint(s);
    });
  }
  function re(l3) {
    try {
      l3 = encodeURI(l3).replace(x.percentDecode, "%");
    } catch {
      return null;
    }
    return l3;
  }
  function se(l3, e) {
    let t = l3.replace(x.findPipe, (r, o, i) => {
      let u = false, a = o;
      for (; --a >= 0 && i[a] === "\\"; ) u = !u;
      return u ? "|" : " |";
    }), n = t.split(x.splitPipe), s = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
    else for (; n.length < e; ) n.push("");
    for (; s < n.length; s++) n[s] = n[s].trim().replace(x.slashPipe, "|");
    return n;
  }
  function L(l3, e, t) {
    let n = l3.length;
    if (n === 0) return "";
    let s = 0;
    for (; s < n; ) {
      let r = l3.charAt(n - s - 1);
      if (r === e && !t) s++;
      else if (r !== e && t) s++;
      else break;
    }
    return l3.slice(0, n - s);
  }
  function ie(l3) {
    let e = l3.split(`
`), t = e.length - 1;
    for (; t >= 0 && x.blankLine.test(e[t]); ) t--;
    return e.length - t <= 2 ? l3 : e.slice(0, t + 1).join(`
`);
  }
  function q(l3) {
    return l3.trim().toLowerCase().toUpperCase().toLowerCase();
  }
  function Te(l3, e) {
    if (l3.indexOf(e[1]) === -1) return -1;
    let t = 0;
    for (let n = 0; n < l3.length; n++) if (l3[n] === "\\") n++;
    else if (l3[n] === e[0]) t++;
    else if (l3[n] === e[1] && (t--, t < 0)) return n;
    return t > 0 ? -2 : -1;
  }
  function oe(l3, e = 0) {
    let t = e, n = "";
    for (let s of l3) if (s === "	") {
      let r = 4 - t % 4;
      n += " ".repeat(r), t += r;
    } else n += s, t++;
    return n;
  }
  function Oe(l3, e, t, n, s) {
    let r = e.href, o = e.title || null, i = l3[1].replace(s.other.outputLinkReplace, "$1"), u = l3[0].charAt(0) === "!";
    n.state.inLink = true;
    let a = n.state.linkEmitted, p = n.state.inRawBlock;
    n.state.linkEmitted = false;
    let c = n.inlineTokens(i), d = n.state.linkEmitted;
    if (n.state.linkEmitted = a, n.state.inLink = false, !u) {
      if (d) {
        n.state.inRawBlock = p;
        return;
      }
      n.state.linkEmitted = true;
    }
    return { type: u ? "image" : "link", raw: t, href: r, title: o, text: i, tokens: c };
  }
  function yt(l3, e, t) {
    let n = l3.match(t.other.indentCodeCompensation);
    if (n === null) return e;
    let s = n[1];
    return e.split(`
`).map((r) => {
      let o = r.match(t.other.beginningSpace);
      if (o === null) return r;
      let [i] = o;
      return r.slice(Math.min(i.length, s.length));
    }).join(`
`);
  }
  function we(l3, e, t, n) {
    if (!e.includes("<")) return false;
    for (let s = 0; s < e.length; s++) {
      if (e[s] === "\\") {
        s++;
        continue;
      }
      if (e[s] === "`") {
        let i = n.inline.code.exec(e.slice(s));
        if (i) {
          s += i[0].length - 1;
          continue;
        }
      }
      if (e[s] !== "<") continue;
      let r = l3.slice(t + s), o = n.inline.tag.exec(r) || n.inline.autolink.exec(r);
      if (o) {
        if (o[0].length > e.length - s) return true;
        s += o[0].length - 1;
      }
    }
    return false;
  }
  var P = class {
    options;
    rules;
    lexer;
    constructor(e) {
      this.options = e || y;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = this.options.pedantic ? t[0] : ie(t[0]), s = n.replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: n, codeBlockStyle: "indented", text: s };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0], s = yt(n, t[3] || "", this.rules);
        return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: s };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let s = L(n, "#");
          (this.options.pedantic || !s || this.rules.other.endingSpaceTabChar.test(s)) && (n = s.trim());
        }
        return { type: "heading", raw: L(t[0], `
`), depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: L(t[0], `
`) };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = L(t[0], `
`).split(`
`), s = "", r = "", o = [];
        for (; n.length > 0; ) {
          let i = false, u = [], a;
          for (a = 0; a < n.length; a++) if (this.rules.other.blockquoteStart.test(n[a])) u.push(n[a]), i = true;
          else if (!i) u.push(n[a]);
          else break;
          n = n.slice(a);
          let p = u.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
          s = s ? `${s}
${p}` : p, r = r ? `${r}
${c}` : c;
          let d = this.lexer.state.top;
          if (this.lexer.state.top = true, this.lexer.blockTokens(c, o, true), this.lexer.state.top = d, n.length === 0) break;
          let m = o.at(-1);
          if (m?.type === "code") break;
          if (m?.type === "blockquote") {
            let b = m, g = n.join(`
`), w = b.raw + `
` + g.replace(this.rules.other.blockquoteSetextReplace2, ""), f = this.blockquote(w);
            o[o.length - 1] = f;
            let M = w.substring(f.raw.length).replace(/^\n/, ""), v = M ? M.split(`
`).length : 0, Z = v ? n.slice(0, -v) : n;
            Z.length > 0 && (s = `${s}
${Z.join(`
`)}`), r = r.substring(0, r.length - b.text.length) + f.text;
            break;
          } else if (m?.type === "list") {
            let b = m, g = b.raw + `
` + n.join(`
`), w = this.list(g);
            o[o.length - 1] = w, s = s.substring(0, s.length - m.raw.length) + w.raw, r = r.substring(0, r.length - b.raw.length) + w.raw, n = g.substring(o.at(-1).raw.length).split(`
`);
            continue;
          }
        }
        return { type: "blockquote", raw: s, tokens: o, text: r };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(), s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: false, items: [] };
        n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
        let o = this.rules.other.listItemRegex(n), i = false;
        for (; e; ) {
          let a = false, p = "", c = "";
          if (!(t = o.exec(e)) || this.rules.block.hr.test(e)) break;
          p = t[0], e = e.substring(p.length);
          let d = t[2].split(`
`, 1)[0], m = t[1].length, b = this.options.pedantic ? oe(d, m) : d.replace(this.rules.other.leadingSpaceTab, (M) => oe(M, m)), g = e.split(`
`, 1)[0], w = !b.trim(), f = 0;
          if (this.options.pedantic ? (f = 2, c = b.trimStart()) : w ? f = m + 1 : (f = b.search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = b.slice(f), f += m), w && this.rules.other.blankLine.test(g) && (p += g + `
`, e = e.substring(g.length + 1), a = true), !a) {
            let M = this.rules.other.nextBulletRegex(f), v = this.rules.other.hrRegex(f), Z = this.rules.other.fencesBeginRegex(f), ae = this.rules.other.headingBeginRegex(f), ye = this.rules.other.htmlBeginRegex(f), Pe = this.rules.other.blockquoteBeginRegex(f);
            for (; e; ) {
              let K = e.split(`
`, 1)[0], H;
              if (g = K, this.options.pedantic ? (g = g.replace(this.rules.other.listReplaceNesting, "  "), H = g) : H = g.replace(this.rules.other.leadingSpaceTab, (Se) => Se.replace(this.rules.other.tabCharGlobal, "    ")), Z.test(g) || ae.test(g) || ye.test(g) || Pe.test(g) || M.test(g) || v.test(g)) break;
              if (H.search(this.rules.other.nonSpaceChar) >= f || !g.trim()) c += `
` + H.slice(f);
              else {
                if (w || b.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Z.test(b) || ae.test(b) || v.test(b)) break;
                c += `
` + g;
              }
              w = !g.trim(), p += K + `
`, e = e.substring(K.length + 1), b = H.slice(f);
            }
          }
          r.loose || (i ? r.loose = true : this.rules.other.doubleBlankLine.test(p) && (i = true)), r.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), r.raw += p;
        }
        let u = r.items.at(-1);
        if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
        else return;
        r.raw = r.raw.trimEnd();
        for (let a of r.items) if (this.lexer.state.top = false, a.tokens = this.lexer.blockTokens(a.text, []), !r.loose) {
          let p = a.tokens.filter((d) => d.type === "space"), c = p.length > 0 && p.some((d) => this.rules.other.anyLine.test(d.raw));
          r.loose = c;
        }
        for (let a of r.items) {
          let p = a.tokens[0];
          if (a.task && (p?.type === "text" || p?.type === "paragraph")) {
            a.text = a.text.replace(this.rules.other.listReplaceTask, ""), p.raw = p.raw.replace(this.rules.other.listReplaceTask, ""), p.text = p.text.replace(this.rules.other.listReplaceTask, "");
            for (let d = this.lexer.inlineQueue.length - 1; d >= 0; d--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)) {
              this.lexer.inlineQueue[d].src = this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
            let c = this.rules.other.listTaskCheckbox.exec(a.raw);
            if (c) {
              let d = { type: "checkbox", raw: c[0] + " ", checked: c[0] !== "[ ]" };
              a.checked = d.checked, r.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = d.raw + a.tokens[0].raw, a.tokens[0].text = d.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(d)) : a.tokens.unshift({ type: "paragraph", raw: d.raw, text: d.raw, tokens: [d] }) : a.tokens.unshift(d);
            }
          } else a.task && (a.task = false);
        }
        if (r.loose) for (let a of r.items) {
          a.loose = true;
          for (let p of a.tokens) p.type === "text" && (p.type = "paragraph");
        }
        return r;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t) {
        let n = ie(t[0]);
        return { type: "html", block: true, raw: n, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: n };
      }
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        let n = q(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
        return { type: "def", tag: n, raw: L(t[0], `
`), href: s, title: r };
      }
    }
    table(e) {
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
      let n = se(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = { type: "table", raw: L(t[0], `
`), header: [], align: [], rows: [] };
      if (n.length === s.length) {
        for (let i of s) this.rules.other.tableAlignRight.test(i) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? o.align.push("left") : o.align.push(null);
        for (let i = 0; i < n.length; i++) o.header.push({ text: n[i], tokens: this.lexer.inline(n[i]), header: true, align: o.align[i] });
        for (let i of r) o.rows.push(se(i, o.header.length).map((u, a) => ({ text: u, tokens: this.lexer.inline(u), header: false, align: o.align[a] })));
        return o;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t) {
        let n = t[1].trim();
        return { type: "heading", raw: L(t[0], `
`), depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
      }
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
    }
    link(e) {
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[0].charAt(0) === "!" ? 2 : 1;
        if (!this.options.pedantic && we(e, t[1], n, this.rules)) return;
        let s = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(s)) {
          if (!this.rules.other.endAngleBracket.test(s)) return;
          let i = L(s.slice(0, -1), "\\");
          if ((s.length - i.length) % 2 === 0) return;
        } else {
          let i = Te(t[2], "()");
          if (i === -2) return;
          if (i > -1) {
            let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + i;
            t[2] = t[2].substring(0, i), t[0] = t[0].substring(0, a).trim(), t[3] = "";
          }
        }
        let r = t[2], o = "";
        if (this.options.pedantic) {
          let i = this.rules.other.pedanticHrefTitle.exec(r);
          i && (r = i[1], o = i[3]);
        } else o = t[3] ? t[3].slice(1, -1) : "";
        return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? r = r.slice(1) : r = r.slice(1, -1)), Oe(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: o && o.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let s = n[0].charAt(0) === "!" ? 2 : 1;
        if (!this.options.pedantic && we(e, n[1], s, this.rules)) return;
        let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), o = t[q(r)];
        if (!o) {
          let i = n[0].charAt(0);
          return { type: "text", raw: i, text: i };
        }
        return Oe(n, o, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let s = this.rules.inline.emStrongLDelim.exec(e);
      if (!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
      if (!(s[1] || s[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let o = [...s[0]].length - 1, i, u, a = o, p = 0, c = s[0][0], d = n === c, m = c === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (m.lastIndex = 0, t = t.slice(-1 * e.length + o); (s = m.exec(t)) !== null; ) {
          if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i) continue;
          if (u = [...i].length, s[3] || s[4]) {
            a += u;
            continue;
          } else if (s[5] || s[6]) {
            if (o % 3 && !((o + u) % 3)) {
              p += u;
              continue;
            }
            if (d) break;
          }
          if (a -= u, a > 0) continue;
          u = Math.min(u, u + a + p);
          let b = [...s[0]][0].length, g = e.slice(0, o + s.index + b + u);
          if (Math.min(o, u) % 2) {
            let f = g.slice(1, -1);
            return { type: "em", raw: g, text: f, tokens: this.lexer.inlineTokens(f) };
          }
          let w = g.slice(2, -2);
          return { type: "strong", raw: g, text: w, tokens: this.lexer.inlineTokens(w) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e, t, n = "") {
      let s = this.rules.inline.delLDelim.exec(e);
      if (!s) return;
      if (!(s[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let o = [...s[0]].length - 1, i, u, a = o, p = this.rules.inline.delRDelim;
        for (p.lastIndex = 0, t = t.slice(-1 * e.length + o); (s = p.exec(t)) !== null; ) {
          if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i || (u = [...i].length, u !== o)) continue;
          if (s[3] || s[4]) {
            a += u;
            continue;
          }
          if (a -= u, a > 0) continue;
          u = Math.min(u, u + a);
          let c = [...s[0]][0].length, d = e.slice(0, o + s.index + c + u), m = d.slice(o, -o);
          return { type: "del", raw: d, text: m, tokens: this.lexer.inlineTokens(m) };
        }
      }
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, s;
        return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), { type: "link", raw: t[0], text: n, href: s, autolink: true, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    url(e) {
      let t;
      if (t = this.rules.inline.url.exec(e)) {
        let n, s;
        if (t[2] === "@") n = t[0], s = "mailto:" + n;
        else {
          let r;
          do
            r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
          while (r !== t[0]);
          n = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
        }
        return { type: "link", raw: t[0], text: n, href: s, autolink: true, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: n ? t[0] : Re(t[0]), escaped: n };
      }
    }
  };
  var R = class l {
    tokens;
    options;
    state;
    inlineQueue;
    tokenizer;
    constructor(e) {
      this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || y, this.options.tokenizer = this.options.tokenizer || new P(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, linkEmitted: false, top: true };
      let t = { other: x, block: j.normal, inline: D.normal };
      this.options.pedantic ? (t.block = j.pedantic, t.inline = D.pedantic) : this.options.gfm && (t.block = j.gfm, this.options.breaks ? t.inline = D.breaks : t.inline = D.gfm), this.tokenizer.rules = t;
    }
    static get rules() {
      return { block: j, inline: D };
    }
    static lex(e, t) {
      return new l(t).lex(e);
    }
    static lexInline(e, t) {
      return new l(t).inlineTokens(e);
    }
    lex(e) {
      e = e.replace(x.carriageReturn, `
`), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        let n = this.inlineQueue[t];
        this.inlineTokens(n.src, n.tokens);
      }
      return this.inlineQueue = [], this.tokens;
    }
    blockTokens(e, t = [], n = false) {
      this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(x.tabCharGlobal, "    ").replace(x.spaceLine, ""));
      let s = 1 / 0;
      for (; e; ) {
        if (e.length < s) s = e.length;
        else {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
        let r;
        if (this.options.extensions?.block?.some((i) => (r = i.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
        if (r = this.tokenizer.space(e)) {
          e = e.substring(r.raw.length);
          let i = t.at(-1);
          r.raw.length === 1 && i !== void 0 ? i.raw += `
` : t.push(r);
          continue;
        }
        if (r = this.tokenizer.code(e)) {
          e = e.substring(r.raw.length);
          let i = t.at(-1);
          i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + r.raw, i.text += `
` + r.text, this.inlineQueue.at(-1).src = i.text) : t.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.list(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.html(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.def(e)) {
          e = e.substring(r.raw.length);
          let i = t.at(-1);
          i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + r.raw, i.text += `
` + r.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
          continue;
        }
        if (r = this.tokenizer.table(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        let o = e;
        if (this.options.extensions?.startBlock) {
          let i = 1 / 0, u = e.slice(1), a;
          this.options.extensions.startBlock.forEach((p) => {
            a = p.call({ lexer: this }, u), typeof a == "number" && a >= 0 && (i = Math.min(i, a));
          }), i < 1 / 0 && i >= 0 && (o = e.substring(0, i + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(o))) {
          let i = t.at(-1);
          n && i?.type === "paragraph" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + r.raw, i.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : t.push(r), n = o.length !== e.length, e = e.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(e)) {
          e = e.substring(r.raw.length);
          let i = t.at(-1);
          i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + r.raw, i.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : t.push(r);
          continue;
        }
        if (e) {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
      }
      return this.state.top = true, t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    linkInText(e) {
      if (!e.includes("[")) return false;
      let t = this.tokenizer.rules.inline.link;
      for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(n[0]) && e.charAt(n.index - 1) !== "!") return true;
      for (let n of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
        let s = n[0], r = s.lastIndexOf("[");
        if (!(s.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, q(s.slice(r + 1, -1)))) && !(r > 1 && this.linkInText(s.slice(1, r - 1)))) return true;
      }
      return false;
    }
    inlineTokens(e, t = []) {
      this.tokenizer.lexer = this;
      let n = e;
      if (this.tokens.links && e.includes("[")) {
        let i = this.tokenizer.rules.inline.reflinkSearch, u = (a) => {
          let p = a.lastIndexOf("[");
          if (!Object.hasOwn(this.tokens.links, q(a.slice(p + 1, -1)))) return a;
          if (p > 1 && a.charAt(0) !== "!") {
            let c = a.slice(1, p - 1);
            if (this.linkInText(c)) return "[" + c.replace(i, u) + "][" + "a".repeat(a.length - p - 2) + "]";
          }
          return "[" + "a".repeat(a.length - 2) + "]";
        };
        n = n.replace(i, u);
      }
      n = n.replace(this.tokenizer.rules.inline.anyPunctuation, (i) => "+".repeat(i.length)), n = n.replace(this.tokenizer.rules.inline.blockSkip, (i, u, a) => {
        let p = a ? a.length : 0;
        return i.slice(0, p) + "[" + "a".repeat(i.length - p - 2) + "]";
      }), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
      let s = false, r = "", o = 1 / 0;
      for (; e; ) {
        if (e.length < o) o = e.length;
        else {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
        s || (r = ""), s = false;
        let i;
        if (this.options.extensions?.inline?.some((a) => (i = a.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), true) : false)) continue;
        if (i = this.tokenizer.escape(e)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (i = this.tokenizer.tag(e)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (i = this.tokenizer.link(e)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (i = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(i.raw.length);
          let a = t.at(-1);
          i.type === "text" && a?.type === "text" ? (a.raw += i.raw, a.text += i.text) : t.push(i);
          continue;
        }
        if (i = this.tokenizer.emStrong(e, n, r)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (i = this.tokenizer.codespan(e)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (i = this.tokenizer.br(e)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (i = this.tokenizer.del(e, n, r)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (i = this.tokenizer.autolink(e)) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        if (!this.state.inLink && (i = this.tokenizer.url(e))) {
          e = e.substring(i.raw.length), t.push(i);
          continue;
        }
        let u = e;
        if (this.options.extensions?.startInline) {
          let a = 1 / 0, p = e.slice(1), c;
          this.options.extensions.startInline.forEach((d) => {
            c = d.call({ lexer: this }, p), typeof c == "number" && c >= 0 && (a = Math.min(a, c));
          }), a < 1 / 0 && a >= 0 && (u = e.substring(0, a + 1));
        }
        if (i = this.tokenizer.inlineText(u)) {
          e = e.substring(i.raw.length), i.raw.slice(-1) !== "_" && (r = i.raw.slice(-1)), s = true;
          let a = t.at(-1);
          a?.type === "text" ? (a.raw += i.raw, a.text += i.text) : t.push(i);
          continue;
        }
        if (e) {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
      }
      return t;
    }
    infiniteLoopError(e) {
      let t = "Infinite loop on byte: " + e;
      if (this.options.silent) console.error(t);
      else throw new Error(t);
    }
  };
  var S = class {
    options;
    parser;
    constructor(e) {
      this.options = e || y;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      let s = (t || "").match(x.notSpaceStart)?.[0], r = e ? e.replace(x.endingNewline, "") + `
` : "";
      return s ? '<pre><code class="language-' + O(s) + '">' + (n ? r : O(r, true)) + `</code></pre>
` : "<pre><code>" + (n ? r : O(r, true)) + `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    def(e) {
      return "";
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered, n = e.start, s = "";
      for (let i = 0; i < e.items.length; i++) {
        let u = e.items[i];
        s += this.listitem(u);
      }
      let r = t ? "ol" : "ul", o = t && n !== 1 ? ' start="' + n + '"' : "";
      return "<" + r + o + `>
` + s + "</" + r + `>
`;
    }
    listitem(e) {
      return `<li>${this.parser.parse(e.tokens)}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "", n = "";
      for (let r = 0; r < e.header.length; r++) n += this.tablecell(e.header[r]);
      t += this.tablerow({ text: n });
      let s = "";
      for (let r = 0; r < e.rows.length; r++) {
        let o = e.rows[r];
        n = "";
        for (let i = 0; i < o.length; i++) n += this.tablecell(o[i]);
        s += this.tablerow({ text: n });
      }
      return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
      return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${O(e, true)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, text: n, tokens: s, autolink: r }) {
      let o = r ? O(n, true) : this.parser.parseInline(s), i = re(e);
      if (i === null) return o;
      e = O(i, r);
      let u = '<a href="' + e + '"';
      return t && (u += ' title="' + O(t) + '"'), u += ">" + o + "</a>", u;
    }
    image({ href: e, title: t, text: n, tokens: s }) {
      s && (n = this.parser.parseInline(s, this.parser.textRenderer));
      let r = re(e);
      if (r === null) return O(n);
      e = r;
      let o = `<img src="${O(e)}" alt="${O(n)}"`;
      return t && (o += ` title="${O(t)}"`), o += ">", o;
    }
    text(e) {
      return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : O(e.text);
    }
  };
  var z = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
    checkbox({ raw: e }) {
      return e;
    }
  };
  var T = class l2 {
    options;
    renderer;
    textRenderer;
    constructor(e) {
      this.options = e || y, this.options.renderer = this.options.renderer || new S(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new z();
    }
    static parse(e, t) {
      return new l2(t).parse(e);
    }
    static parseInline(e, t) {
      return new l2(t).parseInline(e);
    }
    parse(e) {
      this.renderer.parser = this;
      let t = "";
      for (let n = 0; n < e.length; n++) {
        let s = e[n];
        if (this.options.extensions?.renderers?.[s.type]) {
          let o = s, i = this.options.extensions.renderers[o.type].call({ parser: this }, o);
          if (i !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(o.type)) {
            t += i || "";
            continue;
          }
        }
        let r = s;
        switch (r.type) {
          case "space": {
            t += this.renderer.space(r);
            break;
          }
          case "hr": {
            t += this.renderer.hr(r);
            break;
          }
          case "heading": {
            t += this.renderer.heading(r);
            break;
          }
          case "code": {
            t += this.renderer.code(r);
            break;
          }
          case "table": {
            t += this.renderer.table(r);
            break;
          }
          case "blockquote": {
            t += this.renderer.blockquote(r);
            break;
          }
          case "list": {
            t += this.renderer.list(r);
            break;
          }
          case "checkbox": {
            t += this.renderer.checkbox(r);
            break;
          }
          case "html": {
            t += this.renderer.html(r);
            break;
          }
          case "def": {
            t += this.renderer.def(r);
            break;
          }
          case "paragraph": {
            t += this.renderer.paragraph(r);
            break;
          }
          case "text": {
            t += this.renderer.text(r);
            break;
          }
          default: {
            let o = 'Token with "' + r.type + '" type was not found.';
            if (this.options.silent) return console.error(o), "";
            throw new Error(o);
          }
        }
      }
      return t;
    }
    parseInline(e, t = this.renderer) {
      this.renderer.parser = this;
      let n = "";
      for (let s = 0; s < e.length; s++) {
        let r = e[s];
        if (this.options.extensions?.renderers?.[r.type]) {
          let i = this.options.extensions.renderers[r.type].call({ parser: this }, r);
          if (i !== false || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
            n += i || "";
            continue;
          }
        }
        let o = r;
        switch (o.type) {
          case "escape": {
            n += t.text(o);
            break;
          }
          case "html": {
            n += t.html(o);
            break;
          }
          case "link": {
            n += t.link(o);
            break;
          }
          case "image": {
            n += t.image(o);
            break;
          }
          case "checkbox": {
            n += t.checkbox(o);
            break;
          }
          case "strong": {
            n += t.strong(o);
            break;
          }
          case "em": {
            n += t.em(o);
            break;
          }
          case "codespan": {
            n += t.codespan(o);
            break;
          }
          case "br": {
            n += t.br(o);
            break;
          }
          case "del": {
            n += t.del(o);
            break;
          }
          case "text": {
            n += t.text(o);
            break;
          }
          default: {
            let i = 'Token with "' + o.type + '" type was not found.';
            if (this.options.silent) return console.error(i), "";
            throw new Error(i);
          }
        }
      }
      return n;
    }
  };
  var _ = class {
    options;
    block;
    constructor(e) {
      this.options = e || y;
    }
    static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
    static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer(e = this.block) {
      return e ? R.lex : R.lexInline;
    }
    provideParser(e = this.block) {
      return e ? T.parse : T.parseInline;
    }
  };
  var F = class {
    defaults = I();
    options = this.setOptions;
    parse = this.parseMarkdown(true);
    parseInline = this.parseMarkdown(false);
    Parser = T;
    Renderer = S;
    TextRenderer = z;
    Lexer = R;
    Tokenizer = P;
    Hooks = _;
    constructor(...e) {
      this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (let s of e) switch (n = n.concat(t.call(this, s)), s.type) {
        case "table": {
          let r = s;
          for (let o of r.header) n = n.concat(this.walkTokens(o.tokens, t));
          for (let o of r.rows) for (let i of o) n = n.concat(this.walkTokens(i.tokens, t));
          break;
        }
        case "list": {
          let r = s;
          n = n.concat(this.walkTokens(r.items, t));
          break;
        }
        default: {
          let r = s;
          this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((o) => {
            let i = r[o].flat(1 / 0);
            n = n.concat(this.walkTokens(i, t));
          }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
        }
      }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return e.forEach((n) => {
        let s = { ...n };
        if (s.async = this.defaults.async || s.async || false, n.extensions && (n.extensions.forEach((r) => {
          if (!r.name) throw new Error("extension name required");
          if ("renderer" in r) {
            let o = t.renderers[r.name];
            o ? t.renderers[r.name] = function(...i) {
              let u = r.renderer.apply(this, i);
              return u === false && (u = o.apply(this, i)), u;
            } : t.renderers[r.name] = r.renderer;
          }
          if ("tokenizer" in r) {
            if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
            let o = t[r.level];
            o ? o.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
          }
          "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
        }), s.extensions = t), n.renderer) {
          let r = this.defaults.renderer || new S(this.defaults);
          for (let o in n.renderer) {
            if (!(o in r)) throw new Error(`renderer '${o}' does not exist`);
            if (["options", "parser"].includes(o)) continue;
            let i = o, u = n.renderer[i], a = r[i];
            r[i] = (...p) => {
              let c = u.apply(r, p);
              return c === false && (c = a.apply(r, p)), c || "";
            };
          }
          s.renderer = r;
        }
        if (n.tokenizer) {
          let r = this.defaults.tokenizer || new P(this.defaults);
          for (let o in n.tokenizer) {
            if (!(o in r)) throw new Error(`tokenizer '${o}' does not exist`);
            if (["options", "rules", "lexer"].includes(o)) continue;
            let i = o, u = n.tokenizer[i], a = r[i];
            r[i] = (...p) => {
              let c = u.apply(r, p);
              return c === false && (c = a.apply(r, p)), c;
            };
          }
          s.tokenizer = r;
        }
        if (n.hooks) {
          let r = this.defaults.hooks || new _();
          for (let o in n.hooks) {
            if (!(o in r)) throw new Error(`hook '${o}' does not exist`);
            if (["options", "block"].includes(o)) continue;
            let i = o, u = n.hooks[i], a = r[i];
            _.passThroughHooks.has(o) ? r[i] = (p) => {
              if (this.defaults.async && _.passThroughHooksRespectAsync.has(o)) return (async () => {
                let d = await u.call(r, p);
                return a.call(r, d);
              })();
              let c = u.call(r, p);
              return a.call(r, c);
            } : r[i] = (...p) => {
              if (this.defaults.async) return (async () => {
                let d = await u.apply(r, p);
                return d === false && (d = await a.apply(r, p)), d;
              })();
              let c = u.apply(r, p);
              return c === false && (c = a.apply(r, p)), c;
            };
          }
          s.hooks = r;
        }
        if (n.walkTokens) {
          let r = this.defaults.walkTokens, o = n.walkTokens;
          s.walkTokens = function(i) {
            let u = [];
            return u.push(o.call(this, i)), r && (u = u.concat(r.call(this, i))), u;
          };
        }
        this.defaults = { ...this.defaults, ...s };
      }), this;
    }
    setOptions(e) {
      return this.defaults = { ...this.defaults, ...e }, this;
    }
    lexer(e, t) {
      return R.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return T.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (n, s) => {
        let r = { ...s }, o = { ...this.defaults, ...r }, i = this.onError(!!o.silent, !!o.async);
        if (this.defaults.async === true && r.async === false) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        if (typeof n > "u" || n === null) return i(new Error("marked(): input parameter is undefined or null"));
        if (typeof n != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
        if (o.hooks && (o.hooks.options = o, o.hooks.block = e), o.async) return (async () => {
          let u = o.hooks ? await o.hooks.preprocess(n) : n, p = await (o.hooks ? await o.hooks.provideLexer(e) : e ? R.lex : R.lexInline)(u, o), c = o.hooks ? await o.hooks.processAllTokens(p) : p;
          o.walkTokens && await Promise.all(this.walkTokens(c, o.walkTokens));
          let m = await (o.hooks ? await o.hooks.provideParser(e) : e ? T.parse : T.parseInline)(c, o);
          return o.hooks ? await o.hooks.postprocess(m) : m;
        })().catch(i);
        try {
          o.hooks && (n = o.hooks.preprocess(n));
          let a = (o.hooks ? o.hooks.provideLexer(e) : e ? R.lex : R.lexInline)(n, o);
          o.hooks && (a = o.hooks.processAllTokens(a)), o.walkTokens && this.walkTokens(a, o.walkTokens);
          let c = (o.hooks ? o.hooks.provideParser(e) : e ? T.parse : T.parseInline)(a, o);
          return o.hooks && (c = o.hooks.postprocess(c)), c;
        } catch (u) {
          return i(u);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
          let s = "<p>An error occurred:</p><pre>" + O(n.message + "", true) + "</pre>";
          return t ? Promise.resolve(s) : s;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  };
  var E = new F();
  function k(l3, e) {
    return E.parse(l3, e);
  }
  k.options = k.setOptions = function(l3) {
    return E.setOptions(l3), k.defaults = E.defaults, W(k.defaults), k;
  };
  k.getDefaults = I;
  k.defaults = y;
  function Pt(...l3) {
    return E.use(...l3), k.defaults = E.defaults, W(k.defaults), k;
  }
  k.use = Pt;
  k.walkTokens = function(l3, e) {
    return E.walkTokens(l3, e);
  };
  k.parseInline = E.parseInline;
  k.Parser = T;
  k.parser = T.parse;
  k.Renderer = S;
  k.TextRenderer = z;
  k.Lexer = R;
  k.lexer = R.lex;
  k.Tokenizer = P;
  k.Hooks = _;
  k.parse = k;
  var gn = k.options;
  var fn = k.setOptions;
  var mn = k.walkTokens;
  var xn = k.parseInline;
  var Rn = T.parse;
  var Tn = R.lex;

  // vendor/mech/library.js
  function requestSourceData(item, topic) {
    let sources = [];
    for (let div of document.querySelectorAll(`.item`)) {
      if (div.classList.contains(`${topic}-source`)) {
        sources.unshift(div);
      }
      if (div === item) {
        break;
      }
    }
    return sources.map((div) => {
      let getData = div[`${topic}Data`];
      let result = getData ? getData() : null;
      return { div, result };
    });
  }
  function dotify(graph) {
    const tip = (props) => Object.entries(props).filter((e) => e[1]).map((e) => `${e[0]}: ${e[1]}`).join("\\n");
    const nodes = graph.nodes.map((node, id) => {
      const label = node.type ? `${node.type}\\n${node.props.name}` : node.props.name;
      return `${id} [label="${label}" ${node.props.url || node.props.tick ? `URL="${node.props.url || "#"}" target="_blank"` : ""} tooltip="${tip(node.props)}"]`;
    });
    const edges = graph.rels.map((rel) => {
      return `${rel.from}->${rel.to} [label="${rel.type}" labeltooltip="${tip(rel.props)}"]`;
    });
    return ["digraph {", "rankdir=LR", "node [shape=box style=filled fillcolor=palegreen]", ...nodes, ...edges, "}"].join(
      "\n"
    );
  }
  function walks(count, way = "steps", neighborhood2, scope = {}) {
    const find = (slug, site) => neighborhood2.find((info) => info.slug == slug && (!site || info.domain == site));
    const finds = (slugs) => slugs ? slugs.map((slug) => find(slug)) : null;
    const prob = (n) => Math.floor(n * Math.abs(Math.random() - Math.random()));
    const rand = (a) => a[prob(a.length)];
    const good = (info) => info.links && Object.keys(info.links).length < 10;
    const back = (slug) => neighborhood2.filter((info) => good(info) && slug in info.links);
    const dedup = (value, index, self) => self.findIndex((info) => info.slug == value.slug) === index;
    const newr = (infos) => infos.toSorted((a, b) => b.date - a.date).filter(dedup).slice(0, 3);
    const domains = neighborhood2.map((info) => info.domain).filter(uniq);
    function blanket(info) {
      const graph = new Graph();
      const node = (info2) => {
        return graph.addUniqNode("", {
          name: info2.title.replaceAll(/ /g, "\n"),
          title: info2.title,
          site: info2.domain
        });
      };
      const up = (info2) => finds(info2?.patterns?.up) ?? newr(back(info2.slug));
      const down = (info2) => info2?.patterns?.down ?? Object.keys(info2.links || {});
      const nid = node(info);
      for (const parent of up(info)) {
        graph.addRel("", node(parent), nid);
      }
      for (const link of down(info)) {
        const child = find(link);
        if (child) {
          const cid = node(child);
          graph.addRel("", nid, cid);
          for (const parent of up(child)) {
            graph.addRel("", node(parent), cid);
          }
        }
      }
      return graph;
    }
    switch (way) {
      case "steps":
        return steps(count);
      case "days":
        return periods(way, 1, count);
      case "weeks":
        return periods(way, 7, count);
      case "months":
        return periods(way, 30, count);
      case "hubs":
        return hubs(count);
      case "references":
        return references();
      case "lineup":
        return lineup();
      case "topics":
        return topics(count);
      case "clicks":
        return clicks(count);
    }
    function steps(count2 = 5) {
      return domains.map((domain) => {
        const name = domain.split(".").slice(0, 3).join(".");
        const done = /* @__PURE__ */ new Set();
        const graph = new Graph();
        let nid = 0;
        const here = neighborhood2.filter((info) => info.domain == domain && "links" in info);
        if (!here.length) return { name, graph: null };
        const node = (info) => {
          nid = graph.addNode("", {
            name: info.title.replaceAll(/ /g, "\n"),
            title: info.title,
            site: domain,
            links: Object.keys(info.links || {}).filter((slug) => find(slug))
          });
          return nid;
        };
        const rel = (here2, there) => graph.addRel("", here2, there);
        const links = (nid2) => graph.nodes[nid2].props.links.filter((slug) => !done.has(slug));
        const start = rand(here);
        done.add(start.slug);
        node(start);
        for (let n = 5; n > 0; n--) {
          try {
            const slugs = links(nid);
            const slug = rand(slugs);
            done.add(slug);
            const info = find(slug);
            rel(nid, node(info));
          } catch (e) {
          }
        }
        return { name, graph };
      });
    }
    function periods(way2, days, count2 = 12) {
      const interval = days * 24 * 60 * 60 * 1e3;
      const iota = [...Array(Number(count2)).keys()];
      const dates = iota.map((n) => Date.now() - n * interval);
      const aspects = [];
      for (const stop of dates) {
        const start = stop - interval;
        const name = `${way2.replace(/s$/, "")} ${new Date(start).toLocaleDateString()}`;
        const here = neighborhood2.filter((info) => info.date < stop && info.date >= start).filter((info) => !(info.links && Object.keys(info.links).length > 5));
        if (here.length) {
          const domains2 = here.reduce((set, info) => {
            set.add(info.domain);
            return set;
          }, /* @__PURE__ */ new Set());
          for (const domain of domains2) {
            const graph = new Graph();
            const node = (info) => {
              return graph.addUniqNode("", {
                name: info.title.replaceAll(/ /g, "\n"),
                title: info.title,
                site: info.domain,
                date: info.date
              });
            };
            const author = domain.split(/\.|\:/)[0];
            for (const info of here.filter((info2) => info2.domain == domain)) {
              const nid = node(info);
              for (const link in info.links || {}) {
                const linked = find(link);
                if (linked) graph.addRel("", nid, node(linked));
              }
            }
            aspects.push({ name: `${name} ${author}`, graph });
          }
        }
      }
      return aspects;
    }
    function hubs(count2 = 12) {
      const aspects = [];
      const ignored = /* @__PURE__ */ new Set();
      const hits = {};
      for (const info of neighborhood2)
        if (info.links)
          if (Object.keys(info.links).length <= 15) {
            for (const link in info.links) if (find(link)) hits[link] = (hits[link] || 0) + 1;
          } else {
            ignored.add(info.slug);
          }
      if (ignored.size > 0) console.log("hub links ignored for large pages:", [...ignored]);
      const hubs2 = Object.entries(hits).sort((a, b) => b[1] - a[1]).slice(0, count2);
      console.log({ hits, hubs: hubs2 });
      for (const hub of hubs2) {
        const name = `hub ${hub[1]} ${hub[0]}`;
        const graph = blanket(find(hub[0]));
        aspects.push({ name, graph });
      }
      return aspects;
    }
    function lineup() {
      const aspects = [];
      const pageObjects = scope.lineup();
      console.log("library lineup", { scope, pageObjects });
      for (const pageObject of pageObjects) {
        const slug = pageObject.getSlug();
        const site = pageObject.getRemoteSite(scope.host());
        const info = find(slug, site);
        aspects.push({ name: pageObject.getTitle(), graph: blanket(info) });
      }
      return aspects;
    }
    function references() {
      const aspects = [];
      const items = scope.references();
      console.log("library references", { items });
      for (const item of items) {
        const { title, site, slug } = item;
        const info = find(slug, site);
        if (info) aspects.push({ name: title, graph: blanket(info) });
      }
      return aspects;
    }
    function topics(count2 = 10) {
      const aspects = [];
      const days = 7;
      const interval = days * 24 * 60 * 60 * 1e3;
      const msec = (n) => Date.now() - n * interval;
      let week = 0;
      while (aspects.length < count2 && week < count2) {
        const stop = msec(week++);
        const start = msec(week);
        const nodes = neighborhood2.filter((info) => info.date > start && info.date <= stop).filter((info) => !!info.links).filter((info) => !info.title.endsWith(" Survey"));
        if (nodes.length) {
          const graph = linked(nodes);
          const name = new Date(stop).toLocaleDateString();
          aspects.push(...partitions({ name, graph }, start, stop));
        }
      }
      return aspects;
      function linked(infos) {
        const graph = new Graph();
        const node = (slug) => {
          const type = "";
          const info = neighborhood2.find((info2) => info2.slug == slug);
          const twins = neighborhood2.filter((info2) => info2.slug == slug).length;
          const title = info.title;
          const site = info.domain;
          const date = info.date;
          const name = title.replaceAll(" ", "\n");
          const nid = graph.nodes.findIndex((node2) => node2.type == type && node2.props.name == name);
          const result = nid >= 0 ? nid : graph.addNode(type, { name, site, date });
          if (twins > 1) graph.nodes[result].props.twins = twins;
          return result;
        };
        for (const info of infos) {
          const nid = node(info.slug);
          for (const name of newest(Object.keys(info.links))) {
            graph.addRel("", nid, node(name));
          }
        }
        return graph;
      }
      function newest(slugs) {
        const recent = (slug) => neighborhood2.filter((info) => info.slug == slug);
        return slugs.map((slug) => [slug, recent(slug)]).filter((pair) => pair[1].length).map((pair) => [pair[0], pair[1].sort((a, b) => b.date - a.date)[0]]).sort((a, b) => b[1].date - a[1].date).map((pair) => pair[0]).slice(0, 3);
      }
      function partitions(aspect, from, until) {
        const input = aspect.graph;
        const output = [];
        let doing = {};
        const nodes = input.nodes;
        const rels = input.rels;
        const todo = [...Array(nodes.length).keys()].map((n) => [n, Math.random()]).sort((a, b) => a[1] - b[1]).map((v) => v[0]);
        const copy = (nid) => {
          if (nid in doing) {
            return;
          }
          todo.splice(todo.indexOf(nid), 1);
          const node = nodes[nid];
          doing[nid] = output[0].addNode(node.type, node.props);
          for (const rid of node.out) copy(rels[rid].to);
          for (const rid of node.in) copy(rels[rid].from);
          for (const rid of node.out) output[0].addRel("", doing[nid], doing[rels[rid].to], {});
        };
        while (todo.length) {
          const nid = todo.shift();
          if (nid in doing) {
            continue;
          }
          const node = nodes[nid];
          const title = node.props.name.replaceAll("\n", " ");
          if (node.in.length + node.out.length) {
            output.unshift(new Graph());
            doing = {};
            copy(nid);
          }
        }
        const when = (node) => node.props.date || 0;
        const topic = (graph) => {
          const node = graph.nodes.slice(0).sort((a, b) => when(b) - when(a)).filter((a) => when(a) >= from && when(a) <= until)[0];
          console.log({ node, nodes: graph.nodes, name: aspect.name });
          if (!node) return aspect.name;
          const words = node.props.name.split(/\s+/);
          return words.slice(0, 3).join(" ");
        };
        return output.reverse().map((graph, i) => ({ name: topic(graph), graph }));
      }
    }
    function clicks(count2 = 1) {
      const node = (graph, info, props = {}) => {
        return graph.addUniqNode(
          "",
          Object.assign(
            {
              name: info.title.replaceAll(/ /g, "\n"),
              title: info.title,
              site: info.domain,
              date: info.date
            },
            props
          )
        );
      };
      const aspects = [];
      const items = scope.page().story;
      const story = items.filter((item) => item.type == "reference").map((item) => item.slug);
      for (const slug of story) {
        const here = neighborhood2.find((info) => info.slug == slug);
        const graph = new Graph();
        if (here) {
          const nid = node(graph, here, { color: "lightblue" });
          more(graph, count2, nid, here);
        } else graph.addNode("", { name: slug.replaceAll(/-/g, "\n"), color: "white" });
        aspects.push({ name: slug, graph });
      }
      return aspects;
      function more(graph, num, nid, info) {
        if (num < 1) return;
        for (const slug in info.links) {
          if (story.includes(slug)) return;
          const here = neighborhood2.find((info2) => info2.slug == slug);
          if (here) {
            const nnid = node(graph, here);
            graph.addRel("", nid, nnid, {});
            more(graph, num - 1, nnid, here);
          } else {
            const nnid = graph.addUniqNode("", { name: slug.replaceAll(/-/g, "\n"), color: "white" });
            graph.addRel("", nid, nnid, {});
          }
        }
      }
    }
  }
  function kwic(prefix, lines, stop) {
    const quotes = lines.filter((line) => line.match(/\t/)).map(quote).flat().sort((a, b) => a.word < b.word ? -1 : 1);
    let current = "zzz".slice(0, prefix);
    const groups = [];
    for (const quote2 of quotes) {
      const group = quote2.word.toLowerCase().slice(0, prefix);
      if (group != current) {
        groups.push({ group, quotes: [] });
        current = group;
      }
      groups[groups.length - 1].quotes.push(quote2);
    }
    return groups;
    function quote(line) {
      const [key, text] = line.split(/\t/);
      const words = text.replaceAll(/'t\b/g, "t").replaceAll(/'s\b/g, "s").split(/[^a-zA-Z]+/).filter((word) => word.length > 3 && !stop.has(word.toLowerCase()));
      return words.map((word) => ({ word, line, key }));
    }
  }
  function apply2(page, action) {
    const order = () => {
      return (page.story || []).map((item) => item?.id);
    };
    const add = (after, item) => {
      const index = order().indexOf(after) + 1;
      page.story.splice(index, 0, item);
    };
    const remove = () => {
      const index = order().indexOf(action.id);
      if (index !== -1) {
        page.story.splice(index, 1);
      }
    };
    page.story = page.story || [];
    switch (action.type) {
      case "create":
        if (action.item) {
          if (action.item.title != null) {
            page.title = action.item.title;
          }
          if (action.item.story != null) {
            page.story = action.item.story.slice();
          }
        }
        break;
      case "add":
        add(action.after, action.item);
        break;
      case "edit":
        const index = order().indexOf(action.id);
        if (index !== -1) {
          page.story.splice(index, 1, action.item);
        } else {
          page.story.push(action.item);
        }
        break;
      case "move":
        const moveIndex = action.order.indexOf(action.id);
        const after = action.order[moveIndex - 1];
        const item = page.story[order().indexOf(action.id)];
        remove();
        add(after, item);
        break;
      case "remove":
        remove();
        break;
    }
    page.journal = page.journal || [];
    if (action.fork) {
      page.journal.push({ type: "fork", site: action.fork, date: action.date - 1 });
    }
    page.journal.push(action);
  }
  function soloListener(event) {
    if (!event.data) return;
    const { data } = event;
    if (data?.action == "publishSourceData" && data?.name == "aspect") {
      if (wiki.debug) console.log("soloListener - source update", { event, data });
      return;
    }
    if (!event.source.opener || event.source.location.pathname !== "/plugins/solo/dialog/") {
      if (wiki.debug) {
        console.log("soloListener - not for us", { event });
      }
      return;
    }
    if (wiki.debug) {
      console.log("soloListener - ours", { event });
    }
    const { action, keepLineup = false, pageKey = null, title = null, context = null, page = null } = data;
    let $page = null;
    if (pageKey != null) {
      $page = keepLineup ? null : $(".page").filter((i, el) => $(el).data("key") == pageKey);
    }
    switch (action) {
      case "doInternalLink":
        wiki.pageHandler.context = context;
        wiki.doInternalLink(title, $page);
        break;
      case "showResult":
        const options = keepLineup ? {} : { $page };
        wiki.showResult(wiki.newPage(page), options);
        break;
      default:
        console.error({ where: "soloListener", message: "unknown action", data });
    }
  }
  var renderer = new k.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    return "<h3>" + text + "</h3>";
  };
  var markedOptions = {
    gfm: true,
    renderer,
    linksInNewTab: true,
    breaks: true,
    mangle: false,
    headerIds: false
  };
  function md(text) {
    const style = `style="width:640px"`;
    return `<div ${style}>${k.parse(text, markedOptions)}</div>`;
  }

  // node_modules/universal-ticker/index.js
  var max = Number.MAX_SAFE_INTEGER;
  function makeTicker(fn2, minMS = 1e3, remainingTicks = max) {
    let hardstop = false;
    let lastTickTime = Date.now();
    let api2 = {
      stop,
      remainingTicks,
      minMS,
      ticksSoFar: 0,
      timeSinceLastTick: 0
    };
    let r = run2();
    r.api = api2;
    return r;
    function stop() {
      hardstop = true;
    }
    async function run2() {
      if (hardstop || api2.remainingTicks < 1) return;
      api2.remainingTicks -= 1;
      api2.ticksSoFar += 1;
      api2.timeSinceLastTick = Date.now() - lastTickTime;
      lastTickTime = Date.now();
      const minTickBuffer = new Promise((resolve) => setTimeout(resolve, api2.minMS));
      await fn2(api2);
      await minTickBuffer;
      return run2();
    }
  }

  // vendor/mech/blocks.js
  var api = {
    trouble,
    inspect,
    response,
    button,
    element,
    jfetch,
    status,
    sourceData,
    showResult,
    neighborhood,
    publishSourceData,
    newSVG,
    SVGline,
    ticker: makeTicker,
    lineupAtKey,
    thisLineupKey,
    lineupPages,
    host,
    download,
    closeTags,
    reset,
    report,
    ago
  };
  function trouble(elem, message) {
    if (elem.innerText.match(/✖︎/)) return;
    elem.innerHTML += `<button class=trouble>\u2716\uFE0E</button>`;
    elem.querySelector("button").addEventListener("click", (event) => {
      elem.outerHTML += `<span class=trouble>${message}</span>`;
    });
  }
  function inspect(elem, key, state) {
    const div = elem.previousElementSibling;
    if (state.debug) {
      elem["sample-" + key] = state[key];
      let look = div.querySelector(`.look[data-key="${key}"]`);
      if (!look) {
        look = document.createElement("div");
        look.classList.add("look");
        look.dataset.key = key;
        look.innerHTML = `<font color=gray size=small>${key} \u21D2</font>`;
        div.insertAdjacentElement("beforeend", look);
        look.querySelector("font").addEventListener("click", (event) => {
          let see = look.querySelector(".see");
          if (!see) {
            see = document.createElement("div");
            see.classList.add("see");
            look.insertAdjacentElement("beforeend", see);
            see.innerText = JSON.stringify(elem["sample-" + key]).substring(0, 400) + " ...";
          } else {
            see.remove();
          }
        });
      }
    }
  }
  function response(elem, html) {
    elem.innerHTML += html;
  }
  function button(elem, label, handler) {
    if (!elem.querySelector("button")) {
      response(elem, `<button class=button>${label}</button>`);
      elem.querySelector("button").addEventListener("click", handler);
    }
  }
  function element(key) {
    return document.getElementById(key);
  }
  async function jfetch(url) {
    return fetch(url).then((res) => res.ok ? res.json() : null);
  }
  function status(elem, command, text) {
    elem.innerHTML = command + `<span class=status>${text}</span>`;
  }
  function sourceData(elem, topic) {
    const item = elem.closest(".item");
    const sources = requestSourceData(item, topic).map(({ div, result }) => ({
      classList: [...div.classList],
      id: div.dataset.id,
      result
    }));
    if (sources.length) return sources;
    trouble(elem, `Expected source for "${topic}" in the lineup.`);
    return null;
  }
  function publishSourceData(elem, topic, data) {
    const item = elem.closest(".item");
    item.classList.add(`${topic}-source`);
    item[`${topic}Data`] = () => data;
  }
  function showResult(elem, page) {
    const options = { $page: $(elem.closest(".page")) };
    wiki.showResult(wiki.newPage(page), options);
  }
  function neighborhood(want) {
    return Object.entries(wiki.neighborhoodObject.sites).filter(([domain, site]) => !site.sitemapRequestInflight && (!want || domain.includes(want))).map(([domain, site]) => (site.sitemap || []).map((info) => Object.assign({ domain }, info)));
  }
  function newSVG(elem) {
    const div = document.createElement("div");
    elem.closest(".item").firstElementChild.prepend(div);
    div.outerHTML = `
        <div style="border:1px solid black; background-color:#f8f8f8; margin-bottom:16px;">
          <svg viewBox="0 0 400 400" width=100% height=400>
            <circle id=dot r=5 cx=200 cy=200 stroke="#ccc"></circle>
          </svg>
        </div>`;
    const svg = elem.closest(".item").getElementsByTagName("svg")[0];
    return svg;
  }
  function SVGline(svg, [x1, y1], [x2, y2]) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const set = (k2, v) => line.setAttribute(k2, Math.round(v));
    set("x1", x1);
    set("y1", 400 - y1);
    set("x2", x2);
    set("y2", 400 - y2);
    line.style.stroke = "black";
    line.style.strokeWidth = "2px";
    svg.appendChild(line);
    const dot = svg.getElementById("dot");
    dot.setAttribute("cx", Math.round(x2));
    dot.setAttribute("cy", Math.round(400 - y2));
  }
  function lineupAtKey(key) {
    return wiki.lineup.atKey(key);
  }
  function thisLineupKey(elem) {
    return elem.closest(".page").dataset.key;
  }
  function lineupPages(elem) {
    const items = [...document.querySelectorAll(".page")];
    const index = items.indexOf(elem.closest(".page"));
    const pages = items.slice(0, index);
    return pages.map((div) => lineupAtKey(div.dataset.key));
  }
  function host() {
    location.host;
  }
  function download(string, file, mime = "text/json") {
    var data = `data:${mime};charset=utf-8,` + encodeURIComponent(string);
    var anchor = document.createElement("a");
    anchor.setAttribute("href", data);
    anchor.setAttribute("download", file);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
  function closeTags(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.innerHTML;
  }
  function reset(elem) {
    const div = elem.nextElementSibling;
    div.querySelectorAll("div.look").forEach((e) => e.outerText = "");
    div.querySelectorAll(".trouble").forEach((e) => e.outerText = "");
    div.querySelectorAll("button.button").forEach((e) => e.outerText = "");
    div.querySelectorAll("span.status").forEach((e) => e.outerText = "");
    div.querySelectorAll("div.report").forEach((e) => e.outerText = "");
  }
  function report(elem, command, html) {
    elem.innerHTML = command + html;
  }
  function ago(then, now = Date.now()) {
    let sign = then > now ? "-" : "";
    let msec = Math.abs(now - then);
    let sec = Math.floor(msec / 1e3);
    if (sec < 2) return `${sign}${msec} msec`;
    let min = Math.floor(sec / 60);
    if (min < 2) return `${sign}${sec} seconds`;
    let hour = Math.floor(min / 60);
    if (hour < 2) return `${sign}${min} minutes`;
    let day = Math.floor(hour / 24);
    if (day < 2) return `${sign}${hour} hours`;
    let week = Math.floor(day / 7);
    if (week < 2) return `${sign}${day} days`;
    let month = Math.floor(day / 30);
    if (month < 2) return `${sign}${week} weeks`;
    let year = Math.floor(day / 365);
    if (year < 2) return `${sign}${month} months`;
    return `${sign}${year} years`;
  }
  async function run(nest, state, initiator) {
    const scope = nest.slice();
    while (scope.length) {
      const code = scope.shift();
      if ("command" in code) {
        const command = code.command;
        const elem = state.api ? state.api.element(code.key) : document.getElementById(code.key);
        const [op, ...args] = code.command.split(/ +/);
        const next = scope[0];
        const body = next && "command" in next ? null : scope.shift();
        const stuff = { command, op, args, body, elem, state, initiator };
        if (state.debug) console.log(stuff);
        if (blocks[op]) await blocks[op].emit.apply(null, [stuff]);
        else if (op.match(/^[A-Z]+$/)) state.api.trouble(elem, `${op} doesn't name a block we know.`);
        else if (code.command.match(/\S/)) state.api.trouble(elem, `Expected line to begin with all-caps keyword.`);
      }
    }
  }
  function click_emit({ elem, body, state }) {
    if (!body?.length) return state.api.trouble(elem, `CLICK expects indented blocks to follow.`);
    state.api.button(elem, "\u25B6", (event) => {
      state.api.reset(elem);
      state.debug = event.shiftKey;
      run(body, state, "click");
    });
  }
  function hello_emit({ elem, args, state }) {
    const world = args[0] == "world" ? " \u{1F30E}" : " \u{1F600}";
    const keys = Object.keys(state).filter((key) => !["context", "api", "debug"].includes(key));
    for (const key of keys) state.api.inspect(elem, key, state);
    state.api.response(elem, world);
  }
  async function from_emit({ elem, command, args, body, state }) {
    if (!args[0]) return state.api.trouble(elem, `FROM expects site/slug as way to federated wiki page.`);
    if (!body?.length) return state.api.trouble(elem, `FROM expects indented blocks to follow.`);
    const [a, b] = args[0].split(/\//);
    const url = b ? `//${a}/${b}.json` : `/${a}.json`;
    const page = await state.api.jfetch(url);
    if (!page) return state.api.trouble(elem, `FROM could not fetch "${url}" `);
    state.page = page;
    const date = page.journal?.findLast((item) => item.type != "fork" && item.date).date;
    if (date) {
      const age = state.api.ago(date);
      state.api.status(elem, command, ` \u21D2 ${age} old`);
    }
    run(body, state);
  }
  function sensor_emit({ elem, command, args, body, state }) {
    state.api.status(elem, command, "");
    if (!("page" in state)) return state.api.trouble(elem, `Expect "page" as with FROM.`);
    state.api.inspect(elem, "page", state);
    const datalog = state.page.story.find((item) => item.type == "datalog");
    if (!datalog) return state.api.trouble(elem, `Expect Datalog plugin in the page.`);
    const device = args[0];
    if (!device) return state.api.trouble(elem, `SENSOR needs a sensor name.`);
    const sensor = datalog.text.split(/\n/).map((line) => line.split(/ +/)).filter((fields) => fields[0] == "SENSOR").find((fields) => fields[1] == device);
    if (!sensor) return state.api.trouble(elem, `Expect to find "${device}" in Datalog.`);
    const url = sensor[2];
    const f = (c) => 9 / 5 * (c / 16) + 32;
    const avg = (a) => a.reduce((s, e) => s + e, 0) / a.length;
    state.api.status(elem, command, " \u23F3");
    state.api.jfetch(url).then((data) => {
      if (state.debug) console.log({ sensor, data });
      state.api.status(elem, command, " \u231B");
      const value = f(avg(Object.values(data)));
      state.temperature = `${value.toFixed(2)}\xB0F`;
      run(body, state);
    });
  }
  function report_emit({ elem, command, args, state }) {
    const key = args[0] || "temperature";
    if (!(key in state)) return state.api.trouble(elem, `Expect "${key}" in state`);
    const value = state[key];
    const type = typeof value;
    if (!["string", "number"].includes(type))
      return state.api.trouble(elem, `Expect state.${key} to be a string or number`);
    state.api.inspect(elem, key, state);
    state.api.report(elem, command, `<div class=report>${value}</div>`);
  }
  function source_emit({ elem, command, args, body, state }) {
    if (!(args && args.length)) return state.api.trouble(elem, `Expected Source topic, like "markers" for Map markers.`);
    const topic = args[0];
    const sources = state.api.sourceData(elem, topic);
    if (!sources) return;
    if (state.debug) console.log({ topic, sources });
    const count = (type) => {
      const count2 = sources.filter((source) => source.classList.includes(type)).length;
      return count2 ? `${count2} ${type}` : null;
    };
    const counts = [count("map"), count("image"), count("frame"), count("assets")].filter((count2) => count2).join(", ");
    state.api.status(elem, command, " \u21D2 " + counts);
    state[topic] = sources.map(({ id, result }) => ({ id, result }));
    if (body) run(body, state);
  }
  function preview_emit({ elem, command, args, state }) {
    const round = (digits) => (+digits).toFixed(7);
    const story = [];
    const types = args;
    for (const type of types) {
      switch (type) {
        case "map":
          if (!("marker" in state))
            return state.api.trouble(elem, `"map" preview expects "marker" state, like from "SOURCE marker".`);
          state.api.inspect(elem, "marker", state);
          const text = state.marker.map((marker) => [marker.result]).flat(2).map((latlon) => `${round(latlon.lat)}, ${round(latlon.lon)} ${latlon.label || ""}`).filter(uniq).join("\n");
          story.push({ type: "map", text });
          break;
        case "graph":
          if (!("aspect" in state))
            return state.api.trouble(elem, `"graph" preview expects "aspect" state, like from "SOURCE aspect".`);
          state.api.inspect(elem, "aspect", state);
          for (const { result } of state.aspect) {
            for (const { name, graph } of result) {
              if (state.debug) console.log({ name, graph });
              story.push({ type: "paragraph", text: name });
              story.push({ type: "graphviz", text: dotify(graph) });
            }
            story.push({ type: "pagefold", text: "." });
          }
          break;
        case "items":
          if (!("items" in state))
            return state.api.trouble(elem, `"items" preview expects "items" state, like from "KWIC".`);
          state.api.inspect(elem, "items", state);
          const beit = (item2) => {
            switch (typeof item2) {
              case "object":
                if ("type" in item2) return item2;
                else return beit(item2.toString());
              case "function":
                return beit(item2());
              case "string":
                if (item2.charAt(0) == "<") return { type: "html", text: item2 };
                if (item2.match(/^https?:/i)) return { type: "frame", text: item2 };
              default:
                return { type: "paragraph", text: item2.toString() };
            }
          };
          const items = state.items.map(beit);
          story.push(...items);
          break;
        case "page":
          if (!("page" in state)) return state.api.trouble(elem, `"page" preview expects "page" state, like from "FROM".`);
          state.api.inspect(elem, "page", state);
          if (args.length == 1) return state.api.showResult(elem, state.page);
          story.push(...state.page.story);
          break;
        case "synopsis":
          const text2 = `This page created with Mech command: "${command}". See [[${state.context.title}]].`;
          story.push({ type: "paragraph", text: text2, id: state.context.itemId });
          break;
        default:
          return state.api.trouble(elem, `"${type}" doesn't name an item we can preview`);
      }
    }
    const title = "Mech Preview" + (state.tick ? ` ${state.tick}` : "");
    const page = { title, story };
    for (const item2 of page.story) item2.id ||= (Math.random() * 10 ** 20).toFixed(0);
    const item = JSON.parse(JSON.stringify(page));
    const date = Date.now();
    page.journal = [{ type: "create", date, item }];
    state.api.showResult(elem, page);
  }
  async function neighbors_emit({ elem, command, args, body, state }) {
    const belem = (probe) => state.api.element(probe.key);
    let have = state.api.neighborhood(args[0]);
    for (let i = 1; i < args.length; i++) have.push(...state.api.neighborhood(args[i]));
    have = have.filter((s, i) => s.length && !have.slice(0, i).find((e) => e[0]?.domain == s[0]?.domain));
    for (const probe of body || []) {
      if (!probe.command.endsWith(" Survey")) {
        state.api.trouble(belem(probe), `NEIGHBORS expects a Site Survey title, like Pattern Link Survey`);
        continue;
      }
      const todos = have.filter((sitemap) => sitemap.find((info) => info.title == probe.command));
      state.api.status(belem(probe), probe.command, `\u21D2 ${todos.length} sites`);
      for (const todo of todos) {
        const url = `//${todo[0].domain}/${asSlug(probe.command)}.json`;
        const page = await state.api.jfetch(url);
        if (!page) continue;
        const survey = page.story.find((item) => item.type == "frame")?.survey;
        if (!survey) continue;
        for (const info of todo) {
          const extra = Object.assign(
            {},
            survey.find((inf) => inf.slug == info.slug),
            info
          );
          Object.assign(info, extra);
        }
      }
    }
    state.neighborhood = have.flat();
    state.api.status(elem, command, `\u21D2 ${state.neighborhood.length} pages, ${have.length} sites`);
  }
  function walk_emit({ elem, command, args, state }) {
    if (!("neighborhood" in state))
      return state.api.trouble(elem, `WALK expects state.neighborhood, like from NEIGHBORS.`);
    state.api.inspect(elem, "neighborhood", state);
    const [, count, way] = command.match(/\b(\d+)? *(steps|days|weeks|months|hubs|lineup|references|topics|clicks)\b/) || [];
    if (!way && command != "WALK") return state.api.trouble(elem, `WALK can't understand rest of this block.`);
    const scope = {
      host() {
        return state.api.host();
      },
      lineup() {
        return state.api.lineupPages(elem);
      },
      references() {
        const key = state.api.thisLineupKey(elem);
        const pageObject = state.api.lineupAtKey(key);
        const story = pageObject.getRawPage().story;
        return story.filter((item) => item.type == "reference");
      },
      page() {
        if (!state.page) state.api.trouble(elem, "WALK expects a page, like from FROM");
        state.api.inspect(elem, "page", state);
        return state.page;
      }
    };
    const steps = walks(count, way, state.neighborhood, scope);
    const aspects = steps.filter(({ graph }) => graph);
    if (state.debug) console.log({ steps });
    const nodes = aspects.map(({ graph }) => graph.nodes).flat();
    state.api.status(elem, command, ` \u21D2 ${aspects.length} aspects, ${nodes.length} nodes`);
    if (steps.find(({ graph }) => !graph)) state.api.trouble(elem, `WALK skipped sites with no links in sitemaps`);
    if (aspects.length) {
      state.aspect = state.aspect || [];
      const obj = state.aspect.find((obj2) => obj2.id == elem.id);
      if (obj) obj.result = aspects;
      else state.aspect.push({ id: elem.id, result: aspects, source: command });
      state.api.publishSourceData(elem, "aspect", state.aspect.map((obj2) => obj2.result).flat());
      if (state.debug) console.log({ command, state: state.aspect });
    }
  }
  function tick_emit({ elem, command, args, body, state }) {
    if (!body?.length) return state.api.trouble(elem, `TICK expects indented blocks to follow.`);
    const count = args[0] || "1";
    if (!count.match(/^[1-9][0-9]?$/)) return state.api.trouble(elem, `TICK expects a count from 1 to 99`);
    let clock, outertick;
    if (state.tick != null) {
      outertick = state.tick;
      start({ shiftKey: state.debug });
      return clock;
    } else ready();
    function ready() {
      state.api.button(elem, "\u25B6", start);
    }
    function status2(ticks) {
      state.api.status(elem, command, ` \u21D2 ${ticks} remaining`);
    }
    function start(event) {
      state.api.reset(elem);
      state.debug = event.shiftKey;
      state.tick = +count;
      status2(state.tick);
      clock = state.api.ticker(async () => {
        if (state.debug) console.log({ tick: state.tick, count });
        if ("tick" in state && --state.tick >= 0) {
          status2(state.tick);
          await run(body, state, "tick");
        } else {
          clock = clock.api.stop();
          state.tick = outertick;
          state.api.status(elem, command, "");
          ready();
        }
      });
    }
  }
  function until_emit({ elem, command, args, body, state }) {
    if (!args.length) return state.api.trouble(elem, `UNTIL expects an argument, a word to stop running.`);
    if (!state.tick) return state.api.trouble(elem, `UNTIL expects to indented below an iterator, like TICKS.`);
    if (!state.aspect) return state.api.trouble(elem, `UNTIL expects "aspect", like from WALK.`);
    inspect(elem, "aspect", state);
    state.api.status(elem, command, ` \u21D2 ${state.tick}`);
    const word = args[0];
    for (const { div, result } of state.aspect)
      for (const { name, graph } of result)
        for (const node of graph.nodes)
          if (node.type.includes(word) || node.props.name.includes(word)) {
            if (state.debug) console.log({ div, result, name, graph, node });
            delete state.tick;
            state.api.response(elem, " done");
            if (body) run(body, state);
            return;
          }
  }
  function forward_emit({ elem, command, args, state }) {
    if (args.length < 1)
      return state.api.trouble(elem, `FORWARD expects an argument, the number of steps to move a "turtle".`);
    state.turtle ??= { svg: state.api.newSVG(elem), position: [200, 200], direction: 0 };
    const steps = args[0];
    const theta = state.turtle.direction * 2 * Math.PI / 360;
    const [x1, y1] = state.turtle.position;
    state.turtle.position = [x1 + steps * Math.sin(theta), y1 + steps * Math.cos(theta)];
    state.api.SVGline(state.turtle.svg, [x1, y1], state.turtle.position);
    state.api.status(elem, command, ` \u21D2 ${state.turtle.position.map((n) => (n - 200).toFixed(1)).join(", ")}`);
  }
  function turn_emit({ elem, command, args, state }) {
    if (args.length < 1)
      return state.api.trouble(elem, `TURN expects an argument, the number of degrees to turn a "turtle".`);
    state.turtle ??= { svg: state.api.newSVG(elem), position: [200, 200], direction: 0 };
    const degrees = +args[0];
    state.turtle.direction += degrees;
    state.api.status(elem, command, ` \u21D2 ${state.turtle.direction}\xB0`);
  }
  function file_emit({ elem, command, args, body, state }) {
    if (!("assets" in state)) return state.api.trouble(elem, `FILE expects state.assets, like from SOURCE assets.`);
    inspect(elem, "assets", state);
    const origin = "//" + window.location.host;
    const assets = state.assets.map(
      ({ id, result }) => Object.entries(result).map(
        ([dir, paths]) => Object.entries(paths).map(
          ([path, files]) => files.map((file) => {
            const assets2 = path.startsWith("//") ? path : `${origin}${path}`;
            const host2 = assets2.replace(/\/assets$/, "");
            const url = `${assets2}/${dir}/${file}`;
            return { id, dir, path, host: host2, file, url };
          })
        )
      )
    ).flat(3);
    if (state.debug) console.log({ assets });
    if (args.length < 1) return state.api.trouble(elem, `FILE expects an argument, the dot suffix for desired files.`);
    if (!body?.length) return state.api.trouble(elem, "FILE expects indented blocks to follow.");
    const suffix = args[0];
    const choices = assets.filter((asset) => asset.file.endsWith(suffix));
    const flag = (choice) => `<img width=12 src=${choices[choice].host + "/favicon.png"}>`;
    if (!choices) return state.api.trouble(elem, `FILE expects to find an asset with "${suffix}" suffix.`);
    elem.innerHTML = command + `<br><div class=choices style="border:1px solid black; background-color:#f8f8f8; padding:8px;" >${choices.map(
      (choice, i) => `<span data-choice=${i} style="cursor:pointer;">
            ${flag(i)}
            ${choice.file} \u25B6
          </span>`
    ).join("<br>\n")}</div>`;
    elem.querySelector(".choices").addEventListener("click", (event) => {
      if (!("choice" in event.target.dataset)) return;
      const url = choices[event.target.dataset.choice].url;
      fetch(url).then((res) => res.text()).then((text) => {
        state.api.status(elem, command, ` \u21D2 ${text.length} bytes`);
        const prop = {};
        prop[suffix] = text;
        run(body, Object.assign(prop, state));
      });
    });
  }
  function kwic_emit({ elem, command, args, body, state }) {
    const template = body && body[0]?.command;
    if (template && !template.match(/\$[KW]/)) return state.api.trouble(elem, `KWIK expects $K or $W in link prototype.`);
    if (!("tsv" in state)) return state.api.trouble(elem, `KWIC expects a .tsv file, like from ASSETS .tsv.`);
    inspect(elem, "tsv", state);
    const prefix = args[0] || 1;
    const lines = state.tsv.trim().split(/\n/);
    const stop = /* @__PURE__ */ new Set(["of", "and", "in", "at"]);
    const page = $(elem.closest(".page")).data("data");
    const start = page.story.findIndex((item) => item.type == "pagefold" && item.text == "stop");
    if (start >= 0) {
      const finish = page.story.findIndex((item, i) => i > start && item.type == "pagefold");
      page.story.slice(start + 1, finish).map((item) => item.text.trim().split(/\s+/)).flat().forEach((word) => stop.add(word));
    }
    const groups = kwic(prefix, lines, stop);
    state.api.status(elem, command, ` \u21D2 ${lines.length} lines, ${groups.length} groups`);
    const link = (quote) => {
      let line = quote.line;
      if (template) {
        const substitute = template.replaceAll(/\$K\+/g, quote.key.replaceAll(/ /g, "+")).replaceAll(/\$K/g, quote.key).replaceAll(/\$W/g, quote.word);
        const target = template.match(/\$W/) ? quote.word : quote.key;
        line = line.replace(target, substitute);
      }
      return line;
    };
    state.items = groups.map((group) => {
      const text = `# ${group.group}

${group.quotes.map((quote) => link(quote)).join("\n")}`;
      return { type: "markdown", text };
    });
  }
  function show_emit({ elem, command, args, state }) {
    state.api.status(elem, command, "");
    let site, slug;
    if (args.length < 1) {
      if (state.info) {
        inspect(elem, "info", state);
        site = state.info.domain;
        slug = state.info.slug;
        state.api.status(elem, command, ` \u21D2 ${state.info.title}`);
      } else {
        return state.api.trouble(elem, `SHOW expects a slug or site/slug to open in the lineup.`);
      }
    } else {
      const info = args[0];
      [site, slug] = info.includes("/") ? info.split(/\//) : [null, info];
    }
    const lineup = [...document.querySelectorAll(".page")].map((e) => e.id);
    if (lineup.includes(slug)) return state.api.trouble(elem, `SHOW expects a page not already in the lineup.`);
    const page = elem.closest(".page");
    wiki.doInternalLink(slug, page, site);
  }
  function random_emit({ elem, command, state }) {
    if (!state.neighborhood) return state.api.trouble(elem, `RANDOM expected a neighborhood, like from NEIGHBORS.`);
    inspect(elem, "neighborhood", state);
    const infos = state.neighborhood;
    const many = infos.length;
    const one = Math.floor(Math.random() * many);
    state.api.status(elem, command, ` \u21D2 ${one} of ${many}`);
    state.info = infos[one];
  }
  function sleep_emit({ elem, command, args, body, state }) {
    let count = args[0] || "1";
    if (!count.match(/^[1-9][0-9]?$/)) return state.api.trouble(elem, `SLEEP expects seconds from 1 to 99`);
    return new Promise((resolve) => {
      if (body)
        run(body, state).then((result) => {
          if (state.debug) console.log(command, "children", result);
        });
      state.api.status(elem, command, ` \u21D2 ${count} remain`);
      let clock = setInterval(() => {
        if (--count > 0) state.api.status(elem, command, ` \u21D2 ${count} remain`);
        else {
          clearInterval(clock);
          state.api.status(elem, command, ` \u21D2 done`);
          if (state.debug) console.log(command, "done");
          resolve();
        }
      }, 1e3);
    });
  }
  function together_emit({ elem, command, args, body, state }) {
    if (!body) return state.api.trouble(elem, `TOGETHER expects indented commands to run together.`);
    const children = body.map((child) => run([child], state));
    return Promise.all(children);
  }
  async function get_emit({ elem, command, args, body, state }) {
    if (!body) return state.api.trouble(elem, `GET expects indented commands to run on the server.`);
    let share = {};
    let where = state.context.site;
    if (args.length) {
      for (const arg of args) {
        if (arg in state) {
          inspect(elem, arg, state);
          share[arg] = state[arg];
        } else if (arg.match(/\./)) where = arg;
        else {
          return state.api.trouble(elem, `GET expected "${arg}" to name state or site.`);
        }
      }
    }
    const slug = state.context.slug;
    const itemId = state.context.itemId;
    const query = `mech=${btoa(JSON.stringify(body))}&state=${btoa(JSON.stringify(share))}`;
    const url = `//${where}/plugin/mech/run/${slug}/${itemId}?${query}`;
    state.api.status(elem, command, ` \u21D2 in progress`);
    const start = Date.now();
    let result;
    try {
      result = await fetch(url).then((res) => res.ok ? res.json() : res.status);
      if ("err" in result) return state.api.trouble(elem, `RUN received error "${result.err}"`);
    } catch (err) {
      return state.api.trouble(elem, `RUN failed with "${err.message}"`);
    }
    state.result = result;
    for (const arg of result.mech.flat(9)) {
      const elem2 = document.getElementById(arg.key);
      if ("status" in arg) state.api.status(elem2, arg.command, ` \u21D2 ${arg.status}`);
      if ("trouble" in arg) state.api.trouble(elem2, arg.trouble);
    }
    if ("debug" in result.state) delete result.state.debug;
    Object.assign(state, result.state);
    const elapsed = ((Date.now() - start) / 1e3).toFixed(3);
    state.api.status(elem, command, ` \u21D2 ${elapsed} seconds`);
  }
  async function plugin_emit({ elem, command, args, body, state }) {
    if (!body) return state.api.trouble(elem, `GET expects indented commands to run on the server.`);
    let share = {};
    let where;
    if (args.length) {
      where = args[0];
      for (const arg of args.slice(1)) {
        if (arg in state) {
          inspect(elem, arg, state);
          share[arg] = state[arg];
        } else {
          return state.api.trouble(elem, `GET expected "${arg}" to name state.`);
        }
      }
    } else {
      return state.api.trouble(elem, `PLUGIN expected a plugin as way to run commands on the server.`);
    }
    const itemId = state.context.itemId;
    const query = `mech=${btoa(JSON.stringify(body))}&state=${btoa(JSON.stringify(share))}`;
    const url = `/plugin/${where}/mech?${query}`;
    state.api.status(elem, command, ` \u21D2 in progress`);
    const start = Date.now();
    let result;
    try {
      result = await fetch(url).then((res) => res.ok ? res.json() : { err: res.status });
      console.log("result", result);
      if ("err" in result) return state.api.trouble(elem, `PLUGIN received error "${result.err}"`);
    } catch (err) {
      return state.api.trouble(elem, `PLUGIN failed with "${err.message}"`);
    }
    state.result = result;
    for (const arg of result.mech.flat(9)) {
      const elem2 = document.getElementById(arg.key);
      if ("status" in arg) state.api.status(elem2, arg.command, ` \u21D2 ${arg.status}`);
      if ("trouble" in arg) state.api.trouble(elem2, arg.trouble);
    }
    if ("debug" in result.state) delete result.state.debug;
    Object.assign(state, result.state);
    const elapsed = ((Date.now() - start) / 1e3).toFixed(3);
    state.api.status(elem, command, ` \u21D2 ${elapsed} seconds`);
  }
  function delta_emit({ elem, command, args, body, state }) {
    const copy = (obj) => JSON.parse(JSON.stringify(obj));
    const size = (obj) => JSON.stringify(obj).length;
    if (args.length < 1) return state.api.trouble(elem, `DELTA expects argument, "have" or "apply" on client.`);
    if (body) return state.api.trouble(elem, `DELTA doesn't expect indented input.`);
    switch (args[0]) {
      case "have":
        const edits = state.context.page.journal.filter((item) => item.type != "fork");
        state.recent = edits[edits.length - 1].date;
        state.api.status(elem, command, ` \u21D2 ${new Date(state.recent).toLocaleString()}`);
        break;
      case "apply":
        if (!("actions" in state)) return state.api.trouble(elem, `DELTA apply expect "actions" as input.`);
        inspect(elem, "actions", state);
        const page = copy(state.context.page);
        const before = size(page);
        for (const action of state.actions) apply2(page, action);
        state.page = page;
        const after = size(page);
        state.api.status(elem, command, ` \u21D2 \u2206 ${((after - before) / before * 100).toFixed(1)}%`);
        break;
      default:
        state.api.trouble(elem, `DELTA doesn't know "${args[0]}".`);
    }
  }
  function roster_emit({ elem, command, state }) {
    if (!state.neighborhood) return state.api.trouble(elem, `ROSTER expected a neighborhood, like from NEIGHBORS.`);
    state.api.inspect(elem, "neighborhood", state);
    const infos = state.neighborhood;
    const sites = infos.map((info) => info.domain).filter(uniq);
    const any = (array) => array[Math.floor(Math.random() * array.length)];
    if (state.debug) console.log(infos);
    const items = [
      { type: "roster", text: "Mech\n" + sites.join("\n") },
      { type: "activity", text: `ROSTER Mech
SINCE 30 days` }
    ];
    state.api.status(elem, command, ` \u21D2 ${sites.length} sites`);
    state.items = items;
  }
  function lineup_emit({ elem, command, state }) {
    const items = state.api.lineupPages(elem).map((pageObject) => {
      const page = pageObject.getRawPage();
      const site = pageObject.getRemoteSite(state.api.host());
      const title = page.title || "Empty";
      const slug = asSlug(title);
      const text = page.story[0]?.text || "empty";
      return { type: "reference", site, slug, title, text };
    });
    state.api.status(elem, command, ` \u21D2 ${items.length} pages`);
    state.items = items;
  }
  function listen_emit({ elem, command, args, state }) {
    if (args.length < 1) return state.api.trouble(elem, `LISTEN expects argument, an action.`);
    const topic = args[0];
    let recent = Date.now();
    let count = 0;
    const handler = listen;
    handler.action = "publishSourceData";
    handler.id = elem.id;
    window.addEventListener("message", listen);
    $(".main").on("thumb", (evt, thumb) => console.log("jquery", { evt, thumb }));
    state.api.status(elem, command, ` \u21D2 ready`);
    function listen(event) {
      console.log({ event });
      const { data } = event;
      if (data.action == "publishSourceData" && (data.name == topic || data.topic == topic)) {
        count++;
        handler.count = count;
        if (state.debug) console.log({ count, data });
        if (count <= 100) {
          const now = Date.now();
          const elapsed = now - recent;
          recent = now;
          state.api.status(elem, command, ` \u21D2 ${count} events, ${elapsed} ms`);
        } else {
          window.removeEventListener("message", listen);
        }
      }
    }
  }
  function message_emit({ elem, command, args, state }) {
    if (args.length < 1) return state.api.trouble(elem, `MESSAGE expects argument, an action.`);
    const topic = args[0];
    const message = {
      action: "publishSourceData",
      topic,
      name: topic
    };
    window.postMessage(message, "*");
    state.api.status(elem, command, ` \u21D2 sent`);
  }
  async function solo_emit({ elem, command, state }) {
    if (!("aspect" in state)) return state.api.trouble(elem, `"SOLO" expects "aspect" state, like from "WALK".`);
    inspect(elem, "aspect", state);
    state.api.status(elem, command, "");
    const todo = state.aspect.map((each) => ({
      source: each.source || each.id,
      aspects: each.result
    }));
    const aspects = todo.reduce((sum, each) => sum + each.aspects.length, 0);
    state.api.status(elem, command, ` \u21D2 ${todo.length} sources, ${aspects} aspects`);
    const pageKey = elem.closest(".page").dataset.key;
    const doing = { type: "batch", sources: todo, pageKey };
    if (typeof window.soloListener == "undefined" || window.soloListener == null) {
      console.log("**** Adding solo listener");
      window.soloListener = soloListener;
      window.addEventListener("message", soloListener);
    }
    await delay(750);
    const popup = window.open("/plugins/solo/dialog/#", "solo", "popup,height=720,width=1280");
    if (popup.location.pathname != "/plugins/solo/dialog/") {
      console.log("launching new dialog");
      popup.addEventListener("load", (event) => {
        console.log("launched and loaded");
        popup.postMessage(doing, window.origin);
      });
    } else {
      console.log("reusing existing dialog");
      popup.postMessage(doing, window.origin);
    }
  }
  function popup_emit({ elem, args, state }) {
    const expand2 = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = [];
    switch (args[0]) {
      case "state":
        for (const key in state) {
          let value = state[key];
          if (value == null) continue;
          if (typeof value != "string") value = JSON.stringify(state[key], null, 2);
          html.push(
            `<details>
            <summary>${key}</summary>
            <pre style="white-space: pre-wrap;">${expand2(value)}</pre>
          </details>`
          );
        }
        break;
      case "images":
        if (!state.commons)
          return state.api.trouble(elem, `POPUP images expects "commons" state, like from "GET" "COMMONS"`);
        const where = args[1] == "all" ? state.commons.all : state.commons.here;
        for (const item of where.items) {
          html.push(`<span><img height=200 src=/assets/plugins/image/${item}></span>`);
        }
        break;
      default:
        return state.api.trouble(elem, `POPUP doesn't know "${args[0]}".`);
    }
    wiki.dialog(elem.innerText, html.join("\n"));
  }
  async function print_emit({ elem, command, args, state }) {
    if (!["outline", "draft"].includes(args[0])) return state.api.trouble(elem, "Expects PRINT outline or PRINT draft.");
    const way = args[0];
    if (!state.aspect) return state.api.trouble(elem, `PRINT expects "aspect", like from WALK clicks.`);
    state.api.inspect(elem, "aspect", state);
    if (!state.neighborhood) return state.api.trouble(elem, `PRINT expectes "neighborhood", like from NEIGHBORS.`);
    state.api.inspect(elem, "neighborhood", state);
    const aspect = state.aspect;
    const neighborhood2 = state.neighborhood;
    console.log("print", { aspect, neighborhood: neighborhood2 });
    const print = [];
    const tally = { missing: [], omitted: [], domains: [], forks: [], wishes: [], errors: [] };
    const explain = {};
    const count = (hits, what, slug) => {
      if (!(what in hits)) hits[what] = [];
      hits[what].push(slug);
    };
    const report2 = (counter, heading) => {
      const hits = tally[counter];
      console.log("explain", counter, explain[counter]);
      const hash = (s) => Math.abs(s.split("").reduce((h2, c) => c.charCodeAt(0) + (h2 << 6) + (h2 << 16) - h2, 0)).toString(16);
      const keys = Object.keys(hits).toSorted((a, b) => hits[b].length - hits[a].length);
      if (keys.length) {
        const details = [];
        for (const what of keys) {
          const list = hits[what].filter(uniq3).sort().map((slug) => `[[${slug}]]`).join("\n");
          details.push(`<details><summary>${what} \xD7 ${hits[what].length}</summary>
          <pre>${list}</pre></details>`);
        }
        items.push({ type: "markdown", text: `# ${heading}
${explain[counter] || ""}`, id: hash(heading) });
        if (keys[0].match(/\.\w+\.\w+$/)) items.push({ type: "roster", text: keys.join("\n") });
        items.push({ type: "html", text: details.join("\n ") });
      }
    };
    const timestamp = (/* @__PURE__ */ new Date()).toString().replace(/ *\(.*\)/, "");
    const items = [
      { type: "paragraph", text: `From ${timestamp}` },
      { type: "solo", text: "INCLUDED", aspects: aspect[0].result }
    ];
    print.push(`<h1>Story</h1>`);
    const clicks = aspect.find((each) => each.source.match(/^WALK.*clicks/));
    if (!clicks) return state.api.trouble(elem, `PRINT needs aspect from WALK clicks`);
    const story = clicks.result.map((each) => each.name);
    await output(story, "story");
    print.push(`<h1>Garden</h1>`);
    const garden = clicks.result.map((each) => each.graph.nodes.map((node) => node.props)).flat();
    const uniq3 = (value, index, self) => self.indexOf(value) === index;
    const slugs = garden.map((props) => asSlug(props.name.replaceAll("\n", " "))).filter(uniq3).filter((slug) => !story.includes(slug)).sort();
    await output(slugs, "garden");
    console.log({ tally, explain });
    report2("domains", "Sourced Sites");
    report2("missing", "Missing Pages");
    report2("omitted", "Omitted Links");
    report2("forks", "Omitted Forks");
    report2("wishes", "Unusual Plugins");
    report2("errors", "Program Errors");
    if (items.length) state.items = items;
    state.api.status(elem, command, ` \u21D2 ${story.length} story, ${slugs.length} garden`);
    state.api.download(print.join("\n"), `print-${way}.html`, "text/html");
    async function output(slugs2, section) {
      const style = `style="width:640px"`;
      const expand2 = (text) => {
        return text.replaceAll(/\[\[(.*?)\]\]/g, (m, p1) => `<a href="#${asSlug(p1)}">${p1}</a>`).replaceAll(/\[.*? (.*?)\]/g, (m, p1) => `<i>${p1}</i>`);
      };
      for (const slug of slugs2) {
        const info = neighborhood2.find((info2) => info2.slug == slug);
        if (!info) {
          count(tally.missing, section, slug);
          explain.missing = `These pages weren't found in PRINT's neighborhood.`;
          continue;
        }
        count(tally.domains, info.domain, info.slug);
        explain.domains = `Pages have been retrieved from these sites. Remove sites from the PRINT neighborhood if these should be found elsewhere.`;
        if (section == "garden") {
          for (const link in info.links) if (!slugs2.includes(link)) count(tally.omitted, slug, link);
          explain.omitted = `Garden pages with links to pages omitted from the garden. These may show up with a deeper WALK into the garden'`;
        }
        if (way == "outline")
          print.push(
            `<p id="${info.slug}" ${style}"><b title="${info.domain}">${info.title}</b> -- ${expand2(info.synopsis)}</p>`
          );
        else {
          const where = slugs2.indexOf(slug) + 1;
          state.api.status(elem, command, ` \u21D2 ${where} of ${slugs2.length} from ${section}`);
          try {
            console.log(info.domain, info.title);
            const page = await state.api.jfetch(`//${info.domain}/${info.slug}.json`);
            print.push(`<section id="${info.slug}"><h3 title="${info.domain}">${info.title}</h3>`);
            for (const item of page.story) {
              if (item.type != "paragraph") count(tally.wishes, item.type, slug);
              explain.wishes = 'Items of type "paragraph" are expected. Types "markdown" and "html" may show without revision. The remainder appear as only a one-line note.';
              switch (item.type) {
                case "paragraph":
                  print.push(`<p ${style}>${expand2(item.text)}</p>`);
                  break;
                case "markdown":
                  print.push(expand2(md(item.text)));
                  break;
                case "html":
                  print.push(`<p ${style}>${expand2(state.api.closeTags(item.text))}</p>`);
                  break;
                default:
                  print.push(`<p ${style}>Item type "${item.type}" omitted.</p>`);
              }
            }
            for (const action of page.journal) {
              if (action.site && !neighborhood2.find((info2) => info2.domain == action.site))
                count(tally.forks, action.site, slug);
              explain.forks = "Wiki remembers where pages may once have lived but PRINT only looks for pages in the neighborhoods prvided.";
            }
            print.push(`</section>`);
          } catch (err) {
            count(tally.errors, err.message, info.slug);
            explain.errors = "Any pages that lead to program errors should be explored by developers. Until then they will be ignored.";
          }
        }
      }
    }
  }
  async function code_emit({ elem, command, args, body, state, initiator }) {
    const key = state.api.thisLineupKey(elem);
    const pageObject = state.api.lineupAtKey(key);
    const story = pageObject.getRawPage().story;
    const codes = story.filter((item) => item.type == "code");
    const owned = window.isOwner && !pageObject.isRemote();
    if (!codes) return state.api.trouble(elem, `CODE expects the Code plugin in use on this page.`);
    if (!(initiator || owned))
      return state.api.trouble(elem, `This CODE must be run by CLICK or TICK or owned by the logged in user.`);
    const code = codes.map((item) => item.text).join("\n");
    const way = args.length ? args[0] : "default";
    const api2 = {
      trouble(message) {
        state.api.trouble(elem, message);
      },
      response(text) {
        state.api.response(elem, text);
      },
      status(text) {
        state.api.status(elem, command, text);
      },
      report(text) {
        state.api.report(elem, command, text);
      },
      graph(nodes = [], rels = []) {
        return new Graph(nodes, rels);
      },
      body() {
        return body;
      }
    };
    const handler = {
      get(target, prop) {
        if (prop == "api") return api2;
        state.api.inspect(elem, prop, target);
        return target[prop];
      }
    };
    try {
      const module = await import(`data:text/javascript;base64,${btoa(code)}`);
      if (!(way in module)) return api2.trouble(`Expected export of function "${way}".`);
      const proxy = new Proxy(state, handler);
      const result = await module[way].apply(proxy, args.slice(1));
      if (typeof result != "undefined") state.api.status(elem, command, ` \u21D2 ${result}`);
    } catch (err) {
      let lines = code.split(/\n/);
      let listing = lines.map((line, i) => `${i + 1} ${line}`).join("\n");
      let message = err.message;
      let ln = err.line ?? err.lineNumber;
      let cn = err.columnNumber;
      if (ln) {
        let line = lines[ln - 1];
        if (cn)
          message += `<span class=code>${line.substring(0, cn - 1)}<font color=red>\u2716\uFE0E</font>${line.substring(cn - 1)}</span>`;
        else message += `<span class=code>${line}</span>`;
      }
      return state.api.trouble(elem, message);
    }
  }
  async function download_emit({ elem, command, args, state }) {
    const types = {
      txt: "text/plain",
      html: "text/html",
      csv: "text/csv",
      tsv: "text/tsv",
      json: "application/json"
    };
    if (!args.length) return state.api.trouble(elem, `DOWNLOAD expects an argument, a file name to use when downloaded.`);
    const m = args[0].match(/^.+\.(txt|html|csv|tsv|json)$/);
    console.log(m);
    if (!m) return state.api.trouble(elem, `DOWNLOAD expects a familiar suffix, one of txt, html, csv, tsv, or json.`);
    const [file, suffix] = m;
    if (!(suffix in state)) return state.api.trouble(elem, `DOWNLOAD expects to find "${suffix}" in state.`);
    const string = suffix == "json" ? JSON.stringify(state.json) : state[suffix];
    state.api.status(elem, command, ` \u21D2 ${string.length} bytes`);
    state.api.download(string, file, types[suffix]);
  }
  var blocks = {
    CLICK: { emit: click_emit },
    HELLO: { emit: hello_emit },
    FROM: { emit: from_emit },
    SENSOR: { emit: sensor_emit },
    REPORT: { emit: report_emit },
    SOURCE: { emit: source_emit },
    PREVIEW: { emit: preview_emit },
    NEIGHBORS: { emit: neighbors_emit },
    WALK: { emit: walk_emit },
    TICK: { emit: tick_emit },
    UNTIL: { emit: until_emit },
    FORWARD: { emit: forward_emit },
    TURN: { emit: turn_emit },
    FILE: { emit: file_emit },
    KWIC: { emit: kwic_emit },
    SHOW: { emit: show_emit },
    RANDOM: { emit: random_emit },
    SLEEP: { emit: sleep_emit },
    TOGETHER: { emit: together_emit },
    PLUGIN: { emit: plugin_emit },
    GET: { emit: get_emit },
    DELTA: { emit: delta_emit },
    ROSTER: { emit: roster_emit },
    LINEUP: { emit: lineup_emit },
    LISTEN: { emit: listen_emit },
    MESSAGE: { emit: message_emit },
    SOLO: { emit: solo_emit },
    POPUP: { emit: popup_emit },
    PRINT: { emit: print_emit },
    CODE: { emit: code_emit },
    DOWNLOAD: { emit: download_emit }
  };

  // vendor/mech/interpreter.js
  function expand(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function tree(lines, here, indent) {
    while (lines.length) {
      let m = lines[0].match(/( *)(.*)/);
      let spaces = m[1].length;
      let command = m[2];
      if (spaces == indent) {
        here.push({ command });
        lines.shift();
      } else if (spaces > indent) {
        var more = [];
        here.push(more);
        tree(lines, more, spaces);
      } else {
        return here;
      }
    }
    return here;
  }
  function format(nest) {
    const unique = Math.floor(Math.random() * 1e6);
    const block = (more, path) => {
      const html = [];
      for (const part of more) {
        const key = `${unique}.${path.join(".")}`;
        part.key = key;
        if ("command" in part) html.push(`<div></div><span id=${key} class=block >${expand(part.command)}</span>`);
        else html.push(`<div id=${key} class=body>${block(part, [...path, 0])}</div>`);
        path[path.length - 1]++;
      }
      return html.join(`
`);
    };
    return block(nest, [0]);
  }

  // src/trace.mjs
  var SKIP = /* @__PURE__ */ new Set(["context", "api", "debug"]);
  function makeTracer(onEvent) {
    const raw = /* @__PURE__ */ new WeakMap();
    function unwrap(state) {
      return raw.get(state) || state;
    }
    function wrap(state, who) {
      const target = unwrap(state);
      const note = (kind, key, value) => {
        if (typeof key != "string" || SKIP.has(key)) return;
        onEvent({ kind, key, who, value, at: Date.now() });
      };
      const view = new Proxy(target, {
        get(t, k2, r) {
          if (typeof k2 == "string" && !SKIP.has(k2)) note(k2 in t ? "read" : "miss", k2, t[k2]);
          return Reflect.get(t, k2, r);
        },
        has(t, k2) {
          const here = Reflect.has(t, k2);
          if (!here) note("miss", k2);
          return here;
        },
        set(t, k2, v, r) {
          const ok = Reflect.set(t, k2, v, r);
          note("write", k2, v);
          return ok;
        },
        deleteProperty(t, k2) {
          const ok = Reflect.deleteProperty(t, k2);
          note("delete", k2);
          return ok;
        }
      });
      raw.set(view, target);
      return view;
    }
    return { wrap, unwrap };
  }
  function instrument(blocks2, tracer2, onBlock) {
    for (const [op, block] of Object.entries(blocks2)) {
      if (block.__traced) continue;
      const emit2 = block.emit;
      blocks2[op] = {
        __traced: true,
        emit(stuff) {
          const who = stuff.elem && stuff.elem.id || op;
          onBlock({ phase: "start", who, op, command: stuff.command });
          stuff.state = tracer2.wrap(stuff.state, who);
          let result;
          try {
            result = emit2(stuff);
          } catch (err) {
            onBlock({ phase: "end", who, op, error: err.message });
            throw err;
          }
          Promise.resolve(result).then(
            () => onBlock({ phase: "end", who, op }),
            (err) => onBlock({ phase: "end", who, op, error: err && err.message })
          );
          return result;
        }
      };
    }
    return blocks2;
  }
  function preview(value, limit = 160) {
    if (value == null) return String(value);
    if (typeof value == "string") return value.length > limit ? value.slice(0, limit) + "\u2026" : value;
    if (Array.isArray(value)) return `${value.length} item${value.length == 1 ? "" : "s"}`;
    if (typeof value == "object") {
      let s;
      try {
        s = JSON.stringify(value);
      } catch {
        s = "{\u2026}";
      }
      return s.length > limit ? s.slice(0, limit) + "\u2026" : s;
    }
    return String(value);
  }

  // src/aspect.mjs
  var PALETTE = ["#1d4ed8", "#15803d", "#b45309", "#7c3aed", "#be185d", "#0f766e", "#c2410c", "#4b5563"];
  function aspectGraphs(aspect) {
    const out = [];
    for (const each of aspect || []) {
      for (const r of each.result || []) if (r && r.graph && r.graph.nodes) out.push({ name: r.name, graph: r.graph, source: each.source || each.id });
    }
    return out;
  }
  function aspectToGraphJSON(aspect, title = "Mech aspect", { maxNodes = 400 } = {}) {
    const graphs = aspectGraphs(aspect);
    const nodes = /* @__PURE__ */ new Map();
    const edges = /* @__PURE__ */ new Map();
    const degree = /* @__PURE__ */ new Map();
    let dropped = 0;
    const keyOf = (n) => `${n.type || "Node"}\0${n.props && n.props.name || ""}`;
    for (const { graph } of graphs) {
      const ids = graph.nodes.map((n) => {
        const k2 = keyOf(n);
        if (!nodes.has(k2)) {
          if (nodes.size >= maxNodes) {
            dropped++;
            return null;
          }
          nodes.set(k2, { key: k2, type: n.type || "Node", name: n.props && n.props.name || "(unnamed)", props: n.props || {} });
        }
        return k2;
      });
      for (const r of graph.rels || []) {
        const a = ids[r.from], b = ids[r.to];
        if (!a || !b) continue;
        const ek = `${a}\0${b}\0${r.type || ""}`;
        if (edges.has(ek)) continue;
        edges.set(ek, { a, b, type: r.type || "" });
        degree.set(a, (degree.get(a) || 0) + 1);
        degree.set(b, (degree.get(b) || 0) + 1);
      }
    }
    const types = [...new Set([...nodes.values()].map((n) => n.type))];
    const colorOf = (t) => PALETTE[types.indexOf(t) % PALETTE.length];
    const idOf = /* @__PURE__ */ new Map();
    const outNodes = [];
    types.forEach((t, col) => {
      const list = [...nodes.values()].filter((n) => n.type == t).sort((x2, y2) => (degree.get(y2.key) || 0) - (degree.get(x2.key) || 0) || x2.name.localeCompare(y2.name));
      list.forEach((n, row) => {
        const id = `n${outNodes.length + 1}`;
        idOf.set(n.key, id);
        const w = Math.min(220, Math.max(96, 18 + n.name.length * 7));
        outNodes.push({
          id,
          label: n.name,
          x: 160 + col * 280,
          y: 80 + row * 70,
          w,
          h: 48,
          shape: "rounded",
          note: `${t} \xB7 from Mech`,
          props: { mechType: t, ...flat(n.props) },
          fontSize: 12,
          fontColor: "#000000",
          color: "#ffffff",
          borderColor: colorOf(t),
          borderWidth: 2,
          borderDash: "solid",
          extraLabels: [],
          icon: ""
        });
      });
    });
    const outEdges = [...edges.values()].map((e, i) => ({
      id: `e${i + 1}`,
      src: idOf.get(e.a),
      tgt: idOf.get(e.b),
      label: e.type,
      arrowDir: "forward",
      color: "#64748b",
      width: 1.5,
      dash: "solid",
      fontSize: 10,
      fontColor: "#000000",
      curved: true,
      polarity: "none",
      props: {}
    }));
    const sources = [...new Set(graphs.map((g) => g.source).filter(Boolean))];
    return {
      version: "1.0",
      mode: "select",
      modelName: title,
      canvasBg: "#ffffff",
      modelNote: `Drawn from Mech state.aspect: ${graphs.length} aspect${graphs.length == 1 ? "" : "s"}` + (sources.length ? ` from ${sources.join("; ")}` : "") + `. Columns are node types: ${types.join(", ")}.` + (dropped ? ` ${dropped} nodes beyond the first ${maxNodes} were left out.` : ""),
      graphAttrs: {},
      cldLoopNames: {},
      legendEntries: [],
      legendVisible: false,
      legendCollapsed: false,
      customSymbols: [],
      nodes: outNodes,
      edges: outEdges,
      lines: [],
      metaEdges: []
    };
  }
  function flat(props) {
    const out = {};
    for (const [k2, v] of Object.entries(props || {})) {
      if (k2 == "name") continue;
      out[k2] = typeof v == "object" ? JSON.stringify(v) : String(v);
    }
    return out;
  }

  // build/mech-blocks.html
  var mech_blocks_default = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mech Blocks</title>
<!--
  Mech Blocks \u2014 a drag-and-drop block view of Ward Cunningham's Mech scripts
  (github.com/WardCunningham/wiki-plugin-mech, handbook mech.fed.wiki).

  The Mech text is what is stored. Blocks are a second view of that same text:
  every drag rewrites lines and indentation, and nothing else, so the text that
  comes out is ordinary Mech that Ward's interpreter, journal, fork and search
  all keep working on. Untouched text comes back byte for byte.

  Three borrowings, from the programs that inspired Mech:
    Scratch \u2014 C-shaped blocks with a mouth; a CLICK with nothing inside shows it.
    Snap!   \u2014 each block says what state it needs and makes; a drop where the
              need is missing is flagged while you drag, not after you run.
    Etoys   \u2014 drop a wiki page link on the script to get FROM site/slug.

  It does not run Mech. The checks are Ward's own trouble messages, read from
  the source, applied before running. The block catalog below is the
  machine-readable list that the design note proposes adding to blocks.js.

  Tests: node tools/test-mech-blocks.js (every mech item on mech.fed.wiki).
  Marc Pierson and Claude Opus 5.5, October 2026.
-->
<style>
  :root {
    --bg: #fbfaf6; --card: #ffffff; --ink: #000000; --line: #cfcfcf; --soft: #f3f1ea;
    --red: #b91c1c; --amber: #b45309; --green: #15803d; --blue: #1d4ed8;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; }
  header { padding: 18px 16px 6px; max-width: 1400px; margin: 0 auto; }
  h1 { font-size: 28px; margin: 0 0 2px; }
  .byline { font-weight: 700; font-size: 14px; margin: 0 0 8px; }
  .lede { margin: 0; max-width: 820px; }
  .bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px 16px; max-width: 1400px; margin: 0 auto; }
  button, select { font: inherit; font-size: 15px; color: var(--ink); background: #fff; border: 2px solid #000; border-radius: 8px; padding: 4px 12px; cursor: pointer; }
  button:hover { background: var(--soft); }
  select { max-width: 340px; }
  .flash-msg { font-size: 14px; color: var(--green); font-weight: 700; }
  #saveWiki { background: #000; color: #fff; }
  #saveWiki:hover { background: #333; }

  main { display: grid; grid-template-columns: 230px minmax(0, 1fr) 340px; gap: 14px; padding: 0 16px 30px; max-width: 1400px; margin: 0 auto; align-items: start; }
  @media (max-width: 1000px) { main { grid-template-columns: 1fr; } }
  .panel { background: var(--card); border: 2px solid #000; border-radius: 10px; padding: 10px 12px; }
  .panel h2 { font-size: 16px; margin: 0 0 6px; }
  .hint { font-size: 13px; opacity: .75; margin: 0 0 8px; }

  /* palette */
  #palette { position: sticky; top: 8px; max-height: calc(100vh - 16px); overflow: auto; }
  #palette.trash-hot { outline: 4px solid var(--red); }
  .pgroup { margin: 8px 0 2px; font-size: 13px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; color: var(--g); }
  .ptile { display: block; margin: 3px 0; padding: 3px 8px; background: #fff; border: 2px solid var(--g); border-left-width: 7px; border-radius: 7px; cursor: grab; user-select: none; touch-action: none; font-size: 14px; }
  .ptile b { letter-spacing: .02em; }
  .ptile span { opacity: .65; }

  /* script canvas */
  #canvas { position: relative; min-height: 360px; padding-bottom: 40px; }
  .tile { position: relative; margin: 4px 0; background: #fff; border: 2px solid var(--g); border-left-width: 8px; border-radius: 8px; }
  .tile.hat { border-top-left-radius: 20px; }
  .head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; padding: 5px 10px; cursor: grab; user-select: none; touch-action: none; min-height: 34px; }
  .head .op { font-weight: 800; letter-spacing: .03em; color: var(--g); }
  .head .args { padding: 0 4px; border-radius: 4px; border: 1px dashed transparent; cursor: text; min-width: 1em; }
  .head .args:hover { border-color: #999; }
  .head .args.empty { font-style: italic; opacity: .5; }
  .head input.edit { font: inherit; font-size: 15px; border: 2px solid var(--blue); border-radius: 5px; padding: 0 5px; min-width: 12em; }
  .chip { font-size: 12px; border-radius: 999px; padding: 0 8px; border: 1.5px solid; white-space: nowrap; }
  .chip.make { border-color: #6b7280; color: #374151; }
  .chip.need { border-color: var(--green); color: var(--green); }
  .chip.need.missing { border-color: var(--amber); color: #fff; background: var(--amber); }
  .chip.need.maybe { border-style: dashed; border-color: var(--amber); color: var(--amber); }
  .trouble { font-size: 13px; padding: 0 6px; border: 1.5px solid var(--red); color: var(--red); border-radius: 5px; background: #fff; line-height: 1.4; }
  .trouble.warn { border-color: var(--amber); color: var(--amber); }
  .msg { flex-basis: 100%; font-size: 14px; color: var(--red); }
  .msg.warn { color: var(--amber); }
  .mouth { margin: 0 0 0 16px; padding: 2px 8px 4px 0; min-height: 10px; }
  .mouth-empty { margin: 2px 0; padding: 6px 10px; border: 2px dashed var(--g); border-radius: 7px; font-size: 13px; opacity: .7; }
  .mouth-empty.required { opacity: 1; background: #fffbeb; }
  .foot { height: 12px; border-top: 2px solid var(--g); background: color-mix(in srgb, var(--g) 14%, white); border-radius: 0 0 6px 6px; }
  .tile.data { border-style: dashed; border-left-width: 2px; }
  .tile.data .head { font-style: italic; }
  .tile.blank .head { opacity: .5; font-size: 13px; min-height: 24px; padding: 2px 10px; }
  .tile.unknown { --g: var(--red); }
  .tile.unused { opacity: .45; border-style: dashed; }
  .group-orphan { border: 2px dashed var(--red); border-radius: 8px; padding: 4px 6px; margin: 4px 0; }
  .group-orphan > .label { font-size: 13px; color: var(--red); }
  .tile.dragging { opacity: .25; }
  .tile.flash { outline: 4px solid #93c5fd; }
  .ghost { position: fixed; pointer-events: none; z-index: 20; opacity: .9; max-width: 420px; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
  #dropbar { position: absolute; height: 5px; border-radius: 3px; background: var(--green); pointer-events: none; display: none; z-index: 10; }
  #dropbar.warn { background: var(--amber); }
  #drophint { position: fixed; z-index: 21; pointer-events: none; display: none; font-size: 13px; background: var(--amber); color: #fff; border-radius: 6px; padding: 2px 8px; max-width: 360px; }
  .endslot { margin-top: 8px; padding: 8px; border: 2px dashed var(--line); border-radius: 8px; font-size: 13px; opacity: .65; }
  #canvas.urlhot .endslot { border-color: var(--blue); opacity: 1; }
  #dropbar.no { background: var(--red); }
  #drophint.no { background: var(--red); }
  #cursorbar { position: absolute; height: 0; border-top: 3px dashed var(--blue); pointer-events: none; display: none; z-index: 9; }
  #cursorbar span { position: absolute; right: 0; top: 1px; font-size: 11px; color: var(--blue); background: var(--card); padding: 0 4px; }
  .tile.selected > .head { outline: 3px solid #93c5fd; outline-offset: -2px; border-radius: 6px; }

  /* what passes between blocks: icon + word, family colour */
  .chip.need, .chip.make { border-color: var(--f); color: var(--f); }
  .chip.make { background: var(--f); color: #fff; }
  .chip.need.missing { border-color: var(--amber); color: #fff; background: var(--amber); }
  .chip.need.maybe { border-style: dashed; }
  .chip.make.stuck { background: #fff; color: #9ca3af; border-color: #d1d5db; border-style: dashed; text-decoration: line-through; }
  .chip.shows { border-color: var(--green); color: var(--green); font-weight: 700; }

  /* the three lamps */
  .lamps { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 4px; }
  .lamp { font-size: 14px; border: 2px solid #9ca3af; border-radius: 999px; padding: 1px 10px; color: #4b5563; background: #fff; }
  .lamp b { color: #9ca3af; }
  .lamp.on { border-color: var(--green); color: var(--ink); }
  .lamp.on b { color: var(--green); }
  #lampwhy { font-size: 13px; color: var(--amber); min-height: 18px; margin: 0 0 6px; }
  .legend { font-size: 12px; opacity: .8; margin: 0 0 8px; display: flex; flex-wrap: wrap; gap: 4px 10px; }
  .ptile.nofit { opacity: .3; filter: grayscale(1); }
  .mode { display: inline-flex; align-items: center; gap: 6px; border: 2px solid #000; border-radius: 8px; padding: 3px 10px; background: #fff; cursor: pointer; font-size: 15px; }
  .mode input { width: 18px; height: 18px; margin: 0; }

  /* text and checks */
  #side { position: sticky; top: 8px; }
  textarea { width: 100%; min-height: 260px; font: 15px/1.45 ui-monospace, Menlo, monospace; color: var(--ink); background: #fff; border: 2px solid var(--line); border-radius: 8px; padding: 8px; white-space: pre; overflow-wrap: normal; overflow-x: auto; }
  textarea:focus { outline: 3px solid #93c5fd; }
  #checks { list-style: none; padding: 0; margin: 6px 0 0; font-size: 14px; }
  #checks li { padding: 4px 6px; border-left: 5px solid var(--red); margin: 0 0 5px; background: #fff; cursor: pointer; }
  #checks li.warn { border-color: var(--amber); }
  #checks li.ok { border-color: var(--green); cursor: default; }
  footer { max-width: 1400px; margin: 0 auto; padding: 4px 16px 40px; font-size: 14px; }
  footer p { max-width: 900px; }
</style>
</head>
<body>
<header>
  <h1>Mech Blocks</h1>
  <p class="byline">Marc Pierson and Claude Opus 5.5 \xB7 October 2026</p>
  <p class="lede">Build a Mech script by dragging blocks. The text on the right is what FedWiki stores, and it is rewritten on every drag. Type in the text and the blocks follow. Each block shows what it <b>needs</b> and what it <b>makes</b>, as an icon and a word. Three lamps say whether the script fits together, whether it can be started, and whether it ends in a result. In <b>beginner mode</b> a block that would not fit cannot be dropped.</p>
</header>
<div class="bar">
  <label>Handbook script <select id="examples"></select></label>
  <label class="mode" title="Blocks that would not fit cannot be dropped, and the palette greys out what cannot go at the blue line"><input type="checkbox" id="beginner"> Beginner mode</label>
  <button id="undo" title="Undo the last block change (Cmd/Ctrl-Z)">Undo</button>
  <button id="copyText">Copy Mech text</button>
  <button id="copyCatalog" title="The machine-readable block list proposed for Mech's blocks.js">Copy block catalog</button>
  <button id="saveWiki" hidden title="Write this script back into the Mech item on the wiki page">Save to wiki</button>
  <span class="flash-msg" id="flash"></span>
</div>
<main>
  <section class="panel" id="palette" aria-label="Blocks">
    <h2>Blocks</h2>
    <p class="hint">Drag onto the script, or tap to add at the blue line. Drag a block back here to remove it.</p>
    <div id="ptiles"></div>
  </section>
  <section class="panel" aria-label="Script">
    <h2>Script</h2>
    <div class="lamps" id="lamps"></div>
    <div id="lampwhy"></div>
    <div class="legend" id="legend"></div>
    <p class="hint">Drag by the block's name; tap a name to put the blue line after it. Click the words after the name to edit them. Drop a wiki page link here to get a FROM block.</p>
    <div id="canvas"></div>
  </section>
  <section id="side">
    <div class="panel">
      <h2>Mech text</h2>
      <textarea id="text" spellcheck="false" aria-label="Mech text"></textarea>
    </div>
    <div class="panel" style="margin-top:14px">
      <h2>Before you run it</h2>
      <ul id="checks"></ul>
    </div>
  </section>
</main>
<footer>
  <p>This prototype does not run Mech. The checks use the trouble messages from Ward's own blocks, applied before the script runs instead of after. The state each block needs and makes comes from reading <code>blocks.js</code>; it lives below as a catalog that could move into Mech itself.</p>
  <p>Ward Cunningham wrote Mech and its handbook at mech.fed.wiki. Mech Blocks: Marc Pierson and Claude Opus 5.5, October 2026.</p>
</footer>
<div id="drophint"></div>

<script id="corpus" type="application/json">[{"site":"mech.fed.wiki","slug":"about-block-template","title":"About Block Template","text":"HELLO"},{"site":"mech.fed.wiki","slug":"about-mech-plugin","title":"About Mech Plugin","text":"HELLO"},{"site":"mech.fed.wiki","slug":"about-mech-plugin","title":"About Mech Plugin","text":"HELLO world"},{"site":"mech.fed.wiki","slug":"about-mech-plugin","title":"About Mech Plugin","text":"CLICK\\n  HELLO\\n  HELLO world"},{"site":"mech.fed.wiki","slug":"about-mech-plugin","title":"About Mech Plugin","text":"CLICK\\nHELLO"},{"site":"mech.fed.wiki","slug":"catalog-of-mech-blocks","title":"Catalog of Mech Blocks","text":"CODE"},{"site":"mech.fed.wiki","slug":"catalog-of-variables","title":"Catalog of Variables","text":"CLICK\\n FROM mech.fed.wiki/catalog-of-mech-blocks\\n  CODE blocks\\n  CODE variables\\n CLICK\\n  PREVIEW synopsis items\\n CLICK\\n  SOLO\\n CLICK\\n  POPUP state\\n"},{"site":"mech.fed.wiki","slug":"click","title":"CLICK","text":"CLICK\\n HELLO"},{"site":"mech.fed.wiki","slug":"commons","title":"COMMONS","text":"GET\\n COMMONS"},{"site":"mech.fed.wiki","slug":"file","title":"FILE","text":"FILE .txt"},{"site":"mech.fed.wiki","slug":"forward","title":"FORWARD","text":"TICK 5\\n FORWARD 20"},{"site":"mech.fed.wiki","slug":"from","title":"FROM","text":"FROM fed.wiki/welcome-visitors\\n HELLO"},{"site":"mech.fed.wiki","slug":"get","title":"GET","text":"GET\\n UPTIME"},{"site":"mech.fed.wiki","slug":"hello","title":"HELLO","text":"HELLO world"},{"site":"mech.fed.wiki","slug":"how-blocks-cooperate","title":"How Blocks Cooperate","text":"CLICK\\n NEIGHBORS fed.wiki\\n WALK 10 steps\\n PREVIEW graph"},{"site":"mech.fed.wiki","slug":"lineup","title":"LINEUP","text":"LINEUP"},{"site":"mech.fed.wiki","slug":"listen","title":"LISTEN","text":"LISTEN hello"},{"site":"mech.fed.wiki","slug":"message","title":"MESSAGE","text":"CLICK\\n MESSAGE hello"},{"site":"mech.fed.wiki","slug":"neighbors","title":"NEIGHBORS","text":"NEIGHBORS fed.wiki\\n Journal Fork Survey"},{"site":"mech.fed.wiki","slug":"plugin","title":"PLUGIN","text":"PLUGIN coauthor\\n HELLO"},{"site":"mech.fed.wiki","slug":"popup","title":"POPUP","text":"CLICK\\n GET\\n  COMMONS\\n POPUP images"},{"site":"mech.fed.wiki","slug":"print","title":"PRINT","text":"PRINT outline"},{"site":"mech.fed.wiki","slug":"random","title":"RANDOM","text":"NEIGHBORS\\nRANDOM"},{"site":"mech.fed.wiki","slug":"roster","title":"ROSTER","text":"NEIGHBORS\\nROSTER"},{"site":"mech.fed.wiki","slug":"sensor","title":"SENSOR","text":"FROM found.ward.fed.wiki/esp8266-datalog\\n SENSOR garage\\n  REPORT"},{"site":"mech.fed.wiki","slug":"show","title":"SHOW","text":"CLICK\\n SHOW about-paragraph-plugin"},{"site":"mech.fed.wiki","slug":"sleep","title":"SLEEP","text":"CLICK\\n SLEEP 5\\n HELLO"},{"site":"mech.fed.wiki","slug":"solo","title":"SOLO","text":"SOURCE aspect\\nSOLO"},{"site":"mech.fed.wiki","slug":"testing-lineup-freeze-mech","title":"Testing Lineup Freeze Mech","text":"CLICK\\n NEIGHBORS wiki\\n ROSTER\\n PREVIEW synopsis items"},{"site":"mech.fed.wiki","slug":"testing-lineup-freeze-mech","title":"Testing Lineup Freeze Mech","text":"CLICK\\n LINEUP\\n PREVIEW synopsis items"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"HELLO\\nHELLO world"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"CLICK\\n  HELLO world"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"TICK 5\\n HELLO"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"CLICK\\n  HELLO\\n  CLICK\\n    HELLO\\n    HELLO world"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"CLICK\\n  HELLO\\nCLICK\\n  HELLO world"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"CLICK\\nCLICK\\n  CLICK"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"CLACK\\n  HELLO\\nClunk\\n  HELLO"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"   \\n    "},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"https://www.google.com/search?q=history+of+jquery&oq=history+of+jquery&gs_lcrp=EgZjaHJvbWUyCQgAEEUYORiABNIBCDQxMzhqMGo3qAIIsAIB&sourceid=chrome&ie=UTF-8"},{"site":"mech.fed.wiki","slug":"testing-mech-plugin","title":"Testing Mech Plugin","text":"NOW IS THE TIME FOR ALL GOOD MEN TO COME TO THE AID OF THEIR COUNTRY"},{"site":"mech.fed.wiki","slug":"testing-neighbor-mech","title":"Testing Neighbor Mech","text":"CLICK\\n NEIGHBORS\\n WALK 10 steps\\n CLICK\\n  SOLO\\n CLICK\\n  POPUP state"},{"site":"mech.fed.wiki","slug":"testing-neighbor-mech","title":"Testing Neighbor Mech","text":"CLICK\\n NEIGHBORS genius\\n WALK 24 weeks\\n NEIGHBORS thompson\\n WALK 20 hubs\\n CLICK\\n  SOLO\\n CLICK\\n  PREVIEW graph"},{"site":"mech.fed.wiki","slug":"testing-neighbor-mech","title":"Testing Neighbor Mech","text":"CLICK\\n NEIGHBORS fed.wiki\\n TICK 10\\n  WALK\\n  PREVIEW graph\\n  SLEEP 3"},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"FROM found.ward.fed.wiki/esp8266-datalog\\n SENSOR garage\\n  REPORT"},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"FROM found.ward.fed.wiki/esp8266-datalog\\n CLICK\\n  SENSOR garage\\n   REPORT\\n  SENSOR office\\n   REPORT"},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"REPORT "},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"SENSOR office\\n REPORT"},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"FROM found.ward.fed.wiki/check-the-weather\\n SENSOR office\\n  REPORT"},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"FROM found.ward.fed.wiki/esp8266-datalog\\n SENSOR\\n  REPORT"},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"FROM found.ward.fed.wiki/esp8266-datalog\\n SENSOR porch\\n  REPORT"},{"site":"mech.fed.wiki","slug":"testing-sensor-mech","title":"Testing Sensor Mech","text":"FROM found.ward.fed.wiki/esp8266-datalog\\n SENSOR garage\\n  REPORT"},{"site":"mech.fed.wiki","slug":"tick","title":"TICK","text":"TICK 5\\n HELLO"},{"site":"mech.fed.wiki","slug":"together","title":"TOGETHER","text":"CLICK\\n TOGETHER\\n  SLEEP 4\\n  SLEEP 3\\n  HELLO\\n HELLO world"},{"site":"mech.fed.wiki","slug":"turn","title":"TURN","text":"TICK 5\\n FORWARD 150\\n TURN 144\\n"},{"site":"mech.fed.wiki","slug":"turtle-code-walkthrough","title":"Turtle Code Walkthrough","text":"TICK 9\\n  FORWARD 60\\n  TURN 140\\n  FORWARD 60\\n  TURN -100"},{"site":"mech.fed.wiki","slug":"until","title":"UNTIL","text":"TICK 10\\n UNTIL word"},{"site":"mech.fed.wiki","slug":"uptime","title":"UPTIME","text":"GET\\n UPTIME"},{"site":"mech.fed.wiki","slug":"walk","title":"WALK","text":"NEIGHBORS\\nWALK"},{"site":"mech.fed.wiki","slug":"ward-cunningham","title":"Ward Cunningham","text":"NEIGHBORS mech"},{"site":"mech.fed.wiki","slug":"whats-new-in-wiki","title":"What's New in Wiki","text":"CLICK\\n HELLO"},{"site":"mech.fed.wiki","slug":"whats-new-in-wiki","title":"What's New in Wiki","text":"CLICK\\n NEIGHBORS fed.wiki\\n CODE popular 15\\n CLICK\\n  PREVIEW items"}]<\/script>
<script>
/* \u2500\u2500 model \u2500\u2500 pure functions, no DOM. test-mech-blocks.js evals from here to "end model". */

const GROUPS = {
  control: { label: 'Control', color: '#b45309' },
  web:     { label: 'Pages and neighbors', color: '#1d4ed8' },
  data:    { label: 'Data', color: '#0f766e' },
  show:    { label: 'Show results', color: '#15803d' },
  server:  { label: 'Server', color: '#7c3aed' },
  talk:    { label: 'Messages', color: '#be185d' },
  draw:    { label: 'Turtle drawing', color: '#4b5563' },
};

// body: 'none' | 'optional' | 'required' | 'data' | 'server' | 'plugin'
// reads/writes: state keys. readsByArg/writesByArg: keyed by an argument word.
// readsArg: reads the key named by the first argument (default given).
// writesArg: writes the key named by the first argument.
// bodyWrites: keys only the indented blocks see. bodyWritesSuffix: FILE's argument,
// exactly as written (FILE .tsv stores the text under ".tsv", not "tsv").
const CATALOG = {
  CLICK:    { group: 'control', hat: true, body: 'required', doc: 'Offer to proceed once user clicks.', example: 'CLICK' },
  TICK:     { group: 'control', hat: true, body: 'required', args: 'count 1\u201399', count: true, bodyWrites: ['tick'], doc: 'Proceed repeatedly once user clicks.', example: 'TICK 5' },
  UNTIL:    { group: 'control', body: 'optional', args: 'word', argRequired: true, reads: ['tick', 'aspect'], doc: 'Stop TICKing once a word turns up.', example: 'UNTIL word' },
  SLEEP:    { group: 'control', body: 'optional', args: 'seconds 1\u201399', count: true, doc: 'Suspend a sequence of blocks.', example: 'SLEEP 3' },
  TOGETHER: { group: 'control', body: 'required', doc: 'Start all blocks at once.', example: 'TOGETHER' },
  FROM:     { group: 'web', body: 'required', args: 'site/slug', argRequired: true, writes: ['page'], doc: 'Fetch a page for the blocks indented below.', example: 'FROM fed.wiki/welcome-visitors' },
  NEIGHBORS:{ group: 'web', body: 'data', bodyLabel: 'Site Survey titles', args: 'site filters', writes: ['neighborhood'], doc: 'Retrieve available neighborhood sitemaps.', example: 'NEIGHBORS' },
  WALK:     { group: 'web', body: 'none', args: 'count and way, like 10 steps', choices: ['10 steps', '24 weeks', '20 hubs', '3 clicks', 'lineup', 'references', 'topics', 'days', 'months'], walk: true, reads: ['neighborhood'], writes: ['aspect'], doc: 'Explore the neighborhood link graph.', example: 'WALK 10 steps' },
  RANDOM:   { group: 'web', body: 'none', reads: ['neighborhood'], writes: ['info'], doc: 'Select a random page from the neighbors.', example: 'RANDOM' },
  ROSTER:   { group: 'web', body: 'none', reads: ['neighborhood'], writes: ['items'], doc: 'Make a Roster for the current neighborhood.', example: 'ROSTER' },
  LINEUP:   { group: 'web', body: 'none', writes: ['items'], doc: 'Make a page from the current lineup.', example: 'LINEUP' },
  SHOW:     { shows: true, group: 'web', body: 'none', args: 'slug or site/slug', readsNoArg: ['info'], doc: 'Add an existing page to the lineup.', example: 'SHOW welcome-visitors' },
  DELTA:    { group: 'web', body: 'none', args: 'have|apply', choices: ['have', 'apply'], oneOf: ['have', 'apply'], readsByArg: { apply: ['actions'] }, writesByArg: { have: ['recent'], apply: ['page'] }, doc: 'Apply recent remote site changes.', example: 'DELTA have' },
  SOURCE:   { group: 'data', body: 'optional', args: 'topic', choices: ['marker', 'aspect', 'assets'], argRequired: true, writesArg: true, doc: 'Read a data source from the lineup.', example: 'SOURCE marker' },
  FILE:     { group: 'data', body: 'required', args: 'suffix', choices: ['tsv', 'txt', 'csv', 'json'], argRequired: true, reads: ['assets'], bodyWritesSuffix: true, doc: 'User selects one of the available files.', example: 'FILE tsv' },
  KWIC:     { group: 'data', body: 'data', bodyLabel: 'link template with $K or $W', args: 'prefix', reads: ['tsv'], writes: ['items'], doc: 'Construct a Keyword-In-Context index.', example: 'KWIC' },
  SENSOR:   { group: 'data', body: 'optional', args: 'sensor name', argRequired: true, reads: ['page'], writes: ['temperature'], doc: 'Read sensor data from a named endpoint.', example: 'SENSOR garage' },
  CODE:     { group: 'data', body: 'data', bodyLabel: 'lines the function reads with api.body()', args: 'function args\u2026', wild: true, doc: 'Run JavaScript from a Code item on this page.', example: 'CODE' },
  HELLO:    { shows: true, group: 'show', body: 'none', args: 'world', choices: ['world'], doc: 'Add a happy face each time run.', example: 'HELLO world' },
  REPORT:   { shows: true, group: 'show', body: 'none', args: 'state key', readsArg: 'temperature', doc: 'Report a measurement in place in the item.', example: 'REPORT' },
  PREVIEW:  { shows: true, group: 'show', body: 'none', args: 'map graph items page synopsis', choices: ['graph', 'map', 'items', 'page', 'synopsis items'], kinds: ['map', 'graph', 'items', 'page', 'synopsis'], readsByArg: { map: ['marker'], graph: ['aspect'], items: ['items'], page: ['page'] }, doc: 'Display computed state as a ghost page.', example: 'PREVIEW graph' },
  POPUP:    { shows: true, group: 'show', body: 'none', args: 'state|images', choices: ['state', 'images', 'images all'], oneOf: ['state', 'images'], readsByArg: { images: ['commons'] }, doc: 'Open a pop-up window with various contents.', example: 'POPUP state' },
  SOLO:     { shows: true, group: 'show', body: 'none', reads: ['aspect'], doc: 'Launch the Solo plugin pop-up viewer.', example: 'SOLO' },
  PRINT:    { shows: true, group: 'show', body: 'none', args: 'outline|draft', choices: ['outline', 'draft'], oneOf: ['outline', 'draft'], reads: ['aspect', 'neighborhood'], writes: ['items'], doc: 'Compose a printable story and garden.', example: 'PRINT outline' },
  DOWNLOAD: { shows: true, group: 'show', body: 'none', args: 'file.txt|html|csv|tsv|json', argRequired: true, readsSuffix: true, doc: 'Download state as a file.', example: 'DOWNLOAD items.json' },
  GET:      { group: 'server', body: 'server', args: 'state keys to share, or site', writes: ['result'], requiredBody: true, doc: 'Await a result from the server.', example: 'GET' },
  PLUGIN:   { group: 'server', body: 'plugin', args: 'plugin name', argRequired: true, writes: ['result'], requiredBody: true, doc: 'Await a result from an installed plugin.', example: 'PLUGIN rcn' },
  LISTEN:   { group: 'talk', body: 'none', args: 'topic', argRequired: true, doc: 'Wait for a specific message.', example: 'LISTEN hello' },
  MESSAGE:  { group: 'talk', body: 'none', args: 'topic', argRequired: true, doc: 'Send a specific message.', example: 'MESSAGE hello' },
  FORWARD:  { group: 'draw', body: 'none', args: 'steps', argRequired: true, writes: ['turtle'], doc: 'Move the drawing "turtle" forward.', example: 'FORWARD 60' },
  TURN:     { group: 'draw', body: 'none', args: 'degrees', argRequired: true, writes: ['turtle'], doc: 'Turn the drawing "turtle".', example: 'TURN 144' },
};

// Blocks that run on the wiki server, inside GET.
const SERVER = {
  HELLO:   { group: 'server', body: 'none', doc: 'Add a happy face each time run.', example: 'HELLO' },
  UPTIME:  { group: 'server', body: 'none', doc: 'Report time the server has run.', example: 'UPTIME' },
  SLEEP:   { group: 'server', body: 'optional', args: 'seconds 1\u201399', count: true, doc: 'Suspend a sequence of blocks.', example: 'SLEEP 3' },
  COMMONS: { group: 'server', body: 'none', writes: ['commons'], doc: 'Report image files and byte count.', example: 'COMMONS' },
  DELTA:   { group: 'server', body: 'none', reads: ['recent'], writes: ['actions'], doc: 'Retrieve recent site changes.', example: 'DELTA' },
};

// Blocks that installed plugins answer through PLUGIN <name>. Only plugins listed
// here are checked; for any other, what comes back is unknown, so later needs are
// softened to "may come from the plugin" rather than flagged.
const PLUGINS = {
  rcn: {
    HELLO:       { group: 'server', body: 'none', doc: 'Proves the rcn plugin answers.', example: 'HELLO' },
    PROJECTIONS: { group: 'server', body: 'none', writes: ['items'], doc: 'List the Layer 1 folders on this site.', example: 'PROJECTIONS' },
    PROJECTION:  { group: 'server', body: 'none', args: 'folder, then kinds to keep', argRequired: true, writes: ['aspect'], doc: "A Layer 1 folder's graph, as an aspect.", example: 'PROJECTION whatcom' },
    BADGES:      { group: 'server', body: 'none', args: 'words in the skill', writes: ['aspect', 'items'], doc: "SODOTO badges on this site's pages: people and the skills they hold.", example: 'BADGES' },
  },
};

const WAYS = /\\b(\\d+)? *(steps|days|weeks|months|hubs|lineup|references|topics|clicks)\\b/;

// One record per line: leading spaces, and everything after them, untouched.
function parse(text) {
  return text.split(/\\n/).map(raw => {
    const ind = raw.match(/^ */)[0].length;
    return { ind, cmd: raw.slice(ind) };
  });
}

function serialize(lines) {
  return lines.map(l => ' '.repeat(l.ind) + l.cmd).join('\\n');
}

// Ward's tree() from interpreter.js, line for line, but leaves hold the line
// index instead of the text, so the view and the checks see exactly his nesting.
function nest(lines) {
  let k = 0;
  function tree(here, indent) {
    while (k < lines.length) {
      const spaces = lines[k].ind;
      if (spaces == indent) { here.push({ i: k }); k++; }
      else if (spaces > indent) { const more = []; here.push(more); tree(more, spaces); }
      else return here;
    }
    return here;
  }
  return tree([], 0);
}

function words(cmd) { const [op, ...args] = cmd.split(/ +/); return { op, args }; }

// Last line of the block at i together with everything indented under it.
function subtreeEnd(lines, i) {
  let j = i;
  while (j + 1 < lines.length && lines[j + 1].ind > lines[i].ind) j++;
  return j;
}

// The step used for a new body: the smallest parent-to-child step in the text.
function indentUnit(lines) {
  let best = 0;
  for (let i = 1; i < lines.length; i++) {
    const d = lines[i].ind - lines[i - 1].ind;
    if (d > 0 && (!best || d < best)) best = d;
  }
  return best || 1;
}

// Where a drop lands, as a line index and an indentation.
function placeOf(lines, target) {
  const { kind, i } = target;
  if (kind == 'end') return { at: lines.length, ind: 0 };
  if (kind == 'before') return { at: i, ind: lines[i].ind };
  if (kind == 'after') return { at: subtreeEnd(lines, i) + 1, ind: lines[i].ind };
  if (kind == 'into') {
    const next = lines[i + 1];
    return { at: i + 1, ind: next && next.ind > lines[i].ind ? next.ind : lines[i].ind + indentUnit(lines) };
  }
  throw new Error('unknown drop ' + kind);
}

// Insert chunk lines (relative indents kept) so the first sits at place.ind.
function insertChunk(lines, chunk, place) {
  const delta = place.ind - chunk[0].ind;
  const moved = chunk.map(l => ({ ind: l.ind + delta, cmd: l.cmd }));
  return [...lines.slice(0, place.at), ...moved, ...lines.slice(place.at)];
}

// Move the block at i (with its indented lines) to target. Returns null if the
// target is inside the block being moved.
function moveBlock(lines, i, target) {
  const end = subtreeEnd(lines, i);
  if (target.kind != 'end' && target.i >= i && target.i <= end) return null;
  const place = placeOf(lines, target);
  const chunk = lines.slice(i, end + 1);
  const rest = [...lines.slice(0, i), ...lines.slice(end + 1)];
  const at = place.at > end ? place.at - chunk.length : place.at;
  return insertChunk(rest, chunk, { at, ind: place.ind });
}

function removeBlock(lines, i) {
  const end = subtreeEnd(lines, i);
  return [...lines.slice(0, i), ...lines.slice(end + 1)];
}

// An empty text area parses as one blank line; treat that as no lines at all.
const isEmpty = lines => lines.length == 1 && lines[0].ind == 0 && lines[0].cmd == '';

function insertNew(lines, cmd, target) {
  if (isEmpty(lines)) return [{ ind: 0, cmd }];
  return insertChunk(lines, [{ ind: 0, cmd }], placeOf(lines, target));
}

// Where the dragged or new block's own first line ends up after a drop.
function landedAt(lines, source, target) {
  if (!('i' in source) && isEmpty(lines)) return 0;
  const place = placeOf(lines, target);
  if (!('i' in source)) return place.at;
  const end = subtreeEnd(lines, source.i);
  return place.at > end ? place.at - (end - source.i + 1) : place.at;
}

function readsOf(cat, args) {
  const out = [...(cat.reads || [])];
  if (cat.readsArg) out.push(args[0] || cat.readsArg);
  if (cat.readsNoArg && !args[0]) out.push(...cat.readsNoArg);
  if (cat.readsByArg) for (const a of args) out.push(...(cat.readsByArg[a] || []));
  if (cat.readsSuffix) { const m = (args[0] || '').match(/\\.(txt|html|csv|tsv|json)$/); if (m) out.push(m[1]); }
  return [...new Set(out)];
}

function writesOf(cat, args) {
  const out = [...(cat.writes || [])];
  if (cat.writesArg && args[0]) out.push(args[0]);
  if (cat.writesByArg) for (const a of args) out.push(...(cat.writesByArg[a] || []));
  return [...new Set(out)];
}

// Which blocks make a key, for "like from ..." in the messages.
function producers(key) {
  const out = [];
  for (const [op, c] of Object.entries(CATALOG)) {
    if ((c.writes || []).includes(key) || (c.bodyWrites || []).includes(key)) out.push(op);
    if (c.writesByArg) for (const [a, ks] of Object.entries(c.writesByArg)) if (ks.includes(key)) out.push(\`\${op} \${a}\`);
  }
  for (const [op, c] of Object.entries(SERVER)) if ((c.writes || []).includes(key)) out.push(\`GET with \${op}\`);
  if (CATALOG.SOURCE.choices.includes(key)) out.push(\`SOURCE \${key}\`);
  if (['tsv', 'txt', 'csv', 'html', 'json'].includes(key)) out.push(\`FILE \${key}\`, 'CODE');
  return out.length ? out.slice(0, 3).join(' or ') : 'a block above';
}

// Walk the script the way Ward's run() does, keeping track of which state
// keys exist, and say what would go wrong before anything runs.
// Returns one record per line: { role, op, group, notes:[{level,msg}], needs:[{key,status}], makes:[] }
// roles: block | server | plugin | data | blank | unknown | unused | orphan
function analyze(lines) {
  const info = lines.map(() => ({ role: 'block', notes: [], needs: [], makes: [] }));
  const note = (i, level, msg) => info[i].notes.push({ level, msg });
  const linesIn = arr => arr.flatMap(el => Array.isArray(el) ? linesIn(el) : [el.i]);
  const mark = (arr, role) => { for (const i of linesIn(arr)) info[i].role = role; };

  // started: this scope sits directly inside CLICK or TICK, so a person began it.
  // Ward passes that "initiator" one level down only (run(body, state, 'click')).
  function walk(scope, env, mode, plugin, started) {
    for (let k = 0; k < scope.length; k++) {
      const el = scope[k];
      if (Array.isArray(el)) {
        mark(el, 'orphan');
        note(linesIn(el)[0], 'warn', 'These indented lines are not under any block, so they never run.');
        continue;
      }
      const body = Array.isArray(scope[k + 1]) ? scope[++k] : null;
      line(el.i, body, env, mode, plugin, started);
    }
  }

  function line(i, body, env, mode, plugin, started) {
    const cmd = lines[i].cmd;
    const { op, args } = words(cmd);
    const r = info[i];
    if (!/\\S/.test(cmd)) {
      r.role = 'blank';
      if (body) { mark(body, 'unused'); note(linesIn(body)[0], 'warn', 'Indented under a blank line, so it never runs.'); }
      return;
    }
    if (mode == 'plugin') {
      r.role = 'plugin'; r.op = op; r.group = 'server';
      const known = PLUGINS[plugin];
      const pc = known && known[op];
      if (known && !pc) {
        if (/^[A-Z]+$/.test(op)) note(i, 'trouble', \`\${op} isn't a \${plugin} block. Try \${Object.keys(known).join(', ')}.\`);
        else note(i, 'trouble', 'Expected line to begin with all-caps keyword.');
      }
      if (pc) {
        if (pc.argRequired && !args[0]) note(i, 'trouble', \`\${op} expects an argument: \${pc.args}.\`);
        r.makes = writesOf(pc, args);
        for (const k of r.makes) env.keys.add(k);
        if (body) { mark(body, 'unused'); note(i, 'warn', \`\${op} doesn't use indented lines, so they never run.\`); }
        return;
      }
      if (body) walk(body, env, 'plugin', plugin);
      return;
    }
    const cat = (mode == 'server' ? SERVER : CATALOG)[op];
    if (!cat) {
      r.role = 'unknown';
      if (/^[A-Z]+$/.test(op)) note(i, 'trouble', mode == 'server' ? \`\${op} isn't a server block we know.\` : \`\${op} doesn't name a block we know.\`);
      else note(i, 'trouble', 'Expected line to begin with all-caps keyword.');
      if (body) mark(body, 'unused');
      return;
    }
    r.role = mode == 'server' ? 'server' : 'block';
    r.op = op; r.group = cat.group;

    // arguments, in Ward's words
    if (cat.argRequired && !args[0]) note(i, 'trouble', \`\${op} expects an argument: \${cat.args}.\`);
    if (cat.count && !(args[0] || '1').match(/^[1-9][0-9]?$/)) note(i, 'trouble', \`\${op} expects a count from 1 to 99.\`);
    if (cat.oneOf && !cat.oneOf.includes(args[0])) note(i, 'trouble', \`\${op} expects \${cat.oneOf.join(' or ')}.\`);
    if (cat.walk && !cmd.match(WAYS) && cmd != 'WALK') note(i, 'trouble', \`WALK can't understand rest of this block.\`);
    if (cat.kinds) for (const a of args) if (a && !cat.kinds.includes(a)) note(i, 'trouble', \`"\${a}" doesn't name an item we can preview.\`);
    if (op == 'DOWNLOAD' && args[0] && !args[0].match(/^.+\\.(txt|html|csv|tsv|json)$/)) note(i, 'trouble', 'DOWNLOAD expects a familiar suffix, one of txt, html, csv, tsv, or json.');
    if (op == 'CODE' && mode == 'client' && !started) note(i, 'start', 'CODE here runs only for the page owner. Put it directly inside CLICK or TICK so anyone can run it.');

    for (const key of readsOf(cat, args)) {
      if (env.keys.has(key)) r.needs.push({ key, status: 'ok' });
      else if (env.wild) r.needs.push({ key, status: 'maybe' });
      else { r.needs.push({ key, status: 'missing' }); note(i, 'need', \`\${op} expects "\${key}", like from \${producers(key)}.\`); }
    }

    let shared = null;
    if (op == 'GET' && mode == 'client') {
      shared = new Set();
      for (const a of args) {
        if (env.keys.has(a)) shared.add(a);
        else if (a.match(/\\./)) continue;
        else if (env.wild) continue;
        else note(i, 'trouble', \`GET expected "\${a}" to name state or site.\`);
      }
    }

    // A block short of what it needs stops early, as Ward's blocks do, and makes nothing.
    const makes = r.needs.some(n => n.status == 'missing') ? [] : writesOf(cat, args);
    r.makes = writesOf(cat, args);
    if (cat.bodyWrites) r.makes.push(...cat.bodyWrites);
    if (cat.bodyWritesSuffix && args[0]) r.makes.push(args[0]);
    if (!cat.requiredBody) for (const k of makes) env.keys.add(k);
    if (cat.wild) env.wild = true;

    const needsBody = cat.body == 'required' || cat.requiredBody;
    if (!body) {
      if (needsBody) note(i, 'empty', \`\${op} expects indented blocks to follow.\`);
      if (cat.requiredBody) for (const k of makes) env.keys.add(k);
      return;
    }
    if (cat.body == 'none') {
      mark(body, 'unused');
      note(i, 'warn', \`\${op} doesn't use indented lines, so they never run.\`);
      return;
    }
    if (cat.body == 'data') {
      mark(body, 'data');
      body.forEach((el, n) => {
        if (Array.isArray(el)) { mark(el, 'unused'); return; }
        const t = lines[el.i].cmd;
        if (op == 'NEIGHBORS' && !t.endsWith(' Survey')) note(el.i, 'trouble', 'NEIGHBORS expects a Site Survey title, like Pattern Link Survey');
        if (op == 'KWIC' && n == 0 && !t.match(/\\$[KW]/)) note(el.i, 'trouble', 'KWIC expects $K or $W in link prototype.');
      });
      return;
    }
    if (cat.body == 'plugin') {
      const penv = { keys: new Set(args.slice(1).filter(a => env.keys.has(a))), wild: !PLUGINS[args[0]] };
      walk(body, penv, 'plugin', args[0]);
      for (const k of makes) env.keys.add(k);
      if (PLUGINS[args[0]]) for (const k of penv.keys) env.keys.add(k);
      else env.wild = true;
      return;
    }
    if (cat.body == 'server') {
      const senv = { keys: shared || new Set(), wild: false };
      walk(body, senv, 'server');
      for (const k of senv.keys) env.keys.add(k);
      for (const k of makes) env.keys.add(k);
      return;
    }
    // optional or required: the body shares state, plus any keys only it sees
    if (cat.bodyWrites || cat.bodyWritesSuffix) {
      const inner = { keys: new Set(env.keys), wild: env.wild };
      for (const k of cat.bodyWrites || []) inner.keys.add(k);
      if (cat.bodyWritesSuffix && args[0]) inner.keys.add(args[0]);
      walk(body, inner, mode, plugin, !!cat.hat);
      // FILE runs its body on a copy of state (Object.assign(prop, state)), so nothing comes back out
      if (cat.bodyWritesSuffix) return;
      for (const k of inner.keys) if (!(cat.bodyWrites || []).includes(k)) env.keys.add(k);
      env.wild = env.wild || inner.wild;
    } else {
      walk(body, env, mode, plugin, !!cat.hat);
    }
  }

  walk(nest(lines), { keys: new Set(), wild: false }, 'client', null, false);
  return info;
}

// The catalog as plain data: what the design note proposes for blocks.js.
function catalogJSON() {
  const strip = c => Object.fromEntries(Object.entries(c).filter(([k]) => !['example'].includes(k)));
  return JSON.stringify({ client: Object.fromEntries(Object.entries(CATALOG).map(([k, c]) => [k, strip(c)])),
                          server: Object.fromEntries(Object.entries(SERVER).map(([k, c]) => [k, strip(c)])) }, null, 2);
}

// What passes between blocks, in a few families, each with one icon.
const FAMILIES = {
  sites:   { icon: '\u{1F3D8}', label: 'sites and pages', color: '#1d4ed8', keys: ['neighborhood', 'page', 'info'] },
  graph:   { icon: '\u{1F517}', label: 'graphs', color: '#15803d', keys: ['aspect', 'marker'] },
  list:    { icon: '\u2630', label: 'lists of items', color: '#c2410c', keys: ['items'] },
  file:    { icon: '\u{1F4C4}', label: 'files and text', color: '#0f766e', keys: ['assets', 'tsv', 'txt', 'csv', 'html', 'json'] },
  reading: { icon: '\u{1F321}', label: 'readings and counts', color: '#b45309', keys: ['temperature', 'tick'] },
  server:  { icon: '\u{1F5A5}', label: 'from the server', color: '#7c3aed', keys: ['result', 'commons', 'recent', 'actions'] },
  drawing: { icon: '\u270F\uFE0F', label: 'the turtle drawing', color: '#4b5563', keys: ['turtle'] },
  other:   { icon: '\u25C6', label: 'made by CODE', color: '#6b7280', keys: [] },
};
function familyOf(key) {
  for (const [name, f] of Object.entries(FAMILIES)) if (f.keys.includes(key)) return name;
  return key.startsWith('.') ? 'file' : 'other';
}

// Problems that stop blocks fitting together. "empty" (a mouth not yet filled)
// and "start" (CODE only runs for the owner) are shown but never refuse a drop.
const BLOCKING = new Set(['trouble', 'need', 'warn']);

function problems(lines, info) {
  const m = new Map();
  info.forEach((f, i) => f.notes.forEach(n => {
    if (!BLOCKING.has(n.level)) return;
    const k = lines[i].cmd + '\\u0000' + n.msg;
    m.set(k, (m.get(k) || 0) + 1);
  }));
  return m;
}

// Does a change add any problem that was not there before? Lines are compared
// by their text, so a block that moves keeps its own old problems.
function fitCheck(lines, info, next) {
  if (!next) return { ok: false, why: 'A block cannot go inside itself.' };
  const before = problems(lines, info), after = problems(next, analyze(next));
  for (const [k, n] of after) if (n > (before.get(k) || 0)) return { ok: false, why: k.split('\\u0000')[1] };
  return { ok: true, why: '' };
}

// Where the next block goes when nothing is being dragged: after the chosen
// block, or into its mouth when the mouth is empty and wants filling.
function cursorTarget(lines, info, selected) {
  if (isEmpty(lines)) return { kind: 'end' };
  let i = selected;
  if (i == null || i >= lines.length) {
    i = lines.length - 1;
    while (i > 0 && !/\\S/.test(lines[i].cmd)) i--;
  }
  const f = info[i];
  const cat = f.role == 'block' ? CATALOG[f.op] : f.role == 'server' ? SERVER[f.op] : null;
  const hasBody = i + 1 < lines.length && lines[i + 1].ind > lines[i].ind;
  if (cat && !hasBody && (cat.body == 'required' || cat.requiredBody)) return { kind: 'into', i };
  return { kind: 'after', i };
}

// The three lamps: put together right, can be started, and ends in a result.
function lamps(lines, info) {
  if (isEmpty(lines)) {
    const off = { on: false, why: 'The script is empty.' };
    return { fits: off, ready: off, result: off };
  }
  const first = levels => {
    for (const f of info) for (const n of f.notes) if (levels.includes(n.level)) return n.msg;
    return '';
  };
  const bad = first(['trouble', 'need', 'warn', 'empty']);
  const start = first(['start']);
  const shown = info.filter((f, i) => f.role == 'block' && CATALOG[f.op]?.shows);
  const working = shown.filter(f => !f.notes.some(n => BLOCKING.has(n.level)));
  let why = '';
  if (!shown.length) why = 'Nothing shows a result yet. End with PREVIEW, REPORT, SOLO, POPUP, PRINT, DOWNLOAD, SHOW or HELLO.';
  else if (!working.length) why = shown[0].notes.find(n => BLOCKING.has(n.level)).msg;
  return {
    fits: { on: !bad, why: bad },
    ready: { on: !start, why: start },
    result: { on: !!working.length, why },
  };
}

/* \u2500\u2500 end model \u2500\u2500 */

/* \u2500\u2500 view \u2500\u2500 */
const $ = sel => document.querySelector(sel);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const corpus = JSON.parse(document.getElementById('corpus').textContent);
let model = parse('');
let facts = [];
let selected = null;   // line index the blue line follows, or null for the end
let cursor = { kind: 'end' };
const undoStack = [];
let beginner = true;
try { beginner = localStorage.getItem('mechBlocks.beginner') !== 'off'; } catch {}
$('#beginner').checked = beginner;
$('#beginner').addEventListener('change', e => {
  beginner = e.target.checked;
  try { localStorage.setItem('mechBlocks.beginner', beginner ? 'on' : 'off'); } catch {}
  render();
});

function setText(text, { fromTextarea = false, keepSelection = false } = {}) {
  model = parse(text);
  if (!keepSelection || (selected != null && selected >= model.length)) selected = null;
  if (!fromTextarea) $('#text').value = text;
  render();
}

function change(next, select) {
  if (!next) return;
  undoStack.push(serialize(model));
  if (undoStack.length > 200) undoStack.shift();
  selected = select ?? null;
  setText(serialize(next), { keepSelection: true });
}

function flash(msg) {
  $('#flash').textContent = msg;
  clearTimeout(flash.t);
  flash.t = setTimeout(() => ($('#flash').textContent = ''), 2200);
}

// palette
function buildPalette() {
  const byGroup = {};
  for (const [op, c] of Object.entries(CATALOG)) (byGroup[c.group] ||= []).push([op, c, false]);
  for (const [op, c] of Object.entries(SERVER)) byGroup.server.push([op, c, 'server']);
  for (const [op, c] of Object.entries(PLUGINS.rcn)) (byGroup.rcn ||= []).push([op, c, 'plugin:rcn']);
  const html = [];
  for (const [g, list] of Object.entries(byGroup)) {
    const head = g == 'rcn' ? { color: GROUPS.server.color, label: 'Inside PLUGIN rcn' } : GROUPS[g];
    html.push(\`<div style="--g:\${head.color}"><div class="pgroup">\${head.label}</div>\`);
    for (const [op, c, srv] of list) {
      const rest = c.example.slice(op.length);
      const where = srv == 'server' ? 'GET' : srv ? 'PLUGIN rcn' : '';
      html.push(\`<div class="ptile" data-op="\${op}"\${srv ? \` data-inside="\${srv}"\` : ''} data-new="\${esc(c.example)}" title="\${esc(c.doc + (where ? \` Runs on the server, inside \${where}.\` : ''))}"><b>\${op}</b><span>\${esc(rest)}</span>\${where ? \` <span>\xB7 in \${where}</span>\` : ''}</div>\`);
    }
    html.push('</div>');
  }
  $('#ptiles').innerHTML = html.join('');
}

// script
function render() {
  facts = analyze(model);
  const canvas = $('#canvas');
  const tree = nest(model);
  canvas.innerHTML = (isEmpty(model) ? '' : scopeHTML(tree)) +
    '<div class="endslot" data-end="1">Drop here to add at the end</div><div id="dropbar"></div><div id="cursorbar"><span>next block goes here</span></div>';
  if (selected != null) document.querySelector(\`.tile[data-i="\${selected}"]\`)?.classList.add('selected');
  cursor = cursorTarget(model, facts, selected);
  placeBar($('#cursorbar'), cursor);
  renderLamps();
  renderPaletteFit();
  renderChecks();
}

function renderLamps() {
  const L = lamps(model, facts);
  const one = (k, label) => \`<span class="lamp \${L[k].on ? 'on' : ''}" title="\${esc(L[k].why)}"><b>\u25CF</b> \${label}</span>\`;
  $('#lamps').innerHTML = one('fits', 'Fits together') + one('ready', 'Ready to start') + one('result', 'Ends in a result');
  $('#lampwhy').textContent = L.fits.why || L.ready.why || L.result.why;
}

function renderLegend() {
  $('#legend').innerHTML = Object.values(FAMILIES).map(f => \`<span style="color:\${f.color}">\${f.icon} \${f.label}</span>\`).join('');
}

// Beginner mode: grey out every palette block that would not fit at the blue line.
function renderPaletteFit() {
  for (const t of document.querySelectorAll('.ptile')) {
    if (!beginner) { t.classList.remove('nofit'); continue; }
    const fit = paletteFit(t.dataset.new, t.dataset.inside);
    t.classList.toggle('nofit', !fit.ok);
    t.dataset.why = fit.why;
  }
}

// Put a bar at a drop place: above, below, or just inside a block.
function placeBar(bar, t) {
  const canvas = $('#canvas').getBoundingClientRect();
  let rect, at = 'top', indent = 0;
  if (t.kind == 'end') rect = document.querySelector('.endslot').getBoundingClientRect();
  else if (t.kind == 'before') rect = document.querySelector(\`[data-head="\${t.i}"]\`).closest('.tile').getBoundingClientRect();
  else if (t.kind == 'after') { rect = document.querySelector(\`.tile[data-i="\${t.i}"]\`).getBoundingClientRect(); at = 'bottom'; }
  else { rect = document.querySelector(\`[data-head="\${t.i}"]\`).getBoundingClientRect(); at = 'bottom'; indent = 18; }
  bar.style.display = 'block';
  bar.style.left = rect.left - canvas.left + indent + 'px';
  bar.style.width = Math.max(60, rect.width - indent) + 'px';
  bar.style.top = (at == 'top' ? rect.top : rect.bottom) - canvas.top - 3 + 'px';
}

// A server tile only fits where it lands inside GET, and an rcn tile inside
// PLUGIN rcn; elsewhere the same words would be an ordinary block, or none.
function paletteFit(cmd, inside) {
  const next = insertNew(model, cmd, cursor);
  if (inside) {
    const role = analyze(next)[landedAt(model, { cmd }, cursor)].role;
    if (inside == 'server' && role != 'server') return { ok: false, why: 'Server blocks go inside GET.' };
    if (inside == 'plugin:rcn' && role != 'plugin') return { ok: false, why: 'These blocks go inside PLUGIN rcn.' };
  }
  return fitCheck(model, facts, next);
}

function insertAtCursor(cmd, inside) {
  const next = insertNew(model, cmd, cursor);
  const fit = paletteFit(cmd, inside);
  if (beginner && !fit.ok) return flash("Doesn't fit at the blue line: " + fit.why);
  change(next, landedAt(model, { cmd }, cursor));
}

function scopeHTML(scope) {
  const out = [];
  for (let k = 0; k < scope.length; k++) {
    const el = scope[k];
    if (Array.isArray(el)) {
      const first = firstLine(el);
      out.push(facts[first].role == 'orphan'
        ? \`<div class="group-orphan"><div class="label">Indented under nothing \u2014 never runs</div>\${scopeHTML(el)}</div>\`
        : scopeHTML(el));
      continue;
    }
    const body = Array.isArray(scope[k + 1]) ? scope[++k] : null;
    out.push(tileHTML(el.i, body));
  }
  return out.join('');
}
const firstLine = arr => Array.isArray(arr[0]) ? firstLine(arr[0]) : arr[0].i;

function tileHTML(i, body) {
  const f = facts[i];
  const cmd = model[i].cmd;
  const cat = f.role == 'server' ? SERVER[f.op] : f.role == 'block' ? CATALOG[f.op] : null;
  const color = f.group ? GROUPS[f.group].color : '#6b7280';
  const cls = ['tile', f.role];
  if (cat?.hat) cls.push('hat');
  let head;
  if (cat || f.role == 'plugin') {
    const rest = cmd.slice(f.op.length).replace(/^ +/, '');
    const ph = cat?.args || '';
    head = \`<span class="op">\${esc(f.op)}</span><span class="args\${rest ? '' : ' empty'}" data-edit="args">\${rest ? esc(rest) : ph ? esc(ph) : ''}</span>\`;
  } else if (!/\\S/.test(cmd)) {
    head = \`<span class="args" data-edit="all">\${cmd.length ? 'blank line (spaces)' : 'blank line'}</span>\`;
  } else {
    head = \`<span class="args" data-edit="all">\${esc(cmd)}</span>\`;
  }
  const fam = k => FAMILIES[familyOf(k)];
  for (const n of f.needs) head += \`<span class="chip need \${n.status == 'ok' ? '' : n.status}" style="--f:\${fam(n.key).color}" title="\${n.status == 'maybe' ? 'may come from CODE above' : n.status == 'missing' ? 'nothing above makes this' : 'made by a block above'}">needs \${fam(n.key).icon} \${esc(n.key)}</span>\`;
  const stuck = f.needs.some(n => n.status == 'missing');
  for (const m of f.makes) head += \`<span class="chip make\${stuck ? ' stuck' : ''}" style="--f:\${fam(m).color}" title="\${stuck ? 'Not made here: this block is missing what it needs' : ''}">makes \${fam(m).icon} \${esc(m)}</span>\`;
  if (cat?.shows && f.role == 'block' && !f.notes.some(n => BLOCKING.has(n.level))) head += \`<span class="chip shows">\u21D2 shows a result</span>\`;
  for (const n of f.notes) head += \`<button class="trouble \${n.level == 'trouble' ? '' : 'warn'}" data-msg="\${esc(n.msg)}" title="\${esc(n.msg)}">\u2716\uFE0E</button>\`;
  const title = cat ? cat.doc : f.role == 'plugin' ? 'Runs inside the plugin on the server.' : f.role == 'data' ? 'A line of data for the block above.' : '';
  const accepts = cat && cat.body != 'none';
  let mouth = '';
  if (body) mouth = \`<div class="mouth" data-into="\${i}">\${scopeHTML(body)}</div><div class="foot" data-after="\${i}"></div>\`;
  else if (accepts) {
    const req = cat.body == 'required' || cat.requiredBody;
    const what = cat.body == 'data' ? cat.bodyLabel : cat.body == 'server' ? 'server blocks' : cat.body == 'plugin' ? "the plugin's blocks" : 'blocks to run';
    mouth = \`<div class="mouth"><div class="mouth-empty\${req ? ' required' : ''}" data-into="\${i}">\${req ? 'Needs' : 'Optional:'} \${what} \u2014 drop here</div></div><div class="foot" data-after="\${i}"></div>\`;
  }
  return \`<div class="\${cls.join(' ')}" data-i="\${i}" style="--g:\${color}" \${title ? \`title="\${esc(title)}"\` : ''}><div class="head" data-head="\${i}">\${head}</div>\${mouth}</div>\`;
}

function renderChecks() {
  const items = [];
  facts.forEach((f, i) => f.notes.forEach(n => items.push(\`<li class="\${n.level == 'trouble' ? '' : 'warn'}" data-line="\${i}"><b>Line \${i + 1}</b> \${esc(n.msg)}</li>\`)));
  $('#checks').innerHTML = items.length ? items.join('') : '<li class="ok">Nothing to fix that can be seen before running.</li>';
}

$('#checks').addEventListener('click', e => {
  const li = e.target.closest('li[data-line]');
  if (!li) return;
  const tile = document.querySelector(\`.tile[data-i="\${li.dataset.line}"]\`);
  if (!tile) return;
  tile.scrollIntoView({ block: 'center', behavior: 'smooth' });
  tile.classList.add('flash');
  setTimeout(() => tile.classList.remove('flash'), 1200);
});

// trouble buttons open their message, as in Mech
$('#canvas').addEventListener('click', e => {
  const b = e.target.closest('button.trouble');
  if (!b) return;
  const head = b.closest('.head');
  const open = head.querySelector('.msg');
  if (open) open.remove();
  else head.insertAdjacentHTML('beforeend', \`<div class="msg \${b.classList.contains('warn') ? 'warn' : ''}">\${b.dataset.msg}</div>\`);
});

// editing the words of a line
function startEdit(span) {
  const i = +span.closest('[data-head]').dataset.head;
  const f = facts[i];
  const cmd = model[i].cmd;
  const whole = span.dataset.edit == 'all';
  const shown = whole ? cmd : cmd.slice(f.op.length).replace(/^ +/, '');
  const input = document.createElement('input');
  input.className = 'edit';
  input.value = shown;
  const cat = f.role == 'block' ? CATALOG[f.op] : f.role == 'server' ? SERVER[f.op] : null;
  if (cat?.choices) {
    const id = 'dl-' + f.op;
    if (!document.getElementById(id)) document.body.insertAdjacentHTML('beforeend', \`<datalist id="\${id}">\${cat.choices.map(c => \`<option value="\${esc(c)}">\`).join('')}</datalist>\`);
    input.setAttribute('list', id);
  }
  span.replaceWith(input);
  input.focus(); input.select();
  let done = false;
  const finish = keep => {
    if (done) return; done = true;
    const v = input.value;
    if (!keep || v === shown) return render();
    const next = model.map(l => ({ ...l }));
    next[i].cmd = whole ? v : f.op + (v.trim() ? ' ' + v.trim() : '');
    change(next);
  };
  input.addEventListener('keydown', e => {
    if (e.key == 'Enter') finish(true);
    if (e.key == 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));
}

// dragging, with pointer events so it works with a mouse, a pen or a finger
let drag = null;

document.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  if (e.target.closest('input, button, select, textarea')) return;
  const ptile = e.target.closest('.ptile');
  const head = e.target.closest('.head');
  if (!ptile && !head) return;
  drag = { x: e.clientX, y: e.clientY, started: false, source: ptile ? { cmd: ptile.dataset.new, inside: ptile.dataset.inside, el: ptile } : { i: +head.dataset.head, el: head.closest('.tile') }, editSpan: e.target.closest('.args') };
});

document.addEventListener('pointermove', e => {
  if (!drag) return;
  if (!drag.started) {
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 5) return;
    drag.started = true;
    const g = drag.source.el.cloneNode(true);
    g.classList.add('ghost');
    g.style.width = Math.min(drag.source.el.offsetWidth, 420) + 'px';
    document.body.appendChild(g);
    drag.ghost = g;
    if ('i' in drag.source) drag.source.el.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
  }
  e.preventDefault();
  drag.ghost.style.left = e.clientX + 12 + 'px';
  drag.ghost.style.top = e.clientY + 8 + 'px';
  drag.target = targetAt(e.clientX, e.clientY);
  showTarget(drag.target, e.clientX, e.clientY);
});

document.addEventListener('pointerup', e => {
  if (!drag) return;
  const d = drag; drag = null;
  if (!d.started) {
    if (d.editSpan) return startEdit(d.editSpan);
    if (!('i' in d.source)) return insertAtCursor(d.source.cmd, d.source.inside);   // tap a palette block
    selected = selected === d.source.i ? null : d.source.i;      // tap a block: blue line after it
    return render();
  }
  d.ghost.remove();
  document.body.style.cursor = '';
  $('#palette').classList.remove('trash-hot');
  $('#drophint').style.display = 'none';
  const t = d.target;
  if (!t) return render();
  if (t.kind == 'trash') {
    if ('i' in d.source) { change(removeBlock(model, d.source.i)); flash('Removed'); }
    return render();
  }
  const next = result(d, t);
  if (!next) return render();
  const fit = fitCheck(model, facts, next);
  if (beginner && !fit.ok) { flash("Didn't fit there: " + fit.why); return render(); }
  change(next, landedAt(model, d.source, t));
});

// tap empty script space: the blue line goes back to the end
$('#canvas').addEventListener('click', e => {
  if (e.target.closest('.tile, button')) return;
  if (selected == null) return;
  selected = null;
  render();
});

document.addEventListener('pointercancel', () => { if (drag?.ghost) drag.ghost.remove(); drag = null; render(); });

function result(d, t) {
  return 'i' in d.source ? moveBlock(model, d.source.i, t) : insertNew(model, d.source.cmd, t);
}

function targetAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  if (el.closest('#palette')) return 'i' in drag.source ? { kind: 'trash' } : null;
  if (!el.closest('#canvas')) return null;
  if (el.closest('.endslot')) return { kind: 'end' };
  const empty = el.closest('.mouth-empty');
  if (empty) return { kind: 'into', i: +empty.dataset.into };
  const foot = el.closest('.foot');
  if (foot) return { kind: 'after', i: +foot.dataset.after };
  const head = el.closest('.head');
  if (head) {
    const i = +head.dataset.head;
    const r = head.getBoundingClientRect();
    if (y < r.top + r.height / 2) return { kind: 'before', i };
    const tile = head.closest('.tile');
    return tile.querySelector(':scope > .mouth') ? { kind: 'into', i } : { kind: 'after', i };
  }
  const mouth = el.closest('.mouth[data-into]');
  if (mouth) {
    const kids = [...mouth.querySelectorAll(':scope > .tile, :scope > .group-orphan > .tile')];
    let last = null;
    for (const k of kids) if (k.getBoundingClientRect().top < y) last = k;
    return last ? { kind: 'after', i: +last.dataset.i } : { kind: 'into', i: +mouth.dataset.into };
  }
  // empty canvas space: after the nearest top-level block above the pointer
  const tops = [...document.querySelectorAll('#canvas > .tile')];
  let last = null;
  for (const k of tops) if (k.getBoundingClientRect().top < y) last = k;
  return last ? { kind: 'after', i: +last.dataset.i } : tops.length ? { kind: 'before', i: +tops[0].dataset.i } : { kind: 'end' };
}

// Green bar: fits. Amber (normal mode) or red (beginner mode): it would add a
// problem, and the hint says which. In beginner mode a red drop is refused.
function showTarget(t, x, y) {
  const bar = $('#dropbar'), hint = $('#drophint');
  $('#palette').classList.toggle('trash-hot', t?.kind == 'trash');
  bar.style.display = 'none'; hint.style.display = 'none';
  if (!t || t.kind == 'trash') return;
  const next = result(drag, t);
  if (!next) return;
  placeBar(bar, t);
  const fit = fitCheck(model, facts, next);
  bar.classList.toggle('warn', !fit.ok && !beginner);
  bar.classList.toggle('no', !fit.ok && beginner);
  hint.classList.toggle('no', beginner);
  if (!fit.ok) {
    hint.textContent = (beginner ? "Won't fit here: " : '') + fit.why;
    hint.style.display = 'block';
    hint.style.left = x + 14 + 'px';
    hint.style.top = y + 30 + 'px';
  }
}

// Etoys: drop a wiki page link to get FROM site/slug
const canvasEl = $('#canvas');
canvasEl.addEventListener('dragover', e => {
  const types = [...e.dataTransfer.types];
  if (types.includes('text/uri-list') || types.includes('text/plain')) { e.preventDefault(); canvasEl.classList.add('urlhot'); }
});
canvasEl.addEventListener('dragleave', () => canvasEl.classList.remove('urlhot'));
canvasEl.addEventListener('drop', e => {
  e.preventDefault();
  canvasEl.classList.remove('urlhot');
  const raw = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '').split(/\\s/)[0];
  const where = pageFromURL(raw);
  if (!where) return flash('That drop was not a wiki page link');
  insertAtCursor('FROM ' + where);
});

function pageFromURL(raw) {
  let u;
  try { u = new URL(raw); } catch { return null; }
  const parts = u.pathname.split('/').filter(Boolean);
  let slug = null;
  const v = parts.lastIndexOf('view');
  if (v >= 0 && parts[v + 1]) slug = parts[v + 1];
  else if (parts.length) slug = parts[parts.length - 1].replace(/\\.(json|html)$/, '');
  return slug ? \`\${u.host}/\${slug}\` : null;
}

// text side
let typing;
$('#text').addEventListener('input', () => {
  clearTimeout(typing);
  typing = setTimeout(() => setText($('#text').value, { fromTextarea: true }), 150);
});
$('#text').addEventListener('focus', () => undoStack.push(serialize(model)));

$('#undo').addEventListener('click', undo);
function undo() {
  if (!undoStack.length) return flash('Nothing to undo');
  setText(undoStack.pop());
}
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key == 'z' && !e.target.closest('textarea, input')) { e.preventDefault(); undo(); }
});

async function copy(text, what) {
  try { await navigator.clipboard.writeText(text); flash(what + ' copied'); }
  catch { flash('Copy failed \u2014 select the text and copy by hand'); }
}
$('#copyText').addEventListener('click', () => copy(serialize(model), 'Mech text'));
$('#copyCatalog').addEventListener('click', () => copy(catalogJSON(), 'Block catalog'));

// handbook examples
const sel = $('#examples');
sel.innerHTML = '<option value="">Choose a script\u2026</option>' + corpus.map((c, n) =>
  \`<option value="\${n}">\${esc(c.title)} \u2014 \${esc(c.text.split('\\n').slice(0, 2).join(' / ').slice(0, 50))}</option>\`).join('');
sel.addEventListener('change', () => {
  if (sel.value === '') return;
  undoStack.push(serialize(model));
  setText(corpus[+sel.value].text);
});

// Opened by the Mech Blocks wiki plugin: load that Mech item, and Save writes it back.
if (window.opener) {
  window.opener.postMessage({ toolType: 'mech-blocks', action: 'mechBlocksReady' }, '*');
  window.addEventListener('message', ev => {
    if (ev.source !== window.opener) return;
    const d = ev.data || {};
    if (d.toolType != 'mech-blocks') return;
    if (d.action == 'loadMech') {
      undoStack.push(serialize(model));
      setText(d.text || '');
      sel.value = '';
      document.title = 'Mech Blocks \xB7 ' + (d.title || 'wiki');
      $('#saveWiki').hidden = false;
      $('#saveWiki').textContent = d.isNew ? 'Add to wiki page' : 'Save to wiki';
      flash(d.isNew ? 'New Mech item for ' + d.title : 'Editing a Mech item on ' + d.title);
      fromWiki = true;
    }
    if (d.action == 'saved') { flash('Saved to the wiki page'); $('#saveWiki').textContent = 'Save to wiki'; }
  });
}
let fromWiki = false;
$('#saveWiki').addEventListener('click', () => {
  if (!window.opener || window.opener.closed) return flash('The wiki page is closed, so there is nowhere to save. Copy Mech text instead.');
  window.opener.postMessage({ toolType: 'mech-blocks', action: 'saveMech', text: serialize(model) }, '*');
});

buildPalette();
renderLegend();
const start = corpus.findIndex(c => c.slug == 'testing-neighbor-mech');
sel.value = String(start >= 0 ? start : 0);
if (!fromWiki) setText(corpus[+sel.value].text);
<\/script>
</body>
</html>
`;

  // src/mechblocks.mjs
  var LOCAL = /(^|\.)localhost$/.test(window.location.hostname);
  var GRAPH_URL = LOCAL ? "http://localhost:8765/tools/graph-tool-v22.html" : "https://marc.relocalizecreativity.net/assets/Drag/graph-tool-v22.html";
  var esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  var FAMILY = [
    [["neighborhood", "page", "info"], "#1d4ed8", "sites and pages"],
    [["aspect", "marker"], "#15803d", "graphs"],
    [["items"], "#c2410c", "lists of items"],
    [["assets", "tsv", "txt", "csv", "html", "json"], "#0f766e", "files and text"],
    [["temperature", "tick"], "#b45309", "readings and counts"],
    [["result", "commons", "recent", "actions"], "#7c3aed", "from the server"],
    [["turtle"], "#4b5563", "the turtle drawing"]
  ];
  function family(key) {
    for (const [keys, color, label] of FAMILY) if (keys.includes(key)) return { color, label };
    return { color: "#6b7280", label: "made by CODE or a plugin" };
  }
  var notebooks = /* @__PURE__ */ new Map();
  var owner = (who) => notebooks.get(String(who).split(".")[0]);
  var tracer = makeTracer((ev) => owner(ev.who)?.onState(ev));
  instrument(blocks, tracer, (ev) => owner(ev.who)?.onBlock(ev));
  function ensureCSS() {
    if (!document.querySelector("link[href='/plugins/mech/mech.css']"))
      $('<link rel="stylesheet" href="/plugins/mech/mech.css" type="text/css">').appendTo("head");
    if (!document.getElementById("mechblocks-css")) {
      const style = document.createElement("style");
      style.id = "mechblocks-css";
      style.textContent = STYLE;
      document.head.appendChild(style);
    }
  }
  var STYLE = `
.mechblocks { background:#f6f4ee; padding:10px 12px; border-radius:6px; font-size:14px; }
.mechblocks .mb-head { display:flex; justify-content:space-between; align-items:baseline; gap:8px; margin-bottom:6px; }
.mechblocks .mb-row { background:#fff; border:1px solid #ddd; border-radius:5px; padding:6px 8px; margin:5px 0; }
.mechblocks .mb-row code { font-size:12px; white-space:pre; display:block; margin-bottom:5px; color:#333; max-height:4.6em; overflow:hidden; }
.mechblocks button { cursor:pointer; font-size:13px; margin-right:4px; }
.mechblocks .mb-none { color:#666; font-style:italic; }
.mb-nb { margin-top:10px; background:#fff; border:1px solid #ccc; border-radius:6px; padding:8px; }
.mb-nb-bar { display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-bottom:6px; font-size:13px; }
.mb-nb-body { position:relative; display:flex; gap:56px; align-items:flex-start; }
.mb-script { flex:0 1 auto; min-width:0; background:#eee; padding:8px; border-radius:4px; }
.mb-script .block.mb-running { outline:3px solid #fbbf24; border-radius:3px; }
.mb-ovals { flex:1 0 120px; display:flex; flex-direction:column; gap:10px; padding-top:4px; }
.mb-oval { border:2px solid var(--f); border-radius:999px; padding:3px 10px; background:#fff; font-size:12px; text-align:center; transition:box-shadow .25s, background .25s; }
.mb-oval b { color:var(--f); }
.mb-oval .mb-count { display:block; font-size:10px; color:#666; }
.mb-oval.missing { border-style:dashed; border-color:#b91c1c; color:#b91c1c; }
.mb-oval.absent { border-style:dashed; border-color:#cbd5e1; color:#94a3b8; }
.mb-oval.absent b { color:#94a3b8; }
.mb-oval.pulse { box-shadow:0 0 0 6px color-mix(in srgb, var(--f) 35%, transparent); background:color-mix(in srgb, var(--f) 12%, white); }
.mb-wires { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; overflow:visible; }
.mb-wires path { fill:none; }
.mb-wires path.flash { stroke-width:4 !important; }
.mb-log { margin-top:6px; font-size:12px; color:#444; max-height:7.5em; overflow:auto; border-top:1px solid #eee; padding-top:4px; }
.mb-key { font-size:11px; color:#555; margin-top:6px; }
`;
  function emit($item, item) {
    ensureCSS();
    $item.append(`
    <div class="mechblocks">
      <div class="mb-head"><b>Mech Blocks</b><span><button class="mb-refresh" title="Look again for Mech items on this page">\u21BB</button><button class="mb-new">\uFF0B New Mech in blocks \u2197</button></span></div>
      <div class="mb-list"></div>
      <div class="mb-notebook"></div>
    </div>`);
  }
  function bind($item, item) {
    const $page = $item.parents(".page:first");
    const pageEl = $page[0];
    if (pageEl && !pageEl.dataset.key && $page.data("key")) pageEl.dataset.key = $page.data("key");
    const list = () => renderList($item, $page);
    setTimeout(list, 0);
    $item.on("click", ".mb-refresh", list);
    $item.on("click", ".mb-new", () => openEditor($page, null, "", $item));
    $item.on("click", ".mb-edit", (e) => {
      const id = $(e.target).closest(".mb-row").data("id");
      const mech = mechItems($page).find((m) => m.id == id);
      if (mech) openEditor($page, mech.id, mech.text, $item);
    });
    $item.on("click", ".mb-watch", (e) => {
      const id = $(e.target).closest(".mb-row").data("id");
      const mech = mechItems($page).find((m) => m.id == id);
      if (mech) watch($item, $page, mech);
    });
    $item.on("dblclick", ".mb-head b", () => wiki.textEditor($item, item));
  }
  function mechItems($page) {
    const found = /* @__PURE__ */ new Map();
    let story = [];
    try {
      story = wiki.lineup.atKey($page.data("key")).getRawPage().story;
    } catch {
    }
    for (const it2 of story) if (it2.type == "mech") found.set(it2.id, it2);
    const drawn = $page.find(".item").map((i, el) => wiki.getItem($(el))?.id).get();
    $page.find(".item.mech").each((i, el) => {
      const it2 = wiki.getItem($(el));
      if (it2 && it2.id) found.set(it2.id, it2);
    });
    const rank = (it2) => {
      const d = drawn.indexOf(it2.id);
      return d >= 0 ? d : 1e3 + story.indexOf(it2);
    };
    return [...found.values()].sort((a, b) => rank(a) - rank(b));
  }
  function itemElement($page, id) {
    return $page.find(".item.mech").filter((i, el) => wiki.getItem($(el))?.id == id).first();
  }
  function renderList($item, $page) {
    const mechs = mechItems($page);
    const html = mechs.length ? mechs.map((m, n) => `
        <div class="mb-row" data-id="${esc(m.id)}">
          <code>${esc((m.text || "").split("\n").slice(0, 3).join("\n"))}${(m.text || "").split("\n").length > 3 ? "\n\u2026" : ""}</code>
          <button class="mb-edit">Edit in blocks \u2197</button><button class="mb-watch">Watch it run</button>
          <span style="color:#888;font-size:12px">Mech item ${n + 1}</span>
        </div>`).join("") : `<div class="mb-none">No Mech items on this page yet. \uFF0B New Mech in blocks builds one.</div>`;
    $item.find(".mb-list").html(html);
  }
  var editor = null;
  function openEditor($page, id, text, $after) {
    const url = URL.createObjectURL(new Blob([mech_blocks_default], { type: "text/html" }));
    const popup = window.open(url, "mechblocks-editor", "popup,width=1420,height=900");
    if (!popup) return alert("The browser blocked the Mech Blocks window. Allow pop-ups for this wiki and try again.");
    editor = { popup, $page, id, text, $after, url };
    popup.focus();
  }
  window.addEventListener("message", (event) => {
    if (!editor || event.source !== editor.popup) return;
    const data = event.data || {};
    if (data.toolType != "mech-blocks") return;
    if (data.action == "mechBlocksReady") {
      const title = editor.$page.data("data")?.title || "";
      editor.popup.postMessage({ toolType: "mech-blocks", action: "loadMech", text: editor.text, title, isNew: !editor.id }, "*");
    }
    if (data.action == "saveMech") {
      const text = String(data.text);
      if (editor.id) saveExisting(editor.$page, editor.id, text);
      else {
        const $new = wiki.createItem(editor.$page, editor.$after, { type: "mech", text });
        editor.id = $new.data("item").id;
      }
      editor.text = text;
      editor.popup.postMessage({ toolType: "mech-blocks", action: "saved" }, "*");
      setTimeout(() => editor.$after && renderList(editor.$after, editor.$page), 700);
    }
  });
  function saveExisting($page, id, text) {
    const $mech = itemElement($page, id);
    const old = wiki.getItem($mech) || mechItems($page).find((m) => m.id == id);
    const item = Object.assign({}, old, { text });
    $mech.empty().unbind();
    $mech.data("item", item);
    wiki.getPlugin("mech", (plugin) => {
      plugin.emit($mech, item);
      plugin.bind($mech, item);
    });
    wiki.pageHandler.put($page, { type: "edit", id, item });
  }
  function watch($item, $page, mech) {
    for (const [prefix2, nb2] of notebooks) if (nb2.$item.is($item)) notebooks.delete(prefix2);
    const nest = tree((mech.text || "").split(/\n/), [], 0);
    const html = format(nest);
    const prefix = (html.match(/id=(\d+)\./) || [])[1] || String(Math.random());
    const pageKey = $page.data("key");
    const nb = new Notebook($item, mech, prefix);
    notebooks.set(prefix, nb);
    nb.render(html);
    const context = {
      item: mech,
      itemId: mech.id,
      pageKey,
      page: wiki.lineup.atKey(pageKey).getRawPage(),
      origin: window.origin,
      site: $page.data("site") || window.location.host,
      slug: $page.attr("id"),
      title: $page.data("data").title,
      blocks: Object.keys(blocks)
    };
    nb.state = { context, api };
    run(nest, tracer.wrap(nb.state, `${prefix}.top`));
  }
  var Notebook = class {
    constructor($item, mech, prefix) {
      this.$item = $item;
      this.mech = mech;
      this.prefix = prefix;
      this.keys = /* @__PURE__ */ new Map();
      this.wires = /* @__PURE__ */ new Map();
      this.flashing = /* @__PURE__ */ new Set();
      this.lines = [];
      this.queued = false;
      this.claims = /* @__PURE__ */ new Map();
      this.failed = /* @__PURE__ */ new Set();
    }
    render(scriptHTML) {
      const first = (this.mech.text || "").split("\n")[0];
      this.$item.find(".mb-notebook").html(`
      <div class="mb-nb">
        <div class="mb-nb-bar"><span>Watching <code>${esc(first)}</code> run with Ward's own blocks. Click \u25B6 in the script to start it.</span>
          <button class="mb-graph" disabled title="Becomes active once the run has made graphs (state.aspect)">Graph Tool \u2197</button>
          <button class="mb-close">Close</button></div>
        <div class="mb-nb-body">
          <div class="mb-script">${scriptHTML}</div>
          <div class="mb-ovals"><div class="mb-none">The notebook is empty.</div></div>
          <svg class="mb-wires"><defs>
            <marker id="mb-arrow-${this.prefix}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker>
          </defs></svg>
        </div>
        <div class="mb-key">Solid line: the block wrote it. Dashed line: the block read it. Red: a block needed it, it was not there, and the block stopped. Grey: looked for, not there, not needed.</div>
        <div class="mb-log"></div>
      </div>`);
      const $nb = this.$item.find(".mb-nb");
      $nb.on("click", ".mb-close", () => {
        notebooks.delete(this.prefix);
        $nb.remove();
      });
      $nb.on("click", ".mb-graph", () => this.toGraphTool());
    }
    label(who) {
      const el = document.getElementById(who);
      return el ? (el.firstChild?.textContent || el.textContent || "").trim().split(/\s+/)[0] : "the script";
    }
    onBlock(ev) {
      const el = document.getElementById(ev.who);
      if (el) el.classList.toggle("mb-running", ev.phase == "start");
      if (ev.phase == "end" && el && el.querySelector(".trouble")) {
        this.failed.add(ev.who);
        this.schedule();
      }
    }
    onState(ev) {
      if (!String(ev.who).startsWith(this.prefix)) return;
      if (ev.kind == "write" && ev.key == "result" && ev.value && Array.isArray(ev.value.mech)) {
        const claim = /* @__PURE__ */ new Map();
        for (const line of ev.value.mech.flat(9)) for (const k3 of line && line.writes || []) claim.set(k3, line.key);
        this.claims.set(ev.who, claim);
      } else if (ev.kind == "write" && this.claims.get(ev.who)?.has(ev.key) && document.getElementById(this.claims.get(ev.who).get(ev.key))) {
        ev = { ...ev, who: this.claims.get(ev.who).get(ev.key) };
      }
      const k2 = this.keys.get(ev.key) || { writes: 0, reads: 0, missing: 0, last: void 0 };
      if (ev.kind == "write") {
        k2.writes++;
        k2.last = ev.value;
        k2.writer = ev.who;
      }
      if (ev.kind == "read") k2.reads++;
      if (ev.kind == "miss") k2.missing++;
      if (ev.kind == "delete") {
        k2.deleted = true;
      }
      this.keys.set(ev.key, k2);
      const kind = ev.kind == "miss" ? "miss" : ev.kind == "write" || ev.kind == "delete" ? "write" : "read";
      const wk = `${kind}|${ev.who}|${ev.key}`;
      const fresh = !this.wires.has(wk);
      this.wires.set(wk, (this.wires.get(wk) || 0) + 1);
      if (fresh && !String(ev.who).endsWith(".top")) {
        const verb = { write: ev.kind == "delete" ? "removed" : "wrote", read: "read", miss: "looked for, and did not find," }[kind];
        const plain = ev.value == null || typeof ev.value != "object";
        this.lines.push(`${this.label(ev.who)} ${verb} ${ev.key}${kind == "write" && ev.kind != "delete" && plain ? ` (${preview(ev.value, 60)})` : ""}`);
      }
      this.flashing.add(wk);
      if (ev.key == "aspect" && ev.kind == "write") this.$item.find(".mb-graph").prop("disabled", false);
      this.schedule();
    }
    schedule() {
      if (this.queued) return;
      this.queued = true;
      requestAnimationFrame(() => {
        this.queued = false;
        this.draw();
      });
    }
    draw() {
      const $nb = this.$item.find(".mb-nb");
      if (!$nb.length) return;
      const ovals = [...this.keys.entries()].map(([key, k2]) => {
        const f = family(key);
        const absent = !k2.writes && k2.missing && !(this.state && key in tracer.unwrap(this.state));
        const missing = absent && this.missedBy(key).some((who) => this.failed.has(who));
        const counts = [k2.writes && `written ${k2.writes}\xD7`, k2.reads && `read ${k2.reads}\xD7`, missing ? "missing" : absent && "not there"].filter(Boolean).join(" \xB7 ");
        const title = missing ? `${key}: a block needed this and stopped without it` : absent ? `${key}: looked for, not there, and nothing failed for want of it` : `${key} (${f.label}): ${preview(k2.last)}${k2.writer ? ` \u2014 last written by ${this.label(k2.writer)}` : ""}`;
        const pulse = [...this.flashing].some((w) => w.endsWith(`|${key}`));
        return `<div class="mb-oval${missing ? " missing" : absent ? " absent" : ""}${pulse ? " pulse" : ""}" data-key="${esc(key)}" style="--f:${f.color}" title="${esc(title)}"><b>${esc(key)}</b><span class="mb-count">${counts}</span></div>`;
      });
      $nb.find(".mb-ovals").html(ovals.join("") || '<div class="mb-none">The notebook is empty.</div>');
      $nb.find(".mb-log").html(this.lines.slice(-30).map(esc).join("<br>"));
      const body = $nb.find(".mb-nb-body")[0];
      const box = body.getBoundingClientRect();
      const svg = $nb.find(".mb-wires")[0];
      svg.querySelectorAll("path.w").forEach((p) => p.remove());
      for (const [wk] of this.wires) {
        const [kind, who, key] = wk.split("|");
        if (who.endsWith(".top")) continue;
        const el = document.getElementById(who);
        const ov = body.querySelector(`.mb-oval[data-key="${CSS_escape(key)}"]`);
        if (!el || !ov) continue;
        const a = el.getBoundingClientRect(), b = ov.getBoundingClientRect();
        const x1 = a.left - box.left + Math.min(a.width, 140) + 4, y1 = a.top - box.top + a.height / 2;
        const x2 = b.left - box.left - 2, y2 = b.top - box.top + b.height / 2;
        const mx = (x1 + x2) / 2;
        const color = kind == "miss" ? this.failed.has(who) ? "#b91c1c" : "#cbd5e1" : kind == "write" ? family(key).color : "#94a3b8";
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("class", "w" + (this.flashing.has(wk) ? " flash" : ""));
        p.setAttribute("stroke", color);
        p.setAttribute("stroke-width", kind == "write" ? 2.2 : 1.6);
        if (kind != "write") p.setAttribute("stroke-dasharray", kind == "miss" ? "2 4" : "6 4");
        p.setAttribute("d", kind == "write" ? `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` : `M${x2},${y2} C${mx},${y2} ${mx},${y1} ${x1},${y1}`);
        p.setAttribute("marker-end", `url(#mb-arrow-${this.prefix})`);
        svg.appendChild(p);
      }
      if (this.flashing.size) {
        clearTimeout(this.unflash);
        this.unflash = setTimeout(() => {
          this.flashing.clear();
          this.draw();
        }, 450);
      }
    }
    missedBy(key) {
      return [...this.wires.keys()].filter((w) => w.startsWith("miss|") && w.endsWith(`|${key}`)).map((w) => w.split("|")[1]);
    }
    toGraphTool() {
      const state = tracer.unwrap(this.state);
      if (!state.aspect) return;
      const title = `${this.$item.parents(".page:first").data("data")?.title || "Mech"} \u2014 Mech aspect`;
      const graphJSON = aspectToGraphJSON(state.aspect, title);
      const popup = window.open(GRAPH_URL, "rcngraph", "popup,height=820,width=1440");
      if (!popup) return alert("The browser blocked the Graph Tool window. Allow pop-ups for this wiki and try again.");
      const ready = (event) => {
        if (event.source !== popup || event.data?.action != "graphToolReady") return;
        popup.postMessage({ action: "loadGraph", graphJSON, pageTitle: title }, "*");
        window.removeEventListener("message", ready);
      };
      window.addEventListener("message", ready);
    }
  };
  function CSS_escape(s) {
    return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"');
  }
  window.plugins.mechblocks = { emit, bind };
})();
