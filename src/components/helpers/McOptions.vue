<template>
  <div
    class="qt-block sm:qt-hidden qt-mt-12 qt-bg-gray-100 qt-scrollbar-thin qt-scrollbar-thumb-blue-700 qt-scrollbar-track-blue-300 qt-overflow-x-scroll qt-scrollbar-thumb-rounded-full qt-scrollbar-track-rounded-full"
  >
    <div
      class="qt-h-17 qt-shadow-sm qt-w-full qt-flex qt-justify-start qt-items-center qt-space-x-2 qt-mx-2"
    >
      <span
        :draggable="true"
        @dragstart="startDrag($event, index)"
        :ref="`option${index}RefSm`"
        :class="bgColor"
        class="qt-inline-block qt-text-sm qt-text-white qt-rounded-lg qt-px-4 qt-py-0.5 qt-cursor-move qt-font-medium"
        v-for="(option, index) in options"
        :key="`option${index}`"
        @click="setAnswer(index)"
      >
        {{ option.content }}
      </span>
    </div>
  </div>
  <div
    class="qt-hidden sm:qt-flex qt-flex-wrap qt-pb-2 qt-mt-12 qt-justify-center qt-bg-gray-100 qt-shadow-sm qt-px-2"
  >
    <span
      :draggable="true"
      @dragstart="startDrag($event, index)"
      :ref="`option${index}Ref`"
      :class="bgColor"
      class="qt-inline-block qt-mt-2 qt-mr-2 qt-text-sm qt-text-white qt-rounded-lg qt-px-4 qt-py-1 qt-cursor-move qt-font-medium"
      v-for="(option, index) in options"
      :key="`option${index}`"
      @click="setAnswer(index)"
    >
      {{ option.content }}
    </span>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";

export default {
  name: "McOptions",
  props: {
    bgColor: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  emits: ["set-answer", "reset-border"],
  setup(props, { emit }) {
    props = reactive(props); // mounted
    const dragging = ref(false);

    onMounted(() => {
      document.addEventListener("dragend", () => {
        dragging.value = false;
      });
    });

    onUnmounted(() => {
      document.removeEventListener("dragend", () => {
        dragging.value = false;
      });
    });

    watch(dragging, (currentValue) => {
      setTimeout(function () {
        const spaces = document.getElementsByClassName("drag-over-element");
        for (let i = 0; i < spaces.length; i++) {
          if (currentValue) {
            ["Top", "Right", "Left", "Bottom"].forEach((pos) => {
              spaces[i].style[`border${pos}`] = "1px dashed";
              spaces[i].style[`border${pos}Color`] = "#9CA3AF";
            });
          } else {
            emit("reset-border", spaces[i]);
          }
        }
      }, 100);
    });

    const setAnswer = (answer) => {
      emit("set-answer", answer);
      // console.log(answer);
    };

    const startDrag = (evt, item) => {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("optionIndex", item);
      dragging.value = true;
    };

    const onDrop = (evt, index) => {
      const optionIndex = evt.dataTransfer.getData("optionIndex");
      dragging.value = false;
      emit("set-answer", optionIndex, index);
    };

    return {
      setAnswer,
      startDrag,
      onDrop,
    };
  },
};
</script>
