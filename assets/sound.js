/* DIRBALK — assets/sound.js
   Small interface sounds, made in the browser with Web Audio (no audio files,
   nothing to download, nothing for the CSP to block).

   Use:  if (window.DirbalkSound) DirbalkSound.play('add');
   Names:
     tick    choosing a colour / size, + / − in the cart   (barely there)
     add     added to cart                                  (two soft rising notes)
     save    saved to wishlist                              (one light note)
     remove  removed from cart                              (one falling note)
     done    order placed / joined the list                 (three warm notes)
   add / save / remove / done also give a tiny vibration on Android phones.

   Rules this file keeps:
   - Sounds only answer a tap. Nothing plays on page load, scroll or hover.
   - No sound for errors: the message on screen is enough, a buzz feels like a scold.
   - On iPhone the silent switch is respected (audioSession "ambient").
   - Anyone can turn sound off from the footer; the choice is remembered. */
(function () {
  var KEY = 'dirbalk_sound';
  var MASTER = 0.16;          // overall loudness, 0–1. Keep it low.
  var ctx = null, out = null;

  function enabled() {
    try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; }
  }
  function setEnabled(on) {
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
    paintToggles();
  }

  function audio() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch (e) {}
    ctx = new AC();
    /* a gentle low-pass keeps every note round, never sharp */
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200;
    out = ctx.createGain(); out.gain.value = MASTER;
    out.connect(lp); lp.connect(ctx.destination);
    return ctx;
  }

  /* one soft plucked note: sine body + a quiet octave for warmth */
  function note(freq, at, len, vol) {
    var t = ctx.currentTime + (at || 0), v = vol == null ? 1 : vol;
    [[1, 1], [2, 0.18]].forEach(function (h) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq * h[0];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v * h[1], t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + len + 0.05);
    });
  }
  /* a tiny filtered click, like a fingertip on fabric */
  function click(vol) {
    var len = 0.03, n = Math.floor(ctx.sampleRate * len);
    var buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 4);
    var s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.2;
    g.gain.value = vol;
    s.buffer = buf; s.connect(bp); bp.connect(g); g.connect(out); s.start();
  }

  var SOUNDS = {
    tick:   function () { click(0.55); },
    add:    function () { note(659.25, 0, 0.22, 0.7); note(987.77, 0.075, 0.32, 0.6); },          // E5 → B5
    save:   function () { note(880, 0, 0.28, 0.5); },                                              // A5
    remove: function () { note(587.33, 0, 0.16, 0.45); note(440, 0.06, 0.26, 0.4); },             // D5 → A4
    done:   function () { note(523.25, 0, 0.5, 0.55); note(659.25, 0.11, 0.55, 0.5); note(783.99, 0.22, 0.9, 0.5); } // C–E–G
  };

  /* a small buzz on Android with the important sounds (iPhone browsers don't allow vibration) */
  var BUZZ = { add: 14, save: 8, remove: 10, done: [16, 70, 26] };
  function buzz(name) {
    try { if (BUZZ[name] && navigator.vibrate) navigator.vibrate(BUZZ[name]); } catch (e) {}
  }

  var last = {};
  function play(name) {
    if (!enabled() || !SOUNDS[name]) return;
    var now = Date.now();
    if (last[name] && now - last[name] < 60) return;   // no machine-gun on double taps
    last[name] = now;
    buzz(name);
    try { if (audio()) SOUNDS[name](); } catch (e) { /* sound must never break the page */ }
  }

  /* ---------- footer switch: "Sound on / off" ---------- */
  function paintToggles() {
    var on = enabled();
    Array.prototype.forEach.call(document.querySelectorAll('[data-sound-toggle]'), function (b) {
      b.textContent = on ? 'Sound on' : 'Sound off';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-sound-toggle]');
    if (!b) return;
    var on = !enabled();
    setEnabled(on);
    if (on) play('tick');
  });
  var css = document.createElement('style');
  css.textContent = '.sound-toggle{background:none;border:0;padding:0;margin-left:14px;font:inherit;color:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px}'
    + '.sound-toggle:hover{color:var(--amber,#C9A84C)}';
  document.head.appendChild(css);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paintToggles); else paintToggles();

  window.DirbalkSound = { play: play, enabled: enabled, setEnabled: setEnabled, refresh: paintToggles };
})();
