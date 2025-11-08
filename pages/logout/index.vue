<template>
  <div class="row">
    <div class="col-lg-12 text-center lexend-mega text-muted">
      <div class="card">
        <div class="card-body">
          <i class="bi bi-hourglass-split fs-1"></i>
          <h1 class="my-5">Logging out</h1>
          <h5 class="quicksand">tunggu bentar...</h5>
        </div>
      </div>
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
