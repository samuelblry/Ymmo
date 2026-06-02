/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      noir:    '#18181B',
      blanc:   '#FFFFFF',
      marron:  '#A88B6A',
      'marron-clair': '#EFE7DD',
      'gris-clair':   '#F5F5F4',
      'gris-moyen':   '#D4D4D4',
      'gris-fonce':   '#525252',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}
