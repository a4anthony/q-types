import { app } from "@storybook/vue3";
import "../dist/output.css";
import "../src/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

app.mixin({
  computed: {
    color() {
      return "blue";
    },
  },
});
app.component("fa-icon", FontAwesomeIcon);
app.provide("color", "blue");

// app.provide("color", "blue");
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
