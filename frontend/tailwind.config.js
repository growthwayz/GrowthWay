/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gw: {
          canvas: '#F1F1F1',
          white: '#FFFFFF',
          ink: '#111111',
          black: '#080808',
          charcoal: '#1C1C1C',
          blush: '#F7CDD0',
          'blush-soft': '#F9DDDF',
          'blush-deep': '#F7BFC3',
          muted: '#777777',
          line: '#E5E3E2',
          pink: '#E95B9F',
          purple: '#B35CE8',
          green: '#72B957',
          orange: '#F26A21',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      transitionDuration: {
        fast: '300ms',
        normal: '600ms',
        cinematic: '1200ms',
      },
    },
  },
  plugins: [],
}
