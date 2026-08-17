<template>
  <div class="row">
    <div class="col-md-12">
      <div>
        <div class="fs-5">
          <!-- <h5 class="fw-bold">Personal Info</h5> -->
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
                <span v-if="prokel" class="fw-bold">
                  <span v-for="(program_keahlian, i) in prokel?.expand?.program_keahlian" :key="i" class="text-grey me-1">
                    {{ program_keahlian.nama }}
                  </span>
                </span>
                <span v-else>&#8212;</span>
              </span>
            </div>
          </div>

          <div class="col-md-3">
            <div class="mb-3">
              <div class="text-muted">Kelompok Mapel</div>
              <span v-if="user" class="fw-bold text-grey">
                {{ kelompok_mapel }}
              </span>
            </div>
          </div>

          <div class="col-md-3">
            <div class="mb-3">
              <div v-if="role == 'admin' || role == 'jurusan'" class="text-muted hand-cursor" data-bs-toggle="modal" data-bs-target="#relasi-iduka">
                Relasi IDUKA <i class="bi bi-arrow-up-right-square"></i>
              </div>
              <div v-else class="text-muted"><NuxtLink to="/iduka" class="link">Relasi IDUKA <i class="bi bi-arrow-up-right-square"></i></NuxtLink></div>
              <LoadingPlaceholder v-if="isLoading" row="1" col="6" />
              <span v-else>
                <span v-if="iduka?.totalItems > 0" class="fw-bold text-grey">{{ iduka.totalItems }}</span>
                <span v-else>Belum ada</span>
              </span>
            </div>

            <!-- Single modal: Relasi iduka -->
            <div class="modal" id="relasi-iduka" aria-hidden="true" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border border-3 border-dark shadow-lg">
                  <div class="modal-header fw-bold border-bottom border-3 border-dark">
                    <span class="fs-5">Relasi ke IDUKA</span>
                    <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="text-center">
                      <span v-if="iduka?.totalItems > 0" class="badge text-muted mb-3 small border-grey">{{ iduka?.totalItems }} IDUKA</span>
                    </div>
                    <div v-if="iduka?.totalItems > 0" class="text-muted mb-3">
                      <ul v-for="(company,i) in iduka?.items" :key="i" class="list-group list-group-flush">
                        <li class="list-group-item text-grey">
                          <div class="fw-bold">{{ company.nama }}</div>
                          <nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${company.nama} ${company.alamat}`" target="_blank" class="link smallest text-muted">lihat peta <i class="bi bi-arrow-up-right"></i></nuxt-link>
                        </li>
                      </ul>
                    </div>

                    <div v-else class="text-muted fst-italic mb-3">
                      Belum ada
                    </div>

                    <button :disabled="isMovingPage || iduka.page < 2" @click="paginationRelasiIduka(iduka.page - 1, false)" class="btn btn-dark btn-sm me-2 border border-2 border-dark">
                      <i class="bi bi-arrow-left"></i>
                    </button>
                    <button :disabled="isMovingPage || iduka.page >= iduka.totalPages" @click="paginationRelasiIduka(iduka.page + 1, false)" class="btn btn-outline-dark btn-sm border border-2 border-dark">
                      <i class="bi bi-arrow-right"></i>
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
              <div v-else class="text-muted"><NuxtLink to="/peserta" class="link">Relasi Peserta <i class="bi bi-arrow-up-right-square"></i></NuxtLink></div>
              <LoadingPlaceholder v-if="isLoading" row="1" col="6" />
              <span v-else>
                <span v-if="pemetaan.totalItems > 0" class="fw-bold text-grey">
                  {{ pemetaan.totalItems }}
                </span>
                <span v-else>Belum ada</span>
              </span>
            </div>

            <!-- Single modal: Relasi pembimbing ke peserta didik -->
            <div class="modal" id="relasi-peserta" aria-hidden="true" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border border-3 border-dark shadow-lg">
                  <div class="modal-header fw-bold border-bottom border-3 border-dark">
                    <span class="fs-5">Peserta yang dibimbing</span>
                    <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="text-center">
                      <span v-if="pemetaan?.totalItems > 0" class="badge text-muted mb-3 small border-grey">{{ pemetaan?.totalItems }} Peserta</span>
                    </div>
                    <div v-if="pemetaan?.totalItems > 0" class="text-muted mb-3">
                      <ul v-for="(p,i) in pemetaan?.items" :key="i" class="list-group list-group-flush">
                        <li class="list-group-item text-grey">
                          {{ p.currentMood?.emoji }}
                          <span class="fw-bold">{{ p.nama }}</span>
                          <div class="smallest text-muted">{{ p.kelas }}</div>
                        </li>
                      </ul>
                    </div>
                    <div v-else class="text-muted fst-italic mb-3">
                      Belum ada
                    </div>

                    <button :disabled="isMovingPage || pemetaan.page < 2" @click="paginationRelasiPeserta(pemetaan.page - 1, false)" class="btn btn-dark btn-sm me-2 border border-2 border-dark">
                      <i class="bi bi-arrow-left"></i>
                    </button>
                    <button :disabled="isMovingPage || pemetaan.page >= pemetaan.totalPages" @click="paginationRelasiPeserta(pemetaan.page + 1, false)" class="btn btn-outline-dark btn-sm border border-2 border-dark">
                      <i class="bi bi-arrow-right"></i>
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
    <div class="col-lg-6 mb-3">
      <div class="mb-1 fw-medium fw-bold">Peserta</div>
      <div v-if="pemetaan?.totalItems > 0" class="text-muted mb-3">
        <ul v-for="(siswa,i) in pemetaan?.items" :key="i" class="list-group list-group-flush">
          <li class="list-group-item border-bottom border-1 border-grey">
            {{ siswa.currentMood?.emoji }}
            <span class="fw-bold text-grey">{{ siswa.nama }}</span>
            <div class="smallest text-muted">{{ siswa.kelas }}</div>
          </li>
        </ul>
      </div>

      <div v-else class="text-muted fst-italic mb-3">
        Belum ada
      </div>

      <div v-if="!isLoading" class="my-2">
        <div v-if="isMovingPage">
          <loading-placeholder row="1" col="12" />
          <loading-placeholder row="1" col="12" />
          <loading-placeholder row="1" col="12" />
          <loading-placeholder row="1" col="12" />
        </div>

        <button :disabled="isMovingPage || pemetaan.page < 2" @click="paginationRelasiPeserta(pemetaan.page - 1, false)" class="btn btn-dark btn-sm me-2 border border-2 border-dark">
          <i class="bi bi-arrow-left"></i>
        </button>
        <button :disabled="isMovingPage || pemetaan.page >= pemetaan.totalPages" @click="paginationRelasiPeserta(pemetaan.page + 1, false)" class="btn btn-outline-dark btn-sm border border-2 border-dark">
          <i class="bi bi-arrow-right"></i>
        </button>

      </div>
    </div>

    <div class="col-lg-6">
      <div class="mb-1 fw-medium fw-bold">IDUKA</div>
      <div v-if="iduka?.totalItems > 0" class="text-muted mb-3">
        <ul v-for="(company,i) in iduka?.items" :key="i" class="list-group list-group-flush">
          <li class="list-group-item border-bottom border-1 border-grey">
            <div class="float-end">
              <span class="badge text-muted border border-1 border-grey rounded-pill">{{ company.expand.program_keahlian.nama }}</span>
            </div>
            <span class="fw-bold text-grey">{{ company.nama }}</span> <br>
            <div>
              <nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${company.nama} ${company.alamat}`" target="_blank" class="link smallest text-muted">lihat peta <i class="bi bi-arrow-up-right"></i></nuxt-link>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="text-muted fst-italic mb-3">
        Belum ada
      </div>

      <div v-if="!isLoading" class="my-2">
        <div v-if="isMovingPage">
          <loading-placeholder row="1" col="12" />
          <loading-placeholder row="1" col="12" />
          <loading-placeholder row="1" col="12" />
          <loading-placeholder row="1" col="12" />
        </div>

        <button :disabled="isMovingPage || iduka.page < 2" @click="paginationRelasiIduka(iduka.page - 1, false)" class="btn btn-dark btn-sm me-2 border border-2 border-dark">
          <i class="bi bi-arrow-left"></i>
        </button>
        <button :disabled="isMovingPage || iduka.page >= iduka.totalPages" @click="paginationRelasiIduka(iduka.page + 1, false)" class="btn btn-outline-dark btn-sm border border-2 border-dark">
          <i class="bi bi-arrow-right"></i>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user?.user.value.role
let kelompok_mapel = user.user.value.kelompok_mapel
let nama = user?.user.value.nama
let isLoading = ref(true)
let isMovingPage = ref(false)
let prokel = ref([])
let iduka = ref([])
let pemetaan = ref([])
let perPage = 10

async function getPemetaanInfo() {
  isLoading.value = true
  client.autoCancellation(false)
  // let res_pemetaan = await client.collection('pemetaan').getFullList()
  // let res_pemetaan_by_pembimbing = await client.collection('pemetaan').getList(1, 5, {
  let res_pemetaan_by_pembimbing = await client.collection('siswa').getList(1, perPage, {
    expand: `program_keahlian`,
    filter: `guru_pembimbing="${user?.user.value.id}"`,
    sort: `nama`
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
  let res_pemetaan_by_pembimbing = await client.collection('siswa').getList(page, perPage, {
    expand: `program_keahlian`,
    filter: `guru_pembimbing="${user?.user.value.id}"`,
    sort: `nama`
    // expand: `program_keahlian, siswa`,
    // filter: `pembimbing="${user?.user.value.id}"`,
    // sort: `siswa.nama`
  })
  if(res_pemetaan_by_pembimbing) {
    // pemetaan.value.page = res_pemetaan_by_pembimbing.page
    // pemetaan.value.perPage = res_pemetaan_by_pembimbing.perPage
    // pemetaan.value.totalItems = res_pemetaan_by_pembimbing.totalItems
    // pemetaan.value.totalPages = res_pemetaan_by_pembimbing.totalPages
    pemetaan.value = res_pemetaan_by_pembimbing
    isMovingPage.value = false
  }
}

async function getIdukaInfo() {
  isLoading.value = true

  client.autoCancellation(false)
  let res_iduka = await client.collection('iduka').getList(1, perPage, {
    filter: `pembimbing_sekolah="${user?.user.value.id}" && isArchive=false`,
    expand: `program_keahlian`,
    sort: `nama`
  })

  if(res_iduka) {
    iduka.value = res_iduka
  }
  isLoading.value = false
}
async function paginationRelasiIduka(page) {
  isMovingPage.value = true

  client.autoCancellation(false)
  let res_iduka = await client.collection('iduka').getList(page, perPage, {
    filter: `pembimbing_sekolah="${user?.user.value.id}" && isArchive=false`,
    expand: `program_keahlian`,
    sort: `nama`
  })

  if(res_iduka) {
    iduka.value = res_iduka
    isMovingPage.value = false
  }
}

async function getProkelInfo() {
  isLoading.value = true

  client.autoCancellation(false)
  let res_prokel = await client.collection('teacher_users').getOne(user.user.value.id, {
    expand: `program_keahlian`
  })
  if(res_prokel) {
    prokel.value = res_prokel
  }
  isLoading.value = false
}

onMounted(() => {
  getIdukaInfo()
  getProkelInfo()
  getPemetaanInfo()
})
</script>
