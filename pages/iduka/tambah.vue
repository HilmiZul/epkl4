<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana text-grey">IDUKA / <span class="text-muted">Tambah baru</span></span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-md-5">
          <div v-if="isSaved" class="alert alert-success border-2 border-success">Berhasil tersimpan!</div>
          <form @submit.prevent="buatIdukaBaru">
            <div class="mb-3">
              <label for="nama">Nama IDUKA</label>
              <input v-model="form.nama" type="text" id="nama" class="form form-control " required autofocus>
            </div>
            <div class="mb-3">
              <label for="alamat">Alamat</label>
              <textarea v-model="form.alamat" id="alamat" class="form form-control " cols="30" rows="2" required></textarea>
            </div>
            <div class="mb-3">
              <label for="pimpinan">Pimpinan/PIC</label>
              <input v-model="form.pimpinan" type="text" id="pimpinan" class="form form-control " required>
            </div>
            <div class="mb-3">
              <label for="kontak">Kontak</label>
              <input v-model="form.kontak" type="text" maxlength="13" min="0" id="kontak" class="form form-control " required>
            </div>
            <div class="mb-3">
              <label for="email">Email</label>
              <input v-model="form.email" type="email" id="email" class="form form-control " required>
            </div>
            <div class="mb-3">
              <label for="kuota">Jumlah Kuota Peserta</label>
              <input v-model="form.jumlah_kuota" type="number" min="1" max="10" id="kuota" class="form form-control " required>
            </div>
            <!-- <input v-model="form.program_keahlian" type="hidden" :value="prokel" disabled id="prokel" class="form form-control"> -->
            <div class="mb-3">
              <label for="pem_sekolah">Pembimbing Sekolah</label>
              <select v-model="form.pembimbing_sekolah" id="pem_sekolah" class="form form-control form-select">
                <option disabled value="" selected>&#8212;</option>
                <option :disabled="isLoading" v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.nama }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="pem_iduka">Pembimbing IDUKA</label>
              <input v-model="form.pembimbing_iduka" type="text" id="pem_iduka" class="form form-control" required>
            </div>
            <div class="mb-3">
              <label for="wilayah">Wilayah</label>
              <select v-model="form.wilayah" id="wilayah" class="form form-control form-select" required>
                <option value="dalam" selected>Dalam kota</option>
                <option value="luar">Luar kota</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="catatan">Catatan</label>
              <input v-model="form.catatan" type="text" id="catatan" class="form form-control ">
            </div>
            <button :disabled="isSending" class="btn btn-dark btn-sm me-2 mb-3">
              <span v-if="isSending">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link class="btn btn-light btn-sm mb-3" to="/iduka">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3"><em>Berhasil tersimpan!</em></span>
          </form>
        </div>
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 romana">Perhatian!</div>
            <ul class="small">
              <li>IDUKA yang ditambahkan sesuai dengan Program Keahlian</li>
              <li>Setiap IDUKA dapat diatur berapa banyaknya kuota peserta (sesuai Program Keahlian)</li>
              <li>Setiap IDUKA dapat diatur berdasarkan jenis kelamin, L/P atau keduanya</li>
              <li>Jika tidak ada, isi form dengan tanda —</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let prokel = user?.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let teachers = ref([])
let form = ref({
  nama: "",
  alamat: "",
  pimpinan: "",
  kontak: "",
  email: "email@gmail.com",
  jumlah_kuota: "",
  program_keahlian: "",
  pembimbing_sekolah: "",
  pembimbing_iduka: "",
  wilayah: "dalam",
  terisi: 0,
  catatan: "",
})

async function buatIdukaBaru() {
  form.value.program_keahlian = prokel
  isSending.value = true
  isSaved.value = false
  let data = await client
    .collection("iduka")
    .create(form.value)
  if(data) {
    isSending.value = false
    isSaved.value = true
    form.value = {
      nama: "",
      alamat: "",
      pimpinan: "",
      kontak: "",
      email: "email@gmail.com",
      jumlah_kuota: "",
      program_keahlian: "",
      pembimbing_sekolah: "",
      pembimbing_iduka: "",
      wilayah: "dalam",
      terisi: 0,
      catatan: "",
    }
  }
}

async function getPembimbingSekolah() {
  isLoading.value = true
  let data = await client
    .collection("pembimbing")
    .getFullList({
      filter: "program_keahlian='"+prokel+"'"
    })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

onMounted(() => getPembimbingSekolah())
</script>
