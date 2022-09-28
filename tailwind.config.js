/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './client/**/*.{html,js}',
    './components/**/*.{html,js}',
    './public/index.html',
  ],

  theme: {
    extend: {
      // fontFamily: {
      //   'inter': ['Inter'],
      // },
    },
   
  },

  plugins: [],
};
