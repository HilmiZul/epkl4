<template>
  <!-- <div class="row"> -->
    <!-- <div class="col"> -->
      <footer class="my-4 text-muted text-center small metropolis">
        v{{ version }} <br>
        &copy;2018 - {{ year }}. All rights reserved. <br>
        <span class="">Dimasak dengan <i class="bi bi-heart-fill"></i> oleh PPLG.</span>
      </footer>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup>
let config = useRuntimeConfig()
let version = config.public.appVersion
let year = new Date().getFullYear()
let user = usePocketBaseUser()
</script>

<style scoped>
.smallest {
  font-size: .75em;
}
</style>
