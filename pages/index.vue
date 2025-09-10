<template>
  <div>
    <!-- ROLE: ADMIN & JURUSAN (MANAJEMEN) -->
    <div v-if="role == 'admin' || role == 'jurusan'" class="card">
      <div class="card-header">
        <span class="h4 quicksand"><i class="bi bi-pie-chart-fill"></i> Ringkasan</span>
      </div>
      <div class="card-body">
        <ringkasan-notif-jurnal />
        <ringkasan-personal />
        <!-- <ringkasan-fyi v-if="role == 'admin' || role == 'jurusan'" /> -->
        <ringkasan-card />
        <div class="row mt-4 justify-content-center">
          <ringkasan-chart />
          <ringkasan-detail-statistik />
        </div>
      </div>
    </div>

    <!-- ROLE: GURU PEMBIMBING -->
    <div v-else-if="role == 'guru'" class="card">
      <div class="card-header">
        <span class="h4 quicksand"><i class="bi bi-pie-chart-fill"></i> Ringkasan</span>
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

    <!-- ROLE: TU -->
    <div v-else class="card">
      <div class="card-header">
        <span class="h4 quicksand text-grey"><i class="bi bi-pie-chart-fill"></i> Ringkasan</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <nuxt-link to="/pemetaan/pkl" class="link border-0">
              <div class="card">
                <div class="card-body bg-info">
                  <h2 v-if="!isLoading" class="fs-bold">{{ jumlah_pemetaan.length }}</h2>
                  <h4 v-else>
                    <p class="placeholder-glow">
                      <span class="placeholder col-6"></span>
                    </p>
                  </h4>
                  <span class="medium">Pemetaan</span>
                </div>
              </div>
            </nuxt-link>
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
let jumlah_pemetaan = ref([])

async function getInfo() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_pemetaan = await client.collection('pemetaan').getFullList()
  if(res_pemetaan) {
    isLoading.value = false
    jumlah_pemetaan.value = res_pemetaan
  }
}

onMounted(() => {
  getInfo()
})
</script>
