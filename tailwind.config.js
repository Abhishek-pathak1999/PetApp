/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},

    colors: {
      black: "#000",
      gray: "#C2B1B1",
      skyblue: "#2256DD",
      blue: "#D6D8EA #3C4277",
      red: "red",
      white: "#fff",
      gray1: "#12205140",
      customBlue : '#246BFD',
      customBreen: '#12C524',
      customBlueLite: 'rgba(36, 55, 121, 0.81)',
      customGray: '#DDE1F2',
      lightBlack: '#00000040',
      customPink: '#E731D4',
      customPurple: '#4E539C',
      slate: {
        400: '#94a3b8',
        900: '#0f172a',
      },

      indigo: {
        800: '#3730a3',
      },
      blue: {
        500: '#2196F3',
      },
      red: {
        500: '#F44336',
      },
      yellow: {
        500: '#FFEB3B',
      },
   
        'custom-pink': '#E731D4',

      
    },
    lineHeight: {
      110: '1.10', // 110% line height
    },
    letterSpacing: {
      wideCustom: '1.92px', // custom letter spacing
    },

    backgroundImage: {
      'custom-gradient': 'linear-gradient(to right, #246BFD, #12C524)',
      'custom-linear-gradient': 'linear-gradient(180deg, #395498 10%, #0B0C31 94%)',
    },

    fontFamily: {
      segoe: ["Segoe UI"],
      inter: ['Inter'],
      openSans : ['"Open Sans"', 'sans-serif'],
    },

    fontSize: {
      xxs: "10px",
      xs: "12px",
    },

    boxShadow: {
      '3xl' : '10px 10px 10px -10px rgba(0, 0, 0, 0.3)'
    }

  },
  plugins: [],
};
