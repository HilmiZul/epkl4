<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" col="5" row="1" />
      <span v-else class="h4 quicksand fw-bold text-muted">
        {{ form.kelas }} / <span class="text-dark">{{ form.nama }}</span>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-warning shadow-lg border-2 border-dark">
            <h5 class="">Perhatiin!</h5>
            <ul>
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
            <div class="my-3 form-check form-switch">
              <input v-model="form.status_rapot" :checked="form.status_rapot" class="form-check-input" type="checkbox" id="checkRapor" switch>
              <label class="form-check-label" for="checkRapor">
                Ketuntasan Rapor
              </label>
            </div>
            <div class="mb-3 form-check form-switch">
              <input :checked="form.status_pemetaan_pkl" disabled class="form-check-input" type="checkbox" id="checkPemetaan" switch>
              <label class="form-check-label" for="checkPemetaan">
                Pemetaan PKL
              </label>
            </div>
            <!-- <div v-if="form.status_pemetaan_pkl" class="mb-3 form-check form-switch">
              <input v-model="form.status_acc_pkl" :checked="form.status_acc_pkl" class="form-check-input" type="checkbox" id="checkAcc" switch>
              <label class="form-check-label" for="checkAcc">
                Diterima tempat PKL?
              </label>
            </div> -->
            <button :disabled="isLoadingSave || isLoading" class="btn btn-success mb-2 me-2 border border-2 border-dark">
              <span v-if="isLoadingSave">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/peserta" class="btn btn-danger mb-2 border border-2 border-dark">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil tersimpan!</span>
          </form>
        </div>
        <div class="col-md-6">
          <LoadingPlaceholder v-if="isLoading" col="12" row="2" />
          <div v-else>
            <!-- <div v-if="!form.hasUser" class="mt-3 border-dash p-3">
              Buatkan user login untuk <strong>{{ form.nama }}</strong>?
              <div class="mt-3">
                <button @click="buatUserPeserta" :disabled="isCreatingUser" class="btn btn-success">
                  <span v-if="isCreatingUser">Sedang membuat user</span>
                  <span v-else>Buatkan!</span>
                </button>
              </div>
            </div> -->
            <div v-if="form.hasUser" class="mt-3 border-dash p-3">
              <div v-if="isUserCreated" class="mb-2"><strong>User berhasil dibuat!</strong></div>
              <table class="border-0">
                <tbody>
                  <tr>
                    <td>Username</td>
                    <td>: <span v-if="curr_user" class="fw-bold">{{ curr_user.items[0].username }}</span></td>
                  </tr>
                  <tr>
                    <td>Password</td>
                    <td>: <span class="fst-italic text-muted">NPSN</span></td>
                  </tr>
                </tbody>
              </table>
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
let isFail = ref(false)
let errMessage = ref('')
let student = ref()
let teachers = ref([])
let curr_user = ref([])
let form = ref({
  id: '',
  nama: '',
  kelas: '',
  status_rapot: false,
  status_pemetaan_pkl: false,
})
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function simpanPerubahan() {
  try {
    isLoadingSave.value = true
    isSaved.value = false
    client.autoCancellation(false)
    let data = await client.collection('siswa').update(route.params.id, { status_rapot: form.value.status_rapot })
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

onMounted(() => {
  getStudentById()
  client.collection('siswa').subscribe('*', function (e) {
    if(e.action == 'update') getStudentById()
  }, {});
  client.collection('student_users').subscribe('*', function (e) {
    if(e.action == 'create') getStudentById()
  }, {});
})
</script>

<style scoped>
.emoji {
  font-size: 5vw;
}
.border-dash {
  border: 3px dashed #4f4f4f;
}
</style>
