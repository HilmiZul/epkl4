<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-person-vcard-fill"></i> Sertifikat</span>
    </div>
    <div class="card-body small">
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
            <i class="bi bi-database fs-1"></i> <br>
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
          <div class="container">
            <div class="logo fw-bold text-muted">
              <span v-if="isLoaded">
                <img :src="`${host}/api/files/${sertifikat.collectionId}/${sertifikat.id}/${sertifikat.logo}`" :alt="sertifikat.expand.iduka.nama" class="logo-img" />
              </span>
              <span v-else class="logo-img">[Logo IDUKA]</span>
            </div>
            <div class="title  mt-3 fw-bold text-center">
              <span v-if="isLoaded">SERTIFIKAT</span>
              <span v-else class="text-muted">[Template]</span>
              <!-- <span v-if="isLoaded">{{ sertifikat.expand.iduka.nama }}</span>
              <span v-else>[Nama IDUKA]</span> -->
            </div>
            <div class="subtitle text-center">
              Praktik Kerja Lapangan
            </div>
            <div class="nomor text-center text-muted">
              <span v-if="isLoaded && sertifikat.nomor_sertifikat">Nomor: {{ sertifikat.nomor_sertifikat }}</span>
            </div>
            <div class="assignment text-center my-3">
              diberikan kepada
            </div>
            <div class="person my-3 text-center">
              <span v-if="isLoaded" class="fw-bold">{{ sertifikat.expand.siswa.nama }}</span>
              <span v-else>[Nama Peserta Didik]</span>
            </div>
            <div class="text mb-3 text-center">
              atas pencapaian melaksanakan Praktik Kerja Lapangan<br/>
              selama 4 bulan dari {{ pengaturan?.rentang_pelaksanaan }}.
            </div>
            <table class="table table-bordered bg-white">
              <thead>
                <tr>
                  <th>Elemen</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody v-if="isLoaded">
                <tr>
                  <td>Internalisasi dan penerapan soft skills</td>
                  <td class="text-center">{{ sertifikat.nilai_elemen1 }}</td>
                </tr>
                <tr>
                  <td>Penerapan hard skills</td>
                  <td class="text-center">{{ sertifikat.nilai_elemen2 }}</td>
                </tr>
                <tr>
                  <td>Peningkatan dan pengembangan hard skills</td>
                  <td class="text-center">{{ sertifikat.nilai_elemen3 }}</td>
                </tr>
                <tr>
                  <td>Penyiapan Kemandirian Berwirausaha</td>
                  <td class="text-center">{{ sertifikat.nilai_elemen4 }}</td>
                </tr>
                <tr class="fw-bold">
                  <td class="text-end">Total</td>
                  <td class="text-center">{{ sertifikat.nilai_elemen1 + sertifikat.nilai_elemen2 + sertifikat.nilai_elemen3 + sertifikat.nilai_elemen4 }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td>Internalisasi dan penerapan soft skills</td>
                  <td class="text-center">&#8212;</td>
                </tr>
                <tr>
                  <td>Penerapan hard skills</td>
                  <td class="text-center">&#8212;</td>
                </tr>
                <tr>
                  <td>Peningkatan dan pengembangan hard skills</td>
                  <td class="text-center">&#8212;</td>
                </tr>
                <tr>
                  <td>Penyiapan Kemandirian Berwirausaha</td>
                  <td class="text-center">&#8212;</td>
                </tr>
                <tr class="fw-bold">
                  <td class="text-end">Total</td>
                  <td class="text-center">&#8212;</td>
                </tr>
              </tbody>
            </table>
            <div class="row justify-content-center text-center">
              <div class="col-lg-4">
                <div class="titimangsa">Tasikmalaya, 18 April 2026</div>
                <div v-if="isLoaded" class="ttd-pj">{{ sertifikat.pj_penandatangan }}</div>
                <div v-else class="ttd-pj text-muted">[Jabatan]</div>
                <div v-if="isLoaded" class="ttd-nama-pj fw-bold">{{ sertifikat.nama_pj_penandatangan }}</div>
                <div v-else class="ttd-nama-pj fw-bold text-muted">[Jhon Doe]</div>
                <div v-if="isLoaded && sertifikat.nomor_pegawai" class="text-muted">{{ sertifikat.nomor_pegawai }}</div>
              </div>
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
  /*border: 1pt solid #b5d2ad;*/
  width: 297mm !important;
  height: 210mm !important;
  display: table-cell;
  background: transparent url('~/assets/img/bg-sertifikat.webp') no-repeat center center;
  background-size: contain
  /*vertical-align: middle;*/
}
.logo {
  font-size: large;
  position: relative;
}
.logo-img {
  position: absolute;
  top: 1em;
  left: 0;
  width: 170px;
}

.title {
  color: #034b4d;
  font-size: 40pt;
}
.subtitle {
  color: #007d82;
  font-size: 24pt;
}
.assignment {
  color: #034b4d;
  font-size: 12pt;
}
.person {
  font-size: 24pt;
  margin: 0 auto;
  width: 400px;
  color: #034b4d;
}
.text {
  font-size: 12pt;
}
.nomor, .titimangsa {
  font-size: 12pt;
}
.ttd-nama-pj {
  font-size: 12pt;
  margin-top: 90px;
}
.ttd-pj {
  font-size: 12pt;
}
thead th {
  padding: 5pt;
  color: #fff;
  text-align: center;
  background-color: #007d82 !important;
}
table, th, tr, td {
  padding: 4pt;
  border-width: 1.5px !important;
  border-color: #034b4d !important;
}
</style>
