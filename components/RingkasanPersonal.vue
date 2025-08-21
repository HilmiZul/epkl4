<template>
  <div class="row">
    <div class="col-md-12">
      <Loading v-if="isLoading" />
      <div v-else>
        <div class="fs-5">
          Hola,
          <span v-if="user">
            <strong>{{ nama }}</strong>!
          </span>
          <span v-else>&#8212;</span>
        </div>
        <div class="row mt-3">
          <div class="col-md-3">
            <div class="mb-3">
              <div class="text-muted">Program Keahlian</div>
              <span v-if="prokel" class="fw-bold">{{ prokel.nama }}</span>
              <span v-else>&#8212;</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="mb-3">
              <div class="text-muted">Role</div>
              <span v-if="user" class="fw-bold">
                <span v-if="role == 'guru'">{{ role.charAt(0).toUpperCase() + role.slice(1) }} Pembimbing</span>
                <span v-else>Manajemen</span>
              </span>
              <span v-else>Belum punya role</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="mb-3">
              <div class="text-muted">Relasi IDUKA</div>
              <span v-if="iduka.length > 0" class="fw-bold">{{ iduka.length }}</span>
              <span v-else>Belum ada</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="mb-3">
              <div class="text-muted">Relasi Peserta</div>
              <span v-if="pemetaan.length > 0" class="fw-bold">{{ pemetaan.length }}</span>
              <span v-else>Belum ada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="role == 'guru'" class="row my-3">
    <div class="col-lg-6">
      <div class="text-muted mb-1 fw-medium">Peserta didik yang dibimbing:</div>
      <table class="table table-striped border-0">
        <tbody>
          <tr v-if="pemetaan.length < 1">
            <td class="text-muted fst-italic">Belum ada</td>
          </tr>
          <tr v-for="(p,i) in pemetaan" :key="p.id" class="fw-bold">
            <td width="3%">{{ i+1 }}.</td>
            <td>{{ p.expand.siswa.nama }}</td>
            <td>{{ p.expand.siswa.kelas }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-lg-6">
      <div class="text-muted mb-1 fw-medium">Relasi ke IDUKA:</div>
      <table class="table table-striped border-0">
        <tbody>
          <tr v-if="iduka.length < 1">
            <td class="text-muted fst-italic">Belum ada</td>
          </tr>
          <tr v-for="(company,i) in iduka" :key="company.id" class="fw-bold">
            <td width="3%">{{ i+1 }}.</td>
            <td>{{ company.nama }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user?.user.value.role
let nama = user?.user.value.nama
let isLoading = ref(true)
let prokel = ref()
let iduka = ref([])
let pemetaan = ref([])

async function getInfo() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_pemetaan = await client.collection('pemetaan').getFullList()
  let res_prokel = await client.collection('program_keahlian').getOne(user?.user.value.program_keahlian)
  let res_iduka = await client.collection('iduka').getFullList({
    filter: "pembimbing_sekolah='"+user?.user.value.id+"'"
  })
  let res_pemetaan_by_pembimbing = await client.collection('pemetaan').getFullList({
    expand: "iduka, siswa",
    filter: "iduka.pembimbing_sekolah='"+user?.user.value.id+"'"
  })
  if(res_pemetaan && res_prokel && res_iduka && res_pemetaan_by_pembimbing) {
    isLoading.value = false
    prokel.value = res_prokel
    iduka.value = res_iduka
    pemetaan.value = res_pemetaan_by_pembimbing
  }
}

onMounted(() => {
  getInfo()
})
</script>
