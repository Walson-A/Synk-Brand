// SynkLogoAnim.native.jsx — animation d'entrée du logo SYNK (React Native).
//
// Calque la version web de marque (Claude Design) : une lueur violette éclôt au
// centre → les deux anneaux se tracent (stroke-dash) → snap (rebond d'échelle +
// flash + éclat blanc « sheen ») → « SYNK » révélé lettre par lettre → tagline.
// Stack portable : react-native-svg + reanimated, propriétés portables uniquement
// (zéro filtre CSS → rendu identique iOS/Android ; le glow est un dégradé radial doux).
//
// Usage (recommandé) — dans l'overlay de splash de l'app, par-dessus PremiumBackground :
//   import { SynkLogoAnim, SYNK_SPLASH_DURATION } from '@synk/brand/animation/native';
//   // <SynkLogoAnim size={170} showWordmark showTagline />
//   // SYNK_SPLASH_DURATION (ms) = durée totale → durée min d'affichage de l'overlay
//   // (garder le splash tant que l'anim n'a pas joué en entier).
//
// Ou autonome via l'overlay plein écran (export par défaut) :
//   import SynkSplash from '@synk/brand/animation/native';
//   <SynkSplash ready={appReady} onFinish={() => SplashScreen.hideAsync()} />
import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedProps, useAnimatedStyle,
  withTiming, withDelay, withSequence, Easing, runOnJS,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ── géométrie (viewBox 500), identique au master web/brand ──
const R = 84;
const TOP = { cx: 250, cy: 198, from: 52.5, to: 376.9 };
const BOT = { cx: 250, cy: 302, from: 239.21, to: 554.81 };
const SW = 24;
function pt(cx, cy, r, deg) { const a = (deg * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
function arcD(o) {
  const [x0, y0] = pt(o.cx, o.cy, R, o.from), [x1, y1] = pt(o.cx, o.cy, R, o.to);
  const large = (((o.to - o.from) % 360 + 360) % 360) > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
const TOP_D = arcD(TOP), BOT_D = arcD(BOT);
const arcLen = (o) => (R * (Math.abs(o.to - o.from) * Math.PI)) / 180;
const TOP_LEN = arcLen(TOP), BOT_LEN = arcLen(BOT);

const EASE = Easing.bezier(0.16, 1, 0.3, 1); // ease-out SYNK

// ── timeline (ms) : genèse → tracé → snap → wordmark → tagline ──
const GENESIS = 550, DRAW = 1500;
const SNAP_AT = GENESIS + DRAW - 100;
const WORD_AT = GENESIS + DRAW + 110;
const TAG_AT = GENESIS + DRAW + 480;
const TAG_DUR = 700;
// Durée totale de l'anim (ms) — à utiliser comme durée minimale d'affichage du splash.
export const SYNK_SPLASH_DURATION = TAG_AT + TAG_DUR; // ≈ 3230 ms

const WORD_LETTERS = ['S', 'Y', 'N', 'K'];
const LETTER_STAGGER = 90; // ms entre chaque lettre

export function SynkLogoAnim({
  size = 150,
  color = '#ffffff',
  glow = '108,99,255',   // rgb du halo radial, ou `false` pour le désactiver
  showWordmark = true,
  showTagline = false,
  tagText = 'Réserve ton studio',
  wordColor = '#ededed',
  tagColor = '#c8ccd8',  // tagline éclaircie vs textMid (#a3a3a3) pour la lisibilité
  onFinish,
}) {
  const spark = useSharedValue(0);      // lueur de genèse
  const p = useSharedValue(0);          // progression du tracé des anneaux
  const markScale = useSharedValue(1);  // ressort d'échelle au verrouillage (snap)
  const flash = useSharedValue(0);      // flash du glow au verrouillage
  const sheen = useSharedValue(0);      // éclat blanc bref sur les anneaux au snap
  // wordmark révélé lettre par lettre (S, Y, N, K)
  const l0 = useSharedValue(0), l1 = useSharedValue(0), l2 = useSharedValue(0), l3 = useSharedValue(0);
  const tagO = useSharedValue(0);

  useEffect(() => {
    // genèse : la lueur monte vite puis se calme
    spark.value = withSequence(
      withTiming(1, { duration: Math.round(GENESIS * 0.7), easing: EASE }),
      withTiming(0.5, { duration: Math.round(GENESIS * 0.6), easing: EASE }),
    );
    // tracé des anneaux (après la genèse)
    p.value = withDelay(GENESIS, withTiming(1, { duration: DRAW, easing: EASE }));
    // snap : ressort (anticipation → overshoot → petit creux → settle à 1)
    markScale.value = withDelay(SNAP_AT, withSequence(
      withTiming(0.99, { duration: 60, easing: EASE }),
      withTiming(1.035, { duration: 110, easing: EASE }),
      withTiming(0.993, { duration: 120, easing: EASE }),
      withTiming(1, { duration: 200, easing: EASE }),
    ));
    // flash : pic de glow au verrouillage puis retombée sur un glow stable
    flash.value = withDelay(SNAP_AT, withSequence(
      withTiming(1, { duration: 130, easing: EASE }),
      withTiming(0.4, { duration: 520, easing: EASE }),
    ));
    // sheen : éclat blanc bref par-dessus les anneaux au verrouillage
    sheen.value = withDelay(SNAP_AT - 30, withSequence(
      withTiming(0.55, { duration: 130, easing: EASE }),
      withTiming(0, { duration: 280, easing: EASE }),
    ));
    if (showWordmark) {
      // chaque lettre entre en fondu + monte, décalée de LETTER_STAGGER
      [l0, l1, l2, l3].forEach((lv, i) => {
        lv.value = withDelay(WORD_AT + i * LETTER_STAGGER, withTiming(1, { duration: 500, easing: EASE }));
      });
    }
    if (showWordmark && showTagline) {
      tagO.value = withDelay(TAG_AT, withTiming(1, { duration: TAG_DUR, easing: EASE }, (finished) => {
        'worklet';
        if (finished && onFinish) runOnJS(onFinish)();
      }));
    }
  }, []);

  const glowRgb = typeof glow === 'string' ? glow : '108,99,255';
  const showGlow = glow !== false && glow != null;

  // glow : un seul halo violet doux — éclôt avec la genèse, monte avec le tracé,
  // léger pic au snap. Pas de cœur blanc (rendu plus propre).
  const glowProps = useAnimatedProps(() => ({
    opacity: 0.08 + 0.3 * spark.value * (1 - 0.5 * p.value) + 0.14 * p.value + 0.32 * flash.value,
  }));
  const topProps = useAnimatedProps(() => ({ strokeDashoffset: TOP_LEN * (1 - p.value) }));
  const botProps = useAnimatedProps(() => ({ strokeDashoffset: BOT_LEN * (1 - p.value) }));
  const sheenProps = useAnimatedProps(() => ({ opacity: sheen.value }));
  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: markScale.value }] }));
  const rise = size * 0.085; // amplitude de montée des lettres
  const ls0 = useAnimatedStyle(() => ({ opacity: l0.value, transform: [{ translateY: (1 - l0.value) * rise }] }));
  const ls1 = useAnimatedStyle(() => ({ opacity: l1.value, transform: [{ translateY: (1 - l1.value) * rise }] }));
  const ls2 = useAnimatedStyle(() => ({ opacity: l2.value, transform: [{ translateY: (1 - l2.value) * rise }] }));
  const ls3 = useAnimatedStyle(() => ({ opacity: l3.value, transform: [{ translateY: (1 - l3.value) * rise }] }));
  const letterStyles = [ls0, ls1, ls2, ls3];
  const tagStyle = useAnimatedStyle(() => ({ opacity: tagO.value, transform: [{ translateY: (1 - tagO.value) * 10 }] }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={markStyle}>
        <Svg width={size} height={size} viewBox="-40 -40 580 580">
          {showGlow && (
            <Defs>
              <RadialGradient id="halo" cx="50%" cy="48%" r="60%">
                <Stop offset="0%" stopColor={`rgb(${glowRgb})`} stopOpacity="0.8" />
                <Stop offset="55%" stopColor={`rgb(${glowRgb})`} stopOpacity="0.16" />
                <Stop offset="100%" stopColor={`rgb(${glowRgb})`} stopOpacity="0" />
              </RadialGradient>
            </Defs>
          )}
          {/* halo violet doux centré derrière le mark (glow unique, sans cœur blanc) */}
          {showGlow && (
            <AnimatedCircle cx={250} cy={250} r={260} fill="url(#halo)" animatedProps={glowProps} />
          )}
          {/* les deux anneaux, révélés par stroke-dash */}
          <AnimatedPath d={BOT_D} stroke={color} strokeWidth={SW} strokeLinecap="butt" fill="none"
            strokeDasharray={[BOT_LEN, BOT_LEN]} animatedProps={botProps} />
          <AnimatedPath d={TOP_D} stroke={color} strokeWidth={SW} strokeLinecap="butt" fill="none"
            strokeDasharray={[TOP_LEN, TOP_LEN]} animatedProps={topProps} />
          {/* sheen : éclat blanc bref par-dessus les anneaux au verrouillage */}
          <AnimatedPath d={BOT_D} stroke="#ffffff" strokeWidth={SW * 1.5} strokeLinecap="round" fill="none"
            opacity={0} animatedProps={sheenProps} />
          <AnimatedPath d={TOP_D} stroke="#ffffff" strokeWidth={SW * 1.5} strokeLinecap="round" fill="none"
            opacity={0} animatedProps={sheenProps} />
        </Svg>
      </Animated.View>

      {showWordmark && (
        <View style={[styles.wordRow, { marginTop: size * 0.11 }]}>
          {WORD_LETTERS.map((ch, i) => (
            <Animated.Text key={ch + i} style={[styles.word, { color: wordColor, fontSize: size * 0.34 }, letterStyles[i]]}>
              {ch}
            </Animated.Text>
          ))}
        </View>
      )}
      {showWordmark && showTagline && (
        <Animated.Text style={[styles.tag, { color: tagColor, fontSize: Math.max(10, size * 0.062), marginTop: size * 0.055 }, tagStyle]}>
          {tagText.toUpperCase()}
        </Animated.Text>
      )}
    </View>
  );
}

// Overlay plein écran autonome (fallback). En général l'app rend <SynkLogoAnim/>
// dans son propre overlay (avec le vrai PremiumBackground + un fade piloté par
// l'état auth/profil). Gardé ici comme solution clé-en-main.
export default function SynkSplash({ ready = false, onFinish, background = '#0a0a0a' }) {
  const { width, height } = useWindowDimensions();
  const fade = useSharedValue(1);

  useEffect(() => {
    if (ready) {
      fade.value = withTiming(0, { duration: 420, easing: EASE }, (f) => {
        'worklet';
        if (f && onFinish) runOnJS(onFinish)();
      });
    }
  }, [ready]);

  const overlay = useAnimatedStyle(() => ({ opacity: fade.value }));
  const markSize = Math.min(width, height) * 0.42;

  return (
    <Animated.View pointerEvents={ready ? 'none' : 'auto'}
      style={[StyleSheet.absoluteFill, { backgroundColor: background, alignItems: 'center', justifyContent: 'center' }, overlay]}>
      {/* Eclipse Black + dégradé violet diagonal — miroir de components/PremiumBackground.tsx. */}
      <LinearGradient
        colors={['rgba(108,99,255,0.22)', 'rgba(108,99,255,0.08)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.85 }]}
        pointerEvents="none"
      />
      <SynkLogoAnim size={markSize} showWordmark showTagline />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wordRow: { flexDirection: 'row', alignItems: 'flex-end' },
  word: { fontFamily: 'Inter_900Black', fontWeight: '900', letterSpacing: 1.5 },
  tag: { fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 4 },
});
