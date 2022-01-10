<template>
  <div class="qt-text-center">
    <span class="qt-text-red-600 qt-font-semibold qt-block qt-mb-1">{{
      errorMsg
    }}</span>

    <button
      v-if="attempts < totalAttempts"
      @click="$emit('retry')"
      :class="`qt-text-gray-600 hover:qt-text-gray-400`"
      class="focus:qt-outline-none qt-inline-flex qt-justify-center qt-items-center qt-text-sm qt-font-semibold"
    >
      <RefreshIcon
        class="qt-w-4 qt-h-4 qt-mr-1 qt-font-bold"
        :class="spin ? 'qt-animate-spin' : ''"
      />
      retry ({{ attempts }}/ {{ totalAttempts }})
    </button>
    <div
      v-if="attempts > totalAttempts && !showLink"
      class="focus:qt-outline-none qt-inline-flex qt-justify-center qt-items-center qt-text-sm qt-font-semibold"
    >
      Go here<a
        class="qt-text-blue-500 hover:qt-text-blue-400 qt-inline-flex qt-mx-1"
        target="_blank"
        :href="link || '#'"
        >here</a
      >
      to troubleshoot.
    </div>
  </div>
  <div
    v-if="showLink"
    class="qt-text-center qt-w-full focus:qt-outline-none qt-inline-flex qt-justify-center qt-items-center qt-text-sm qt-font-semibold"
  >
    Go here<a
      class="qt-text-blue-500 hover:qt-text-blue-400 qt-inline-flex qt-mx-1"
      target="_blank"
      :href="link || '#'"
      >here</a
    >
    to troubleshoot.
  </div>
</template>

<script>
import { RefreshIcon } from "@heroicons/vue/solid";
import { ref, watch } from "vue";

export default {
  name: "MediaError",
  components: {
    RefreshIcon,
  },
  props: {
    errorMsg: String,
    attempts: Number,
    totalAttempts: Number,
    contactMsg: {
      type: Boolean,
      default: true,
    },
    showLink: {
      type: Boolean,
      default: false,
    },
    helpMsg: {
      type: String,
      default: "",
    },
    reloading: {
      type: Boolean,
      required: true,
    },
    link: String,
  },

  emits: ["retry"],

  setup(props) {
    const spin = ref(false);
    watch(
      () => props.reloading,
      (val) => {
        spin.value = val;
      }
    );
    return {
      spin,
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
