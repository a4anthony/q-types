<template>
  <button
    v-if="plays === 1 && replay"
    @click="$emit('play')"
    :class="`qt-text-gray-600 hover:qt-text-gray-400`"
    class="focus:qt-outline-none qt-inline-flex qt-text-base qt-justify-center qt-items-center sm:qt-text-lg qt-font-semibold"
  >
    <RefreshIcon class="qt-w-5 qt-h-5 qt-mr-1 qt-font-bold" />
    replay
  </button>

  <button
    v-if="replayed"
    :class="`qt-text-gray-300`"
    class="focus:qt-outline-none qt-inline-flex qt-text-base qt-justify-center qt-items-center sm:qt-text-lg qt-font-semibold"
    disabled
  >
    <RefreshIcon class="qt-w-5 qt-h-5 qt-mr-1 qt-font-bold" />
    replayed
  </button>

  <button
    @click="$emit('play')"
    v-if="plays === 0 && showPlayBtn && !audioPlaying"
    :class="`qt-text-gray-600 hover:qt--gray-400`"
    class="focus:qt-outline-none qt-inline-flex qt-text-base qt-justify-center qt-items-center sm:qt-text-lg qt-font-semibold"
  >
    <PlayIcon class="qt-w-5 qt-h-5 qt-mr-1 qt-font-bold" />
    play
  </button>
</template>

<script>
import { RefreshIcon, PlayIcon } from "@heroicons/vue/solid";

export default {
  name: "AudioButtons",
  components: {
    RefreshIcon,
    PlayIcon,
  },
  props: {
    plays: {
      type: Number,
      required: true,
    },
    replay: {
      type: Boolean,
      required: true,
    },
    showPlayBtn: {
      type: Boolean,
      required: true,
    },
    audioPlaying: {
      type: Boolean,
      required: true,
    },
    replayed: {
      type: Boolean,
      required: true,
    },
  },

  emits: ["play"],
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
