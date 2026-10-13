/* Reveal horizontal navigation and graph controls only when content overflows. */
(() => {
  if (!document.body.matches('.portfolio-v2.project-v2')) return;

  const items = [];
  const addHint = (scroller, kind, text) => {
    const hint = document.createElement('p');
    hint.className = `project-scroll-hint project-${kind}-hint`;
    hint.id = `project-scroll-help-${items.length + 1}`;
    hint.hidden = true;
    const arrow = document.createElement('span');
    arrow.textContent = '↔';
    arrow.setAttribute('aria-hidden', 'true');
    hint.append(arrow, document.createTextNode(text));
    if (kind === 'nav') scroller.after(hint);
    else scroller.before(hint);
    const description = scroller.getAttribute('aria-describedby');
    items.push({ scroller, hint, kind, description });
  };

  document.querySelectorAll('.project-quick-nav').forEach(nav => {
    const wrap = document.createElement('div');
    wrap.className = 'project-nav-wrap';
    nav.before(wrap);
    wrap.append(nav);
    addHint(nav, 'nav', '좌우로 넘겨 메뉴 보기');
  });

  document.querySelectorAll('.technical-image-scroll').forEach(graph => {
    graph.setAttribute('role', 'region');
    graph.setAttribute('aria-label', '가로로 이동하며 보는 결과 그래프');
    addHint(graph, 'figure', '좌우로 넘겨 전체 그래프 보기');
  });

  let scheduled = false;
  const update = () => {
    items.forEach(({ scroller, hint, kind, description }) => {
      const overflowing = scroller.scrollWidth > scroller.clientWidth + 2;
      hint.hidden = !overflowing;
      const help = [description, overflowing ? hint.id : null].filter(Boolean).join(' ');
      if (help) scroller.setAttribute('aria-describedby', help);
      else scroller.removeAttribute('aria-describedby');
      if (kind === 'figure') {
        if (overflowing) scroller.tabIndex = 0;
        else scroller.removeAttribute('tabindex');
      }
    });
    scheduled = false;
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    items.forEach(({ scroller }) => {
      observer.observe(scroller);
      scroller.querySelectorAll('img').forEach(img => observer.observe(img));
    });
  }
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule, { once: true });
  document.fonts?.ready.then(schedule);
  update();
})();
