/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
    fontFamily: {
      robotoMono: ['Roboto Mono', 'monospace'], 
    },
      extend: {
        colors: {
          primary: "#1c1c22",
          accent: {
          DEFAULT: "#9894d7",
          hover: "#00e187"
        },
        'light-purple': '#9894d7',
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        }
      }
    },
  plugins: [],
}

