/*
 * track.js — the bar-for-* visit beacon.
 *
 * Loaded cross-origin by every bar-for-<slug>.vercel.app site via:
 *   <script src="https://bar-for-companies.vercel.app/track.js"
 *           data-bar-for-id="<slug>" defer></script>
 *
 * On first load of a browser session it reports one visit to the gallery's
 * /api/hits, which bumps that slug's counter in Redis. The logic lives here (one
 * place) so behaviour can change by redeploying only the gallery — the ~99 sites
 * never need to be touched again.
 *
 * Everything is wrapped so a failure can never break the host page.
 */
(function () {
  try {
    var el = document.currentScript ||
      document.querySelector('script[data-bar-for-id]');
    if (!el) return;

    var id = el.getAttribute('data-bar-for-id');
    if (!id) return;

    // Report to whichever gallery origin served this script (prod, preview, or
    // localhost) — no hardcoded URL.
    var origin;
    try {
      origin = new URL(el.src, window.location.href).origin;
    } catch (e) {
      return;
    }

    // Count once per browser session: a refresh or back-nav within the session
    // does not re-report. A new tab/session later counts again.
    var key = 'bm:seen:' + id;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch (e) {
      // Private mode / storage disabled: fall through and count this load.
    }

    var url = origin + '/api/hits';
    var body = JSON.stringify({ id: id });
    try {
      fetch(url, {
        method: 'POST',
        keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: body,
      }).catch(function () {});
    } catch (e) {
      // no-op
    }
  } catch (e) {
    // never let tracking throw into the host page
  }
})();
