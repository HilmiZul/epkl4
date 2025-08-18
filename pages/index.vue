<template>
  <div>
    <div v-if="role != 'tu'" class="card">
      <div class="card-header">
        <span class="h4 quicksand"><i class="bi bi-pie-chart-fill"></i> Ringkasan</span>
      </div>
      <div class="card-body">
        <ringaksan-notif-jurnal />
        <div class="alert alert-warning shadow-lg">
          <span class="h4 fw-bold"><i class="bi bi-lightbulb"></i> FYI</span>
          <table class="table border-0">
            <tbody>
              <tr>
                <td width="15%" class="fw-bold">Terserap</td>
                <td>: Peserta yang sudah diterima IDUKA</td>
              </tr>
              <tr>
                <td class="fw-bold">Terpetakan</td>
                <td>: Peserta yang baru dipetakan/tempatkan</td>
              </tr>
              <tr>
                <td class="fw-bold">Belum diterima</td>
                <td>: Peserta yang sudah dipetakan menunggu respon/balasan IDUKA</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ringkasan-card v-if="role == 'admin' || role == 'jurusan'" />
        <div class="row mt-4 justify-content-center">
          <ringkasan-chart v-if="role == 'admin' || role == 'jurusan' || role == 'guru'" />
          <ringkasan-detail-statistik v-if="role == 'admin' || role == 'jurusan'" />
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="card-header">
        <span class="h4 quicksand text-grey"><i class="bi bi-pie-chart-fill"></i> Ringkasan</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body bg-info">
                <span class="medium">Semua Pemetaan</span>
                <h4 v-if="!isLoading">{{ jumlah_pemetaan.length }}</h4>
                <h4 v-else>
                  <p class="placeholder-glow">
                    <span class="placeholder col-6"></span>
                  </p>
                </h4>
                <div class="mt-3 small"><nuxt-link to="/pemetaan/pkl" class="link border-0">intip <i class="bi bi-arrow-up-right-square"></i></nuxt-link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})
useHead({ title: "e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user?.user.value.role
let isLoading = ref(true)
let jumlah_pemetaan = ref(0)

async function getCountPemetaan() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_pemetaan = await client.collection('pemetaan').getFullList()
  if(res_pemetaan) {
    isLoading.value = false
    jumlah_pemetaan.value = res_pemetaan
  }
}

onMounted(() => {
  getCountPemetaan()
})
</script>
