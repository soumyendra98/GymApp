module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EB3A02",
        "red-light": "#FEF5F2",
        grey: "#363333",
        "grey-2": "#706E6E",
        "grey-3": "#767676",
        green: "#6FB100",
        "green-3": "#4A7600",
        yellow: "#FFF7DF",
        "lightest-yellow": "#FFF9F7",
        "off-white": "#F5F5F5",
      },
      fontSize: {
        xxs: "0.625rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
