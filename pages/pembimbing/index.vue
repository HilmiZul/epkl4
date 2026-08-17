<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold"><i class="bi bi-emoji-smile"></i> Pembimbing</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'wakasek'" to="/pembimbing/tambah" class="btn btn-dark btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <div v-if="teachers_jjm > 0" class="alert alert-secondary">Ada <span class="fw-bold">{{ teachers_jjm }}</span> Guru yang belum memenuhi Jumlah Jam Mengajar (JP)</div>

      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <!-- <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control" placeholder="Cari nama atau NIP..." /> -->
            <input v-if="role == 'wakasek' || role == 'tu'" type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="Cari username/nama" />
            <input v-else type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="Cari username/nama" />
          </div>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end badge">{{ itemFiltered.length }} pembimbing</div>
        </div>
      </div>

      <div v-if="isLoading" class="text-center my-5">
        <LoadingPlaceholder :col="12" :row="5" />
      </div>

      <div v-else-if="!isLoading && itemFiltered.length < 1" class="text-center my-5">
        <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
        <div class="pb-3 text-muted">Belum tersedia/tidak ditemukan</div>
      </div>

      <!-- list display item -->
      <ul v-else v-for="(pembimbing,i) in itemFiltered" :key="pembimbing.id" class="list-group list-group-flush">
        <nuxt-link v-if="role == 'jurusan' || role == 'wakasek'" :to="`/pembimbing/${pembimbing.id}`" class="link">
          <li class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-1 border-grey">
            <div class="ms-2 me-auto fw-bold">
              <div class="fs-6">{{ pembimbing.nama }}</div>

              <div class="text-muted mb-2">
                {{ pembimbing.username}}
              </div>

              <div v-if="role == 'tu' || role == 'wakasek' || role == 'jurusan'" class="mb-2 smallest">
                <span v-for="prokel in pembimbing.expand.program_keahlian" :key="prokel.id" class="badge border border-1 border-grey text-muted rounded-pill me-1">{{ prokel.nama }}</span>
              </div>

              <NuxtLink v-if="role == 'jurusan'" @click="setModalFormReset(pembimbing)" data-bs-toggle="modal" data-bs-target="#reset-password" class="link text-muted small">
                <i class="bi bi-lock-fill"></i> Reset Password
              </NuxtLink>
            </div>

            <span v-if="pembimbing.jjm < 2" class="badge border border-1 border-grey text-muted rounded-pill me-1">{{ pembimbing.jjm }} jp</span>
            <span v-else class="badge text-bg-dark rounded-pill me-1">{{ pembimbing.jjm }} jp</span>
            <span v-if="pembimbing.konversi_jjm_ke_jumlah_siswa > 0" class="badge text-bg-dark rounded-pill me-1">{{ pembimbing.konversi_jjm_ke_jumlah_siswa }} siswa</span>

            <span v-if="pembimbing.role == 'jurusan'" class="badge border border-1 border-grey text-muted rounded-pill">Manajemen</span>
            <span v-else class="badge border border-1 border-grey text-muted rounded-pill">Guru Pembimbing</span>
          </li>
        </nuxt-link>

        <li v-else-if="role == 'tu'" class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-1 border-grey">
          <div class="me-2">
            <span v-if="role == 'tu'" class="badge border border-1 border-grey text-muted rounded-pill">{{ pembimbing.expand.program_keahlian.nama }}</span>
          </div>

          <div class="ms-2 me-auto fw-bold">
            <div class="fs-6">{{ pembimbing.nama }}</div>

            <div v-if="role == 'tu'" class="text-muted mb-2">
              {{ pembimbing.username}}
            </div>

            <div v-else class="text-muted mb-2">
              {{ pembimbing.username}} &#8212;
              <span v-if="pembimbing.role == 'jurusan'">Manajemen</span>
              <span v-else>Guru Pembimbing</span>
            </div>
          </div>

          <span v-if="pembimbing.jjm < 2" class="badge border border-1 border-grey text-muted rounded-pill me-2 text-danger">{{ pembimbing.jjm }} jp</span>
          <span v-else class="badge border border-1 border-grey text-muted rounded-pill me-2">{{ pembimbing.jjm }} jp</span>

          <span v-if="role == 'jurusan'">
            <span v-if="pembimbing.role == 'jurusan'" class="badge border border-1 border-grey text-muted rounded-pill">Manajemen</span>
            <span v-else class="badge border border-1 border-grey text-muted rounded-pill">Guru Pembimbing</span>
          </span>
        </li>
      </ul>
      <!-- tutup list display -->
    </div>

    <!-- modal reset password -->
    <div class="modal" id="reset-password" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border border-2 border-dark shadow-lg">
          <div class="modal-header h4 text-bg-white quicksand border-bottom border-3 border-dark">
            Reset Password
          </div>
          <div class="modal-body text-dark small">
            <div v-if="isSuccessReset" class="alert alert-secondary">Password berhasil reset!</div>
            <div v-if="isResetError" class="alert alert-danger">Konfirmasi password tidak sama!</div>

            <form @submit.prevent="resetPassword">
              <div class="mb-4">
                <label for="password">Password (minimal 8 karakter)</label>
                <input v-model="formReset.password" type="password" id="password" class="form form-control form-control-lg" placeholder="masukkan password min.8 karakter" required>
              </div>
              <div class="my-4">
                <label for="passwordConfirm">Konfirmasi Password</label>
                <input v-model="formReset.passwordConfirm" :disabled="formReset.password?.length < 8" type="password" id="passwordConfirm" class="form form-control form-control-lg" placeholder="ketik ulang password" required>
              </div>

              <button :disabled="isSendingReset || formReset.password == '' || formReset.passwordConfirm?.length < 8" class="btn btn-dark me-2 border border-2 border-dark">
                <span v-if="!isSendingReset">Simpan</span>
                <span v-else>Sedang menyimpan</span>
              </button>
              <a class="link hand-cursor fw-bold text-muted" data-bs-dismiss="modal">Tutup</a>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-if="itemFiltered.length > 0">
      <div v-for="pembimbing in itemFiltered" :key="pembimbing.id">
        <div class="modal" :id="`pem-${pembimbing.id}`" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
              <div class="modal-header rounded-0 h4 bg-danger text-white quicksand">
                Peringatan!
              </div>
              <div class="modal-body text-dark small">
                Yakin nih mau hapus {{ pembimbing.nama }} dari Pembimbing?
              </div>
              <div class="modal-footer">
                <button v-if="!isDeleted" class="btn btn-danger" data-bs-dismiss="modal" @click="hapusData(pembimbing.id)" :disabled="isSending">
                  <span v-if="isSending">Sedang menghapus</span>
                  <span v-else>Hapus</span>
                </button>
                <span v-else class="me-2"><em>Berhasil dihapus!</em></span>
                <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-light" data-bs-dismiss="modal">Gajadi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Pembimbing — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let teachers = ref([])
let isLoading = ref(true)
let isSending = ref(false)
let isDeleted = ref(false)
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let keyword = ref('')
let teachers_jjm = ref(0)

let isSendingReset = ref(false)
let isSuccessReset = ref(false)
let isResetError = ref(false)
let formResetGetId = ref()

let formReset = ref({
  password: "",
  passwordConfirm: "",
})

let formJjm = ref({
  program_keahlian: "",
  guru: "",
  jjm: "",
  konversi_jjm_ke_jumlah_siswa: ""
})

let currentPembimbingToJjm = ref()
let program_keahlians = ref([])

if(role != 'jurusan' && role != 'admin' && role != 'wakasek' && role != 'tu') navigateTo('/404')


// Mengambil record Pembimbing dengan filter by role = wakasek || jurusan
// Tampilkan semua tanpa terkecuali apabila role wakasek
// dan Tampilkan sesuai prokel(program keahlian) apabila role sebagai jurusan
// data dikembalikan ke teachers
async function getPembimbingByProkel() {
  isLoading.value = true

  // filter & sort berdasarkan role `wakasek` aja
  // let filterQuery = `program_keahlian="${prokel}" && role!="admin"`
  let sorting = `jjm, -role, kelompok_mapel, nama`
  if(role == 'wakasek' || role == 'tu') {
    client.autoCancellation(false)
    let data = await client.collection('teacher_users').getFullList({
      filter: `role!="wakasek" && role!="admin" && role!="tu"`,
      expand: "program_keahlian",
      sort: `jjm, program_keahlian, nama`
    })

    if(data) {
      isLoading.value = false
      teachers.value = data
    }
    // filterQuery = `role!="wakasek" && role!="admin" && role!="tu"`
    // sorting = `program_keahlian.nama, nama`
  }
  else {
    client.autoCancellation(false)
    let data = await client.collection('teacher_users').getFullList({
    // let data = await client.collection('teacher_users_duplicate').getFullList({
      // filter: client.filter("program_keahlian ?= {:p} && role!='admin' && role!='tu'", { p: prokel }),
      // operator ~ untuk irisan natara multiple_field dengan multiple_field
      // operator ?= untuk irisan antara single_field dengan multiple_field
      filter: client.filter(`program_keahlian ~ "${prokel}" && role!="admin" && role!="tu"`),
      expand: "program_keahlian",
      sort: sorting
    })

    if(data) {
      isLoading.value = false
      teachers.value = data
    }
  }
}


// Mengumpulkan dan memfilter Guru yang belum terisi JJM-nya
// data dikembalikan kedalam `teachers_jjm`
async function getGuruByJjm() {
  let filters = `(role="guru" || role="jurusan") && program_keahlian="${prokel}" && jjm < 2`

  if(role == 'jurusan' || role == 'guru') {
    filters = `(role="guru" || role="jurusan") && program_keahlian="${prokel}" && jjm < 2`
  } else if(role == 'wakasek' || role == 'tu') {
    filters = `(role="guru" || role="jurusan") && jjm < 2`
  }

  let res = await client.collection('teacher_users').getList(1, 1, {
    filter: filters
  })

  if(res) {
    teachers_jjm.value = res.totalItems
  }
}

const itemFiltered = computed(() => {
  return teachers.value.filter((i) => {
    return (
      i.username.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.role.toLowerCase().includes(keyword.value.toLowerCase())
      // i.expand.program_keahlian.filter((j) => j.nama.toLowerCase().includes(keyword.value.toLowerCase()))
      // i.expand.program_keahlian.nama.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

function setModalFormReset(pembimbing) {
  formResetGetId.value = pembimbing.id
}

function setModalPembimbingToJJM(pembimbing) {
  currentPembimbingToJjm.value = pembimbing
}

async function resetPassword() {
  isSendingReset.value = true
  isSuccessReset.value = false
  isResetError.value = false

  try {
    let res = await client.collection('teacher_users').update(formResetGetId.value, formReset.value)

    if(res) {
      isSendingReset.value = false
      isSuccessReset.value = true
      formReset.value.password = ""
      formReset.value.passwordConfirm = ""
    }
  } catch (err) {
    isResetError.value = true
    isSuccessReset.value = false
    isSendingReset.value = false
    formReset.value.password = ""
    formReset.value.passwordConfirm = ""
  }
}

async function getProgramKeahlian() {
  let res = await client.collection('program_keahlian').getFullList()
  if(res) {
    program_keahlians.value = res
  }
}

// async function hapusData(id) {
  // isLoading.value = true
  // let res = await client.collection('siswa').getFullList({
  //   filter: "pembimbing='"+id+"'"
  // })
  // if(res) {
  //   if(res.length > 0) {
  //     for(let i=0; i<res.length; i++) {
  //       console.log(`update siswa: ${res[i].id}`)
  //       await client.collection('siswa').update(res[i].id, { pembimbing: '' })
  //     }
  //     await client.collection('teacher_users').delete(id)
  //     isLoading.value = false
  //   } else {
  //     await client.collection('teacher_users').delete(id)
  //     isLoading.value = false
  //   }
  // }
  // await client.collection('teacher_users').delete(id)
// }


onMounted(() => {
  getGuruByJjm()
  getPembimbingByProkel()
  getProgramKeahlian()
  client.collection('teacher_users').subscribe('*', function(e) {
    if(e.action == "delete") getPembimbingByProkel()
  }, {})
})
</script>
