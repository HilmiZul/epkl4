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
              <div v-if="role == 'admin' || role == 'jurusan'" class="text-muted hand-cursor" data-bs-toggle="modal" data-bs-target="#relasi-iduka">
                Relasi IDUKA <i class="bi bi-arrow-up-right-square"></i>
              </div>
              <div v-else class="text-muted">Relasi IDUKA</div>
              <LoadingPlaceholder v-if="isLoading" row="1" col="6" />
              <span v-else>
                <span v-if="iduka?.totalItems > 0" class="fw-bold">{{ iduka.totalItems }}</span>
                <span v-else>Belum ada</span>
              </span>
            </div>
            <!-- Single modal: Relasi iduka -->
            <div class="modal" id="relasi-iduka" aria-hidden="true" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                  <div class="modal-header rounded-0 bg-success fw-bold border-bottom border-3 border-dark">
                    <span class="fs-5">Relasi ke IDUKA</span>
                    <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <table class="table table-striped border border-2 border-dark">
                      <tbody>
                        <tr v-if="iduka?.totalItems < 1">
                          <td class="text-muted fst-italic">Belum ada</td>
                        </tr>
                        <tr v-else v-for="(company,i) in iduka.items" :key="company.id" class="fw-bold">
                          <td width="3%"><span class="badge text-dark">{{ i+1 }}</span></td>
                          <td>
                            {{ company.nama }} <br>
                            <nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${company.nama} ${company.alamat}`" target="_blank" class="link smallest text-muted">lihat peta <i class="bi bi-arrow-up-right"></i></nuxt-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button :disabled="isMovingPage || iduka.page < 2" @click="paginationRelasiIduka(iduka.page - 1, false)" class="btn btn-info btn-sm me-2 border border-2 border-dark">
                      <i class="bi bi-arrow-left"></i> sebelumnya
                    </button>
                    <button :disabled="isMovingPage || iduka.page >= iduka.totalPages" @click="paginationRelasiIduka(iduka.page + 1, false)" class="btn btn-info btn-sm border border-2 border-dark">
                      lanjut <i class="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="mb-3">
              <div v-if="role == 'admin' || role == 'jurusan'" class="text-muted hand-cursor" data-bs-toggle="modal" data-bs-target="#relasi-peserta">
                Relasi Peserta <i class="bi bi-arrow-up-right-square"></i>
              </div>
              <div v-else class="text-muted">Relasi Peserta</div>
              <LoadingPlaceholder v-if="isLoading" row="1" col="6" />
              <span v-else>
                <span v-if="pemetaan?.totalItems > 0" class="fw-bold">{{ pemetaan?.totalItems }}</span>
                <span v-else>Belum ada</span>
              </span>
            </div>
            <!-- Single modal: Relasi pembimbing ke peserta didik -->
            <div class="modal" id="relasi-peserta" aria-hidden="true" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                  <div class="modal-header rounded-0 bg-success fw-bold border-bottom border-3 border-dark">
                    <span class="fs-5">Peserta didik yang dibimbing</span>
                    <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <table class="table table-striped border border-2 border-dark">
                      <tbody>
                        <tr v-if="pemetaan?.totalItems < 1">
                          <td class="text-muted fst-italic">Belum ada</td>
                        </tr>
                        <tr v-else v-for="(p,i) in pemetaan.items" :key="p.id" class="fw-bold">
                          <td width="3%"><span class="badge text-dark">{{ i+1 }}</span></td>
                          <td>
                            {{ p.expand.siswa.nama }} <br>
                            <span class="smallest text-muted">{{ p.expand.siswa.kelas }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button :disabled="isMovingPage || pemetaan.page < 2" @click="paginationRelasiPeserta(pemetaan.page - 1, false)" class="btn btn-info btn-sm me-2 border border-2 border-dark">
                      <i class="bi bi-arrow-left"></i> sebelumnya
                    </button>
                    <button :disabled="isMovingPage || pemetaan.page >= pemetaan.totalPages" @click="paginationRelasiPeserta(pemetaan.page + 1, false)" class="btn btn-info btn-sm border border-2 border-dark">
                      lanjut <i class="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
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
            <td width="3%"><span class="badge text-dark">{{ i+1 }}</span></td>
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
            <td width="3%"><span class="badge text-dark">{{ i+1 }}</span></td>
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
let isMovingPage = ref(false)
let prokel = ref()
let iduka = ref([])
let pemetaan = ref([])
let perPage = 5

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

async function paginationRelasiPeserta(page) {
  isMovingPage.value = true
  client.autoCancellation(false)
  // let res_pemetaan = await client.collection('pemetaan').getFullList()
  let res_pemetaan_by_pembimbing = await client.collection('pemetaan').getList(page, perPage, {
    expand: "iduka, siswa",
    filter: "iduka.pembimbing_sekolah='"+user?.user.value.id+"'"
  })
  if(res_pemetaan_by_pembimbing) {
    pemetaan.value = res_pemetaan_by_pembimbing
    isMovingPage.value = false
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

async function paginationRelasiIduka(page) {
  isMovingPage.value = true
  client.autoCancellation(false)
  let res_iduka = await client.collection('iduka').getList(page, perPage, {
    filter: "pembimbing_sekolah='"+user?.user.value.id+"'"
  })
  if(res_iduka) {
    iduka.value = res_iduka
    isMovingPage.value = false
  }
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
