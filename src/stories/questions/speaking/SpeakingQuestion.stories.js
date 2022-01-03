import QuestionWrapper from "../../../components/helpers/QuestionWrapper";
import data from "../../../data";
import SpeakingQuestion from "../../../components/questions/speaking/SpeakingQuestion";
import { action } from "@storybook/addon-actions";
import DefaultAudio from "../../../components/audio/DefaultAudio";

export default {
  title: "Questions/Speaking/SpeakingQuestion",
  component: SpeakingQuestion,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    SpeakingQuestion,
    QuestionWrapper,
    DefaultAudio,
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
    '<default-audio test-tone-src="audio/testtone.mp3" :src="args.currentQuestion.media" :with-recorder="true" view="question"/>' +
    "<question-wrapper>" +
    "<speaking-question " +
    "@start-time='startTime'" +
    " @reset-answer='resetAnswer' " +
    "@answered='answered' " +
    "v-bind='args'  />" +
    "</question-wrapper>",
});

export const speakingOnly = Template.bind({});
speakingOnly.args = {
  currentQuestion: {
    ...data.question,
    content: "Tell us about your favourite holiday.",
    time_limit_seconds: 30,
  },
  options: data.blankSpaceOptions,
  currentSection: data.section,
};
speakingOnly.parameters = {
  layout: "fullscreen",
};

export const speakingWithAvatar = Template.bind({});
speakingWithAvatar.args = {
  currentQuestion: {
    ...data.question,
    content: "Tell us about your favourite holiday.",
    time_limit_seconds: 30,
    media: "audio/Q13-UK.mp3",
  },
  options: data.blankSpaceOptions,
  currentSection: data.section,
  withAvatar: true,
};
speakingWithAvatar.parameters = {
  layout: "fullscreen",
};

export const speakingWithImage = Template.bind({});
speakingWithImage.args = {
  currentQuestion: {
    ...data.question,
    content: "<p class='text-center'><img src='images/S1Q8.png'></p>",
    time_limit_seconds: 30,
    media: "audio/Q13-UK.mp3",
  },
  options: data.blankSpaceOptions,
  currentSection: data.section,
  withAvatar: true,
  withImage: true,
};
speakingWithImage.parameters = {
  layout: "fullscreen",
};

// export const Single = Template.bind({});
// Single.args = {
//     options: data.blankSpaceOptions,
//     currentQuestion: {
//         ...data.question,
//         content: "My favourite color is #SELECT#.",
//     },
//     currentSection: data.section,
// };
// Single.parameters = {
//     layout: "fullscreen",
// };
