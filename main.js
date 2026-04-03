/* main.js — sabin.pages.dev */

// ── NAV STUCK ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 50), { passive: true });

// ── SCROLL PROGRESS ──
const prog = document.getElementById('scroll-prog');
window.addEventListener('scroll', () => {
  const pct = scrollY / (document.body.scrollHeight - innerHeight);
  prog.style.transform = `scaleY(${pct})`;
}, { passive: true });

// ── CURSOR ──
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function lerpRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(lerpRing);
})();

document.querySelectorAll('a, .card, .pill, button').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.classList.add('big'); ring.classList.remove('small'); });
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    e.target.style.transitionDelay = (i * 0.06) + 's';
    e.target.classList.add('on');
    ro.unobserve(e.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.rev').forEach(el => ro.observe(el));

// ── TERMINAL TYPEWRITER ──
const lines = [
  { type: 'cmd',  text: 'whoami' },
  { type: 'out',  text: '<span class="out-hl">sabin karki</span> — full-stack developer, Nepal' },
  { type: 'spacer' },
  { type: 'cmd',  text: 'cat about.txt' },
  { type: 'out',  text: 'I\'ve been building things on the web for a while now.' },
  { type: 'out',  text: 'Spring Boot on the backend, React on the front.' },
  { type: 'out',  text: 'I care about <span class="out-acc">how</span> software is built, not just that it works.' },
  { type: 'spacer' },
  { type: 'cmd',  text: 'ls projects/' },
  { type: 'out',  text: '<span class="out-g">MindSpace/</span>  <span class="out-g">FinanceTracker/</span>  <span class="out-g">MediFlow/</span>' },
  { type: 'spacer' },
  { type: 'cmd',  text: 'echo $STATUS' },
  { type: 'out',  text: 'open to opportunities — graduating 2026' },
];

const termBody = document.getElementById('term-body');
const CHAR_DELAY = 28;
const LINE_PAUSE = 120;

async function typeTerminal() {
  for (const line of lines) {
    await typeLine(line);
    await pause(LINE_PAUSE);
  }
  // blinking cursor at end
  const cur = document.createElement('span');
  cur.className = 'term-cursor';
  termBody.appendChild(cur);
}

function typeLine(line) {
  return new Promise(resolve => {
    if (line.type === 'spacer') {
      const sp = document.createElement('div');
      sp.className = 'term-spacer';
      termBody.appendChild(sp);
      resolve();
      return;
    }

    const row = document.createElement('div');
    row.className = 'term-line';

    if (line.type === 'cmd') {
      const p = document.createElement('span');
      p.className = 'prompt';
      p.textContent = '~/sabin $';
      row.appendChild(p);
    }

    const content = document.createElement('span');
    content.className = line.type === 'cmd' ? 'cmd' : 'out';
    row.appendChild(content);
    termBody.appendChild(row);

    if (line.type === 'cmd') {
      typeText(content, line.text, false, resolve);
    } else {
      // output lines appear instantly (like real terminal)
      content.innerHTML = line.text;
      resolve();
    }
  });
}

function typeText(el, text, html, done) {
  // strip any html for character-level typing
  const plain = text.replace(/<[^>]+>/g, '');
  let i = 0;
  const tick = setInterval(() => {
    el.textContent = plain.slice(0, ++i);
    if (i >= plain.length) { clearInterval(tick); done(); }
  }, CHAR_DELAY);
}

function pause(ms) { return new Promise(r => setTimeout(r, ms)); }

// start after a beat
setTimeout(typeTerminal, 600);

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.mag').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width  / 2)) * 0.25;
    const y = (e.clientY - (r.top  + r.height / 2)) * 0.25;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ── THEME TOGGLE — radial wipe ──
const themeBtn = document.getElementById('theme-btn');
const wipe     = document.getElementById('wipe');
let light = false, wiping = false;

themeBtn.addEventListener('click', () => {
  if (wiping) return;
  wiping = true;

  const r    = themeBtn.getBoundingClientRect();
  const cx   = r.left + r.width  / 2;
  const cy   = r.top  + r.height / 2;
  const diag = Math.hypot(innerWidth, innerHeight) * 2.2;
  const next = light ? '#0f0e0c' : '#f5efe3';

  themeBtn.classList.add('spin');

  Object.assign(wipe.style, {
    left: cx + 'px', top: cy + 'px',
    width: diag + 'px', height: diag + 'px',
    background: next,
    transform: 'translate(-50%,-50%) scale(0)',
    transition: 'none',
    opacity: '1'
  });

  wipe.offsetHeight;

  wipe.style.transition = 'transform 0.62s cubic-bezier(0.25,0,0,1)';
  wipe.style.transform  = 'translate(-50%,-50%) scale(1)';

  setTimeout(() => {
    light = !light;
    document.body.classList.toggle('light', light);
    themeBtn.textContent = light ? '◑' : '◑';

    wipe.style.transition = 'opacity 0.3s ease';
    wipe.style.opacity = '0';

    setTimeout(() => {
      wipe.style.cssText = '';
      themeBtn.classList.remove('spin');
      wiping = false;
    }, 320);
  }, 380);
});

// ── LIVE TIMESTAMP in footer ──
const tsEl = document.getElementById('foot-ts');
function updateTS() {
  const now = new Date();
  tsEl.textContent = now.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });
}
updateTS();
setInterval(updateTS, 60000);