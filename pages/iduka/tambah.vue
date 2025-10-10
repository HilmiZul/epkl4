<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold text-muted">IDUKA / <span class="text-dark">Tambah baru</span></span>
    </div>
    <div class="card-body">
      <!-- <div class="row">
        <div class="col-md-12">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Perhatiin!</div>
            <ul>
              <li>Banyaknya kuota peserta sesuai permintaan IDUKA</li>
              <li>Jika tidak ada isian, isi form dengan tanda &#8212;</li>
            </ul>
          </div>
        </div>
      </div> -->
      <div v-if="isFail" class="alert alert-danger p-2 mb-0 mt-2">
        Terjadi error: {{ errMessage }}
      </div>
      <form @submit.prevent="buatIdukaBaru" class="form-horizontal">
        <div class="row">
          <!-- <div class="col-md-12"><div v-if="isSaved" class="my-3 alert alert-success border-2 border-success py-2"><i class="bi bi-check-circle"></i> IDUKA baru berhasil ditambahkan!</div></div> -->
          <div class="col-md-6">
            <div class="form-group">
              <div class="mb-4">
                <label for="nama">Nama IDUKA</label>
                <input v-model="form.nama" type="text" id="nama" class="form form-control" placeholder="Tulis nama IDUKA" required autofocus>
              </div>
              <div class="mb-4">
                <label for="alamat">Alamat</label>
                <textarea v-model="form.alamat" id="alamat" class="form form-control" cols="30" rows="3" placeholder="Alamat lengkap IDUKA. Gunain search enginge kalau bingung" required></textarea>
              </div>
              <div class="mb-4">
                <label for="pimpinan">Pimpinan/PIC</label>
                <input v-model="form.pimpinan" type="text" id="pimpinan" class="form form-control" placeholder="Kalau belum tahu, ketik '—'" required>
              </div>
              <div class="mb-4">
                <label for="kontak">Kontak</label>
                <input v-model="form.kontak" type="text" maxlength="13" min="0" id="kontak" class="form form-control" placeholder="di search engine biasanya ada" required>
              </div>
              <div class="mb-4">
                <label for="email">Email</label>
                <input v-model="form.email" type="email" id="email" class="form form-control" placeholder="(biasanya) email juga ada" required>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="mb-4">
                <label for="kuota">Jumlah Kuota Peserta</label>
                <input v-model="form.jumlah_kuota" type="number" min="1" max="15" id="kuota" class="form form-control" required>
              </div>
              <!-- <input v-model="form.program_keahlian" type="hidden" :value="prokel" disabled id="prokel" class="form form-control"> -->
              <div class="mb-4">
                <label for="pem_sekolah">Pembimbing Sekolah</label>
                <select v-model="form.pembimbing_sekolah" id="pem_sekolah" class="form form-control form-select">
                  <option disabled value="" selected>&#8212;</option>
                  <option :disabled="isLoading" v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.nama }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="pem_iduka">Pembimbing IDUKA</label>
                <input v-model="form.pembimbing_iduka" type="text" id="pem_iduka" class="form form-control" placeholder="Kalau belum tahu, ketik '—'" required>
              </div>
              <div class="mb-4">
                <label for="wilayah">Wilayah</label>
                <select v-model="form.wilayah" id="wilayah" class="form form-control form-select" required>
                  <option value="dalam" selected>Dalam kota</option>
                  <option value="luar">Luar kota</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="catatan">Catatan (opsional)</label>
                <input v-model="form.catatan" type="text" id="catatan" class="form form-control" placeholder="Ada catatan untuk IDUKA ini?">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <button :disabled="isSending" class="btn btn-success me-2 mb-4">
              <span v-if="isSending">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link class="btn btn-light mb-4" to="/iduka">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil tersimpan!</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Tambah IDUKA — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let prokel = user?.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let isFail = ref(false)
let errMessage = ref('')
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
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function buatIdukaBaru() {
  try {
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
      navigateTo('/iduka')
    }
  } catch(error) {
    isSending.value = false
    isSaved.value = false
    isFail.value = true
    errMessage.value = error
  }
}

async function getPembimbingSekolah() {
  isLoading.value = true
  let data = await client
    .collection("teacher_users")
    .getFullList({
      filter: "program_keahlian='"+prokel+"' && role!='admin'",
      sort: "nama"
    })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

onMounted(() => getPembimbingSekolah())
</script>
