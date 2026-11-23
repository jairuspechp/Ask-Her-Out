/* bouquet.js: drawn flowers, used by the bouquet AND the falling flowers */

const FLOWER_TYPES = [
  "rafflesia", "sunflower", "sakura", "lavender", "seagrass",
  "peppermint", "primrose", "makahiya", "rose", "daisy"
];

/* n petals (ellipses) around the center */
function petals(n, dist, rx, ry, fill, offset = 0) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += `<ellipse cx="0" cy="${-dist}" rx="${rx}" ry="${ry}" ` +
         `transform="rotate(${offset + i * 360 / n})" style="fill:${fill}" ` +
         `stroke="rgba(0,0,0,.14)" stroke-width=".6"/>`;
  }
  return s;
}

/* n small circles on a ring; fills alternate through the list */
function ring(n, r, size, fills, offset = 0) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = (offset + i * 360 / n) * Math.PI / 180;
    s += `<circle cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a)).toFixed(1)}" r="${size}" ` +
         `fill="${fills[i % fills.length]}" stroke="rgba(0,0,0,.12)" stroke-width=".5"/>`;
  }
  return s;
}

/* n thin lines radiating from the center */
function rays(n, len, color, width) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += `<line x1="0" y1="0" x2="0" y2="${-len}" transform="rotate(${i * 360 / n})" ` +
         `stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  }
  return s;
}

/* five notched cherry-blossom petals */
function sakuraPetals() {
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += `<path d="M0 0 C-10 -6 -11 -17 -4.5 -20 L0 -15.5 L4.5 -20 C11 -17 10 -6 0 0Z" ` +
         `transform="rotate(${i * 72})" fill="#ffc9dc" stroke="#e58aa8" stroke-width=".7"/>`;
  }
  return s;
}

/* all flower shapes, each one a <g id="..."> */
function flowerDefsSVG() {
  return `
      <g id="rafflesia">
        ${petals(5, 11, 9.5, 10.5, "#b3262e")}
        ${ring(5, 12, 1.6, ["#f6d9c4"], -90)}
        ${ring(5, 15, 1.3, ["#f6d9c4"], -54)}
        <circle r="8" fill="#7a141b" stroke="#e8c07a" stroke-width="1.6"/>
        <circle r="4" fill="#3b0a0d"/>
      </g>

      <g id="sunflower">
        ${petals(16, 15, 3.6, 8.5, "#ffc21a")}
        ${petals(16, 13, 3.4, 7.5, "#ffd84d", 11)}
        <circle r="9" fill="#5a3410" stroke="#3b2208" stroke-width=".8"/>
        ${ring(11, 6, 1.1, ["#8a5a22", "#a8742f"])}
        ${ring(5, 2.8, 1.1, ["#8a5a22"])}
      </g>

      <g id="sakura">
        ${sakuraPetals()}
        ${rays(10, 7, "#d9608a", 0.8)}
        <circle r="2.8" fill="#f28fb1"/>
        ${ring(10, 7, 1, ["#fff2a8"], 18)}
      </g>

      <g id="lavender">
        ${ring(13, 13, 4, ["#8f6fd6", "#b79cf0"])}
        ${ring(8, 7.5, 3.8, ["#a585ea", "#c9b4f7"], 10)}
        ${ring(1, 0, 4.2, ["#7b57c9"])}
      </g>

      <g id="seagrass">
        ${petals(14, 12, 1.9, 13, "#3fa7a0")}
        ${petals(14, 9, 1.9, 10, "#7fd6c8", 12)}
        <circle r="4" fill="#2a8680" stroke="rgba(0,0,0,.15)" stroke-width=".6"/>
      </g>

      <g id="peppermint">
        ${petals(10, 10, 2.6, 8, "#6ccf9f")}
        ${ring(9, 8, 3.6, ["#a6ecc6", "#d3f7e2"], 10)}
        ${ring(4, 3.5, 3.2, ["#bff1d5"])}
        <circle r="2" fill="#fff"/>
      </g>

      <g id="primrose">
        ${petals(4, 10, 9.5, 10.5, "#3b2a8c")}
        ${petals(4, 8, 7, 8.5, "#5a44b8", 45)}
        ${rays(8, 8, "#2a1c68", 0.7)}
        <circle r="4" fill="#f5d04a" stroke="#c99a1f" stroke-width=".8"/>
      </g>

      <g id="makahiya">
        ${rays(26, 17, "#f06ba8", 1.6)}
        ${rays(26, 14, "#ff9cc8", 1.6)}
        ${ring(26, 17.5, 1.5, ["#ffd0e6"], -90)}
        <circle r="7" fill="#ff8cc0" stroke="#e5509a" stroke-width=".8"/>
        <circle r="3" fill="#ffd0e6"/>
      </g>

      <g id="rose">
        ${petals(5, 10, 6.5, 6.5, "var(--accent)")}
        <circle r="12" style="fill:var(--accent)" stroke="rgba(0,0,0,.14)" stroke-width=".6"/>
        <circle r="9"  style="fill:var(--yes)"    stroke="rgba(0,0,0,.14)" stroke-width=".6"/>
        <circle r="6"  style="fill:var(--accent)" stroke="rgba(0,0,0,.14)" stroke-width=".6"/>
        <circle r="3"  style="fill:var(--yes)"/>
      </g>

      <g id="daisy">
        ${petals(12, 10, 3, 8, "#ffffff")}
        <circle r="4.6" fill="#f5b83d" stroke="#b9852a" stroke-width=".6"/>
        <circle r="2" fill="#e08a2c"/>
      </g>`;
}

/* hidden sprite holding the flowers, added to the page once */
function installFlowerSprite() {
  if (document.getElementById("flower-sprite")) return;
  const sprite = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sprite.id = "flower-sprite";
  sprite.setAttribute("aria-hidden", "true");
  sprite.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
  sprite.innerHTML = "<defs>" + flowerDefsSVG() + "</defs>";
  document.body.appendChild(sprite);
}

/* ---------- falling flowers ---------- */

/* one random created flower falls from (x, y) in screen pixels */
function spawnFlowerPetal(x, y) {
  installFlowerSprite();
  if (document.querySelectorAll(".fall-flower").length > 70) return;   // keep it light

  const type = FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];
  const size = 30 + Math.random() * 20;

  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("class", "fall-flower");
  el.setAttribute("viewBox", "-26 -26 52 52");
  el.setAttribute("width", size);
  el.setAttribute("height", size);
  el.style.cssText =
    "position:fixed;pointer-events:none;z-index:9999;overflow:visible;" +
    "left:" + (x - size / 2) + "px;top:" + (y - size / 2) + "px;";
  el.innerHTML = '<use href="#' + type + '"/>';
  document.body.appendChild(el);

  const dx   = Math.random() * 160 - 80;
  const fall = window.innerHeight - y + 60;
  const rot  = Math.random() * 720 - 360;
  const dur  = 2800 + Math.random() * 2200;

  const anim = el.animate([
    { transform: "translate(0px,0px) rotate(0deg) scale(.4)", opacity: 0 },
    { transform: "translate(" + dx * 0.1 + "px," + fall * 0.05 + "px) rotate(" + rot * 0.1 + "deg) scale(1)",
      opacity: 1, offset: 0.08 },
    { transform: "translate(" + dx * 0.9 + "px," + fall * 0.9 + "px) rotate(" + rot * 0.9 + "deg) scale(.95)",
      opacity: 0.9, offset: 0.85 },
    { transform: "translate(" + dx + "px," + fall + "px) rotate(" + rot + "deg) scale(.9)", opacity: 0 }
  ], { duration: dur, easing: "ease-in" });
  anim.onfinish = () => el.remove();
}

/* flowers fall from the cursor whenever it moves */
let cursorFlowersOn = false;
function enableCursorFlowers() {
  if (cursorFlowersOn) return;
  cursorFlowersOn = true;
  let lastX = -999, lastY = -999, lastT = 0;
  document.addEventListener("pointermove", e => {
    const now = Date.now();
    if (now - lastT < 70) return;                                      // not too often
    if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < 20) return; // must really move
    lastT = now; lastX = e.clientX; lastY = e.clientY;
    spawnFlowerPetal(e.clientX, e.clientY);
  });
}

/* ---------- the bouquet ---------- */

function buildBouquetSVG() {
  installFlowerSprite();

  /* positions: outer ring first, center last (later = in front) */
  const spots = [];
  const rings = [
    { n: 18, rx: 108, ry: 46, s: 1.0,  start: 0 },
    { n: 12, rx: 78,  ry: 33, s: 1.05, start: 10 },
    { n: 7,  rx: 46,  ry: 20, s: 1.1,  start: 0 }
  ];
  rings.forEach(r => {
    for (let i = 0; i < r.n; i++) {
      const a = (r.start + i * 360 / r.n - 90) * Math.PI / 180;
      spots.push({ x: 140 + r.rx * Math.cos(a), y: 62 + r.ry * Math.sin(a), s: r.s });
    }
  });
  spots.push({ x: 140, y: 62, s: 1.25 });

  let stemsSVG = "", flowersSVG = "";
  spots.forEach((p, c) => {
    const endX = 140 + (p.x - 140) * 0.03;
    const c1x  = 140 + (p.x - 140) * 0.55;
    const c2x  = 140 + (p.x - 140) * 0.2;
    const d = `M${p.x.toFixed(1)} ${p.y.toFixed(1)} ` +
              `C${c1x.toFixed(1)} ${(p.y + 55).toFixed(1)} ${c2x.toFixed(1)} 220 ${endX.toFixed(1)} 296`;
    stemsSVG += `<path d="${d}" stroke="#1d6a37" stroke-width="6"/>` +
                `<path d="${d}" stroke="#3aa35f" stroke-width="3.5"/>`;

    const id = FLOWER_TYPES[(c * 3) % FLOWER_TYPES.length];
    flowersSVG += `<use href="#${id}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) ` +
                  `rotate(${(c * 37) % 360}) scale(${p.s})"/>`;
  });

  return `
  <svg class="bq-art" viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style="stop-color:var(--yes)"/>
        <stop offset="1" style="stop-color:var(--accent)"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff0c4"/>
        <stop offset="1" stop-color="#d9a441"/>
      </linearGradient>
      <clipPath id="paperClip">
        <path d="M46 85 Q140 113 234 85 L234 125 C234 200 166 245 140 292 C114 245 46 200 46 125 Z"/>
      </clipPath>
      <clipPath id="stemClip">
        <path d="M0 -20 L280 -20 L280 85 L234 85 L234 125 C234 200 166 245 140 292 C114 245 46 200 46 125 L46 85 L0 85 Z"/>
      </clipPath>
    </defs>

    <!-- stems -->
    <g clip-path="url(#stemClip)" fill="none" stroke-linecap="round">
      ${stemsSVG}
    </g>

    <!-- wrapping paper -->
    <g opacity=".6">
      <ellipse cx="140" cy="85" rx="94" ry="16" fill="var(--accent)" opacity=".7"/>
      <path d="M46 85 Q140 113 234 85 L234 125 C234 200 166 245 140 292 C114 245 46 200 46 125 Z"
            fill="url(#paperGrad)"/>
      <path d="M62 100 L62 130 C66 190 112 245 140 292 C124 245 116 190 116 130 L116 104 Z" fill="#fff" opacity=".18"/>
      <g fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.5">
        <path d="M70 106 L70 125 C70 200 120 245 140 292"/>
        <path d="M210 106 L210 125 C210 200 160 245 140 292"/>
        <path d="M93 100 L93 125 C93 200 127 245 140 292"/>
        <path d="M187 100 L187 125 C187 200 153 245 140 292"/>
        <path d="M140 108 L140 292"/>
      </g>
    </g>

    <!-- the flowers -->
    ${flowersSVG}

    <!-- gold ribbon -->
    <path clip-path="url(#paperClip)"
          d="M10 196 Q140 218 270 196 L270 212 Q140 234 10 212 Z" fill="url(#goldGrad)"/>

    <!-- bow -->
    <g transform="translate(20 2)">
      <path d="M116 214 Q104 242 88 258 L101 260 Q113 246 122 216Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1"/>
      <path d="M124 214 Q136 242 152 258 L139 260 Q127 246 118 216Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1"/>
      <path d="M120 207 C90 176 74 212 99 222 C108 226 116 217 120 207Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1.5"/>
      <path d="M120 207 C150 176 166 212 141 222 C132 226 124 217 120 207Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1.5"/>
      <circle cx="120" cy="208" r="7" fill="#d9a441" stroke="#b9852a" stroke-width="1.5"/>
    </g>
  </svg>`;
}