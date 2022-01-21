<template>
  <div>
    <div class="qt-relative qt-flex qt-justify-center qt-w-full">
      <div
        v-show="height > 100"
        :style="{ height: `${280}px` }"
        :class="height > 0 ? 'qt-visible' : 'qt-invisible'"
        class="qt-relative"
      >
        <video
          style="height: 100%; object-fit: cover"
          id="qtVideo"
          class="qt-rounded-lg"
          width="400"
          autoplay
          playsinline
        ></video>
        <div
          v-if="cameraStarted && !recording"
          class="qt-absolute qt-bottom-0 qt-left-0 qt-right-0 qt-z-10 qt-rounded-b-lg qt-flex qt-justify-center qt-items-center qt-bg-black qt-bg-opacity-60"
        >
          <div
            v-if="recStart && !recording"
            class="qt-absolute qt-bottom-16 qt-animate-pulse qt-bg-black qt-bg-opacity-50 qt-w-12 qt-h-12 qt-rounded-full qt-flex qt-justify-center qt-items-center"
          >
            <span class="qt-text-xl qt-font-bold qt-text-white">{{
              countDown
            }}</span>
          </div>
          <div
            v-if="!recording && !videoBlob"
            class="qt-rounded-lg qt-px-3 qt-py-2.5 qt-mx-8 qt-flex qt-justify-center qt-items-center"
          >
            <span class="qt-text-sm qt-font-semibold qt-text-white">
              {{ currentQuestion.content }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!--volume bars-->
    <div v-if="!videoFile && cameraStarted" class="qt-mt-4">
      <volume-bars
        :unique-string="uniqueString"
        :unique-key="uniqueKey"
        class="qt-mb-4"
      />
    </div>
    <!--video recorder actions-->
    <video-actions-rtc
      :recording="recording"
      :video-file="videoFile"
      :timer="timer"
      :time-limit-string="timeLimitString"
      :camera-started="cameraStarted"
      :width="width"
      @start-recording="startRecording"
      @stop-recording="stopRecording"
    />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { setMicIndicator, unlockAudioContext } from "../../helpers";
import VideoActionsRtc from "./VideoActionsRtc";
import VolumeBars from "../audio/helpers/VolumeBars";
import uniqueId from "lodash/uniqueId";
let RecordRTC = require("recordrtc");

export default {
  name: "VideoRecorderRtc",
  components: { VolumeBars, VideoActionsRtc },
  props: {
    height: {
      type: Number,
      default: 200,
    },
    currentQuestion: {
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
  },
  emits: ["video-file", "no-audio", "quality", "recording"],
  setup(props, { emit }) {
    props = reactive(props);
    const recording = ref(false);
    const cameraStarted = ref(false);
    const volumeValues = ref([]);
    const audioQuality = ref("");
    const audioContext = ref(null);
    const noAudio = ref(false);
    const cameraStream = ref(null);
    const videoBlob = ref(null);
    const timer = ref("00:00");
    const timeLimitString = ref("");
    const width = ref(0);
    const recordRTC = ref(null);
    const interval = ref(null);
    const interval2 = ref(null);
    const videoFile = ref(null);
    const timeLimit = computed(() =>
      props.currentQuestion.time_limit_seconds > 0
        ? props.currentQuestion.time_limit_seconds
        : 30
    );
    const countDown = ref(props.currentQuestion.time_to_prepare);
    const recStart = ref(false);

    /**
     * Watchers
     */
    watch(audioQuality, (newVal) => {
      emit("quality", newVal);
    });
    watch(recording, (newVal) => {
      emit("recording", newVal);
    });
    watch(cameraStarted, () => {
      setTimeout(() => {
        startRecording();
      }, 200);
    });
    onMounted(() => {
      startCamera();
      setInitialTime();
    });
    onUnmounted(() => {
      clearInterval(interval.value);
      clearInterval(interval2.value);
    });
    /**
     * Set initial time
     */
    const setInitialTime = () => {
      const time = timeLimit.value;
      const minutes = Math.floor(time / 60);
      const seconds = time - minutes * 60;
      timeLimitString.value = `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    };
    /**
     * Set audio context
     */
    const setAudioContext = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext.value = new AudioContext();
      unlockAudioContext(audioContext.value);
    };
    /**
     * Start camera
     */
    const startCamera = () => {
      let video = document.getElementById("qtVideo");
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: { min: 320 / 2, ideal: 320 / 2 },
            height: { min: 240 / 2, ideal: 240 / 2 },
            aspectRatio: 3 / 2,
            frameRate: { exact: 10 },
            facingMode: "user",
          },
        })
        .then(async (stream) => {
          cameraStream.value = stream;
          video.srcObject = stream;
          video.muted = true;
          try {
            await video.play();
          } catch (e) {
            console.log(e);
          }
          cameraStarted.value = true;
          setAudioContext();
          setMicIndicator(
            audioContext,
            stream,
            recording,
            props,
            volumeValues,
            audioQuality,
            emit,
            noAudio
          );
        })
        .then(
          () =>
            new Promise((resolve) => {
              video.onloadedmetadata = resolve;
            })
        )
        .then(() => {
          console.log(video.videoWidth + "x" + video.videoHeight);
        })
        .catch((err) => {
          console.log("camera error is :" + err);
        });
    };

    const startRecording = () => {
      let video = document.getElementById("qtVideo");
      const options = {
        mimeType: "video/webm;codecs=vp9", // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        timeSlice: 2000,
        bitsPerSecond: 128000, // if this line is provided, skip above two
      };
      video.srcObject = cameraStream.value;
      recordRTC.value = RecordRTC(cameraStream.value, options);

      recStart.value = true;
      width.value = 0;
      timer.value = "00:00";
      videoBlob.value = null;

      setInitialTime();
      interval.value = setInterval(() => {
        if (countDown.value === 1) {
          // start recording with each recorded blob having 1 second video
          recordRTC.value.startRecording();
          console.log("recording started");
          recording.value = true;
          recStart.value = false;
          setTimer();
          clearInterval(interval.value);
        } else {
          countDown.value = countDown.value - 1;
        }
      }, 1100);
    };

    const stopRecording = () => {
      countDown.value = 3;
      clearInterval(interval2.value);
      recordRTC.value.stopRecording(processVideo.bind(this));
      let stream = cameraStream.value;
      stream.getAudioTracks().forEach((track) => track.stop());
      stream.getVideoTracks().forEach((track) => track.stop());
    };

    const processVideo = (audioVideoWebMURL) => {
      let video = document.getElementById("qtVideo");
      video.src = audioVideoWebMURL;
      const recordedBlob = recordRTC.value.getBlob();
      recordRTC.value.getDataURL(function (dataURL) {
        console.log(dataURL);
      });
      console.log(recordedBlob);
      videoFile.value = new File([recordedBlob], "answer_video", {
        type: recordedBlob.type,
      });
      emit("video-file", videoFile.value);
    };

    const setTimer = () => {
      let time = 0;
      timer.value = "00:00";
      interval2.value = setInterval(() => {
        if (!recording.value) {
          return;
        }
        time = time + 1;
        setWidth();
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;
        let minString = minutes > 9 ? minutes : `0${minutes}`;
        let secsString = seconds > 9 ? seconds : `0${seconds}`;
        timer.value = `${minString}:${secsString}`;
        if (time === timeLimit.value) {
          stopRecording();
          clearInterval(interval2.value);
        }
      }, 1000);
    };
    const setWidth = () => {
      const gap = 100 / timeLimit.value;
      width.value = width.value + gap;
    };

    return {
      recording,
      cameraStarted,
      videoBlob,
      timer,
      timeLimitString,
      width,
      recStart,
      countDown,
      stopRecording,
      startRecording,
      videoFile,
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
