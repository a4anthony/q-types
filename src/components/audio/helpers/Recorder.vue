<template>
  <div
    :class="`qt-border-${color}-600`"
    class="qt-w-full qt-border-2 qt-rounded-3xl qt-px-2 qt-py-1.5 qt-flex qt-space-x-2 qt-items-center"
  >
    <button
      v-if="!recording"
      type="button"
      :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
      @click="startRecording"
      :disabled="audioFile || !allowRecording"
      class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
    >
      <MicrophoneIcon class="qt-w-4 qt-h-4" />
    </button>
    <button
      v-else
      type="button"
      @click="stopRecording"
      :disabled="time < 1"
      :class="`qt-bg-${color}-600 hover:qt-bg-${color}-400 qt-text-white`"
      class="qt-rounded-full qt-w-6 qt-h-6 qt-flex qt-items-center qt-justify-center"
    >
      <span class="qt-block qt-w-2 qt-h-2 qt-bg-white"></span>
    </button>
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
      <span class="qt-w-12 qt-text-center">{{ timer }}</span
      >/
      <span class="qt-w-12 qt-text-center">{{ timeLimitString }}</span>
    </div>
  </div>
  <div class="qt-mx-auto qt-my-3 qt-text-center">
    <app-button
      @click="startRecording"
      v-if="!recording && !audioUrl && (!view || view !== 'question')"
      class="qt-btn qt-btn-md"
      :disabled="audioFile || !allowRecording"
      btn-color-class="qt-btn-white"
    >
      <span
        class="qt-block qt-w-3 qt-h-3 qt-mr-2 qt-rounded-full qt-bg-gray-600"
      ></span>
      Start Recording
    </app-button>
    <app-button
      @click="stopRecording"
      v-if="recording && !audioUrl"
      btn-color-class="qt-btn-white"
      class="qt-btn qt-btn-md"
      :disabled="time < 1"
    >
      <span class="qt-block qt-w-3 qt-h-3 qt-mr-2 qt-bg-gray-600"></span>
      Stop Recording
    </app-button>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import { MicrophoneIcon } from "@heroicons/vue/solid";
import AudioRecorder from "audio-recorder-polyfill";
import AppButton from "../../helpers/AppButton";

export default {
  name: "Recorder",
  props: {
    view: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    allowRecording: {
      type: Boolean,
      required: true,
    },
    lsConstant: {
      type: String,
      required: true,
    },
    uniqueKey: {
      type: String,
      default: "",
    },
    uniqueString: {
      type: String,
      default: "",
    },
  },
  components: {
    AppButton,
    MicrophoneIcon,
  },

  emits: [
    "pause-all",
    "mic-error",
    "done-recording",
    "done-recording-url",
    "reset-recorder",
    "new-string",
    "reset",
    "quality",
    "no-audio",
    "recording",
  ],
  setup(props, { emit }) {
    props = reactive(props);
    const timeLimitString = ref("");
    const time = ref(0);
    const timer = ref("00:00");
    const timeInterval = ref(null);
    const width = ref(0);
    const audioFile = ref(null);
    const audioUrl = ref("");
    const audioQuality = ref("");
    const recording = ref(false);
    const audioChunks = ref([]);
    const volumeValues = ref([]);
    const mediaRecorder = ref(null);
    const audioContext = ref(null);
    const noAudio = ref(false);

    watch(recording, (newVal) => {
      emit("recording", newVal);
    });
    watch(audioQuality, (newVal) => {
      emit("quality", newVal);
    });
    onMounted(() => {
      const initTime = props.timeLimit;
      const minutes = Math.floor(initTime / 60);
      const seconds = initTime - minutes * 60;
      timeLimitString.value = `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    });

    const resetRecorder = () => {
      const testAudio = document.getElementById("test_player2");
      const testAudioSource = document.querySelector("#test_player2 source");
      if (testAudio && testAudioSource) {
        testAudioSource.src = "";
        testAudio.pause();
        testAudio.currentTime = 0;
      }
      emit("reset-recorder");

      audioUrl.value = "";
      audioFile.value = null;
      width.value = 0;
      timer.value = "00:00";
      emit("done-recording-url", "", "", 0);
      emit("reset");
      emit("new-string");
      // this.getRandomString(10);
    };

    const stopRecording = () => {
      if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
        recording.value = false;
        mediaRecorder.value.stop();
        // this.currentAttempt = this.currentAttempt + 1;
      }
      checkAudioQuality(volumeValues.value);
      clearInterval(timeInterval.value);
    };

    const startRecording = () => {
      localStorage.removeItem(props.lsConstant);
      setAudioContext();
      recordAudio();
      emit("pause-all");
      setTimeout(() => {
        recording.value = true;
      }, 500);
    };

    const recordAudio = () => {
      if (!window.MediaRecorder) {
        window.MediaRecorder = AudioRecorder;
      }
      audioChunks.value = [];
      volumeValues.value = [];
      audioUrl.value = "";
      const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "";

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
          emit("mic-error", false);
          mediaRecorder.value = new MediaRecorder(stream, {
            mimeType,
          });
          try {
            await createMicActivityIndicator(stream);
          } catch (err) {
            console.log(err);
          }
          mediaRecorder.value.start();
          mediaRecorder.value.addEventListener("start", () => {
            setTimer();
          });
          mediaRecorder.value.addEventListener("dataavailable", (event) => {
            audioChunks.value.push(event.data);
          });
          mediaRecorder.value.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks.value, {
              type: "audio/webm;codecs=opus",
            });
            audioFile.value = audioBlob;
            audioUrl.value = URL.createObjectURL(audioBlob);
            const testAudio = document.getElementById("test_player2");
            const testAudioSource = document.querySelector(
              "#test_player2 source"
            );
            if (testAudio && testAudioSource) {
              testAudioSource.src = audioUrl.value;
              testAudio.currentTime = 0;
              testAudio.muted = false;
              testAudio.volume = 1;
              // testAudio.load();
            }
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
              const base64data = reader.result;
              emit("done-recording", base64data);
              emit(
                "done-recording-url",
                base64data,
                audioUrl.value,
                time.value
              );
            };
          });
        })
        .catch((err) => {
          console.log("An error occurred");
          console.log(err);
          emit("mic-error", true);
        });
    };

    const setTimer = () => {
      time.value = 0;
      timer.value = "00:00";
      timeInterval.value = setInterval(() => {
        if (!recording.value) {
          return;
        }
        time.value = time.value + 1;
        setWidth();
        const minutes = Math.floor(time.value / 60);
        const seconds = time.value - minutes * 60;
        let minString = minutes > 9 ? minutes : `0${minutes}`;
        let secsString = seconds > 9 ? seconds : `0${seconds}`;
        timer.value = `${minString}:${secsString}`;
        if (time.value === props.timeLimit) {
          stopRecording();
        }
      }, 1000);
    };

    const setWidth = () => {
      const gap = 100 / props.timeLimit;
      width.value = width.value + gap;
      console.log(width.value);
    };
    const setAudioContext = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext.value = new AudioContext();
      unlockAudioContext(audioContext.value);
    };

    const createMicActivityIndicator = (stream) => {
      const analyser = audioContext.value.createAnalyser();
      const microphone = audioContext.value.createMediaStreamSource(stream);
      const javascriptNode = audioContext.value.createScriptProcessor(
        2048,
        1,
        1
      );

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.value.destination);
      javascriptNode.onaudioprocess = function () {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        const length = array.length;
        for (let i = 0; i < length; i++) {
          values += array[i];
        }

        const average = values / length;
        if (recording.value) {
          colorPIds(Math.round(average));
        }
      };
    };
    const colorPIds = (vol) => {
      let i;
      let allPIds = document.querySelectorAll(
        `.qt-pid${props.uniqueKey}_${props.uniqueString}`
      );
      let amountOfPIds = Math.round(vol / 10);
      if (recording.value) {
        volumeValues.value.push(amountOfPIds);
        setTimeout(() => {
          const volumeValuesLength = volumeValues.value.length;
          const volumeValuesLimit = Math.round(0.9 * volumeValues.value.length);
          const volumeValuesSorted = volumeValues.value.slice(
            volumeValuesLimit,
            volumeValuesLength
          );

          if (recording.value) {
            checkAudioQuality(volumeValuesSorted);
          }
        }, 100);
      }
      let elem_range = Array.from(allPIds).slice(0, amountOfPIds);
      for (i = 0; i < allPIds.length; i++) {
        allPIds[i].style.backgroundColor = "#e6e7e8";
      }
      for (i = 0; i < elem_range.length; i++) {
        elem_range[i].style.backgroundColor = "#69ce2b";
      }
    };

    const checkAudioQuality = (arr) => {
      const sum = function (array) {
        let total = 0;
        for (let i = 0; i < array.length; i++) {
          total += array[i];
        }
        return total;
      };

      const mean = function (array) {
        const arraySum = sum(array);
        return arraySum / array.length;
      };

      if (mean(arr) < 1) {
        audioQuality.value = "poor";
      }
      if (mean(arr) >= 1 && mean(arr) < 1.5) {
        audioQuality.value = "okay";
      }
      if (mean(arr) >= 1.5) {
        audioQuality.value = "good";
      }
      if (Math.max(...arr) < 1) {
        audioQuality.value = "poor";
      }
      if (audioQuality.value) {
        localStorage.setItem(props.lsConstant, audioQuality.value);
      }
      noAudio.value = arr.filter((x) => x !== 0).length === 0;
      emit("no-audio", noAudio.value);
    };

    const unlockAudioContext = (audioCtx) => {
      if (audioCtx.state === "suspended") {
        const events = ["touchstart", "touchend", "mousedown", "keydown"];
        const unlock = function unlock() {
          events.forEach((event) => {
            document.body.removeEventListener(event, unlock);
          });
          // if (that.audioElm.src !== require('../../assets/sound_short.mp3').default) {
          console.log("unlock event called");
          audioCtx.resume();
          // }
        };

        events.forEach((event) => {
          document.body.addEventListener(event, unlock, false);
        });
      }
    };

    return {
      timeLimitString,
      timer,
      startRecording,
      stopRecording,
      width,
      audioFile,
      recording,
      resetRecorder,
      audioUrl,
      time,
    };
  },
};
</script>

<style scoped>
.qt-progress-bar {
  transition: all 0.25s ease;
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
