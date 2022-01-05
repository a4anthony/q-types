<template>
  <div class="qt-flex qt-flex-col qt-h-full qt-justify-center qt-items-center">
    <div
      id="videoQuestionContent"
      class="qt-py-2.5 qt-audio-question-content qt-font-semibold"
      :class="recording || videoBlob ? 'qt-visible' : 'qt-invisible'"
    >
      {{ currentQuestion.content }}
    </div>
    <div class="qt-relative qt-flex qt-justify-center qt-w-full">
      <div
        v-show="height > 100"
        :style="{ height: `${280}px` }"
        :class="height > 0 ? 'qt-visible' : 'qt-invisible'"
        class="qt-relative"
      >
        <video
          style="height: 100%; object-fit: cover"
          id="video"
          :class="!recording && 'qt-filter qt-blur-sm'"
          class="qt-rounded-lg qt-border qt-border-gray-200"
          width="400"
          autoplay
          playsinline
        ></video>

        <div
          v-if="cameraStarted && !recording"
          class="qt-absolute qt-inset-0 qt-z-10 qt-rounded-lg qt-flex qt-justify-center qt-items-center qt-bg-gray-800 qt-bg-opacity-90"
        >
          <div
            v-if="recStart && !recording"
            class="qt-absolute qt-bottom-4 qt-animate-pulse qt-bg-white qt-bg-opacity-50 qt-w-12 qt-h-12 qt-rounded-full qt-flex qt-justify-center qt-items-center"
          >
            <span class="qt-text-xl qt-font-bold qt-text-white">{{
              countDown
            }}</span>
          </div>
          <div
            v-if="!recording && !videoBlob"
            class="qt-bg-white qt-bg-opacity-95 qt-rounded-lg qt-px-3 qt-py-2.5 qt-mx-8 qt-flex qt-justify-center qt-items-center"
          >
            <span class="qt-text-sm qt-font-semibold qt-text-gray-700">
              {{ currentQuestion.content }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!videoBlob && cameraStarted"
      :class="`qt-border-${color}-600`"
      class="qt-mt-2 qt-w-full qt-mx-auto qt-max-w-sm qt-border-2 qt-rounded-3xl qt-px-2 qt-py-1.5 qt-flex qt-justify-center qt-space-x-2 qt-items-center"
    >
      <div>
        <button
          v-if="!recording"
          :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
          class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
          @click="startRecording"
          disabled
        >
          <VideoCameraIcon class="qt-w-4 qt-h-4" />
        </button>
        <button
          v-else
          :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
          class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
          @click="stopRecording"
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

    <div
      v-if="videoBlob && cameraStarted"
      class="qt-mt-2 qt-w-full qt-mx-auto qt-max-w-sm qt-border-2 qt-rounded-3xl qt-px-2 qt-py-1.5 qt-flex qt-space-x-2 qt-items-center"
      :class="`qt-border-${color}-600`"
    >
      <span :class="`qt-text-${color}-600 hover:qt-text-${color}-400`">
        <CheckCircleIcon class="qt-w-6 qt-h-6" />
      </span>
      <div class="qt-flex-grow">
        <span class="qt-font-semibold qt-text-base qt-text-left"
          >Video file</span
        >
      </div>
      <span
        :class="`qt-text-${color}-600`"
        class="qt-tracking-wider qt-font-semibold qt-text-base qt-w-25 qt-flex-none qt-text-right"
      >
        {{ timer }}
        <!--<a :href="videoBlob" target="_blank" class="qt-link"-->
        <!--  >view video (temp)</a-->
        <!--&gt;-->
      </span>
    </div>
    <settings @height="useHeight" />
  </div>
</template>

<script>
import { onMounted, reactive, ref, computed, watch } from "vue";
import Settings from "../../helpers/Settings";
import { VideoCameraIcon } from "@heroicons/vue/solid";
import { CheckCircleIcon } from "@heroicons/vue/outline";
import AudioRecorder from "audio-recorder-polyfill";

export default {
  name: "VideoQuestion",
  components: { Settings, VideoCameraIcon, CheckCircleIcon },
  props: {
    currentQuestion: {
      type: Object,
      required: true,
    },
    currentSection: {
      type: Object,
      required: true,
    },
  },
  // cameraStream: null,
  // mediaRecorder: null,
  // blobsRecorded: [],
  // recording: false,
  // timer: '00:00',
  // timeLimitString: '',
  // width: 0,
  // cameraStarted: false,
  // countDown: 3,
  // recStart: false,
  // videoBlob: '',
  // height: 100,
  emits: ["answered"],

  setup(props, { emit }) {
    props = reactive(props);
    const height = ref(100);
    const timer = ref("00:00");
    const timeLimitString = ref("");
    const recording = ref(false);
    const cameraStream = ref(null);
    const mediaRecorder = ref(null);
    const blobsRecorded = ref([]);
    const width = ref(0);
    const cameraStarted = ref(false);
    const recStart = ref(false);
    const videoBlob = ref("");
    const interval = ref(null);
    const interval2 = ref(null);
    const timeLimit = computed(() =>
      props.currentQuestion.time_limit_seconds > 0
        ? props.currentQuestion.time_limit_seconds
        : 30
    );
    const countDown = ref(props.currentQuestion.time_to_prepare);

    watch(cameraStarted, () => {
      // console.log("cam started", newValue);
      setTimeout(() => {
        startRecording();
      }, 200);
    });
    onMounted(() => {
      // countDown.value = props.currentQuestion.time_to_prepare;
      setInitialTime();
    });

    const setInitialTime = () => {
      const time = timeLimit.value;
      const minutes = Math.floor(time / 60);
      const seconds = time - minutes * 60;
      timeLimitString.value = `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    };

    const useHeight = async (pageHeight) => {
      const formattedHeight = Number(pageHeight.replace("px", ""));
      if (document.getElementById("videoQuestionContent")) {
        height.value =
          formattedHeight -
          document.getElementById("videoQuestionContent").clientHeight -
          100;
        // console.log(pageHeight, formattedHeight, height.value);
      }
      if (!cameraStarted.value) {
        await startCamera();
      }
    };

    const startCamera = async () => {
      // console.log("starting video  camera");
      let video = document.getElementById("video");
      // const videoWidth = video.clientWidth;
      // const videoHeight = video.clientHeight;
      // console.log(videoWidth, videoHeight);
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { width: 640, height: 480, facingMode: "user" },
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
          // startRecording();
        })
        .then(
          () =>
            new Promise((resolve) => {
              video.onloadedmetadata = resolve;
            })
        )
        .then(() => {
          // console.log(video.videoWidth + "x" + video.videoHeight);
        });
    };

    const startRecording = async () => {
      if (!window.MediaRecorder) {
        window.MediaRecorder = AudioRecorder;
      }

      const mimeType = MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "";
      // set MIME type of recording as video/webm
      const options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        mimeType,
      };
      // { mimeType: 'video/webm' }
      mediaRecorder.value = new MediaRecorder(cameraStream.value, options);

      mediaRecorder.value.addEventListener("start", () => {
        console.log("recording started");
        recording.value = true;
        recStart.value = false;
        setTimer();
      });

      // event : new recorded video blob available
      mediaRecorder.value.addEventListener("dataavailable", function (e) {
        blobsRecorded.value.push(e.data);
      });

      // event : recording stopped & all blobs sent
      mediaRecorder.value.addEventListener("stop", function () {
        // create local object URL from the recorded video blobs
        let videoLocal = URL.createObjectURL(
          new Blob(blobsRecorded.value, { type: "video/webm" })
        );
        // console.log(mimeType);
        let videoLocalBlob = new Blob(blobsRecorded.value, {
          type: "video/mp4",
        });
        // console.log(videoLocal)
        videoBlob.value = videoLocal;
        recording.value = false;
        const reader = new FileReader();
        reader.readAsDataURL(videoLocalBlob);

        const videoFile = new File([videoLocalBlob], "video/mp4", {
          type: videoLocalBlob.type,
        });

        console.log(videoFile);

        // console.log(videoLocalBlob)
        reader.onloadend = function () {
          const base64data = reader.result;
          emit("answered", {
            section_id: props.currentSection.id,
            question_id: props.currentQuestion.id,
            video_blob: base64data,
            video_blob_2: videoLocalBlob,
            video_file: videoFile,
          });
          // console.log(base64data)
        };
        // download_link.href = video_local;
      });

      recStart.value = true;
      width.value = 0;
      timer.value = "00:00";
      videoBlob.value = "";
      setInitialTime();
      interval.value = setInterval(() => {
        if (countDown.value === 1) {
          // start recording with each recorded blob having 1 second video
          mediaRecorder.value.start(1000);
          clearInterval(interval.value);
        } else {
          countDown.value = countDown.value - 1;
        }
      }, 1100);
    };

    const stopRecording = () => {
      if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
        mediaRecorder.value.stop();
      }
      countDown.value = 3;
      clearInterval(interval2.value);
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
      useHeight,
      height,
      timer,
      timeLimitString,
      cameraStream,
      mediaRecorder,
      blobsRecorded,
      width,
      cameraStarted,
      countDown,
      recStart,
      videoBlob,
      recording,
      startRecording,
      stopRecording,
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
