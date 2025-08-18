<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand"><i class="bi bi-person-fill"></i> Peserta Didik</span>
      <span class="float-end">
        <!-- <button v-if="role == 'admin' || role == 'jurusan'" data-bs-toggle="modal" data-bs-target="#buat-akun-peserta" class="btn btn-info btn-sm me-2"><i class="bi bi-person-plus"></i> Buat akun</button> -->
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/import" class="btn btn-success btn-sm"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link>
      </span>
      <div class="modal" id="buat-akun-peserta" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header rounded-0 h4 bg-info quicksand border-bottom border-2 border-dark">
              Buat akun Peserta
            </div>
            <div class="modal-body">
              Akun ini akan digunakan Peserta untuk login ke aplikasi. <br>
              Tekan tombol <strong>Buatkan</strong> untuk membuat akun otomatis.
            </div>
            <div class="modal-footer">
              <span v-if="isCreated" class="fst-italic text-muted">Berhasil dibuat!</span>
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
          <div class="my-3 mt-0">
            <input type="search" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan nama / kelas" />
          </div>
        </div>
        <div class="col align-content-center">
          <div class="mb-3 text-grey float-end">{{ studentsFiltered.length }} peserta</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->
      <div class="table-responsive">
        <table class="table table-hover table-striped table-borderless">
          <thead>
            <tr>
              <th width="2%">#</th>
              <th>Nama</th>
              <th>Kelas</th>
              <th>Rapor</th>
              <th>Pemetaan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="text-center my-5">
              <td colspan="6"><Loading /></td>
            </tr>
            <tr v-else-if="studentsFiltered.length < 1" class="text-center my-5">
              <td colspan="6">Data tidak ditemukan.</td>
            </tr>
            <tr v-for="(student,i) in studentsFiltered" :key="student.id">
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
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let keyword = ref('')
let opsiKelas = ref('')
let isCreatingUser = ref(false)
let isCreated = ref(false)

onMounted(() => getStudents())

const getStudents = async () => {
  isLoading.value = true
  client.autoCancellation(false)
  const data = await client
    .collection('siswa')
    .getFullList({
      filter: "program_keahlian='"+prokel+"'",
      sort: 'kelas, status_rapot, status_pemetaan_pkl',
    })
  if(data) {
    isLoading.value = false
    students.value = data
  }
}

const buatAkunPeserta = async () => {
  let s = students.value
  let tempUsers = []
  isCreatingUser.value = true
  isCreated.value = false
  try {
    for(let i=0; i<s.length; i++) {
      client.autoCancellation(false)
      await client.collection('users_siswa').create({
        "username": s[i].nis,
        "email": "student@smkn4-tsm.sch.id",
        "emailVisibility": true,
        "password": "20276063",
        "passwordConfirm": "20276063",
        "program_keahlian": prokel,
        "siswa": s[i].id
      })
    }
    // await Promise.all(
    //   tempUsers.map(data => {
    //     client.collection('users_siswa').create(data, {'$autoCancel': false })
    //   })
    // )
    // console.log(tempUsers)
    // for (let item of tempUsers) {
    //   await client.collection('users_user').create(item)
    // }
    isCreated.value = true
    isCreatingUser.value = false
  } catch(error) {
    isCreated.value = true
    isCreatingUser.value = false
    console.error("Terjadi kesalahan: ",error)
  }
}

const filterByKelas = async () => {
  isLoading.value = true
  if(opsiKelas.value.length > 0) {
    client.autoCancellation(false)
    const data = await client
      .collection('siswa')
      .getFullList({
        filter: 'kelas="'+opsiKelas.value+'"',
        sort: 'kelas',
      })
    if(data) {
      isLoading.value = false
      students.value = data
    }
  } else {
    getStudents()
  }
}

const searchByKeyword = async () => {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client
    .collection('siswa')
    .getFullList({
      filter: "nama~'"+keyword.value+"' && program_keahlian='"+prokel+"'"
    })
  if(data) {
    isLoading.value = false
    students.value = data
  }
}

const studentsFiltered = computed(() => {
  return students.value.filter((i) => {
    return (
      i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.kelas.toLowerCase().includes(keyword.value.toLowerCase())
      // i.expand.pembimbing.nama.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})
</script>

