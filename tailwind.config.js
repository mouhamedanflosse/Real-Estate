/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        Xmd: "860px",
        Xsm: "481px",
        Xsmd: "633px",
        FS: "100%",
      },
      gridTemplateColumns: {
        "auto-fill": "repeat(auto-fit, minmax(300px, 1fr))",
      },
    },
  },
  plugins: [],
});
