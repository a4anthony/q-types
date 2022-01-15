<template>
  <!--volume bars-->
  <div v-if="!videoBlob && cameraStarted" class="qt-mt-4">
    <volume-bars
      :unique-string="uniqueString"
      :unique-key="uniqueKey"
      class="qt-mb-4"
    />
  </div>
  <div
    v-if="!videoBlob && cameraStarted"
    :class="`qt-border-${color}-600`"
    class="qt-mt-0 qt-w-full qt-mx-auto qt-max-w-sm qt-border-2 qt-rounded-3xl qt-px-2 qt-py-1.5 qt-flex qt-justify-center qt-space-x-2 qt-items-center"
  >
    <div>
      <button
        v-if="!recording"
        :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
        class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
        @click="$emit('start')"
        disabled
      >
        <VideoCameraIcon class="qt-w-4 qt-h-4" />
      </button>
      <button
        v-else
        :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
        class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
        @click="$emit('stop')"
        :disabled="!recording"
      >
        <span class="qt-block qt-w-2 qt-h-2 qt-bg-white"></span>
      </button>
    </div>
    <div class="qt-relative qt-flex-grow">
      <span
        class="qt-block qt-w-full qt-rounded-lg qt-h-1 qt-bg-gray-200"
      ></span>
      <span
        :style="{
          width: `${width}%`,
        }"
        :class="`qt-bg-${color}-600`"
        class="qt-block qt-w-9 qt-rounded-lg qt-h-1 qt-absolute qt-left-0 qt-top-0 qt-progress-bar"
      ></span>
    </div>
    <div
      :class="`qt-text-${color}-600`"
      class="qt-flex qt-justify-between qt-font-semibold qt-text-base qt-w-25 qt-flex-none qt-text-right"
    >
      <span>{{ timer }}</span
      >/ <span>{{ timeLimitString }}</span>
    </div>
  </div>
  <!--v-if="videoBlob && cameraStarted"-->

  <div
    v-if="videoBlob && cameraStarted && !uploadError"
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

    <!--<span :class="`qt-text-${color}-600 hover:qt-text-${color}-400`">-->
    <!--  <CheckCircleIcon class="qt-w-6 qt-h-6" />-->
    <!--</span>-->
    <!--<div class="qt-flex-grow">-->
    <!--  <span class="qt-font-semibold qt-text-base qt-text-left">Video file</span>-->
    <!--</div>-->
    <!--<span-->
    <!--  :class="`qt-text-${color}-600`"-->
    <!--  class="qt-tracking-wider qt-font-semibold qt-text-base qt-w-25 qt-flex-none qt-text-right"-->
    <!--&gt;-->
    <!--  {{ timer }}-->
    <!--  &lt;!&ndash;<a :href="videoBlob" target="_blank" class="qt-link">view video (temp)</a>&ndash;&gt;-->
    <!--</span>-->
    <!--<span>{{ fileSize }}</span>-->
  </div>
  <!--v-if="videoBlob && cameraStarted && uploadError"-->
  <div v-if="videoBlob && cameraStarted && uploadError" class="qt-mt-4">
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
import VolumeBars from "../audio/helpers/VolumeBars";
import { VideoCameraIcon } from "@heroicons/vue/solid";
import { CheckCircleIcon } from "@heroicons/vue/outline";
import MediaError from "../helpers/MediaError";
import { ref } from "vue";
export default {
  name: "VideoActions",
  components: {
    MediaError,
    VolumeBars,
    VideoCameraIcon,
    CheckCircleIcon,
  },
  props: {
    uniqueString: {
      type: String,
      required: true,
    },
    uniqueKey: {
      type: String,
      required: true,
    },
    cameraStarted: {
      type: Boolean,
      required: true,
    },
    videoBlob: {
      type: String,
      required: true,
    },
    recording: {
      type: Boolean,
      required: true,
    },
    timer: {
      type: String,
      required: true,
    },
    timeLimitString: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    withPlayback: {
      type: Boolean,
      default: false,
    },
    fileSize: {
      type: String,
      default: "",
    },
    uploadProgress: {
      type: Number,
      default: 0,
    },
    uploadError: {
      type: Boolean,
      default: true,
    },
    uploadSuccess: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["start", "stop", "retry-upload"],
  setup() {
    const retryAttempts = ref(0);

    return {
      retryAttempts,
    };
  },
};
</script>

<style scoped>
.qt-upload-progress {
  transition: 0.25s;
}
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
