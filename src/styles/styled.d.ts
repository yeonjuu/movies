import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
  }
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
