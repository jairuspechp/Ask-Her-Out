const card     = document.getElementById("card");
const title    = document.getElementById("title");
const question = document.getElementById("question");
const buttons  = document.getElementById("buttons");
const result   = document.getElementById("result");
const yesBtn   = document.getElementById("yesBtn");
const noBtn    = document.getElementById("noBtn");

/* What shows up in place of the question each time No is clicked. */
const excuses = [
  "Bawal ang No, dapat Yes lang 😤",
  "Bakit ka nag No-No? 🤨",
  "Kekekekekek bawal ngani 😂",
  "Ay mapilit 🙄",
  "Nice try 😏",
  "That button is broken 🔧",
  "The 'No' button has left the chat 🚪",
  "You can't catch me!",
  "Access denied ❌",
  "This is a trap, click Yes instead 💘"
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
  if (now - lastDodge < 200) return;   // hover + click together count once
  lastDodge = now;
  dodgeCount++;

  /* First time: lift No out of the row, starting exactly where it sits. */
  if (!noBtn.classList.contains("moved")) {
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = r.left + "px";
    noBtn.style.top  = r.top + "px";
    noBtn.classList.add("moved");
    noBtn.getBoundingClientRect();     // force reflow so the move animates
  }

  /* Yes grows a little each time (capped so it stays on the card). */
  const size = parseFloat(getComputedStyle(yesBtn).fontSize);
  yesBtn.style.fontSize = Math.min(size + 2, 34) + "px";
  yesBtn.style.padding  = Math.min(14 + dodgeCount, 26) + "px " + Math.min(28 + dodgeCount * 2, 52) + "px";

  const spot = pickSpot();
  noBtn.style.left = spot.x + "px";
  noBtn.style.top  = spot.y + "px";

  question.textContent = nextExcuse();
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

function sayYes() {
  buttons.style.display = "none";
  noBtn.style.display = "none";
  question.style.display = "none";
  title.textContent = "YAY! 🎉";
  result.style.display = "block";
  result.textContent = "She said YES! I knew it 💕 I'll pick the time and place, get ready!";
  launchHearts();
}

function launchHearts() {
  const box = document.createElement("div");
  box.className = "hearts";
  document.body.appendChild(box);

  const emojis = ["❤️", "💖", "💕", "😍", "💘"];
  for (let i = 0; i < 40; i++) {
    const span = document.createElement("span");
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + "%";
    span.style.animationDelay = Math.random() * 2 + "s";
    span.style.fontSize = (1 + Math.random() * 1.5) + "rem";
    box.appendChild(span);
  }
}

yesBtn.addEventListener("click", sayYes);