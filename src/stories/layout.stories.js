import AppLayout from "../components/layouts/AppLayout";
import PageContainer from "../components/containers/PageContainer";
import QuestionHeader from "../components/helpers/QuestionHeader";
import QuestionActions from "../components/helpers/QuestionActions";
import { onMounted, ref } from "vue";
export default {
  title: "Layout/AppLayout",
  component: AppLayout,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AppLayout, PageContainer, QuestionHeader, QuestionActions },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    const qHeaderRef = ref(null);
    onMounted(() => {
      qHeaderRef.value.beginTimer();
    });
    return { args, qHeaderRef };
  },
  computed: {
    headerArgs() {
      return {
        currentQuestion: {
          time_limit_seconds: 30,
        },
        startTimer: true,
        pauseTimer: false,
        stopTimer: false,
        view: "question",
        totalQuestion: 30,
        withTimer: true,
        loading: false,
        currentSkill: "Listening",
        currentQuestionCount: 4,
      };
    },
    questionHeaderArgs() {
      return {
        currentQuestion: {
          time_limit_seconds: 30,
          hide_input: false,
        },
        test: {
          pause_enabled: true,
        },
        loading: false,
        currentTime: "00:00",
        answered: true,
      };
    },
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    "<app-layout>" +
    "<page-container>" +
    "<template v-slot:header>" +
    "<question-header ref='qHeaderRef' v-bind='headerArgs' />" +
    "</template>" +
    "<template v-slot:footer-right>" +
    "<question-actions v-bind='questionHeaderArgs' />" +
    "</template>" +
    "</page-container>" +
    "</app-layout>",
});

export const onQuestion = Template.bind({});
onQuestion.args = {};

onQuestion.parameters = {
  layout: "fullscreen",
};
