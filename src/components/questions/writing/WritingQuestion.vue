<template>
  <div>
    <div
      v-if="hideInput"
      :style="{
        height: `${height}px`,
      }"
      class="qt-flex qt-items-center qt-justify-center"
    >
      question info on hide input
      <!--<question-info :text="currentQuestion ? currentQuestion.content : sampleQuestion1" />-->
    </div>
    <dual-view-question-container v-else reverse gray-background>
      <template v-slot:left-content>
        <div :class="!hideInfo ? 'qt-space-y-2' : 'qt-space-y-4'">
          <div v-if="!hideInfo" class="qt-sticky qt-top-0">
            <!--spamquestion info-->
            <!--<question-info v-if="!hideInfo" :text="questionInfo" />-->
          </div>
          <span
            v-html="currentQuestion.content"
            class="qt-text-base qt-font-medium qt-block qt-text-left"
          >
          </span>
        </div>
      </template>
      <template v-slot:right-content>
        <div>
          <label
            for="qtAnswer"
            class="qt-block qt-text-sm qt-hidden qt-font-medium qt-text-gray-700"
          >
            Answer
          </label>
          <div>
            <textarea
              id="qtAnswer"
              name="qt-answer"
              rows="8"
              v-model="answer"
              :class="`focus:qt-ring-${color}-500 focus:qt-border-${color}-500`"
              class="qt-shadow-sm qt-mt-1 qt-block qt-w-full sm:qt-text-sm qt-border qt-border-gray-300 qt-rounded-md qt-p-2"
              placeholder="Enter your answer here"
              :style="{
                minHeight: `${(1 / 2) * height}px`,
                maxHeight: `${(2 / 3) * height}px`,
              }"
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              autofocus
            ></textarea>
          </div>
          <span
            v-if="answerLength"
            class="qt-block qt-text-right qt-font-medium qt-text-sm"
          >
            word count:
            {{ text.length === 0 ? 0 : text.split(" ").length - 1 }}/{{
              answerLength
            }}
          </span>
        </div>
      </template>
    </dual-view-question-container>
    <settings @height="useHeight" />
  </div>
</template>

<script>
import DualViewQuestionContainer from "../../containers/DualViewQuestionContainer";
import Settings from "../../helpers/Settings";
import { reactive, ref, watch, computed, onMounted } from "vue";
export default {
  name: "WritingQuestion",
  components: { Settings, DualViewQuestionContainer },
  props: {
    hideInfo: {
      type: Boolean,
      default: false,
    },
    currentQuestion: {
      type: Object,
      required: true,
    },
    currentSection: {
      type: Object,
      required: true,
    },
  },

  emits: ["answered", "reset-answer", "start-time"],
  setup(props, { emit }) {
    props = reactive(props); // mounted
    const height = ref(0);
    const answer = ref("");
    const text = ref("");
    const hideInput = computed(
      () => !!(props.currentQuestion && props.currentQuestion.hide_input)
    );
    const answerLength = computed(() =>
      props.currentQuestion && props.currentQuestion.meta
        ? Number(props.currentQuestion.meta.min_length)
        : null
    );

    watch(
      () => answer.value,
      (val) => {
        // let text = val.replace(/ +(?= )/g, "");
        text.value = val.replace(/ +(?= )/g, "");

        if (
          answerLength.value &&
          text.value.split(" ").length - 1 >= 1 &&
          text.value.split(" ").length - 1 < answerLength.value
        ) {
          emit("answered", {
            answer: text.value,
            question_id: props.currentQuestion.id,
            section_id: props.currentSection.id,
            valid: false,
            warningMsg: `You are about to submit a text with less than <strong>${answerLength.value}</strong> words. We strongly recommend at least  <strong>${answerLength.value}</strong> words.`,
          });
        } else if (
          answerLength.value &&
          text.value.split(" ").length - 1 >= answerLength.value
        ) {
          emit("answered", {
            answer: text.value,
            question_id: props.currentQuestion.id,
            section_id: props.currentSection.id,
          });
        } else if (!answerLength.value && text.value.length > 0) {
          emit("answered", {
            answer: text.value,
            question_id: props.currentQuestion.id,
            section_id: props.currentSection.id,
          });
        } else {
          emit("reset-answer");
        }
      }
    );

    onMounted(() => {
      emit("start-time", true);
    });

    const useHeight = (heightVal) => {
      height.value = Number(heightVal.replace("px", ""));
      console.log(height.value);
    };

    return {
      height,
      useHeight,
      answer,
      answerLength,
      text,
      hideInput,
    };
  },
};
</script>

<style scoped>
/* (1366x768) WXGA Display */

@media screen and (min-width: 1366px) and (max-width: 1919px) {
}

@media (min-width: 1198px) and (max-width: 1365.9px) {
}

/* Normal desktop :992px. */

@media (min-width: 992px) and (max-width: 1197px) {
}

/* Normal desktop :991px. */

@media (min-width: 768px) and (max-width: 991px) {
}

/* small mobile :576px. */

@media (min-width: 576px) and (max-width: 767px) {
}

/* extra small mobile 320px. */

@media (max-width: 575px) {
}

/* Large Mobile :480px. */

@media only screen and (min-width: 480px) and (max-width: 575px) {
}

@media only screen and (max-width: 575px) and (min-width: 480px) {
}
</style>
