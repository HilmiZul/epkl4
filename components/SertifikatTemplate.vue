<template>
  <div class="container">
    <div class="logo fw-bold text-muted text-center mt-4 align-content-center">
      <span v-if="props.isLoaded">
        <img v-if="props.sertifikat?.logo"
          :src="`${host}/api/files/${props.sertifikat?.collectionId}/${props.sertifikat?.id}/${props.sertifikat?.logo}`"
          :alt="props.sertifikat?.expand.iduka.nama" class="logo-img" />
      </span>
      <span v-else class="logo-img mt-5">[Logo IDUKA]</span>
    </div>
    <div class="title mt-3 fw-bold text-center">
      SERTIFIKAT
      <!-- <span v-if="isLoaded">{{ sertifikat.expand.iduka.nama }}</span>
              <span v-else>[Nama IDUKA]</span> -->
    </div>
    <div class="subtitle text-center">
      Praktik Kerja Lapangan
    </div>
    <div class="nomor text-center text-muted">
      <span v-if="props.isLoaded && props.sertifikat?.nomor_sertifikat">Nomor: {{ props.sertifikat?.nomor_sertifikat }}</span>
    </div>
    <div class="assignment my-3 text-center">
      diberikan kepada
    </div>
    <div class="person mb-3 text-center">
      <span v-if="props.isLoaded" class="fw-bold person-border">{{ props.sertifikat?.expand.siswa.nama }}</span>
      <span v-else>[Nama Peserta Didik]</span>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <table class="table_id">
          <tbody>
            <tr>
              <td width="35%">Nomor Induk Siswa</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.sertifikat?.expand.siswa.nis }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Program Keahlian</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.sertifikat?.expand.program_keahlian.alias }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Konsentrasi Keahlian</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.sertifikat?.expand.program_keahlian.konsentrasi_keahlian }}</td>
              <td v-else>&#8212;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="text my-3 text-center">
      Telah mengikuti Praktik Kerja Lapangan di <span v-if="props.isLoaded" class="fw-bold">{{ props.sertifikat?.expand.iduka.nama }}</span> <span v-else>[IDUKA]</span>. <br>
      Dari {{ pengaturan?.rentang_pelaksanaan }} dengan hasil <br>
      <div v-if="props.isLoaded" class="nilai-indeks fs-3 py-2">{{ props.nilai_indeks }}</div>
      <div v-else class="nilai-indeks fs-3 py-2">[nilai indeks]</div>
    </div>
    <table class="table table-bordered bg-white">
      <thead>
        <tr>
          <th width="3%">No.</th>
          <th>Komponen yang dinilai</th>
          <th>Nilai</th>
        </tr>
      </thead>
      <tbody v-if="props.isLoaded">
        <tr>
          <td class="text-center">1.</td>
          <td>Internalisasi dan penerapan soft skills</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.sertifikat?.nilai_elemen1 }}</td>
          <td v-else>&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">2.</td>
          <td>Penerapan hard skills</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.sertifikat?.nilai_elemen2 }}</td>
          <td v-else>&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">3.</td>
          <td>Peningkatan dan pengembangan hard skills</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.sertifikat?.nilai_elemen3 }}</td>
          <td v-else>&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">4.</td>
          <td>Penyiapan Kemandirian Berwirausaha</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.sertifikat?.nilai_elemen4 }}</td>
          <td v-else>&#8212;</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="text-center">1.</td>
          <td>Internalisasi dan penerapan soft skills</td>
          <td class="text-center">&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">2.</td>
          <td>Penerapan hard skills</td>
          <td class="text-center">&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">3.</td>
          <td>Peningkatan dan pengembangan hard skills</td>
          <td class="text-center">&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">4.</td>
          <td>Penyiapan Kemandirian Berwirausaha</td>
          <td class="text-center">&#8212;</td>
        </tr>
      </tbody>
    </table>
    <div class="row justify-content-center text-center">
      <div class="col-lg-4">
        <div class="titimangsa">Tasikmalaya, 24 April 2026</div>
        <div v-if="props.isLoaded" class="ttd-pj">{{ props.sertifikat?.pj_penandatangan }}</div>
        <div v-else class="ttd-pj text-muted">[Jabatan]</div>
        <div v-if="props.isLoaded" class="ttd-nama-pj fw-bold">{{ props.sertifikat?.nama_pj_penandatangan }}</div>
        <div v-else class="ttd-nama-pj fw-bold text-muted">[Jhon Doe]</div>
        <div v-if="props.isLoaded && props.sertifikat?.nomor_pegawai" class="text-muted">{{ props.sertifikat?.nomor_pegawai }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let props = defineProps(['sertifikat', 'isLoaded', 'nilai_indeks'])
let role = user?.user.value.role
let prokel = user?.user.value.program_keahlian
let isLoaded = ref(false)
let pengaturan = ref()

async function getSetting() {
  client.autoCancellation(false)
  let res = await client.collection('pengaturan').getOne("pt7b25ofddwhngp")
  if(res) {
    pengaturan.value = res
  }
}

onMounted(() => {
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
  border: 3pt solid #007d82;
  width: 210mm !important;
  height: 296mm !important;
  /*display: table-cell;*/
  background: transparent url('~/assets/img/bg-sertifikat.webp') no-repeat center center;
  background-size: contain
  /*vertical-align: middle;*/
}
.logo {
  font-size: large;
  height: 100px;
  /*position: relative;*/
}
.logo-img {
  /*position: absolute;
  top: 1em;
  left: 0;*/
  width: auto;
  height: 100%;
}

.title {
  color: #034b4d;
  font-size: 35pt;
}
.subtitle {
  color: #007d82;
  font-size: 20pt;
}
.assignment {
  color: #034b4d;
  font-size: 12pt;
}
.person {
  font-size: 20pt;
  margin: 0 auto;
  color: #034b4d;
}
.person-border {
  border-bottom-width: 5px;
  border-bottom-style: double;
  border-bottom-color: #fed652;
}
.text {
  font-size: 12pt;
}
.nilai-indeks {
  color: #034b4d;
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
  border-width: 1pt !important;
  border-color: #034b4d !important;
}
.table_id tbody,
.table_id tbody tr,
.table_id tbody td {
  border: none !important;
  background-color: #fff;
  padding: 2pt
}
</style>
