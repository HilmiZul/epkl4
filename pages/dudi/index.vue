<template>
  <div>
    <div class="card shadow-lg">
      <div class="card-header">
        <span class="h4 romana text-grey"><i class="bi bi-buildings-fill"></i> DU/DI</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-2">
            <div class="my-3">
              <select @change="filterByWilayah" v-model="opsiWilayah" class="form form-control form-select">
                <option disabled value="">🌏 Filter wilayah</option>
                <option value="dalam">Dalam kota</option>
                <option value="luar">Luar kota</option>
              </select>
              <button v-if="opsiWilayah" class="btn btn-light btn-sm ms-2" @click="()=>{getCompanies(); opsiWilayah=''}">reset</button>
            </div>
          </div>
          <div class="col-4">
            <div class="my-3">
              <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan nama..." />
            </div>
          </div>
        </div>
        <div v-if="isLoading"><Loading /></div>
        <div v-else class="table-responsive">
          <table class="table table-hover table-striped">
            <thead>
              <tr>
                <th width="2%">#</th>
                <th width="20%">Nama</th>
                <th width="50%">Alamat</th>
                <th width="8%">Terisi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="companies.length < 1" class="text-center my-5">
                <td colspan="4">Data tidak ditemukan</td>
              </tr>
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
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
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
    client.autoCancellation(false)
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
    client.autoCancellation(false)
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
    client.autoCancellation(false)
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
