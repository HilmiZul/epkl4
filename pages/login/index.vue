<template>
  <div class="card shadow-lg">
    <div class="card-body">
      <form @submit.prevent="handleLogin">
        <div v-if="isError" class="mb-4">
          <div class="alert alert-danger small rounded-0 border border-2 border-dark">Kombinasi salah! Coba lagi besok!</div>
        </div>
        <div class="mb-4">
          <label for="username">Username</label>
          <input v-model="username" type="text" class="form form-control form-control-lg" name="username" id="username" placeholder="ketik username-mu" required autofocus>
        </div>
        <div class="mb-4">
          <label for="password">Password</label>
          <input v-model="password" :disabled="username.length < 3" type="password" class="form form-control form-control-lg" name="password" id="password" placeholder="password-nya juga" required>
        </div>
        <div class="d-grid gap-2 mt-5">
          <button :disabled="sending || username.length < 3 || password.length < 5" class="btn btn-success btn-lg">
            <span v-if="!sending"><i class="bi bi-send"></i> Gass masuk!</span>
            <span v-else>tunggu bentar...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  <Footer />
</template>

<script setup>
definePageMeta({
  layout: 'login',
  middleware: 'check-auth'
})
useHead({ title: "Login — e-PKL / SMKN 4 Tasikmalaya." })

let client = usePocketBaseClient()
let user = usePocketBaseUser()
// console.log(user.value)
if(user.value) navigateTo('/')
let username = ref('')
let password = ref('')
let isError = ref(false)
let sending = ref(false)

async function handleLogin() {
  isError.value = false
  sending.value = true
  try {
    client.autoCancellation(false)
    let authData = await client.collection('teacher_users').authWithPassword(
      username.value,
      password.value
    )
    if(authData) {
      sending.value = false
      navigateTo('/')
    }
  } catch (error) {
    isError.value = true
    sending.value = false
    password.value = ''
  }
}
</script>

