/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6a1b9a',
        },
        'primary-foreground': {
          DEFAULT: '#ffffff',
        },
        secondary: {
          DEFAULT: '#4a148c',
        },
        'secondary-foreground': {
          DEFAULT: '#ffffff',
        },
        accent: {
          DEFAULT: '#8e24aa',
        },
        background: {
          DEFAULT: '#1a1a2e',
        },
        foreground: {
          DEFAULT: '#e0e0e0',
        },
        muted: {
          DEFAULT: '#757575',
        },
        'muted-foreground': {
          DEFAULT: '#c7c7c7',
        },
        popover: {
          DEFAULT: '#2a2a40',
        },
        'popover-foreground': {
          DEFAULT: '#e0e0e0',
        },
        card: {
          DEFAULT: '#2a2a40',
        },
        'card-foreground': {
          DEFAULT: '#e0e0e0',
        },
        border: {
          DEFAULT: '#444461',
        },
        input: {
          DEFAULT: '#2a2a40',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
