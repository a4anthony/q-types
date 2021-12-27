<template>
  <div
    class="qt-min-h-full qt-flex qt-items-center qt-w-full sm:qt-w-auto qt-justify-center qt-mx-auto"
  >
    <div class="qt-w-full sm:qt-w-auto">
      <!--audio player-->
      <div
        id="qtAudioRadioQuestionAudioPlayer"
        v-if="!radioOnly"
        class="qt-relative qt-mx-auto"
      >
        <audio-player
          @ended="$emit('start-time', true)"
          @pause-time="$emit('pause-time')"
          @section-audio-played="
            (val) => {
              $emit('section-audio-played', val);
            }
          "
          @load-error="
            (data) => {
              $emit('load-error', data);
            }
          "
          replay
          :auto-play="autoPlay"
          :view="view"
        />
      </div>
      <!--question image-->
      <div
        id="qtAudioRadioQuestionRatioContent"
        class="qt-my-4 sm:qt-my-8 qt-font-semibold"
        v-if="currentQuestion"
        v-html="currentQuestion.content"
      ></div>
      <!--question option-->
      <radio-options
        id="qtAudioRadioQuestionRadioOptions"
        @selected="
          (selectedOption) => {
            $emit('answered', {
              answer_id: selectedOption.id,
              question_id: this.currentQuestion.id,
              section_id: this.currentSection.id,
            });
          }
        "
        :string-radio="
          currentQuestion && currentQuestion.answers[0].content.length > 1
        "
        :options="currentQuestion.answers"
      />
    </div>
    <settings @height="useHeight" />
  </div>
</template>

<script>
import RadioOptions from "../../helpers/RadioOptions";
import AudioPlayer from "../../audio/AudioPlayer";
import { onMounted, reactive } from "vue";
import Settings from "../../helpers/Settings";
export default {
  name: "AudioRadioQuestion",
  components: { Settings, AudioPlayer, RadioOptions },
  props: {
    radioOnly: {
      type: Boolean,
      default: false,
    },
    currentQuestion: {
      type: Object,
      required: true,
    },
    currentSection: {
      type: Object,
      required: true,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    view: {
      type: String,
      default: "question",
    },
  },

  emits: [
    "start-time",
    "pause-time",
    "load-error",
    "section-audio-played",
    "answered",
  ],
  setup(props, { emit }) {
    props = reactive(props); // mounted

    onMounted(() => {
      if (props.radioOnly) {
        emit("start-time", true);
      }
    });
    const useHeight = (height) => {
      if (props.radioOnly) {
        return;
      }

      const qImage = document.querySelector(
        "#qtAudioRadioQuestionRatioContent img"
      );
      if (qImage) {
        qImage.style.height = ``;
        const qImageHeight = qImage.clientHeight;
        const formattedHeight = Number(height.replace("px", ""));
        const audioHeight = document.getElementById(
          "qtAudioRadioQuestionAudioPlayer"
        ).clientHeight;
        const optionsHeight = document.getElementById(
          "qtAudioRadioQuestionRadioOptions"
        ).clientHeight;

        const allowedImageHeight =
          formattedHeight - audioHeight - optionsHeight - 80;
        console.log(allowedImageHeight, qImageHeight);
        if (qImageHeight > allowedImageHeight && allowedImageHeight > 150) {
          document.querySelector(
            "#qtAudioRadioQuestionRatioContent img"
          ).style.height = `${allowedImageHeight}px`;
        }
        if (allowedImageHeight < 150) {
          document.querySelector(
            "#qtAudioRadioQuestionRatioContent img"
          ).style.height = `150px`;
        }
      }
    };

    return {
      useHeight,
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
