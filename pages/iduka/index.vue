<template>
  <div>
    <div class="card">
      <div class="card-header">
        <span class="h4 public-sans text-grey"><i class="bi bi-buildings-fill"></i> IDUKA</span>
        <span class="float-end">
          <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/tambah" class="btn btn-info btn-sm me-2"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
          <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/import" class="btn btn-success btn-sm"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link>
        </span>
      </div>
      <div class="card-body small">
        <div class="row">
          <div class="col-lg-6">
            <div class="my-3 mt-0">
              <input type="search" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan nama IDUKA / wilayah..." />
            </div>
          </div>
          <div class="col align-content-center">
            <div class="mb-3 text-grey float-end">{{ idukaFiltered.length }} IDUKA</div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-hover table-striped table-bordered">
            <thead>
              <tr>
                <th width="2%">#</th>
                <th>Nama</th>
                <th>Wilayah</th>
                <th>Terisi</th>
                <th>Hapus</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading" class="text-center my-5">
                <td colspan="5"><Loading /></td>
              </tr>
              <tr v-else-if="idukaFiltered.length < 1" class="text-center my-5">
                <td colspan="5">Data tidak ditemukan</td>
              </tr>
              <tr v-for="(company, i) in idukaFiltered" :key="i">
                <td>{{ i + 1 }}.</td>
                <td><nuxt-link :to="`/iduka/${company.id}`" class="link">{{ company.nama }}</nuxt-link></td>
                <td>{{ company.wilayah.charAt(0).toUpperCase() + company.wilayah.slice(1) }} kota </td>
                <td>
                  <span v-if="company.terisi < company.jumlah_kuota">{{ company.terisi }} dari {{ company.jumlah_kuota }}</span>
                  <span v-else class="badge bg-danger">Penuh</span>
                </td>
                <td>
                  <button v-if="company.terisi < 1" class="btn btn-danger btn-sm" data-bs-toggle="modal" :data-bs-target="`#iduka-${company.id}`">hapus</button>
                  <button v-else class="btn btn-dark btn-sm" disabled>Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="idukaFiltered.length > 0">
      <div v-for="company in idukaFiltered" :key="company.id">
        <div class="modal" :id="`iduka-${company.id}`">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
              <div class="modal-header rounded-0 h4 bg-danger text-white public-sans">
                Peringatan!
              </div>
              <div class="modal-body text-dark small">
                Yakin nih mau hapus <span class="romana">{{ company.nama }}</span> dari daftar IDUKA?
              </div>
              <div class="modal-footer">
                <button v-if="!isDeleted" class="btn btn-danger btn-sm" data-bs-dismiss="modal" @click="hapusData(company.id)" :disabled="isSending">
                  <span v-if="isSending">Sedang menghapus</span>
                  <span v-else>Hapus</span>
                </button>
                <span v-else class="me-2"><em>Berhasil dihapus!</em></span>
                <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-light btn-sm" data-bs-dismiss="modal">Gajadi</button>
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
  middleware: 'auth'
})
useHead({ title: "IDUKA — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let role = user?.user.value.role
let companies = ref([])
let isLoading = ref(true)
let isSending = ref(false)
let isDeleted = ref(false)
let keyword = ref('')
let prokel = user.user.value.program_keahlian
let opsiWilayah = ref('')

async function hapusData(id) {
  await client.collection('iduka').delete(id)
}

async function searchByKeyword() {
  isLoading.value = true
  if(keyword.value.length > 0) {
    client.autoCancellation(false)
    let data = await client
      .collection('iduka')
      .getFullList({
        filter: "nama~'"+keyword.value+"' && program_keahlian='"+prokel+"'",
        expand: "pembimbing_sekolah",
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
  let data = await client.collection('iduka').getFullList({
    filter: 'program_keahlian = "' + user.user.value.program_keahlian + '"',
    expand: "program_keahlian, pembimbing_sekolah",
    sort: 'terisi, -wilayah'
  })
  if (data) {
    isLoading.value = false
    companies.value = data
    // console.log(companies.value[0].expand.pembimbing_sekolah.nama)
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
        expand: "pembimbing_sekolah",
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

const idukaFiltered = computed(() => {
  return companies.value.filter((i) => {
    return (
      i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.wilayah.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

onMounted(() => {
  getCompanies()
  client.collection('iduka').subscribe('*', function(e) {
    if(e.action == 'delete') getCompanies()
  },{})
})
</script>

<style scoped>
table {
  font-size: small;
}
</style>
