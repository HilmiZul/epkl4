<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold"><i class="bi bi-people-fill"></i> Peserta Didik</span>
      <span class="float-end">
        <span v-if="role == 'admin' || role == 'jurusan'">
          <button v-if="students.totalItems > 0 && count_users.length < 1" data-bs-toggle="modal" data-bs-target="#buat-akun-peserta" class="btn btn-light btn-sm border border-2 border-dark"><i class="bi bi-person-plus"></i> Buat akun</button>
        </span>
        <!-- <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/import" class="btn btn-dark btn-sm ms-2 border border-2 border-dark"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link> -->
      </span>
      <div class="modal" id="buat-akun-peserta" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border border-3 border-dark shadow-lg">
            <div class="modal-header h4 border-bottom border-3 border-dark fw-bold">
              Buat akun Peserta
            </div>
            <div class="modal-body">
              Akun ini akan digunakan Peserta untuk login ke aplikasi. <br>
              Tekan tombol <strong>Buatkan</strong> untuk membuat semua Akun Peserta.
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <div v-if="isCreated" class="fst-italic text-muted">Berhasil dibuat!</div>
              <span v-if="isCreatingUser" class="fst-italic text-muted">Membuat akun user peserta</span>
              <button v-if="!isCreated" @click="buatAkunPeserta" class="btn btn-dark me-2 border border-2 border-dark">Buatkan</button>
              <a v-if="!isCreated" class="link hand-cursor" data-bs-dismiss="modal">Nanti saja</a>
              <button v-if="isCreated" class="btn btn-light border border-2 border-dark" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div v-if="role == 'jurusan' && peserta_belum_pemetaan?.totalItems > 0" class="alert alert-secondary">
        Ada <span class="fw-bold">{{ peserta_belum_pemetaan.totalItems }}</span> yang belum pemetaan PKL. <span class="hand-cursor border-bottom border-2 border-dark" data-bs-toggle="modal" data-bs-target="#peserta-belum-pemetaan">Lihat</span>
      </div>

      <!-- Single modal: Peserta belum pemetaan -->
      <div class="modal" id="peserta-belum-pemetaan">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border border-3 border-dark shadow-lg">
            <div class="modal-header fw-bold border-bottom border-3 border-dark">
              <div class="fs-5">Peserta yang belum pemetaan</div>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="text-muted badge border-1 border-grey">{{ peserta_belum_pemetaan?.totalItems }} peserta</div>
              <table class="table table-striped my-2">
                <tbody>
                  <tr v-for="(p,i) in peserta_belum_pemetaan.items" :key="p.id" class="fw-bold">
                    <td>
                      {{ p.nama }} <br>
                      <span class="smallest text-muted">{{ p.kelas }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="peserta_belum_pemetaan || isMovingPage" class="text-muted small mb-2">
                <span v-if="peserta_belum_pemetaan?.totalItems">Halaman {{ peserta_belum_pemetaan.page }} dari {{ peserta_belum_pemetaan.totalPages }}</span>
              </div>
              <button :disabled="isMovingPageModal || peserta_belum_pemetaan.page < 2" @click="paginationPesertaBelumPemetaan(peserta_belum_pemetaan.page - 1)" class="btn btn-dark btn-sm me-2 border border-2 border-dark">
                <i class="bi bi-arrow-left"></i>
              </button>
              <button :disabled="isMovingPageModal || peserta_belum_pemetaan.page >= peserta_belum_pemetaan.totalPages" @click="paginationPesertaBelumPemetaan(peserta_belum_pemetaan.page + 1)" class="btn btn-outline-dark btn-sm border border-2 border-dark">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- <div class="col-3">
          <select v-model="keyword" class="form form-control form-select">
            <option disabled value="">🗂 Kelas</option>
            <option value="">Semua</option>
            <option value="PPLG-1">PPLG-1</option>
            <option value="PPLG-2">PPLG-2</option>
            <option value="PPLG-3">PPLG-3</option>
            <option value="PPLG-4">PPLG-4</option>
          </select>
        </div> -->
        <div class="col-lg-6">
          <form @submit.prevent="getStudents">
            <div class="my-3 mt-0 input-group">
              <input type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="Cari nama" />
              <button class="btn btn-dark ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>

        <div v-if="role == 'tu' || role == 'wakasek'" class="col-lg-3">
          <div class="my-3 mt-0">
            <select v-model="selectedProkel" @change="getStudents()" class="form form-select form-select-lg">
              <option value="">Semua Jurusan</option>
              <option v-for="p in opsiProkel" :key="p.id" :value="p.id">{{ p.nama }}</option>
            </select>
          </div>
        </div>

        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end badge">{{ students.totalItems }} peserta</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->

      <div class="row">
        <div class="col-md-12">
          <div v-if="isLoading" class="text-center my-5">
            <LoadingPlaceholder :col="12" :row="5" />
          </div>

          <div v-else-if="!isLoading && students.totalItems < 1" class="text-center my-5">
            <div v-if="searchActivated">
              <div class="text-muted"><i class="bi bi-search fs-1"></i></div>
              <div class="pb-3 text-muted">Pencarian tidak ditemukan</div>
            </div>
            <div v-else>
              <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
              <div class="pb-3 text-muted">Belum tersedia</div>
            </div>
          </div>

          <!-- list display item -->
          <ul v-else v-for="(student,i) in students.items" :key="student.id" class="list-group list-group-flush">
            <nuxt-link v-if="role == 'jurusan' || role == 'wakasek'" :to="`/peserta/${student.id}`" class="link">
              <li class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-1 border-grey">
                <div class="ms-2 me-auto fw-bold">
                  <div class="fs-6">{{ student.nama.toUpperCase() }}</div>

                  <div class="text-muted small mb-2">
                    {{ student.kelas }}
                  </div>

                  <div class="smallest">
                    <span v-if="!student.status_rapot" class="badge border border-1 border-grey text-muted rounded-pill me-1">Belum tuntas</span>
                    <span v-if="!student.status_pemetaan_pkl" class="badge border border-1 border-grey text-muted rounded-pill">Belum terpetakan</span>
                  </div>
                </div>
              </li>
            </nuxt-link>

            <li v-else class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-1 border-grey">
              <div class="ms-2 me-auto fw-bold">
                <div class="fs-6">{{ student.nama.toUpperCase() }}</div>

                <div class="text-muted small mb-2">
                  {{ student.kelas }}
                </div>

                <div class="smallest">
                  <span v-if="!student.status_rapot" class="badge border border-1 border-grey text-muted rounded-pill me-1">Belum tuntas</span>
                  <span v-if="!student.status_pemetaan_pkl" class="badge border border-1 border-grey text-muted rounded-pill">Belum terpetakan</span>
                </div>
              </div>
            </li>
          </ul>

        </div>
        <div class="col-md-12 mt-2">
          <loading-placeholder v-if="isLoading" col="3" row="1" />
          <span v-else>
            <div v-if="isMovingPage" class="text-muted small mb-2 fst-italic">sedang berpindah halaman</div>
            <div v-else>
              <div v-if="students || isMovingPage" class="text-muted small mb-2">
                <span v-if="students.totalItems">Halaman {{ students.page }} dari {{ students.totalPages }}</span>
              </div>
            </div>
            <button :disabled="isMovingPage || students.page < 2" @click="pagination(students.page - 1, false)" class="btn btn-dark me-2 border border-2 border-dark">
              <i class="bi bi-arrow-left"></i>
            </button>
            <button :disabled="isMovingPage || students.page >= students.totalPages" @click="pagination(students.page + 1, false)" class="btn btn-outline-dark border border-2 border-dark">
              <i class="bi bi-arrow-right"></i>
            </button>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
useHead({ title: "Peserta — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let students = ref([])
let isLoading = ref(true)
let isLoadingUser = ref(true)
let isLoadingPemetaan = ref(true)
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let keyword = ref('')
let opsiKelas = ref('')
let isCreatingUser = ref(false)
let isCreated = ref(false)
let count_users = ref([])
let count_pemetaan = ref([]) // untuk menghitung jumlah pemetaan = jumlah peserta itu sendiri. maka tombol buat akun user muncul.

let perPage = 20
let isMovingPage = ref(false)
let isMovingPageModal = ref(false)
let allStudent = ref([])
let peserta_belum_pemetaan = ref('')
let searchActivated = ref(false)

let selectedProkel = ref('')
let opsiProkel = ref([])

if(role != 'jurusan' && role != 'admin' && role != 'guru' && role != 'wakasek') navigateTo('/404')

const getStudents = async (loading=true) => {
  isLoading.value = loading

  let filterQuery = `program_keahlian="${prokel}"`
  let searchFilter = ''
  if(keyword.value != '') {
    searchActivated.value = true
    searchFilter = " && nama~'"+keyword.value+"'"
  } else {
    searchActivated.value = false
  }

  if(role == 'guru') {
    filterQuery = `guru_pembimbing="${user.user.value.id}"`
  }
  else if(role == 'wakasek') {
    filterQuery = ``
    searchFilter = ``
    searchActivated.value = false
    if(keyword.value != '' && selectedProkel.value != '') {
      searchActivated.value = true
      searchFilter = `nama~"${keyword.value}" && program_keahlian="${selectedProkel.value}"`
    }
    else if(keyword.value != '') {
      searchActivated.value = true
      searchFilter = `nama~"${keyword.value}"`
    }
    else if(selectedProkel.value != '') {
      searchActivated.value = true
      searchFilter = `program_keahlian="${selectedProkel.value}"`
    }
  }

  client.autoCancellation(false)
  const res_student = await client
    .collection('siswa')
    .getList(1, perPage, {
      filter: filterQuery + searchFilter,
      sort: 'kelas, nama',
    })
  const res_all_student = await client.collection('siswa')
    .getFullList({
      filter: filterQuery,
      sort: 'kelas, status_rapot, status_pemetaan_pkl',
    })

  if(res_student) {
    students.value = res_student
    if(res_all_student) {
      isLoading.value = false
      allStudent.value = res_all_student
    }
  }
}

async function pagination(page) {
  isMovingPage.value = true

  let filterQuery = `program_keahlian="${prokel}"`
  let searchFilter = ''
  if(keyword.value != '') {
    searchActivated.value = true
    searchFilter = " && nama~'"+keyword.value+"'"
  } else {
    searchActivated.value = false
  }

  if(role == 'guru') {
    filterQuery = `guru_pembimbing="${user.user.value.id}"`
  }
  else if(role == 'wakasek') {
    filterQuery = ``
    searchFilter = ``
    searchActivated.value = false
    if(keyword.value != '' && selectedProkel.value != '') {
      searchActivated.value = true
      searchFilter = `nama~"${keyword.value}" && program_keahlian="${selectedProkel.value}"`
    }
    else if(keyword.value != '') {
      searchActivated.value = true
      searchFilter = `nama~"${keyword.value}"`
    }
    else if(selectedProkel.value != '') {
      searchActivated.value = true
      searchFilter = `program_keahlian="${selectedProkel.value}"`
    }
  }

  client.autoCancellation(false)
  let res_student = await client.collection('siswa').getList(page, perPage, {
    filter: filterQuery + searchFilter,
    sort: 'kelas, nama',
  })
  if(res_student) {
    students.value = res_student
    isMovingPage.value = false
  }
}

const getUsers = async (loading=true) => {
  isLoadingUser.value = loading
  client.autoCancellation(false)
  const res_user = await client.collection('student_users').getFullList({
    filter: "program_keahlian='"+prokel+"'"
  })
  if(res_user) {
    isLoadingUser.value = false
    count_users.value = res_user
  }
}

const getPemetaan = async () => {
  // mengambil pemetaan berdasarkan prokel
  // jumlahnya akan dibandingkan dengan jumlah peserta itu sendiri
  // jika sama, maka pemetaan PKL selesai dan tombol pembuatan akun peserta muncul
  isLoadingPemetaan.value = true
  client.autoCancellation(false)
  const res_pemetaan = await client.collection('pemetaan').getFullList({
    filter: "program_keahlian='"+prokel+"'"
  })
  if(res_pemetaan) {
    isLoadingPemetaan.value = false
    count_pemetaan.value = res_pemetaan
  }
}

const buatAkunPeserta = async () => {
  let s = allStudent.value
  let tempUsers = []
  isCreatingUser.value = true
  isCreated.value = false
  try {
    for(let i=0; i<s.length; i++) {
      tempUsers.push({
        "username": s[i].nis,
        "email": `${s[i].nis}@smkn4-tsm.sch.id`,
        "emailVisibility": true,
        "password": "20276063",
        "passwordConfirm": "20276063",
        "program_keahlian": prokel,
        "siswa": s[i].id
      })
    }
    let res_create_users = await Promise.all(
      tempUsers.map(data => {
        client.collection('student_users').create(data, {'$autoCancel': false })
        client.collection('siswa').update(data.siswa, { hasUser: true })
      })
    )
    if(res_create_users) {
      isCreated.value = true
      isCreatingUser.value = false
    }
  } catch(error) {
    isCreated.value = true
    isCreatingUser.value = false
    console.error("Terjadi kesalahan: ",error)
  }
}

async function getPesertaBelumPemetaan() {
  client.autoCancellation(false)
  let res = await client.collection('siswa').getList(1, 10, {
    filter: `program_keahlian="${prokel}" && status_pemetaan_pkl=false`,
  })
  if(res) {
    peserta_belum_pemetaan.value = res
  }
}
async function paginationPesertaBelumPemetaan(page) {
  isMovingPageModal.value = true
  client.autoCancellation(false)
  let res = await client.collection('siswa').getList(page, 10, {
    filter: `program_keahlian="${prokel}" && status_pemetaan_pkl=false`,
  })
  if(res) {
    peserta_belum_pemetaan.value = res
    isMovingPageModal.value = false
  }
}
// const studentsFiltered = computed(() => {
//   return students.value.items.filter((i) => {
//     return (
//       i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
//       i.kelas.toLowerCase().includes(keyword.value.toLowerCase())
//     )
//   })
// })


async function getProkelForOption() {
  if(role == 'wakasek') {
    let res_prokel = await client.collection('program_keahlian').getFullList({
      sort: "created"
    })
    if(res_prokel) opsiProkel.value = res_prokel
  }
}

onMounted(() => {
  getStudents()
  getUsers()
  getPesertaBelumPemetaan()
  getProkelForOption()
  client.autoCancellation(false)
  client.collection('student_users').subscribe('*', function (e) {
    if(e.action == 'create') getUsers()
  }, {});
  client.collection('siswa').subscribe('*', function (e) {
    if(e.action == 'update') getPesertaBelumPemetaan()
  }, {});
})
</script>

