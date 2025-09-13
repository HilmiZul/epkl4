<template>
  <footer class="my-4 text-muted text-center smallest metropolis">
    v{{ version }} <br>
    &copy;2018 - {{ year }}. All rights reserved. <br>
    Cooked by <strong>ZH</strong>
  </footer>
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
