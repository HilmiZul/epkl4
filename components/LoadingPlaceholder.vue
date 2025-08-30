<template>
  <p v-for="(r,i) in props.row" :key="i" class="placeholder-glow mb-2">
    <span :class="`placeholder col-${props.col} py-3`"></span>
  </p>
</template>

<script setup>
let props = defineProps(['col', 'row'])
</script>
