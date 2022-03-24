module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    minWidth: {
      '50': '25rem',
      '300': '300px',
      '12.5': '6.25rem',
    },
    extend: {
      spacing: {
        '25': '12.5rem',
        '50': '25rem',
        '160': '40rem',
      },
      animation: {
        playicon: 'playingIcon 0.5s ease-out infinite alternate-reverse'
      },
      keyframes: {
        playingIcon: {
          from: {
            transform: 'translate3d(0,0,0)'
          },
          to: {
            transform: 'translate3d(0,80%,0)'
          }
        }
      },

    },
  },
  plugins: [
    require("tailwindcss-animation-delay"),
  ],
}
