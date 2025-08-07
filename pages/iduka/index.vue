<template>
  <div>
    <div class="card">
      <div class="card-header">
        <span class="h4 romana text-grey"><i class="bi bi-buildings-fill"></i> IDUKA</span>
        <span class="float-end">
          <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/tambah" class="btn btn-dark btn-sm me-2"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
          <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/import" class="btn btn-success btn-sm"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link>
        </span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-3">
            <div class="my-2">
              <select @change="filterByWilayah" v-model="opsiWilayah" class="form form-control form-select">
                <option disabled value="">🌏 Wilayah</option>
                <option value="">Semua</option>
                <option value="dalam">Dalam kota</option>
                <option value="luar">Luar kota</option>
              </select>
              <!-- <button v-if="opsiWilayah" class="btn btn-light btn-sm ms-2" @click="()=>{getCompanies(); opsiWilayah=''}">reset</button> -->
            </div>
          </div>
          <div class="col">
            <div class="my-2 mb-4">
              <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan nama..." />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="mb-4 fs-6 text-center text-muted">— {{ companies.length }} IDUKA —</div>
          </div>
        </div>
        <div v-if="isLoading"><Loading /></div>
        <div v-else class="table-responsive">
          <table class="table table-hover table-striped">
            <thead>
              <tr>
                <th width="1%">#</th>
                <th width="30%">Nama</th>
                <th width="10%">Wilayah</th>
                <th width="3%">Terisi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="companies.length < 1" class="text-center my-5">
                <td colspan="4">Data tidak ditemukan</td>
              </tr>
              <tr v-for="(company, i) in companies" :key="i">
                <td>{{ i + 1 }}.</td>
                <td><nuxt-link :to="`/iduka/${company.id}`" class="link">{{ company.nama }}</nuxt-link></td>
                <td>{{ company.wilayah.charAt(0).toUpperCase() + company.wilayah.slice(1) }} kota </td>
                <td>
                  <span v-if="company.terisi < company.jumlah_kuota">{{ company.terisi }} dari {{ company.jumlah_kuota }}</span>
                  <span v-else class="badge bg-danger">Penuh</span>
                </td>
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
useHead({ title: "IDUKA — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let role = user?.user.value.role
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
      .collection('iduka')
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
    let response = await client.collection('iduka').getFullList({
      filter: 'program_keahlian = "' + user.user.value.program_keahlian + '"',
      sort: 'terisi, -wilayah'
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
      .collection('iduka')
      .getFullList({
        filter: "wilayah='"+opsiWilayah.value+"' && program_keahlian='"+prokel+"'",
        sort: 'nama',
      })
    if(data) {
      isLoading.value = false
      companies.value = data
    }
  } else {
    getCompanies()
  }
}
</script>

<style scoped>
table {
  font-size: small;
}
</style>
