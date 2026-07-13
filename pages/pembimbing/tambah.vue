<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold text-muted">Pembimbing / <span class="text-dark">Tambah baru</span></span>
      <span class="float-end"><nuxt-link to="/pembimbing" class="btn btn-light btn-sm border border-2 border-dark">Kembali</nuxt-link></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div v-if="isFail" class="alert alert-danger p-2">
            Terjadi error: {{ errMessage }}
          </div>
          <form @submit.prevent="buatPembimbingBaru">
            <div v-if="role == 'wakasek'" class="mb-4">
              <label for="program_keahlian">Program Keahlian</label>
              <select v-model="form.program_keahlian" class="form form-select form-select-lg" id="program_keahlian" required>
                <option disabled value="">&#8212;</option>
                <option v-for="p in program_keahlians" :key="p.id" :value="p.id">{{ p.nama }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="username">Username</label>
              <input v-model="form.username" type="text" id="username" class="form form-control form-control-lg" placeholder="masukkan username" required autofocus>
            </div>
            <div class="my-4">
              <label for="email">Email</label>
              <input v-model="form.email" :disabled="form.username.length < 3" type="email" id="email" class="form form-control form-control-lg" placeholder="masukkan email (sekolah)" required>
            </div>
            <div class="my-4">
              <label for="password">Password</label>
              <input v-model="form.password" :disabled="form.email.length < 10" type="password" id="password" class="form form-control form-control-lg" placeholder="masukkan password min.8 karakter" required>
            </div>
            <div class="my-4">
              <label for="nama">Nama Lengkap dan Gelar</label>
              <input v-model="form.nama" :disabled="form.password.length < 8" type="text" id="nama" class="form form-control form-control-lg" placeholder="masukkan nama Guru Pembimbing" required>
            </div>
            <div class="my-4">
              <label for="nip">NIP</label>
              <input v-model="form.nip" :disabled="form.nama.length < 4" type="text" id="nip" class="form form-control form-control-lg" placeholder="kosongkan jika tidak ada">
            </div>
            <div class="my-4">
              <label for="pangkat_golongan">Pangkat Golongan</label>
              <select v-model="form.pangkat_golongan" :disabled="form.nip.length < 4" id="pangkat_golongan" class="form form-control form-select form-select-lg" required>
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
              <select v-model="form.role" :disabled="form.kelompok_mapel.length < 1" id="role" class="form form-control form-select form-select-lg" required>
                <option disabled value="">—</option>
                <option value="jurusan">Manajemen</option>
                <option value="guru">Guru Pembimbing</option>
              </select>
            </div>
            <div class="my-4 alert alert-secondary">
              <label for="jjm">Jumlah Jam Mengajar (minimal 2 JP)</label>
              <input @input="jumlahPesertaDidik" v-model="form.jjm" :disabled="form.role.length < 1" type="number" id="jjm" min="2" max="40" class="form form-control form-control-lg" required>
              <div class="mt-3 fw-bold">Hasil Konversi:</div>
              Membimbing <span class="fw-bold">{{ form.konversi_jjm_ke_jumlah_siswa }}</span> peserta didik
            </div>
            <button :disabled="isSending || form.username.length < 3 || form.email.length < 10 || form.password.length < 8 || form.nama.length < 4 || form.role.length < 4" class="btn btn-success me-2 border border-2 border-dark me-3">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pembimbing" class="link">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil tersimpan!</span>
          </form>
        </div>
        <div class="col-md-6">
          <div class="alert alert-secondary border-5 border-dark">
            <ul class="mb-0">
              <li>Guru pembimbing adalah Guru yang mengajar pada tingkat XII</li>
              <li>Guru pembimbing termasuk Guru kejuruan</li>
              <li>Guru pembimbing akan dipetakan saat pembuatan daftar IDUKA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Tambah Pembimbing — e-PKL / SMKN 4 Tasikmalaya'})

let user = usePocketBaseUser()
let role = user?.user.value.role 

let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let isFail = ref(false)
let errMessage = ref('')
let form = ref({
  username: '',
  email: '',
  emailVisibility: true,
  password: '',
  passwordConfirm: '',
  nama: '',
  role: '',
  program_keahlian: '',
  nip: '',
  pangkat_golongan: '',
  kelompok_mapel: '',
  jjm: '2',
  konversi_jjm_ke_jumlah_siswa: 0,
})

let program_keahlians = ref([])

let jumlahSiswa = ref(0)

if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin' && user?.user.value.role != 'wakasek') navigateTo('/404')

async function buatPembimbingBaru() {
  try {
    isSending.value = true
    isSaved.value = false

    if(role == 'wakasek') {
      form.value.program_keahlian = form.value.program_keahlian.id
    } else if(role == 'jurusan') {
      form.value.program_keahlian = user.user.value.program_keahlian
    }

    form.value.username = form.value.username.toLowerCase()
    form.value.passwordConfirm = form.value.password
    let data = await client.collection('teacher_users').create(form.value)
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

async function getProkelByIdAndStudentByProkel(loading=true) {
  isLoading.value = loading
  let data = await client.collection('program_keahlian').getFullList()

  if(data) {
    isLoading.value = false
    // form.value.program_keahlian = data.nama
    program_keahlians.value = data

    let res_students = await client.collection('siswa').getList(1, 1)

    if(res_students) {
      jumlahSiswa.value = res_students.totalItems
    }
  }
}

const jumlahPesertaDidik = () => {
  let result = useJjmToNumStudent(jumlahSiswa.value, form.value.jjm)
  form.value.konversi_jjm_ke_jumlah_siswa = result.result
}

onMounted(() => {
  getProkelByIdAndStudentByProkel()
})
</script>
