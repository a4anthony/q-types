<template>
  <div class="qt-relative qt-flex qt-justify-center qt-w-full">
    <div
      v-show="height > 100"
      :style="{ height: `${280}px` }"
      :class="height > 0 ? 'qt-visible' : 'qt-invisible'"
      class="qt-relative"
    >
      <video
        style="height: 100%; object-fit: cover"
        id="video"
        :class="!recording && 'qt-filter qt-blur-xszzz'"
        class="qt-rounded-lg"
        width="400"
        autoplay
        playsinline
      ></video>

      <div
        v-if="cameraStarted && !recording"
        class="qt-absolute qt-bottom-0 qt-left-0 qt-right-0 qt-z-10 qt-rounded-b-lg qt-flex qt-justify-center qt-items-center qt-bg-black qt-bg-opacity-60"
      >
        <div
          v-if="recStart && !recording"
          class="qt-absolute qt-bottom-16 qt-animate-pulse qt-bg-black qt-bg-opacity-50 qt-w-12 qt-h-12 qt-rounded-full qt-flex qt-justify-center qt-items-center"
        >
          <span class="qt-text-xl qt-font-bold qt-text-white">{{
            countDown
          }}</span>
        </div>
        <div
          v-if="!recording && !videoBlob"
          class="qt-rounded-lg qt-px-3 qt-py-2.5 qt-mx-8 qt-flex qt-justify-center qt-items-center"
        >
          <span class="qt-text-sm qt-font-semibold qt-text-white">
            {{ currentQuestion.content }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoRecorder",
  props: {
    currentQuestion: {
      type: Object,
      required: true,
    },
    recording: {
      type: Boolean,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    recStart: {
      type: Boolean,
      required: true,
    },
    videoBlob: {
      type: String,
      required: true,
    },
    cameraStarted: {
      type: Boolean,
      required: true,
    },
    countDown: {
      type: Number,
      required: true,
    },
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
