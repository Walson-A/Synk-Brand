// Types for @synk/brand/animation/native (React Native splash/logo animation).
import type { ComponentType } from 'react';

export interface SynkLogoAnimProps {
  /** px size of the square mark. */
  size?: number;
  /** stroke color of the mark. */
  color?: string;
  /** rgb string for the radial halo (e.g. '108,99,255'), or `false` to disable it. */
  glow?: string | false;
  showWordmark?: boolean;
  showTagline?: boolean;
  tagText?: string;
  wordColor?: string;
  tagColor?: string;
  /** called once the full animation (draw → snap → wordmark → tagline) finishes. */
  onFinish?: () => void;
}

/** The animated SYNK mark (+ optional wordmark / tagline). Render it inside your
 *  own full-screen overlay. */
export const SynkLogoAnim: ComponentType<SynkLogoAnimProps>;

/** Total animation duration in ms (genesis → draw → snap → wordmark → tagline).
 *  Use as the splash overlay's minimum display time so the animation always plays
 *  through, even when the app becomes ready sooner. */
export const SYNK_SPLASH_DURATION: number;

export interface SynkSplashProps {
  /** when true, the overlay fades out and calls onFinish. */
  ready?: boolean;
  onFinish?: () => void;
  background?: string;
}

/** Standalone full-screen splash overlay (Eclipse bg + gradient + mark). */
declare const SynkSplash: ComponentType<SynkSplashProps>;
export default SynkSplash;
