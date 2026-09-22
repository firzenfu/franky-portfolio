(() => {
  const key = 'portfolio:anchor-navigation';
  const navigation = performance.getEntriesByType('navigation')[0];
  let clickedAnchor = false;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
    sessionStorage.removeItem(key);
    clickedAnchor = navigation?.type !== 'reload' &&
      saved?.url === location.href && Date.now() - saved.time < 15000;
  } catch { /* Storage may be unavailable in private browsing. */ }

  history.scrollRestoration = 'manual';
  const returning = navigation?.type === 'back_forward';
  const startAtTop = !clickedAnchor && !returning;
  if (startAtTop && location.hash) {
    history.replaceState(history.state, '', location.pathname + location.search);
  }

  let interacted = false;
  for (const event of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
    addEventListener(event, () => { interacted = true; }, { once: true, passive: true });
  }
  const reset = () => {
    if (startAtTop && !interacted) scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  reset();
  addEventListener('pageshow', (event) => {
    if (!event.persisted) reset();
  });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin || !target.hash ||
      (target.pathname === location.pathname && target.search === location.search)) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({ url: target.href, time: Date.now() }));
    } catch { /* Navigation remains available without storage. */ }
  });

  // React mounts its anchor targets after the initial document has been parsed.
  if (clickedAnchor && location.hash) {
    const revealTarget = () => {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return false; }
      const target = document.getElementById(id);
      if (!target || interacted) return false;
      target.scrollIntoView({ behavior: 'instant' });
      return true;
    };
    const observer = new MutationObserver(() => {
      if (revealTarget() || interacted) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    addEventListener('load', () => { revealTarget(); observer.disconnect(); }, { once: true });
  }
})();
