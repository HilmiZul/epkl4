<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana text-muted">Pemetaan / <span class="text-grey">Tambah baru</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 romana">Perhatiin!</div>
            <ul class="small">
              <li>IDUKA yang ditambahkan sesuai dengan Program Keahlian</li>
              <li>Setiap IDUKA dapat diatur berapa banyaknya kuota peserta (sesuai Program Keahlian)</li>
              <li>Setiap IDUKA dapat diatur berdasarkan jenis kelamin, L/P atau keduanya</li>
              <li>Jika tidak ada, isi form dengan tanda —</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="buatPemetaan">
            <div class="my-3">
              <label for="wilayah">Wilayah (dalam/luar kota)</label>
              <!-- <multiselect
                v-model="selectWilayah"
                :options="wilayah"
                @select="getCompanies"
                id="wilayah">
              </multiselect> -->
              <select @change="getCompanies" v-model="selectWilayah" id="wilayah" class="form form-control form-select" required>
                <option value="dalam" selected>Dalam kota</option>
                <option value="luar">Luar kota</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="iduka">IDUKA</label>
              <multiselect
                v-model="form.iduka"
                :options="companies"
                :modelValue="integer"
                :clear-on-select="false"
                :custom-label="({nama, jumlah_kuota, terisi}) => `${nama} — ${terisi} dari ${jumlah_kuota}`"
                track-by="nama"
                label="nama"
                id="iduka"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }"><strong>{{ option.nama }} / {{ option.terisi }} dari {{ option.jumlah_kuota }}</strong></template>
              </multiselect>
            </div>
            <div class="mb-3">
              <label for="peserta">Peserta didik</label>
              <multiselect
                v-model="form.siswa"
                :options="students"
                :modelValue="integer"
                :clear-on-select="false"
                :custom-label="({nama, kelas}) => `${nama} — ${kelas}`"
                track-by="nama"
                label="nama"
                id="iduka"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }"><strong>{{ option.nama }} — {{ option.kelas }}</strong></template>
              </multiselect>
            </div>
            <button :disabled="isSending" class="btn btn-success btn-sm me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pemetaan" class="btn btn-light btn-sm me-2">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-muted">Berhasil terpetakan!</em>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Tambah Pemetaan — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let isLoadingCompanies = ref(true)
let isLoadingStudents = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let selectWilayah = ref('dalam')
let companies = ref([])
let students = ref([])
let form = ref({
  iduka: '',
  siswa: '',
  program_keahlian: ''
})
let wilayah = ref(['dalam', 'luar'])

async function buatPemetaan() {
  isSending.value = true
  isSaved.value = false
  let updateTerisi = form.value.iduka.terisi + 1
  form.value.program_keahlian = prokel
  form.value.iduka = form.value.iduka.id
  form.value.siswa = form.value.siswa.id
  // console.log(form.value)
  // console.log(updateTerisi)
  // client.autoCancellation(false)
  let data = await client.collection("pemetaan").create(form.value)
  // `terisi` + 1
  // status_pemetaan_pkl=true
  await client.collection("iduka").update(form.value.iduka, { terisi: updateTerisi })
  await client.collection("siswa").update(form.value.siswa, { status_pemetaan_pkl: true })
  if(data) {
    isSending.value = false
    isSaved.value = true
    navigateTo("/pemetaan")
  }
}

async function getCompanies() {
  isLoadingCompanies.value = true
  client.autoCancellation(false)
  let data = await client.collection("iduka")
    .getFullList({
      filter: "wilayah='"+selectWilayah.value+"' && program_keahlian='"+prokel+"' && terisi < jumlah_kuota",
    })
  if(data) {
    isLoadingCompanies.value = false
    companies.value = data
    if(companies.value.length < 1) navigateTo("/pemetaan")
  }
}

async function getStudents() {
  isLoadingStudents.value = true
  client.autoCancellation(false)
  let data = await client.collection("siswa")
    .getFullList({
      filter: "program_keahlian='"+prokel+"' && status_rapot=true && status_pemetaan_pkl=false"
    })
  if(data) {
    isLoadingStudents.value = false
    students.value = data
  }
}

onMounted(() => {
  getStudents()
  getCompanies()
  client.collection('pemetaan').subscribe('*', function (e) {
    if(e.action == 'create') {
      getStudents()
      getCompanies()
    }
  }, {})
})
</script>
