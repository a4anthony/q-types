import McQuestion from "../components/McQuestion";
import "../../dist/output.css";
export default {
  title: "Question/McQuestion",
  component: McQuestion,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { McQuestion },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    '<div class="max-w-sm mx-auto mt-8"><mc-question  v-bind="args"  /></div>',
});

export const Primary = Template.bind({});
export const Single = Template.bind({});
Single.args = {
  question: "My favourite color is #SELECT#.",
};
