const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,vue}", "./safelist.txt"],
  prefix: "qt-",
  theme: {
    extend: {
      spacing: {
        17: "4.25rem",
        18: "4.5rem",
      },

      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("tailwind-safelist-generator")({
      patterns: [
        "qt-text-{colors}",
        "qt-bg-{colors}",
        "hover:qt-bg-{colors}",

        "qt-border-{colors}",
        "hover:qt-border-{colors}",

        "qt-text-{colors}",
        "hover:qt-text-{colors}",

        "focus:qt-bg-{colors}",
        "focus:qt-ring-{colors}",
        "focus:qt-ring-{colors}",
        "focus:qt-border-{colors}",
      ],
    }),
    require("tailwind-scrollbar"),
  ],
};
