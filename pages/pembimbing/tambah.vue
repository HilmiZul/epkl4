<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana text-muted">Pembimbing / <span class="text-grey">Tambah baru</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 romana">Perhatiin!</div>
            <ul class="small">
              <li>Guru pembimbing adalah Guru yang mengajar pada tingkat XII</li>
              <li>Guru pembimbing termasuk Guru kejuruan</li>
              <li>Guru pembimbing akan dipetakan saat pembuatan daftar IDUKA</li>
              <li>Apabila tidak ada NIP, isi dengan tanda —</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5">
          <form @submit.prevent="buatPembimbingBaru">
            <div class="my-3">
              <label for="nip">NIP</label>
              <input v-model="form.nip" type="text" id="nip" class="form form-control" placeholder="masukkan NIP" required autofocus>
            </div>
            <div class="mb-3">
              <label for="nama">Nama</label>
              <input v-model="form.nama" :disabled="form.nip.length < 1" type="text" id="nip" class="form form-control" placeholder="masukkan nama Guru Pembimbing" required>
            </div>
            <button :disabled="isSending || form.nip.length < 1 || form.nama.length < 4" class="btn btn-success btn-sm me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pembimbing" class="btn btn-light btn-sm">Kembali</nuxt-link>
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
  nip: '',
  nama: '',
  program_keahlian: ''
})

async function buatPembimbingBaru() {
  isSending.value = true
  isSaved.value = false
  form.value.program_keahlian = prokel
  let data = await client.collection('pembimbing').create(form.value)
  if(data) {
    isSending.value = false
    isSaved.value = true
  }
}
</script>
