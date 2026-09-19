/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
