import RadioOptions from "../../components/helpers/RadioOptions";
import { action } from "@storybook/addon-actions";

export default {
  title: "Questions Helpers/RadioOptions",
  component: RadioOptions,
  argTypes: { selected: { action: "selected" } },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { RadioOptions },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  methods: { selected: action("selected") },

  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    '<div class="qt-max-w-sm qt-mx-auto qt-mt-8"> <radio-options @selected="selected" v-bind="args"  /></div>',
});

export const withAlphabets = Template.bind({});
withAlphabets.args = {
  options: [
    {
      id: 105,
      question_id: 27,
      content: "A",
    },
    {
      id: 106,
      question_id: 27,
      content: "B",
    },
    {
      id: 107,
      question_id: 27,
      content: "C",
    },
    {
      id: 108,
      question_id: 27,
      content: "D",
    },
  ],
};

export const withText = Template.bind({});
withText.args = {
  options: [
    { id: 2788, question_id: 797, content: "Getting home in time for dinner" },
    {
      id: 2789,
      question_id: 797,
      content: "Getting to Harrod's before it closes",
    },
    {
      id: 2790,
      question_id: 797,
      content: "Getting to a job interview too early",
    },
    {
      id: 2791,
      question_id: 797,
      content: "Getting to a business appointment on time",
    },
  ],
  stringRadio: true,
};
