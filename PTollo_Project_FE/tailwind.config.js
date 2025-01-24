import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // fontFamily: {
      //   sora: ["Sora"],
      // },
      colors: {
        "purple-200": "#DAC7FC",
        "purple-300": "#CAA6FF",
        "purple-500": "#6B49CD",
        "purple-700": "#5D0096",
        "purple-900": "#210035",
        "pink-500": "#AD26FF",
      },
      fontSize: {
        0: "0px",
        1: "1px",
        2: "2px",
        3: "3px",
        4: "4px",
        5: "5px",
        6: "6px",
        7: "7px",
        8: "8px",
        9: "9px",
        10: "10px",
        11: "11px",
        12: "12px",
        13: "13px",
        14: "14px",
        16: "16px",
        20: "20px",
        24: "24px",
        26: "26px",
        32: "32px",
        36: "36px",
        48: "48px",
      },
    },
  },
  plugins: [daisyui],
};
