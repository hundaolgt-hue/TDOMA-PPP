// Section scroll runways (vh). One place, so the logo choreography and the
// section shells can never disagree.
export const HERO_VH = 320;

// Logo choreography, in viewport-heights of absolute scroll. The hero is
// 320vh and unpins at ~2.2vh of scroll; the intro film resolves to the logo
// near there, so the persistent docked badge fades in just after.
export const LOGO_REVEAL_START_VH = 2.3;
export const LOGO_REVEAL_END_VH = 2.9;
// Docked from the start (see ScrollLogo) — these are kept for reference.
export const LOGO_DOCK_START_VH = 2.3;
export const LOGO_DOCK_END_VH = 2.9;
