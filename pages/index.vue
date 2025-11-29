<template>
  <div>
    <!-- ROLE: ADMIN & JURUSAN (MANAJEMEN) -->
    <div v-if="role == 'admin' || role == 'jurusan'" class="card">
      <div class="card-header">
        <span class="h4 quicksand fw-bold"><i class="bi bi-pie-chart-fill"></i> Overview</span>
      </div>
      <div class="card-body">
        <div class="alert alert-info alert-dismissible small">
          <div class="fs-5 fw-bold"><i class="bi bi-lightbulb-fill"></i> Ada yang baru!</div>
          Sekarang Anda dapat mengarsipkan IDUKA yang tidak terisi dan memfilternya. Klik icon <i class="bi bi-chat-right-text"></i> lalu klik tombol <span class="fw-bold">Arsipkan</span>. <br>
          IDUKA yang diarsipkan tidak dapat diisi/petakan. Untuk membukanya, klik lagi icon <i class="bi bi-chat-right-text"></i> lalu klik tombol <span class="fw-bold">Buka arsip</span>.
          <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <ringkasan-notif-jurnal />
        <ringkasan-personal />
        <!-- <ringkasan-fyi v-if="role == 'admin' || role == 'jurusan'" /> -->
        <ringkasan-card />
        <div class="row mt-4 justify-content-center">
          <ringkasan-chart />
          <ringkasan-detail-statistik />
        </div>
        <div class="row">
          <RingkasanDaftarPesertaBelumTerpetakan />
        </div>
      </div>
    </div>

    <!-- ROLE: GURU PEMBIMBING -->
    <div v-else-if="role == 'guru'" class="card">
      <div class="card-header">
        <span class="h4 quicksand fw-bold"><i class="bi bi-pie-chart-fill"></i> Overview</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-12">
            <ringkasan-notif-jurnal />
            <ringkasan-personal />
          </div>
        </div>
      </div>
    </div>

    <!-- ROLE: TU & WAKASEK -->
    <div v-else class="card">
      <div class="card-header">
        <span class="h4 quicksand fw-bold"><i class="bi bi-pie-chart-fill"></i> Overview</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <nuxt-link to="/pemetaan/pkl" class="link border-0">
              <div class="card mb-3">
                <div class="card-body bg-info">
                  <h2 v-if="!isLoading" class="fs-bold">{{ jumlah_pemetaan.length }}</h2>
                  <h4 v-else>
                    <p class="placeholder-glow">
                      <span class="placeholder col-6"></span>
                    </p>
                  </h4>
                  <span class="medium">Semua Pemetaan</span>
                </div>
              </div>
            </nuxt-link>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body bg-success">
                <h2 v-if="!isLoadingPeserta" class="fs-bold">{{ jumlah_peserta }}</h2>
                <h4 v-else>
                  <p class="placeholder-glow">
                    <span class="placeholder col-6"></span>
                  </p>
                </h4>
                <span class="medium">Semua Peserta</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-12">
            <h4 class="fw-bold">Statistik Peserta</h4>
          </div>
        </div>
        <ringkasan-stat-per-jurusan />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})
useHead({
  title: "e-PKL / SMKN 4 Tasikmalaya.",
  meta: [
    { name: "description", content: "SaaS/App Pemetaan dan Jurnal Peserta PKL (Praktik Kerja Lapangan) tingkat SMK."}
  ]
})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user?.user.value.role
let isLoading = ref(true)
let isLoadingPeserta = ref(true)
let jumlah_pemetaan = ref([])
let jumlah_peserta = ref(0)

async function getInfo() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_pemetaan = await client.collection('pemetaan').getFullList()
  if(res_pemetaan) {
    isLoading.value = false
    jumlah_pemetaan.value = res_pemetaan
  }
}

async function getPeserta() {
  isLoadingPeserta.value = true
  client.autoCancellation(false)
  let res_siswa = await client.collection('siswa').getList(1,1)
  if(res_siswa) {
    jumlah_peserta.value = res_siswa.totalItems
    isLoadingPeserta.value = false
  }
}

onMounted(() => {
  getInfo()
  getPeserta()
})
</script>
