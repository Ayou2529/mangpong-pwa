/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './main.js',
    './service-worker.js',
    './dist/**/*.html',
    './dist/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        'prompt': ['Prompt', 'sans-serif'],
      },
    },
  },
  plugins: [],
};