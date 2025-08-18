<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand text-muted">IDUKA / <span class="text-grey">{{ form.nama }}</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Perhatiin!</div>
            <ul>
              <li>Banyaknya kuota peserta sesuai permintaan IDUKA</li>
              <li>Jika tidak ada isian, isi form dengan tanda &#8212;</li>
            </ul>
          </div>
        </div>
      </div>
      <form @submit.prevent="updateIduka" class="form-horizontal">
        <div class="row">
          <div class="col-md-12"><div v-if="isSaved" class="my-3 alert alert-success border-2 border-success py-2"><i class="bi bi-check-circle"></i> Berhasil tersimpan!</div></div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="my-4">
                <label for="nama">Nama IDUKA</label>
                <input :disabled="isLoading" v-model="form.nama" type="text" id="nama" class="form form-control" placeholder="Tulis nama IDUKA" required autofocus>
              </div>
              <div class="mb-4">
                <label for="alamat">Alamat</label>
                <textarea :disabled="isLoading" v-model="form.alamat" id="alamat" class="form form-control" cols="30" rows="3" placeholder="Alamat lengkap IDUKA. Gunain search enginge kalau bingung" required></textarea>
              </div>
              <div class="mb-4">
                <label for="pimpinan">Pimpinan/PIC</label>
                <input :disabled="isLoading" v-model="form.pimpinan" type="text" id="pimpinan" class="form form-control" placeholder="Kalau belum tahu tulis —" required>
              </div>
              <div class="mb-4">
                <label for="kontak">Kontak</label>
                <input :disabled="isLoading" v-model="form.kontak" type="text" maxlength="13" min="0" id="kontak" class="form form-control" placeholder="di search engine biasanya ada" required>
              </div>
              <div class="mb-4">
                <label for="email">Email</label>
                <input :disabled="isLoading" v-model="form.email" type="email" id="email" class="form form-control" placeholder="(biasanya) email juga ada" required>
              </div>
            </div>
          <!-- </div>
          <div class="col-md-6"> -->
            <div class="form-group">
              <div class="my-3">
                <label for="kuota">Jumlah Kuota Peserta</label>
                <input :disabled="isLoading" v-model="form.jumlah_kuota" type="number" min="1" max="10" id="kuota" class="form form-control" required>
              </div>
              <!-- <input v-model="form.program_keahlian" type="hidden" :value="prokel" disabled id="prokel" class="form form-control"> -->
              <div class="mb-4">
                <label for="pem_sekolah">Pembimbing Sekolah</label>
                <select :disabled="isLoading" v-model="form.pembimbing_sekolah" id="pem_sekolah" class="form form-control form-select">
                  <option disabled value="" selected>&#8212;</option>
                  <option :disabled="isLoading" v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.nama }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="pem_iduka">Pembimbing IDUKA</label>
                <input :disabled="isLoading" v-model="form.pembimbing_iduka" type="text" id="pem_iduka" class="form form-control" placeholder="Tulis — kalau belum tahu" required>
              </div>
              <div class="mb-4">
                <label for="wilayah">Wilayah</label>
                <select :disabled="isLoading" v-model="form.wilayah" id="wilayah" class="form form-control form-select" required>
                  <option value="dalam" selected>Dalam kota</option>
                  <option value="luar">Luar kota</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="catatan">Catatan (opsional)</label>
                <input :disabled="isLoading" v-model="form.catatan" type="text" id="catatan" class="form form-control" placeholder="Ada catatan untuk IDUKA ini?">
              </div>
              <button :disabled="isSending" class="btn btn-success me-2 mb-4">
                <span v-if="isSending">Sedang menyimpan</span>
                <span v-else>Simpan</span>
              </button>
              <nuxt-link class="btn btn-light mb-4" to="/iduka">Kembali</nuxt-link>
              <span v-if="isSaved" class="ms-2 mb-4"><em>Berhasil tersimpan!</em></span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mt-4 mb-1">Terisi:
              <span v-if="form.terisi < form.jumlah_kuota">{{ form.terisi }} dari {{ form.jumlah_kuota }}</span>
              <span v-else class="badge bg-danger mb-1">Penuh</span>
            </div>
            <div class="alert shadow-lg">
              <table class="table small border-0">
                <tbody>
                  <tr v-if="isLoading">
                    <td colspan="2"><Loading /></td>
                  </tr>
                  <tr v-else-if="mapping.length < 1">
                    <td colspan="2" class="text-center">
                      <nuxt-link to="/pemetaan/pkl/tambah" class="btn btn-info">Petakan sekarang <i class="bi bi-box-arrow-up-right"></i></nuxt-link>
                    </td>
                  </tr>
                  <tr v-else v-for="p in mapping" :key="p.id">
                    <td>{{ p.expand.siswa.nama }}</td>
                    <td>{{ p.expand.siswa.kelas }}</td>
                  </tr>
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})
useHead({ title: "Update IDUKA — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let route = useRoute()
let prokel = user?.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let teachers = ref([])
// let teacher_users = ref([])
let mapping = ref([])
let form = ref({
  nama: "loading",
  alamat: "loading",
  pimpinan: "loading",
  kontak: "",
  email: "email@gmail.com",
  jumlah_kuota: "",
  program_keahlian: "",
  pembimbing_sekolah: "loading",
  pembimbing_iduka: "loading",
  wilayah: "dalam",
  terisi: 0,
  catatan: "",
  pembimbing: ""
})

async function updateIduka() {
  isSending.value = true
  isSaved.value = false
  let data = await client
    .collection("iduka")
    .update(form.value.id, form.value)
  if(data) {
    isSending.value = false
    isSaved.value = true
  }
}

async function getCompanyAndPemetaanById() {
  isLoading.value = true
  let res_iduka = await client
    .collection("iduka")
    .getOne(route.params.id, {
      expand: "program_keahlian, pembimbing_sekolah"
    })
  let res_pemetaan = await client.collection('pemetaan').getFullList({
    filter: "iduka='"+route.params.id+"'",
    expand: "iduka, siswa"
  })
  if(res_iduka && res_pemetaan) {
    isLoading.value = false
    form.value = res_iduka
    mapping.value = res_pemetaan
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

// async function TempgetPembimbing() {
//   isLoading.value = true
//   let data = await client
//     .collection("teacher_users")
//     .getFullList({
//       filter: "program_keahlian='"+prokel+"'"
//     })
//   if(data) {
//     isLoading.value = false
//     teacher_users.value = data
//   }
// }

onMounted(() => {
  // TempgetPembimbing()
  getPembimbingSekolah()
  getCompanyAndPemetaanById()
  client.collection('iduka').subscribe(route.params.id, function(e) {
    if(e.action == 'update') {
      getCompanyAndPemetaanById()
      getPembimbingSekolah()
    }
  },{})
})
</script>
