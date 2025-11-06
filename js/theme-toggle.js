(function(){
  const STORAGE_KEY = 'nf-theme';
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  // Migrate from any older key if present
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('theme');
  // Default to light when no saved preference
  const initial = saved || 'light';

  function adjustPageSpecific(theme){
    // Handle Bootstrap-based pages (e.g., Wordle) that set body classes
    const hasBootstrapDark = document.body.classList.contains('bg-dark') || document.body.classList.contains('text-white');
    if (hasBootstrapDark || document.body.classList.contains('bg-light') || document.body.classList.contains('text-dark')){
      document.body.classList.toggle('bg-dark', theme === 'dark');
      document.body.classList.toggle('text-white', theme === 'dark');
      document.body.classList.toggle('bg-light', theme === 'light');
      document.body.classList.toggle('text-dark', theme === 'light');
    }

    // Neutralize strong dark overlays on Wordle cover in light mode
    const isWordle = location.pathname.includes('/projects/wordle/');
    if (isWordle){
      if (theme === 'light'){
        document.body.style.backgroundColor = '#f8f9fa';
        document.body.style.color = '#212529';
        document.body.style.boxShadow = 'none';
        document.body.style.textShadow = 'none';
      } else {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        document.body.style.boxShadow = '';
        document.body.style.textShadow = '';
      }
    }

    // Booking page: ensure body reads as light/dark as well
    const isBooking = location.pathname.includes('/projects/booking/');
    if (isBooking){
      if (theme === 'light'){
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0b0b10';
      } else {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
    }
  }

  function applyTheme(theme){
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e) {}
    adjustPageSpecific(theme);
    updateButton(theme);
  }

  let btn;
  function ensureButton(){
    if (btn && btn.isConnected) return btn;
    btn = document.querySelector('.theme-toggle');
    if (!btn){
      btn = document.createElement('button');
      btn.className = 'theme-toggle';
      btn.type = 'button';
      btn.title = 'Toggle light/dark';
      // Insert near the nav in the header; after nav so it's on the right side
      const header = document.querySelector('header');
      if (header){
        const nav = header.querySelector('.nav-menu');
        if (nav && nav.parentNode === header){
          nav.insertAdjacentElement('afterend', btn);
        } else {
          header.appendChild(btn);
        }
      } else {
        // fallback: fixed bottom-right
        btn.style.position = 'fixed';
        btn.style.right = '16px';
        btn.style.bottom = '16px';
        document.body.appendChild(btn);
      }
    }
    function toggleTheme(){
      const current = document.documentElement.getAttribute('data-theme') || initial;
      applyTheme(current === 'light' ? 'dark' : 'light');
    }
    // Use pointer events for unified touch/mouse handling
    btn.addEventListener('pointerup', function(e){
      // Prevent ghost click after touch
      if (e) e.preventDefault();
      toggleTheme();
    });
    // Accessible keyboard support (Enter/Space)
    btn.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
    return btn;
  }

  function updateButton(theme){
    ensureButton();
    if (!btn) return;
    const isLight = theme === 'light';
    // Icon-only toggle using inline SVG, showing the next state icon
    // If currently light, show moon (switch to dark). If dark, show sun (switch to light).
    const moon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    const sun = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4 12H2m20 0h-2M5.64 5.64 4.22 4.22m15.56 15.56-1.42-1.42M18.36 5.64l1.42-1.42M5.64 18.36 4.22 19.78"></path></svg>';
    btn.innerHTML = isLight ? moon : sun;
    btn.setAttribute('aria-label', isLight ? 'Activate dark mode' : 'Activate light mode');
    btn.setAttribute('title', isLight ? 'Dark mode' : 'Light mode');
    btn.setAttribute('aria-pressed', String(isLight));
  }

  // Initialize
  function init(){
    ensureButton();
    applyTheme(initial);
  }
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState === 'interactive' || document.readyState === 'complete'){
    init();
  }
})();
