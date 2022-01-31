<template>
  <div
    :class="classes"
    class="qt-w-1/2 qt-mx-auto qt-relative qt-h-2"
    style="width: 205px"
  >
    <div
      class="qt-pid qt-absolute"
      :class="`qt-pid${uniqueKey}_${uniqueString}`"
      v-for="(bar, index) in [0, 1, 2, 3, 4, 5]"
      :key="`key${bar}`"
      style="background-color: #e6e7e8"
      :style="{
        left: `${index * 35}px`,
        width: `${30}px`,

        height: `${5}px`,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "VolumeBars",
  props: {
    audioQuality: {
      type: Number,
      default: 0,
    },
    uniqueKey: {
      type: String,
      default: "",
    },
    uniqueString: {
      type: String,
      default: "",
    },
    classes: {
      type: String,
      default: "qt-mb-5",
    },
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
