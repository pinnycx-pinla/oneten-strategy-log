import { LOG_DAYS, FX_DEMO } from './src/data.js';

// ── ONETEN Public Archive (isolated dataset, 2026-05-17 added) ──────────
// Loaded defensively: if oneten_data.js missing or empty, build-log view unaffected.
let ONETEN_DAYS = [];
try {
  const mod = await import('./src/oneten_data.js');
  ONETEN_DAYS = mod.ONETEN_DAYS || [];
} catch (e) {
  console.warn('ONETEN archive data not available; build-log view only.');
}

// ── Page State ────────────────────────────────────────────────────────────
// currentView: 'build-log' (default) or 'oneten'
// currentDays: live ref to the active dataset; renderPage / nav use this.
let currentView = (typeof location !== 'undefined' && location.hash === '#oneten') ? 'oneten' : 'build-log';
let currentDays = (currentView === 'oneten' && ONETEN_DAYS.length > 0) ? ONETEN_DAYS : LOG_DAYS;
let currentPage = currentDays.length - 1; // start on latest day
let currentLang = 'en'; // zh | en | ko — default landing language

// ── Header AI avatar — rotate across ONETEN QUANT roster (character + expression) ─
(function rotateHeaderAvatar() {
  const roster = [
    {
      key: 'ia10', name: 'IA10', cls: '',
      variants: ['/ia10_head_a.jpg', '/ia10_head_b.jpg', '/ia10_head_c.jpg', '/ia10_head_d.jpg'],
    },
    {
      key: 'karen', name: 'KAREN', cls: '',
      variants: ['/karen.jpg'],
    },
    {
      key: 'mini', name: 'MINI', cls: '',
      variants: ['/mini.jpg'],
    },
    {
      key: 'dali', name: 'DALI', cls: 'dali-3d',
      variants: ['/dali_new_transparent.png'],
    },
  ];
  const pickChar = roster[Math.floor(Math.random() * roster.length)];
  const pickImg  = pickChar.variants[Math.floor(Math.random() * pickChar.variants.length)];
  const img = document.getElementById('header-ai-avatar');
  const name = document.getElementById('header-ai-name');
  const wrap = document.getElementById('header-ai-wrap');
  if (img && name && wrap) {
    img.src = pickImg;
    img.alt = pickChar.name;
    img.className = pickChar.cls;
    name.textContent = pickChar.name;
    wrap.dataset.speaker = pickChar.key;
  }
})();

// Entrance animation styles cycling per message index
const ENTER_STYLES = ['', 'enter-drop', 'enter-expand', 'enter-beam', 'enter-glitch'];

// ── Render a single message ───────────────────────────────────────────────
function renderMessage(msg, delay = 0, index = 0) {
  const isUser = msg.role === 'user';
  const enterClass = ENTER_STYLES[index % ENTER_STYLES.length];
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'ai'} fade-in ${enterClass}`.trim();
  div.style.animationDelay = `${delay}s`;

  const USER_NAMES = { zh: '文天', en: 'ONE TEN', ko: '문천' };
  const userName = USER_NAMES[currentLang] || '文天';

  // ONETEN QUANT roster: ia10 (commander) / karen (action) / mini (reflection) / dali (legacy)
  // wrapperCls colors the ring; imgCls keeps DALI's 3D floating bot styling on the img itself
  const SPEAKERS = {
    ia10:  { img: '/ia10.jpg',                 name: 'IA10',  wrapperCls: 'speaker-ia10',  imgCls: '' },
    karen: { img: '/karen.jpg',                name: 'KAREN', wrapperCls: 'speaker-karen', imgCls: '' },
    mini:  { img: '/mini.jpg',                 name: 'MINI',  wrapperCls: 'speaker-mini',  imgCls: '' },
    dali:  { img: '/dali_new_transparent.png', name: 'DALI',  wrapperCls: 'speaker-dali',  imgCls: 'dali-3d' },
  };
  const aiSpeaker = SPEAKERS[msg.speaker] || SPEAKERS.dali;

  const avatar = `
    <div class="avatar ${isUser ? '' : aiSpeaker.wrapperCls}">
      <img src="${isUser ? '/wen_tian.png' : aiSpeaker.img}"
           alt="${isUser ? userName : aiSpeaker.name}"
           ${isUser ? '' : `class="${aiSpeaker.imgCls}"`}>
      <span class="name">${isUser ? userName : aiSpeaker.name}</span>
    </div>`;

  let bubbleInner = '';
  if (msg.header) bubbleInner += `<div class="bubble-header" data-text="${msg.header}">${msg.header}</div>`;
  if (msg.action)  bubbleInner += `<div class="bubble ai-action"><span class="play-icon">▶</span><div class="action-text"><span class="title">${msg.action}</span></div></div>`;
  const localContent = (currentLang === 'en' && msg.content_en) ? msg.content_en
                     : (currentLang === 'ko' && msg.content_ko) ? msg.content_ko
                     : msg.content;
  if (localContent) bubbleInner += `<p>${localContent}</p>`;

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

  // Screenshot / image attachment
  if (msg.image) {
    const imgs = Array.isArray(msg.image) ? msg.image : [msg.image];
    const grid = imgs.length > 1 ? ' bubble-img-grid' : '';
    bubbleInner += `<div class="bubble-images${grid}">${imgs.map(src =>
      `<img class="bubble-img" src="${src}" alt="screenshot" loading="lazy">`
    ).join('')}</div>`;
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
  const day = currentDays[index];
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
  const chapterTitle = (currentLang === 'en' && day.title_en) ? day.title_en
                     : (currentLang === 'ko' && day.title_ko) ? day.title_ko
                     : day.title;
  const divider = document.createElement('div');
  divider.className = 'timeline-divider';
  divider.innerHTML = `
    <span class="line left-line"></span>
    <span class="text">CHAPTER ${day.chapter} &middot; ${chapterTitle}</span>
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
  document.getElementById('btn-next').disabled = index === currentDays.length - 1;

  // Dots — windowed so long histories don't blow out the row width
  const dotsEl = document.getElementById('page-dots');
  const total = currentDays.length;
  const MAX_DOTS = 9;
  let start = Math.max(0, index - Math.floor(MAX_DOTS / 2));
  let end = Math.min(total, start + MAX_DOTS);
  start = Math.max(0, end - MAX_DOTS);

  const parts = [];
  if (start > 0) parts.push(`<span class="dot edge" data-idx="0"></span>`);
  for (let i = start; i < end; i++) {
    parts.push(`<span class="dot ${i === index ? 'active' : ''}" data-idx="${i}"></span>`);
  }
  if (end < total) parts.push(`<span class="dot edge" data-idx="${total - 1}"></span>`);
  parts.push(`<span class="page-count">${index + 1} / ${total}</span>`);
  dotsEl.innerHTML = parts.join('');
  dotsEl.querySelectorAll('[data-idx]').forEach(dot => {
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
  if (currentPage < currentDays.length - 1) goTo(currentPage + 1);
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
let vantaScriptsRequested = false;
function ensureVantaScripts(afterLoad) {
  if (vantaScriptsRequested) {
    if (loaded >= effectScripts.length) afterLoad && afterLoad();
    return;
  }
  vantaScriptsRequested = true;
  effectScripts.forEach(fx => {
    const s = document.createElement('script');
    s.src = `https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${fx}.min.js`;
    s.onload = () => { if (++loaded === effectScripts.length) afterLoad && afterLoad(); };
    document.head.appendChild(s);
  });
}

const BG_CYCLE = ['nebula', 'cosmic', 'galaxy', 'vanta-NET', 'vanta-DOTS', 'vanta-BIRDS'];
const BG_LABELS = { nebula: '✦ 星云', cosmic: '✦ 星云·蝴蝶', galaxy: '✦ 银河', 'vanta-NET': '✦ 粒子网络', 'vanta-DOTS': '✦ 量子矩阵', 'vanta-BIRDS': '✦ 数据流' };
let bgIdx = 0;
let currentBgMode = 'nebula';

document.getElementById('fx-btn').addEventListener('click', () => {
  bgIdx = (bgIdx + 1) % BG_CYCLE.length;
  const mode = BG_CYCLE[bgIdx];
  currentBgMode = mode;
  document.getElementById('fx-btn').textContent = (UI[currentLang]?.bgLabels[mode]) || BG_LABELS[mode];
  if (mode === 'nebula' || mode === 'cosmic' || mode === 'galaxy') {
    if (vantaEffect) { vantaEffect.destroy(); vantaEffect = null; }
    showBg(mode);
  } else {
    showBg('vanta');
    const name = mode.replace('vanta-', '');
    currentEffectIndex = EFFECTS.indexOf(name);
    ensureVantaScripts(() => startEffect(name));
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
const LANG_MAP = { '한국어': 'ko', 'English': 'en', '中文': 'zh' };
const HEADER_NAMES = { zh: '文天', en: 'ONE TEN', ko: '문천' };
const HERO_TAGLINES  = { zh: '智能构建', en: 'Intelligent Build', ko: '지능형 구축' };
const HERO_SUBTITLES = {
  zh: '从策略到系统 · 从对话到代码 · 从代码到公司',
  en: 'From Strategy to System · From Dialogue to Code · From Code to Company',
  ko: '전략에서 시스템으로 · 대화에서 코드로 · 코드에서 회사로',
};
const UI = {
  zh: { prev: '← 前一天', next: '后一天 →', fxDemo: '✦ 特效预览', fxBack: '← 返回日志', fxToggle: '✦ 切换特效',
        bgLabels: { nebula: '✦ 星云', cosmic: '✦ 星云·蝴蝶', galaxy: '✦ 银河', 'vanta-NET': '✦ 粒子网络', 'vanta-DOTS': '✦ 量子矩阵', 'vanta-BIRDS': '✦ 数据流' },
        themeLabels: ['◈ 默认', '◈ 风格 A · 3D倾斜', '◈ 风格 B · 霓虹玻璃', '◈ 风格 C · 暗面板', '◈ 风格 D · 高亮玻璃'] },
  en: { prev: '← Prev', next: 'Next →', fxDemo: '✦ FX Preview', fxBack: '← Back to Log', fxToggle: '✦ Switch FX',
        bgLabels: { nebula: '✦ Nebula', cosmic: '✦ Nebula·Butterfly', galaxy: '✦ Galaxy', 'vanta-NET': '✦ Particle Net', 'vanta-DOTS': '✦ Quantum Grid', 'vanta-BIRDS': '✦ Data Flow' },
        themeLabels: ['◈ Default', '◈ Style A · 3D Tilt', '◈ Style B · Neon Glass', '◈ Style C · Dark Panel', '◈ Style D · Bright Glass'] },
  ko: { prev: '← 이전', next: '다음 →', fxDemo: '✦ 특효 미리보기', fxBack: '← 로그로 돌아가기', fxToggle: '✦ 특효 전환',
        bgLabels: { nebula: '✦ 성운', cosmic: '✦ 성운·나비', galaxy: '✦ 은하', 'vanta-NET': '✦ 파티클 네트', 'vanta-DOTS': '✦ 퀀텀 그리드', 'vanta-BIRDS': '✦ 데이터 흐름' },
        themeLabels: ['◈ 기본', '◈ 스타일 A · 3D 틸트', '◈ 스타일 B · 네온 글래스', '◈ 스타일 C · 다크 패널', '◈ 스타일 D · 브라이트 글래스'] },
};

let fxDemoActive = false; // track FX demo state for correct button label on lang switch

function applyLang(lang) {
  const u = UI[lang] || UI.zh;
  const $= id => document.getElementById(id);
  $('header-user-name') && ($('header-user-name').textContent = HEADER_NAMES[lang] || '文天');
  $('hero-tagline')     && ($('hero-tagline').textContent  = HERO_TAGLINES[lang]);
  $('hero-subtitle')    && ($('hero-subtitle').textContent = HERO_SUBTITLES[lang]);
  $('btn-prev')         && ($('btn-prev').textContent  = u.prev);
  $('btn-next')         && ($('btn-next').textContent  = u.next);
  $('btn-fx-demo')      && ($('btn-fx-demo').textContent = fxDemoActive ? u.fxBack : u.fxDemo);
  $('fx-btn')           && ($('fx-btn').textContent    = u.bgLabels[currentBgMode] || u.fxToggle);
  $('btn-theme')        && ($('btn-theme').textContent = u.themeLabels[currentTheme]);
}

document.querySelectorAll('.language-selector span').forEach(span => {
  span.addEventListener('click', e => {
    document.querySelector('.language-selector span.active')?.classList.remove('active');
    e.target.classList.add('active');
    const lang = LANG_MAP[e.target.textContent.trim()];
    if (lang && lang !== currentLang) {
      currentLang = lang;
      applyLang(lang);
      renderPage(currentPage);
    }
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
  fxDemoActive = showingDemo;
  const u = UI[currentLang] || UI.zh;
  if (showingDemo) {
    renderCustomPage(FX_DEMO);
    document.getElementById('btn-fx-demo').textContent = u.fxBack;
    document.getElementById('btn-fx-demo').style.opacity = '1';
  } else {
    renderPage(currentPage);
    document.getElementById('btn-fx-demo').textContent = u.fxDemo;
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
let currentTheme = 2;

function applyTheme(idx) {
  THEMES.forEach(t => t && document.body.classList.remove(t));
  if (THEMES[idx]) document.body.classList.add(THEMES[idx]);
  currentTheme = idx;
  document.getElementById('btn-theme').textContent = (UI[currentLang]?.themeLabels[idx]) || THEME_LABELS[idx];
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

// ── ONETEN view toggle (2026-05-17 additive) ──────────────────────────────
// Injects a small toggle button in the top-right of the header so users can
// switch between the internal build-log view and the ONETEN public archive
// without modifying any existing HTML. URL hash (#oneten) deep-links the view.
(function injectViewToggle() {
  if (ONETEN_DAYS.length === 0) {
    // No archive data → no toggle. Build-log unaffected.
    return;
  }
  const btn = document.createElement('button');
  btn.id = 'btn-view-toggle';
  btn.style.cssText = [
    'position:fixed', 'top:18px', 'right:18px', 'z-index:1000',
    'padding:8px 16px',
    'background:rgba(8,12,24,0.85)',
    'color:#e2f0ff',
    'border:1px solid #00f0ff80',
    'border-radius:6px',
    'font:500 12px/1.2 Inter,Noto Sans SC,sans-serif',
    'letter-spacing:0.06em',
    'cursor:pointer',
    'backdrop-filter:blur(8px)',
    'box-shadow:0 0 12px #00f0ff30',
  ].join(';');
  document.body.appendChild(btn);

  function updateLabel() {
    btn.textContent = currentView === 'oneten'
      ? '◀ INTERNAL BUILD LOG'
      : 'ONETEN PUBLIC ARCHIVE ▶';
  }

  function switchView(name) {
    if (name === currentView) return;
    currentView = name;
    currentDays = (name === 'oneten' && ONETEN_DAYS.length > 0) ? ONETEN_DAYS : LOG_DAYS;
    currentPage = currentDays.length - 1;
    if (typeof location !== 'undefined') {
      try { history.replaceState(null, '', name === 'oneten' ? '#oneten' : '#'); } catch (_) {}
    }
    renderPage(currentPage);
    updateLabel();
  }

  btn.addEventListener('click', () => {
    switchView(currentView === 'oneten' ? 'build-log' : 'oneten');
  });

  // React to manual hash changes
  window.addEventListener('hashchange', () => {
    const target = (location.hash === '#oneten') ? 'oneten' : 'build-log';
    switchView(target);
  });

  updateLabel();
})();
