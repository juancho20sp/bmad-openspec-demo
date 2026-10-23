import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PHASES, e } from "./kit.mjs";
import { slides, branches } from "./content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

const F0 = 4.2; // local time of fragment 1
const FSTEP = 2.0; // gap between fragments
const fragTime = (k) => F0 + FSTEP * (k - 1);
const H0 = 2.7; // entrance finished: first hold of every slide

const css = `
:root{--bg:#0a0e16;--bg2:#10161f;--ink:#eaf0fa;--dim:#8e9bb0;--line:#243044;--card:#131b27;
--bmad:#6ea8ff;--ospec:#3ee6b0;--c:#4cc9f0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:var(--bg)}
#root{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;background:var(--bg)}
.slide{position:absolute;left:0;top:0;width:1920px;height:1080px}
.sbox{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;background:var(--bg);color:var(--ink);font-family:Inter,sans-serif;font-size:40px;line-height:1.35}
.glow{position:absolute;left:0;top:0;width:1920px;height:1080px;background:radial-gradient(900px 600px at 88% -8%,color-mix(in srgb,var(--c) 22%,transparent),transparent 70%),radial-gradient(700px 500px at -5% 105%,color-mix(in srgb,var(--c) 12%,transparent),transparent 70%)}
.grid{position:absolute;left:0;top:0;width:1920px;height:1080px;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:80px 80px;opacity:.18}
.strip{position:absolute;left:100px;top:52px;right:100px;height:44px;display:flex;gap:10px;align-items:center}
.ph{display:flex;align-items:center;gap:10px;font-size:28px;font-weight:600;color:#7886a0;padding:6px 16px 6px 12px;border-radius:30px;border:2px solid transparent}
.ph i{display:block;width:14px;height:14px;border-radius:50%;background:#33415a}
.ph.done{color:#93a1ba}.ph.done i{background:var(--pc)}
.ph.on{color:#fff;border-color:var(--pc);background:color-mix(in srgb,var(--pc) 16%,transparent)}
.ph.on i{background:var(--pc);box-shadow:0 0 14px var(--pc)}
.tools{position:absolute;right:100px;top:52px;display:flex;gap:12px}
.tb{font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700;padding:6px 16px;border-radius:10px;border:2px solid var(--tc);color:var(--tc);background:color-mix(in srgb,var(--tc) 10%,transparent)}
.main{position:absolute;left:100px;right:100px;top:132px;bottom:100px;display:flex;flex-direction:column}
.kick{font-size:30px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--c);margin-bottom:6px}
.ttl{font-family:Outfit,sans-serif;font-weight:700;font-size:74px;line-height:1.05;letter-spacing:-.02em;margin-bottom:30px}
.ttl em{font-style:normal;color:var(--c)}
.body>*{flex-shrink:0}
.bignum{position:absolute;right:70px;top:90px;font-family:Outfit,sans-serif;font-weight:800;font-size:820px;line-height:1;color:color-mix(in srgb,var(--c) 15%,transparent)}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:28px;min-height:0;padding-bottom:20px}
.foot{position:absolute;left:100px;right:100px;bottom:34px;height:44px;display:flex;justify-content:space-between;align-items:center;font-size:28px;color:var(--dim)}
.foot b{color:var(--ink);font-weight:600}
.foot .arrow{color:var(--c);margin:0 10px}
.num{font-family:'JetBrains Mono',monospace}
.cards{display:grid;gap:26px}
.card{background:var(--card);border:2px solid var(--line);border-radius:22px;padding:26px 30px;border-top:6px solid var(--cc,var(--c))}
.card h3{font-family:Outfit,sans-serif;font-size:46px;line-height:1.1;margin-bottom:10px;color:var(--cc,var(--ink))}
.card p{font-size:40px;color:#c4cfe0;line-height:1.3}
.card .ci{font-size:62px;line-height:1;margin-bottom:10px}
.bul{list-style:none;display:flex;flex-direction:column;gap:20px}
.bul li{padding-left:50px;position:relative;font-size:44px;line-height:1.28}
.bul li:before{content:"";position:absolute;left:6px;top:20px;width:20px;height:20px;border-radius:6px;background:var(--c)}
.bul.sm li{font-size:40px}
.term{background:#070a10;border:2px solid var(--line);border-radius:18px;overflow:hidden;font-family:'JetBrains Mono',monospace}
.tbar{display:flex;align-items:center;gap:10px;padding:14px 20px;background:#121927;border-bottom:2px solid var(--line);font-size:28px;color:var(--dim)}
.tbar i{width:16px;height:16px;border-radius:50%;background:#33415a;display:block}
.tbar span{margin-left:14px}
.tbody{padding:22px 30px;display:flex;flex-direction:column;gap:8px}
.tl{font-size:40px;line-height:1.3;white-space:pre-wrap;word-break:break-word}
.tl.cmd{color:#fff}.tl.cmd .pr{color:var(--c);margin-right:18px}
.tl.out{color:#b5c2d8}.tl.out.ok{color:var(--ospec)}.tl.out.warn{color:#ffc233}.tl.note{color:#6c7a92}
.code{background:#070a10;border:2px solid var(--line);border-radius:18px;overflow:hidden;font-family:'JetBrains Mono',monospace}
.cbar{padding:12px 24px;background:#121927;border-bottom:2px solid var(--line);font-size:28px;color:var(--dim)}
.cbody{padding:18px 24px}
.ln{font-size:40px;line-height:1.36;white-space:pre;color:#d7e0ef}
.ln.mk-bad{background:rgba(255,80,80,.16);box-shadow:-24px 0 0 rgba(255,80,80,.16),24px 0 0 rgba(255,80,80,.16)}
.ln.mk-good{background:rgba(62,230,176,.14);box-shadow:-24px 0 0 rgba(62,230,176,.14),24px 0 0 rgba(62,230,176,.14)}
.code.sm .ln{font-size:36px}
.k-c{color:#6c7a92}.k-s{color:#9ae6b4}.k-n{color:#ffb86b}.k-k{color:#79b8ff}.k-h{color:var(--c);font-weight:700}.k-b{color:#fff;font-weight:700}
.tree{font-family:'JetBrains Mono',monospace;background:#070a10;border:2px solid var(--line);border-radius:18px;padding:20px 28px}
.tr{font-size:38px;line-height:1.38;color:#c4cfe0;white-space:nowrap}
.tr.hot{color:var(--c);font-weight:700}
.tn{margin-left:26px;font-family:Inter,sans-serif;font-size:32px;color:var(--dim);font-weight:500}
.table{display:flex;flex-direction:column;gap:10px}
.trow{display:grid;gap:16px;align-items:center;background:var(--card);border:2px solid var(--line);border-radius:16px;padding:14px 24px;font-size:38px}
.table.sm{gap:6px}.table.sm .trow{font-size:34px;padding:7px 22px}.trow.th{background:transparent;border:none;color:var(--dim);font-size:30px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:0 24px}
.call{background:color-mix(in srgb,var(--c) 12%,var(--card));border:2px solid var(--c);border-left-width:10px;border-radius:16px;padding:20px 30px;font-size:40px;line-height:1.3}
.call.warn{border-color:#ffc233;background:rgba(255,194,51,.1)}
.call.bad{border-color:#ff6b6b;background:rgba(255,107,107,.1)}
.call.good{border-color:var(--ospec);background:rgba(62,230,176,.1)}
.call b{color:#fff}
.row{display:flex;align-items:stretch}
.col{display:flex;flex-direction:column;gap:22px;min-width:0}
.chip{display:inline-block;font-size:30px;font-weight:700;padding:4px 16px;border-radius:30px;border:2px solid var(--cc);color:var(--cc);background:color-mix(in srgb,var(--cc) 12%,transparent)}
.ic{font-family:'JetBrains Mono',monospace;font-size:.92em;background:#18212f;border:1px solid var(--line);border-radius:8px;padding:1px 10px;color:#fff}
.big{font-family:Outfit,sans-serif;font-weight:700;line-height:1}
.dim{color:var(--dim)}
.ctr{align-items:center;justify-content:center;text-align:center}
.flow{display:flex;align-items:center;gap:18px}
.node{background:var(--card);border:2px solid var(--nc,var(--line));border-radius:18px;padding:18px 24px;text-align:center;font-size:36px;line-height:1.2;color:#fff}
.node small{display:block;font-size:30px;color:var(--dim);margin-top:6px}
.arr{font-size:54px;color:var(--c);line-height:1}
.opt{position:absolute;background:var(--card);border:3px solid var(--c);border-radius:22px;padding:22px 28px;font-size:38px;line-height:1.25;cursor:pointer}
.opt b{display:block;font-family:Outfit,sans-serif;font-size:50px;color:var(--c);margin-bottom:8px}
`;

const engine = `
const F0=${F0},FSTEP=${FSTEP};
const FX={
 up:[{opacity:0,y:30},{opacity:1,y:0}],
 pop:[{opacity:0,scale:.5,transformOrigin:"50% 50%"},{opacity:1,scale:1}],
 left:[{opacity:0,x:-70},{opacity:1,x:0}],
 right:[{opacity:0,x:70},{opacity:1,x:0}],
 fade:[{opacity:0},{opacity:1}],
 grow:[{opacity:0,scaleX:0,transformOrigin:"0% 50%"},{opacity:1,scaleX:1}]
};
function fragTime(k){return F0+FSTEP*(k-1);}
var tl=gsap.timeline({paused:true});
var last=document.querySelector("section.slide:last-of-type");
document.querySelectorAll("section.slide").forEach(function(sec){
  var S=+sec.getAttribute("data-start");
  var D=+sec.getAttribute("data-duration");
  var scope=function(q){return sec.querySelectorAll(q);};
  var box=sec.querySelector(".sbox");
  if(S>0){tl.set(box,{autoAlpha:0},0);tl.set(box,{autoAlpha:1},S);}
  if(sec!==last)tl.set(box,{autoAlpha:0},S+D);
  var put=function(q,a,b,pos){var n=scope(q);if(n.length)tl.fromTo(n,a,b,S+pos);};
  put(".kick",{opacity:0,x:-40},{opacity:1,x:0,duration:.5,ease:"power3.out"},0.05);
  put(".ttl",{opacity:0,y:34},{opacity:1,y:0,duration:.6,ease:"power3.out"},0.12);
  put(".bignum",{opacity:0,scale:.85,transformOrigin:"50% 50%"},{opacity:1,scale:1,duration:.9,ease:"power3.out"},0.1);
  put(".ph.on i",{scale:0.2},{scale:1.35,duration:.5,ease:"back.out(3)"},0.2);
  var groups={};
  scope("[data-g]").forEach(function(el){var k=+el.getAttribute("data-g");(groups[k]=groups[k]||[]).push(el);});
  Object.keys(groups).map(Number).sort(function(a,b){return a-b;}).forEach(function(k){
    var els=groups[k];
    var n=els.length;
    var stagger=k===0?Math.min(0.14,1.5/Math.max(n,1)):Math.min(0.12,0.5/Math.max(n,1));
    var base=k===0?0.3:fragTime(k)-1.05;
    els.forEach(function(el,i){
      var fx=FX[el.getAttribute("data-fx")||"up"];
      var from=Object.assign({},fx[0]),to=Object.assign({duration:.55,ease:"power3.out"},fx[1]);
      tl.fromTo(el,from,to,S+base+i*stagger);
      el.querySelectorAll(".typed").forEach(function(t){
        var full=t.getAttribute("data-text"),len=full.length;
        var dur=Math.min(1.2,0.03*len+0.2);
        var start=k===0?base+i*stagger+0.2:fragTime(k)-0.1-dur;
        var o={n:0};
        var set=function(){t.textContent=full.slice(0,Math.round(o.n));};
        tl.fromTo(o,{n:0},{n:len,duration:dur,ease:"none",onUpdate:set,onReverseComplete:set},S+start);
      });
    });
  });
  scope("[data-spin]").forEach(function(el){
    tl.fromTo(el,{rotation:0},{rotation:360,duration:+el.getAttribute("data-spin"),ease:"none"},S);
  });
});
window.__timelines["main"]=tl;
`;

function strip(phase) {
  return PHASES.map((p, i) => {
    const n = i + 1;
    const cls = phase === 0 ? "" : n === phase ? "on" : n < phase ? "done" : "";
    return `<div class="ph ${cls}" style="--pc:${p.c}"><i></i>${p.k}</div>`;
  }).join("");
}

function toolBadges(t) {
  const b = [];
  if (t === "bmad" || t === "both") b.push(`<div class="tb" style="--tc:var(--bmad)">BMAD</div>`);
  if (t === "openspec" || t === "both") b.push(`<div class="tb" style="--tc:var(--ospec)">OpenSpec</div>`);
  return b.join("");
}

function maxG(html) {
  let m = 0;
  for (const x of html.matchAll(/data-g="(\d+)"/g)) m = Math.max(m, +x[1]);
  return m;
}

function sceneHTML(s, id, start, dur, idx, total) {
  const color = s.phase ? PHASES[s.phase - 1].c : s.color || "#4cc9f0";
  const kicker = s.kicker || (s.phase ? `Fase ${s.phase} · ${PHASES[s.phase - 1].k}` : "");
  const foot = s.who
    ? `<span>Actúa: <b>${s.who[0]}</b>${s.who[1] ? `<span class="arrow">→</span>Entrega a: <b>${s.who[1]}</b>` : ""}</span>`
    : `<span></span>`;
  const hasStrip = s.phase !== undefined;
  const bare = s.bare;
  return `<section id="${id}" class="clip slide" data-start="${start.toFixed(2)}" data-duration="${dur.toFixed(2)}" data-track-index="1" data-label="${e(s.label || s.title.replace(/<[^>]+>/g, ""))}" style="--c:${color}">
<div class="sbox">
<div class="glow"></div><div class="grid"></div>
${s.bignum ? `<div class="bignum" data-layout-ignore>${s.bignum}</div>` : ""}
${hasStrip && !bare ? `<div class="strip">${strip(s.phase)}</div>` : ""}
<div class="tools">${toolBadges(s.tool)}</div>
<div class="main">
${kicker ? `<div class="kick">${e(kicker)}</div>` : ""}
<div class="ttl"${s.bigTitle ? ' style="font-size:128px;line-height:1.02;margin-bottom:44px"' : ""}>${s.title}</div>
<div class="body"${s.bodyStyle ? ` style="${s.bodyStyle}"` : ""}>${s.body}</div>
</div>
<div class="foot">${foot}<span class="num">${idx ? `${idx}/${total}` : "extra"}</span></div>
</div>
</section>`;
}

// ---------- assemble ----------
const total = slides.length;
let t = 0;
const scenes = [];
const island = { slides: [], slideSequences: [] };

function place(s) {
  const gm = maxG(s.body);
  const frags = [];
  if (gm) {
    frags.push(H0);
    for (let k = 1; k <= gm; k++) frags.push(fragTime(k));
  }
  const dur = Math.max(7, (gm ? fragTime(gm) : 3.2) + 2.2);
  return { gm, frags, dur };
}

slides.forEach((s, i) => {
  const id = s.id;
  const { frags, dur } = place(s);
  scenes.push(sceneHTML(s, id, t, dur, i + 1, total));
  const entry = { sceneId: id, startTime: +t.toFixed(2), endTime: +(t + dur).toFixed(2), notes: s.notes };
  if (frags.length) entry.fragments = frags.map((f) => +(t + f).toFixed(2));
  if (s.hotspots) entry.hotspots = s.hotspots;
  island.slides.push(entry);
  t += dur;
});

(branches || []).forEach((b) => {
  const seq = { id: b.id, label: b.label, slides: [] };
  b.slides.forEach((s) => {
    const { frags, dur } = place(s);
    scenes.push(sceneHTML(s, s.id, t, dur, 0, total));
    const entry = { sceneId: s.id, startTime: +t.toFixed(2), endTime: +(t + dur).toFixed(2), notes: s.notes };
    if (frags.length) entry.fragments = frags.map((f) => +(t + f).toFixed(2));
    seq.slides.push(entry);
    t += dur;
  });
  island.slideSequences.push(seq);
});

const islandJSON = JSON.stringify(island, null, 2);

const html = `<!doctype html>
<html lang="es" data-resolution="landscape">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>BMAD + OpenSpec en equipo</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>${css}</style>
</head>
<body>
<script type="application/hyperframes-slideshow+json">
${islandJSON}
</script>
<div id="root" data-composition-id="main" data-start="0" data-duration="${t.toFixed(2)}" data-width="1920" data-height="1080">
${scenes.join("\n")}
</div>
<script>
window.__timelines = window.__timelines || {};
${engine}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), html);
fs.writeFileSync(path.join(root, "src", "island.json"), islandJSON);
console.log(`slides: ${total} main + ${(branches || []).reduce((a, b) => a + b.slides.length, 0)} branch, ${t.toFixed(1)}s, ${(html.length / 1024).toFixed(0)} KB`);
