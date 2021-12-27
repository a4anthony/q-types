<template>
  <span
    v-for="dot in [1, 2, 3]"
    :key="dot"
    class="qt-flex qt-h-2 qt-w-2 qt-relative"
  >
    <span
      v-if="dot === activeDot"
      :class="`qt-bg-${color}-500`"
      class="qt-absolute qt-inline-flex qt-h-full qt-w-full qt-rounded-full qt-opacity-75 qt-animate-ping"
    ></span>
    <span
      :class="dot === activeDot ? `qt-bg-${color}-600` : 'qt-bg-gray-300'"
      class="qt-relative qt-inline-flex qt-rounded-full qt-h-2 qt-w-2"
    >
    </span>
  </span>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";

export default {
  name: "AudioDots",
  props: {},

  setup() {
    const activeDot = ref(1);
    const dotInterval = ref(null);

    onMounted(() => {
      dotInterval.value = setInterval(() => {
        if (activeDot.value === 3) {
          activeDot.value = 1;
        } else {
          activeDot.value = activeDot.value + 1;
        }
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(dotInterval.value);
    });

    return {
      activeDot,
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
