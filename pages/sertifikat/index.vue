<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-person-vcard-fill"></i> Sertifikat</span>
    </div>
    <div class="card-body small">
      <div class="p-4 text-center fs-4 text-muted">
        <i class="bi bi-cone-striped fs-1"></i> <br>
        Sedang dalam pengembangan
      </div>
      <!-- <div class="row">
        <div class="col-lg-3">
          <select @change="getKelasByProkel" v-model="form.prokel" class="form form-select">
            <option value="">&#8212; Program Keahlian &#8212;</option>
            <option v-for="p in prokels" :key="p.id" :value="p.id">{{ p.nama }}</option>
          </select>
        </div>
        <div class="col-lg-3">
          <select @change="getSiswaByProkelKelas" v-model="form.kelas" class="form form-select" :disabled="form.prokel < 1">
            <option value="">&#8212; Kelas &#8212;</option>
            <option v-for="(k,i) in kelas" :key="i" :value="k">{{ k }}</option>
          </select>
        </div>
        <div class="col-lg-6">
          <select @change="getPemetaanBySiswa" v-model="form.siswa" class="form form-select" :disabled="form.prokel < 1 || form.kelas < 1">
            <option value="">&#8212; Peserta didik &#8212;</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nama }}</option>
          </select>
          <div v-if="isLoaded" class="text-end pt-3"><button class="btn btn-success btn-sm border border-2 border-dark"><i class="bi bi-download"></i> Unduh</button></div>
        </div>
      </div> -->

      <div v-if="isLoaded" class="row pt-3">
        <div class="col-md-12">
          <div class="container">
            <div class="logo fw-bold">
              [Logo IDUKA disini]
            </div>
            <div class="title text-center">
              Sertifikat Praktik Kerja Lapangan
            </div>
            <div class="assignment text-center">
              diberikan kepada
            </div>
            <div class="person py-5 text-center">
              {{ nama_peserta }}
            </div>
            <div class="text text-center">
              atas pencapaian melaksanakan Praktik Kerja Lapangan<br/>
              selama 4 bulan dari .. sampai dengan .. April 2026.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Sertifikat — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let role = user?.user.value.role
let prokel = user?.user.value.program_keahlian
let prokels = ref([])
let kelas = ref([])
let students = ref([])
let isLoaded = ref(false)
let form = ref({
  prokel: '',
  kelas: '',
  siswa: ''
})
let nama_peserta = ref('')
if(role == 'tu') navigateTo('/404')

let getKelasByProkel = (e) => {
  // form.value.prokel = e.target.value
  if(e.target.value == '1oxybjgp1yzjsf2') {
    kelas.value = ['PPLG-1', 'PPLG-2', 'PPLG-3', 'PPLG-4']
  } else if(e.target.value == 'dn9c8m8i5ycdj6o') {
    kelas.value = ['TJKJ-1', 'TJKJ-2', 'TJKJ-3', 'TJKJ-4']
  } else if(e.target.value == 'gkxskc1e02ja0g1') {
    kelas.value = ['TSM-1', 'TSM-2', 'TSM-3', 'TSM-4']
  } else if(e.target.value == '4co5ufcfj8299x1') {
    kelas.value = ['DKV-1', 'DKV-2']
  } else if(e.target.value == 'dwj17n1t1apuovp') {
    kelas.value = ['TOI']
  }
}

async function getSiswaByProkelKelas(e) {
  client.autoCancellation(false)
  let res_peserta = await client.collection('siswa').getFullList({
    filter: "program_keahlian='"+form.value.prokel+"' && kelas='"+form.value.kelas+"'",
    sort: "nama"
  })
  if(res_peserta) {
    students.value = res_peserta
  }
}

async function getProkel() {
  client.autoCancellation(false)
  let res_prokel = await client.collection('program_keahlian').getFullList({
    sort: 'created'
  })
  if(res_prokel) {
    prokels.value = res_prokel
  }
}

async function getPemetaanBySiswa() {
  isLoaded.value = false
  client.autoCancellation(false)
  let res_pemetaan = await client.collection('pemetaan').getFirstListItem(`siswa='${form.value.siswa}'`, {
    expand: "iduka, siswa, program_keahlian"
  })
  if(res_pemetaan) {
    isLoaded.value = true
    nama_peserta.value = res_pemetaan.expand.siswa.nama
  }
}

onMounted(() => {
  getProkel()
})
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
}
body {
  color: black;
  display: table;
  font-size: 24px;
  text-align: center;
}
.container {
  border: 20px solid #b5d2ad;
  width: 297mm !important;
  height: 210mm !important;
  display: table-cell;
  vertical-align: middle;
}
.logo {
  font-size: large;
  color: #b5d2ad;
}

.title {
  color: #b5d2ad;
  font-size: 48px;
  margin: 20px;
}
.assignment {
  margin: 20px;
}
.person {
  font-size: 20pt;
  font-style: italic;
  margin: 0 auto;
  width: 400px;
}
.text {
  margin: 20px;
}
</style>
