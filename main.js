import { LOG_DAYS, FX_DEMO } from './src/data.js';

// ── Page State ────────────────────────────────────────────────────────────
let currentPage = LOG_DAYS.length - 1; // start on latest day

// Entrance animation styles cycling per message index
const ENTER_STYLES = ['', 'enter-drop', 'enter-expand', 'enter-beam', 'enter-glitch'];

// ── Render a single message ───────────────────────────────────────────────
function renderMessage(msg, delay = 0, index = 0) {
  const isUser = msg.role === 'user';
  const enterClass = ENTER_STYLES[index % ENTER_STYLES.length];
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'ai'} fade-in ${enterClass}`.trim();
  div.style.animationDelay = `${delay}s`;

  const avatar = `
    <div class="avatar">
      <img src="${isUser ? '/wen_tian.png' : '/dali_new_transparent.png'}"
           alt="${isUser ? '文天' : 'DALI'}"
           ${isUser ? '' : 'class="dali-3d"'}>
      <span class="name">${isUser ? '文天' : 'DALI'}</span>
    </div>`;

  let bubbleInner = '';
  if (msg.header) bubbleInner += `<div class="bubble-header" data-text="${msg.header}">${msg.header}</div>`;
  if (msg.action)  bubbleInner += `<div class="bubble ai-action"><span class="play-icon">▶</span><div class="action-text"><span class="title">${msg.action}</span></div></div>`;
  if (msg.content) bubbleInner += `<p>${msg.content}</p>`;

  // Single box
  if (msg.box) {
    bubbleInner += `<div class="box-content">
      <span class="step-num">${msg.box.label}</span>
      ${msg.box.lines.map((l, i) =>
        `<p class="mono-line">${i === msg.box.highlight ? `<span class="highlight">${l}</span>` : l}</p>`
      ).join('')}
    </div>`;
  }

  // Multiple boxes (user message with tiers)
  if (msg.boxes) {
    msg.boxes.forEach(b => {
      bubbleInner += `<div class="box-content" style="border-left:2px solid ${b.color}; margin-top:10px">
        <span class="step-num" style="color:${b.color}">${b.label}</span>
        ${b.lines.map(l => `<p class="mono-line">• ${l}</p>`).join('')}
      </div>`;
    });
  }

  // Table
  if (msg.table) {
    const { headers, rows } = msg.table;
    bubbleInner += `<div class="comparison-container"><table class="comparison-table">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  }

  if (msg.footer) bubbleInner += `<p style="margin-top:10px;font-size:0.9em;opacity:0.8">${msg.footer}</p>`;

  const typeClass = msg.type === 'success' ? ' success' : msg.type === 'danger' ? ' danger' : '';
  let autoFx = '';
  if (msg.fx && msg.fx !== 'cyber') { autoFx = ` bubble-${msg.fx}`; }
  else if (!isUser && msg.header) autoFx = ' bubble-glitch';
  else if (msg.type === 'success') autoFx = ' bubble-scanline';
  else if (msg.type === 'danger') autoFx = ' bubble-neon';

  // Support split bubbles: array of {header, content} parts
  let bubble;
  if (msg.parts && msg.parts.length > 0) {
    const splitBubbles = msg.parts.map(part => {
      let inner = '';
      if (part.header) inner += `<div class="bubble-header" data-text="${part.header}">${part.header}</div>`;
      if (part.content) inner += `<p>${part.content}</p>`;
      return `<div class="bubble${typeClass}${autoFx}">${inner}</div>`;
    }).join('');
    bubble = `<div class="bubble-split">${splitBubbles}</div>`;
  } else {
    bubble = `<div class="bubble${typeClass}${autoFx}">${bubbleInner}</div>`;
  }

  div.innerHTML = isUser
    ? `${avatar}${bubble}`
    : `${bubble}${avatar}`;

  return div;
}

// ── Render a full day page ────────────────────────────────────────────────
function renderPage(index) {
  const day = LOG_DAYS[index];
  const container = document.getElementById('chat-content');
  container.innerHTML = '';

  // Apply per-day color
  if (day.color) {
    document.body.classList.add('day-theme');
    document.body.style.setProperty('--day-color', day.color);
  } else {
    document.body.classList.remove('day-theme');
  }

  // Chapter divider
  const divider = document.createElement('div');
  divider.className = 'timeline-divider';
  divider.innerHTML = `
    <span class="line left-line"></span>
    <span class="text">CHAPTER ${day.chapter} &middot; ${day.title}</span>
    <span class="line right-line"></span>`;
  container.appendChild(divider);

  // Messages
  day.messages.forEach((msg, i) => {
    const el = renderMessage(msg, i * 0.4, i);
    container.appendChild(el);
  });

  // Update nav
  document.getElementById('page-date').textContent = day.date;
  document.getElementById('btn-prev').disabled = index === 0;
  document.getElementById('btn-next').disabled = index === LOG_DAYS.length - 1;

  // Dots
  const dotsEl = document.getElementById('page-dots');
  dotsEl.innerHTML = LOG_DAYS.map((_, i) =>
    `<span class="dot ${i === index ? 'active' : ''}" data-idx="${i}"></span>`
  ).join('');
  dotsEl.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx)));
  });

  // Trigger slide-in after paint
  requestAnimationFrame(() => {
    container.querySelectorAll('.message').forEach((msg, i) => {
      setTimeout(() => msg.classList.add('slide-in'), i * 120);
    });
  });

  // Scroll to top of chat
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goTo(index) {
  currentPage = index;
  renderPage(index);
}

// ── Nav buttons ───────────────────────────────────────────────────────────
document.getElementById('btn-prev').addEventListener('click', () => {
  if (currentPage > 0) goTo(currentPage - 1);
});
document.getElementById('btn-next').addEventListener('click', () => {
  if (currentPage < LOG_DAYS.length - 1) goTo(currentPage + 1);
});

// ── Nebula Background (CSS cloud divs) ───────────────────────────────────
(function buildNebula() {
  const container = document.getElementById('nebula-bg');
  const clouds = [
    { color: '#3b0e6e', w: 700, h: 500, top: '10%', left: '5%',  dur: 28, tx: '8vw',  ty: '-5vh', ts: 1.2 },
    { color: '#0e1e6e', w: 600, h: 600, top: '40%', left: '60%', dur: 35, tx: '-6vw', ty: '8vh',  ts: 1.15 },
    { color: '#6e0e3b', w: 500, h: 400, top: '65%', left: '20%', dur: 42, tx: '5vw',  ty: '-10vh',ts: 1.3 },
    { color: '#0e4a6e', w: 800, h: 400, top: '5%',  left: '45%', dur: 50, tx: '-4vw', ty: '6vh',  ts: 1.1 },
    { color: '#2e6e0e', w: 400, h: 500, top: '55%', left: '75%', dur: 38, tx: '3vw',  ty: '-8vh', ts: 1.25 },
  ];
  clouds.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'cloud';
    el.style.cssText = `width:${c.w}px;height:${c.h}px;top:${c.top};left:${c.left};background:${c.color};animation-duration:${c.dur}s;animation-delay:${-i*5}s;--tx:${c.tx};--ty:${c.ty};--ts:${c.ts};`;
    container.appendChild(el);
  });
})();


// BG modes: 'nebula' | 'cosmic' | 'galaxy' | 'vanta'
let bgMode = 'nebula';
const bgIds = ['nebula-bg', 'cosmic-bg', 'galaxy-bg', 'vanta-bg'];
function showBg(mode) {
  bgMode = mode;
  bgIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id.startsWith(mode) ? 'block' : 'none';
  });
}
showBg('nebula');  // default

// ── Vanta.js 3D Background ────────────────────────────────────────────────
const EFFECTS = ['NET', 'DOTS', 'BIRDS'];
const EFFECT_LABELS = { NET: '粒子网络', DOTS: '量子矩阵', BIRDS: '数据流' };
let currentEffectIndex = 0;
let vantaEffect = null;

const vantaConfigs = {
  NET: {
    el: '#vanta-bg', THREE: window.THREE, mouseControls: true, touchControls: true,
    color: 0x00f0ff, backgroundColor: 0x03060c, points: 9.0, maxDistance: 22.0, spacing: 18.0, showDots: true,
  },
  DOTS: {
    el: '#vanta-bg', THREE: window.THREE, mouseControls: true, touchControls: true,
    color: 0x00f0ff, color2: 0x8616fa, backgroundColor: 0x03060c, size: 3.0, spacing: 28.0, showLines: false,
  },
  BIRDS: {
    el: '#vanta-bg', THREE: window.THREE, mouseControls: true, touchControls: true,
    backgroundColor: 0x03060c, color1: 0x00f0ff, color2: 0x8616fa,
    birdSize: 1.2, wingSpan: 22.0, speedLimit: 4.0, quantity: 3.0,
  },
};

function startEffect(name) {
  if (vantaEffect) vantaEffect.destroy();
  if (window.VANTA && window.VANTA[name]) vantaEffect = window.VANTA[name](vantaConfigs[name]);
}

const effectScripts = ['net', 'dots', 'birds'];
let loaded = 0;
effectScripts.forEach(fx => {
  const s = document.createElement('script');
  s.src = `https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${fx}.min.js`;
  s.onload = () => { if (++loaded === effectScripts.length) startEffect('NET'); };
  document.head.appendChild(s);
});

const BG_CYCLE = ['nebula', 'cosmic', 'galaxy', 'vanta-NET', 'vanta-DOTS', 'vanta-BIRDS'];
const BG_LABELS = { nebula: '✦ 星云', cosmic: '✦ 星云·蝴蝶', galaxy: '✦ 银河', 'vanta-NET': '✦ 粒子网络', 'vanta-DOTS': '✦ 量子矩阵', 'vanta-BIRDS': '✦ 数据流' };
let bgIdx = 0;

document.getElementById('fx-btn').addEventListener('click', () => {
  bgIdx = (bgIdx + 1) % BG_CYCLE.length;
  const mode = BG_CYCLE[bgIdx];
  document.getElementById('fx-btn').textContent = BG_LABELS[mode];
  if (mode === 'nebula' || mode === 'cosmic' || mode === 'galaxy') {
    if (vantaEffect) { vantaEffect.destroy(); vantaEffect = null; }
    showBg(mode);
  } else {
    showBg('vanta');
    const name = mode.replace('vanta-', '');
    currentEffectIndex = EFFECTS.indexOf(name);
    if (loaded >= effectScripts.length) startEffect(name);
  }
});

// ── Font Size Toggle ──────────────────────────────────────────────────────
const FONT_SCALES = [1, 1.15, 0.87];
const FONT_LABELS = ['A', 'A+', 'a'];
let fontIdx = 0;
document.getElementById('btn-fontsize').addEventListener('click', () => {
  fontIdx = (fontIdx + 1) % FONT_SCALES.length;
  document.documentElement.style.setProperty('--font-scale', FONT_SCALES[fontIdx]);
  document.getElementById('btn-fontsize').textContent = FONT_LABELS[fontIdx];
});

// ── Language Selector ─────────────────────────────────────────────────────
document.querySelectorAll('.language-selector span').forEach(span => {
  span.addEventListener('click', e => {
    document.querySelector('.language-selector span.active')?.classList.remove('active');
    e.target.classList.add('active');
  });
});

// ── Mouse glow on bubbles (delegated) ────────────────────────────────────
document.addEventListener('mousemove', e => {
  const bubble = e.target.closest?.('.bubble');
  if (bubble) {
    const rect = bubble.getBoundingClientRect();
    bubble.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    bubble.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }
});

// ── FX Demo ───────────────────────────────────────────────────────────────
let showingDemo = false;
document.getElementById('btn-fx-demo').addEventListener('click', () => {
  showingDemo = !showingDemo;
  if (showingDemo) {
    renderCustomPage(FX_DEMO);
    document.getElementById('btn-fx-demo').textContent = '← 返回日志';
    document.getElementById('btn-fx-demo').style.opacity = '1';
  } else {
    renderPage(currentPage);
    document.getElementById('btn-fx-demo').textContent = '✦ 特效预览';
    document.getElementById('btn-fx-demo').style.opacity = '0.6';
  }
});

function renderCustomPage(day) {
  const container = document.getElementById('chat-content');
  container.innerHTML = '';
  const divider = document.createElement('div');
  divider.className = 'timeline-divider';
  divider.innerHTML = `<span class="line left-line"></span><span class="text">CHAPTER ${day.chapter} &middot; ${day.title}</span><span class="line right-line"></span>`;
  container.appendChild(divider);
  day.messages.forEach((msg, i) => {
    const el = renderMessage(msg, i * 0.3, i);
    container.appendChild(el);
  });
  document.getElementById('page-date').textContent = day.date;
  requestAnimationFrame(() => {
    container.querySelectorAll('.message').forEach((msg, i) => {
      setTimeout(() => msg.classList.add('slide-in'), i * 120);
    });
  });
}

// ── Card Theme Switcher (A / B / C) ──────────────────────────────────────
const THEMES = [null, 'theme-tilt', 'theme-neon', 'theme-panels', 'theme-bright'];
const THEME_LABELS = ['◈ 默认', '◈ 风格 A · 3D倾斜', '◈ 风格 B · 霓虹玻璃', '◈ 风格 C · 暗面板', '◈ 风格 D · 高亮玻璃'];
let themeIdx = 2; // default: theme-neon

function applyTheme(idx) {
  THEMES.forEach(t => t && document.body.classList.remove(t));
  if (THEMES[idx]) document.body.classList.add(THEMES[idx]);
  document.getElementById('btn-theme').textContent = THEME_LABELS[idx];
}

document.getElementById('btn-theme').addEventListener('click', () => {
  themeIdx = (themeIdx + 1) % THEMES.length;
  applyTheme(themeIdx);
});

// ── 3D Tilt on Theme A ────────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  if (!document.body.classList.contains('theme-tilt')) return;
  document.querySelectorAll('.bubble').forEach(bubble => {
    const rect = bubble.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.9) {
      bubble.style.transform = `perspective(600px) rotateY(${dx * 14}deg) rotateX(${-dy * 10}deg) translateZ(6px)`;
      bubble.style.boxShadow = `${-dx * 20}px ${-dy * 20}px 40px rgba(140,60,255,0.35)`;
    } else {
      bubble.style.transform = '';
      bubble.style.boxShadow = '';
    }
  });
});

// ── Init ──────────────────────────────────────────────────────────────────
applyTheme(themeIdx);
renderPage(currentPage);
