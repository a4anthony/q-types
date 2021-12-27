<template>
  <div v-if="!initialPlay && !withPlayer && !loadError">
    <div
      v-if="withAvatar"
      class="qt-flex qt-items-center qt-justify-center qt-w-full"
      style="height: 80px"
    >
      <loading-icon :icon-color="`qt-text-${color}-500`" />
    </div>
    <div
      v-else
      class="qt-flex qt-items-center qt-justify-center qt-w-full"
      style="height: 30px"
    >
      <loading-icon :icon-color="`qt-text-${color}-500`" />
    </div>
  </div>
  <div v-if="initialPlay && !withPlayer && !loadError">
    <div v-if="withAvatar">
      <audio-avatar />
      <div
        v-if="audioPlaying && withAvatar && !buffering"
        class="qt-space-x-1 qt-mt-2 qt-flex qt-justify-center"
      >
        <audio-dots />
      </div>
      <div
        v-if="audioPlaying && withAvatar && buffering"
        class="qt-flex qt-justify-center qt-w-full qt-mt-2"
      >
        <loading-icon
          :icon-color="`qt-text-${color}-500`"
          size="qt-w-4 qt-h-4"
        />
      </div>
    </div>
    <div v-else>
      <audio-bars v-if="audioPlaying && !buffering" :playing="audioPlaying" />
      <div
        v-if="audioPlaying && buffering"
        class="qt-flex qt-items-center qt-justify-center qt-w-full"
        style="height: 30px"
      >
        <loading-icon :icon-color="`qt-text-${color}-500`" />
      </div>
    </div>

    <div
      v-if="!audioPlaying && withHelperButtons"
      class="qt-text-center"
      style="left: 30px"
    >
      <audio-buttons
        :plays="plays"
        :replay="replay"
        :show-play-btn="showPlayBtn"
        :audio-playing="audioPlaying"
        @play="playByEmit"
      />
    </div>
  </div>
  <div v-if="withPlayer && !loadError">
    <player
      @play="playByEmit"
      @pause="pauseAudio"
      :plays="plays"
      :audio-playing="audioPlaying"
      :current-time="currentTime"
      :total-duration="totalDuration"
      :show-play-btn="showPlayBtn"
      :buffering="buffering"
      :disable-play="disablePlay"
      :play-error="false"
    />
  </div>
  <div v-if="loadError">
    <media-error
      error-msg="An error occurred loading audio file."
      @retry="reloadAudio"
      :attempts="retryAttempts"
      :total-attempts="3"
      :reloading="reloading"
    />
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import AudioBars from "./helpers/AudioBars";
import LoadingIcon from "../helpers/LoadingIcon";
import AudioButtons from "./helpers/AudioButtons";
import AudioAvatar from "./helpers/AudioAvatar";
import AudioDots from "./helpers/AudioDots";
import Player from "./helpers/Player";
import MediaError from "../helpers/MediaError";

export default {
  name: "AudioPlayer",
  components: {
    MediaError,
    Player,
    AudioDots,
    AudioAvatar,
    AudioButtons,
    LoadingIcon,
    AudioBars,
  },
  props: {
    playerId: {
      type: String,
      default: "test_player",
    },
    view: {
      type: String,
      required: true,
    },
    withAvatar: {
      type: Boolean,
      default: false,
    },
    withBars: {
      type: Boolean,
      default: true,
    },
    withPlayer: {
      type: Boolean,
      default: false,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    withHelperButtons: {
      type: Boolean,
      default: true,
    },
    replay: {
      type: Boolean,
      default: false,
    },
    disablePlay: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    "section-audio-played",
    "pause-time",
    "listened",
    "play",
    "paused",
    "load-error",
    "start-time",
    "ended",
  ],
  setup(props, { emit }) {
    props = reactive(props); // mounted
    const audioElm = ref(null);
    const audioElmSrc = ref(null);
    const audioPlaying = ref(false);
    const loadError = ref(false);
    const playError = ref(false);
    const currentTime = ref("00:00");
    const totalDuration = ref("00:00");
    const durationAmount = ref(0);
    const retryAttempts = ref(-1);
    const currentAudioTime = ref(null);
    const interval = ref(null);
    const plays = ref(0);
    const showPlayBtn = ref(false);
    const buffering = ref(false);
    const initialPlay = ref(false);
    const reloading = ref(false);

    onMounted(() => {
      initialMount();
    });

    onUnmounted(() => {
      clearInterval(interval.value);
    });

    watch(showPlayBtn, (currentValue) => {
      if (currentValue) {
        initialPlay.value = true;
      }
    });
    /**
     * Initial mount
     */
    const initialMount = () => {
      console.log("audio mounted");
      audioElm.value = document.getElementById(props.playerId);
      audioElmSrc.value = document.querySelector(`#${props.playerId} source`);
      if (props.view === "section" || props.view === "section2") {
        console.log("audio load initialized");
        emit("section-audio-played", false);
      }
      audioEvents(audioElm.value, audioElmSrc.value);

      // audioElm.value.load();

      // getDuration(audioElmSrc.value.src, (duration) => {
      durationAmount.value = 104;
      totalDuration.value = getTimeCodeFromNum(104);
      interval.value = setInterval(() => {
        if (audioPlaying.value && !props.withAvatar) {
          if (currentAudioTime.value) {
            audioElm.value.currentTime = currentAudioTime.value;
            currentAudioTime.value = null;
          }
          currentTime.value = getTimeCodeFromNum(audioElm.value.currentTime);
          const progressBars = document.querySelectorAll(".qt-progress");
          for (let i = 0; i < progressBars.length; i++) {
            progressBars[i].style.width =
              (audioElm.value.currentTime / durationAmount.value) * 100 + "%";
          }
        }
      }, 500);
      // });
      if (props.autoPlay) {
        playAudio();
      } else {
        showPlayBtn.value = true;
      }
      if (props.withPlayer) {
        showPlayBtn.value = true;
      }
      console.log(audioElm.value);
    };
    /**
     * Audio events
     * @param elm
     * @param elmSrc
     */
    const audioEvents = (elm, elmSrc) => {
      elm.addEventListener(
        "loadedmetadata",
        () => {
          console.log(`audio ${elmSrc.src} loaded metadata`);
          reloading.value = false;
          loadError.value = false;
        },
        false
      );
      elm.addEventListener(
        "ended",
        () => {
          console.log(`audio ${elmSrc.src} ended`);
          if (props.view === "section" || props.view === "section2") {
            emit("section-audio-played", true);
          }
          stopAudio();
        },
        false
      );
      elm.addEventListener(
        "pause",
        () => {
          console.log(`audio ${elmSrc.src} paused`);
        },
        false
      );
      [elm, elmSrc].forEach((element) => {
        element.addEventListener(
          "error",
          () => {
            console.log(`audio ${audioElmSrc.value.src} loading error`);
            loadError.value = true;
            retryAttempts.value += 1;
            reloading.value = false;
            emit("load-error", {
              message: `Error loading media file: ${audioElmSrc.value.src}`,
              url: window.location.href,
              time: new Date().toString(),
            });
          },
          false
        );
      });
    };
    /**
     * Play audio by emit
     */
    const playByEmit = () => {
      initialPlay.value = false;
      playAudio();
    };
    /**
     * Play audio
     * @returns {Promise<void>}
     */
    const playAudio = async () => {
      try {
        checkBuffer();
        audioElm.value.currentTime = 0;
        console.log(`trying to play: ${audioElmSrc.value.src}`);
        audioElm.value.load();
        await audioElm.value.play();
        initialPlay.value = true;
        audioPlaying.value = true;
        playError.value = false;
        if (plays.value === 1) {
          emit("pause-time", true);
          plays.value = plays.value + 1;
          showPlayBtn.value = false;
        }
        emit("listened");
        console.log(`now playing: ${audioElmSrc.value.src}`);
        emit("section-audio-played", false);
      } catch (err) {
        audioPlaying.value = false;
        plays.value = 0;
        playError.value = true;
        showPlayBtn.value = true;
        console.log(err);
      }
    };
    /**
     * Stop audio
     */
    const stopAudio = () => {
      console.log("audio stopped");
      plays.value = plays.value + 1;
      audioPlaying.value = false;
      audioElm.value.currentTime = 0;
      audioElm.value.pause();
      emit("start-time", true);
      if (props.withPlayer) {
        const progressBars = document.querySelectorAll(".progress");
        for (let i = 0; i < progressBars.length; i++) {
          progressBars[i].style.width = "100%";
        }
      }
      emit("ended");
    };
    /**
     * Pause audio
     */
    const pauseAudio = () => {
      audioPlaying.value = false;
      showPlayBtn.value = true;
      audioElm.value.pause();
      currentAudioTime.value = audioElm.value.currentTime;
      emit("paused");
    };
    /**
     * Check buffer
     */
    const checkBuffer = () => {
      let slowInternetTimeout = null;
      audioElm.value.addEventListener("loadstart", () => {
        buffering.value = true;
        // console.log('Buffering');
      });
      audioElm.value.addEventListener("waiting", () => {
        slowInternetTimeout = setTimeout(() => {
          buffering.value = true;
          // console.log('Buffering');
        });
      });
      audioElm.value.addEventListener("playing", () => {
        if (slowInternetTimeout != null) {
          clearTimeout(slowInternetTimeout);
          slowInternetTimeout = null;
          buffering.value = false;
          // console.log('Play continues');
        }
      });
    };
    /**
     * Format duration
     * @param num
     * @returns {`${string|number}:${string|number}`}
     */
    const getTimeCodeFromNum = (num) => {
      const minutes = Math.floor(parseInt(num) / 60);
      const seconds = parseInt(num) - minutes * 60;
      return `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    };
    /**
     * Reload audio
     * @returns {Promise<void>}
     */
    const reloadAudio = async () => {
      audioElm.value.load();
      reloading.value = true;
    };
    return {
      audioElm,
      audioPlaying,
      buffering,
      plays,
      playAudio,
      showPlayBtn,
      initialPlay,
      playByEmit,
      pauseAudio,
      totalDuration,
      currentAudioTime,
      currentTime,
      loadError,
      retryAttempts,
      reloadAudio,
      reloading,
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
