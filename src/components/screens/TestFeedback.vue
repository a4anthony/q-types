<template>
  <div class="qt-h-full qt-flex qt-w-full qt-justify-center qt-items-center">
    <div class="qt-space-y-3 qt-text-center qt-w-full sm:qt-w-4/5">
      <span class="qt-block qt-font-bold qt-text-2xl">Test Completed</span>
      <!--<span class="qt-block qt-text-base qt-font-semibold">Thank you!</span>-->
      <div class="qt-mt-4" v-if="!hasFeedback">
        <div class="qt-space-y-5">
          <span
            class="qt-block qt-text-sm qt-text-gray-500 qt-font-semibold qt-text-center"
            >How would you rate your experience?</span
          >
          <div
            class="qt-grid qt-grid-cols-5 sm:qt-grid-cols-5 qt-gap-4 qt-w-full sm:qt-w-1/2 qt-mx-auto"
          >
            <span
              v-for="(impression, index) in impressions"
              :key="`impression${index}`"
              class="qt-space-y-2"
            >
              <button
                @click="setImpression(impression)"
                @mouseover="onHoverIn(impression)"
                @mouseleave="onHoverOut(impression)"
                class="focus:qt-outline-none"
              >
                <span
                  class="qt-block qt-text-5xl sm:qt-text-5xl"
                  :class="[
                    impression.icon.class,
                    selectedImpression && selectedImpression !== impression.id
                      ? 'qt-text-opacity-40'
                      : '',
                  ]"
                >
                  <fa-icon :icon="impression.icon.icon" />
                </span>
              </button>
              <!--<span class="block text-sm" v-html="impression.label"></span>-->
            </span>
          </div>
          <!--textarea-->
          <div>
            <label
              for="feedback"
              class="qt-block qt-text-sm qt-hidden qt-font-medium qt-text-gray-700"
            >
              Answer
            </label>
            <div class="qt-relative">
              <textarea
                id="feedback"
                name="feedback"
                rows="6"
                v-model="feedback"
                :class="[
                  `focus:qt-ring-${color}-500 focus:qt-border-${color}-500`,
                  `qt-ring--- qt-ring-amber-500--- `,
                ]"
                class="qt-p-2 qt-shadow-sm qt-mt-1 qt-block qt-w-full sm:qt-text-sm qt-border qt-border-gray-300 qt-rounded-md"
                placeholder="Enter your feedback here"
              ></textarea>
              <span
                v-if="hasIssues && !feedback"
                class="qt-absolute qt-left-0 qt--bottom-5 qt-text-red-400 qt-text-sm"
                >Nice message to prompt feedback</span
              >
            </div>
          </div>
          <!--issues checkbox-->
          <div class="qt-flex qt-items-center qt-justify-start">
            <button
              @click="hasIssues = !hasIssues"
              class="qt-flex qt-items-center focus:qt-outline-none qt-mt-2"
            >
              <input
                id="issues"
                name="issues"
                type="checkbox"
                v-model="hasIssues"
                :class="`qt-text-${color}-600 focus:qt-ring-${color}-500`"
                class="qt-h-4 qt-w-4 qt-border-gray-300 qt-rounded-full qt-cursor-pointer"
              />
              <label
                for="issues"
                class="qt-ml-2 qt-block qt-text-sm qt-text-gray-900 qt-sr-only"
              >
                Did you encounter any technical issue(s)?
              </label>
              <span
                class="qt-ml-2 qt-text-sm qt-font-medium qt-text-left qt-text-gray-500"
              >
                Is your feedback related to any technical issue(s)?
              </span>
            </button>
          </div>
          <!--submit-->
          <div>
            <div class="qt-flex qt-justify-end qt-mt-3">
              <app-button
                :disabled="
                  !selectedImpression || loading || (!feedback && hasIssues)
                "
                @click="submitFeedback"
                class="qt-btn-lg"
              >
                Give feedback
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from "../helpers/AppButton";
import { ref } from "vue";

export default {
  name: "TestFeedback",
  components: { AppButton },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    hasFeedback: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["form"],
  setup(_, { emit }) {
    const selectedImpression = ref(null);
    const feedback = ref("");
    const hasIssues = ref(false);
    const impressions = ref([
      {
        id: 1,
        label: "Definitely didn't<br/> like it",
        icon: {
          class: "qt-text-red-400",
          icon: ["far", "frown"],
        },
      },
      {
        id: 2,
        label: "Not my<br/> favourite",
        icon: {
          class: "qt-text-yellow-500",
          icon: ["far", "frown-open"],
        },
      },
      {
        id: 3,
        label: "It was ok",
        icon: {
          class: "qt-text-yellow-300",
          icon: ["far", "meh"],
        },
      },
      {
        id: 4,
        label: "Liked it",
        icon: {
          class: "qt-text-green-400",
          icon: ["far", "smile"],
        },
      },
      {
        id: 5,
        label: "Loved it",
        icon: {
          class: "qt-text-green-500",
          icon: ["far", "grin-beam"],
        },
      },
    ]);
    const issues = ref([
      {
        status: true,
        label: "Media issue",
      },
      {
        status: true,
        label: "Skipped question",
      },
      {
        status: false,
        label: "Connection issue",
      },
    ]);
    const onHoverIn = (elm) => {
      elm.icon.icon[0] = "fas";
    };
    const onHoverOut = (elm) => {
      if (elm.id !== selectedImpression.value) {
        elm.icon.icon[0] = "far";
      }
    };
    const setImpression = (elm) => {
      selectedImpression.value = elm.id;
      elm.icon.icon[0] = "fas";
      impressions.value.forEach((impression) => {
        if (impression.id !== elm.id) {
          impression.icon.icon[0] = "far";
        }
      });
    };

    const setIssue = (issue) => {
      issue.status = !issue.status;
    };

    const submitFeedback = () => {
      emit("form", {
        impression: selectedImpression.value - 1,
        comment: feedback.value,
        with_technical_issues: hasIssues.value,
      });
    };

    return {
      impressions,
      selectedImpression,
      feedback,
      onHoverIn,
      onHoverOut,
      setImpression,
      submitFeedback,
      hasIssues,
      setIssue,
      issues,
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
