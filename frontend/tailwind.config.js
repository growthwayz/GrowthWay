/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'gw-canvas': '#F1F1F1',
        'gw-white': '#FFFFFF',
        'gw-ink': '#111111',
        'gw-black': '#080808',
        'gw-charcoal': '#1C1C1C',
        'gw-blush': '#F7CDD0',
        'gw-blush-soft': '#F9DDDF',
        'gw-blush-deep': '#F7BFC3',
        'gw-muted': '#777777',
        'gw-line': '#E5E3E2',
        'gw-pink': '#E95B9F',
        'gw-purple': '#B35CE8',
        'gw-green': '#72B957',
        'gw-orange': '#F26A21',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
