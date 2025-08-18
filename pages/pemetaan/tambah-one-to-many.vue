<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand text-grey">Pemetaan / <span class="text-muted">Tambah baru</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="buatPemetaan">
            <div class="mb-3">
              <label for="wilayah">Wilayah</label>
              <select @change="getCompaniesByProkel" v-model="selectWilayah" id="wilayah" class="form form-control form-select" required>
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
              <label for="peserta">Peserta didik (pilih satu atau lebih)</label>
              <multiselect
                v-model="form.siswa"
                :options="students"
                :multiple="true"
                :modelValue="integer"
                :clear-on-select="true"
                :close-on-select="false"
                :custom-label="({nama, kelas}) => `${nama} — ${kelas}`"
                track-by="nama"
                label="nama"
                id="peserta"
                placeholder="Pilih satu atau lebih"
                required>
                <template #selection="{ values }">
                  <span class="multiselect__single" v-for="student in values" :key="student.id">{{ student.nama }} / {{ student.kelas }}</span>
                </template>
              </multiselect>
            </div>
            <button :disabled="isSending" class="btn btn-success me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pemetaan" class="btn btn-light me-2">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-muted">Berhasil terpetakan!</em>
          </form>
        </div>
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Perhatian!</div>
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
definePageMeta({ middleware: 'auth' })
useHead({ title: "Tambah Pemetaan — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let companies = ref([])
let students = ref([])
let selectWilayah = ref('dalam')
let isLoadingCompanies = ref(true)
let isLoadingStudents = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let form = ref({
  iduka: '',
  siswa: [],
  program_keahlian: ''
})

async function buatPemetaan() {
  isSending.value = true
  form.value.program_keahlian = prokel
  form.value.iduka = form.value.iduka.id
  let tempSiswa = []
  for(let i=0; i<form.value.siswa.length; i++) {
    tempSiswa.push(form.value.siswa[i].id)
  }
  form.value.siswa = tempSiswa
  let data = await client
    .collection('pemetaan')
    .create(form.value)
  if(data) {
    isSending.value = false
    isSaved.value = true
    // console.log(`banyak peserta: ${form.value.siswa.length}`)
    // console.log(`peserta tertentu: ${form.value.siswa[0]}`)
    // console.log(`peserta tertentu: ${form.value.siswa[1]}`)
    // console.log(`iduka: ${form.value.iduka}`)
    for(let i=0; i<form.value.siswa.length; i++) {
      await client.collection('siswa').update(form.value.siswa[i], { status_pemetaan_pkl:true })
    }
    await client.collection('iduka').update(form.value.iduka, { terisi: form.value.siswa.length })
    // form.value.iduka = ''
    // form.value.siswa = []
    // form.value.program_keahlian = ''
  }
}

async function getCompaniesByProkel() {
  isLoadingCompanies.value = true
  let data = await client
    .collection("iduka")
    .getFullList({
      filter: "wilayah='"+selectWilayah.value+"' && program_keahlian='"+prokel+"' && terisi=0",
    })
  if(data) {
    isLoadingCompanies.value = false
    companies.value = data
  }
}

async function getStudentsByProkel() {
  isLoadingStudents.value = true
  let data = await client
    .collection("siswa")
    .getFullList({
      filter: "program_keahlian='"+prokel+"' && status_rapot=true && status_pemetaan_pkl=false"
    })
  if(data) {
    isLoadingStudents.value = false
    students.value = data
  }
}

onMounted(() => {
  getCompaniesByProkel()
  getStudentsByProkel()
})
</script>
