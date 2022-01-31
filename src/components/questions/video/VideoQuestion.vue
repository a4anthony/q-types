<template>
  <div class="qt-flex qt-flex-col qt-h-full qt-justify-center qt-items-center">
    <!--<div-->
    <!--  id="videoQuestionContent"-->
    <!--  class="qt-py-2.5 qt-audio-question-content qt-font-semibold"-->
    <!--  :class="recording || videoFile ? 'qt-visible' : 'qt-invisible'"-->
    <!--&gt;-->
    <!--  {{ currentQuestion.content }}-->
    <!--</div>-->
    <span id="videoQuestionContent"></span>
    <video-recorder-rtc
      @video-file="setVideoFile"
      :current-question="currentQuestion"
      :height="height"
      @recording="
        (val) => {
          this.recording = val;
        }
      "
      @mime-type="
        (val) => {
          this.mimeType = val;
        }
      "
      @get-storage-url="getStorageUrl"
      :upload-error="uploadError"
      :upload-success="uploadSuccess"
      :file-size="fileSize"
      @upload-s3="uploadFileToS3"
    />
    <!--<video-upload-->
    <!--  v-if="videoFile"-->
    <!--  :file-size="fileSize"-->
    <!--  :upload-success="uploadSuccess"-->
    <!--  :upload-error="uploadError"-->
    <!--  @retry-upload="uploadFileToS3"-->
    <!--/>-->
    <settings @height="useHeight" />
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import Settings from "../../helpers/Settings";
// import AudioRecorder from "audio-recorder-polyfill";
// import { setMicIndicator, unlockAudioContext } from "../../../helpers";
import uniqueId from "lodash/uniqueId";
import axios from "axios";
import VideoRecorderRtc from "../../video/VideoRecorderRtc";

export default {
  name: "VideoQuestion",
  components: {
    VideoRecorderRtc,
    Settings,
  },
  props: {
    currentQuestion: {
      type: Object,
      required: true,
    },
    currentSection: {
      type: Object,
      required: true,
    },
    uniqueKey: {
      type: String,
      default: uniqueId(),
    },
    uniqueString: {
      type: String,
      default: uniqueId(),
    },
    lsConstant: {
      type: String,
      default: "audioQuality_",
    },
    storageUrl: {
      type: String,
      default: "https://teq.test/api/test/side-load",
    },
    publicId: {
      type: String,
      default: "2f5f99c",
    },
  },

  emits: ["answered", "no-audio", "quality"],

  setup(props, { emit }) {
    props = reactive(props);
    const height = ref(100);
    const timer = ref("00:00");
    const timeLimitString = ref("");
    const recording = ref(false);
    const cameraStream = ref(null);
    const mediaRecorder = ref(null);
    // const audioContext = ref(null);
    const blobsRecorded = ref([]);
    const width = ref(0);
    const cameraStarted = ref(false);
    const recStart = ref(false);
    const videoBlob = ref("");
    // const interval = ref(null);
    // const interval2 = ref(null);
    // const volumeValues = ref([]);
    // const audioQuality = ref("");
    const videoUrl = ref("");
    const fileSize = ref("");
    const storageTempUrl = ref("");
    const storageTempFileName = ref("");
    const uploadPercentage = ref(0);
    const uploadError = ref(false);
    const uploadSuccess = ref(false);
    // const noAudio = ref(false);
    const videoFile = ref(null);
    const mimeType = ref("");

    const useHeight = async (pageHeight) => {
      const formattedHeight = Number(pageHeight.replace("px", ""));
      if (document.getElementById("videoQuestionContent")) {
        height.value =
          formattedHeight -
          document.getElementById("videoQuestionContent").clientHeight -
          100 -
          100;
      }
      console.log("video height should be: ", height.value);
    };
    /**
     * Get storage url
     */
    const getStorageUrl = () => {
      console.log("Getting video storage url.");
      axios
        .post(props.storageUrl, {
          public_id: props.publicId,
          question_id: props.currentQuestion.id,
          mime_type: mimeType.value,
        })
        .then((response) => {
          // console.log(response.data);
          storageTempUrl.value = response.data.url;
          storageTempFileName.value = response.data.fileName;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    /**
     * Set video file
     * @param file
     */
    const setVideoFile = (file) => {
      videoFile.value = file;
      fileSize.value = `${Number.parseFloat(file.size * 0.000001).toFixed(
        2
      )}mb`;
      uploadFileToS3(file);
    };
    /**
     * Upload to s3
     */
    const uploadFileToS3 = async () => {
      const formData = new FormData();
      formData.append("file", videoFile.value, videoFile.value.name);
      uploadError.value = false;
      uploadPercentage.value = 0;
      onProgress(0);
      axios
        .put(storageTempUrl.value, videoFile.value, {
          headers: {
            "Content-Type": mimeType.value.includes("mp4")
              ? "video/mp4"
              : "video/webm",
          },
          onUploadProgress: function (progressEvent) {
            // console.log(progressEvent);
            const parseValue = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
            uploadPercentage.value = parseValue;
            onProgress(parseValue);
          }.bind(this),
        })
        .then(function () {
          console.log("SUCCESS!!");
          onProgress(100, true);
          uploadError.value = false;
          uploadSuccess.value = true;
          emit("answered", {
            section_id: props.currentSection.id,
            question_id: props.currentQuestion.id,
            video_key: storageTempFileName.value,
          });
        })
        .catch(function () {
          console.log("FAILURE!!");
          uploadError.value = true;
        });
    };
    /**
     * On upload progress
     * @param value
     * @param success
     */
    const onProgress = (value, success = false) => {
      const progressBars = document.querySelectorAll(".qt-upload-progress");
      const progressPercentage = document.querySelectorAll(
        ".qt-upload-progress-percentage"
      );
      for (let i = 0; i < progressBars.length; i++) {
        if (uploadPercentage.value < 100) {
          // console.log("less", value);
          progressBars[i].style.width = value + "%";
        }
        if (success) {
          progressBars[i].style.width = value + "%";
        }
      }
      for (let i = 0; i < progressPercentage.length; i++) {
        if (uploadPercentage.value < 100) {
          // console.log("less", value);
          progressPercentage[i].innerText = value + "%";
        }
        if (success) {
          progressPercentage[i].innerText = value + "%";
        }
      }
    };

    return {
      useHeight,
      height,
      timer,
      timeLimitString,
      cameraStream,
      mediaRecorder,
      blobsRecorded,
      width,
      cameraStarted,
      // countDown,
      recStart,
      videoBlob,
      recording,
      // startRecording,
      // stopRecording,
      videoUrl,
      fileSize,
      uploadPercentage,
      uploadError,
      uploadSuccess,
      uploadFileToS3,
      videoFile,
      setVideoFile,
      mimeType,
      getStorageUrl,
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
