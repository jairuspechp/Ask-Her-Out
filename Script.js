const card     = document.getElementById("card");
const title    = document.getElementById("title");
const timerEl = document.getElementById("timer");
const question = document.getElementById("question");
const buttons  = document.getElementById("buttons");
const result   = document.getElementById("result");
const yesBtn   = document.getElementById("yesBtn");
const noBtn    = document.getElementById("noBtn");
const ringEl   = document.getElementById("ring");
const handEl   = document.getElementById("hand");
const digitsEl = document.getElementById("digits");


/* Draw the 12 tick marks around the clock face. */
const ticksEl = document.getElementById("ticks");
for (let i = 0; i < 12; i++) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "line");
  t.setAttribute("x1", 50);
  t.setAttribute("x2", 50);
  t.setAttribute("y1", i % 3 === 0 ? 6 : 7.5);   // longer marks at 12, 3, 6 and 9
  t.setAttribute("y2", 9.5);
  t.setAttribute("transform", "rotate(" + i * 30 + " 50 50)");
  ticksEl.appendChild(t);
}

/* One photo per color theme. Swap any link for your own file. */
const PHOTOS = {
  rose:     "Img/Rafflesia-255_1500x.jpg",
  sunset:   "Img/Sunflower.jpg",     // orange: marigold or orange tulip
  sakura:   "Img/Rose plant.jpg",     // pink: cherry blossom
  lavender: "Img/Rafflesia 2.webp",   // purple: lavender or orchid
  ocean:    "Img/Rafflesia 2.webp",   // blue: hydrangea or forget-me-not
  mint:     "Img/Rafflesia 2.webp",   // green/white: white rose or green hydrangea
  midnight: "Img/Rafflesia 2.webp",   // gold: sunflower
  noir:     "Img/Rafflesia 2.webp"    // dark red or black rose
};

/* Preload them all so the popup is instant. */
const photoCache = {};
Object.keys(PHOTOS).forEach(id => {
  const im = new Image();
  im.alt = "A flower for you";
  im.src = PHOTOS[id];
  photoCache[id] = im;
});

/* Wave effect: splits text into letters that bounce one after another. */
function waveText(el, text) {
  el.setAttribute("aria-label", text);
  el.textContent = "";
  let n = 0;
  text.split(" ").forEach((word, w, words) => {
    const wordEl = document.createElement("span");
    wordEl.className = "wave-word";              // keeps each word together on one line
    [...word].forEach(ch => {
      const s = document.createElement("span");
      s.className = "wave-char";
      s.textContent = ch;
      s.setAttribute("aria-hidden", "true");
      s.style.animationDelay = (n++ * 0.05) + "s";
      wordEl.appendChild(s);
    });
    el.appendChild(wordEl);
    if (w < words.length - 1) { el.appendChild(document.createTextNode(" ")); n++; }
  });
}

function showPhoto() {
  let id = themes[themeIndex];                       // the color she ended on
  const ready = im => im && im.complete && im.naturalWidth;
  if (!ready(photoCache[id])) id = "rose";           // fall back to the original photo
  const photoImg = photoCache[id];
  let PHOTO_URL = PHOTOS[id];                        // falling petals use this too
  if (!ready(photoImg)) return;                      // nothing loaded: show nothing

  document.documentElement.dataset.theme = id;       // background matches the first flower
  themeIndex = themes.indexOf(id);

  const bouquet = document.createElement("div");
  bouquet.className = "bouquet";

  const sway = document.createElement("div");
  sway.className = "sway";

  const bloom = document.createElement("div");
  bloom.className = "bloom";
  bloom.appendChild(photoImg);

  sway.innerHTML = buildBouquetSVG();   // the SVG goes in first (behind)
  sway.appendChild(bloom);              // the photo goes on top

  bouquet.appendChild(sway);
  card.appendChild(bouquet);

  const TITLE_TEXT  = "A flower for you 💕";
  const RESULT_TEXT = "Happy to be with you 💕";
  const playWave = () => {
    waveText(title, TITLE_TEXT);
    waveText(result, RESULT_TEXT);
  };
  playWave();

  /* Button: show the next flower each click */
  const nextBtn = document.createElement("button");
  nextBtn.className = "flower-btn";
  nextBtn.textContent = "Next flower 🌸";
  card.appendChild(nextBtn);

  let currentId = id;
  nextBtn.addEventListener("click", () => {
    const readyIds = themes.filter(t => ready(photoCache[t]));
    if (readyIds.length < 2) return;
    currentId = readyIds[(readyIds.indexOf(currentId) + 1) % readyIds.length];

    bloom.replaceChildren(photoCache[currentId]);
    PHOTO_URL = PHOTOS[currentId];
    document.documentElement.dataset.theme = currentId;
    themeIndex = themes.indexOf(currentId);

    bouquet.style.animation = "none";              // bouquet re-pops with the photo
    void bouquet.offsetWidth;
    bouquet.style.animation = "";
    playWave();
  });

  /* Drop some small flowers. Used by the timed shake and by clicking the photo. */
  function dropPetals(count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      const size = 14 + Math.random() * 10;
      p.className = "petal";
      p.style.width = p.style.height = size + "px";
      p.style.left = 15 + Math.random() * 60 + "%";
      p.style.top = 10 + Math.random() * 40 + "%";
      p.style.backgroundImage = "url('" + PHOTO_URL + "')";
      p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      p.style.setProperty("--rot", (Math.random() * 360 - 180) + "deg");
      p.style.animationDelay = Math.random() * 0.4 + "s";
      p.addEventListener("animationend", () => p.remove());
      bouquet.appendChild(p);
    }
  }

  function shake() {
    sway.classList.add("shaking");
    setTimeout(() => sway.classList.remove("shaking"), 900);
    dropPetals(3 + Math.floor(Math.random() * 3));       // 3 to 5 pieces
  }

  setTimeout(shake, 1500);
  setInterval(shake, 5000);

  /* Click the photo: it shakes and drops flowers right away. */
  bloom.addEventListener("click", () => {
    sway.classList.remove("shaking");
    void sway.offsetWidth;                                // restart the shake
    sway.classList.add("shaking");
    setTimeout(() => sway.classList.remove("shaking"), 900);
    dropPetals(5 + Math.floor(Math.random() * 4));        // 5 to 8 pieces
  });
}

/* Color themes: start on rose, then switch to a random one on every No. */
const themes = ["rose", "sunset", "sakura", "lavender", "ocean", "mint", "midnight", "noir"];
let themeIndex = 0;

function nextTheme() {
  themeIndex = (themeIndex + 1) % themes.length;
  document.documentElement.dataset.theme = themes[themeIndex];
}

/* What shows up in place of the question each time No is clicked. */
const excuses = [
  "Bawal ang No, dapat Yes lang 😤",
  "Bakit ka nag No-No? 🤨",
  "Kekekekekek bawal ngani 😂",
  "Ay mapilit 🙄",
  "Nice try 😏",
  "That button will broke me 🔧",
  "The 'No' button has left the chat 🚪",
  "You can't catch me!",
  "Pag ayaw huawg habulin",
  "Access denied ❌",
  "This is a trap, click Yes instead 💘",
  "Yes na para hindi ka na macringe"
];

let dodgeCount = 0;
let lastExcuse = -1;
let lastDodge = 0;

/* Shuffled order that never repeats the same line twice in a row. */
function nextExcuse() {
  let i;
  do { i = Math.floor(Math.random() * excuses.length); } while (i === lastExcuse);
  lastExcuse = i;
  return excuses[i];
}

function overlaps(a, b, pad) {
  return !(a.right + pad < b.left || a.left - pad > b.right ||
           a.bottom + pad < b.top  || a.top - pad > b.bottom);
}

/* Pick a random spot on screen that is not on top of the Yes button. */
function pickSpot() {
  const w = noBtn.offsetWidth, h = noBtn.offsetHeight, m = 12;
  const maxX = Math.max(m, window.innerWidth  - w - m);
  const maxY = Math.max(m, window.innerHeight - h - m);
  const yes  = yesBtn.getBoundingClientRect();
  const cur  = noBtn.getBoundingClientRect();
  let x = m, y = m;

  for (let tries = 0; tries < 40; tries++) {
    x = m + Math.random() * (maxX - m);
    y = m + Math.random() * (maxY - m);
    const box = { left: x, top: y, right: x + w, bottom: y + h };
    const farEnough = Math.hypot(x - cur.left, y - cur.top) > 140;
    if (!overlaps(box, yes, 24) && farEnough) break;
  }
  return { x, y };
}

function dodge() {
  const now = Date.now();
  if (now - lastDodge < 200) return;
  lastDodge = now;
  dodgeCount++;

  /* First time: lift No out of the row, starting exactly where it sits. */
  if (!noBtn.classList.contains("moved")) {
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = r.left + "px";
    noBtn.style.top  = r.top + "px";
    noBtn.classList.add("moved");
    noBtn.getBoundingClientRect();
  }

  /* Yes grows a little each time (capped so it stays on the card). */
  const size = parseFloat(getComputedStyle(yesBtn).fontSize);
  yesBtn.style.fontSize = Math.min(size + 2, 34) + "px";
  yesBtn.style.padding  = Math.min(14 + dodgeCount, 26) + "px " + Math.min(28 + dodgeCount * 2, 52) + "px";

  const spot = pickSpot();
  noBtn.style.left = spot.x + "px";
  noBtn.style.top  = spot.y + "px";

  question.textContent = nextExcuse();

  let i;
  do { i = Math.floor(Math.random() * themes.length); } while (i === themeIndex);
  themeIndex = i;
  document.documentElement.dataset.theme = themes[i];
}

/* Mouse hover, touch and keyboard/click all make No run away. */
noBtn.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") dodge(); });
noBtn.addEventListener("pointerdown", e => { e.preventDefault(); dodge(); });
noBtn.addEventListener("click", dodge);

/* Keep No on screen if the window is resized. */
window.addEventListener("resize", () => {
  if (!noBtn.classList.contains("moved")) return;
  const maxX = Math.max(12, window.innerWidth  - noBtn.offsetWidth  - 12);
  const maxY = Math.max(12, window.innerHeight - noBtn.offsetHeight - 12);
  noBtn.style.left = Math.min(parseFloat(noBtn.style.left), maxX) + "px";
  noBtn.style.top  = Math.min(parseFloat(noBtn.style.top),  maxY) + "px";
});

let answered = false;

function sayYes(auto) {
  if (answered) return;            // only answer once
  answered = true;
  clearInterval(timerId);
  timerEl.style.display = "none";

  buttons.style.display = "none";
  noBtn.style.display = "none";
  question.style.display = "none";
  title.textContent = auto ? "Time's up! ⏰" : "YAY! 🎉";
  result.style.display = "block";
  result.textContent = auto
    ? "No answer means YES! I knew it 💕 I'll pick the time and place, get ready! first of..."
    : "You said YES! I knew it 💕 I'll pick the time and place, get ready! first of...";
  launchHearts();
  setTimeout(showPhoto, 5500);          // image pops up after the animals
}


function launchHearts() {
  const box = document.createElement("div");
  box.className = "hearts";
  document.body.appendChild(box);

  const emojis = ["🐶", "🐱", "🐰", "🐻", "🐼", "🦊", "🐸", "🐵", "🦁", "🐯", "🐨", "🐷", "🐧", "🦄", "🐥", "🦋", "🐢", "🐙", "🦒", "🐘"];
  for (let i = 0; i < 40; i++) {
    const span = document.createElement("span");
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + "%";
    span.style.animationDelay = Math.random() * 2 + "s";
    span.style.fontSize = (1 + Math.random() * 1.5) + "rem";
    box.appendChild(span);
  }
}

/* Countdown. At 0:00 the answer is Yes. */
const TIME_LIMIT = 30;                          // seconds
const endAt = Date.now() + TIME_LIMIT * 1000;
let timerId = null;

function renderTimer() {
  const leftMs = Math.max(0, endAt - Date.now());
  const left = Math.ceil(leftMs / 1000);
  const f = leftMs / (TIME_LIMIT * 1000);          // 1 = full time, 0 = none left

  digitsEl.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
  ringEl.style.strokeDashoffset = 100 * (1 - f);   // ring shrinks as time passes
  handEl.style.transform = "rotate(" + 360 * (1 - f) + "deg)";   // hand sweeps once around
  timerEl.classList.toggle("low", left <= 10);

  if (left === 0) sayYes(true);
}

timerId = setInterval(renderTimer, 100);
renderTimer();

yesBtn.addEventListener("click", () => sayYes(false));