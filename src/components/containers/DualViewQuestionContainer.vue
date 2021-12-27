<template>
  <!--class="qt-grid qt-grid-cols-2 qt-gap-1"-->

  <div
    :style="{ height }"
    :class="
      xl
        ? ' xl:qt-flex-row xl:qt-flex-row-reverse xl:qt-grid xl:qt-gap-2 xl:qt-grid-cols-2'
        : ' sm:qt-flex-row sm:qt-flex-row-reverse sm:qt-grid sm:qt-gap-2 sm:qt-grid-cols-2'
    "
    class="qt-flex qt-flex-col qt-h-100 qt-justify-start qt-content-start--"
  >
    <div
      :class="[
        xl ? 'qt-mb-4 xl:qt-mb-0' : 'qt-mb-4 sm:qt-mb-0',
        rightContentHeight > height && 'qt-overflow-y-auto',
      ]"
      :style="{
        height: rightContentHeight > height ? height : rightContentHeight,
      }"
    >
      <div id="qtRightContent">
        <slot name="right-content"></slot>
      </div>
    </div>
    <div
      :class="[
        grayBackground ? 'qt-bg-gray-100' : '',
        xl
          ? 'xl:qt-order-first xl:qt-border-t-0 xl:qt-py-0'
          : 'sm:qt-order-first sm:qt-border-t-0 sm:qt-py-0',
      ]"
      class="qt-flex-grow-1 qt-overflow-y-auto qt-order-last qt-border-t qt-py-2"
    >
      <div id="qtLeftContent">
        <slot name="left-content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "DualViewQuestionContainer",
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
    grayBackground: {
      type: Boolean,
      default: false,
    },
    withDivider: {
      type: Boolean,
      default: false,
    },
    xl: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const height = ref("");
    const rightContentHeight = ref("");

    onMounted(() => {
      getHeight();

      const resize_ob = new ResizeObserver(function (entries) {
        // since we are observing only a single element, so we access the first element in entries array
        let rect = entries[0].contentRect;
        height.value = `${rect.height}px`;
      });
      resize_ob.observe(document.getElementById("qtContent"));

      const resize_ob1 = new ResizeObserver(function (entries) {
        // since we are observing only a single element, so we access the first element in entries array
        let rect = entries[0].contentRect;
        rightContentHeight.value = `${rect.height}px`;
      });
      resize_ob1.observe(document.getElementById("qtRightContent"));
    });

    const getHeight = () => {
      setTimeout(() => {
        // console.dir(document.getElementById("qtContent").clientHeight);
        height.value = `${document.getElementById("qtContent").clientHeight}px`;
      }, 200);
    };
    return {
      height,
      rightContentHeight,
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
