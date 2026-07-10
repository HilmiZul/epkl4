<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" col="5" row="1" />
      <span v-else class="h4 quicksand fw-bold text-muted">Pembimbing / <span class="text-dark">{{ form.nama }}</span></span>
      <span class="float-end"><nuxt-link to="/pembimbing" class="btn btn-light btn-sm border border-2 border-dark">Kembali</nuxt-link></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div v-if="isFail" class="alert alert-danger p-2">
            Terjadi error: {{ errMessage }}
          </div>
          <form @submit.prevent="updatePembimbingBaru">
            <div v-if="role == 'wakasek'" class="mb-4">
              <label for="program_keahlian">Program Keahlian</label>
              <select v-model="form.program_keahlian" class="form form-select form-select-lg" id="program_keahlian" required>
                <option disabled value="">&#8212;</option>
                <option v-for="p in program_keahlians" :key="p.id" :value="p.id">{{ p.nama }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="username">Username</label>
              <input v-model="form.username" :disabled="isLoading || form.program_keahlian.length < 1"  type="text" id="username" class="form form-control form-control-lg" placeholder="masukkan username" required autofocus>
            </div>
            <div class="my-4">
              <label for="nama">Nama Lengkap dan Gelar</label>
              <input v-model="form.nama" :disabled="isLoading" type="text" id="nama" class="form form-control form-control-lg" placeholder="masukkan nama Guru Pembimbing" required>
            </div>
            <div class="my-4">
              <label for="nip">NIP</label>
              <input v-model="form.nip" :disabled="isLoading" type="text" id="nip" class="form form-control form-control-lg" placeholder="kosongkan jika tidak ada">
            </div>
            <div class="my-4">
              <label for="pangkat_golongan">Pangkat Golongan</label>
              <select v-model="form.pangkat_golongan" :disabled="form.nama.length < 4" id="pangkat_golongan" class="form form-control form-select form-select-lg" required>
                <option disabled value="">—</option>
                <option value="III/a">III/a</option>
                <option value="III/b">III/b</option>
                <option value="III/c">III/c</option>
                <option value="III/d">III/d</option>
                <option value="IV/a">IV/a</option>
                <option value="IV/b">IV/b</option>
                <option value="IV/c">IV/c</option>
                <option value="IV/d">IV/d</option>
                <option value="IV/e">IV/e</option>
                <option value="IX/IX">IX/IX</option>
              </select>
            </div>
            <div class="my-4">
              <label for="kelompok_mapel">Kelompok Mapel</label>
              <select v-model="form.kelompok_mapel" :disabled="form.pangkat_golongan.length < 4" id="kelompok_mapel" class="form form-control form-select form-select-lg" required>
                <option disabled value="">—</option>
                <option value="Guru Kejuruan">Guru Kejuruan</option>
                <option value="Guru Umum">Guru Umum</option>
              </select>
            </div>
            <div class="my-4">
              <label for="role">Role</label>
              <select v-model="form.role" id="role" class="form form-control form-select form-select-lg" required>
                <option disabled value="">—</option>
                <option value="jurusan">Manajemen</option>
                <option value="guru">Guru Pembimbing</option>
              </select>
            </div>
            <div class="my-4 alert alert-secondary">
              <label for="jjm">Jumlah Jam Mengajar (minimal 2 JP)</label>
              <input @input="jumlahPesertaDidik" v-model="form.jjm" :disabled="form.kelompok_mapel.length < 4" type="number" id="jjm" min="2" max="40" class="form form-control form-control-lg" required>
              <div class="mt-3">
                Membimbing <span class="fw-bold">{{ form.konversi_jjm_ke_jumlah_siswa }}</span> peserta didik
              </div>
            </div>
            <button :disabled="isSending || isLoading || form.username == '' || form.email == '' || form.password == '' || form.nama == '' || form.role == ''" class="btn btn-success me-2 border border-2 border-dark">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pembimbing" class="btn btn-light border border-2 border-dark">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil tersimpan!</span>
          </form>
        </div>
        <!-- tutup .col-md-5 -->

        <div class="col-md-6">
          <div class="alert">
            <div class="fs-5 fw-bold mb-3"><i class="bi bi-lock-fill"></i> Reset Password</div>

            <div v-if="isSuccessReset" class="alert alert-success">Password berhasil direset!</div>
            <div v-if="isResetError" class="alert alert-danger">Password tidak sama!</div>

            <form @submit.prevent="resetPassword">
              <div class="mb-4">
                <label for="password">Password (minimal 8 karakter)</label>
                <input v-model="formReset.password" type="password" id="password" class="form form-control form-control-lg" placeholder="masukkan password min.8 karakter" required>
              </div>
              <div class="my-4">
                <label for="passwordConfirm">Konfirmasi Password</label>
                <input v-model="formReset.passwordConfirm" :disabled="formReset.password.length < 8" type="password" id="passwordConfirm" class="form form-control form-control-lg" placeholder="ketik ulang password" required>
              </div>

              <button :disabled="isSendingReset || formReset.password == '' || formReset.passwordConfirm.length < 8" class="btn btn-success me-2 border border-2 border-dark">
                <span v-if="!isSendingReset">Simpan</span>
                <span v-else>Sedang menyimpan</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <!-- tutup .row -->
    </div>
  </div>
</template>

<script setup>
import { useJjmToNumStudent } from '../../composables/useJjmToNumStudent'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Update Pembimbing — e-PKL / SMKN 4 Tasikmalaya'})

let user = usePocketBaseUser()
let role = user?.user.value.role

let client = usePocketBaseClient()
let route = useRoute()
let prokel = user.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isSendingReset = ref(false)
let isLoading = ref(true)
let isFail = ref(false)
let errMessage = ref('')
let isSuccessReset = ref(false)
let isResetError = ref(false)

let form = ref({
  username: 'loading',
  nama: 'loading',
  nip: 'loading',
  pangkat_golongan: 'loading',
  kelompok_mapel: 'loading',
  jjm: '2',
  konversi_jjm_ke_jumlah_siswa: 0,
  program_keahlian: '',
  role: 'loading',
})

let formReset = ref({
  password: "",
  passwordConfirm: "",
})

let program_keahlians = ref([])

let jumlahSiswa = ref(0)

if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin' && user?.user.value.role != 'wakasek') navigateTo('/404')

async function updatePembimbingBaru() {
  try {
    isSending.value = true
    isSaved.value = false
    form.value.username = form.value.username.toLowerCase()
    let data = await client.collection('teacher_users').update(route.params.id, form.value)
    if(data) {
      isSending.value = false
      isSaved.value = true
      navigateTo('/pembimbing')
    }
  } catch(error) {
    isSending.value = false
    isSaved.value = false
    isFail.value = true
    errMessage.value = error
  }
}

async function getPembimbingByIdAndStudentByProkel(loading=true) {
  isLoading.value = loading
  let data = await client.collection('teacher_users').getOne(route.params.id, {
    expand: `program_keahlian`
  })

  if(data) {
    isLoading.value = false
    form.value = data

    let res_students = await client.collection('siswa').getList(1, 1)

    if(res_students) {
      jumlahSiswa.value = res_students.totalItems
    }
  }
}

async function getProkel() {
  let res = await client.collection('program_keahlian').getFullList()
  if(res) {
    program_keahlians.value = res
  }
}

async function resetPassword() {
  isSendingReset.value = true
  isSuccessReset.value = false
  isResetError.value = false

  try {
    let res = await client.collection('teacher_users').update(route.params.id, formReset.value)

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

const jumlahPesertaDidik = () => {
  let result = useJjmToNumStudent(jumlahSiswa.value, form.value.jjm)
  form.value.konversi_jjm_ke_jumlah_siswa = result.result
}

onMounted(() => {
  getProkel()
  getPembimbingByIdAndStudentByProkel()
  client.collection('teacher_users').subscribe("*", function (e) {
    if(e.action == 'update') getPembimbingByIdAndStudentByProkel(false)
  }, {});
})
</script>
