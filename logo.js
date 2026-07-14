/* logo.js — blendet das Logo aus, wenn assets/logo.png fehlt.
 * Als externes Skript ausgelagert, damit die Content-Security-Policy ohne
 * 'unsafe-inline' auskommt (kein Inline-onerror im HTML nötig).
 */
(function () {
  "use strict";
  var img = document.getElementById("site-logo");
  if (!img) return;
  img.addEventListener("error", function () { img.remove(); });
  // Falls das Bild schon vor dem Laden dieses Skripts fehlgeschlagen ist:
  if (img.complete && img.naturalWidth === 0) img.remove();
})();
