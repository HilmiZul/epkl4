<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" col="5" row="1" />
      <span v-else class="h4 quicksand">Pembimbing / <span class="fw-bold text-dark">{{ form.nama }}</span></span>
    </div>
    <div class="card-body">
      <!-- <div class="row">
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Perhatiin!</div>
            <ul class="small">
              <li>Guru pembimbing adalah Guru yang mengajar pada tingkat XII</li>
              <li>Guru pembimbing termasuk Guru kejuruan</li>
              <li>Guru pembimbing akan dipetakan saat pembuatan daftar IDUKA</li>
              <li>Apabila tidak ada NIP, isi dengan tanda —</li>
            </ul>
          </div>
        </div>
      </div> -->
      <div class="row">
        <div class="col-md-5">
          <form @submit.prevent="updatePembimbingBaru">
            <div class="mb-4">
              <label for="username">Username</label>
              <input v-model="form.username" :disabled="isLoading" type="text" id="username" class="form form-control" placeholder="masukkan username" required autofocus>
            </div>
            <div class="my-4">
              <label for="nama">Nama</label>
              <input v-model="form.nama" :disabled="isLoading" type="text" id="nama" class="form form-control" placeholder="masukkan nama Guru Pembimbing" required>
            </div>
            <div class="my-4">
              <label for="role">Role</label>
              <select v-model="form.role" :disabled="isLoading" id="role" class="form form-control form-select" required>
                <option disabled value="">—</option>
                <option value="jurusan">Manajemen</option>
                <option value="guru">Guru Pembimbing</option>
              </select>
            </div>
            <button :disabled="isSending || isLoading || form.username == '' || form.email == '' || form.password == '' || form.nama == '' || form.role == ''" class="btn btn-success me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pembimbing" class="btn btn-light">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 my-4"><em>Berhasil tersimpan!</em></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Update Pembimbing — e-PKL / SMKN 4 Tasikmalaya'})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let route = useRoute()
let prokel = user.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let form = ref({
  username: 'loading',
  nama: 'loading',
  role: 'loading',
})
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function updatePembimbingBaru() {
  isSending.value = true
  isSaved.value = false
  form.value.username = form.value.username.toLowerCase()
  let data = await client.collection('teacher_users').update(route.params.id, form.value)
  if(data) {
    isSending.value = false
    isSaved.value = true
  }
}

async function getPembimbingById(loading=true) {
  isLoading.value = loading
  let data = await client.collection('teacher_users').getOne(route.params.id)
  if(data) {
    isLoading.value = false
    form.value = data
  }
}

onMounted(() => {
  getPembimbingById()
  client.collection('teacher_users').subscribe("*", function (e) {
    if(e.action == 'update') getPembimbingById(false)
  }, {});
})
</script>
