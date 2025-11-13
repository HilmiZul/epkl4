<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-book"></i> Rapor</span>
      <button v-if="isLoaded" @click="unduhPdf" class="btn btn-info btn-sm border border-2 border-dark float-end">
        <i class="bi bi-download"></i> Unduh
      </button>
    </div>
    <div v-if="$device.isMobile || $device.isTablet" class="card-body">
      <div class="alert alert-warning">Silahkan gunakan komputer/laptop!</div>
    </div>
    <div v-else class="card-body">
      <div v-if="isLoaded || semua_nilai.length > 0" class="alert alert-info">
        <ul class="mb-0">
          <li>Pilih nama peserta untuk melihat pratinjau Rapor.</li>
          <li>Apabila sudah benar, klik tombol <span class="fw-bold">Unduh</span> diatas.</li>
        </ul>
      </div>
      <loading-placeholder v-if="isLoading" row="1" col="4" />
      <div v-else class="row">
        <div v-if="semua_nilai.length > 0" class="col-lg-4">
          <label for="peserta">Pilih Nama Peserta</label>
          <multiselect
            @update:modelValue="getNilaiByPeserta"
            v-model="selectedPeserta"
            :options="semua_nilai"
            :clear-on-select="true"
            :custom-label="({expand}) => `${expand.siswa.nama}`"
            track-by="expand"
            label="expand"
            id="peserta"
            placeholder="Pilih untuk menampilkan ke rapor"
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

      <loading-placeholder v-if="isLoading" row="1" col="12" />
      <div v-else-if="!isLoading && semua_nilai.length > 0" class="row mt-5 mb-2">
        <div class="col-md-12">
          <div ref="toPdf" class="efek-kertas">
            <rapor-template :isLoaded="isLoaded" :rapor="nilai" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import html2pdf from 'html2pdf.js'

definePageMeta({ middleware: 'auth' })
useHead({ title: "Rapor — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user?.user.value.program_keahlian
let isLoaded = ref(false)
let isLoading = ref(true)
let semua_nilai = ref('')
let nilai = ref('')
let selectedPeserta = ref('')
let toPdf = ref(null) // var untuk nyimpen component yang downloadable PDF

async function getNilai() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user?.user.value.id}" && program_keahlian="${prokel}" && isValid=true`,
    expand: `iduka, iduka.pembimbing_sekolah, siswa, siswa.walikelas, program_keahlian`,
    sort: `-siswa.nama`
  })
  if(res) {
    semua_nilai.value = res
    isLoading.value = false
  }
}

function getNilaiByPeserta(value) {
  nilai.value = value
  isLoaded.value = true
}

function unduhPdf() {
  if(toPdf.value) {
    html2pdf().set({
      filename: `Rapor PKL - ${nilai.value.expand.siswa.nama} - XII.${nilai.value.expand.siswa.kelas}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'legal', orientation: 'portrait' },
    }).from(toPdf.value).save()
  }
}

onMounted(() => {
  getNilai()
})
</script>

<style scoped>
.efek-kertas {
  box-shadow: 0 0 12px #000;
  padding-top: 2mm;
}
</style>
