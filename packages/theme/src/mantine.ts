import { generateMantineColorPalette } from './color';
import type { MantineThemeOverride } from '@mantine/core';

import { DefaultMantineColor, MantineColorsTuple, createTheme } from '@mantine/core';

/**
 * This is a custom type that extends the default Mantine color scheme.
 * It is used to override the default Mantine color scheme.
 * Add your custom colors here.
 */
type ExtendedCustomColors = 'primary' | 'accent' | 'secondary' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}

const mantine: MantineThemeOverride = createTheme({
  colors: {
    primary: generateMantineColorPalette('#00ECFF'),
    accent: generateMantineColorPalette('#FF007C'),
    secondary: generateMantineColorPalette('#FFD500'),
    border: generateMantineColorPalette('#CCCFD2'),
    background: generateMantineColorPalette('#F2F3F4'),
  },
  primaryColor: 'primary',
});

export default mantine;
