import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { generateTailwindColorPalette } from './color';

// SEE: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
const tailwind: Config = {
  important: true,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        transparent: 'transparent',
        primary: generateTailwindColorPalette('#00ECFF'),
        dark: generateTailwindColorPalette('#000E1D'),
        border: generateTailwindColorPalette('#CCCFD2'),
        background: generateTailwindColorPalette('#F2F3F4'),
      },
      fontFamily: {
        inter: ['Inter', ...fontFamily.sans],
      },
      fontSize: {
        xxs: ['0.625rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
};

export default tailwind;
