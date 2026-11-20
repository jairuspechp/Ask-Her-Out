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

/* Image shown after YES. Swap the link for your own photo anytime. */
const PHOTO_URL = "https://images.news9live.com/wp-content/uploads/2024/08/Rafflesia-Arnoldii-1024x768.jpg?w=1280";
const photoImg = new Image();
photoImg.alt = "A flower for you";
photoImg.src = PHOTO_URL;

function showPhoto() {
  if (!photoImg.complete || !photoImg.naturalWidth) return;   // failed to load: show nothing

  const bouquet = document.createElement("div");
  bouquet.className = "bouquet";

  const sway = document.createElement("div");
  sway.className = "sway";

  const bloom = document.createElement("div");
  bloom.className = "bloom";
  bloom.appendChild(photoImg);

    sway.innerHTML =
    '<span class="leaf l"></span><span class="leaf r"></span>' +
    '<span class="leaf l2"></span><span class="leaf r2"></span>' +
    '<div class="tail"></div><div class="wrap-back"></div>';
  sway.appendChild(bloom);
  sway.insertAdjacentHTML("beforeend",
    '<div class="wrap"></div><div class="rim"></div><div class="bow"><i></i></div>');

  bouquet.appendChild(sway);
  card.appendChild(bouquet);

  title.textContent = "A flower for you 💕";
  result.textContent = "Happy to be with you 💕";

  /* Shake from time to time; each shake knocks a few flowers loose. */
  function shake() {
    sway.classList.add("shaking");
    setTimeout(() => sway.classList.remove("shaking"), 900);

    const count = 3 + Math.floor(Math.random() * 3);          // 3 to 5 pieces
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      const size = 30 + Math.random() * 22;
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

  setTimeout(shake, 1500);
  setInterval(shake, 5000);                                    // shake every 5 seconds
}
/* Color themes: pick one at random on load, tap a dot to switch. */
/* Color themes: start on rose, then switch to the next one on every No. */
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
  setTimeout(showPhoto, 5500);          // NEW: image pops up after the animals
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

/* 1 minute countdown. At 0:00 the answer is Yes. */
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