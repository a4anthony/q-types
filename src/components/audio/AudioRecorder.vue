<template>
  <div
    class="qt-bg-white qt-relative qt-max-w-md sm:qt-max-w-sm qt-w-full qt-mx-auto"
  >
    <!--no mic error-->
    <div v-if="!micError && !audioUrl">
      <volume-bars :unique-string="uniqueString" :unique-key="uniqueKey" />
      <recorder
        :time-limit="timeLimit"
        :ls-constant="lsConstant"
        :allow-recording="allowRecording"
        @done-recording-url="onAudio"
        @mic-error="onError"
        :unique-key="uniqueKey"
        :unique-string="uniqueString"
        ref="recorderRef"
        @new-string="getRandomString(10)"
        :view="view"
        @quality="onQuality"
        @no-audio="onNoAudio"
        @recording="onRecording"
      />
    </div>
    <div v-if="!micError && audioUrl && uniqueKey !== 'microphone_check'">
      <audio-player
        ref="audioPlayer"
        :auto-play="view === 'section'"
        :with-helper-buttons="false"
        @listened="$emit('listened')"
        with-player
        :disable-play="view !== 'section'"
        player-id="qt_test_player2"
        :view="view"
        :duration="duration"
      />

      <div class="qt-mx-auto qt-my-3 qt-text-center">
        <app-button
          v-if="audioUrl && view === 'section'"
          btn-color-class="qt-btn-white"
          class="qt-btn qt-btn-md"
          @click="resetRecorder"
        >
          <span
            class="qt-block qt-w-3 qt-h-3 qt-mr-2 qt-rounded-full qt-bg-gray-600"
          ></span>
          New Recording
        </app-button>
      </div>
    </div>
    <!--quality === 'poor' &&-->
    <div
      v-if="
        !micError &&
        !view.includes('question') &&
        quality === 'poor' &&
        !recording &&
        !showError
      "
      class="qt-bg-red-100 qt-inline-flex qt-items-center qt-px-4 qt-py-3 qt-text-sm qt-text-red-500 qt-shadow-sm"
    >
      <ExclamationIcon
        class="qt-w-6 qt-h-6 qt-flex-none qt-text-red-600 qt-mr-2"
      />
      <span v-if="!noAudio" class="qt-flex-grow qt-text-left">
        Audio volume is too low. Please try recording again and speak
        louder.</span
      >
      <span v-else class="qt-flex-grow qt-text-left">
        There might be an issue with your microphone. Please reconnect your
        microphone and try recording again and speak louder.</span
      >
    </div>
    <div v-if="micError">
      dsjjjdffdjjdfjdfdfj

      <!--<test-on-error-->
      <!--    :contact-msg="false"-->
      <!--    error-msg="Oops! It looks like your browser does not have permission to use your microphone. Please give the browser permission in order to continue."-->
      <!--    @retry="-->
      <!--              () => {-->
      <!--                  this.retryAttempts += 1;-->
      <!--                  this.startRecording();-->
      <!--                  this.microphoneError = false;-->
      <!--              }-->
      <!--          "-->
      <!--    :attempts="retryAttempts"-->
      <!--    :total-attempts="3"-->
      <!--    link="https://the-english-quiz&#45;&#45;2.drift.help/article/how-do-i-enable-my-microphone"-->
      <!--/>-->
    </div>
  </div>
</template>

<script>
import VolumeBars from "./helpers/VolumeBars";
import { ExclamationIcon } from "@heroicons/vue/outline";
import Recorder from "./helpers/Recorder";
import { onMounted, ref } from "vue";
import uniqueId from "lodash/uniqueId";
import AudioPlayer from "./AudioPlayer";
import AppButton from "../helpers/AppButton";
export default {
  name: "AudioRecorder",
  components: { AppButton, AudioPlayer, Recorder, VolumeBars, ExclamationIcon },
  props: {
    uniqueKey: {
      type: String,
      default: uniqueId(),
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    view: {
      type: String,
      required: true,
    },
    allowRecording: {
      type: Boolean,
      default: false,
    },
    showError: {
      type: Boolean,
      default: false,
    },
    lsConstant: {
      type: String,
      default: "audioQuality_",
    },
  },
  emits: ["audio-base64", "audio-url", "listened", "quality"],

  setup(_, { emit }) {
    const uniqueString = ref("");
    const micError = ref(false);
    const recording = ref(false);
    const noAudio = ref(false);
    const quality = ref("");
    const audioUrl = ref("");
    const recorderRef = ref(null);
    const duration = ref(0);

    onMounted(() => {
      getRandomString(10);
    });

    const onRecording = (val) => {
      recording.value = val;
    };

    const onQuality = (val) => {
      quality.value = val;
      emit("quality", val);
    };

    const onNoAudio = (val) => {
      noAudio.value = val;
    };
    const onError = (val) => {
      micError.value = val;
    };
    const onAudio = (base64, url, dur) => {
      emit("audio-base64", base64);
      emit("audio-url", url);
      duration.value = dur;
      audioUrl.value = url;
    };

    const getRandomString = (length) => {
      const randomChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length)
        );
      }
      uniqueString.value = result;
    };

    const resetRecorder = () => {
      audioUrl.value = "";
      setTimeout(() => {
        if (recorderRef.value) {
          recorderRef.value.resetRecorder();
        }
      }, 200);
      // console.log(recorderRef);
      // console.log(recorderRef.value.resetRecorder());
    };

    return {
      uniqueString,
      micError,
      audioUrl,
      onError,
      onAudio,
      duration,
      resetRecorder,
      recorderRef,
      getRandomString,
      onRecording,
      onQuality,
      onNoAudio,
      noAudio,
      quality,
      recording,
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
