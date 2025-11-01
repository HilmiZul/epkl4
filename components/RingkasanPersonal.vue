<template>
  <div class="row">
    <div class="col-md-12">
      <div>
        <div class="fs-5">
          <h4 class="fw-bold">Personal Info</h4>
          <!-- Hola,
          <span v-if="user">
            <strong>{{ nama }}</strong>!
          </span>
          <span v-else>&#8212;</span> -->
        </div>
        <div class="row mt-3 fw-bold">
          <div class="col-md-3">
            <div class="mb-3">
              <div class="text-muted">Program Keahlian</div>
              <LoadingPlaceholder v-if="isLoading" row="1" col="6" />
              <span v-else>
                <span v-if="prokel" class="fw-bold">{{ prokel.nama }}</span>
                <span v-else>&#8212;</span>
              </span>
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
              <LoadingPlaceholder v-if="isLoading" row="1" col="6" />
              <span v-else>
                <span v-if="iduka?.totalItems > 0" class="fw-bold">{{ iduka.totalItems }}</span>
                <span v-else>Belum ada</span>
              </span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="mb-3">
              <div class="text-muted">Relasi Peserta</div>
              <LoadingPlaceholder v-if="isLoading" row="1" col="6" />
              <span v-else>
                <span v-if="pemetaan?.totalItems > 0" class="fw-bold">{{ pemetaan?.totalItems }}</span>
                <span v-else>Belum ada</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="role == 'guru'" class="row mt-3">
    <div class="col-lg-6">
      <div class="text-muted mb-1 fw-medium fw-bold">Peserta didik yang dibimbing:</div>
      <table class="table table-striped border border-2 border-dark shadow-lg">
        <tbody>
          <tr v-if="pemetaan?.totalItems < 1">
            <td class="text-muted fst-italic">Belum ada</td>
          </tr>
          <tr v-else v-for="(p,i) in pemetaan.items" :key="p.id" class="fw-bold">
            <td width="3%"><span class="badge bg-success">{{ i+1 }}</span></td>
            <td>
              {{ p.expand.siswa.nama }} <br>
              <span class="smallest text-muted">{{ p.expand.siswa.kelas }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="pemetaan?.totalItems > 5" class="mb-3">
        <nuxt-link to="/pemetaan/pkl" class="link">Lihat semua <i class="bi bi-chevron-right"></i></nuxt-link>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="text-muted mb-1 fw-medium fw-bold">Relasi ke IDUKA:</div>
      <table class="table table-striped border border-2 border-dark shadow-lg">
        <tbody>
          <tr v-if="iduka?.totalItems < 1">
            <td class="text-muted fst-italic">Belum ada</td>
          </tr>
          <tr v-else v-for="(company,i) in iduka.items" :key="company.id" class="fw-bold">
            <td width="3%"><span class="badge bg-success">{{ i+1 }}</span></td>
            <td>
              {{ company.nama }} <br>
              <nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${company.nama} ${company.alamat}`" target="_blank" class="link smallest text-muted">lihat peta <i class="bi bi-arrow-up-right"></i></nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="iduka?.totalItems > 5" class="mb-3">
        <nuxt-link to="/pemetaan/pkl" class="link">Lihat semua <i class="bi bi-chevron-right"></i></nuxt-link>
      </div>
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

async function getPemetaanInfo() {
  isLoading.value = true
  client.autoCancellation(false)
  // let res_pemetaan = await client.collection('pemetaan').getFullList()
  let res_pemetaan_by_pembimbing = await client.collection('pemetaan').getList(1, 5, {
    expand: "iduka, siswa",
    filter: "iduka.pembimbing_sekolah='"+user?.user.value.id+"'"
  })
  if(res_pemetaan_by_pembimbing) {
    pemetaan.value = res_pemetaan_by_pembimbing
    isLoading.value = false
  }
}

async function getIdukaInfo() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_iduka = await client.collection('iduka').getList(1, 5, {
    filter: "pembimbing_sekolah='"+user?.user.value.id+"'"
  })
  if(res_iduka) iduka.value = res_iduka
  isLoading.value = false
}

async function getProkelInfo() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_prokel = await client.collection('program_keahlian').getOne(user?.user.value.program_keahlian)
  if(res_prokel) prokel.value = res_prokel
  isLoading.value = false
}

onMounted(() => {
  getIdukaInfo()
  getProkelInfo()
  getPemetaanInfo()
})
</script>
