import { css } from 'styled-components';

const sizes = {
    bigDesktop: 1090,
    desktop: 920,
    bigTablet: 820,
    tablet: 750,
    mobile: 550,
    smallMobile: 430,
    smallestMobile: 350
  }

  export default Object.keys(sizes).reduce((acc, label) => {
    acc[label] = (...args) => css`
     @media (max-width: ${sizes[label]}px) {
        ${css(...args)};
     }
  `
    return acc
  }, {})
