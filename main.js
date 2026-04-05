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
  // Mixed FX: glitch on AI headers, angular on user, scanline on success, neon on danger
  let autoFx = '';
  if (msg.fx) { autoFx = ` bubble-${msg.fx}`; }
  else if (!isUser && msg.header) autoFx = ' bubble-glitch';
  else if (isUser) autoFx = ' bubble-cyber';
  else if (msg.type === 'success') autoFx = ' bubble-scanline';
  else if (msg.type === 'danger') autoFx = ' bubble-neon';
  const bubble = `<div class="bubble${typeClass}${autoFx}">${bubbleInner}</div>`;

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

document.getElementById('fx-btn').addEventListener('click', () => {
  currentEffectIndex = (currentEffectIndex + 1) % EFFECTS.length;
  const name = EFFECTS[currentEffectIndex];
  startEffect(name);
  document.getElementById('fx-btn').textContent = `✦ ${EFFECT_LABELS[name]}`;
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

// ── Init ──────────────────────────────────────────────────────────────────
renderPage(currentPage);
