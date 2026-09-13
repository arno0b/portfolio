import { css } from 'styled-components';

// woff2 only: it covers ~99% of the browserslist target (`> 0.25%, not dead`),
// and shipping the woff fallback alongside it doubled the font payload for the
// handful of browsers that would need it.
import CalibreRegular from '@fonts/Calibre/Calibre-Regular.woff2';
import CalibreMedium from '@fonts/Calibre/Calibre-Medium.woff2';
import CalibreSemibold from '@fonts/Calibre/Calibre-Semibold.woff2';

import CalibreRegularItalic from '@fonts/Calibre/Calibre-RegularItalic.woff2';
import CalibreMediumItalic from '@fonts/Calibre/Calibre-MediumItalic.woff2';
import CalibreSemiboldItalic from '@fonts/Calibre/Calibre-SemiboldItalic.woff2';

import SFMonoRegular from '@fonts/SFMono/SFMono-Regular.woff2';
import SFMonoSemibold from '@fonts/SFMono/SFMono-Semibold.woff2';

import SFMonoRegularItalic from '@fonts/SFMono/SFMono-RegularItalic.woff2';
import SFMonoSemiboldItalic from '@fonts/SFMono/SFMono-SemiboldItalic.woff2';

const calibre = {
  name: 'Calibre',
  normal: {
    400: CalibreRegular,
    500: CalibreMedium,
    600: CalibreSemibold,
  },
  italic: {
    400: CalibreRegularItalic,
    500: CalibreMediumItalic,
    600: CalibreSemiboldItalic,
  },
};

const sfMono = {
  name: 'SF Mono',
  normal: {
    400: SFMonoRegular,
    600: SFMonoSemibold,
  },
  italic: {
    400: SFMonoRegularItalic,
    600: SFMonoSemiboldItalic,
  },
};

const createFontFaces = (family, style = 'normal') => {
  let styles = '';

  for (const [weight, woff2] of Object.entries(family[style])) {
    styles += `
      @font-face {
        font-family: '${family.name}';
        src: url(${woff2}) format('woff2');
        font-weight: ${weight};
        font-style: ${style};
        font-display: swap;
      }
    `;
  }

  return styles;
};

const calibreNormal = createFontFaces(calibre);
const calibreItalic = createFontFaces(calibre, 'italic');

const sfMonoNormal = createFontFaces(sfMono);
const sfMonoItalic = createFontFaces(sfMono, 'italic');

const Fonts = css`
  ${calibreNormal + calibreItalic + sfMonoNormal + sfMonoItalic}
`;

export default Fonts;
