<template>
  <div
    class="qt-relative qt-mx-auto qt-flex qt-justify-center qt-rounded-full qt-overflow-hidden qt-w-full qt-h-full"
    :class="`qt-bg-${color}-100`"
  >
    <inline-svg
      v-if="avatar"
      :size="80"
      :path="require(`!html-loader!./../../../assets/svgs/${avatar}.svg`)"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import InlineSvg from "vue-inline-svgs";

export default {
  name: "AudioAvatar",
  components: {
    InlineSvg,
  },
  props: {},

  setup() {
    const avatar = ref("Susan-1");

    return {
      avatar,
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
