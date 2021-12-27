import QuestionWrapper from "../../../components/helpers/QuestionWrapper";
import ReadingQuestion from "../../../components/questions/reading/ReadingQuestion";
import data from "../../../data";
import { action } from "@storybook/addon-actions";

export default {
  title: "Questions/Reading/ReadingQuestion",
  component: ReadingQuestion,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    ReadingQuestion,
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
  methods: { answered: action("answered"), startTime: action("start-time") },

  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    "<question-wrapper><reading-question @start-time='startTime' @answered='answered' v-bind='args'/></question-wrapper>",
});

export const withRadio = Template.bind({});
withRadio.args = {
  type: "radio",
  currentQuestion: {
    ...data.question,
    side_content: data.passage,
    answers: data.radioOptionsText,
    content:
      "What has contributed to the decline of the once highly popular Italian moka stove-top coffee pot?",
  },
  currentSection: data.section,
};

export const withMultipleChoice = Template.bind({});
withMultipleChoice.args = {
  type: "multiple_choice",
  currentQuestion: {
    ...data.question,
    side_content: data.passage,
    content: "My favourite colors are #SELECT#, #SELECT# and #SELECT#.",
    answers: data.blankSpaceOptions,
  },
  currentSection: data.section,
};

withRadio.parameters = {
  layout: "fullscreen",
};
withMultipleChoice.parameters = {
  layout: "fullscreen",
};
