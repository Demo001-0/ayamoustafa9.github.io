/* ==========================================================================
   Aya Moustafa — the ONE shared source for every page (English and Arabic).

   Change things here once and every page updates:
   - PRICES and the two dates in the price note
   - links (Calendly, WhatsApp, Tally, social)
   - the menu, the header, the phone menu, the footer
   - the small lines under every "Book a free call" button

   Each page loads this file right after <body>. The header is drawn
   immediately (so it never flickers). The footer, contacts, prices and
   booking lines are filled in by AyaLayout.fill(), which site.js calls.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- PRICES: edit here (Western digits, as written on the site) ---------- */
  var PRICES = {
    weekly: '250',      // weekly group, per Thursday
    single: '400',      // single session, per hour
    monthly: '2,500'    // monthly coaching, per month
  };
  var PRICE_DATES = {
    offerUntil: { en: '30 November 2026', ar: '30 نوفمبر 2026' },
    priceUpdate: { en: 'January 2027', ar: 'يناير 2027' }
  };

  /* ---------- Links ---------- */
  var LINKS = {
    calendly: 'https://calendly.com/ayamoustafa9/clarity-call-with-aya-moustafa',
    whatsapp: 'https://wa.me/201055899872',
    tally: 'https://tally.so/r/mYlrZd',
    instagram: 'https://instagram.com/aya.moustafa9',
    linkedin: 'https://www.linkedin.com/in/ayamoustafa9/',
    youtube: 'https://www.youtube.com/@ayamoustafa99',
    email: 'mailto:dreamcareervision@gmail.com'
  };

  /* ---------- Pages (Arabic pages live under ar/) ---------- */
  var PAGES = [
    { key: 'home',      path: '',                menu: false, en: 'Home',           ar: 'الرئيسية' },
    { key: 'how',       path: 'how-it-works/',   menu: true,  en: 'How it works',   ar: 'الجلسة بتمشي إزاي' },
    { key: 'exercises', path: 'free-exercises/', menu: true,  en: 'Free exercises', ar: 'تمارين مجانية' },
    { key: 'weekly',    path: 'weekly-group/',   menu: true,  en: 'Weekly group',   ar: 'المساحة الأسبوعية' },
    { key: 'prices',    path: 'prices/',         menu: true,  en: 'Prices',         ar: 'الأسعار' },
    { key: 'tools',     path: 'tools/',          menu: true,  en: 'Tools',          ar: 'الأدوات' },
    { key: 'about',     path: 'about/',          menu: true,  en: 'About',          ar: 'عنّي' },
    { key: 'feedback',  path: 'feedback/',       menu: false, en: 'Feedback',       ar: 'الآراء' }
  ];

  /* ---------- Interface words ---------- */
  var T = {
    en: {
      skip: 'Skip to content', home: 'Aya Moustafa, home', name: 'Aya Moustafa', mainNav: 'Main', footerNav: 'Footer',
      menu: 'Menu', close: 'Close', other: 'العربية', otherLang: 'ar',
      book: 'Book a free call', newTab: ' (opens in a new tab)',
      bookNote: 'Free · 30–45 minutes · online · Arabic or English · no pressure',
      bookWa: 'or message me on WhatsApp',
      waText: "Hi Aya, I'd like to book a free call.",
      mottoAr: 'اسعى للّي تستاهله، مش اللي سهل توصله',
      mottoEn: 'Strive for what you deserve, not what’s easy to reach.',
      copyright: '© 2026 Aya Moustafa'
    },
    ar: {
      skip: 'روح للمحتوى', home: 'آية مصطفى، الرئيسية', name: 'آية مصطفى', mainNav: 'القايمة الرئيسية', footerNav: 'روابط الموقع',
      menu: 'القايمة', close: 'اقفل', other: 'English', otherLang: 'en',
      book: 'احجز مكالمة مجانية', newTab: ' (بيفتح في صفحة جديدة)',
      bookNote: 'مجانية · من 30 لـ 45 دقيقة · أونلاين · بالعربي أو بالإنجليزي · من غير أي ضغط',
      bookWa: 'أو ابعتلي على واتساب',
      waText: 'أهلًا آية، حابب أحجز مكالمة مجانية.',
      mottoAr: 'اسعى للّي تستاهله، مش اللي سهل توصله',
      mottoEn: '',
      copyright: '© 2026 آية مصطفى'
    }
  };

  /* ---------- Contacts (shown left to right on both languages) ---------- */
  var CONTACTS = [
    { icon: 'whatsapp',  href: LINKS.whatsapp,  label: { en: 'WhatsApp', ar: 'واتساب' },     value: '+20 10 55899872' },
    { icon: 'instagram', href: LINKS.instagram, label: { en: 'Instagram', ar: 'إنستجرام' },  value: '@aya.moustafa9' },
    { icon: 'linkedin',  href: LINKS.linkedin,  label: { en: 'LinkedIn', ar: 'لينكدإن' },    value: 'ayamoustafa9' },
    { icon: 'youtube',   href: LINKS.youtube,   label: { en: 'YouTube', ar: 'يوتيوب' },     value: '@ayamoustafa99' },
    { icon: 'mail',      href: LINKS.email,     label: { en: 'Email', ar: 'إيميل' },        value: 'dreamcareervision@gmail.com' }
  ];

  var ICONS =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
    '<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M20.5 11.6a8.6 8.6 0 0 1-12.7 7.6L3.5 20.5l1.4-4.1a8.6 8.6 0 1 1 15.6-4.8z"/><path d="M9 8.3c.3-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .5a6.3 6.3 0 0 0 2.5 2.4c.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5v.4c0 .4-.2.7-.5.9-.6.4-1.5.6-2.4.3a7.8 7.8 0 0 1-5.1-5.1c-.3-.9-.1-1.7.5-2.5z"/></symbol>' +
    '<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/></symbol>' +
    '<symbol id="i-linkedin" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5v6M8 7.6v.1M11.5 16.5v-6M11.5 13.2c0-1.6.9-2.7 2.3-2.7 1.3 0 2.2.9 2.2 2.6v3.4"/></symbol>' +
    '<symbol id="i-youtube" viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.3 9.4v5.2l4.4-2.6z"/></symbol>' +
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.6 6.6 12 13l8.4-6.4"/></symbol>' +
    '</svg>';

  /* ======================================================================
     Nothing below needs editing for content changes.
     ====================================================================== */
  var script = document.currentScript;
  var ROOT = new URL('..', script.src).href;              // the site's top folder
  var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  var t = T[lang];
  var pageKey = document.body.getAttribute('data-page') || 'home';
  var page = PAGES.filter(function (p) { return p.key === pageKey; })[0] || PAGES[0];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function url(p, l) { return ROOT + ((l || lang) === 'ar' ? 'ar/' : '') + p.path; }
  function cur(p) { return p.key === pageKey ? ' aria-current="page"' : ''; }
  function waUrl() { return LINKS.whatsapp + '?text=' + encodeURIComponent(t.waText); }
  function newTab() { return ' target="_blank" rel="noopener"'; }
  function hiddenNewTab() { return '<span class="visually-hidden">' + esc(t.newTab) + '</span>'; }
  var otherUrl = url(page, t.otherLang);

  function bookExtras(withWa) {
    // Two balanced halves: one line each on phones, side by side on wider screens.
    var parts = t.bookNote.split(' · ');
    var half = function (arr) { return arr.map(function (s) { return esc(s).replace(/ /g, '&nbsp;'); }).join(' · '); };
    var note = '<span class="book__half">' + half(parts.slice(0, 3)) + '</span>' +
      '<span class="book__sep"> · </span>' +
      '<span class="book__half">' + half(parts.slice(3)) + '</span>';
    return '<span class="book__note">' + note + '</span>' +
      (withWa ? '<a class="book__wa" href="' + esc(waUrl()) + '"' + newTab() + '>' + esc(t.bookWa) + hiddenNewTab() + '</a>' : '');
  }
  function bookBlock(cls) {
    return '<span class="book">' +
      '<a class="btn ' + (cls || '') + '" href="' + LINKS.calendly + '"' + newTab() + '>' + esc(t.book) + hiddenNewTab() + '</a>' +
      bookExtras(true) + '</span>';
  }
  function contactsHtml() {
    return '<ul class="contacts">' + CONTACTS.map(function (c) {
      var ext = c.icon === 'mail' ? '' : newTab();
      return '<li><a href="' + esc(c.href) + '"' + ext + ' aria-label="' + esc(c.label[lang] + ': ' + c.value) + '">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-' + c.icon + '"/></svg>' +
        '<span dir="ltr">' + esc(c.value) + '</span></a></li>';
    }).join('') + '</ul>';
  }
  function straightThread() {
    return '<div class="thread" aria-hidden="true"><svg viewBox="0 0 1000 40" preserveAspectRatio="none" focusable="false"><path d="M0 20H1000"/></svg></div>';
  }

  /* ---------- Header + phone menu: drawn right away ---------- */
  var menuLinks = PAGES.filter(function (p) { return p.menu; });
  var header =
    ICONS +
    '<a class="skip-link" href="#main">' + esc(t.skip) + '</a>' +
    '<header class="site-header' + (pageKey === 'home' ? ' cta-hidden' : '') + '"><div class="wrap site-header__inner">' +
      '<a class="brand" href="' + url(PAGES[0]) + '" aria-label="' + esc(t.home) + '"><img src="' + ROOT + 'assets/logo-green.png" alt="' + esc(t.name) + '" width="295" height="178"></a>' +
      '<nav class="nav" aria-label="' + esc(t.mainNav) + '"><ul>' +
        menuLinks.map(function (p) { return '<li><a href="' + url(p) + '"' + cur(p) + '>' + esc(p[lang]) + '</a></li>'; }).join('') +
      '</ul></nav>' +
      '<a class="lang-link" href="' + otherUrl + '" hreflang="' + t.otherLang + '" lang="' + t.otherLang + '">' + esc(t.other) + '</a>' +
      '<a class="btn header-cta" href="' + LINKS.calendly + '"' + newTab() + '>' + esc(t.book) + hiddenNewTab() + '</a>' +
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-close-label="' + esc(t.close) + '">' + esc(t.menu) + '</button>' +
    '</div></header>' +
    '<nav id="mobile-menu" class="mobile-menu" aria-label="' + esc(t.mainNav) + '" hidden>' +
      straightThread() +
      '<ul>' + PAGES.map(function (p) { return '<li><a href="' + url(p) + '"' + cur(p) + '>' + esc(p[lang]) + '</a></li>'; }).join('') + '</ul>' +
      '<div class="mobile-menu__foot">' + bookBlock('') +
        '<a class="lang-link" href="' + otherUrl + '" hreflang="' + t.otherLang + '" lang="' + t.otherLang + '">' + esc(t.other) + '</a>' +
      '</div>' +
    '</nav>';
  script.insertAdjacentHTML('afterend', header);

  /* ---------- Footer, contacts, prices, booking lines ---------- */
  function footerHtml() {
    // The About page closes with the motto shown large, so its footer leaves it out.
    var motto = pageKey === 'about' ? '' :
      // Two even halves, split after the comma (one line on wider screens).
      '<p class="motto"><span class="motto__ar" dir="rtl" lang="ar">' +
        t.mottoAr.split('، ').map(function (s, i, a) { return '<span class="motto__half">' + esc(s) + (i < a.length - 1 ? '،' : '') + '</span>'; }).join(' ') +
      '</span>' +
        (t.mottoEn ? '<span class="motto__en" dir="ltr" lang="en">' + esc(t.mottoEn) + '</span>' : '') + '</p>';
    return '<div class="wrap">' + motto +
      '<div class="footer-grid">' +
        '<nav aria-label="' + esc(t.footerNav) + '"><ul class="footer-links">' +
          PAGES.map(function (p) { return '<li><a href="' + url(p) + '"' + cur(p) + '>' + esc(p[lang]) + '</a></li>'; }).join('') +
        '</ul></nav>' +
        contactsHtml() +
      '</div>' +
      '<div class="footer-base">' +
        '<a class="footer-logo" href="' + url(PAGES[0]) + '" aria-label="' + esc(t.home) + '"><img src="' + ROOT + 'assets/logo-light.png" alt="' + esc(t.name) + '" width="295" height="178"></a>' +
        '<p class="copyright">' + esc(t.copyright) + '</p>' +
      '</div>' +
    '</div>';
  }

  // Under a Book button: the small line, then the WhatsApp link.
  function decorateBook(a) {
    if (a.closest('.book')) return;
    a.href = LINKS.calendly;
    var wrap = document.createElement('span');
    wrap.className = 'book';
    a.parentNode.insertBefore(wrap, a);
    wrap.appendChild(a);
    wrap.insertAdjacentHTML('beforeend', bookExtras(a.getAttribute('data-book') !== 'no-wa'));
  }

  function fill(rootEl) {
    var scope = rootEl || document;
    scope.querySelectorAll('[data-book]').forEach(decorateBook);
    scope.querySelectorAll('[data-price]').forEach(function (el) {
      var v = PRICES[el.getAttribute('data-price')]; if (v) el.textContent = v;
    });
    scope.querySelectorAll('[data-price-date]').forEach(function (el) {
      var v = PRICE_DATES[el.getAttribute('data-price-date')]; if (v) el.textContent = v[lang];
    });
    scope.querySelectorAll('[data-link]').forEach(function (el) {
      var v = LINKS[el.getAttribute('data-link')]; if (v) el.href = v;
    });
    scope.querySelectorAll('[data-contacts]').forEach(function (el) { el.outerHTML = contactsHtml(); });
    // A small "Book a free call" link on the back of each card.
    scope.querySelectorAll('.flip__back').forEach(function (back) {
      if (back.querySelector('.card-book')) return;
      back.insertAdjacentHTML('beforeend', '<p class="card-book"><a href="' + LINKS.calendly + '"' + newTab() + '>' + esc(t.book) + hiddenNewTab() + '</a></p>');
    });
    // Templates (for example the chooser's result cards) are filled too.
    scope.querySelectorAll('template').forEach(function (tpl) { fill(tpl.content); });
    if (scope === document) {
      var f = document.querySelector('[data-site-footer]');
      if (f && !f.children.length) f.innerHTML = footerHtml();
    }
  }

  window.AyaLayout = { fill: fill, lang: lang };
})();
