<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana">Peserta Didik</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/import" class="btn btn-success btn-sm">Impor dari .csv</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
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
            <button class="btn btn-light btn-sm ms-2" @click="()=>{getStudents(); opsiKelas=''}" :disabled="!opsiKelas">reset</button>
          </div>
        </div>
        <div class="col-md-4">
          <div class="my-3">
            <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control form-control-md" placeholder="Cari berdasarkan nama..." />
          </div>
        </div>
      </div>
      <div v-if="isLoading"><Loading /></div>
      <div v-else class="table-responsive">
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
            <tr v-if="students.length < 1" class="text-center my-5">
              <td colspan="6">Data tidak ada.</td>
            </tr>
            <tr v-for="(student,i) in students" :key="student.id">
              <td>{{ i+1 }}. </td>
              <td>
                <nuxt-link :to="`/peserta/${student.id}`" class="link me-2">{{ student.nama }}</nuxt-link>
              </td>
              <td>{{ student.kelas }}</td>
              <td>
                <span v-if="student.status_rapot" class="badge bg-success">Tuntas</span>
                <span v-else class="badge bg-danger">Belum tuntas</span>
              </td>
              <td>
                <span v-if="student.status_pemetaan_pkl" class="badge bg-success">Terpetakan</span>
                <span v-else class="badge bg-danger">Belum</span>
              </td>
              <td>
                <span v-if="student.status_acc_pkl" class="badge bg-success">
                  <nuxt-link to="#" target="_blank" class="text-white">Diterima <i class="bi-box-arrow-up-right"></i></nuxt-link>
                </span>
                <span v-else class="badge bg-danger">Belum/Tidak diterima</span>
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
      sort: 'kelas, status_rapot, status_pemetaan_pkl, -status_acc_pkl',
    })
  if(data) {
    isLoading.value = false
    students.value = data
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
</script>

