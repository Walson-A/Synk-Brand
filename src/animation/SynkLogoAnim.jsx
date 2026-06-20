// SynkLogoAnim.jsx — reusable SYNK logo entrance animation.
// Self-contained timeline (plays once → holds, or loops). The "S" link draws
// from the centre, both rings outward, then a quick "click" snaps & locks the
// exact logo; optional wordmark + tagline rise. Recolours the logo client-side
// (canvas tint) so every palette is an exact, capturable image.
// Reads the shared white logo image data from ./logo-data.js.
// 'use client' — uses canvas + rAF, so render only on the client (Next.js).
// Click anywhere to replay.
'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import SYNK_LOGO from './logo-data.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
function interp(input, output, t) {
  if (t <= input[0]) return output[0];
  if (t >= input[input.length - 1]) return output[output.length - 1];
  for (let i = 0; i < input.length - 1; i++) {
    if (t >= input[i] && t <= input[i + 1]) {
      const span = input[i + 1] - input[i];
      const k = span === 0 ? 0 : (t - input[i]) / span;
      return output[i] + (output[i + 1] - output[i]) * easeOutCubic(k);
    }
  }
  return output[output.length - 1];
}

const TOP = { cx: 250, cy: 200, r: 80, from: 56.50, to: 372.90 };
const BOT = { cx: 250, cy: 300, r: 80, from: 243.21, to: 550.81 };
function pt(cx, cy, r, d) { const a = d * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
function arcPath(o) {
  const [x0, y0] = pt(o.cx, o.cy, o.r, o.from), [x1, y1] = pt(o.cx, o.cy, o.r, o.to);
  const large = (((o.to - o.from) % 360 + 360) % 360) > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${o.r} ${o.r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
const TOP_D = arcPath(TOP), BOT_D = arcPath(BOT);

// annular-sector reveal: the ring band between Ri..Ro, swept by angle. A clean
// radial start edge (no round-cap overshoot) means the start never spills onto
// the other ring; covers the full band width so no transparent sliver remains.
const RI = 69, RO = 105;
function sectorPath(o, a0, a1) {
  if (Math.abs(a1 - a0) < 0.4) return '';
  const large = (((a1 - a0) % 360 + 360) % 360) > 180 ? 1 : 0;
  const [ox0, oy0] = pt(o.cx, o.cy, RO, a0), [ox1, oy1] = pt(o.cx, o.cy, RO, a1);
  const [ix1, iy1] = pt(o.cx, o.cy, RI, a1), [ix0, iy0] = pt(o.cx, o.cy, RI, a0);
  return `M ${ox0.toFixed(2)} ${oy0.toFixed(2)} A ${RO} ${RO} 0 ${large} 1 ${ox1.toFixed(2)} ${oy1.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${RI} ${RI} 0 ${large} 0 ${ix0.toFixed(2)} ${iy0.toFixed(2)} Z`;
}

const T_START = 0.9, T_DRAW = 2.32, T_HOLD = 2.32, T_SNAP = 2.54;
const WORD_BASE = T_HOLD + 0.35, TAG_BASE = T_HOLD + 1.0;
const CONTENT_END = TAG_BASE + 0.7, LOOP_CYCLE = TAG_BASE + 0.7 + 1.4;

const PALETTES = {
  'white-dark': { bg: '#0a0a0a', fill: '#ffffff', grad: null, word: '#ededed', tag: '#a3a3a3', glow: '108,99,255', aura: 0.15 },
  'violet':     { bg: '#0a0a0a', fill: '#6C63FF', grad: null, word: '#ededed', tag: '#a3a3a3', glow: '108,99,255', aura: 0.16 },
  'gradient':   { bg: '#0a0a0a', fill: null, grad: ['#6C63FF', '#8B5CF6'], word: '#ededed', tag: '#a3a3a3', glow: '124,95,250', aura: 0.16 },
  'dark-light': { bg: '#f4f3ee', fill: '#161616', grad: null, word: '#161616', tag: '#6b6b6b', glow: '108,99,255', aura: 0.05 },
  'mono':       { bg: '#0a0a0a', fill: '#ffffff', grad: null, word: '#ffffff', tag: '#8a8a8a', glow: '255,255,255', aura: 0.04 },
  'rose':       { bg: '#0a0a0a', fill: '#FF6FA5', grad: null, word: '#f5dbe7', tag: '#c98aa6', glow: '255,111,165', aura: 0.16 },
  'gris':       { bg: '#15151a', fill: '#c9cdd3', grad: null, word: '#d8dbe0', tag: '#888d96', glow: '200,204,210', aura: 0.05 },
};
const BG_OVERRIDE = { transparent: 'transparent', dark: '#0a0a0a', violet: '#6C63FF', light: '#f4f3ee' };

function loadImg(src) {
  return new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
}
function tint(img, P) {
  const c = document.createElement('canvas'); c.width = 500; c.height = 500;
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0, 500, 500);
  x.globalCompositeOperation = 'source-in';
  if (P.grad) { const g = x.createLinearGradient(80, 80, 420, 420); g.addColorStop(0, P.grad[0]); g.addColorStop(1, P.grad[1]); x.fillStyle = g; }
  else x.fillStyle = P.fill;
  x.fillRect(0, 0, 500, 500);
  return c.toDataURL('image/png');
}

function SynkLogoAnim(props) {
  const palette = props.palette || 'white-dark';
  const P = PALETTES[palette] || PALETTES['white-dark'];
  const showWordmark = props.showWordmark !== false && props.showWordmark !== 'false';
  const showTagline = (props.showTagline === true || props.showTagline === 'true') && showWordmark;
  const loop = props.loop === true || props.loop === 'true';
  const markSize = Number(props.markSize) || 300;
  const tagText = props.tagText || 'Réservez votre studio';
  const bg = (props.background && props.background !== 'auto') ? (BG_OVERRIDE[props.background] || props.background) : P.bg;

  const WHITE = SYNK_LOGO || { full: '', top: '', bot: '' };
  const uid = useMemo(() => 'sl' + Math.random().toString(36).slice(2, 8), []);

  // recolour the three white logo images for this palette (once per palette)
  const [imgs, setImgs] = useState(null);
  useEffect(() => {
    let dead = false;
    (async () => {
      const [f, tp, bt] = await Promise.all([loadImg(WHITE.full), loadImg(WHITE.top), loadImg(WHITE.bot)]);
      if (dead || !f) return;
      setImgs({ full: tint(f, P), top: tp && tint(tp, P), bot: bt && tint(bt, P) });
    })();
    return () => { dead = true; };
  }, [palette]);
  const I = imgs || WHITE;

  const [t, setT] = useState(0);
  const [replay, setReplay] = useState(0);
  const raf = useRef(null), last = useRef(null);
  useEffect(() => {
    last.current = null;
    const step = (ts) => {
      if (last.current == null) last.current = ts;
      const dt = (ts - last.current) / 1000; last.current = ts;
      setT((prev) => { let n = prev + dt; if (loop) { if (n >= LOOP_CYCLE) n = 0; } else if (n >= CONTENT_END) n = CONTENT_END; return n; });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [loop, replay]);

  let p;
  if (t < T_START) p = 0;
  else if (t < T_DRAW) { const x = (t - T_START) / (T_DRAW - T_START); p = 0.85 * (0.68 * x + 0.32 * (1 - (1 - x) * (1 - x))); }
  else if (t < T_HOLD) p = 0.85;
  else if (t < T_SNAP) p = 0.85 + 0.15 * easeOutCubic((t - T_HOLD) / (T_SNAP - T_HOLD));
  else p = 1;

  const pop = interp([T_HOLD - 0.06, T_HOLD, T_SNAP - 0.02, T_SNAP + 0.13, T_SNAP + 0.36], [1, 0.99, 1.035, 0.993, 1], t);
  const breathe = t > T_SNAP + 0.45 ? Math.sin((t - T_SNAP - 0.45) * 1.5) * 0.005 : 0;
  const markScale = pop + breathe;
  const drawGlow = clamp((t - T_START) / 0.6, 0, 1) * 0.4;
  const flash = interp([T_SNAP - 0.14, T_SNAP + 0.03, T_SNAP + 0.5], [0, 1, 0.45], t);
  const glowPx = (10 + drawGlow * 16 + flash * 46) * (markSize / 300);
  const glowA = 0.3 + flash * 0.45;
  const sheen = interp([T_SNAP - 0.1, T_SNAP, T_SNAP + 0.26], [0, 0.5, 0], t);
  const lockFull = clamp((t - T_SNAP) / 0.14, 0, 1);
  const bgUp = clamp(t / 0.8, 0, 1);
  const flarePulse = interp([T_HOLD - 0.1, T_SNAP + 0.03, T_SNAP + 0.6], [0, 1, 0.5], t);

  const MW = 62; // (legacy) reveal stroke width — kept for the click sheen
  const topSec = sectorPath(TOP, TOP.from, TOP.from + (TOP.to - TOP.from) * p);
  const botSec = sectorPath(BOT, BOT.from, BOT.from + (BOT.to - BOT.from) * p);
  const letters = 'SYNK'.split('');
  const wordFont = markSize * 0.42, tagFont = Math.max(9, markSize * 0.052);

  const mark = React.createElement('div', {
    style: { position: 'relative', transform: `scale(${markScale})`, transformOrigin: 'center', filter: `drop-shadow(0 0 ${glowPx}px rgba(${P.glow},${glowA}))`, willChange: 'transform, filter' }
  },
    React.createElement('svg', { width: markSize, height: markSize, viewBox: '0 0 500 500', style: { display: 'block', overflow: 'visible' } },
      React.createElement('defs', null,
        React.createElement('mask', { id: `rev-${uid}`, maskUnits: 'userSpaceOnUse', x: -40, y: -40, width: 580, height: 580 },
          React.createElement('rect', { x: -40, y: -40, width: 580, height: 580, fill: '#000' }),
          topSec && React.createElement('path', { d: topSec, fill: '#fff' }),
          botSec && React.createElement('path', { d: botSec, fill: '#fff' }))
      ),
      React.createElement('image', { href: I.full, x: 0, y: 0, width: 500, height: 500, mask: `url(#rev-${uid})`, opacity: 1 - lockFull }),
      React.createElement('image', { href: I.full, x: 0, y: 0, width: 500, height: 500, opacity: lockFull }),
      sheen > 0.001 && React.createElement('path', { d: TOP_D, fill: 'none', stroke: '#fff', strokeWidth: 48, strokeLinecap: 'round', opacity: sheen }),
      sheen > 0.001 && React.createElement('path', { d: BOT_D, fill: 'none', stroke: '#fff', strokeWidth: 48, strokeLinecap: 'round', opacity: sheen })
    )
  );

  const tagP = easeOutCubic(clamp((t - TAG_BASE) / 0.7, 0, 1));

  return React.createElement('div', {
    onClick: () => { setT(0); last.current = null; setReplay((r) => r + 1); },
    style: { position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' }
  },
    React.createElement('div', { style: { position: 'absolute', inset: 0, opacity: bgUp, background: `radial-gradient(${markSize * 1.9}px ${markSize * 1.9}px at 50% 48%, rgba(${P.glow},${P.aura + 0.12 * flarePulse}), transparent 70%)`, pointerEvents: 'none' } }),
    React.createElement('div', { style: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      mark,
      showWordmark && React.createElement('div', { style: { marginTop: markSize * 0.12, display: 'flex', gap: 2 } },
        letters.map((ch, i) => {
          const e = easeOutCubic(clamp((t - (WORD_BASE + i * 0.09)) / 0.5, 0, 1));
          return React.createElement('span', { key: i, style: { display: 'inline-block', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900, fontSize: wordFont, letterSpacing: '0.04em', color: P.word, lineHeight: 1, opacity: e, transform: `translateY(${(1 - e) * (markSize * 0.085)}px)`, willChange: 'transform, opacity' } }, ch);
        })
      ),
      showTagline && React.createElement('div', { style: { marginTop: markSize * 0.06, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: tagFont, letterSpacing: '0.42em', textTransform: 'uppercase', color: P.tag, whiteSpace: 'nowrap', paddingLeft: '0.42em', opacity: tagP, transform: `translateY(${(1 - tagP) * 10}px)` } }, tagText)
    )
  );
}

export { SynkLogoAnim };
export default SynkLogoAnim;
