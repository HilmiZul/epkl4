<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-person-vcard-fill"></i> Sertifikat</span>
      <button v-if="isLoaded" @click="unduhPdf" class="btn btn-info btn-sm border border-2 border-dark float-end">
        <i class="bi bi-download"></i> Unduh
      </button>
    </div>
    <div class="card-body">
      <div v-if="isLoaded || nilai.length > 0" class="alert alert-info">
        <ul class="mb-0">
          <li>Berikut daftar peserta yang menitipkan <span class="fw-bold">Sertifikat</span> ke Sekolah.</li>
          <li>Pilih nama peserta untuk melihat pratinjau Sertifikat.</li>
          <li>Apabila sudah benar, klik tombol <span class="fw-bold">Unduh</span> diatas.</li>
        </ul>
      </div>
      <loading-placeholder v-if="isLoading" row="1" col="4" />
      <div v-else class="row">
        <div v-if="nilai.length > 0" class="col-lg-4">
          <label for="peserta">Pilih Nama Peserta</label>
          <multiselect
            @update:modelValue="getNilaiById"
            v-model="selectedPeserta"
            :options="nilai"
            :clear-on-select="true"
            :custom-label="({expand}) => `${expand.siswa.nama}`"
            track-by="expand"
            label="expand"
            id="peserta"
            placeholder="Pilih untuk menampilkan disertifikat"
            required>
            <template v-slot:singleLabel="{ option }"><strong>{{ option.expand.siswa.nama }}</strong></template>
          </multiselect>
        </div>
        <div v-else class="p-4 text-muted">
          <div class="text-center fs-4">
            <i class="bi bi-database-fill fs-1"></i> <br>
            Belum ada nilai
          </div>
          <div class="text-center">
            Pastikan peserta didik sudah menyerahkan nilai dan divalidasi oleh Anda.
          </div>
        </div>
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

      <loading-placeholder v-if="isLoading" row="1" col="12" />
      <div v-else-if="!isLoading && nilai.length > 0" class="row pt-3">
        <div class="col-md-12">
          <div ref="toPdf">
            <sertifikat-template :sertifikat="sertifikat" :isLoaded="isLoaded" :nilai_indeks="nilai_indeks" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import html2pdf from 'html2pdf.js'

definePageMeta({ middleware: 'auth' })
useHead({ title: "Sertifikat — e-PKL / SMKN 4 Tasikmalaya." })
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
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
let pengaturan = ref()
let nilai = ref('')
let isLoading = ref(true)
let selectedPeserta = ref()
let nilai_indeks = ref()
let sertifikat = ref({
  "logo": "",
  "iduka": "",
  "siswa": "",
  "nomor_sertifikat": "",
  "nilai_elemen1": "",
  "nilai_elemen2": "",
  "nilai_elemen3": "",
  "nilai_elemen4": "",
  "pj_penandatangan": "",
  "nama_pj_penandatangan": "",
  "nomor_pegawai": "",
})
let toPdf = ref(null) // var untuk nyimpen component yang downloadable PDF
if(role == 'tu') navigateTo('/404')

async function getNilai() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `program_keahlian="${prokel}" && iduka.pembimbing_sekolah="${user.user.value.id}" && isEntrust=True && isValid=True`,
    expand: `siswa, program_keahlian, iduka`,
  })
  if(res) {
    nilai.value = res
    isLoading.value = false
  }
}

function getNilaiById(value) {
  isLoaded.value = true
  sertifikat.value = value
  let average = (value.nilai_elemen1 + value.nilai_elemen2 + value.nilai_elemen3 + value.nilai_elemen4) / 4
  if(average >= 86) nilai_indeks.value = "Amat Baik"
  else if(average >= 70) nilai_indeks.value = "Baik"
  else nilai_indeks.value = "Kurang"
}

async function getSetting() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('pengaturan').getOne("pt7b25ofddwhngp")
  if(res) {
    pengaturan.value = res
    isLoading.value = false
  }
}

function unduhPdf() {
  if(toPdf.value) {
    html2pdf().set({
      filename: `Sertifikat PKL - ${sertifikat.value.expand.siswa.nama} - XII.${sertifikat.value.expand.siswa.kelas}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(toPdf.value).save()
  }
}

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

onMounted(() => {
  getProkel()
  getNilai()
  getSetting()
})
</script>

