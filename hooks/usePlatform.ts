import { useWindowDimensions } from 'react-native';

export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

export const BREAKPOINTS = {
  mobile: 430,
  tablet: 1024,
  desktop: 1280,
} as const;

export function usePlatform() {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAKPOINTS.mobile;
  const isTablet = width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;
  const isDesktop = width > BREAKPOINTS.tablet;
  const screenSize: ScreenSize = isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile';

  const contentMaxWidth = isMobile
    ? BREAKPOINTS.mobile
    : isDesktop
      ? BREAKPOINTS.desktop
      : BREAKPOINTS.tablet;

  const columns = isDesktop ? 3 : isTablet ? 2 : 1;

  return { isMobile, isTablet, isDesktop, screenSize, width, contentMaxWidth, columns };
}
