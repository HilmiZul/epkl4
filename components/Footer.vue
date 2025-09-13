<template>
  <footer class="my-4 text-muted text-center smallest metropolis">
    v{{ version }} <br>
    &copy;2018 - {{ year }}. All rights reserved. <br>
    Cooked by <nuxt-link to="https://zulhilmi.id" target="_blank" class="link-footer">{{ author }}</nuxt-link>.
  </footer>
</template>

<script setup>
let config = useRuntimeConfig()
let version = config.public.appVersion
let author = config.public.author
let year = new Date().getFullYear()
let user = usePocketBaseUser()
</script>

<style scoped>
.smallest {
  font-size: .75em;
}
</style>
