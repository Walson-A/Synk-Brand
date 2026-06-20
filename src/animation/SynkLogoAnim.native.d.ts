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
  /** called once the mark finishes drawing. */
  onFinish?: () => void;
}

/** The animated SYNK mark (+ optional wordmark / tagline). Render it inside your
 *  own full-screen overlay. */
export const SynkLogoAnim: ComponentType<SynkLogoAnimProps>;

export interface SynkSplashProps {
  /** when true, the overlay fades out and calls onFinish. */
  ready?: boolean;
  onFinish?: () => void;
  background?: string;
}

/** Standalone full-screen splash overlay (Eclipse bg + gradient + mark). */
declare const SynkSplash: ComponentType<SynkSplashProps>;
export default SynkSplash;
