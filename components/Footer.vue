<template>
  <div class="row">
    <div class="col">
      <footer class="my-5 text-muted small">
        &copy;{{ year }}. All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup>
let year = new Date().getFullYear()
</script>
