module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          ivory: '#FAF8F2',
          sage: '#6B8F71',
          forest: '#4E6B52',
          gold: '#C6A15B',
          stone: '#E8E5DC',
          heading: '#27332A',
          body: '#55635A',
        }
      },
    },
  },
}