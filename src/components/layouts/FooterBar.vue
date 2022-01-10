<template>
  <footer
    id="qtFooter"
    class="qt-bg-white sm:qt-bg-transparent sm:qt-bg-white qt-border-t qt-absolute qt-bottom-0 qt-left-0 qt-right-0 qt-py-2 sm:qt-py-3 qt-px-2 qt-w-full qt-text-center qt-flex qt-items-center qt-justify-center"
  >
    <div class="qt-w-full">
      <span
        class="qt-text-center qt-mb-1 qt-text-sm qt-text-gray-600 qt-hidden sm:qt-block"
        >Need help? First, please pause your test and click on the help icon
        below or contact support.
      </span>

      <div
        class="qt-flex qt-justify-between sm:qt-justify-center qt-w-full qt-items-center"
      >
        <img
          v-if="test && test.client_logo"
          class="qt-h-5 qt-w-auto qt-flex qt-flex-none sm:qt-hidden"
          :src="test.client_logo"
          id="qtFooterLogo"
          :alt="test.company_name"
        />
        <logo v-if="test && !test.client_logo" :size="30" />

        <div class="qt-flex-grow qt-flex qt-justify-end sm:qt-justify-center">
          <span
            class="qt-text-center qt-flex qt-items-center qt-justify-center qt-text-xs qt-text-gray-500 qt-font-medium"
            >© 2021
            <span class="qt-inline-flex qt-mx-1">The English Quiz</span>
            |
            <a
              class="qt-text-blue-500 hover:qt-text-blue-400 qt-hidden sm:qt-inline-flex qt-mx-1"
              :href="privacyLink"
              target="_blank"
              >Privacy</a
            >
            <span class="qt-hidden sm:qt-flex qt-mr-1">|</span>

            <a
              class="qt-text-blue-500 hover:qt-text-blue-400 qt-inline-flex qt-mx-1"
              href="mailto:support@theenglishquiz.com"
              >Contact</a
            >
            <span class="qt-flex qt-mr-1">|</span>
            <slot name="drift-icon"></slot>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import Logo from "../helpers/Logo";
import _ from "lodash";

export default {
  name: "FooterBar",
  components: { Logo },
  props: {
    test: {
      type: Object,
      default() {
        return {
          taker: "John Doe",
          test_name: "English Proficiency Test",
          company_name: "company_logo",
          client_logo: "images/company_logo.png",
        };
      },
    },
    privacyLink: {
      type: String,
      default: "/privacy",
    },
  },
  setup(props) {
    props = reactive(props);
    const hasLogo = ref(null);

    watch(
      () => _.cloneDeep(props.test),
      () => {
        setTimeout(() => {
          window.addEventListener("load", () => {
            const image = document.getElementById("qtFooterLogo");
            hasLogo.value = image.complete && image.naturalHeight !== 0;
            // console.log(hasLogo.value);
          });
        }, 200);
      }
    );
    onMounted(() => {
      window.addEventListener("load", () => {
        const image = document.getElementById("qtFooterLogo");
        if (image) {
          hasLogo.value = image.complete && image.naturalHeight !== 0;
        }
        // console.log(hasLogo.value);
      });
    });

    return {
      hasLogo,
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
