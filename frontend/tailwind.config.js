/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gw: {
          cream: '#FAF8F5',          // Primary background — warm off-white
          canvas: '#FAF8F5',         // Primary background alias
          pink: '#5C9E31',           // Growthway Pink -> mapped to olive to match current theme
          white: '#FFFDF9',          // Warm white panels
          ink: '#111111',            // Primary text
          black: '#080808',          // Dark sections
          charcoal: '#1C1C1C',       // Footer / dark panels
          olive: '#5C9E31',          // Primary accent — vibrant leaf green
          'olive-dark': '#3E701D',   // Deeper vibrant green
          'olive-light': '#87C95B',  // Lighter energetic green
          maroon: '#7A3B3B',         // Supporting colour — only if needed
          muted: '#777777',          // Secondary text
          line: '#E8E4DF',           // Dividers — warm toned
          blush: '#E5F1DB',          // Very subtle warm blush -> subtle green
          'blush-soft': '#F1F8EB',   // Soft pink fills -> soft green
          'blush-deep': '#87C95B',   // Deeper pink hover -> light olive
          purple: '#B35CE8',         // Chip accent
          green: '#72B957',          // Chip accent
          orange: '#F26A21',         // Chip accent
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
