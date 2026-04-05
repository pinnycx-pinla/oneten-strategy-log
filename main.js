document.addEventListener('DOMContentLoaded', () => {

  // ── Vanta.js 3D Background with Effect Switcher ──────────────────────────
  const EFFECTS = ['NET', 'DOTS', 'BIRDS'];
  const EFFECT_LABELS = { NET: '粒子网络', DOTS: '量子矩阵', BIRDS: '数据流' };
  let currentEffectIndex = 0;
  let vantaEffect = null;

  const vantaConfigs = {
    NET: {
      el: '#vanta-bg',
      THREE: window.THREE,
      mouseControls: true,
      touchControls: true,
      color: 0x00f0ff,
      backgroundColor: 0x03060c,
      points: 9.0,
      maxDistance: 22.0,
      spacing: 18.0,
      showDots: true,
    },
    DOTS: {
      el: '#vanta-bg',
      THREE: window.THREE,
      mouseControls: true,
      touchControls: true,
      color: 0x00f0ff,
      color2: 0x8616fa,
      backgroundColor: 0x03060c,
      size: 3.0,
      spacing: 28.0,
      showLines: false,
    },
    BIRDS: {
      el: '#vanta-bg',
      THREE: window.THREE,
      mouseControls: true,
      touchControls: true,
      backgroundColor: 0x03060c,
      color1: 0x00f0ff,
      color2: 0x8616fa,
      birdSize: 1.2,
      wingSpan: 22.0,
      speedLimit: 4.0,
      separation: 50.0,
      alignment: 50.0,
      cohesion: 50.0,
      quantity: 3.0,
    },
  };

  function startEffect(name) {
    if (vantaEffect) vantaEffect.destroy();
    if (window.VANTA && window.VANTA[name]) {
      vantaEffect = window.VANTA[name](vantaConfigs[name]);
    }
  }

  // Load all Vanta effect scripts, then start NET
  const effectScripts = ['net', 'dots', 'birds'];
  let loaded = 0;
  effectScripts.forEach(fx => {
    const s = document.createElement('script');
    s.src = `https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${fx}.min.js`;
    s.onload = () => {
      loaded++;
      if (loaded === effectScripts.length) startEffect('NET');
    };
    document.head.appendChild(s);
  });

  // Floating effect switcher button
  const btn = document.createElement('button');
  btn.id = 'fx-btn';
  btn.textContent = '✦ 切换特效';
  btn.title = '点击切换 3D 背景';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    currentEffectIndex = (currentEffectIndex + 1) % EFFECTS.length;
    const name = EFFECTS[currentEffectIndex];
    startEffect(name);
    btn.textContent = `✦ ${EFFECT_LABELS[name]}`;
  });

  // ── Slide-in animations for chat messages ────────────────────────────────
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-in');
        slideObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.message').forEach(msg => {
    slideObserver.observe(msg);
  });

  // ── Typewriter effect ─────────────────────────────────────────────────────
  const typeWriter = (element, speed = 30) => {
    const text = element.getAttribute('data-typewriter');
    if (!text) return;
    element.innerHTML = '';
    element.classList.add('typing-cursor');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        element.classList.remove('typing-cursor');
        const msgParent = element.closest('.message');
        if (msgParent) {
          msgParent.querySelectorAll('.stagger-item').forEach((item, index) => {
            setTimeout(() => item.classList.add('revealed'), index * 200);
          });
        }
      }
    }, speed);
  };

  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
        entry.target.classList.add('typed');
        typeWriter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-typewriter]').forEach(el => typeObserver.observe(el));

  // ── Language Selector ─────────────────────────────────────────────────────
  document.querySelectorAll('.language-selector span').forEach(span => {
    span.addEventListener('click', (e) => {
      document.querySelector('.language-selector span.active')?.classList.remove('active');
      e.target.classList.add('active');
    });
  });

  // ── Mouse glow on bubbles ─────────────────────────────────────────────────
  document.querySelectorAll('.bubble').forEach(bubble => {
    bubble.addEventListener('mousemove', (e) => {
      const rect = bubble.getBoundingClientRect();
      bubble.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      bubble.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
});
