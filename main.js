document.addEventListener('DOMContentLoaded', () => {
  // Simple intersection observer to trigger chat animations nicely when scrolled into view
  const messages = document.querySelectorAll('.message');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });

  messages.forEach(msg => {
    observer.observe(msg);
  });

  // Typewriter effect function
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
        // Trigger staggered items if any
        const msgParent = element.closest('.message');
        if (msgParent) {
            const staggered = msgParent.querySelectorAll('.stagger-item');
            staggered.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('revealed');
                }, index * 200);
            });
        }
      }
    }, speed);
  };

  // Observe typewriter elements
  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
        entry.target.classList.add('typed');
        typeWriter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-typewriter]').forEach(el => {
    typeObserver.observe(el);
  });

  // Language Selector
  const langSpans = document.querySelectorAll('.language-selector span');
  langSpans.forEach(span => {
    span.addEventListener('click', (e) => {
      const activeSpan = document.querySelector('.language-selector span.active');
      if (activeSpan) activeSpan.classList.remove('active');
      e.target.classList.add('active');
    });
  });

  // Border Glow Spotlight Tracking for Bubbles
  const bubbles = document.querySelectorAll('.bubble');
  
  bubbles.forEach(bubble => {
    // When hovering over the bubble, update CSS var coordinates
    bubble.addEventListener('mousemove', (e) => {
      const rect = bubble.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      bubble.style.setProperty('--mouse-x', `${x}px`);
      bubble.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
