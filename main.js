/* main.js — sabin.pages.dev */

// ── NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 50), { passive: true });

// ── SCROLL PROGRESS ──
const prog = document.getElementById('scroll-prog');
window.addEventListener('scroll', () => {
  prog.style.transform = `scaleY(${scrollY / (document.body.scrollHeight - innerHeight)})`;
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

document.querySelectorAll('a, .card, .pill, button, .spotify-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.classList.add('big'); ring.classList.remove('small'); });
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    e.target.style.transitionDelay = (i * 0.06) + 's';
    e.target.classList.add('on');
    ro.unobserve(e.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.rev').forEach(el => ro.observe(el));

// ── THREE.JS WIREFRAME HERO ──
(function initThree() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, canvas.offsetWidth / canvas.offsetHeight, 0.1, 200);
  camera.position.z = 28;

  function resize() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // color synced to theme
  function getEdgeColor() {
    return document.body.classList.contains('light')
      ? new THREE.Color(0x2a2420)
      : new THREE.Color(0xe8dfc8);
  }

  // build sparse field of wireframe icosahedra
  const meshes = [];
  const count  = 11;

  function makeMesh() {
    const geo  = new THREE.IcosahedronGeometry(Math.random() * 1.4 + 0.5, 0);
    const mat  = new THREE.MeshBasicMaterial({ color: getEdgeColor(), wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);

    // random position spread across hero
    mesh.position.set(
      (Math.random() - 0.5) * 52,
      (Math.random() - 0.5) * 28,
      (Math.random() - 0.5) * 14
    );

    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.004,
      ry: (Math.random() - 0.5) * 0.003,
      rz: (Math.random() - 0.5) * 0.002,
      ox: mesh.position.x,
      oy: mesh.position.y,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.0004 + Math.random() * 0.0003,
    };

    scene.add(mesh);
    meshes.push(mesh);
    return mesh;
  }

  for (let i = 0; i < count; i++) makeMesh();

  // mouse influence
  let tmx = 0, tmy = 0;
  document.addEventListener('mousemove', e => {
    tmx = (e.clientX / innerWidth  - 0.5) * 2;
    tmy = (e.clientY / innerHeight - 0.5) * 2;
  });

  let smx = 0, smy = 0;

  // opacity controlled by CSS variable opacity on canvas
  // dark: edges visible at low opacity; light: same
  function getOpacity() {
    return document.body.classList.contains('light') ? 0.07 : 0.09;
  }

  canvas.style.opacity = getOpacity();

  let frame = 0;
  (function tick() {
    frame++;
    requestAnimationFrame(tick);

    // smooth mouse
    smx += (tmx - smx) * 0.02;
    smy += (tmy - smy) * 0.02;

    const t = frame * 0.001;

    meshes.forEach(m => {
      const d = m.userData;
      m.rotation.x += d.rx;
      m.rotation.y += d.ry;
      m.rotation.z += d.rz;

      // gentle float
      m.position.x = d.ox + Math.sin(t * d.driftSpeed * 1000 + d.drift)         * 0.8;
      m.position.y = d.oy + Math.cos(t * d.driftSpeed * 1000 + d.drift + 1.2)   * 0.5;

      // mouse parallax — closer shapes move more
      const depth = (m.position.z + 14) / 28;
      m.position.x += smx * depth * 1.2;
      m.position.y -= smy * depth * 0.8;

      // update color if theme changed
      m.material.color.copy(getEdgeColor());
    });

    canvas.style.opacity = getOpacity();
    renderer.render(scene, camera);
  })();
})();

// ── TERMINAL TYPEWRITER ──
const lines = [
  { type: 'cmd',  text: 'whoami' },
  { type: 'out',  text: '<span class="out-hl">sabin karki</span> — full-stack developer, Nepal' },
  { type: 'spacer' },
  { type: 'cmd',  text: 'cat about.txt' },
  { type: 'out',  text: "I've been building things on the web for a while now." },
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

async function typeTerminal() {
  for (const line of lines) {
    await typeLine(line);
    await pause(110);
  }
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
      return resolve();
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
      const plain = line.text.replace(/<[^>]+>/g, '');
      let i = 0;
      const tick = setInterval(() => {
        content.textContent = plain.slice(0, ++i);
        if (i >= plain.length) { clearInterval(tick); resolve(); }
      }, 26);
    } else {
      content.innerHTML = line.text;
      resolve();
    }
  });
}

function pause(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(typeTerminal, 700);

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

// ── THEME TOGGLE ──
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
    left: cx+'px', top: cy+'px',
    width: diag+'px', height: diag+'px',
    background: next,
    transform: 'translate(-50%,-50%) scale(0)',
    transition: 'none', opacity: '1'
  });
  wipe.offsetHeight;
  wipe.style.transition = 'transform 0.62s cubic-bezier(0.25,0,0,1)';
  wipe.style.transform  = 'translate(-50%,-50%) scale(1)';
  setTimeout(() => {
    light = !light;
    document.body.classList.toggle('light', light);
    wipe.style.transition = 'opacity 0.3s ease';
    wipe.style.opacity = '0';
    setTimeout(() => {
      wipe.style.cssText = '';
      themeBtn.classList.remove('spin');
      wiping = false;
    }, 320);
  }, 380);
});

// ── LIVE TIMESTAMP ──
const tsEl = document.getElementById('foot-ts');
function updateTS() {
  tsEl.textContent = new Date().toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });
}
updateTS();
setInterval(updateTS, 60000);