<template>
  <div
    class="qt-flex qt-items-center"
    :class="
      view === 'question' && !loading && withTimer
        ? 'qt-justify-between'
        : 'qt-justify-end'
    "
  >
    <div
      v-if="view === 'question' && !loading && withTimer"
      class="qt-inline-flex qt-space-x-3 qt-items-center"
    >
      <span class="qt-flex qt-h-4 qt-w-4 qt-relative">
        <span
          :class="[
            `qt-bg-${timerColor}-400`,
            startTimer && timerColor === 'red' ? 'qt-animate-ping' : '',
          ]"
          class="qt-absolute qt-inline-flex qt-h-full qt-w-full qt-rounded-full qt-opacity-75"
        ></span>
        <span class="qt-relative qt-inline-flex qt-rounded-full qt-h-4 qt-w-4">
          <ClockIcon
            :class="`qt-text-${timerColor}-600`"
            class="qt-w-4 qt-h-4"
          />
        </span>
      </span>
      <span class="qt-font-semibold qt-tracking-widest qt-text-base">{{
        timeString
      }}</span>
    </div>
    <div class="qt-divide-x">
      <span class="qt-pr-2">
        <span
          class="qt-inline-block qt-text-sm qt-bg-gray-100 qt-rounded-2xl qt-px-2 qt-py-1 qt-font-medium"
          >{{ currentSkill }}</span
        >
      </span>
      <span v-if="view === 'question'" class="qt-pl-2">
        <span class="qt-inline-block">
          <span class="qt-font-bold qt-inline-block qt-mr-2">Q</span>
          <span class="qt-text-sm qt-font-medium qt-tracking-widest">
            {{ currentQuestionCount || 1 }}/{{ totalQuestion || 30 }}</span
          >
        </span>
      </span>
      <span v-if="view === 'section2'" class="qt-pl-2">
        <span
          class="qt-inline-block qt-text-sm qt-rounded-2xl qt-px-2 qt-py-1 qt-font-medium"
          >Instructions</span
        >
      </span>
    </div>
  </div>
</template>

<script>
import { ClockIcon } from "@heroicons/vue/solid";
import { onMounted, reactive, ref, watch } from "vue";
import _ from "lodash";

export default {
  name: "QuestionHeader",
  components: {
    ClockIcon,
  },
  props: {
    view: {
      type: String,
      required: true,
    },
    currentQuestionCount: {
      type: Number,
      required: true,
    },
    currentQuestion: {
      type: Object,
      required: true,
    },
    totalQuestion: {
      type: Number,
      required: true,
    },
    currentSkill: {
      type: String,
      required: true,
    },
    withTimer: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    // from store
    startTimer: {
      type: Boolean,
      required: true,
    },
    pauseTimer: {
      type: Boolean,
      required: true,
    },
    stopTimer: {
      type: Boolean,
      required: true,
    },
  },

  emits: ["timer", "set-current-time", "skip"],
  setup(props, { emit }) {
    props = reactive(props);
    const timerColor = ref("green");
    const timeString = ref("");
    const timer = ref(0);
    const timeInterval = ref(null);

    watch(
      () => props.startTimer,
      (val) => {
        if (val) {
          beginTimer();
        }
      }
    );
    watch(
      () => props.pauseTimer,
      (val) => {
        if (val) {
          holdTimer();
        }
      }
    );
    watch(
      () => props.stopTimer,
      (val) => {
        if (val) {
          clearTimer();
        }
      }
    );
    watch(
      () => props.stopTimer,
      (val) => {
        if (val) {
          clearTimer();
        }
      }
    );
    watch(
      () => props.loading,
      (val) => {
        if (val) {
          clearTimer();
        }
      }
    );
    watch(
      () => _.cloneDeep(props.currentQuestion),
      (val) => {
        clearTimer();
        if (!props.currentQuestion) {
          return;
        }
        timer.value = Number(val.time_limit_seconds);
        convertTime(timer.value);
        timerColor.value = "green";
      }
    );
    watch(
      () => timer.value,
      (val) => {
        const time = props.currentQuestion
          ? Number(props.currentQuestion.time_limit_seconds)
          : 30;
        const gap1 = Math.round((1 / 3) * time);
        const gap2 = Math.round((2 / 3) * time);
        if (val < gap2) {
          timerColor.value = "yellow";
        }
        if (val < gap1) {
          timerColor.value = "red";
        }
        if (timer.value < 1) {
          clearTimer();
          if (props.withTimer) {
            emit("skip");
          }
        }
      }
    );
    /**
     * Mounted hook
     */
    onMounted(() => {
      emit("timer", false);
      const time = props.currentQuestion
        ? Number(props.currentQuestion.time_limit_seconds)
        : 30;
      timer.value = time;
      convertTime(time);
      timerColor.value = "green";
    });

    const convertTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timeString.value = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      emit("set-current-time", timeString.value);
    };

    const beginTimer = () => {
      timeInterval.value = setInterval(() => {
        timer.value = timer.value - 1;
        convertTime(timer.value);
      }, 1000);
    };
    const holdTimer = () => {
      // console.log("pause");
      clearInterval(timeInterval.value);
    };

    const clearTimer = () => {
      clearInterval(timeInterval.value);
      // this.$store.commit('teq/setStartTime', false);
    };

    return {
      timerColor,
      timeString,
      timer,
      convertTime,
      beginTimer,
      holdTimer,
      clearTimer,
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
