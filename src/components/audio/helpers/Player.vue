<template>
  <div
    v-if="withPlayer && !disablePlay"
    class="qt-max-w-md sm:qt-max-w-sm qt-mx-auto qt-border-2 qt-rounded-3xl qt-px-2 qt-py-1.5 qt-flex qt-space-x-2 qt-items-center"
    :class="`qt-border-${color}-600`"
  >
    <button
      v-if="!audioPlaying && !buffering"
      type="button"
      :class="`qt-text-${color}-600 hover:qt-text-${color}-400`"
      @click="$emit('play')"
      :disabled="disablePlay"
    >
      <PlayIcon class="qt-w-6 qt-h-6" />
    </button>
    <!--pause audio-->
    <button
      v-if="audioPlaying && !buffering"
      type="button"
      :class="`qt-text-${color}-600 hover:qt-text-${color}-400`"
      @click="$emit('pause')"
    >
      <PauseIcon class="qt-w-6 qt-h-6" />
    </button>
    <span v-if="!audioPlaying && buffering">
      <loading-icon :icon-color="`qt-text-${color}-500`" size="qt-w-6 qt-h-6" />
    </span>
    <span v-if="audioPlaying && buffering">
      <loading-icon :icon-color="`qt-text-${color}-500`" size="qt-w-6 qt-h-6" />
    </span>
    <!--progress bar-->
    <div
      class="qt-timeline qt-w-100 qt-bg-gray-100 qt-relative qt-cursor-pointer qt-flex-grow qt-h-1"
    >
      <div class="qt-w-full qt-h-1 qt-bg-gray-200"></div>
      <div
        :class="`qt-bg-${color}-600`"
        class="qt-w-0 qt-h-1 qt-bg-red-400 qt-absolute qt-left-0 qt-top-0 qt-progress"
      ></div>
    </div>
    <!--audio duration-->
    <span
      :class="`qt-text-${color}-600`"
      class="qt-flex qt-justify-between qt-font-semibold qt-text-base qt-w-25 qt-flex-none qt-text-right"
    >
      <span class="qt-w-12 qt-text-center">{{ currentTime }}</span
      >/
      <span class="qt-w-12 qt-text-center">{{ totalDuration }}</span>
    </span>
  </div>
  <div v-show="withPlayer && disablePlay">
    <div
      class="qt-max-w-md sm:qt-max-w-sm qt-mx-auto qt-border-2 qt-rounded-3xl qt-px-2 qt-py-1.5 qt-flex qt-space-x-2 qt-items-center"
      :class="`qt-border-${color}-600`"
    >
      <span :class="`qt-text-${color}-600 hover:qt-text-${color}-400`">
        <CheckCircleIcon class="qt-w-6 qt-h-6" />
      </span>
      <div class="qt-flex-grow">
        <span class="qt-font-semibold qt-text-base qt-text-left"
          >Audio file</span
        >
      </div>
      <span
        :class="`qt-text-${color}-600`"
        class="qt-tracking-wider qt-font-semibold qt-text-base qt-w-25 qt-flex-none qt-text-right"
      >
        {{ totalDuration }}
      </span>
    </div>
  </div>
</template>

<script>
import { PlayIcon, PauseIcon, CheckCircleIcon } from "@heroicons/vue/solid";
import LoadingIcon from "../../helpers/LoadingIcon";

export default {
  name: "Player",
  components: {
    LoadingIcon,
    PlayIcon,
    PauseIcon,
    CheckCircleIcon,
  },
  props: {
    currentTime: {
      type: String,
      default: "00:00",
    },
    totalDuration: {
      type: String,
      default: "00:00",
    },
    withPlayer: {
      type: Boolean,
      required: true,
    },
    audioPlaying: {
      type: Boolean,
      required: true,
    },
    buffering: {
      type: Boolean,
      required: true,
    },
    disablePlay: {
      type: Boolean,
      required: true,
    },
    playError: {
      type: Boolean,
      required: true,
    },
    showPlayBtn: {
      type: Boolean,
      required: true,
    },
    plays: {
      type: Number,
      required: true,
    },
  },

  emits: ["play", "pause"],
};
</script>

<style scoped>
.qt-progress {
  transition: 0.25s;
}
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
