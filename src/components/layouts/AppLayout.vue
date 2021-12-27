<template>
  <div class="qt-bg-gray-100 qt-h-screen qt-relative">
    <navbar />
    <div class="qt-max-w-4xl qt-mx-auto qt-mt-0 sm:qt-mt-3">
      <main class="qt-relative">
        <slot></slot>
      </main>
    </div>
    <footer-bar />
  </div>
</template>

<script>
import Navbar from "./Navbar";
import FooterBar from "./FooterBar";
export default {
  name: "AppLayout",
  components: { FooterBar, Navbar },
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
