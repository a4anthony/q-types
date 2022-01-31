<template>
  <div class="qt-hidden">Settings</div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "Settings",
  emits: ["height", "overflow"],
  setup(_, { emit }) {
    const height = ref("");
    onMounted(() => {
      getHeight();

      const resize_ob = new ResizeObserver(function (entries) {
        // since we are observing only a single element, so we access the first element in entries array
        let rect = entries[0].contentRect;
        height.value = `${rect.height}px`;
        emit("overflow", isOverflown());
        emit("height", height.value);
      });
      if (document.getElementById("qtContent")) {
        resize_ob.observe(document.getElementById("qtContent"));
      }
    });

    const getHeight = () => {
      setTimeout(() => {
        height.value = document.getElementById("qtContent")
          ? `${document.getElementById("qtContent").clientHeight}px`
          : "800px";
        emit("height", height.value);
      }, 200);
    };

    const isOverflown = () => {
      const element = document.getElementById("qtContentScroll");
      if (!element) {
        return false;
      }
      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    };

    return {
      height,
      isOverflown,
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
