import { action } from "@storybook/addon-actions";
import VideoRecorderRtc from "../../components/video/VideoRecorderRtc";
import data from "../../data";

export default {
  title: "Questions Helpers/VideoRecorder",
  component: VideoRecorderRtc,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { VideoRecorderRtc },
  computed: {},
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  methods: {
    noAudio: action("no-audio"),
    quality: action("quality"),
    videoFile: action("video-file"),
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    '<div class="qt-max-w-sm qt-mx-auto qt-mt-8">' +
    '<video-recorder-rtc v-bind="args" ' +
    '@quality="quality" ' +
    '@no-audio="noAudio" ' +
    '@video-file="videoFile" ' +
    "/>" +
    "</div>",
});

export const Default = Template.bind({});
Default.args = {
  view: "question",
  timeLimit: 40,
  allowRecording: true,
  currentQuestion: {
    ...data.question,
    content: "Tell us about your favourite holiday.",
    time_limit_seconds: 60,
    time_to_prepare: 3,
  },
};
