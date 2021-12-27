<template>
  <div>
    <dual-view-question-container gray-background reverse>
      <template v-slot:left-content>
        <div
          class="qt-px-1 qt-text-left qt-text-gray-700 qt-text-md qt-font-medium"
        >
          <div v-html="currentQuestion.side_content"></div></div
      ></template>
      <template v-slot:right-content>
        <div>
          <span
            v-if="type === 'radio'"
            class="qt-text-left qt-font-medium qt-block qt-mb-2"
            >{{ currentQuestion.content }}
          </span>
          <radio-options
            v-if="type === 'radio'"
            class="qt-mt-2 sm:qt-mt-8"
            @selected="answered"
            :options="currentQuestion.answers"
            string-radio
          />
          <mc-question
            v-if="type === 'multiple_choice'"
            :current-question="currentQuestion"
            :current-section="currentSection"
            :options="currentQuestion.answers"
            @answered="answered"
          />
        </div>
      </template>
    </dual-view-question-container>
  </div>
</template>

<script>
import DualViewQuestionContainer from "../../containers/DualViewQuestionContainer";
import RadioOptions from "../../helpers/RadioOptions";
import { onMounted, reactive } from "vue";
import McQuestion from "../../McQuestion";
export default {
  name: "ReadingQuestion",
  components: { McQuestion, RadioOptions, DualViewQuestionContainer },
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ["radio", "multiple_choice", ""].includes(value);
      },
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
  emits: ["answered", "start-time"],

  setup(props, { emit }) {
    props = reactive(props);
    onMounted(() => {
      emit("start-time", true);
    });
    const answered = (selectedOption) => {
      emit(
        "answered",
        props.type === "radio"
          ? {
              answer_id: props.type === "radio",
              question_id: props.currentQuestion.id,
              section_id: props.currentSection.id,
            }
          : selectedOption
      );
    };

    return {
      answered,
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
