<template>
  <div class="row">
    <div class="col-3">
      <div class="card shadow-lg">
        <div class="card-body">
          <form @submit.prevent="handleLogin">
            <div v-if="isError" class="mb-3">
              <div class="alert alert-danger text-danger small rounded-0 border-3 border-danger">Kombinasi salah! Coba lagi besok!</div>
            </div>
            <div class="mb-3">
              <input v-model="email" type="text" class="form form-control" name="username" id="email" placeholder="username" required autofocus>
            </div>
            <div class="mb-3">
              <input v-model="password" :disabled="email.length < 3" type="password" class="form form-control" name="password" id="password" placeholder="ga lupa password kan?" required>
            </div>
            <button :disabled="sending || email.length < 3 || password.length < 5" type="submit" class="btn btn-dark">
              <span v-if="!sending">Gass masuk!</span>
              <span v-else>tunggu bentar...</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'login',
  middleware: 'check-auth'
})

let client = usePocketBaseClient()
let user = usePocketBaseUser()
// console.log(user.value)
if(user.value) navigateTo('/')
let email = ref('')
let password = ref('')
let isError = ref(false)
let sending = ref(false)

async function handleLogin() {
  isError.value = false
  sending.value = true
  try {
    client.autoCancellation(false)
    let authData = await client.collection('teacher_users').authWithPassword(
      email.value,
      password.value
    )
    if(authData) {
      navigateTo('/')
      sending.value = false
    }
  } catch (error) {
    isError.value = true
    sending.value = false
    password.value = ''
  }
}
</script>
