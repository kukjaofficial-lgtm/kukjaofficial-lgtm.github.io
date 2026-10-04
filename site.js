(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Homepage slideshow
  var show = document.querySelector('.slideshow');
  if (!show) return;
  var slides = show.querySelectorAll('.slide');
  var tabs = show.querySelectorAll('.slide-tabs button');
  var pauseBtn = show.querySelector('.slide-pause');
  var DELAY = 7000; // time per slide in milliseconds
  var current = 0, timer = null, userPaused = false, hovering = false;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  show.style.setProperty('--slide-time', (DELAY / 1000) + 's');

  function go(i) {
    current = (i + slides.length) % slides.length;
    for (var k = 0; k < slides.length; k++) {
      var on = k === current;
      slides[k].classList.toggle('is-active', on);
      slides[k].setAttribute('aria-hidden', on ? 'false' : 'true');
      if ('inert' in slides[k]) slides[k].inert = !on;
      if (tabs[k]) {
        if (on) tabs[k].setAttribute('aria-current', 'true'); else tabs[k].removeAttribute('aria-current');
      }
    }
    restart();
  }
  function playing() { return !userPaused && !hovering && !reduceMotion; }
  function restart() {
    clearTimeout(timer);
    show.classList.remove('is-playing');
    void show.offsetWidth; // restart the progress bar animation
    if (playing()) {
      show.classList.add('is-playing');
      timer = setTimeout(function () { go(current + 1); }, DELAY);
    }
  }
  function setPaused(p) {
    userPaused = p;
    pauseBtn.setAttribute('aria-pressed', p ? 'true' : 'false');
    pauseBtn.textContent = p ? pauseBtn.getAttribute('data-play') : pauseBtn.getAttribute('data-pause');
    restart();
  }

  for (var i = 0; i < tabs.length; i++) {
    (function (n) { tabs[n].addEventListener('click', function () { go(n); }); })(i);
  }
  pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });
  show.addEventListener('mouseenter', function () { hovering = true; restart(); });
  show.addEventListener('mouseleave', function () { hovering = false; restart(); });
  show.addEventListener('focusin', function () { hovering = true; restart(); });
  show.addEventListener('focusout', function () { hovering = false; restart(); });

  // Swipe on phones
  var startX = null;
  show.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  show.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  if (reduceMotion) setPaused(true);
  go(0);
})();

// Notice category filter
(function () {
  var box = document.querySelector('.filters');
  if (!box) return;
  box.hidden = false;
  var buttons = box.querySelectorAll('button');
  var rows = document.querySelectorAll('.notice-list li');
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var f = b.getAttribute('data-filter');
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-pressed', buttons[i] === b ? 'true' : 'false');
    for (var j = 0; j < rows.length; j++) rows[j].hidden = !!f && rows[j].getAttribute('data-category') !== f;
  });
})();
