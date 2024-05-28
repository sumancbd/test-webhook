import { generateColors } from '@mantine/colors-generator';

export const generateTailwindColorPalette = (colorString: string) => {
  const colorPalette = generateColors(colorString);

  return {
    50: colorPalette[0],
    100: colorPalette[1],
    200: colorPalette[2],
    300: colorPalette[3],
    400: colorPalette[4],
    500: colorPalette[5],
    600: colorPalette[6],
    700: colorPalette[7],
    800: colorPalette[8],
    900: colorPalette[9],
    DEFAULT: colorPalette[6],
  };
};

export const generateMantineColorPalette = (colorString: string) => {
  return generateColors(colorString);
};

console.log(generateMantineColorPalette('#FF0000'));
