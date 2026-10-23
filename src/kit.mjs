// Helpers that turn slide content into HTML. Every element with data-g="k" is revealed
// at fragment k (k=0 on slide entry). data-fx picks the reveal style.

export const PHASES = [
  { k: "Necesidad", c: "#4cc9f0" },
  { k: "Plan", c: "#5b9bff" },
  { k: "Épicas", c: "#b388ff" },
  { k: "Spec", c: "#2ee6a8" },
  { k: "Aplicar", c: "#8ee35a" },
  { k: "Revisión", c: "#ffc233" },
  { k: "Evaluar", c: "#ff8c3a" },
  { k: "Retro", c: "#ff6b9d" },
];

export const e = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const attr = (g, fx) => ` data-g="${g}"${fx ? ` data-fx="${fx}"` : ""}`;

// ---------- tiny syntax colouring ----------
const KW = new Set(
  "const let var return if else async await function import from export default new throw try catch true false null".split(" "),
);
export function hl(line, lang) {
  if (lang === "md") {
    let t = e(line);
    if (/^#{1,6} /.test(line)) return `<span class="k-h">${t}</span>`;
    t = t.replace(/\*\*(.+?)\*\*/g, '<span class="k-b">**$1**</span>');
    t = t.replace(/^(\s*- )(\[[ x]\])/, '$1<span class="k-s">$2</span>');
    t = t.replace(/^(\s*- )/, '<span class="k-n">$1</span>');
    return t;
  }
  if (lang === "yaml") {
    return e(line).replace(/^(\s*-?\s*)([\w.\-]+)(:)/, '$1<span class="k-k">$2</span>$3').replace(
      /(#.*)$/,
      '<span class="k-c">$1</span>',
    );
  }
  if (lang === "sh") {
    return e(line).replace(/^(\$ )?(\S+)/, '<span class="k-n">$1</span><span class="k-k">$2</span>');
  }
  // js / jsx
  const re = /(\/\/.*$)|('[^']*'|"[^"]*"|`[^`]*`)|(\b\d+\b)|([A-Za-z_$][\w$]*)/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(line))) {
    out += e(line.slice(last, m.index));
    if (m[1]) out += `<span class="k-c">${e(m[1])}</span>`;
    else if (m[2]) out += `<span class="k-s">${e(m[2])}</span>`;
    else if (m[3]) out += `<span class="k-n">${e(m[3])}</span>`;
    else if (KW.has(m[4])) out += `<span class="k-k">${e(m[4])}</span>`;
    else out += e(m[4]);
    last = re.lastIndex;
  }
  return out + e(line.slice(last));
}

// ---------- components ----------
export function cards(items, { cols = items.length, g0 = 0, step = 0, fx = "up", cls = "" } = {}) {
  const html = items
    .map((it, i) => {
      const g = step ? g0 + i * step : g0;
      const col = it.c ? ` style="--cc:${it.c}"` : "";
      return `<div class="card ${cls}"${attr(g, it.fx || fx)}${col}>${
        it.i ? `<div class="ci">${it.i}</div>` : ""
      }${it.h ? `<h3>${it.h}</h3>` : ""}${it.p ? `<p>${it.p}</p>` : ""}</div>`;
    })
    .join("");
  return `<div class="cards" style="grid-template-columns:repeat(${cols},1fr)">${html}</div>`;
}

export function bullets(items, { g0 = 0, step = 1, cls = "" } = {}) {
  return `<ul class="bul ${cls}">${items
    .map((t, i) => `<li${attr(g0 + i * step, "left")}>${t}</li>`)
    .join("")}</ul>`;
}

// lines: {cmd} typed command | {out} output | {note} dim line; optional g
export function term(lines, { title = "claude", g0 = 0 } = {}) {
  let g = g0;
  const rows = lines
    .map((l, i) => {
      if (l.g !== undefined) g = l.g;
      else if (i > 0 && l.cmd) g += 1;
      if (l.cmd)
        return `<div class="tl cmd"${attr(g)}><span class="pr">❯</span><span class="typed" data-text="${e(l.cmd)}"></span></div>`;
      if (l.note) return `<div class="tl note"${attr(g)}>${e(l.note)}</div>`;
      const cls = l.ok ? "out ok" : l.warn ? "out warn" : "out";
      return `<div class="tl ${cls}"${attr(g)}>${e(l.out)}</div>`;
    })
    .join("");
  return `<div class="term"><div class="tbar"><i></i><i></i><i></i><span>${e(title)}</span></div><div class="tbody">${rows}</div></div>`;
}

// lines: string | {t, g, mark}
export function code(file, lines, { lang = "js", g0 = 0, size = "" } = {}) {
  const rows = lines
    .map((l) => {
      const o = typeof l === "string" ? { t: l } : l;
      const g = o.g !== undefined ? o.g : g0;
      const mk = o.mark ? ` mk-${o.mark}` : "";
      return `<div class="ln${mk}"${attr(g, "fade")}>${hl(o.t, lang) || "&nbsp;"}</div>`;
    })
    .join("");
  return `<div class="code ${size}"><div class="cbar"><span>${e(file)}</span></div><div class="cbody">${rows}</div></div>`;
}

export function tree(lines, { g0 = 0, step = 0 } = {}) {
  const rows = lines
    .map((l, i) => {
      const o = typeof l === "string" ? { t: l } : l;
      const g = o.g !== undefined ? o.g : step ? g0 + i * step : g0;
      const cls = o.hot ? " hot" : "";
      return `<div class="tr${cls}"${attr(g, "left")}>${e(o.t).replace(/ /g, "&nbsp;")}${
        o.n ? `<span class="tn">${e(o.n)}</span>` : ""
      }</div>`;
    })
    .join("");
  return `<div class="tree">${rows}</div>`;
}

export function table(head, rows, { g0 = 0, step = 0, cols, sm = false } = {}) {
  const tpl = cols ? ` style="grid-template-columns:${cols}"` : ` style="grid-template-columns:repeat(${head.length},1fr)"`;
  const h = `<div class="trow th"${tpl}${attr(g0, "fade")}>${head.map((x) => `<div>${x}</div>`).join("")}</div>`;
  const b = rows
    .map((r, i) => {
      const g = step ? g0 + (i + 1) * step : g0;
      return `<div class="trow"${tpl}${attr(g, "up")}>${r.map((x) => `<div>${x}</div>`).join("")}</div>`;
    })
    .join("");
  return `<div class="table${sm ? " sm" : ""}">${h}${b}</div>`;
}

export const call = (html, { g = 0, kind = "", fx = "up" } = {}) =>
  `<div class="call ${kind}"${attr(g, fx)}>${html}</div>`;

export const chip = (t, c) => `<span class="chip" style="--cc:${c}">${t}</span>`;
export const row = (inner, gap = 36, cls = "") =>
  `<div class="row ${cls}" style="gap:${gap}px">${inner}</div>`;
export const col = (inner, flex = 1, cls = "") => `<div class="col ${cls}" style="flex:${flex}">${inner}</div>`;
export const g = (n, html, fx = "up", cls = "") => `<div class="${cls}"${attr(n, fx)}>${html}</div>`;
export const code1 = (t) => `<code class="ic">${e(t)}</code>`;
