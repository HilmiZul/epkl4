<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand text-muted">Pembimbing / <span class="text-grey">Tambah baru</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Perhatiin!</div>
            <ul class="small">
              <li>Guru pembimbing adalah Guru yang mengajar pada tingkat XII</li>
              <li>Guru pembimbing termasuk Guru kejuruan</li>
              <li>Guru pembimbing akan dipetakan saat pembuatan daftar IDUKA</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="buatPembimbingBaru">
            <div class="my-4">
              <label for="username">Username</label>
              <input v-model="form.username" type="text" id="username" class="form form-control" placeholder="masukkan username" required autofocus>
            </div>
            <div class="my-4">
              <label for="email">Email</label>
              <input v-model="form.email" :disabled="form.username.length < 3" type="email" id="email" class="form form-control" placeholder="masukkan email (sekolah)" required>
            </div>
            <div class="my-4">
              <label for="password">Password</label>
              <input v-model="form.password" :disabled="form.email.length < 10" type="password" id="password" class="form form-control" placeholder="masukkan password min.8 karakter" required>
            </div>
            <div class="my-4">
              <label for="nama">Nama</label>
              <input v-model="form.nama" :disabled="form.password.length < 8" type="text" id="nama" class="form form-control" placeholder="masukkan nama Guru Pembimbing" required>
            </div>
            <div class="my-4">
              <label for="role">Role</label>
              <select v-model="form.role" :disabled="form.nama.length < 4" id="role" class="form form-control form-select" required>
                <option disabled value="">—</option>
                <option value="jurusan">Guru Kejuruan</option>
                <option value="guru">Guru Umum</option>
              </select>
            </div>
            <button :disabled="isSending || form.username.length < 3 || form.email.length < 10 || form.password.length < 8 || form.nama.length < 4 || form.role.length < 4" class="btn btn-success me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pembimbing" class="btn btn-light">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3"><em>Berhasil tersimpan!</em></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Tambah Pembimbing — e-PKL / SMKN 4 Tasikmalaya'})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let form = ref({
  username: '',
  email: '',
  emailVisibility: true,
  password: '',
  passwordConfirm: '',
  nama: '',
  role: '',
  program_keahlian: '',
})

async function buatPembimbingBaru() {
  isSending.value = true
  isSaved.value = false
  form.value.program_keahlian = prokel
  form.value.username = form.value.username.toLowerCase()
  form.value.passwordConfirm = form.value.password
  let data = await client.collection('teacher_users').create(form.value)
  if(data) {
    isSending.value = false
    isSaved.value = true
  }
}
</script>
