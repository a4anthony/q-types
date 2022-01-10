<template>
  <div
    class="qt-mb-4 qt-bg-yellow-50 qt-p-2 qt-space-x-2 qt-border qt-border-gray-100 qt-flex qt-items-center qt-justify-center qt-shadow-sm qt-alert-info"
  >
    <InformationCircleIcon
      class="qt-w-6 qt-h-6 qt-text-yellow-600 qt-flex-none"
    />
    <span class="qt-text-sm qt-text-left">
      <span v-html="text"></span>
    </span>
  </div>
</template>

<script>
import { InformationCircleIcon } from "@heroicons/vue/outline";

export default {
  name: "QuestionInfo",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  components: {
    InformationCircleIcon,
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
