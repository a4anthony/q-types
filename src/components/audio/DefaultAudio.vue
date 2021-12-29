<template>
  <div>
    <button
      type="button"
      @click="
        () => {
          getRandomString(10);
          $refs.testPlayer.load();
        }
      "
      class="qt-hidden"
    >
      clickkkk
    </button>
    <div
      :class="
        view === 'section' || view === 'section2' ? 'section-audio-player' : ''
      "
    >
      <audio ref="testPlayer" id="test_player" preload="auto" class="qt-hidden">
        <source :src="`${src}?v=${randString}`" type="audio/mp3" />
      </audio>
    </div>
    <div
      v-if="withRecorder"
      :class="
        view === 'section' || view === 'section2' ? 'section-audio-player' : ''
      "
    >
      <audio id="test_player2" preload="auto" class="qt-hidden">
        <source :src="src" type="audio/mp3" />
      </audio>
    </div>
    <canvas
      id="oscilloscope"
      class="qt-ml-auto qt-mr-auto qt-rounded-lg qt-hidden"
    ></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "DefaultAudio",
  props: {
    view: {
      type: String,
      default: "section",
      required: true,
    },
    withRecorder: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default:
        "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/backsound.mp3",
    },
  },

  setup() {
    const randString = ref("");

    onMounted(() => {
      getRandomString(10);
    });
    /**
     * @description Set random string to unique string
     * @param length
     */
    const getRandomString = (length) => {
      const randomChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length)
        );
      }
      randString.value = result;
    };

    return {
      randString,
      getRandomString,
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
