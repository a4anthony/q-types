<template>
  <audio id="test_tone" class="hidden" controls>
    <source src="/audio/testtone.mp3" type="audio/mp3" />
  </audio>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: "TestTone",
  props: {
    src: {
      type: String,
      default: "audio/testtone.mp3",
    },
  },
  emits: ["tone-played"],
  setup(_, { emit }) {
    onMounted(() => {
      const audio = document.getElementById("test_tone");
      audio.addEventListener("play", () => {
        setTimeout(() => {
          emit("tone-played");
        }, 1000);
      });
    });

    const playTone = () => {
      const audio = document.getElementById("test_tone");
      audio.play();
    };

    return {
      playTone,
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
