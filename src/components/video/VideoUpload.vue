<template>
  <div
    v-if="!uploadError"
    class="qt-mt-2 qt-w-full qt-mx-auto qt-max-w-sm qt-py-1.5"
    :class="`qt-border-${color}-600`"
  >
    <div class="qt-flex qt-justify-between qt-items-center">
      <span
        class="qt-w-18 qt-flex-none qt-text-left qt-text-sm qt-font-medium qt-text-gray-400"
        >{{ fileSize }}</span
      >
      <span
        v-if="!uploadSuccess"
        class="qt-text-sm qt-font-medium qt-text-gray-600"
        >Uploading</span
      >
      <span
        v-else
        class="qt-inline-flex qt-items-center qt-justify-center qt-text-sm qt-font-medium qt-text-gray-600"
        >Uploaded
        <CheckCircleIcon class="qt-w-4 qt-h-4 qt-text-green-600 qt-ml-2"
      /></span>
      <span
        class="qt-w-18 qt-flex-none qt-text-right qt-upload-progress-percentage qt-text-sm qt-font-medium qt-text-gray-400"
        >0%</span
      >
    </div>
    <div class="qt-flex qt-items-center qt-mt-2">
      <!--<span :class="`qt-text-${color}-600 hover:qt-text-${color}-400`">-->
      <!--  <UploadIcon class="qt-w-6 qt-h-6" />-->
      <!--</span>-->
      <div
        class="qt-timeline qt-w-100 qt-bg-gray-100 qt-relative qt-cursor-pointer qt-flex-grow qt-h-1"
      >
        <div class="qt-w-full qt-h-1 qt-bg-gray-200"></div>
        <div
          :class="`qt-bg-green-600`"
          class="qt-w-0 qt-h-1 qt-bg-red-400 qt-absolute qt-left-0 qt-top-0 qt-upload-progress"
        ></div>
      </div>
    </div>
  </div>
  <div v-else class="qt-mt-4">
    <media-error
      error-msg="An error occurred uploading video file."
      @retry="
        () => {
          $emit('retry-upload');
          this.retryAttempts += 1;
        }
      "
      :attempts="retryAttempts"
      :total-attempts="3"
      :reloading="false"
    />
  </div>
</template>

<script>
import { CheckCircleIcon } from "@heroicons/vue/outline";
import MediaError from "../helpers/MediaError";
import { ref } from "vue";

export default {
  name: "VideoUpload",
  components: {
    MediaError,
    CheckCircleIcon,
  },
  props: {
    uploadError: {
      type: Boolean,
      default: true,
    },
    uploadSuccess: {
      type: Boolean,
      default: false,
    },
    fileSize: {
      type: String,
      default: "",
    },
  },
  emits: ["retry-upload"],
  setup() {
    const retryAttempts = ref(0);

    return {
      retryAttempts,
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
