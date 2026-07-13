<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" col="5" row="1" />
      <span v-else class="h5 quicksand fw-bold text-muted">
        {{ form.kelas }} / <span class="text-dark">{{ form.nama }}</span>
      </span>
      <span class="float-end">
        <NuxtLink to="/peserta" class="btn btn-light btn-sm border border-2 border-dark">kembali</NuxtLink>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-secondary border-2 border-dark">
            <ul class="mb-0">
              <li>Jika ada nilai rapor yang belum tuntas, silahkan ubah status <strong>Ketuntasan Rapor</strong></li>
              <li>Status <strong>Pemetaan PKL</strong> diubah oleh sistem ketika siswa di petakan ke IDUKA</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div v-if="isFail" class="alert alert-danger p-2">
            Terjadi error: {{ errMessage }}
          </div>
          <form @submit.prevent="simpanPerubahan">
            <div class="mt-3 mb-4">
              <label for="nis">NIS (temp)</label>
              <input v-model="form.nis" :disabled="isLoading || isLoadingSave" id="nis" type="text" class="form form-control form-control-lg" placeholder="NIS sebenarnya!" required>
            </div>
            <div class="mb-4">
              <label for="nisn">NISN (temp)</label>
              <input v-model="form.nisn" :disabled="isLoading || isLoadingSave" id="nisn" type="text" class="form form-control form-control-lg" placeholder="NISN sebenarnya!" required>
            </div>
            <div class="mb-4">
              <label for="walikelas">Walikelas</label>
              <select v-model="form.walikelas" class="form form-select form-select-lg" id="walikelas">
                <option value="">- Pilih -</option>
                <option v-for="w in walikelas" :key="w.id" :value="w.id">{{ w.expand.rombel.nama }} &#8212; {{ w.nama }}</option>
              </select>
            </div>
            <div class="my-3 form-check form-switch">
              <input v-model="form.status_rapot" :checked="form.status_rapot" :disabled="isLoading || isLoadingSave" class="form-check-input" type="checkbox" id="checkRapor" switch>
              <label class="form-check-label" for="checkRapor">
                Ketuntasan Rapor
              </label>
            </div>
            <div class="mb-4 text-muted fw-bold">
              <span v-if="form.status_pemetaan_pkl"><i class="bi bi-check-circle"></i> Sudah pemetaan PKL</span>
              <span v-else class="text-danger"><i class="bi bi-x-circle"></i> Belum pemetaan PKL</span>
              <!-- <input :checked="form.status_pemetaan_pkl" disabled class="form-check-input" type="checkbox" id="checkPemetaan" switch> -->
              <!-- <label class="form-check-label" for="checkPemetaan"> -->
              <!--   Pemetaan PKL -->
              <!-- </label> -->
            </div>
            <!-- <div v-if="form.status_pemetaan_pkl" class="mb-3 form-check form-switch">
              <input v-model="form.status_acc_pkl" :checked="form.status_acc_pkl" class="form-check-input" type="checkbox" id="checkAcc" switch>
              <label class="form-check-label" for="checkAcc">
                Diterima tempat PKL?
              </label>
            </div> -->
            <button :disabled="isLoadingSave || isLoading" class="btn btn-dark mb-2 me-3 border border-2 border-dark">
              <span v-if="isLoadingSave">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/peserta" class="link">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil tersimpan!</span>
          </form>
        </div>

        <div class="col-md-6">
          <LoadingPlaceholder v-if="isLoading" col="12" row="2" />
          <div v-else>
            <div class="fw-bold h6 mt-3">Akun Peserta</div>

            <!-- <div v-if="!form.hasUser" class="mt-3 border-dash p-3">
              Buatkan user login untuk <strong>{{ form.nama }}</strong>?
              <div class="mt-3">
                <button @click="buatUserPeserta" :disabled="isCreatingUser" class="btn btn-success border border-2 border-dark">
                  <span v-if="isCreatingUser">Sedang membuat user</span>
                  <span v-else>Buatkan!</span>
                </button>
              </div>
            </div> -->
            <!-- <div v-if="form.hasUser" class="mt-3 border-dash p-3"> -->
            <div v-if="curr_user?.totalItems > 0" class="alert p-3">
              <!-- <div v-if="isUserCreated" class="mb-2"><strong>User berhasil dibuat!</strong></div> -->

              <div class="mb-3">
                <div class="text-muted fw-bold">Username</div>
                <div class="fw-bold">
                  <nuxt-link data-bs-toggle="modal" data-bs-target="#update-username" v-if="curr_user" class="fw-bold hand-cursor link-external">{{ curr_user.items[0].username }}</nuxt-link>
                </div>
              </div>

              <div class="text-muted fw-bold">Password</div>
              <div class="fw-bold">
                <nuxt-link data-bs-toggle="modal" data-bs-target="#reset-password" class="hand-cursor link-external">Reset?</nuxt-link>
                <!-- <div class="text-danger">//TODO: masih return 400 err code</div> -->
              </div>
            </div>

            <div v-else class="alert alert-secondary p-3">
              Akun peserta belum dibuat. Silahkan kembali ke halaman daftar peserta dan klik tombol Buat Akun diatas.
            </div>

            <!-- Modal: Update Username Peserta -->
            <div class="modal" id="update-username" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border border-3 border-dark shadow-lg">
                  <div class="modal-header border-bottom border-3 border-dark">
                    <span class="fs-4 fw-bold">Custom Username Peserta</span>
                    <button @click="() => usernameUpdated = false" class="btn-close" label="Close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body text-dark">
                    <form @submit.prevent="updateUsername">
                      <div class="mb-4">
                        <label for="username">Username</label>
                        <input v-model="new_user_update" type="text" id="username" class="form form-control form-control-lg" placeholder="min. 3 karakter tanpa spasi " required>
                      </div>
                      <div class="text-start">
                        <button :disabled="new_user_update.length < 3 || isUpdateUsername" class="btn btn-dark border border-2 border-dark">
                          <span v-if="isUpdateUsername">Sedang menyimpan</span>
                          <span v-else>Simpan</span>
                        </button>
                        <span v-if="usernameUpdated" class="ms-2 fst-italic text-muted">Username berhasil diubah!</span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal: Reset Password -->
            <div class="modal" id="reset-password" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border border-3 border-dark shadow-lg">
                  <div class="modal-header fw-bold border-bottom border-3 border-dark">
                    <span class="fs-4 fw-bold">Reset Password</span>
                    <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body text-dark">
                    <form @submit.prevent="resetPassword">
                      <div class="mb-4">
                        <label for="password">Password baru</label>
                        <input v-model="formReset.password" id="password" minlength="8" type="password" class="form form-control form-control-lg" placeholder="minimal 8 karakter" required>
                      </div>
                      <div class="mb-4">
                        <label for="passwordConfirm">Konfirmasi Password baru</label>
                        <input v-model="formReset.passwordConfirm" id="passwordConfirm" minlength="8" type="password" class="form form-control form-control-lg" placeholder="Ketik ulang password baru" required>
                      </div>
                      <button class="btn btn-dark border border-2 border-dark">Reset</button>
                      <span v-if="isSuccessResetPassword" class="ms-2 fst-italic text-muted">Password berhasil direset!</span>
                      <span v-if="isErrorResetPassword" class="ms-2 fst-italic text-danger">Password gagal reset!</span>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <hr class="my-4">
      <div class="row">
        <!-- <div class="col-2 align-content-center">
          <div class="emoji text-center">🙅🏻‍♂️</div>
        </div> -->
        <div class="col-md-12">
          <div class="alert text-danger border-danger">
            <h5 class="fw-bold">Danger Zone!</h5>
            <p>Apabila Siswa yang bernama <span class="border-2 border-bottom border-danger pb-1">{{ form.nama }}</span> telah pindah/mengundurkan diri, silahkan hapus!</p>
            <button class="btn btn-danger border border-2 border-dark" data-bs-toggle="modal" :data-bs-target="`#siswa-${form.id}`">Hapus</button>
            <div class="modal" :id="`siswa-${form.id}`" aria-hidden="true" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                  <div class="modal-header rounded-0 h4 bg-danger fw-bold border-bottom border-3 border-dark">
                    Peringatan!
                  </div>
                  <div class="modal-body text-dark">
                    Sorry, selain Administrator gak diizinin 🙏🏻
                  </div>
                  <div class="modal-footer border-0 justify-content-center">
                    <button class="btn border border-2 border-dark text-dark" data-bs-dismiss="modal">Baiklah</button>
                  </div>
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
definePageMeta({
  middleware: ['auth']
})
useHead({ title: "Update Peserta — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let prokel = user.user.value.program_keahlian
let role = user.user.value.role
let route = useRoute()
let isLoading = ref(true)
let isLoadingSave = ref(false)
let isSaved = ref(false)
let isUserCreated = ref(false)
let isCreatingUser = ref(false)
let isUpdateUsername = ref(false)
let usernameUpdated = ref(false)
let isFail = ref(false)
let errMessage = ref('')
let student = ref()
let teachers = ref([])
let curr_user = ref([])
let isSuccessResetPassword = ref(false)
let isErrorResetPassword = ref(false)

let form = ref({
  id: '',
  nis: 'loading',
  nisn: 'loading',
  nama: '',
  kelas: '',
  status_rapot: false,
  status_pemetaan_pkl: false,
  walikelas: '',
})

const formReset = ref({
  password: "",
  passwordConfirm: ""
})

let walikelas = ref('')
let new_user_update = ref('')
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function simpanPerubahan() {
  try {
    isLoadingSave.value = true
    isSaved.value = false
    client.autoCancellation(false)
    let data = await client.collection('siswa').update(route.params.id, {
      status_rapot: form.value.status_rapot,
      nis: form.value.nis,
      nisn: form.value.nisn,
      walikelas: form.value.walikelas
    })
    if(data) {
      isLoading.value = false
      isLoadingSave.value = false
      isSaved.value = true
      navigateTo('/peserta')
    }
  } catch(error) {
    isLoading.value = false
    isLoadingSave.value = false
    isSaved.value = false
    isFail.value = true
    errMessage.value = error
  }
}

async function getTeachersByProkelNotAdmin() {
  isLoading.value = true
  let data = await client.collection('teacher_users').getFullList({
    filter: "program_keahlian='"+prokel+"' && role!='admin'"
  })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

async function getStudentById(loading=true) {
  isLoading.value = loading
  client.autoCancellation(false)
  let res_siswa = await client.collection('siswa').getOne(route.params.id, {
    expand: 'program_keahlian'
  })
  if(res_siswa) {
    form.value = res_siswa
    try {
      let res_users = await client.collection('student_users').getList(1,1, {
        filter: "siswa='"+route.params.id+"'"
      })
      if(res_users) {
        isLoading.value = false
        curr_user.value = res_users
        new_user_update.value = curr_user.value.items[0].username
      }
    } catch {
      isLoading.value = false
    }
  }
}

async function buatUserPeserta() {
  let data = {
    "username": form.value.nis,
    "email": `${form.value.nis}@smkn4-tsm.sch.id`,
    "emailVisibility": true,
    "password": "20276063",
    "passwordConfirm": "20276063",
    "program_keahlian": prokel,
    "siswa": route.params.id
  }
  isCreatingUser.value = true
  isUserCreated.value = false
  let res = await client.collection('student_users').create(data)
  if(res) {
    await client.collection('siswa').update(route.params.id, { hasUser: true })
    isCreatingUser.value = false
    isUserCreated.value = true
  }
}

async function updateUsername() {
  isUpdateUsername.value = true
  usernameUpdated.value = false
  client.autoCancellation(false)
  let res = await client.collection('student_users').update(curr_user.value.items[0].id, {
    "username": new_user_update.value
  })
  if(res) {
    isUpdateUsername.value = false
    usernameUpdated.value = true
  }
}

async function getWalikelas() {
  let res = await client.collection('walikelas').getFullList({
    filter: `program_keahlian="${prokel}"`,
    expand: `rombel`
  })
  if(res) {
    walikelas.value = res
  }
}

// TODO: belum selesai. masih 400 err code
async function resetPassword() {
  isSuccessResetPassword.value = false
  isErrorResetPassword.value = false

  let user_id = curr_user.value.items[0].id

  try {
    let res = await client.collection('student_users').update(user_id, formReset.value)

    if(res) {
      console.log('success??')
      isSuccessResetPassword.value = true
    }
  } catch (err) {
    console.error(err)
    isErrorResetPassword.value = true
    isSuccessResetPassword.value = false
  }
}

onMounted(() => {
  getStudentById()
  getWalikelas()
  client.collection('siswa').subscribe('*', function (e) {
    if(e.action == 'update') getStudentById(false)
  }, {});
  client.collection('student_users').subscribe('*', function (e) {
    if(e.action == 'create' || e.action == 'update') getStudentById(false)
  }, {});
})
</script>

<style scoped>
.emoji {
  font-size: 5vw;
}
.border-dash {
  border: 3px solid #4f4f4f;
}
</style>
