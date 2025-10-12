<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-person-fill"></i> Peserta Didik</span>
      <span class="float-end">
        <span v-if="role == 'admin' || role == 'jurusan'">
          <button v-if="students.totalItems > 0 && count_users.length < 1" data-bs-toggle="modal" data-bs-target="#buat-akun-peserta" class="btn btn-info btn-sm me-2"><i class="bi bi-person-plus"></i> Buat akun</button>
        </span>
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/import" class="btn btn-success btn-sm border border-2 border-dark"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link>
      </span>
      <div class="modal" id="buat-akun-peserta" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header rounded-0 h4 bg-info quicksand">
              Buat akun Peserta
            </div>
            <div class="modal-body">
              Akun ini akan digunakan Peserta untuk login ke aplikasi. <br>
              Tekan tombol <strong>Buatkan</strong> untuk membuat akun otomatis.
            </div>
            <div class="modal-footer">
              <span v-if="isCreated" class="fst-italic text-muted">Berhasil dibuat!</span>
              <span v-if="isCreatingUser" class="fst-italic text-muted">Membuat akun user peserta</span>
              <button v-if="!isCreated" @click="buatAkunPeserta" class="btn btn-success">Buatkan</button>
              <button v-if="!isCreated" class="btn btn-light" data-bs-dismiss="modal">Nanti saja</button>
              <button v-if="isCreated" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body small">
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
              <input type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="🔎 Cari nama" />
              <button class="btn btn-info ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end">{{ students.totalItems }} peserta</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-hover table-striped table-borderless">
              <thead>
                <tr>
                  <th width="2%">#</th>
                  <th>Nama</th>
                  <th width="10%">Kelas</th>
                  <th width="15%">Rapor</th>
                  <th width="10%">Pemetaan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading" class="text-center my-5">
                  <td colspan="5">
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                  </td>
                </tr>
                <tr v-else-if="!isLoading && students.totalItems < 1" class="text-center my-5">
                  <td colspan="5">
                    <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                    <div class="pb-3">Data tidak ditemukan</div>
                  </td>
                </tr>
                <tr v-else v-for="(student,i) in students.items" :key="student.id">
                  <td>{{ i+1 }}. </td>
                  <td class="fw-bold">
                    <nuxt-link :to="`/peserta/${student.id}`" class="link">{{ student.nama }}</nuxt-link>
                  </td>
                  <!-- <td>{{ student.pembimbing }}</td> -->
                  <td>{{ student.kelas }}</td>
                  <td>
                    <span v-if="student.status_rapot" class="badge bg-success">Tuntas</span>
                    <span v-else class="badge bg-danger">Belum tuntas</span>
                  </td>
                  <td>
                    <span v-if="student.status_pemetaan_pkl" class="badge bg-success">Sudah</span>
                    <span v-else class="badge bg-danger">Belum</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
            <button :disabled="isMovingPage || students.page < 2" @click="pagination(students.page - 1, false)" class="btn btn-info btn-sm me-2 border border-2 border-dark">
              <i class="bi bi-arrow-left"></i> sebelumnya
            </button>
            <button :disabled="isMovingPage || students.page >= students.totalPages" @click="pagination(students.page + 1, false)" class="btn btn-info btn-sm border border-2 border-dark">
              lanjut <i class="bi bi-arrow-right"></i>
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
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')
let perPage = 20
let isMovingPage = ref(false)
let allStudent = ref([])

const getStudents = async (loading=true) => {
  isLoading.value = loading
  let searchFilter = ''
  if(keyword.value != '') searchFilter = " && nama~'"+keyword.value+"'"
  client.autoCancellation(false)
  const res_student = await client
    .collection('siswa')
    .getList(1, perPage, {
      filter: "program_keahlian='"+prokel+"'" + searchFilter,
      sort: 'kelas, nama, status_rapot, status_pemetaan_pkl',
    })
  const res_all_student = await client.collection('siswa')
    .getFullList({
      filter: "program_keahlian='"+prokel+"'",
      sort: 'kelas, status_rapot, status_pemetaan_pkl',
    })
  if(res_student && res_all_student) {
    isLoading.value = false
    students.value = res_student
    allStudent.value = res_all_student
  }
}

async function pagination(page) {
  isMovingPage.value = true
  client.autoCancellation(false)
  let res_student = await client.collection('siswa').getList(page, perPage, {
    filter: "program_keahlian='"+prokel+"'",
    sort: 'kelas, status_rapot, status_pemetaan_pkl',
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

// const studentsFiltered = computed(() => {
//   return students.value.items.filter((i) => {
//     return (
//       i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
//       i.kelas.toLowerCase().includes(keyword.value.toLowerCase())
//     )
//   })
// })

onMounted(() => {
  getStudents()
  getUsers()
  client.autoCancellation(false)
  client.collection('student_users').subscribe('*', function (e) {
    if(e.action == 'create') {
      getUsers()
    }
  }, {});
})
</script>

