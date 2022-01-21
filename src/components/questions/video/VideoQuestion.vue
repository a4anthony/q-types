<template>
  <div class="qt-flex qt-flex-col qt-h-full qt-justify-center qt-items-center">
    <div
      id="videoQuestionContent"
      class="qt-py-2.5 qt-audio-question-content qt-font-semibold"
      :class="recording || videoFile ? 'qt-visible' : 'qt-invisible'"
    >
      {{ currentQuestion.content }}
    </div>
    <video-recorder-rtc
      @video-file="setVideoFile"
      :current-question="currentQuestion"
      :height="height"
      @recording="
        (val) => {
          this.recording = val;
        }
      "
    />
    <video-upload
      v-if="videoFile"
      :file-size="fileSize"
      :upload-success="uploadSuccess"
      :upload-error="uploadError"
      @retry-upload="uploadFileToS3"
    />
    <!--<video-player v-if="videoUrl" :video-src="videoUrl" :height="height" />-->
    <!--<video-recorder-->
    <!--  :camera-started="cameraStarted"-->
    <!--  :current-question="currentQuestion"-->
    <!--  :height="height"-->
    <!--  :recording="recording"-->
    <!--  :rec-start="recStart"-->
    <!--  :video-blob="videoBlob"-->
    <!--  :count-down="countDown"-->
    <!--/>-->

    <!--<video-actions-->
    <!--  :recording="recording"-->
    <!--  :video-blob="videoBlob"-->
    <!--  :unique-key="uniqueKey"-->
    <!--  :unique-string="uniqueString"-->
    <!--  :width="width"-->
    <!--  :timer="timer"-->
    <!--  :time-limit-string="timeLimitString"-->
    <!--  :camera-started="cameraStarted"-->
    <!--  @start="startRecording"-->
    <!--  @stop="stopRecording"-->
    <!--  :file-size="fileSize"-->
    <!--  :upload-progress="uploadPercentage"-->
    <!--  :upload-error="uploadError"-->
    <!--  :upload-success="uploadSuccess"-->
    <!--  @retry-upload="uploadFileToS3"-->
    <!--/>-->

    <settings @height="useHeight" />
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import Settings from "../../helpers/Settings";
// import AudioRecorder from "audio-recorder-polyfill";
// import { setMicIndicator, unlockAudioContext } from "../../../helpers";
import uniqueId from "lodash/uniqueId";
import axios from "axios";
import VideoRecorderRtc from "../../video/VideoRecorderRtc";
import VideoUpload from "../../video/VideoUpload";

export default {
  name: "VideoQuestion",
  components: {
    VideoUpload,
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
      default: "https://teq.test/api/test/side-load/2f5f99c/1695",
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

    // const timeLimit = computed(() =>
    //   props.currentQuestion.time_limit_seconds > 0
    //     ? props.currentQuestion.time_limit_seconds
    //     : 30
    // );
    // const countDown = ref(props.currentQuestion.time_to_prepare);
    // watch(audioQuality, (newVal) => {
    //   emit("quality", newVal);
    // });
    // watch(cameraStarted, () => {
    //   // console.log("cam started", newValue);
    //   setTimeout(() => {
    //     // setAudioContext();
    //     startRecording();
    //   }, 200);
    // });
    onMounted(() => {
      // countDown.value = props.currentQuestion.time_to_prepare;
      // setInitialTime();
      getStorageUrl();
    });
    //
    // const setInitialTime = () => {
    //   const time = timeLimit.value;
    //   const minutes = Math.floor(time / 60);
    //   const seconds = time - minutes * 60;
    //   timeLimitString.value = `${minutes < 10 ? "0" + minutes : minutes}:${
    //     seconds < 10 ? "0" + seconds : seconds
    //   }`;
    // };
    //
    // const setAudioContext = () => {
    //   const AudioContext = window.AudioContext || window.webkitAudioContext;
    //   audioContext.value = new AudioContext();
    //   unlockAudioContext(audioContext.value);
    // };
    //
    const useHeight = async (pageHeight) => {
      const formattedHeight = Number(pageHeight.replace("px", ""));
      if (document.getElementById("videoQuestionContent")) {
        height.value =
          formattedHeight -
          document.getElementById("videoQuestionContent").clientHeight -
          100;
      }
    };
    //
    // const startCamera = async () => {
    //   // console.log("starting video  camera");
    //   // await navigator.mediaDevices.enumerateDevices().then((devices) => {
    //   //   devices = devices.filter((d) => d.kind === "videoinput");
    //   //   console.log(devices);
    //   // });
    //   let video = document.getElementById("video");
    //   // const videoWidth = video.clientWidth;
    //   // const videoHeight = video.clientHeight;
    //   // console.log(videoWidth, videoHeight);
    //   // console.log(navigator, navigator.mediaDevices);
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       audio: true,
    //       // video: { width: 640 / 2, height: 480 / 2, facingMode: "user" },
    //       // video: { width: 640 / 2, height: 480 / 2, facingMode: "user" },
    //       video: {
    //         width: { min: 320 / 2, ideal: 320 / 2 },
    //         height: { min: 240 / 2, ideal: 240 / 2 },
    //         aspectRatio: 3 / 2,
    //         frameRate: { exact: 10 },
    //         facingMode: "user",
    //       },
    //     })
    //     .then(async (stream) => {
    //       cameraStream.value = stream;
    //       video.srcObject = stream;
    //       video.muted = true;
    //       try {
    //         await video.play();
    //       } catch (e) {
    //         console.log(e);
    //       }
    //       cameraStarted.value = true;
    //       setAudioContext();
    //       setMicIndicator(
    //         audioContext,
    //         stream,
    //         recording,
    //         props,
    //         volumeValues,
    //         audioQuality,
    //         emit,
    //         noAudio
    //       );
    //     })
    //     .then(
    //       () =>
    //         new Promise((resolve) => {
    //           video.onloadedmetadata = resolve;
    //         })
    //     )
    //     .then(() => {
    //       console.log(video.videoWidth + "x" + video.videoHeight);
    //     })
    //     .catch((err) => {
    //       console.log("camera error is :" + err);
    //     });
    // };
    //
    // const startRecording = async () => {
    //   if (!window.MediaRecorder) {
    //     window.MediaRecorder = AudioRecorder;
    //   }
    //
    //   let mimeType = "video/webm;codecs=vp8";
    //   if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
    //     mimeType = "video/webm;codecs=h264";
    //   } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    //     mimeType = "video/webm;codecs=vp9";
    //   } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    //     mimeType = "video/webm;codecs=vp8";
    //   } else if (MediaRecorder.isTypeSupported("video/webm")) {
    //     mimeType = "video/webm";
    //   } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    //     mimeType = "video/mp4";
    //   }
    //   console.log(mimeType);
    //   console.log(MediaRecorder.isTypeSupported("video/webm;codecs=h264"));
    //   // set MIME type of recording as video/webm
    //   const options = {
    //     audioBitsPerSecond: 128000,
    //     videoBitsPerSecond: 2500000,
    //     mimeType,
    //   };
    //   mediaRecorder.value = new MediaRecorder(cameraStream.value, options);
    //
    //   mediaRecorder.value.addEventListener("start", () => {
    //     console.log("recording started");
    //     recording.value = true;
    //     recStart.value = false;
    //     setTimer();
    //   });
    //
    //   // event : new recorded video blob available
    //   mediaRecorder.value.addEventListener("dataavailable", function (e) {
    //     blobsRecorded.value.push(e.data);
    //   });
    //
    //   // event : recording stopped & all blobs sent
    //   mediaRecorder.value.addEventListener("stop", function () {
    //     // create local object URL from the recorded video blobs
    //     let videoLocalBlob = new Blob(blobsRecorded.value, {
    //       type: mimeType,
    //     });
    //     let videoLocal = URL.createObjectURL(videoLocalBlob);
    //     videoUrl.value = videoLocal;
    //
    //     videoBlob.value = videoLocal;
    //     recording.value = false;
    //     const reader = new FileReader();
    //     reader.readAsDataURL(videoLocalBlob);
    //
    //     videoFile.value = new File([videoLocalBlob], "answer_video", {
    //       type: videoLocalBlob.type,
    //     });
    //     console.log(videoFile.value);
    //     console.log(JSON.stringify(videoFile.value));
    //     console.log(videoLocalBlob.size, videoLocalBlob.size * 0.000001);
    //     fileSize.value = `${Number.parseFloat(
    //       videoLocalBlob.size * 0.000001
    //     ).toFixed(2)}mb`;
    //     uploadFileToS3(videoFile.value);
    //   });
    //
    //   recStart.value = true;
    //   width.value = 0;
    //   timer.value = "00:00";
    //   videoBlob.value = "";
    //   setInitialTime();
    //   interval.value = setInterval(() => {
    //     if (countDown.value === 1) {
    //       // start recording with each recorded blob having 1 second video
    //       mediaRecorder.value.start(1000);
    //       clearInterval(interval.value);
    //     } else {
    //       countDown.value = countDown.value - 1;
    //     }
    //   }, 1100);
    // };
    //
    // const stopRecording = () => {
    //   if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    //     mediaRecorder.value.stop();
    //   }
    //   countDown.value = 3;
    //   clearInterval(interval2.value);
    // };
    // const setTimer = () => {
    //   let time = 0;
    //   timer.value = "00:00";
    //   interval2.value = setInterval(() => {
    //     if (!recording.value) {
    //       return;
    //     }
    //     time = time + 1;
    //     setWidth();
    //     const minutes = Math.floor(time / 60);
    //     const seconds = time - minutes * 60;
    //     let minString = minutes > 9 ? minutes : `0${minutes}`;
    //     let secsString = seconds > 9 ? seconds : `0${seconds}`;
    //     timer.value = `${minString}:${secsString}`;
    //     if (time === timeLimit.value) {
    //       stopRecording();
    //       clearInterval(interval2.value);
    //     }
    //   }, 1000);
    // };
    // const setWidth = () => {
    //   const gap = 100 / timeLimit.value;
    //   width.value = width.value + gap;
    // };
    /**
     * Get storage url
     */
    const getStorageUrl = () => {
      fetch(props.storageUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          storageTempUrl.value = data.url;
          storageTempFileName.value = data.fileName;
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
        .put(storageTempUrl.value, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
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
