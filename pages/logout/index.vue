<template>
  <div class="row">
    <div class="col-12">
      <h1 class="text-center">
        <em>Signing out...</em>
      </h1>
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
