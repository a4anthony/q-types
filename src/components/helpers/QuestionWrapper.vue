<template>
  <default-audio view="question" />
  <app-layout>
    <page-container>
      <template v-if="!noSlots" v-slot:header>
        <question-header v-bind="bindData.questionHeaderArgs" />
      </template>
      <template v-slot:content>
        <slot @start-time="startTime"></slot>
      </template>
      <template v-if="!noSlots" v-slot:footer-right>
        <question-actions v-bind="bindData.questionActionArgs" />
      </template>
    </page-container>
  </app-layout>
</template>

<script>
import DefaultAudio from "../audio/DefaultAudio";
import AppLayout from "../layouts/AppLayout";
import PageContainer from "../containers/PageContainer";
import QuestionHeader from "./QuestionHeader";
import QuestionActions from "./QuestionActions";
import data from "../../data";

export default {
  name: "QuestionWrapper",
  components: {
    QuestionActions,
    QuestionHeader,
    PageContainer,
    AppLayout,
    DefaultAudio,
  },
  props: {
    noSlots: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bindData() {
      return data;
    },
  },

  setup() {
    const startTime = () => {
      console.log("shhdghggf");
      data.questionHeaderArgs.startTime = true;
    };

    return {
      startTime,
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
