'use client'

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigModule from '../tailwind.config.js';
import { ThemeProvider, createTheme } from '@mui/material';

const tailwindConfig = resolveConfig(tailwindConfigModule);

const theme = createTheme({
  palette: {
    primary: {
      // @ts-ignore
      main: tailwindConfig.theme?.colors.main,
      // @ts-ignore
      light: tailwindConfig.theme?.colors.light,
      // @ts-ignore
      dark: tailwindConfig.theme?.colors.dark,
    },
  },
});

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
