/* eslint-disable import/no-unassigned-import */
/* eslint-disable import/unambiguous */

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    fonts: Record<string, string>;
    fontSizes: Record<string, string>;
    breakpoints: string[];
    mediaQueries: Record<string, string>;
    radii: Record<string, string>;
    shadows: Record<string, string>;
    colors: Record<string, Record<string, string>>;
  }
}
