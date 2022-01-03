<template>
  <div
    v-if="!withImage"
    class="qt-h-full qt-flex qt-items-center qt-w-full sm:qt-w-auto qt-justify-center qt-mx-auto"
  >
    <div class="qt-w-full">
      <div v-if="withAvatar" class="qt-mx-auto qt-mt-4 qt-mb-3">
        <audio-player
          ref="audioPlayer"
          with-avatar
          auto-play
          :duration="
            currentQuestion.media_length ? currentQuestion.media_length : 20
          "
          view="question"
        />
        <!--<test-tone ref="testTone" @tone-played="startRecording" />-->
      </div>
      <span
        v-else
        class="qt-text-center qt-font-medium qt-block qt-mb-12 qt-mt-4"
        v-html="currentQuestion.content"
      >
      </span>
      <div class="qt-flex qt-justify-center qt-w-full qt-mt-12">
        <audio-recorder
          class="qt-w-full"
          ref="audioRecorder"
          :unique-key="
            currentQuestion
              ? `question_recorder${currentQuestion.id}`
              : `question_recorder`
          "
          show-error
          :time-limit="currentQuestion.time_limit_seconds"
          view="question"
          :allow-recording="!withAvatar"
          @audio-base64="
            (val) => {
              if (val) {
                $emit('answered', {
                  answer_blob: val,
                  question_id: currentQuestion.id,
                  section_id: currentSection.id,
                });
              }
            }
          "
        />
      </div>
    </div>
  </div>
  <dual-view-question-container v-else vertical-align>
    <template v-slot:left-content>
      <div class="qt-flex qt-h-full qt-justify-center qt.items-center">
        <div v-html="speakingImg"></div>
      </div>
      <div class="qt-speaking-image-question-content qt-hidden">
        <div v-html="currentQuestion.content"></div>
      </div>
      <!--<div class="lg:pt-8 xl:pt-0">-->
      <!--  <div class="speaking-image-question-content hidden">-->
      <!--    <div-->
      <!--      v-html="currentQuestion ? currentQuestion.content : sampleQuestion1"-->
      <!--    ></div>-->
      <!--  </div>-->
      <!--  <div class="flex h-full justify-center items-center">-->
      <!--    <div v-if="speakingImg" v-html="speakingImg"></div>-->
      <!--  </div>-->
      <!--</div>-->
    </template>

    <template v-slot:right-content>
      <div class="qt-pb-3 qt-flex qt-h-full qt-items-center qt-w-full">
        <div class="qt-w-full">
          <div v-if="withAvatar" class="qt-mx-auto qt-mt-4 qt-mb-3">
            <audio-player
              ref="audioPlayer"
              with-avatar
              auto-play
              :duration="
                currentQuestion.media_length ? currentQuestion.media_length : 20
              "
              view="question"
            />
          </div>
          <audio-recorder
            class="qt-w-full"
            ref="audioRecorder"
            :unique-key="
              currentQuestion
                ? `question_recorder${currentQuestion.id}`
                : `question_recorder`
            "
            show-error
            :time-limit="currentQuestion.time_limit_seconds"
            view="question"
            :allow-recording="!withAvatar"
            @audio-base64="
              (val) => {
                if (val) {
                  $emit('answered', {
                    answer_blob: val,
                    question_id: currentQuestion.id,
                    section_id: currentSection.id,
                  });
                }
              }
            "
          />
        </div>
      </div>
    </template>
  </dual-view-question-container>
</template>

<script>
import AudioRecorder from "../../audio/AudioRecorder";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import AudioPlayer from "../../audio/AudioPlayer";
import DualViewQuestionContainer from "../../containers/DualViewQuestionContainer";
export default {
  name: "SpeakingQuestion",
  components: { DualViewQuestionContainer, AudioPlayer, AudioRecorder },
  props: {
    currentQuestion: {
      type: Object,
      required: true,
    },
    currentSection: {
      type: Object,
      required: true,
    },
    withAvatar: {
      type: Boolean,
      required: false,
      default: false,
    },
    withImage: {
      type: Boolean,
      required: false,
      default: false,
    },
    src: {
      type: String,
      default: "audio/testtone.mp3",
    },
  },

  emits: ["answered"],
  setup(props) {
    props = reactive(props);
    const audioRecorder = ref(null);
    const speakingImg = ref(null);
    onMounted(async () => {
      if (props.withImage) {
        const qImages = document.querySelectorAll(
          ".qt-speaking-image-question-content img"
        );
        if (qImages.length === 2) {
          qImages[0].classList.add("qt-hidden");
          speakingImg.value =
            "<p class='text-center'>" +
            "<img id='qtSpeakingImage' src='" +
            qImages[1].src +
            "' style='max-width: 100%'/>" +
            "</p>";
        } else {
          speakingImg.value =
            "<p class='text-center'>" +
            "<img id='qtSpeakingImage' src='" +
            qImages[0].src +
            "' style='max-width: 100%'/>" +
            "</p>";
        }
      }
      if (!props.withAvatar) {
        // audioRecorder.value.allowRecording.value = true;
        audioRecorder.value.recorderRef.startRecording();
      } else {
        const audio = document.getElementById("qt_test_player");
        const audioTone = document.getElementById("qt_test_tone");

        if (audio) {
          audio.addEventListener("ended", async () => {
            await audioTone.play();
          });
          audioTone.addEventListener("ended", () => {
            setTimeout(() => {
              // console.log(audioRecorder);
              // console.log(audioRecorder.value);
              audioRecorder.value?.recorderRef.startRecording();
            }, 500);
          });
        }
      }
    });

    onUnmounted(() => {
      const audio = document.getElementById("qt_test_player");
      const audioTone = document.getElementById("qt_test_tone");
      [audio, audioTone].forEach((elm) => {
        elm.removeEventListener(
          "ended",
          () => {
            console.log("recorder unmounted", elm);
          },
          true
        );
      });
    });

    return {
      audioRecorder,
      speakingImg,
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
