/** @type {import('tailwindcss').Config} */

module.exports = {
  // purge: ['./dist/*.html'],

  content: [
    './client/**/*.{html,js}',
    './components/**/*.{html,js}',
    './public/index.html',
  ],

  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif' ],
      },
    },
   
  },

  plugins: [],
};
