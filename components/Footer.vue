<template>
  <!-- <div class="row"> -->
    <!-- <div class="col"> -->
      <footer class="my-4 text-muted text-center smallest metropolis">
        v4.0.0 <br>
        &copy;2018 - {{ year }}. All rights reserved. <br>
        <span class="">PPLG SMKN 4 Tasikmalaya.</span>
      </footer>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup>
let year = new Date().getFullYear()
let user = usePocketBaseUser()
</script>

<style scoped>
.smallest {
  font-size: .75em;
}
</style>
