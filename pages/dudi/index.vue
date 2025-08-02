<template>
  <div>
    <div class="card shadow-lg">
      <div class="card-header">
        <span class="h4">DU/DI</span>
      </div>
      <div class="card-body">
        <div class="my-3 col-lg-3 float-end">
          <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control form-control-md" placeholder="Cari berdasarkan nama..." />
        </div>
        <div class="my-3">
          <span class="small me-2"><i class="bi bi-funnel-fill"></i></span>
          <select @change="filterByWilayah" v-model="opsiWilayah" class="form form-control-select form-control-sm">
            <option disabled value="">Filter wilayah</option>
            <option value="dalam">Dalam kota</option>
            <option value="luar">Luar kota</option>
          </select>
          <button class="btn btn-light btn-sm ms-2" @click="()=>{getCompanies(); opsiWilayah=''}" :disabled="!opsiWilayah">reset filter</button>
        </div>
        <div v-if="isLoading">
          <Loading />
        </div>
        <table v-else class="table table-hover table-striped">
          <thead>
            <tr>
              <th width="2%">#</th>
              <th width="20%">Nama</th>
              <th width="50%">Alamat</th>
              <th width="8%">Terisi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(company, i) in companies" :key="i">
              <td>{{ i + 1 }} </td>
              <td>{{ company.nama }} </td>
              <td>{{ company.alamat }} </td>
              <td>{{ company.terisi }} dari {{ company.jumlah_kuota }}</td>
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
let companies = ref([])
let isLoading = ref(true)
let keyword = ref('')
let prokel = user.user.value.program_keahlian
let opsiWilayah = ref('')

onMounted(() => {
  getCompanies()
})

async function searchByKeyword() {
  isLoading.value = true
  if(keyword.value.length > 0) {
    let data = await client
      .collection('dudi')
      .getFullList({
        filter: "nama~'"+keyword.value+"' && program_keahlian='"+prokel+"'"
      })
    if(data) {
      isLoading.value = false
      companies.value = data
    }
  } else {
    getCompanies()
  }
}

async function getCompanies() {
  isLoading.value = true
  try {
    let response = await client.collection('dudi').getFullList({
      filter: 'program_keahlian = "' + user.user.value.program_keahlian + '"',
      sort: '-wilayah'
    })
    if (response) {
      companies.value = response
    }
    isLoading.value = false
  } catch (error) {

  }
}

async function filterByWilayah() {
  isLoading.value = true
  if(opsiWilayah.value.length > 0) {
    const data = await client
      .collection('dudi')
      .getFullList({
        filter: "wilayah='"+opsiWilayah.value+"' && program_keahlian='"+prokel+"'",
        sort: 'nama',
      })
    if(data) {
      isLoading.value = false
      companies.value = data
    }
  } else {
    getStudents()
  }
}
</script>

<style scoped>
table {
  font-size: small;
}
</style>
