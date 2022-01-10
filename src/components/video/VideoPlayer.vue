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
        id="qtVideoPlayer"
        class="qt-rounded-lg"
        width="400"
        autoplay
        playsinline
        :src="videoSrc"
      ></video>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    height: {
      type: Number,
      default: 0,
    },
    videoSrc: {
      type: String,
      default: "",
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
