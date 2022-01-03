<template>
  <nav
    id="qtNavbar"
    :class="view === 'question' ? 'qt-hidden sm:qt-flex' : 'qt-flex'"
    class="qt-justify-between qt-items-center qt-py-0.5 sm:qt-py-2 qt-bg-white qt-px-2 qt-border-b"
  >
    <div class="qt-flex qt-justify-center">
      <img
        v-if="test && test.client_logo"
        class="qt-h-7 qt-w-auto"
        :src="test.client_logo"
        :alt="test.company_name"
      />
      <slot name="logo"></slot>
      <logo v-if="test && !test.client_logo" />
    </div>
    <div class="qt-text-right">
      <span
        v-if="test"
        data-test="testTakerName"
        :class="`qt-text-${color}-600`"
        class="qt-ml-1 qt-text-sm qt-font-bold qt-block"
        >{{ test.taker }}</span
      >
      <span
        v-else
        data-test="testTakerName"
        class="qt-ml-1 qt-text-sm qt-font-bold qt-block qt-text-transparent"
        >English Assessment</span
      >
      <span v-if="test && test.test_name" class="qt-block qt-text-sm"
        >{{ test.test_name }}
      </span>
      <span
        v-else
        data-test="testTakerName"
        class="qt-ml-1 qt-text-sm qt-font-bold qt-block qt-text-transparent"
        >English Assessment</span
      >
    </div>
  </nav>
</template>

<script>
import Logo from "../helpers/Logo";
export default {
  name: "Navbar",
  components: { Logo },
  props: {
    view: {
      type: String,
      required: true,
    },
    test: {
      type: Object,
      default() {
        return {
          taker: "John Doe",
          test_name: "English Proficiency Test",
          company_name: "TEQ",
          client_logo: "",
        };
      },
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
