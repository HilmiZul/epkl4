<template>
  <div class="container">
    <div class="title fw-bold text-center mt-3">
      <span v-if="props.isLoaded && pengaturan">{{ pengaturan?.nama_sekolah }}</span>
      <span v-else>[Nama Sekolah]</span>
    </div>
    <div class="subtitle text-center fw-bold">
      Tahun Pelajaran 2025/2026
    </div>
    <div class="row my-2">
      <div class="col-md-8">
        <table class="table_id small">
          <tbody>
            <tr>
              <td width="40%">Nama Peserta Didik</td>
              <td>:</td>
              <td v-if="props.isLoaded" class="fw-bold">{{ props.rapor?.expand.siswa.nama }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>NISN</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.rapor?.expand.siswa.nisn }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Kelas</td>
              <td>:</td>
              <td v-if="props.isLoaded">XII {{ props.rapor?.expand.siswa.kelas.replace("-", " ") }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Program Keahlian</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.rapor?.expand.program_keahlian.alias }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Konsentrasi Keahlian</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.rapor?.expand.program_keahlian.konsentrasi_keahlian }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Tempat PKL</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.rapor?.expand.iduka.nama }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Tanggal PKL</td>
              <td>:</td>
              <td v-if="!isLoading">{{ pengaturan.rentang_pelaksanaan }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Nama Instruktur</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.rapor?.expand.iduka.pembimbing_iduka }}</td>
              <td v-else>&#8212;</td>
            </tr>
            <tr>
              <td>Nama Pembimbing</td>
              <td>:</td>
              <td v-if="props.isLoaded">{{ props.rapor?.expand.iduka.expand.pembimbing_sekolah.nama }}</td>
              <td v-else>&#8212;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <table class="table table-bordered bg-white smallest">
      <thead class="small">
        <tr>
          <th width="3%">No.</th>
          <th width="35%">Tujuan Pembelajaran</th>
          <th>Skor</th>
          <th>Deskripsi</th>
        </tr>
      </thead>
      <tbody class="smalle">
        <tr>
          <td class="text-center">1.</td>
          <td>Menerapkan soft skills yang dibutuhkan dalam dunia kerja</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.rapor?.nilai_elemen1 }}</td>
          <td v-else class="text-center">&#8212;</td>
          <td v-if="props.isLoaded" class="text-justify">{{ props.rapor?.deskripsi_elemen1 }}</td>
          <td v-else class="text-center">&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">2.</td>
          <td>Menerapkan norma, POS, dan K3LH yang ada pada dunia kerja</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.rapor?.nilai_elemen2 }}</td>
          <td v-else class="text-center">&#8212;</td>
          <td v-if="props.isLoaded" class="text-justify">{{ props.rapor?.deskripsi_elemen2 }}</td>
          <td v-else class="text-center">&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">3.</td>
          <td>Menerapkan kompetensi teknis yang sudah dipelajari di sekolah dan/atau baru dipelajari pada dunia kerja</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.rapor?.nilai_elemen3 }}</td>
          <td v-else class="text-center">&#8212;</td>
          <td v-if="props.isLoaded" class="text-justify">{{ props.rapor?.deskripsi_elemen3 }}</td>
          <td v-else class="text-center">&#8212;</td>
        </tr>
        <tr>
          <td class="text-center">4.</td>
          <td>Memahami alur bisnis dunia kerja tempat PKL</td>
          <td v-if="props.isLoaded" class="text-center">{{ props.rapor?.nilai_elemen4 }}</td>
          <td v-else class="text-center">&#8212;</td>
          <td v-if="props.isLoaded" class="text-justify">{{ props.rapor?.deskripsi_elemen4 }}</td>
          <td v-else class="text-center">&#8212;</td>
        </tr>
      </tbody>
    </table>

    <div class="row">
      <div class="col-md-5">
        <div class="smallest">Kehadiran</div>
        <table class="table bg-white table-kehadiran smallest border border-1 border-dark">
          <tbody>
            <tr>
              <td>Sakit</td>
              <td class="text-center">:</td>
              <td v-if="props.isLoaded" class="text-center">{{ props.rapor?.sakit }}</td>
              <td v-else class="text-center">&#8212;</td>
            </tr>
            <tr>
              <td>Izin</td>
              <td class="text-center">:</td>
              <td v-if="props.isLoaded" class="text-center">{{ props.rapor?.izin }}</td>
              <td v-else class="text-center">&#8212;</td>
            </tr>
            <tr>
              <td width="65%">Tanpa Keterangan</td>
              <td class="text-center">:</td>
              <td v-if="props.isLoaded" class="text-center" width="20%">{{ props.rapor?.tanpa_keterangan }}</td>
              <td v-else class="text-center">&#8212;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row justify-content-end mb-2 me-1 smallest">
      <div class="col-md-4 border border-1 border-dark">
        Dengan memperhatikan kriteria kelulusan peserta didik dari satuan pendidikan maka ditetapkan:
        <span v-if="props.isLoaded" class="fw-bold">LULUS/<s>TIDAK LULUS</s></span>
        <span v-else>&#8212;</span>
      </div>
    </div>

    <div class="row justify-content-center smallest">
      <div class="col-lg-4">
        <br>
        <div>Orang Tua/Wali</div>
        <br><br><br><br>
        <div>…......................................</div>
      </div>
      <div class="col-lg-4">
        <br>
        <div>Wali Kelas</div>
        <br><br><br><br>
        <div v-if="props.isLoaded" class="fw-bold">
          <span v-if="props.rapor?.expand.siswa.walikelas">{{ props.rapor?.expand.siswa.expand.walikelas.nama }}</span>
          <span v-else>-</span>
        </div>
        <div v-else class="fw-bold">[Nama Wali Kelas]</div>
        <div v-if="props.isLoaded">NIP.
          <span v-if="props.rapor?.expand.siswa.walikelas">{{ props.rapor?.expand.siswa.expand.walikelas.nip }}</span>
          <span v-else>-</span>
        </div>
        <div v-else>NIP. [Nomor Pegawai]</div>
      </div>
      <div class="col-lg-4">
        <div>Tasikmalaya, 24 April 2026</div>
        <div>Guru Pembimbing PKL</div>
        <br><br><br><br>
        <div v-if="props.isLoaded" class="fw-bold">
          <span v-if="props.rapor?.iduka">{{ props.rapor?.expand.iduka.expand.pembimbing_sekolah.nama }}</span>
          <span v-else>-</span>
        </div>
        <div v-else class="fw-bold">[Nama Pembimbing]</div>
        <div v-if="props.isLoaded">NIP.
          <span v-if="props.rapor?.iduka">{{ props.rapor?.expand.iduka.expand.pembimbing_sekolah.nip }}</span>
          <span v-else>-</span>
        </div>
        <div v-else>NIP. [Nomor Pegawai]</div>
      </div>
    </div>

    <div class="row justify-content-center text-center mt-5 smallest">
      <div class="col-lg-4">
        <div>Mengetahui,</div>
        <div v-if="isLoaded">Kepala {{ pengaturan?.nama_sekolah }}</div>
        <div v-else>[Kepala Sekolah]</div>
        <br><br><br><br>
        <div v-if="isLoaded">{{ pengaturan?.nama_kepala_sekolah }}</div>
        <div v-else>[Nama Kepala Sekolah]</div>
        <div v-if="isLoaded">NIP. {{ pengaturan?.nip }}</div>
        <div v-else>[NIP]</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let props = defineProps(['rapor', 'isLoaded'])
let role = user?.user.value.role
let prokel = user?.user.value.program_keahlian
let pengaturan = ref()
let isLoading = ref(true)
let elemen = ref('')

async function getSetting() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('pengaturan').getOne("pt7b25ofddwhngp")
  if(res) {
    pengaturan.value = res
    isLoading.value = false
  }
}

async function getElemenCP() {
  isLoading.value = true
  let res = await client.collection('elemen_cp').getFullList({
    filter: `program_keahlian="${prokel}" && elemen!="Lain-lain"`,
  })
  if(res) {
    elemen.value = res
    isLoading.value = false
  }
}

onMounted(() => {
  getSetting()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap');
body, html {
  margin: 0;
  padding: 0;
}
body {
  color: black;
  display: table;
  text-align: center;
}
.container {
  /*border: 1pt solid #000;*/
  width: 210mm !important;
  height: 330mm !important;
  font-family: "Times New Roman", sans-serif !important;
  /*display: table-cell;*/
  /*vertical-align: middle;*/
}
.logo-img {
  /*position: absolute;
  top: 1em;
  left: 0;*/
  width: auto;
  height: 100%;
}

.title {
  color: #000;
  font-size: 20pt;
}
.subtitle {
  color: #000;
  font-size: smaller;
}
.text {
  font-size: smaller;
}
.nomor, .titimangsa {
  font-size: smaller;
}
.ttd-nama-pj {
  font-size: smaller;
  margin-top: 90px;
}
.ttd-pj {
  font-size: smaller;
}
thead th {
  padding: 5pt;
  color: #000;
  text-align: center;
  background-color: #fff !important;
}
table, th, tr, td {
  padding: 1pt;
  border-width: .9pt !important;
  border-color: #000 !important;
}
.table_id tbody,
.table_id tbody tr,
.table_id tbody td {
  border: none !important;
  background-color: #fff;
  padding: 1pt
}
table tbody {
  padding: 0;
}
.table-kehadiran tbody,
.table-kehadiran tbody tr,
.table-kehadiran td {
  border: none !important
}
.text-justify {
  text-align: justify;
}
</style>
