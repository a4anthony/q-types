import AudioRecorder from "../../components/audio/AudioRecorder";
import DefaultAudio from "../../components/audio/DefaultAudio";
import "../../../dist/output.css";

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
  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    '<div class="qt-max-w-sm qt-mx-auto qt-mt-8"><default-audio view="question"/> <audio-recorder v-bind="args"  /></div>',
});

export const withBars = Template.bind({});
withBars.args = {
  view: "question",
};
