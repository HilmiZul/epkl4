<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" col="5" row="1" />
      <span v-else class="h4 quicksand fw-bold text-muted">IDUKA / <span class="text-dark">{{ form.nama }}</span></span>
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
      <form @submit.prevent="updateIduka" class="form-horizontal">
        <div class="row">
          <!-- <div class="col-md-12"><div v-if="isSaved" class="my-3 alert alert-success border-2 border-success py-2"><i class="bi bi-check-circle"></i> Berhasil tersimpan!</div></div> -->
          <div class="col-md-6">
            <div v-if="isFail" class="alert alert-danger p-2">
              Terjadi error: {{ errMessage }}
            </div>
            <div class="form-group">
              <div class="mb-4">
                <label for="nama">Nama IDUKA</label>
                <input :disabled="isLoading" v-model="form.nama" type="text" id="nama" class="form form-control form-control-lg" placeholder="Tulis nama IDUKA" required autofocus>
              </div>
              <div class="mb-4">
                <label for="alamat">Alamat</label>
                <textarea :disabled="isLoading" v-model="form.alamat" id="alamat" class="form form-control form-control-lg" cols="30" rows="3" placeholder="Alamat lengkap IDUKA. Gunain search enginge kalau bingung" required></textarea>
              </div>
              <div class="mb-4">
                <label for="pimpinan">Pimpinan/PIC</label>
                <input :disabled="isLoading" v-model="form.pimpinan" type="text" id="pimpinan" class="form form-control form-control-lg" placeholder="Kalau belum tahu, ketik '-'" required>
              </div>
              <div class="mb-4">
                <label for="kontak">Kontak</label>
                <input :disabled="isLoading" v-model="form.kontak" type="text" maxlength="13" min="0" id="kontak" class="form form-control form-control-lg" placeholder="di search engine biasanya ada" required>
              </div>
              <div class="mb-4">
                <label for="email">Email</label>
                <input :disabled="isLoading" v-model="form.email" type="email" id="email" class="form form-control form-control-lg" placeholder="(biasanya) email juga ada" required>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="mb-4">
                <label for="kuota">Jumlah Kuota Peserta</label>
                <input :disabled="isLoading" v-model="form.jumlah_kuota" type="number" min="1" max="15" id="kuota" class="form form-control form-control-lg" required>
              </div>
              <!-- <input v-model="form.program_keahlian" type="hidden" :value="prokel" disabled id="prokel" class="form form-control"> -->
              <div class="mb-4">
                <label for="pem_sekolah">Pembimbing Sekolah</label>
                <select :disabled="isLoading" v-model="form.pembimbing_sekolah" id="pem_sekolah" class="form form-control form-select form-select-lg">
                  <option disabled value="" selected>&#8212;</option>
                  <option :disabled="isLoading" v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.nama }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="pem_iduka">Pembimbing IDUKA</label>
                <input :disabled="isLoading" v-model="form.pembimbing_iduka" type="text" id="pem_iduka" class="form form-control form-control-lg" placeholder="Kalau belum tahu, ketik '-'" required>
              </div>
              <div class="mb-4">
                <label for="wilayah">Wilayah</label>
                <select :disabled="isLoading" v-model="form.wilayah" id="wilayah" class="form form-control form-select form-select-lg" required>
                  <option value="dalam" selected>Dalam kota</option>
                  <option value="luar">Luar kota</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="catatan">Catatan (opsional)</label>
                <input :disabled="isLoading" v-model="form.catatan" type="text" id="catatan" class="form form-control form-control-lg" placeholder="Ada catatan untuk IDUKA ini?">
              </div>
            </div>
          </div>
          <!-- <div class="col-md-6">
            <LoadingPlaceholder v-if="isLoading" col="3" row="1" />
            <div v-else class="mt-4 mb-1">Terisi:
              <span v-if="form.terisi < form.jumlah_kuota">{{ form.terisi }} dari {{ form.jumlah_kuota }}</span>
              <span v-else class="badge bg-danger mb-1">Penuh</span>
            </div>
            <div class="alert shadow-lg">
              <LoadingPlaceholder v-if="isLoading" col="12" row="2" />
              <table v-else class="table small border-0">
                <tbody>
                  <tr v-if="mapping.length < 1 || isLoading">
                    <td colspan="2" class="text-center">
                      <nuxt-link to="/pemetaan/pkl/tambah" class="btn btn-info">Petakan sekarang <i class="bi bi-arrow-up-right"></i></nuxt-link>
                    </td>
                  </tr>
                  <tr v-else v-for="p in mapping" :key="p.id">
                    <td>{{ p.expand.siswa.nama }}</td>
                    <td>{{ p.expand.siswa.kelas }}</td>
                  </tr>
                  </tbody>
              </table>
            </div>
          </div> -->
        </div>
        <div class="row">
          <div class="col-md-6">
            <button :disabled="isSending || isLoading" class="btn btn-success me-2 mb-4 border border-2 border-dark">
              <span v-if="isSending">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link class="btn btn-danger mb-4 border border-2 border-dark" to="/iduka">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil tersimpan!</span>
            <span v-if="isFail" class="ms-2 fst-italic text-danger small">Terjadi error saat menyimpan!</span>
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
let isFail = ref(false)
let errMessage = ref('')
let teachers = ref([])
// let teacher_users = ref([])
let mapping = ref([])
let form = ref({
  nama: "",
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
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function updateIduka() {
  try {
    isSending.value = true
    isSaved.value = false
    let data = await client
      .collection("iduka")
      .update(form.value.id, form.value)
    if(data) {
      isSending.value = false
      isSaved.value = true
      navigateTo('/iduka')
    }
  } catch(error) {
    isSending.value = false
    isSaved.value = false
    isFail.value = true
    errMessage.value = error
  }
}

async function getCompanyAndPemetaanById(loading=true) {
  isLoading.value = loading
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
    form.value = res_iduka
    mapping.value = res_pemetaan
    isLoading.value = false
  }
}

async function getPembimbingSekolah(loading=true) {
  isLoading.value = loading
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
  client.collection('iduka').subscribe('*', function(e) {
    if(e.action == 'update') {
      getCompanyAndPemetaanById(false)
      getPembimbingSekolah(false)
    }
  },{})
})
</script>
