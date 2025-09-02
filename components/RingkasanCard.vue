<template>
  <div class="row my-3">
    <div class="col-md-12">
      <h4 class="mb-3 fw-bold">Statistik</h4>
    </div>
    <div class="col-md-3">
      <nuxt-link to="/peserta" class="link border-0">
        <div class="card mb-3">
          <div class="card-body bg-danger">
            <h2 v-if="!isLoadingPeserta" class="fs-2 fw-bold">{{ count_peserta.length }}</h2>
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
            <h2 v-if="!isLoadingPembimbing" class="fs-2 fw-bold">{{ count_pembimbing.length }}</h2>
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
            <h2 v-if="!isLoadingIduka" class="fs-2 fw-bold">{{ count_iduka.length }}</h2>
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
            <h2 v-if="!isLoadingTerserap" class="fs-2 fw-bold">{{ prosentase_pemetaan.toFixed(0) }}%</h2>
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
let isLoadingPeserta = ref(true)
let isLoadingPembimbing = ref(true)
let isLoadingIduka = ref(true)
let isLoadingTerserap = ref(true)
let count_peserta = ref(0)
let count_pembimbing = ref(0)
let count_iduka = ref(0)
let prosentase_pemetaan = ref(0)

async function countPeserta() {
  isLoadingPeserta.value = true
  isLoadingTerserap.value = true
  client.autoCancellation(false)
  let res_peserta = await client.collection('siswa').getFullList({
    filter: "program_keahlian='"+prokel+"'"
  })
  let res_pemetaan = await client.collection('pemetaan').getFullList({
    filter: "program_keahlian='"+prokel+"' && status_acc_pkl=true",
  })
  if(res_peserta) {
    isLoadingPeserta.value = false
    count_peserta.value = res_peserta
  }
  if(res_pemetaan) {
    isLoadingTerserap.value = false
    prosentase_pemetaan.value = (res_pemetaan.length / count_peserta.value.length) * 100
  }
}

async function countPembimbing() {
  isLoadingPembimbing.value = true
  let res_pembimbing = await client.collection('teacher_users').getFullList({
    filter: "program_keahlian='"+prokel+"' && role!='admin'"
  })
  if(res_pembimbing) {
    isLoadingPembimbing.value = false
    count_pembimbing.value = res_pembimbing
  }
}

async function countIduka() {
  isLoadingIduka.value = true
  let res_iduka = await client.collection('iduka').getFullList({
    filter: "program_keahlian='"+prokel+"'"
  })
  if(res_iduka) {
    isLoadingIduka.value = false
    count_iduka.value = res_iduka
  }
}

onMounted(() => {
  countPeserta()
  countPembimbing()
  countIduka()
})
</script>

<style scoped>
.fw-bold {
  letter-spacing: .03em;
}
</style>
