// NAXA — sélecteur de langue.
// Les pages sont désormais PRÉ-RENDUES par langue (FR = /, EN = /en/, AR = /ar/),
// donc plus de traduction côté client : le bouton mémorise la préférence puis
// navigue vers l'URL de la langue choisie (data-href injecté au build).
(function () {
  var KEY = 'naxa-lang';
  var SUPPORTED = ['fr', 'en', 'ar'];

  // Mémorise la langue de la page courante comme préférence utilisateur
  try {
    var cur = document.documentElement.lang;
    if (SUPPORTED.indexOf(cur) !== -1) localStorage.setItem(KEY, cur);
  } catch (e) {}

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.lang-btn') : null;
    if (!btn) return;
    e.preventDefault();
    var lang = btn.dataset.lang;
    var href = btn.dataset.href;
    try {
      if (SUPPORTED.indexOf(lang) !== -1) localStorage.setItem(KEY, lang);
    } catch (e2) {}
    if (href) window.location.href = href;
  });
})();
