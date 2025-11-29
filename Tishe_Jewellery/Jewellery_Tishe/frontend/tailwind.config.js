/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#db2777',
        'primary-dark': '#9d174d',
        secondary: '#7e22ce',
        dark: '#111827',
        light: '#f9fafb',
        gray: {
          DEFAULT: '#6b7280',
          light: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
