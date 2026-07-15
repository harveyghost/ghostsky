import {
  createThemes,
  DEFAULT_PALETTE,
  DEFAULT_SUBDUED_PALETTE,
} from '@bsky.app/alf'

/**
 * GHOST: Catppuccin Mocha accent (Mauve) across the full 13-step primary
 * scale — confirmed real key names from node_modules/@bsky.app/alf/src/palette.ts.
 * The first attempt at this only overrode 3 of 13 steps (_400/_500/_600),
 * which is why it barely looked different: everything using _25 through
 * _300 or _700 through _975 (subtle backgrounds, hover/pressed states in
 * some contexts, dark-mode-derived shades) was still stock Bluesky blue.
 * This covers the whole ramp, hand-tuned to Mauve (#cba6f7) at the anchor
 * (_500) with the same relative lightness/saturation progression Bluesky's
 * own blue ramp uses.
 */
const GHOSTSKY_PRIMARY = {
  primary_25: '#FAF7FF',
  primary_50: '#F3ECFF',
  primary_100: '#E6D9FF',
  primary_200: '#D5C0FC',
  primary_300: '#C2A6F9',
  primary_400: '#CBA6F7', // Catppuccin Mocha Mauve
  primary_500: '#B794F4', // anchor, slightly deepened for contrast on light bg
  primary_600: '#9B7AE0',
  primary_700: '#7E60C2',
  primary_800: '#63499D',
  primary_900: '#463374',
  primary_950: '#33235A',
  primary_975: '#241842',
}

/**
 * GHOSTSKY v2: full neutral scale rebuilt using ONLY Catppuccin Mocha's own
 * family end-to-end — including the endpoints (contrast_0/1000), which I'd
 * previously left as pure white/black on the theory they might carry
 * special meaning. That was the actual bug: dark mode's page background
 * reads from that extreme, so it was rendering stark black instead of
 * Mocha's tinted dark, while individual cards (using mid-scale values)
 * correctly showed purple — hence the black-at-top-purple-below split.
 * Mixing two separate families (Latte + Mocha) across one ramp was also
 * likely contributing to visible inconsistency/seams and washed-out
 * borders. Single family now, top to bottom.
 */
/**
 * GHOSTSKY v3: contrast_0 was set to Mocha's "Text" color (#CDD6F4), which
 * works fine as dark mode's light-on-dark text tone, but this same value
 * doubles as light mode's page background — and Mocha's Text is a tinted
 * lavender, not an actual near-white, so light mode was rendering that
 * lavender as its background (visible in the header/sidebar) instead of
 * the flat #EFF1F5 the rest of the light theme already correctly uses.
 * Swapped contrast_0 to Catppuccin Latte's Base (#EFF1F5) — the proper
 * light-theme counterpart — so it matches on both ends: still light
 * enough to read as text on a dark background, and now correctly neutral
 * enough to serve as light mode's actual background.
 */
const GHOSTSKY_CONTRAST = {
  contrast_0: '#EFF1F5', // Latte Base (was Mocha Text, #CDD6F4)
  contrast_25: '#BAC2DE', // Subtext1
  contrast_50: '#A6ADC8', // Subtext0
  contrast_100: '#9399B2', // Overlay2
  contrast_200: '#7F849C', // Overlay1
  contrast_300: '#6C7086', // Overlay0
  contrast_400: '#585B70', // Surface2
  contrast_500: '#45475A', // Surface1
  contrast_600: '#313244', // Surface0
  contrast_700: '#24253A', // between surface0 & base
  contrast_800: '#1E1E2E', // Base
  contrast_900: '#181825', // Mantle
  contrast_950: '#14141F', // between mantle & crust
  contrast_975: '#11111B', // Crust
  contrast_1000: '#0A0A0F', // darkest floor
}

const GHOSTSKY_PALETTE = {
  ...DEFAULT_PALETTE,
  ...GHOSTSKY_PRIMARY,
  ...GHOSTSKY_CONTRAST,
}

/**
 * GHOST: the 'dim' theme variant is built from DEFAULT_SUBDUED_PALETTE, not
 * defaultPalette — this was left untouched originally, meaning 'dim' mode
 * (which is what the app fell back to by default, see darkTheme default
 * below) was still showing 100% stock Bluesky colors regardless of the
 * primary/contrast work above. Same recolor treatment, applied here too.
 */
const GHOSTSKY_SUBDUED_PALETTE = {
  ...DEFAULT_SUBDUED_PALETTE,
  ...GHOSTSKY_PRIMARY,
  ...GHOSTSKY_CONTRAST,
}

const DEFAULT_THEMES = createThemes({
  defaultPalette: GHOSTSKY_PALETTE,
  subduedPalette: GHOSTSKY_SUBDUED_PALETTE,
})

export const themes = {
  lightPalette: DEFAULT_THEMES.light.palette,
  darkPalette: DEFAULT_THEMES.dark.palette,
  dimPalette: DEFAULT_THEMES.dim.palette,
  light: DEFAULT_THEMES.light,
  dark: DEFAULT_THEMES.dark,
  dim: DEFAULT_THEMES.dim,
}

/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const lightPalette = DEFAULT_THEMES.light.palette
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const darkPalette = DEFAULT_THEMES.dark.palette
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const dimPalette = DEFAULT_THEMES.dim.palette
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const light = DEFAULT_THEMES.light
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const dark = DEFAULT_THEMES.dark
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const dim = DEFAULT_THEMES.dim
