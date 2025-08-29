export type ThemeColors = {
  headerBackground: string;
  pageBackground: string;
  cardBackground: string;
  mainTitleText: string;
  titleText: string;
  subtleBorder: string;
  filterButtonBg: string;
  filterButtonBorder: string;
  filterButtonText: string;
};

export const LIGHT_COLORS: ThemeColors = {
  headerBackground: '#ffffff',
  pageBackground: '#F5F5F5',
  cardBackground: '#ffffff',
  mainTitleText: '#E9D9D8',
  titleText: '#010100',
  subtleBorder: '#F4F4F4',
  filterButtonBg: '#fafafa',
  filterButtonBorder: '#eee',
  filterButtonText: '#858585',
};

export const DARK_COLORS: ThemeColors = {
  headerBackground: '#141414',
  pageBackground: '#0f0f0f',
  cardBackground: '#1a1a1a',
  mainTitleText: '#E9D9D8',
  titleText: '#E9D9D8',
  subtleBorder: '#2b2b2b',
  filterButtonBg: '#2b2b2b',
  filterButtonBorder: '#3a3a3a',
  filterButtonText: '#e0e0e0',
};

export const getThemeColors = (isDark: boolean): ThemeColors =>
  isDark ? DARK_COLORS : LIGHT_COLORS;
