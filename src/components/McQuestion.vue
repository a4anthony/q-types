<template>
  <div
    class="qt-h-full qt-flex qt-items-center qt-w-full sm:qt-w-auto qt-justify-center qt-mx-auto"
  >
    <div class="qt-w-full sm:qt-w-auto">
      <h1 class="qt-hidden">{{ counter }}</h1>
      <div
        class="qt-leading-loose qt-relative qt-space-x-2 qt-justify-start qt-text-left qt-text-base qt-font-medium"
      >
        <span v-html="htmlText"></span>
      </div>
      <div :class="stickyBottom ? `sticky bottom-0` : ''">
        <mc-options
          ref="mcOptions"
          @set-answer="setAnswer"
          :options="options"
          :bg-color="bgColor"
          @reset-border="defaultBorder"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import McOptions from "./helpers/McOptions.vue";
import _ from "lodash";

export default {
  name: "McQuestion",
  components: { McOptions },
  props: {
    fullQuestion: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: "qt-bg-blue-600",
    },
    qId: {
      type: String,
      default: "dragOver",
    },
    spaceSelector: {
      type: String,
      default: "#SELECT#",
    },
    stickyBottom: {
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

    options: {
      type: Array,
      required: true,
    },
  },

  emits: [
    "click",
    "comp-mounted",
    "start-time",
    "answer",
    "answered",
    "reset-answer",
  ],
  setup(props, { emit }) {
    props = reactive(props); // mounted
    const blankSpaces = ref(0);
    const counter = ref(0);
    const htmlText = ref(null);
    let selectedAnswers = ref([]);
    const mcOptions = ref(null);
    const overElm = ref(null);

    watch(blankSpaces, (currentValue) => {
      let sampleAnswers = [];
      for (let i = 1; i <= currentValue; i++) {
        sampleAnswers.push(null);
      }
      selectedAnswers.value = sampleAnswers;
    });

    watch(
      () => _.cloneDeep(selectedAnswers.value),
      (currentValue) => {
        if (currentValue.filter((x) => x === null).length < blankSpaces.value) {
          let answers = [];
          currentValue.forEach((v) => {
            if (props.options.find((x) => x.content === v)) {
              answers.push(props.options.find((x) => x.content === v).id);
            } else {
              answers.push("");
            }
          });
          emit("answered", {
            answer: answers,
            question_id: props.currentQuestion.id,
            section_id: props.currentSection.id,
          });
        } else {
          emit("reset-answer");
        }
      }
    );

    const space =
      "<span" +
      " style='top: -.5rem'" +
      " class='drag-over-element qt-cursor-pointer qt-text-blue-400 qt-relative qt-inline-block qt-border-gray-400'" +
      ">" +
      "<span " +
      " class='qt-pointer-events-none drag-over-element-blank-text qt-bg-transparent qt-text-sm qt-text-transparent qt-px-2 qt-cursor-move'>" +
      "blank_space" +
      "</span>" +
      "<span" +
      "" +
      " class='drag-over-element-answer qt-pointer-events-none " +
      props.bgColor +
      " qt-text-sm qt-text-center qt-text-white qt-rounded-lg qt-px-2 qt-cursor-move qt-absolute qt-bottom-0.5'" +
      " style='" +
      " left: 0;\n" +
      " right: 0;\n" +
      "'>" +
      "</span>" +
      "</span>";

    onMounted(() => {
      initialMount();
    });

    const initialMount = () => {
      emit("comp-mounted");
      blankSpaces.value =
        props.currentQuestion.content.split(props.spaceSelector).length - 1;
      htmlText.value = props.currentQuestion.content.replace(
        /#SELECT#/g,
        space
      );

      setTimeout(() => {
        const spaces = document.getElementsByClassName("drag-over-element");
        for (let i = 0; i < spaces.length; i++) {
          spaces[i].id = `${props.qId}${i + 1}`;
          const answerBlankText = document.querySelector(
            `#${props.qId}${i + 1} .drag-over-element-blank-text`
          );
          const answerElm = document.querySelector(
            `#dragOver${i + 1} .drag-over-element-answer`
          );
          answerBlankText.id = `${props.qId}BlankText${i + 1}`;
          answerElm.id = `${props.qId}Answer${i + 1}`;
          // remove answer on click
          spaces[i].addEventListener("click", (e) => {
            e.preventDefault();
            if (answerElm.innerHTML) {
              removeAnswer(answerElm.innerHTML);
              answerElm.innerHTML = "";
            }
          });
          // drag events
          [answerElm, spaces[i]].forEach((elm) => {
            // on dragover
            elm.addEventListener("dragover", (e) => {
              e.preventDefault();
            });
            // on dragleave
            elm.addEventListener("dragleave", (e) => {
              if (counter.value - 1 >= 0) {
                counter.value--;
              }
              if (counter.value === 0) {
                e.target.classList.remove("qt-bg-green-100");
                ["Top", "Right", "Left", "Bottom"].forEach((pos) => {
                  e.target.style[`border${pos}Color`] = "#9CA3AF";
                });
              }
            });
            elm.addEventListener("dragenter", (e) => {
              setTimeout(() => {
                if (counter.value + 1 < 2) {
                  counter.value++;
                }
              }, 200);
              if (e.target.classList.contains("drag-over-element")) {
                e.target.classList.add("qt-bg-green-100");
                ["Top", "Right", "Left", "Bottom"].forEach((pos) => {
                  e.target.style[`border${pos}Color`] = "green";
                });
                overElm.value = e.target;
              }
              e.preventDefault();
            });
            elm.addEventListener("drop", (e) => {
              e.preventDefault();
              console.log(e);
              const index =
                Number(e.target.id.replace(`${props.qId}`, "")) ||
                Number(e.target.id.replace(`${props.qId}BlankText`, "")) ||
                Number(e.target.id.replace(`${props.qId}Answer`, ""));

              if (index) {
                mcOptions.value.onDrop(e, index);
              }
              if (overElm.value) {
                overElm.value.classList.remove("qt-bg-green-100");
                ["Top", "Right", "Left", "Bottom"].forEach((pos) => {
                  overElm.value.style[`border${pos}Color`] = "#9CA3AF";
                });
              }
            });
          });

          defaultBorder(spaces[i]);
        }
      }, 200);

      setTimeout(() => {
        emit("start-time", true);
      }, 300);
    };

    const defaultBorder = (elm) => {
      elm.style.borderLeft = "1px solid";
      elm.style.borderLeftColor = "transparent";
      elm.style.borderRight = "1px solid";
      elm.style.borderRightColor = "transparent";
      elm.style.borderTop = "1px solid";
      elm.style.borderTopColor = "transparent";
      elm.style.borderBottom = "1px solid";
      elm.style.borderBottomColor = "#9CA3AF";
      elm.classList.remove("qt-bg-green-100");
      counter.value = 0;
    };

    const removeAnswer = (value, reset = true) => {
      // show option in dock
      props.options.forEach((answer, index) => {
        if (value === answer.content) {
          mcOptions.value.$refs[`option${index}Ref`].classList.remove(
            "qt-hidden"
          );
          mcOptions.value.$refs[`option${index}RefSm`].classList.remove(
            "qt-hidden"
          );
        }
      });
      if (!reset) {
        return;
      }
      // reset option in text
      selectedAnswers.value.forEach((answer, index) => {
        if (value === answer) {
          selectedAnswers.value[index] = null;
          document.getElementById(
            `${props.qId}BlankText${index + 1}`
          ).innerText = "blank_space";
        }
      });
    };

    const setAnswer = (answerIndex, preIndex = null) => {
      const value = props.options[answerIndex].content;
      let reset = false;

      if (preIndex) {
        reset = true;
        const preValue = selectedAnswers.value[preIndex - 1];
        if (preValue) {
          if (selectedAnswers.value.length !== 1) {
            removeAnswer(preValue);
          }
        }
      }

      // alert(answerIndex, preIndex);
      // let nullValueAssigned = false;
      let valueAlreadyAssigned = false;
      selectedAnswers.value.forEach((answer, index) => {
        if (answer === null && !valueAlreadyAssigned) {
          if (preIndex) {
            selectedAnswers.value[preIndex - 1] = value;
          } else {
            selectedAnswers.value[index] = value;
          }
          valueAlreadyAssigned = true;
          mcOptions.value.$refs[`option${answerIndex}Ref`].classList.add(
            "qt-hidden"
          );
          mcOptions.value.$refs[`option${answerIndex}RefSm`].classList.add(
            "qt-hidden"
          );
        }

        if (selectedAnswers.value.length === 1) {
          if (selectedAnswers.value[0] !== value) {
            removeAnswer(selectedAnswers.value[0], false);
            selectedAnswers.value[index] = value;
            mcOptions.value.$refs[`option${answerIndex}Ref`].classList.add(
              "qt-hidden"
            );
            mcOptions.value.$refs[`option${answerIndex}RefSm`].classList.add(
              "qt-hidden"
            );
            reset = true;
          }
        }
      });

      selectedAnswers.value.forEach((answer, index) => {
        if (reset) {
          document.getElementById(
            `${props.qId}BlankText${index + 1}`
          ).innerText = "blank_space";
          document.getElementById(`${props.qId}Answer${index + 1}`).innerText =
            "";
        }

        if (answer) {
          document.getElementById(
            `${props.qId}BlankText${index + 1}`
          ).innerText = `_${answer}_`;
        }
        setTimeout(() => {
          const dragOverElmAnswer = document.querySelector(
            `#${props.qId}${index + 1} .drag-over-element-answer`
          );
          if (dragOverElmAnswer) {
            dragOverElmAnswer.innerHTML = answer;
          } else {
            setTimeout(() => {
              dragOverElmAnswer.innerHTML = answer;
            }, 400);
          }
        }, 200);
      });

      emit("answer", selectedAnswers.value);
    };
    return {
      blankSpaces,
      onClick() {
        emit("click");
      },
      initialMount,
      htmlText,
      defaultBorder,
      setAnswer,
      mcOptions,
      removeAnswer,
      overElm,
      counter,
    };
  },
};
</script>
