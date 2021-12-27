<template>
  <div class="qt-flex qt-w-full qt-space-x-3 qt-justify-end">
    <app-button
      v-if="
        test &&
        test.pause_enabled &&
        currentQuestion &&
        !currentQuestion.hide_input
      "
      ref="pauseButton"
      btn-color-class="qt-btn-white"
      @click="pauseTest"
      class="qt-btn-sm qt-w-28"
      :disabled="loading"
    >
      <HandIcon class="qt-w-5 qt-h-5 qt-mr-2" />
      Pause
    </app-button>
    <!--skip button-->
    <app-button
      v-if="!answered && currentQuestion && !currentQuestion.hide_input"
      ref="button"
      @click="skipQuestion"
      class="btn-sm w-28"
      :disabled="loading"
    >
      <CheckIcon class="qt-w-5 qt-h-5 qt-mr-2" />
      Skip
    </app-button>
    <!--submit button-->
    <app-button
      v-if="answered && currentQuestion && !currentQuestion.hide_input"
      ref="button"
      @click="answerQuestion"
      class="qt-btn-sm qt-w-28"
      :disabled="loading"
    >
      <CheckIcon class="qt-w-5 qt-h-5 qt-mr-2" />
      Submit
    </app-button>
    <app-button
      v-if="currentQuestion && currentQuestion.hide_input"
      ref="button"
      @click="answerQuestion"
      class="qt-btn-sm qt-w-44"
      :disabled="true"
    >
      <CheckIcon class="qt-w-5 qt-h-5 qt-mr-2" />
      Continue <span class="qt-ml-1">({{ currentTime }})</span>
    </app-button>
  </div>
</template>

<script>
import AppButton from "./AppButton";
import { HandIcon, CheckIcon } from "@heroicons/vue/solid";
import { ref } from "vue";

export default {
  name: "QuestionActions",
  components: {
    AppButton,

    HandIcon,
    CheckIcon,
  },
  props: {
    test: {
      type: Object,
      required: true,
    },
    currentQuestion: {
      type: Object,
      required: true,
    },
    currentTime: {
      type: String,
      required: true,
    },
    answered: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const action = ref("");
    const showPauseModal = ref(false);
    const showAlertModal = ref(false);

    const pauseTest = () => {
      this.action = "pause";
      this.showPauseModal = true;
    };

    const skipQuestion = () => {
      this.action = "skip";
      this.showPauseModal = true;
    };
    const answerQuestion = () => {
      if (this.answer.valid === false) {
        this.showAlertModal = true;
      } else {
        this.$emit("get-next");
      }
    };
    const callAction = (force = false) => {
      if (force) {
        this.$emit("get-next");
        this.showAlertModal = false;
        return;
      }
      if (this.action === "pause") {
        this.$emit("pause-test");
      } else if (this.action === "skip") {
        this.$emit("skip-question");
      }
    };

    return {
      action,
      showPauseModal,
      showAlertModal,
      pauseTest,
      skipQuestion,
      answerQuestion,
      callAction,
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
