import AudioRadioQuestion from "../../../components/questions/listening/AudioRadioQuestion";
import DefaultAudio from "../../../components/audio/DefaultAudio";
import data from "../../../data";

import QuestionWrapper from "../../../components/helpers/QuestionWrapper";
import { action } from "@storybook/addon-actions";
export default {
  title: "Questions/Listening/AudioRadioQuestion",
  component: AudioRadioQuestion,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    AudioRadioQuestion,
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
    "<question-wrapper>" +
    "<audio-radio-question  " +
    "@start-time='startTime' " +
    "@answered='answered' " +
    "@load-error='loadError' " +
    'v-bind="args"  />' +
    "</question-wrapper>",
});

export const withAudio = Template.bind({});
withAudio.args = {
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
withAudio.parameters = {
  layout: "fullscreen",
};

export const withAudioAndError = Template.bind({});
withAudioAndError.args = {
  currentSection: {
    id: 11,
  },
  currentQuestion: {
    id: 11,
    media: "audio/Q13-UK.mp3333",
    content: "<p class='text-center'><img src='images/S1Q8.png'></p>",
    answers: data.radioOptions,
  },
};
withAudioAndError.parameters = {
  layout: "fullscreen",
};

export const withoutAudio = Template.bind({});
withoutAudio.args = {
  radioOnly: true,
  currentSection: {
    id: 11,
  },
  currentQuestion: {
    id: 11,
    content: "Who is eligible for a 15% discount today?",
    answers: data.radioOptionsText,
    media: "",
  },
};
withoutAudio.parameters = {
  layout: "fullscreen",
};
