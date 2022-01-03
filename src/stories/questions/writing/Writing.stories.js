import QuestionWrapper from "../../../components/helpers/QuestionWrapper";
import WritingQuestion from "../../../components/questions/writing/WritingQuestion";
import data from "../../../data";
import { action } from "@storybook/addon-actions";

export default {
  title: "Questions/Writing/WritingQuestion",
  component: WritingQuestion,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    WritingQuestion,
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
    "<writing-question " +
    "@start-time='startTime'" +
    " @reset-answer='resetAnswer' " +
    "@answered='answered' " +
    "v-bind='args'/>" +
    "</question-wrapper>",
});

export const withStringLimit = Template.bind({});
withStringLimit.args = {
  currentQuestion: {
    ...data.question,
    side_content: data.passage,
    answers: data.radioOptionsText,
    meta: {
      min_length: 150,
    },
    content:
      "What has contributed to the decline of the once highly popular Italian moka stove-top coffee pot?",
  },
  hideInfo: true,
  currentSection: data.section,
};
withStringLimit.parameters = {
  layout: "fullscreen",
};

export const withHideInput = Template.bind({});
withHideInput.args = {
  currentQuestion: {
    ...data.question,
    side_content: data.passage,
    answers: data.radioOptionsText,
    meta: {
      min_length: 150,
    },
    hide_input: true,
    content:
      "What has contributed to the decline of the once highly popular Italian moka stove-top coffee pot?",
  },
  hideInfo: true,
  currentSection: data.section,
};
withHideInput.parameters = {
  layout: "fullscreen",
};

export const withoutStringLimit = Template.bind({});
withoutStringLimit.args = {
  currentQuestion: {
    ...data.question,
    side_content: data.passage,
    answers: data.radioOptionsText,
    content:
      "What has contributed to the decline of the once highly popular Italian moka stove-top coffee pot?",
  },
  hideInfo: true,
  currentSection: data.section,
};
withoutStringLimit.parameters = {
  layout: "fullscreen",
};

export const withImage = Template.bind({});
withImage.args = {
  currentQuestion: data.writingQuestionWithImage,
  hideInfo: true,
  currentSection: data.section,
};
withImage.parameters = {
  layout: "fullscreen",
};
