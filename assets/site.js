/* Aya Moustafa — shared behaviour for every page.
   No libraries. Every feature works by keyboard and screen reader, and
   falls back to a still, complete version when motion is reduced.
   Nothing is stored or sent anywhere. */
(function () {
  'use strict';

  // Footer, contacts, prices and booking lines come from assets/layout.js.
  if (window.AyaLayout) window.AyaLayout.fill();

  var root = document.documentElement;
  var rtl = root.dir === 'rtl';
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return motionQuery.matches; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------------------------------------------------------------
     Header: a hairline appears once the page scrolls
     --------------------------------------------------------------- */
  var header = $('.site-header');
  function onHeaderScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ---------------------------------------------------------------
     Home: the header's Book button appears once the hero button
     has scrolled out of view
     --------------------------------------------------------------- */
  var heroCta = $('[data-hero-cta]');
  if (header && heroCta && 'IntersectionObserver' in window) {
    var hh = header.offsetHeight;
    new IntersectionObserver(function (entries) {
      header.classList.toggle('cta-hidden', entries[0].isIntersecting);
    }, { rootMargin: '-' + hh + 'px 0px 0px 0px' }).observe(heroCta);
  } else if (header) {
    header.classList.remove('cta-hidden');
  }

  /* ---------------------------------------------------------------
     Phone menu: a calm full screen
     --------------------------------------------------------------- */
  var toggle = $('.menu-toggle');
  var menu = $('#mobile-menu');
  if (toggle && menu) {
    var openLabel = toggle.textContent.trim();
    var closeLabel = toggle.getAttribute('data-close-label') || openLabel;
    var behind = $all('main, .site-footer');
    var setMenu = function (open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? closeLabel : openLabel;
      document.body.classList.toggle('menu-open', open);
      behind.forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
      if (open) { var first = $('a', menu); if (first) first.focus(); }
    };
    toggle.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------------------------------------------------------------
     The gold thread: a tangle that untangles as the visitor scrolls,
     straight by the time they reach the session page.
     The same line reappears wherever [data-thread="live"] sits.
     --------------------------------------------------------------- */
  var threads = $all('[data-thread]').map(function (el) {
    var h = parseFloat(el.getAttribute('data-h')) || 80;
    return {
      el: el,
      path: $('path', el),
      live: el.getAttribute('data-thread') === 'live',
      h: h,
      loops: parseFloat(el.getAttribute('data-loops')) || 4,
      seed: parseFloat(el.getAttribute('data-seed')) || 0,
      n: h > 120 ? 260 : 150
    };
  });
  var threadEnd = $('[data-thread-end]');
  var endY = 0;
  var lastP = -1;

  function ease(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }

  function threadPath(t, p) {
    var W = 1000, H = t.h, mid = H / 2, d = '';
    var TAU = Math.PI * 2, ph = t.seed * 1.7;
    for (var i = 0; i <= t.n; i++) {
      var s = i / t.n;
      // Untangles from the reading side first (left in English, right in Arabic).
      var u = clamp(p * 1.3 - s * .3, 0, 1);
      var e = (1 - u) * (1 - u) * Math.min(1, s * 10, (1 - s) * 10);   // loosens fast at first, then settles
      var amp = .5 + .5 * Math.sin(TAU * 1.3 * s + ph);
      var a = TAU * t.loops * s + ph;
      var x = W * s + e * 64 * amp * Math.sin(a);
      var y = mid + e * (H * .34 * amp * Math.cos(a) + H * .12 * Math.sin(TAU * 1.7 * s + ph * .5));
      if (rtl) x = W - x;
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d;
  }

  // Home: the line is fully straight by the time the hero has left the screen,
  // so the change is clearly visible within the first one or two scrolls.
  var heroEl = $('.hero');
  function measureThreadEnd() {
    if (heroEl) {
      var hr = heroEl.getBoundingClientRect();
      endY = hr.bottom + window.scrollY - (header ? header.offsetHeight : 0);
    } else if (threadEnd) {
      var r = threadEnd.getBoundingClientRect();
      endY = r.top + window.scrollY - window.innerHeight * .55;
    }
  }

  function renderThreads(force) {
    var p = 1;
    if ((heroEl || threadEnd) && !reduced()) {
      p = clamp(window.scrollY / Math.max(1, endY), 0, 1);
      p = 1 - Math.pow(1 - p, 2);   // eases out: the biggest change happens at the start
    }
    if (!force && Math.abs(p - lastP) < .002) return;
    lastP = p;
    threads.forEach(function (t) { if (t.live && t.path) t.path.setAttribute('d', threadPath(t, p)); });
  }

  if (threads.length) {
    threads.forEach(function (t) {
      if (t.path) t.path.setAttribute('d', threadPath(t, 1));
    });
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; renderThreads(false); });
    };
    measureThreadEnd();
    renderThreads(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measureThreadEnd(); renderThreads(true); });
    window.addEventListener('load', function () { measureThreadEnd(); renderThreads(true); });
    motionQuery.addEventListener('change', function () { renderThreads(true); });
  }

  /* ---------------------------------------------------------------
     "Does this sound like you?" cards that turn over
     --------------------------------------------------------------- */
  function naturalHeight(el) {
    var prev = el.style.minHeight;
    el.style.minHeight = '0px';
    var h = el.offsetHeight;
    el.style.minHeight = prev;
    return h;
  }

  $all('.flip').forEach(function (card) {
    var inner = $('.flip__inner', card);
    var front = $('.flip__front', card);
    var back = $('.flip__back', card);
    var fBtn = $('.flip__btn', front);
    var bBtn = $('.flip__btn', back);
    back.setAttribute('inert', '');

    function set(open) {
      var hadFocus = card.contains(document.activeElement);
      var animate = !reduced();
      if (animate) { inner.style.height = inner.offsetHeight + 'px'; void inner.offsetHeight; }
      card.classList.toggle('is-open', open);
      fBtn.setAttribute('aria-expanded', String(open));
      bBtn.setAttribute('aria-expanded', String(open));
      if (open) { front.setAttribute('inert', ''); back.removeAttribute('inert'); }
      else { back.setAttribute('inert', ''); front.removeAttribute('inert'); }
      if (animate) inner.style.height = (open ? naturalHeight(back) : naturalHeight(front)) + 'px';
      else inner.style.height = '';
      if (hadFocus) (open ? bBtn : fBtn).focus({ preventScroll: true });
    }

    fBtn.addEventListener('click', function () { set(true); });
    back.addEventListener('click', function (e) { if (!e.target.closest('a')) set(false); });
    inner.addEventListener('transitionend', function (e) {
      if (e.target === inner && e.propertyName === 'height' && !card.classList.contains('is-open')) inner.style.height = '';
    });
    window.addEventListener('resize', function () {
      if (card.classList.contains('is-open') && !reduced()) inner.style.height = naturalHeight(back) + 'px';
    });
  });

  /* ---------------------------------------------------------------
     The session page that writes itself
     --------------------------------------------------------------- */
  var sheet = $('[data-sheet]');
  if (sheet) {
    var steps = $all('.sheet__step', sheet);
    var nextBtn = $('[data-sheet-next]');
    var nextLabel = nextBtn ? nextBtn.textContent.trim() : '';
    var againLabel = nextBtn ? (nextBtn.getAttribute('data-again-label') || nextLabel) : '';
    var linksSvg = $('.sheet__links', sheet);
    var writeArea = $('.sheet__write', sheet);
    var shown = 0;
    var timers = [];

    // Wrap every word in its own span so it can be "written" one at a time.
    var wrapWords = function (el) {
      // Captions are Aya's explanation, not handwriting: they fade in afterwards.
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) { return n.parentNode.closest('.sheet__caption') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
      });
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        if (!node.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      });
      $all('.w', el).forEach(function (w, i) { w.style.setProperty('--d', (i * 75) + 'ms'); });
      return $all('.w', el).length;
    };
    steps.forEach(function (s) { s._words = wrapWords(s); });

    var drawLinks = function (animate) {
      if (!linksSvg) return;
      var holder = $('[data-links]', sheet);
      if (!holder || !sheet.classList.contains('is-pattern')) { linksSvg.innerHTML = ''; return; }
      var base = writeArea.getBoundingClientRect();
      linksSvg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
      linksSvg.setAttribute('width', base.width);
      linksSvg.setAttribute('height', base.height);
      var out = '';
      holder.getAttribute('data-links').split(',').forEach(function (pair) {
        var ends = pair.split('-');
        var a = $('[data-link="' + ends[0] + '"]', holder), b = $('[data-link="' + ends[1] + '"]', holder);
        if (!a || !b) return;
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        // Measure the highlighted part of each keyword, not the tall line box.
        ra = $('.kw__mark', a).getBoundingClientRect();
        rb = $('.kw__mark', b).getBoundingClientRect();
        var f = function (n) { return n.toFixed(1); };
        var x1 = ra.left + ra.width / 2 - base.left, x2 = rb.left + rb.width / 2 - base.left;
        var d;
        if (Math.abs(ra.top - rb.top) < 4) {
          // Same line: a small arc underneath.
          var y = ra.bottom - base.top + 3, dip = y + 9 + Math.min(10, Math.abs(x2 - x1) * .05);
          d = 'M' + f(x1) + ' ' + f(y) + ' C' + f(x1) + ' ' + f(dip) + ' ' + f(x2) + ' ' + f(dip) + ' ' + f(x2) + ' ' + f(y);
        } else {
          // Different lines: from under the upper word to above the lower one.
          var up = ra.top < rb.top ? [x1, ra] : [x2, rb], lo = ra.top < rb.top ? [x2, rb] : [x1, ra];
          var y1 = up[1].bottom - base.top + 3, y2 = lo[1].top - base.top - 3, my = (y1 + y2) / 2;
          d = 'M' + f(up[0]) + ' ' + f(y1) + ' C' + f(up[0]) + ' ' + f(my) + ' ' + f(lo[0]) + ' ' + f(my) + ' ' + f(lo[0]) + ' ' + f(y2);
        }
        out += '<path d="' + d + '"/>';
      });
      linksSvg.innerHTML = out;
      $all('path', linksSvg).forEach(function (p) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = animate ? len : 0;
        if (animate) { void p.getBoundingClientRect(); p.style.strokeDashoffset = 0; }
      });
    };

    var finishStep = function (s) {
      s.classList.add('is-captioned');
      if (s.hasAttribute('data-pattern')) { sheet.classList.add('is-pattern'); drawLinks(!reduced()); }
      var precise = $('.sheet__precise', s);
      if (precise) precise.classList.add('is-done');
    };

    var reveal = function (i) {
      var s = steps[i];
      if (!s) return;
      s.hidden = false;
      if (reduced()) { finishStep(s); return; }
      s.classList.add('is-writing');
      timers.push(setTimeout(function () { finishStep(s); }, s._words * 75 + 300));
    };

    var updateButton = function () {
      if (!nextBtn) return;
      nextBtn.textContent = shown >= steps.length ? againLabel : nextLabel;
    };

    var reset = function () {
      timers.forEach(clearTimeout); timers = [];
      steps.forEach(function (s) { s.hidden = true; s.classList.remove('is-writing', 'is-captioned'); });
      sheet.classList.remove('is-pattern');
      $all('.sheet__precise', sheet).forEach(function (p) { p.classList.remove('is-done'); });
      if (linksSvg) linksSvg.innerHTML = '';
      shown = 0;
    };

    var showAll = function () {
      steps.forEach(function (s) { s.hidden = false; s.classList.remove('is-writing'); finishStep(s); });
      shown = steps.length;
      if (nextBtn) nextBtn.hidden = true;
    };

    // Reserve the finished page's height, so nothing below jumps while it writes.
    var reserve = function () {
      var hidden = steps.map(function (s) { return s.hidden; });
      sheet.style.minHeight = '';
      steps.forEach(function (s) { s.hidden = false; });
      sheet.style.minHeight = sheet.offsetHeight + 'px';
      steps.forEach(function (s, i) { s.hidden = hidden[i]; });
    };
    reserve();
    window.addEventListener('resize', reserve);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserve);

    if (reduced()) {
      showAll();
    } else {
      reset();
      updateButton();
      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          if (shown >= steps.length) { reset(); }
          reveal(shown); shown++;
          updateButton();
        });
      }
      // The first line writes itself when the page comes into view.
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting && shown === 0) { reveal(0); shown = 1; updateButton(); io.disconnect(); }
          });
        }, { threshold: .45 });
        io.observe(sheet);
      }
    }
    window.addEventListener('resize', function () { drawLinks(false); });
    motionQuery.addEventListener('change', function (e) { if (e.matches) showAll(); });
  }

  function bring(el) {
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* ---------------------------------------------------------------
     "The questions you don't ask yourself": going a layer deeper
     --------------------------------------------------------------- */
  $all('[data-qx]').forEach(function (qx) {
    var choices = $('.qx__choices', qx);
    var stage = $('.qx__stage', qx);
    var nextB = $('[data-qx-next]', qx);
    var deepB = $('[data-qx-deeper]', qx);
    var end = $('.qx__end', qx);
    var resetB = $('[data-qx-reset]', qx);
    var items = [], i = 0, lastChoice = null;

    function update() {
      var cur = items[i], deep = $('.qx__deep', cur);
      items.forEach(function (it, j) { it.classList.toggle('is-past', j < i); });
      deepB.hidden = !deep || !deep.hidden;
      nextB.hidden = i >= items.length - 1;
      end.hidden = i < items.length - 1;
      stage.classList.toggle('is-deep', cur.classList.contains('is-deep'));
    }

    choices.addEventListener('click', function (e) {
      var b = e.target.closest('[data-situation]');
      if (!b) return;
      lastChoice = b;
      var panel = $('[data-situation-panel="' + b.getAttribute('data-situation') + '"]', qx);
      $all('[data-situation-panel]', qx).forEach(function (p) { p.hidden = p !== panel; });
      items = $all('.qx__item', panel);
      items.forEach(function (it, j) {
        it.hidden = j > 0;
        it.classList.remove('is-past', 'is-deep');
        var d = $('.qx__deep', it); if (d) d.hidden = true;
      });
      i = 0;
      choices.hidden = true;
      stage.hidden = false;
      update();
      bring($('.qx__q', items[0]));
    });
    nextB.addEventListener('click', function () {
      if (i >= items.length - 1) return;
      i++;
      items[i].hidden = false;
      update();
      bring($('.qx__q', items[i]));
    });
    deepB.addEventListener('click', function () {
      var d = $('.qx__deep', items[i]);
      if (!d) return;
      d.hidden = false;
      items[i].classList.add('is-deep');
      update();
      bring(d);
    });
    resetB.addEventListener('click', function () {
      stage.hidden = true;
      choices.hidden = false;
      bring(lastChoice || $('button', choices));
    });
  });

  /* ---------------------------------------------------------------
     "Say it more precisely": from blurred to in focus
     --------------------------------------------------------------- */
  $all('[data-say]').forEach(function (say) {
    var s1 = $('[data-say-step="1"]', say), s2 = $('[data-say-step="2"]', say);
    var picked = $('.say__picked', say);
    var result = $('[data-say-result]', say), none = $('[data-say-none]', say);
    var buttons = $('.say__buttons', say), resetB = $('.say__reset', say);
    var vague = '';

    s1.addEventListener('click', function (e) {
      var b = e.target.closest('[data-word]');
      if (!b) return;
      vague = b.textContent.trim();
      picked.textContent = vague;
      var shown = null;
      $all('.say__options', say).forEach(function (o) {
        o.hidden = o.getAttribute('data-for') !== b.getAttribute('data-word');
        if (!o.hidden) shown = o;
      });
      s1.hidden = true; s2.hidden = false; resetB.hidden = false;
      bring($('button', shown));
    });
    s2.addEventListener('click', function (e) {
      var b = e.target.closest('.say__options button');
      if (!b) return;
      s2.hidden = true;
      var target = none;
      if (!b.hasAttribute('data-none')) {
        $('[data-slot="vague"]', result).textContent = vague;
        $('[data-slot="precise"]', result).textContent = b.textContent.trim();
        target = result;
      }
      target.classList.remove('is-focused');
      target.hidden = false;
      void target.offsetWidth;
      target.classList.add('is-focused');
      buttons.hidden = false;
      bring(target);
    });
    resetB.addEventListener('click', function () {
      result.hidden = true; none.hidden = true; buttons.hidden = true; s2.hidden = true; resetB.hidden = true;
      s1.hidden = false;
      bring($('button', s1));
    });
  });

  /* ---------------------------------------------------------------
     Feedback: F1–F3 first, the rest behind "Read all feedback (18)".
     Without JavaScript, all 18 simply show.
     --------------------------------------------------------------- */
  var more = $('[data-more]'), moreBtn = $('[data-more-toggle]');
  if (more && moreBtn) {
    more.hidden = true;
    moreBtn.hidden = false;
    moreBtn.addEventListener('click', function () {
      more.hidden = false;
      moreBtn.setAttribute('aria-expanded', 'true');
      moreBtn.hidden = true;
      var firstMore = $('.quote', more);
      if (firstMore) { firstMore.setAttribute('tabindex', '-1'); bring(firstMore); }
    });
  }

  /* ---------------------------------------------------------------
     Tools: the live demo in a device frame (desktop); new tab on phones
     --------------------------------------------------------------- */
  var demoDialog = $('#demo-dialog');
  var wide = window.matchMedia('(min-width: 900px) and (hover: hover)');
  if (demoDialog && typeof demoDialog.showModal === 'function') {
    var frame = $('iframe', demoDialog);
    var opener = null;
    $all('[data-demo]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (!wide.matches) return;            // phones: the link opens a new tab
        e.preventDefault();
        opener = a;
        if (!frame.getAttribute('src')) frame.setAttribute('src', frame.getAttribute('data-src'));
        demoDialog.showModal();
        document.body.classList.add('menu-open');
        $('[data-demo-close]', demoDialog).focus();
      });
    });
    $('[data-demo-close]', demoDialog).addEventListener('click', function () { demoDialog.close(); });
    demoDialog.addEventListener('click', function (e) { if (e.target === demoDialog) demoDialog.close(); });
    demoDialog.addEventListener('close', function () {
      document.body.classList.remove('menu-open');
      if (opener) opener.focus();
    });
  }

  /* ---------------------------------------------------------------
     "Where should you start?" a short conversation
     --------------------------------------------------------------- */
  $all('[data-chat]').forEach(function (chat) {
    var log = $('.chat__log', chat);
    var restart = $('.chat__restart', chat);

    function show(id, focus) {
      var tpl = $('template[data-step="' + id + '"]', chat);
      if (!tpl) return;
      log.appendChild(tpl.content.cloneNode(true));
      if (!focus) return;
      var target = $('.chip', log);
      var result = $('.result-card', log);
      if (result) { result.focus({ preventScroll: true }); result.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); }
      else if (target) target.focus({ preventScroll: true });
    }

    log.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      var opts = chip.closest('.chat__options');
      var me = document.createElement('p');
      me.className = 'bubble bubble--me';
      me.textContent = chip.textContent.trim();
      opts.parentNode.replaceChild(me, opts);
      if (restart) restart.hidden = false;
      var next = chip.getAttribute('data-next');
      if (reduced()) { show(next, true); return; }
      var typing = document.createElement('div');
      typing.className = 'chat__typing';
      typing.setAttribute('aria-hidden', 'true');
      typing.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(typing);
      setTimeout(function () { typing.remove(); show(next, true); }, 700);
    });

    if (restart) {
      restart.addEventListener('click', function () {
        log.innerHTML = '';
        restart.hidden = true;
        show('q1', true);
      });
    }
    show('q1', false);
  });
})();
