<template>
  <div class="card">
    <div class="card-header bg-danger">
      <span class="h4 public-sans"><i class="bi bi-person-fill"></i> Peserta Didik</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/import" class="btn btn-success btn-sm"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link>
      </span>
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
        <table class="table table-hover table-striped table-bordered">
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
              <td>
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

