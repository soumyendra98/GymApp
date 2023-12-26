/* eslint-disable */

module.exports = {
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
    sass: {
      loaderOptions: {
        additionalData: `
          @import "/src/styles/colors.scss";
          `,
      },
    },
  },
};
