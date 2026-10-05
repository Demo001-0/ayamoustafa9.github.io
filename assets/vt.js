/* Language switch: a mirrored page change, only between the English and
   Arabic version of a page. Every other page change stays normal.
   Runs early (in <head>) so the incoming page can join the transition. */
(function () {
  function isAr(url) { return /\/ar(\/|$)/.test(new URL(url, location.href).pathname); }

  window.addEventListener('pageswap', function (e) {
    if (!e.viewTransition) return;
    var to = e.activation && e.activation.entry && e.activation.entry.url;
    if (!to || isAr(to) === isAr(location.href)) { e.viewTransition.skipTransition(); return; }
    e.viewTransition.types.add(isAr(to) ? 'to-ar' : 'to-en');
  });

  window.addEventListener('pagereveal', function (e) {
    if (!e.viewTransition) return;
    var act = window.navigation && navigation.activation;
    var from = act && act.from && act.from.url;
    if (!from || isAr(from) === isAr(location.href)) { e.viewTransition.skipTransition(); return; }
    e.viewTransition.types.add(isAr(location.href) ? 'to-ar' : 'to-en');
  });
})();
