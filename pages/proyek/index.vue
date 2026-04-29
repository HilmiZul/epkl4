<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-easel"></i> Proyek</span>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="getProjectsByProkelOrPembimbing">
            <div class="my-3 mt-0 input-group">
              <input v-model="keyword" class="form form-control form-control-lg" type="search" placeholder="🔎 Cari judul proyek / peserta" />
              <button class="btn btn-info ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>

        <div class="col-md-6">
          <div class="badge bg-transperent text-dark float-end">{{ projects?.totalItems || 0 }} proyek</div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-12">
          <div v-if="isLoading">
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
          </div>

          <div v-else-if="!isLoading && projects?.totalItems < 1" class="text-muted text-center my-3">
            <div v-if="searchActivated">
              <div class="fs-1"><i class="bi bi-search"></i></div>
              <div class="fs-4">Pencarian tidak ditemukan</div>
            </div>
            <div v-else>
              <div class="fs-1"><i class="bi bi-database-fill"></i></div>
              <div class="fs-4">Belum tersedia</div>
            </div>
          </div>

          <ul v-else v-for="project in projects.items" :key="project.id" class="list-group list-group-flush">
            <a class="hand-cursor" data-bs-toggle="modal" data-bs-target="#pratinjau" @click="setProjectToPrantinjau(project)">
              <li class="list-group-item py-3 border-bottom border-2 border-grey">
                <div class="fw-bold">{{ project.judul }}</div>

                <div class="text-muted fw-bold mt-2 mb-1">{{ project.expand.siswa.nama }}</div>
                <div class="text-muted fw-bold mb-2">XII.{{ project.expand.siswa.kelas }}</div>

                <a v-if="project.catatan_guru" @click="setProjectToPrantinjau(project)" data-bs-toggle="modal" data-bs-target="#ubah-catatan" class="link text-muted mb-2"><i class="bi bi-chat-left-fill"></i> Ubah catatan</a>
                <a v-else @click="setProjectToPrantinjau(project)" data-bs-toggle="modal" data-bs-target="#catatan" class="link text-muted mb-2"><i class="bi bi-chat-left"></i> Tulis catatan</a>
              </li>
            </a>
          </ul>

          <div v-if="!isLoading" class="my-4">
            <div v-if="isMovingPage">
              <loading-placeholder row="1" col="12" />
              <loading-placeholder row="1" col="12" />
              <loading-placeholder row="1" col="12" />
              <loading-placeholder row="1" col="12" />
            </div>

            <div class="text-center">
              <button v-if="projects.totalItems" :disabled="isMovingPage || projects.page >= projects.totalPages" @click="loadMore(projects.page + 1, false)" class="btn btn-info border border-2 border-dark">
                muat lagi <i class="bi bi-arrow-down"></i>
              </button>
            </div>
          </div>

          <!-- single modal: pratinjau proyek -->
          <div class="modal" id="pratinjau" tabindex="-1" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                <div class="modal-header rounded-0 bg-info h4 fw-bold border-bottom border-3 border-dark">
                  {{ pratinjau?.judul }}
                  <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                </div>

                <div class="modal-body">
                  <div class="mb-4 fw-bold">{{ pratinjau?.deskripsi }}</div>

                  <div class="text-muted fw-bold">URL</div>
                  <div v-if="pratinjau?.url" class="mb-4 fw-bold"><NuxtLink :to="`${pratinjau?.url}`" class="link" target="_blank">{{ pratinjau?.url }} <i class="bi bi-box-arrow-in-up-right"></i></NuxtLink></div>
                  <div v-else class="mb-4 fw-bold">&#8212;</div>

                  <div class="text-muted fw-bold">Oleh</div>
                  <div class="fw-bold">{{ pratinjau?.expand.siswa.nama }}</div>
                  <div class="mb-4 fw-bold">XII.{{ pratinjau?.expand.siswa.kelas }}</div>

                  <div class="text-muted fw-bold">IDUKA</div>
                  <div class="mb-4 fw-bold">{{ pratinjau?.expand.iduka.nama }}</div>

                  <hr>

                  <div class="text-muted fw-bold">Catatan Guru</div>
                  <div v-if="pratinjau?.catatan_guru" class="mb-4 fw-bold">{{ pratinjau?.catatan_guru }}</div>
                  <div v-else class="mb-4 fw-bold">&#8212;</div>
                </div>
              </div>
            </div>
          </div>

          <!-- single modal: buat catatan guru -->
          <div class="modal" id="catatan" tabindex="-1" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                <div class="modal-header rounded-0 bg-info h4 fw-bold border-bottom border-3 border-dark">
                  Beri catatan
                  <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                </div>

                <div class="modal-body">
                  <form @submit.prevent="buatCatatan(pratinjau?.id)">
                    <div class="mb-4">
                      <textarea v-model="form.catatan_guru" class="form form-control" rows="4" placeholder="tulis catatan untuk proyek ini..." required></textarea>
                    </div>

                    <button :disabled="form.catatan_guru.length < 5" data-bs-dismiss="modal" class="btn btn-info border border-2 border-dark">
                      Kirim
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <!-- single modal: ubah catatan guru -->
          <div class="modal" id="ubah-catatan" tabindex="-1" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                <div class="modal-header rounded-0 bg-info h4 fw-bold border-bottom border-3 border-dark">
                  Ubah catatan
                  <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                </div>

                <div class="modal-body">
                  <form @submit.prevent="ubahCatatan(pratinjau?.id)">
                    <div class="mb-4">
                      <textarea v-model="currentCatatan" class="form form-control" rows="4" placeholder="tulis catatan untuk proyek ini..."></textarea>
                    </div>

                    <button data-bs-dismiss="modal" class="btn btn-info border border-2 border-dark">
                      Simpan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: "Proyek Peserta — e-PKL / SMKN 4 Tasikmalaya." })

let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user?.user.value.program_keahlian
let id_pembimbing = user?.user.value.id
let role = user?.user.value.role
let isLoading = ref(true)
let isError = ref(false)
let isMovingPage = ref(false)
let projects = ref([])
let pratinjau = ref()
let perPage = 30
let keyword = ref('')
let searchActivated = ref(false)

let form = ref({
  catatan_guru: '',
})
let currentCatatan = ref('')

async function getProjectsByProkelOrPembimbing(loading=true) {
  isLoading.value = loading
  isError.value = false

  try {
    let filter

    if(role == 'jurusan') {
      if(keyword.value) {
        searchActivated.value = true
        filter = `program_keahlian="${prokel}" && (judul="${keyword.value}" || siswa.nama~"${keyword.value}")`
      } else {
        searchActivated.value = false
        filter = `program_keahlian="${prokel}"`
      }
    } else {
      if(keyword.value) {
        searchActivated.value = true
        filter = `program_keahlian="${prokel}" && iduka.pembimbing_sekolah="${id_pembimbing}" && (judul="${keyword.value}" || siswa.nama~"${keyword.value}")`
      } else {
        searchActivated.value = false
        filter = `program_keahlian="${prokel}" && iduka.pembimbing_sekolah="${id_pembimbing}"`
      }
    }

    let res = await client.collection('proyek').getList(1, perPage, {
      filter: filter,
      expand: `program_keahlian, siswa, iduka.pembimbing_sekolah`,
      sort: `-created`
    })

    if(res) {
      projects.value = res
      isLoading.value = false
      isError.value = false
    }
  } catch (err) {
    isError.value = true
    isLoading.value = false
  }
}

async function loadMore(page, loading=true) {
  isLoading.value = loading
  isError.value = false
  isMovingPage.value = true

  try {
    let filter

    if(role == 'jurusan') {
      if(keyword.value) {
        searchActivated.value = true
        filter = `program_keahlian="${prokel}" && (judul="${keyword.value}" || siswa.nama~"${keyword.value}")`
      } else {
        searchActivated.value = false
        filter = `program_keahlian="${prokel}"`
      }
    } else {
      if(keyword.value) {
        searchActivated.value = true
        filter = `program_keahlian="${prokel}" && iduka.pembimbing_sekolah="${id_pembimbing}" && (judul="${keyword.value}" || siswa.nama~"${keyword.value}")`
      } else {
        searchActivated.value = false
        filter = `program_keahlian="${prokel}" && iduka.pembimbing_sekolah="${id_pembimbing}"`
      }
    }

    let res = await client.collection('proyek').getList(page, perPage, {
      filter: filter,
      expand: `program_keahlian, siswa, iduka.pembimbing_sekolah`,
      sort: `-created`
    })

    if(res) {
      projects.value.page = res.page
      projects.value.perPage = res.perPage
      projects.value.totalItems = res.totalItems
      projects.value.totalPages = res.totalPages
      projects.value.items = projects.value.items.concat(res.items)

      isLoading.value = false
      isError.value = false
      isMovingPage.value = false
    }
  } catch (err) {
    isError.value = true
    isLoading.value = false
    isMovingPage.value = false
  }
}

// function menerima satu parameter yaitu object dari satu array 
// yang diambil dari loop proyek untuk dimasukkan ke variable pratinjau
function setProjectToPrantinjau(project) {
  pratinjau.value = project
  currentCatatan.value = pratinjau.value.catatan_guru
}


async function buatCatatan(id) {
  let res = await client.collection('proyek').update(id, form.value)

  if(res) {
    getProjectsByProkelOrPembimbing(false)
  }
}

async function ubahCatatan(id) {
  let res = await client.collection('proyek').update(id, { catatan_guru: currentCatatan.value })

  if(res) {
    getProjectsByProkelOrPembimbing(false)
  }
}

onMounted(() => {
  getProjectsByProkelOrPembimbing()
})
</script>
