<template>
  <div
    class="block sm:hidden mt-12 bg-gray-100 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300 overflow-x-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
  >
    <div
      class="h-17 shadow-sm w-full flex justify-start items-center space-x-2 mx-2"
    >
      <span
        :draggable="true"
        @dragstart="startDrag($event, index)"
        :ref="`option${index}RefSm`"
        :class="bgColor"
        class="inline-block text-sm text-white rounded-lg px-4 py-0.5 cursor-move font-medium"
        v-for="(option, index) in options"
        :key="`option${index}`"
        @click="setAnswer(index)"
      >
        {{ option.content }}
      </span>
    </div>
  </div>
  <div
    class="hidden sm:flex flex-wrap pb-2 mt-12 justify-center bg-gray-100 shadow-sm px-2"
  >
    <span
      :draggable="true"
      @dragstart="startDrag($event, index)"
      :ref="`option${index}Ref`"
      :class="bgColor"
      class="inline-block mt-2 mr-2 text-sm text-white rounded-lg px-4 py-1 cursor-move font-medium"
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
