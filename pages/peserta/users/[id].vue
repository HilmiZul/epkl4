<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand">User Peserta /
      <span v-if="!isLoading && form" class="fw-bold text-dark">{{ form.expand.siswa.nama }}</span></span>
    </div>
    <div class="card-body">
      <Loading v-if="isLoading" />
      <div v-else class="row">
        <div class="col-md-5">
          <form @submit.prevent="updateUserpeserta">
            <div class="mb-4">
              <label for="username">Username</label>
              <input v-model="form.username" :disabled="isLoading" type="text" id="username" class="form form-control" placeholder="masukkan username" required autofocus>
            </div>
            <button :disabled="isSending || form.username.length < 6" class="btn btn-success me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/peserta/users" class="btn btn-light">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 my-4"><em>Berhasil tersimpan!</em></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Update User Peserta — e-PKL / SMKN 4 Tasikmalaya'})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let route = useRoute()
let prokel = user.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let form = ref({
  username: '',
})
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function updateUserpeserta() {
  isSending.value = true
  isSaved.value = false
  form.value.username = form.value.username.toLowerCase()
  let data = await client.collection('users_siswa').update(route.params.id, form.value)
  if(data) {
    isSending.value = false
    isSaved.value = true
  }
}

async function getUserPesertaById(loading=true) {
  isLoading.value = loading
  let data = await client.collection('users_siswa').getOne(route.params.id, {
    expand: "siswa"
  })
  if(data) {
    isLoading.value = false
    form.value = data
  }
}

onMounted(() => {
  getUserPesertaById()
  client.autoCancellation(false)
  client.collection('users_siswa').subscribe("*", function (e) {
    if(e.action == 'update') getUserPesertaById(false)
  }, {});
})
</script>
