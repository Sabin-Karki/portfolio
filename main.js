/* main.js — sabin.pages.dev */

const blogPosts = [
  {
    slug: 'all-about-thread',
    title: 'All About Thread',
    file: '/contents/All About Thread.md',
    topic: 'Java concurrency',
    dateLabel: 'Learning notes',
  },
];

const projects = [
  {
    id: 'mindspace',
    num: '01',
    title: 'MindSpace',
    stack: 'Spring Boot · React · TypeScript · Docker',
    desc: "Students upload their documents and have actual conversations with them. I used pgvector for semantic search so it finds genuinely relevant context, not just keyword matches. Gemini generates the flashcards. JWT keeps everyone's stuff isolated.",
    tags: ['RAG','pgvector','Gemini API','Apache Tika'],
    repo: 'https://github.com/Sabin-Karki/MindSpace',
    live: 'https://mindspace-ten-tau.vercel.app/'
  },
  {
    id: 'finance-tracker',
    num: '02',
    title: 'Finance Tracker',
    stack: 'Spring Boot · React · Tailwind · Docker',
    desc: 'Track money in, money out, and where it all went. The schema is properly normalized with foreign keys between users, transactions, and budgets. Nothing lands in the database without validation. Each user only ever sees their own data.',
    tags: ['REST API','Spring Security','CRUD'],
    repo: 'https://github.com/Sabin-Karki/Finance-Tracker'
  },
  {
    id: 'mediflow',
    num: '03',
    title: 'MediFlow',
    stack: 'Spring Boot · Spring Data JPA · PostgreSQL',
    desc: 'Hospital CSV formats are a mess — different headers, inconsistent fields, all of it. MediFlow handles that async, without blocking anything. Strategy pattern lets you add new record types without touching existing code. Tested properly with JUnit.',
    tags: ['Async','Strategy Pattern','JUnit','Mockito'],
    repo: 'https://github.com/Sabin-Karki/MediFlow'
  },
  // Additional projects only shown on /projects
  {
    id: 'grit4j',
    num: '04',
    title: 'Grit4J',
    stack: 'Java',
    desc: 'Token bucket algorithm implemented from scratch.',
    tags: ['Java','Algorithm'],
    repo: 'https://github.com/Sabin-Karki/Grit4J'
  },
  {
    id: 'springspecter',
    num: '05',
    title: 'SpringSpecter',
    stack: 'Spring Boot',
    desc: 'CLI tool to scan Spring Boot projects for common security misconfigurations and dependency vulnerabilities.',
    tags: ['Security','CLI','Spring Boot'],
    repo: 'https://github.com/Sabin-Karki/SpringSpecter'
  },
  {
    id: 'electromart',
    num: '06',
    title: 'ElectroMart',
    stack: 'TypeScript · Express',
    desc: 'Full-Stack Application built using TypeScript and Express.',
    tags: ['TypeScript','Express','Full-Stack'],
    repo: 'https://github.com/Sabin-Karki/ElectroMart'
  }
];

function createProjectCard(p) {
  const card = document.createElement('div');
  card.className = 'card rev';
  const tags = (p.tags || []).map(t => `<span class="ctag">${t}</span>`).join('');
  card.innerHTML = `
    <div class="card-num">${p.num}</div>
    <div class="card-title">${p.title}</div>
    <div class="card-stack">${p.stack}</div>
    <p class="card-desc">${p.desc}</p>
    <div class="card-tags">${tags}</div>
    ${p.repo ? `<a href="${p.repo}" target="_blank" class="card-link">View on GitHub <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 10L10 1M10 1H3.5M10 1V7.5" stroke="currentColor" stroke-width="1.2"/></svg></a>` : ''}
    ${p.live ? `<a href="${p.live}" target="_blank" class="card-link">View Live <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 10L10 1M10 1H3.5M10 1V7.5" stroke="currentColor" stroke-width="1.2"/></svg></a>` : ''}
  `;
  return card;
}

function renderProjectLists() {
  // preview on home: show first 3 (pinned)
  if (projectPreviewBoard) projectPreviewBoard.innerHTML = '';
  if (projectsRouteBoard) projectsRouteBoard.innerHTML = '';

  projects.slice(0, 3).forEach(p => {
    const c = createProjectCard(p);
    if (projectPreviewBoard) projectPreviewBoard.appendChild(c);
    // ensure the preview cards get the reveal animation
    ro.observe(c);
  });

  projects.forEach(p => {
    const c = createProjectCard(p);
    c.classList.remove('on');
    if (projectsRouteBoard) projectsRouteBoard.appendChild(c);
    ro.observe(c);
  });

  bindCursorTargets();
}

const nav = document.getElementById('nav');
const prog = document.getElementById('scroll-prog');
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
const termBody = document.getElementById('term-body');
const tsEl = document.getElementById('foot-ts');
const homeView = document.getElementById('home-view');
const routeViews = document.querySelectorAll('.route-page');
const projectPreviewBoard = document.getElementById('project-preview-board');
const projectsRouteBoard = document.getElementById('projects-route-board');
const blogPreviewList = document.getElementById('blog-preview-list');
const blogRouteList = document.getElementById('blog-route-list');
const postTitle = document.getElementById('post-title');
const postMeta = document.getElementById('post-meta');
const postContent = document.getElementById('post-content');

const markdownCache = new Map();
let mx = -100;
let my = -100;
let rx = -100;
let ry = -100;

window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', scrollY > 50);
  const scrollable = Math.max(document.body.scrollHeight - innerHeight, 1);
  prog.style.transform = `scaleY(${scrollY / scrollable})`;
}, { passive: true });

document.addEventListener('mousemove', event => {
  mx = event.clientX;
  my = event.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

(function lerpRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(lerpRing);
})();

function bindCursorTargets() {
  document.querySelectorAll('a, .card, .pill, button, .blog-item').forEach(el => {
    if (el.dataset.cursorBound === 'true') return;
    el.dataset.cursorBound = 'true';
    el.addEventListener('mouseenter', () => {
      ring.classList.add('big');
      ring.classList.remove('small');
    });
    el.addEventListener('mouseleave', () => ring.classList.remove('big'));
  });
}

const ro = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (!entry.isIntersecting) return;
    entry.target.style.transitionDelay = `${index * 0.06}s`;
    entry.target.classList.add('on');
    ro.unobserve(entry.target);
  });
}, { threshold: 0.08 });

function observeReveals(scope = document) {
  scope.querySelectorAll('.rev').forEach(el => ro.observe(el));
}

(function initThree() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, canvas.offsetWidth / canvas.offsetHeight, 0.1, 200);
  camera.position.z = 28;

  function resize() {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function getEdgeColor() {
    return document.body.classList.contains('light')
      ? new THREE.Color(0x2a2420)
      : new THREE.Color(0xe8dfc8);
  }

  const meshes = [];
  const count = 11;

  function makeMesh() {
    const geo = new THREE.IcosahedronGeometry(Math.random() * 1.4 + 0.5, 0);
    const mat = new THREE.MeshBasicMaterial({ color: getEdgeColor(), wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);

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
  }

  for (let index = 0; index < count; index++) makeMesh();

  let tmx = 0;
  let tmy = 0;
  let smx = 0;
  let smy = 0;

  document.addEventListener('mousemove', event => {
    tmx = (event.clientX / innerWidth - 0.5) * 2;
    tmy = (event.clientY / innerHeight - 0.5) * 2;
  });

  function getOpacity() {
    return document.body.classList.contains('light') ? 0.07 : 0.09;
  }

  canvas.style.opacity = getOpacity();

  let frame = 0;
  (function tick() {
    frame++;
    requestAnimationFrame(tick);

    smx += (tmx - smx) * 0.02;
    smy += (tmy - smy) * 0.02;

    const time = frame * 0.001;

    meshes.forEach(mesh => {
      const data = mesh.userData;
      mesh.rotation.x += data.rx;
      mesh.rotation.y += data.ry;
      mesh.rotation.z += data.rz;

      mesh.position.x = data.ox + Math.sin(time * data.driftSpeed * 1000 + data.drift) * 0.8;
      mesh.position.y = data.oy + Math.cos(time * data.driftSpeed * 1000 + data.drift + 1.2) * 0.5;

      const depth = (mesh.position.z + 14) / 28;
      mesh.position.x += smx * depth * 1.2;
      mesh.position.y -= smy * depth * 0.8;
      mesh.material.color.copy(getEdgeColor());
    });

    canvas.style.opacity = getOpacity();
    renderer.render(scene, camera);
  })();
})();

const terminalLines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: '<span class="out-hl">sabin karki</span> — backend developer, Nepal' },
  { type: 'spacer' },
  { type: 'cmd', text: 'cat about.txt' },
  { type: 'out', text: 'I build backend-focused web applications.' },
  { type: 'out', text: 'Spring Boot for APIs and business logic, React for the UI.' },
  { type: 'out', text: 'I care about clean structure, reliable behavior, and software that makes sense to maintain.' },
  { type: 'spacer' },
  { type: 'cmd', text: 'ls blogs/' },
  { type: 'out', text: '<span class="out-g">all-about-thread.md</span>' },
  { type: 'spacer' },
  { type: 'cmd', text: 'echo $STATUS' },
  { type: 'out', text: 'open to opportunities · graduating 2026' },
];

async function typeTerminal() {
  if (!termBody || termBody.dataset.typed === 'true') return;
  termBody.dataset.typed = 'true';

  for (const line of terminalLines) {
    await typeLine(line);
    await pause(110);
  }

  const cursor = document.createElement('span');
  cursor.className = 'term-cursor';
  termBody.appendChild(cursor);
}

function typeLine(line) {
  return new Promise(resolve => {
    if (line.type === 'spacer') {
      const spacer = document.createElement('div');
      spacer.className = 'term-spacer';
      termBody.appendChild(spacer);
      resolve();
      return;
    }

    const row = document.createElement('div');
    row.className = 'term-line';

    if (line.type === 'cmd') {
      const prompt = document.createElement('span');
      prompt.className = 'prompt';
      prompt.textContent = '~/sabin $';
      row.appendChild(prompt);
    }

    const content = document.createElement('span');
    content.className = line.type === 'cmd' ? 'cmd' : 'out';
    row.appendChild(content);
    termBody.appendChild(row);

    if (line.type === 'cmd') {
      const plain = line.text.replace(/<[^>]+>/g, '');
      let index = 0;
      const timer = setInterval(() => {
        content.textContent = plain.slice(0, ++index);
        if (index >= plain.length) {
          clearInterval(timer);
          resolve();
        }
      }, 26);
      return;
    }

    content.innerHTML = line.text;
    resolve();
  });
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slugFromTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function plainExcerpt(markdown, limit = 180) {
  const firstParagraph = markdown
    .split('\n\n')
    .map(block => block.replace(/^#+\s+/gm, '').trim())
    .find(block => block && !block.startsWith('```')) || '';

  const cleaned = firstParagraph
    .replace(/==/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.length > limit ? `${cleaned.slice(0, limit).trim()}...` : cleaned;
}

async function getMarkdown(post) {
  if (markdownCache.has(post.slug)) return markdownCache.get(post.slug);
  const response = await fetch(post.file);
  if (!response.ok) {
    throw new Error(`Unable to load ${post.file}`);
  }
  const markdown = await response.text();
  markdownCache.set(post.slug, markdown);
  return markdown;
}

async function enrichPosts() {
  const settled = await Promise.allSettled(blogPosts.map(async post => {
    const markdown = await getMarkdown(post);
    const derivedTitle = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (!post.title && derivedTitle) post.title = derivedTitle;
    if (!post.title) post.title = post.file.split('/').pop().replace(/\.md$/i, '');
    if (!post.slug) post.slug = slugFromTitle(post.title);
    post.excerpt = post.excerpt || plainExcerpt(markdown);
  }));

  settled.forEach((result, index) => {
    if (result.status === 'rejected') {
      const post = blogPosts[index];
      post.excerpt = 'This post could not be loaded right now.';
    }
  });
}

function createBlogCard(post) {
  const item = document.createElement('a');
  item.className = 'blog-item';
  item.href = `/blogs/${post.slug}`;
  item.dataset.route = 'true';
  item.innerHTML = `
    <div class="blog-item-top">
      <span class="blog-topic">${post.topic}</span>
      <span class="blog-arrow">↗</span>
    </div>
    <h3 class="blog-title">${post.title}</h3>
    <p class="blog-excerpt">${post.excerpt || ''}</p>
    <div class="blog-meta">${post.dateLabel}</div>
  `;
  return item;
}

function renderBlogLists() {
  blogPreviewList.innerHTML = '';
  blogRouteList.innerHTML = '';

  blogPosts.slice(0, 3).forEach(post => blogPreviewList.appendChild(createBlogCard(post)));
  blogPosts.forEach(post => blogRouteList.appendChild(createBlogCard(post)));

  bindCursorTargets();
}

function renderProjectsRoute() {
  // Use the canonical `projects` array to render the full projects list.
  renderProjectLists();
}

function hideAllViews() {
  homeView.hidden = true;
  routeViews.forEach(view => {
    view.hidden = true;
  });
}

function showView(name) {
  hideAllViews();
  if (name === 'home') {
    homeView.hidden = false;
    document.body.dataset.route = 'home';
    return;
  }

  const active = document.querySelector(`[data-view="${name}"]`);
  if (active) {
    active.hidden = false;
    document.body.dataset.route = name;
  }
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

async function renderPost(slug) {
  const post = blogPosts.find(item => item.slug === slug);
  if (!post) {
    postTitle.textContent = 'Post not found';
    postMeta.textContent = 'This blog post does not exist yet.';
    postContent.innerHTML = '<p>The link is valid for the route system, but there is no markdown file connected to it yet.</p>';
    showView('post');
    return;
  }

  try {
    const markdown = await getMarkdown(post);
    postTitle.textContent = post.title;
    postMeta.textContent = `${post.topic} · ${post.dateLabel}`;
    postContent.innerHTML = window.marked ? window.marked.parse(markdown) : `<pre>${markdown}</pre>`;
  } catch (error) {
    postTitle.textContent = post.title;
    postMeta.textContent = `${post.topic} · ${post.dateLabel}`;
    postContent.innerHTML = '<p>I could not load this markdown file right now.</p>';
  }

  showView('post');
  window.scrollTo({ top: 0, behavior: 'auto' });
}

async function renderRoute() {
  const path = normalizePath(location.pathname);

  if (path === '/') {
    showView('home');
    return;
  }

  if (path === '/projects') {
    renderProjectsRoute();
    showView('projects');
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  if (path === '/blogs') {
    showView('blogs');
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  if (path.startsWith('/blogs/')) {
    const slug = path.replace('/blogs/', '');
    await renderPost(slug);
    return;
  }

  history.replaceState({}, '', '/');
  showView('home');
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[data-route]');
  if (!link) return;

  const url = new URL(link.href, location.origin);
  if (url.origin !== location.origin) return;

  event.preventDefault();
  history.pushState({}, '', `${url.pathname}${url.hash}`);
  renderRoute().then(() => {
    if (url.hash && normalizePath(url.pathname) === '/') {
      const target = document.querySelector(url.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

window.addEventListener('popstate', () => {
  renderRoute();
});

document.querySelectorAll('.mag').forEach(btn => {
  btn.addEventListener('mousemove', event => {
    const rect = btn.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.25;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.25;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

const themeBtn = document.getElementById('theme-btn');
const wipe = document.getElementById('wipe');
let light = true;
let wiping = false;

themeBtn.addEventListener('click', () => {
  if (wiping) return;
  wiping = true;

  const rect = themeBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const diag = Math.hypot(innerWidth, innerHeight) * 2.2;
  const next = light ? '#0f0e0c' : '#f5efe3';

  themeBtn.classList.add('spin');
  Object.assign(wipe.style, {
    left: `${cx}px`,
    top: `${cy}px`,
    width: `${diag}px`,
    height: `${diag}px`,
    background: next,
    transform: 'translate(-50%,-50%) scale(0)',
    transition: 'none',
    opacity: '1',
  });

  wipe.offsetHeight;
  wipe.style.transition = 'transform 0.62s cubic-bezier(0.25,0,0,1)';
  wipe.style.transform = 'translate(-50%,-50%) scale(1)';

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

function updateTS() {
  tsEl.textContent = new Date().toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

async function init() {
  observeReveals();
  bindCursorTargets();
  updateTS();
  setInterval(updateTS, 60000);
  setTimeout(typeTerminal, 700);
  await enrichPosts();
  renderBlogLists();
  renderProjectLists();
  await renderRoute();

  if (location.hash && normalizePath(location.pathname) === '/') {
    const target = document.querySelector(location.hash);
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}

init();
