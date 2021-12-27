import AudioPlayer from "../../components/audio/AudioPlayer";
import DefaultAudio from "../../components/audio/DefaultAudio";
import "../../../dist/output.css";

export default {
  title: "Questions Helpers/AudioPlayer",
  component: AudioPlayer,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AudioPlayer, DefaultAudio },
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
    '<div class="qt-max-w-sm qt-mx-auto qt-mt-8"><default-audio view="question"/> <audio-player v-bind="args"  /></div>',
});

export const withBars = Template.bind({});
withBars.args = {
  view: "question",
};

export const withAvatar = Template.bind({});
withAvatar.args = {
  view: "question",
  withAvatar: true,
};

export const withBarsNoAutoPlay = Template.bind({});
withBarsNoAutoPlay.args = {
  view: "question",
  autoPlay: false,
};

export const withAvatarNoAutoPlay = Template.bind({});
withAvatarNoAutoPlay.args = {
  view: "question",
  withAvatar: true,
  autoPlay: false,
};

export const withBarsWithReplay = Template.bind({});
withBarsWithReplay.args = {
  view: "question",
  autoPlay: false,
};

export const withAvatarWithReplay = Template.bind({});
withAvatarWithReplay.args = {
  view: "question",
  withAvatar: true,
  autoPlay: false,
};

export const withPlayer = Template.bind({});
withPlayer.args = {
  view: "question",
  withPlayer: true,
  autoPlay: false,
  withHelperButtons: false,
};
