<template>
  <button
    :disabled="loading"
    :class="[
      btnColorClass
        ? btnColorClass
        : `qt-bg-${color}-600 hover:qt-bg-${color}-700 `,
    ]"
    class="qt-btn"
    type="button"
    ref="button"
  >
    <span
      v-if="!loading"
      class="qt-h-5 qt-flex qt-items-center qt-block qt-justify-center"
    >
      <slot></slot>
    </span>
    <loading-icon
      :icon-color="btnColorClass ? 'qt-text-gray-600' : 'qt-text-white'"
      v-else
    />
  </button>
</template>

<script>
import LoadingIcon from "./LoadingIcon";
import { ref } from "vue";
export default {
  name: "AppButton",
  components: { LoadingIcon },
  props: {
    btnColorClass: String,
  },
  setup() {
    const loading = ref(false);

    const toggleLoading = (bool) => {
      loading.value = bool;
    };

    return {
      loading,
      toggleLoading,
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
