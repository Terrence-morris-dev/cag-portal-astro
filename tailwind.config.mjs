/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2332',
          dark: '#0f1419',
          light: '#1e2a3a',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e0c060',
          dark: '#c8a356',
        },
        clearance: {
          secret: '#2563eb',
          ts: '#7c2d12',
          'ts-sci': '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
