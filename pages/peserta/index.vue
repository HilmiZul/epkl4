<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4">Peserta Didik</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/import" class="btn btn-success btn-sm">Import from .csv</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <div class="my-3 col-lg-3 float-end">
        <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control form-control-md" placeholder="Cari berdasarkan nama..." />
      </div>
      <div class="my-3">
        <span class="small me-2"><i class="bi bi-funnel-fill"></i></span>
        <select @change="filterByKelas" v-model="opsiKelas" class="form form-control-select form-control-sm">
          <option disabled value="">Filter kelas</option>
          <option value="">Semua</option>
          <option value="PPLG-1">PPLG-1</option>
          <option value="PPLG-2">PPLG-2</option>
          <option value="PPLG-3">PPLG-3</option>
          <option value="PPLG-4">PPLG-4</option>
        </select>
        <button class="btn btn-light btn-sm ms-2" @click="()=>{getStudents(); opsiKelas=''}" :disabled="!opsiKelas">reset filter</button>
      </div>
      <div v-if="isLoading"><Loading /></div>
      <div v-else class="table-responsive my-4">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th width="2%">#</th>
              <th>Nama</th>
              <th>Kelas</th>
              <th>Ketuntasan Rapor</th>
              <th>Pemetaan PKL</th>
              <th>Acc. PKL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student,i) in students" :key="student.id">
              <td>{{ i+1 }}. </td>
              <td>{{ student.nama }}</td>
              <td>{{ student.kelas }}</td>
              <td>
                <span v-if="student.status_rapot" class="badge bg-success">Tuntas</span>
                <span v-else class="bg-danger">Belum tuntas</span>
              </td>
              <td>
                <span v-if="student.status_pemetaan_pkl" class="badge bg-success">Terpetakan</span>
                <span v-else class="badge bg-danger">Belum</span>
              </td>
              <td>
                <span v-if="student.status_acc_pkl" class="badge bg-success">Diterima</span>
                <span v-else class="badge bg-danger">Tidak diterima</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let students = ref([])
let isLoading = ref(true)
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let keyword = ref('')
let opsiKelas = ref('')

onMounted(() => getStudents())

const getStudents = async () => {
  isLoading.value = true
  client.autoCancellation(false)
  const data = await client
    .collection('siswa')
    .getFullList({
      filter: 'program_keahlian = "'+user.user.value.program_keahlian+'"',
      sort: 'kelas, -status_rapot, -status_pemetaan_pkl, -status_acc_pkl',
    })
  if(data) {
    isLoading.value = false
    students.value = data
  }
}

const filterByKelas = async () => {
  isLoading.value = true
  if(opsiKelas.value.length > 0) {
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
</script>

<style scoped>
table {
  font-size: small;
}
.table-responsive {
  height: 570px;
  overflow-x: hidden;
  overflow-y: auto;
}
.table-responsive th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}
</style>
