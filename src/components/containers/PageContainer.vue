<template>
  <div
    id="qtPageContainer"
    :style="{
      height: `${height}`,
    }"
    class="qt-relative qt-page-container qt-w-full qt-h-full qt-divide-y qt-divide-gray-200 qt-flex qt-flex-col qt-bg-white qt-shadow-sm qt-rounded-0 qt-border-0 sm:qt-border"
  >
    <!--header-->
    <div
      v-if="$slots.header"
      id="qtPageContainerHeader"
      class="qt-flex-shrink-0 qt-px-2 qt-py-1"
    >
      <slot name="header"></slot>
    </div>
    <!--content-->
    <div
      id="qtPageContainerContent"
      class="qt-min-h-0 qt-flex-1 qt-flex qt-flex-col qt-relative"
    >
      <div
        id="qtContentScroll"
        class="qt-relative qt-flex-1 qt-px-3 sm:qt-px-2 md:qt-px-3 qt-py-2 sm:qt-py-4 qt-overflow-y-auto qt-overflow-x-hidden"
      >
        <div id="qtContent" class="qt-h-full">
          <slot name="content"></slot>
        </div>
      </div>
      <div
        class="qt-absolute qt-right-2 qt-bottom-2 sm:qt-right-5 qt-mx-auto qt-text-center"
      >
        <button
          v-if="scrolling"
          @click="scrollDown"
          :class="`qt-bg-${color}-500 hover:qt-bg-${color}-400`"
          class="qt-btn qt-p-2 qt-rounded-lg qt-bg-opacity-80 qt-mx-auto"
        >
          <ArrowDownIcon
            v-if="!scroll"
            class="qt-w-4 qt-h-4 sm:qt-w-5 sm:qt-h-5"
          />
          <ArrowUpIcon v-else class="qt-w-4 qt-h-4 sm:qt-w-5 sm:qt-h-5" />
        </button>
      </div>
      <slot name="page-loader"></slot>
      <!--<page-loader loader />-->
    </div>
    <!--footer-->
    <div
      v-if="$slots.footer || $slots['footer-left'] || $slots['footer-right']"
      id="qtPageContainerFooter"
      class="qt-flex-shrink-0 qt-px-4 qt-py-2 qt-flex qt-space-x-4 qt-items-center"
      :class="[
        !$slots['footer-left'] && !$slots['footer-right']
          ? 'justify-center'
          : '',
        $slots['footer-left'] && $slots['footer-right']
          ? 'justify-between'
          : '',
        $slots['footer-right'] && !$slots['footer'] && !$slots['footer-left']
          ? 'justify-end'
          : '',
      ]"
    >
      <slot name="footer-left"></slot>
      <slot name="footer"></slot>
      <slot name="footer-right"></slot>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { ArrowDownIcon } from "@heroicons/vue/outline";
import { ArrowUpIcon } from "@heroicons/vue/outline";
export default {
  name: "PageContainer",
  components: {
    ArrowUpIcon,
    ArrowDownIcon,
  },
  setup() {
    const height = ref("1px");
    const scroll = ref(false);
    const scrolling = ref(false);

    onMounted(() => {
      setHeight();
      window.addEventListener("resize", setHeight);
      window.addEventListener("deviceorientation", setHeight, true);
      window.addEventListener("orientationchange", setHeight, true);
      window.addEventListener("touchstart", setHeight, true);
      window.addEventListener("touchend", setHeight, true);

      const textarea = document.getElementById("qtAnswer");
      if (textarea) {
        textarea.addEventListener("focusin", setHeight, true);
        textarea.addEventListener("focusout", setHeight, true);
      }

      const resize_ob = new ResizeObserver(function () {
        setHeight();
      });
      resize_ob.observe(document.getElementById("qtFooter"));
    });

    const setHeight = () => {
      const wHeight = window.innerHeight;
      const navHeight = document.getElementById("qtNavbar").clientHeight;
      let footerHeight = document.getElementById("qtFooter").clientHeight;
      // if (document.getElementById("qtPageContainerFooter")) {
      //   footerHeight = document.getElementById(
      //     "qtPageContainerFooter"
      //   ).clientHeight;
      // }
      // console.dir(document.getElementById("qtNavbar"));
      // console.log(footerHeight);
      if (footerHeight < 55) {
        height.value = `${wHeight - (navHeight + footerHeight)}px`;
      } else {
        height.value = `${wHeight - (navHeight + footerHeight + 32)}px`;
      }
      // console.log(wHeight, navHeight, footerHeight, time, height.value);
    };

    const scrollDown = () => {
      scroll.value = true;
      setHeight();
    };

    return {
      height,
      scroll,
      scrollDown,
      scrolling,
      setHeight,
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
