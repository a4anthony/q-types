import McQuestion from "../components/McQuestion";
import "../../dist/output.css";
import QuestionWrapper from "../components/helpers/QuestionWrapper";
import data from "../data";
import { action } from "@storybook/addon-actions";
export default {
  title: "Questions/MultipleChoice",
  component: McQuestion,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    McQuestion,
    QuestionWrapper,
  },
  computed: {
    data() {
      return data;
    },
  },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  methods: {
    answered: action("answered"),
    startTime: action("start-time"),
    resetAnswer: action("reset-answer"),
  },

  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    "<question-wrapper>" +
    "<mc-question " +
    "@start-time='startTime'" +
    " @reset-answer='resetAnswer' " +
    "@answered='answered' " +
    "v-bind='args'  />" +
    "</question-wrapper>",
});

export const Primary = Template.bind({});
Primary.args = {
  currentQuestion: {
    ...data.question,
    content: "My favourite colors are #SELECT#, #SELECT# and #SELECT#.",
  },
  options: data.blankSpaceOptions,
  currentSection: {
    currentSection: data.section,
  },
};
Primary.parameters = {
  layout: "fullscreen",
};

export const Single = Template.bind({});
Single.args = {
  options: data.blankSpaceOptions,
  currentQuestion: {
    ...data.question,
    content: "My favourite color is #SELECT#.",
  },
  currentSection: data.section,
};
Single.parameters = {
  layout: "fullscreen",
};
