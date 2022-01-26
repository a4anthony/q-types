<template>
  <div
    v-if="!videoFile && cameraStarted"
    :class="`qt-border-${color}-600`"
    class="qt-mt-0 qt-w-full qt-mx-auto qt-max-w-sm qt-border-2 qt-rounded-3xl qt-px-2 qt-py-1.5 qt-flex qt-justify-center qt-space-x-2 qt-items-center"
  >
    <div>
      <button
        v-if="!recording"
        :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
        class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
        :disabled="!allowRecording"
        @click="$emit('start-recording')"
      >
        <VideoCameraIcon class="qt-w-4 qt-h-4" />
      </button>
      <button
        v-else
        :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
        class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
        @click="$emit('stop-recording')"
        :disabled="!recording"
      >
        <span class="qt-block qt-w-2 qt-h-2 qt-bg-white"></span>
      </button>
    </div>
    <div class="qt-relative qt-flex-grow">
      <span
        class="qt-block qt-w-full qt-rounded-lg qt-h-1 qt-bg-gray-200"
      ></span>
      <span
        :style="{
          width: `${width}%`,
        }"
        :class="`qt-bg-${color}-600`"
        class="qt-block qt-w-9 qt-rounded-lg qt-h-1 qt-absolute qt-left-0 qt-top-0 qt-progress-bar"
      ></span>
    </div>
    <div
      :class="`qt-text-${color}-600`"
      class="qt-flex qt-justify-between qt-font-semibold qt-text-base qt-w-25 qt-flex-none qt-text-right"
    >
      <span>{{ timer }}</span
      >/ <span>{{ timeLimitString }}</span>
    </div>
  </div>
  <div
    v-if="!videoFile && cameraStarted"
    class="qt-mx-auto qt-my-3 qt-text-center"
  >
    <app-button
      v-if="!recording"
      class="qt-btn qt-btn-md"
      :disabled="!allowRecording"
      @click="$emit('start-recording')"
      btn-color-class="qt-btn-white"
    >
      <span
        class="qt-block qt-w-3 qt-h-3 qt-mr-2 qt-rounded-full qt-bg-gray-600"
      ></span>
      Start Recording
    </app-button>
    <app-button
      v-else
      btn-color-class="qt-btn-white"
      class="qt-btn qt-btn-md"
      @click="$emit('stop-recording')"
      :disabled="!recording"
    >
      <span class="qt-block qt-w-3 qt-h-3 qt-mr-2 qt-bg-gray-600"></span>
      Stop Recording
    </app-button>
  </div>
</template>

<script>
import { VideoCameraIcon } from "@heroicons/vue/solid";
import AppButton from "../helpers/AppButton";

export default {
  name: "VideoActionsRtc",
  components: {
    AppButton,
    VideoCameraIcon,
  },
  props: {
    videoFile: {
      type: Object,
      default: null,
    },
    recording: {
      type: Boolean,
      required: true,
    },
    timer: {
      type: String,
      required: true,
    },
    timeLimitString: {
      type: String,
      required: true,
    },
    cameraStarted: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    allowRecording: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["start-recording", "stop-recording"],
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
