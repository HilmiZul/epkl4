<template>
  <div class="row">
    <div class="col-12 text-center fst-italic lexend-mega">
      <h1>Logging out...</h1>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Logging out — e-PKL / SMKN 4 Tasikmalaya." })

let client = usePocketBaseClient()

function logout() {
  client.authStore.clear()
  client.realtime.unsubscribe()
  navigateTo('/login')
}
onMounted(() => logout())
</script>
