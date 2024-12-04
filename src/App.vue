<script setup lang="ts">
import EndRoll from './components/EndRoll.vue'
</script>

<template>
  <main>
    <EndRoll />
  </main>
</template>

<style scoped>
:root {
  -ms-overflow-style: none; /* IE, Edge 対応 */
  scrollbar-width: none;    /* Firefox 対応 */
  margin:0;
}
:root::-webkit-scrollbar {
  display: none; /* Chrome, Safari 対応 */
}
body {
  margin:0;
}
</style>
