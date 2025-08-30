<template>
  <div class="row my-3">
    <div class="col-md-12">
      <h4 class="mb-3 fw-bold">Statistik</h4>
    </div>
    <div class="col-md-3">
      <nuxt-link to="/peserta" class="link border-0">
        <div class="card mb-3">
          <div class="card-body bg-danger">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ count_peserta.length }}</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span class="fs-5">Peserta</span>
          </div>
        </div>
      </nuxt-link>
    </div>
    <div class="col-md-3">
      <nuxt-link to="/pembimbing" class="link border-0">
        <div class="card mb-3">
          <div class="card-body bg-purple">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ count_pembimbing.length }}</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span class="fs-5">Pembimbing</span>
          </div>
        </div>
      </nuxt-link>
    </div>
    <div class="col-md-3 mb-3">
      <nuxt-link to="/iduka" class="link border-0">
        <div class="card">
          <div class="card-body bg-success">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ count_iduka.length }}</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span class="fs-5">IDUKA</span>
          </div>
        </div>
      </nuxt-link>
    </div>
    <div class="col-md-3">
      <nuxt-link to="/pemetaan/pkl" class="link border-0">
        <div class="card">
          <div class="card-body bg-info">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ prosentase_pemetaan.toFixed(0) }}%</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span class="fs-5">Terserap</span>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let count_peserta = ref(0)
let count_pembimbing = ref(0)
let count_iduka = ref(0)
let prosentase_pemetaan = ref(0)

async function count() {
  isLoading.value = true
  client.autoCancellation(false)
  if(role == 'tu' || role == 'wakasek') {
    let res_peserta = await client.collection('siswa').getFullList({
    })
    let res_pembimbing = await client.collection('teacher_users').getFullList({
      filter: "role!='admin'"
    })
    let res_iduka = await client.collection('iduka').getFullList({
    })
    let res_pemetaan = await client.collection('pemetaan').getFullList({
      filter: "status_acc_pkl=true",
    })
    if(res_peserta && res_pembimbing && res_iduka && res_pemetaan) {
      isLoading.value = false
      count_peserta.value = res_peserta
      count_pembimbing.value = res_pembimbing
      count_iduka.value = res_iduka
      prosentase_pemetaan.value = (res_pemetaan.length / count_peserta.value.length) * 100
    }
  } else {
    let res_peserta = await client.collection('siswa').getFullList({
      filter: "program_keahlian='"+prokel+"'"
    })
    let res_pembimbing = await client.collection('teacher_users').getFullList({
      filter: "program_keahlian='"+prokel+"' && role!='admin'"
    })
    let res_iduka = await client.collection('iduka').getFullList({
      filter: "program_keahlian='"+prokel+"'"
    })
    let res_pemetaan = await client.collection('pemetaan').getFullList({
      filter: "program_keahlian='"+prokel+"' && status_acc_pkl=true",
    })
    if(res_peserta && res_pembimbing && res_iduka && res_pemetaan) {
      isLoading.value = false
      count_peserta.value = res_peserta
      count_pembimbing.value = res_pembimbing
      count_iduka.value = res_iduka
      prosentase_pemetaan.value = (res_pemetaan.length / count_peserta.value.length) * 100
    }
  }
}

onMounted(() => {
  count()
})
</script>

<style scoped>
.fw-bold {
  letter-spacing: .03em;
}
</style>
