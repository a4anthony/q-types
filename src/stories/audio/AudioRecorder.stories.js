import AudioRecorder from "../../components/audio/AudioRecorder";
import DefaultAudio from "../../components/audio/DefaultAudio";
import "../../../dist/output.css";
import { action } from "@storybook/addon-actions";

export default {
  title: "Questions Helpers/AudioRecorder",
  component: AudioRecorder,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AudioRecorder, DefaultAudio },
  computed: {
    color() {
      return "blue";
    },
  },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  methods: {
    answered: action("answered"),
    startTime: action("start-time"),
    audioBase64: action("audio-base64"),
    audioUrl: action("audio-url"),
    resetAnswer: action("reset-answer"),
    quality: action("quality"),
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    '<div class="qt-max-w-sm qt-mx-auto qt-mt-8">' +
    '<default-audio :with-recorder="true" view="question"/> ' +
    '<audio-recorder v-bind="args" ' +
    '@quality="quality" ' +
    '@audio-base64="audioBase64" ' +
    '@audio-url="audioUrl" ' +
    "/>" +
    "</div>",
});

export const onQuestion = Template.bind({});
onQuestion.args = {
  view: "question",
  timeLimit: 40,
  allowRecording: true,
};

export const onSection = Template.bind({});
onSection.args = {
  view: "section",
  timeLimit: 30,
  allowRecording: true,
};

export const onError = Template.bind({});
onError.args = {
  view: "section",
  timeLimit: 30,
  allowRecording: true,
};
