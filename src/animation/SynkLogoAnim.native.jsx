// SynkLogoAnim.native.jsx — React Native port of the SYNK splash/logo animation.
// Stack: react-native-svg + react-native-reanimated (NOT Lottie) — same geometry
// as the web mark, ported with PORTABLE properties only (opacity / scale /
// translate / stroke-dashoffset path reveal / fill color). No CSS filters.
//
// Install (Expo):
//   npx expo install react-native-svg react-native-reanimated
//   (reanimated babel plugin must be last in babel.config.js)
//
// Usage — inside the app's existing splash overlay (recommended):
//   import { SynkLogoAnim } from '@synk/brand/animation/native';
//   // render <SynkLogoAnim glow={false} .../> over your PremiumBackground.
//   // `glow={false}` turns off the built-in radial halo when the surrounding
//   // background already provides one (avoids a double glow).
//
// Or standalone, via the full-screen overlay (default export):
//   import SynkSplash from '@synk/brand/animation/native';
//   <SynkSplash ready={appReady} onFinish={() => SplashScreen.hideAsync()} />
//
// SEAMLESS TRANSITION: the native splash image (app.json "splash") MUST be a
// still frame of THIS mark at the same size/position/centre on #0a0a0a, so the
// hand-off from native splash → this animated overlay shows no jump.
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

// ── geometry (500 viewBox), flat caps — identical to the web/canvas master ──
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
// arc lengths for the stroke-dash reveal
const len = (o) => R * (Math.abs(o.to - o.from) * Math.PI) / 180;
const TOP_LEN = len(TOP), BOT_LEN = len(BOT);

const EASE = Easing.bezier(0.16, 1, 0.3, 1); // SYNK ease-out

// timing (ms) — short & interruptible
const DRAW = 1150, WORD_DELAY = 950, TAG_DELAY = 1250;

export function SynkLogoAnim({
  size = 150,
  color = '#ffffff',
  glow = '108,99,255',   // rgb string for the radial halo, or `false` to disable it
  showWordmark = true,
  showTagline = false,
  tagText = 'Réserve ton studio',
  wordColor = '#ededed',
  tagColor = '#a3a3a3',
  onFinish,
}) {
  // 0→1 draw progress; we animate strokeDashoffset = LEN * (1 - p)
  const p = useSharedValue(0);
  const lock = useSharedValue(0);     // pop on completion
  const wordO = useSharedValue(0);
  const tagO = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(1, { duration: DRAW, easing: EASE }, (finished) => {
      'worklet';
      if (finished && onFinish) runOnJS(onFinish)();
    });
    lock.value = withDelay(DRAW - 60, withSequence(
      withTiming(1.03, { duration: 110, easing: EASE }),
      withTiming(1, { duration: 220, easing: EASE }),
    ));
    if (showWordmark) wordO.value = withDelay(WORD_DELAY, withTiming(1, { duration: 500, easing: EASE }));
    if (showWordmark && showTagline) tagO.value = withDelay(TAG_DELAY, withTiming(1, { duration: 600, easing: EASE }));
  }, []);

  const topProps = useAnimatedProps(() => ({ strokeDashoffset: TOP_LEN * (1 - p.value) }));
  const botProps = useAnimatedProps(() => ({ strokeDashoffset: BOT_LEN * (1 - p.value) }));
  const glowProps = useAnimatedProps(() => ({ opacity: 0.18 + 0.22 * p.value }));

  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: 0.985 + 0.015 * lock.value }] }));
  const wordStyle = useAnimatedStyle(() => ({ opacity: wordO.value, transform: [{ translateY: (1 - wordO.value) * 14 }] }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tagO.value, transform: [{ translateY: (1 - tagO.value) * 10 }] }));

  const showGlow = glow !== false && glow != null;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={markStyle}>
        <Svg width={size} height={size} viewBox="-40 -40 580 580">
          {/* soft violet halo (radial gradient stands in for the web drop-shadow).
              `glow={false}` disables it — e.g. over PremiumBackground, whose ambient
              gradient already provides a halo (avoids doubling). */}
          {showGlow && (
            <Defs>
              <RadialGradient id="g" cx="50%" cy="46%" r="55%">
                <Stop offset="0%" stopColor={`rgb(${glow})`} stopOpacity="0.9" />
                <Stop offset="100%" stopColor={`rgb(${glow})`} stopOpacity="0" />
              </RadialGradient>
            </Defs>
          )}
          {showGlow && (
            <AnimatedCircle cx="250" cy="250" r="250" fill="url(#g)" animatedProps={glowProps} />
          )}
          {/* the two rings, revealed by stroke-dash */}
          <AnimatedPath d={BOT_D} stroke={color} strokeWidth={SW} strokeLinecap="butt" fill="none"
            strokeDasharray={[BOT_LEN, BOT_LEN]} animatedProps={botProps} />
          <AnimatedPath d={TOP_D} stroke={color} strokeWidth={SW} strokeLinecap="butt" fill="none"
            strokeDasharray={[TOP_LEN, TOP_LEN]} animatedProps={topProps} />
        </Svg>
      </Animated.View>

      {showWordmark && (
        <Animated.Text style={[styles.word, { color: wordColor, fontSize: size * 0.30 }, wordStyle]}>
          SYNK
        </Animated.Text>
      )}
      {showWordmark && showTagline && (
        <Animated.Text style={[styles.tag, { color: tagColor, fontSize: Math.max(10, size * 0.072) }, tagStyle]}>
          {tagText.toUpperCase()}
        </Animated.Text>
      )}
    </View>
  );
}

// Full-screen splash overlay (standalone). Pass `ready` from your boot logic;
// when ready it fades out and calls onFinish (where you SplashScreen.hideAsync()).
// In Synk-App we DON'T use this — we render <SynkLogoAnim glow={false}/> inside the
// app's existing AnimatedSplashOverlay (which already has the real PremiumBackground
// + a fade driven by auth/profile loading). Kept here as a standalone fallback.
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
  const markSize = Math.min(width, height) * 0.40;

  return (
    <Animated.View pointerEvents={ready ? 'none' : 'auto'}
      style={[StyleSheet.absoluteFill, { backgroundColor: background, alignItems: 'center', justifyContent: 'center' }, overlay]}>
      {/* Eclipse Black + violet diagonal gradient — mirrors components/PremiumBackground.tsx. */}
      <LinearGradient
        colors={['rgba(108,99,255,0.25)', 'rgba(108,99,255,0.1)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
        pointerEvents="none"
      />
      <SynkLogoAnim size={markSize} showWordmark showTagline />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  word: { fontFamily: 'Inter_900Black', fontWeight: '900', letterSpacing: 1.5, marginTop: 18 },
  tag: { fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 4, marginTop: 12 },
});
