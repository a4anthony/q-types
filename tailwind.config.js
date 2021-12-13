module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  prefix: "qt-",
  theme: {
    extend: {
      spacing: {
        17: "4.25rem",
        18: "4.5rem",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
