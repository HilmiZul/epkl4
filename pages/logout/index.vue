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
definePageMeta({
  middleware: 'auth',
})

let client = usePocketBaseClient()

function logout() {
  client.authStore.clear()
  navigateTo('/login')
}
onMounted(() => logout())
</script>
