import DefaultAudio from "../../components/audio/DefaultAudio";
import data from "../../data";
import TestFeedback from "../../components/screens/TestFeedback";

import QuestionWrapper from "../../components/helpers/QuestionWrapper";
import { action } from "@storybook/addon-actions";

export default {
  title: "Screens/Feedback",
  component: TestFeedback,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    TestFeedback,
    DefaultAudio,
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
    loadError: action("load-error"),
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    "<default-audio :src='args.currentQuestion.media' view='question'/>" +
    "<question-wrapper :no-slots='true'>" +
    "<test-feedback  " +
    'v-bind="args"  />' +
    "</question-wrapper>",
});

export const primary = Template.bind({});
primary.args = {
  currentSection: {
    id: 11,
  },
  currentQuestion: {
    id: 11,
    content: "<p class='text-center'><img src='images/S1Q8.png'></p>",
    answers: data.radioOptions,
    media: "audio/Q13-UK.mp3",
  },
};
primary.parameters = {
  layout: "fullscreen",
};
