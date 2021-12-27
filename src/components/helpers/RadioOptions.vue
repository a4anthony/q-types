<template>
  <!--qt-flex qt-flex-col qt-space-y-1-->
  <!--qt-grid qt-grid-cols-1 sm:qt-grid-cols-2 qt-gap-1 sm:qt-gap-2-->
  <div
    :class="
      stringRadio
        ? 'qt-flex qt-flex-col qt-space-y-1'
        : 'qt-flex qt-justify-center qt-space-x-4'
    "
  >
    <button
      v-for="(opt, index) in options"
      :key="`opt${opt.id}`"
      :ref="setItemRef"
      :class="[
        `hover:qt-border-${color}-600`,
        stringRadio
          ? 'qt-text-left qt-text-sm qt-py-3 qt-px-2'
          : 'qt-h-12 qt-w-12 qt-text-center qt-text-lg ',
      ]"
      class="qt-rounded-md qt-border-2 qt-border-gray-200 qt-font-medium focus:qt-outline-none qt-mx-0"
      @click="setOption(opt.id, index)"
    >
      {{ opt.content }}
    </button>
  </div>
</template>

<script>
import { inject, onBeforeUpdate, onUpdated, reactive, ref } from "vue";

export default {
  name: "RadioOptions",
  props: {
    options: {
      type: Array,
      required: true,
    },
    stringRadio: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selected"],
  setup(props, { emit }) {
    props = reactive(props); // mounted
    const selectedOption = ref(null);
    const selectedOptionIndex = ref(null);
    const color = inject("color");
    let itemRefs = [];

    const setItemRef = (el) => {
      if (el) {
        itemRefs.push(el);
      }
    };
    onBeforeUpdate(() => {
      itemRefs = [];
    });
    onUpdated(() => {
      console.log(itemRefs);
    });

    const setActive = (opt, index) => {
      // console.log(itemRefs);
      // return;
      itemRefs[index].classList.remove("qt-border-gray-200");
      itemRefs[index].classList.add(
        `qt-border-${color}-600`,
        `qt-bg-${color}-600`,
        "qt-text-white"
      );
      selectedOption.value = opt;
      selectedOptionIndex.value = index;
      emit(
        "selected",
        props.options.find((x) => x.id === opt)
      );
    };
    const setOption = (opt, index) => {
      if (selectedOption.value && selectedOption.value !== opt) {
        itemRefs[selectedOptionIndex.value].classList.add("qt-border-gray-200");
        itemRefs[selectedOptionIndex.value].classList.remove(
          `qt-border-${color}-600`,
          `qt-bg-${color}-600`,
          "qt-text-white"
        );

        setActive(opt, index);
      }
      if (!selectedOption.value) {
        setActive(opt, index);
      }
    };

    return {
      setOption,
      setItemRef,
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
