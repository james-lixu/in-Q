/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    fontFamily: {
      robotoMono: ["Roboto Mono", "monospace"],
    },
    extend: {
      colors: {
        text: "#e4dcf6",       
        background: "#05030b",  
        primary: "#a387df",     
        secondary: "#852374",   
        accent: "#d04b9c",      
        lightPurple: "#9894d7",
        darkGray: "#343a40",
        blueGray: "#5885AF",
        darkPurple: "#3E3E6A",
        'neon-green': "#00ff99",
        'neon-red': "#ff0066",
        lightPink: 'white',
        'regBlue': '#007bff',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
