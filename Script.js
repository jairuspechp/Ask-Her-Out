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

/* Background music: starts the moment she says Yes. */
const music = new Audio("Audio/song.mp3");   // change to your mp3 path
music.loop = true;
music.volume = 0.7;
music.preload = "auto";

function playMusic() {
  music.currentTime = 0;
  music.play().catch(() => {
    /* Browser blocked autoplay (can happen on the auto-Yes timer).
       Retry on the very next tap or click. */
    const retry = () => {
      music.play();
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
    };
    window.addEventListener("pointerdown", retry);
    window.addEventListener("keydown", retry);
  });
}

/* One photo per color theme. Swap any link for your own file. */
const PHOTOS = {
  rose:     "Img/Rafflesia-255_1500x.jpg",   //Flower, 
  sunset:   "Img/Sunflower.jpg",             //Flower, Had BG
  sakura:   "Img/cherry_blossom_Bouquet.jpg",     //Flower, Had BG
  lavender: "Img/lavendersBoquet.jpg",              //Flower, Had BG
  ocean:    "Img/seagrassStyle.jpg",   // grass , Had BG
  mint:     "Img/PeppermintStyle.jpg",   // grass, Had BG
  midnight: "Img/MidnightPrimroseBouquet.jpg",   //  Flower, Had BG
  noir:     "Img/MakahiyaBouquet.webp"    // Flower, Had BG
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
  let id = themes[themeIndex];
  document.documentElement.dataset.theme = id;
  document.body.classList.add("show-bg");

  const bouquet = document.createElement("div");
  bouquet.className = "bouquet";

  const sway = document.createElement("div");
  sway.className = "sway";
  sway.innerHTML = buildBouquetSVG();

  bouquet.appendChild(sway);
  card.appendChild(bouquet);

  const TITLE_TEXT  = "A flower for you 💕";
  const RESULT_TEXT = "Happy to be with you 💕";
  const playWave = () => {
    waveText(title, TITLE_TEXT);
    waveText(result, RESULT_TEXT);
  };
  playWave();

  /* flowers fall from the cursor as it moves */
  enableCursorFlowers();

  const nextBtn = document.createElement("button");
  nextBtn.className = "flower-btn";
  nextBtn.textContent = "Next flower 🌸";
  card.appendChild(nextBtn);

  nextBtn.addEventListener("click", () => {
    themeIndex = (themeIndex + 1) % themes.length;
    document.body.classList.add("bg-reset");
    document.body.classList.remove("show-bg");
    document.documentElement.dataset.theme = themes[themeIndex];
    void document.body.offsetWidth;
    document.body.classList.remove("bg-reset");
    document.body.classList.add("show-bg");

    bouquet.style.animation = "none";
    void bouquet.offsetWidth;
    bouquet.style.animation = "";
    playWave();
  });

  /* flowers from the bouquet itself drop with each shake */
  function dropPetals(count) {
    const r = bouquet.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        spawnFlowerPetal(
          r.left + r.width * (0.15 + Math.random() * 0.7),
          r.top  + r.height * (0.05 + Math.random() * 0.35)
        );
      }, i * 90);
    }
  }

  function shake() {
    sway.classList.add("shaking");
    setTimeout(() => sway.classList.remove("shaking"), 900);
    dropPetals(3 + Math.floor(Math.random() * 3));
  }

  setTimeout(shake, 1500);
  setInterval(shake, 5000);

  sway.addEventListener("click", () => {
    sway.classList.remove("shaking");
    void sway.offsetWidth;
    sway.classList.add("shaking");
    setTimeout(() => sway.classList.remove("shaking"), 900);
    dropPetals(5 + Math.floor(Math.random() * 4));
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
  playMusic(); 
  setTimeout(showPhoto, 5500);          // image pops up after the animals
}

/* Unlock audio on the first touch/click anywhere, so the timer-Yes can play sound. */
function unlockAudio() {
  music.muted = true;
  music.play().then(() => {
    music.pause();
    music.currentTime = 0;
    music.muted = false;
  }).catch(() => {});
  window.removeEventListener("pointerdown", unlockAudio);
}
window.addEventListener("pointerdown", unlockAudio);


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