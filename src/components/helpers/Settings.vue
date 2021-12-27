<template>
  <div class="qt-hidden">Settings</div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "Settings",
  emits: ["height"],
  setup(_, { emit }) {
    const height = ref("");
    onMounted(() => {
      getHeight();

      const resize_ob = new ResizeObserver(function (entries) {
        // since we are observing only a single element, so we access the first element in entries array
        let rect = entries[0].contentRect;
        height.value = `${rect.height}px`;
        emit("height", height.value);
      });
      resize_ob.observe(document.getElementById("qtContent"));
    });

    const getHeight = () => {
      setTimeout(() => {
        height.value = `${document.getElementById("qtContent").clientHeight}px`;
        emit("height", height.value);
      }, 200);
    };
    return {
      height,
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
