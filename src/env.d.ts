/// <reference types="astro/client" />

interface Window {
  returnMoeTheme?: {
    set(theme: 'light' | 'dark'): void;
  };
}
