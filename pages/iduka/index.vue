<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand"><i class="bi bi-buildings-fill"></i> IDUKA</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/tambah" class="btn btn-info btn-sm me-2"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/import" class="btn btn-success btn-sm"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link>
      </span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getCompanies">
            <div class="my-3 mt-0 input-group">
              <input type="search" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari nama IDUKA" />
              <button class="btn btn-info ms-2">Cari</button>
            </div>
          </form>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end">{{ companies.totalItems }} IDUKA</div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-hover table-striped table-borderless">
              <thead>
                <tr>
                  <th width="2%">#</th>
                  <th>Nama</th>
                  <th>Wilayah</th>
                  <th width="8%">Terisi</th>
                  <th>Pembimbing</th>
                  <th width="5%">Hapus</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading" class="text-center my-5">
                  <td colspan="6">
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                  </td>
                </tr>
                <tr v-else-if="companies && companies.totalItems < 1" class="text-center my-5">
                  <td colspan="6">
                    <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                    <div class="pb-3">Data tidak ditemukan</div>
                  </td>
                </tr>
                <tr v-else v-for="(company, i) in companies.items" :key="i">
                  <td>{{ i + 1 }}.</td>
                  <td class="fw-bold">
                    <nuxt-link :to="`/iduka/${company.id}`" class="link">{{ company.nama }}</nuxt-link>
                    <span v-if="company.catatan" data-bs-toggle="modal" :data-bs-target="`#catatan-${company.id}`" class="hand-cursor ms-2 text-warning"><i class="bi bi-stickies"></i></span>
                  </td>
                  <td class="smallest">{{ company.wilayah.charAt(0).toUpperCase() + company.wilayah.slice(1) }} kota </td>
                  <td class="smallest">
                    <span v-if="company.terisi < company.jumlah_kuota">{{ company.terisi }} / {{ company.jumlah_kuota }}</span>
                    <span v-else class="badge bg-danger">Penuh</span>
                  </td>
                  <td class="smallest">{{ company.expand.pembimbing_sekolah?.nama }} </td>
                  <td class="smallest">
                    <button v-if="company.terisi < 1" class="btn btn-danger btn-sm" data-bs-toggle="modal" :data-bs-target="`#iduka-${company.id}`"><i class="bi bi-trash3"></i></button>
                    <button v-else class="btn btn-dark btn-sm" disabled><i class="bi bi-trash3"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-12 mt-2">
        <loading-placeholder v-if="isLoading" col="3" row="1" />
        <span v-else>
          <div v-if="isMovingPage" class="text-muted small mb-2 fst-italic">sedang berpindah halaman</div>
          <div v-else>
            <div v-if="companies || isMovingPage" class="text-muted small mb-2">
              <span v-if="companies.totalItems">Halaman {{ companies.page }} dari {{ companies.totalPages }}</span>
            </div>
          </div>
          <button :disabled="isMovingPage || companies.page < 2" @click="pagination(companies.page - 1, false)" class="btn btn-info btn-sm me-2">
            <i class="bi bi-arrow-left"></i> sebelumnya
          </button>
          <button :disabled="isMovingPage || companies.page >= companies.totalPages" @click="pagination(companies.page + 1, false)" class="btn btn-info btn-sm">
            lanjut <i class="bi bi-arrow-right"></i>
          </button>
        </span>
      </div>
    </div>
  </div>
  <div v-if="companies && companies.totalItems > 0">
    <div v-for="company in companies.items" :key="company.id">
      <!-- modal: catatan jika available -->
      <div v-if="company.catatan" class="modal" :id="`catatan-${company.id}`" aria-hidden="true" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header rounded-0 bg-warning quicksand">
              <div class="fs-4">Catatan</div>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-muted">
              {{ company.catatan }}
            </div>
          </div>
        </div>
      </div>

      <!-- modal: hapus iduka -->
      <div class="modal" :id="`iduka-${company.id}`" aria-hidden="true" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header rounded-0 h4 bg-danger text-white quicksand">
              Peringatan!
            </div>
            <div class="modal-body text-dark">
              Yakin mau hapus <strong>{{ company.nama }}</strong> dari daftar IDUKA?
            </div>
            <div class="modal-footer">
              <button v-if="!isDeleted" class="btn btn-danger" data-bs-dismiss="modal" @click="hapusData(company.id)" :disabled="isSending">
                <span v-if="isSending">Sedang menghapus</span>
                <span v-else>Hapus</span>
              </button>
              <span v-else class="me-2"><em>Berhasil dihapus!</em></span>
              <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-light" data-bs-dismiss="modal">Gajadi</button>
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
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')
let perPage = 20
let isMovingPage = ref(false)

async function hapusData(id) {
  client.autoCancellation(false)
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
  let searchFilter = ''
  if(keyword.value != '') searchFilter = " && nama~'"+keyword.value+"'"
  let data = await client.collection('iduka').getList(1, perPage, {
    filter: 'program_keahlian = "' + user.user.value.program_keahlian + '"' + searchFilter,
    expand: "program_keahlian, pembimbing_sekolah",
    sort: 'terisi, -wilayah, nama'
  })
  if (data) {
    isLoading.value = false
    companies.value = data
    // console.log(companies.value[0].expand.pembimbing_sekolah.nama)
  }
}

async function pagination(page, loading=true) {
  isLoading.value = loading
  isMovingPage.value = true
  let data = await client.collection('iduka').getList(page, perPage, {
    filter: 'program_keahlian = "' + user.user.value.program_keahlian + '"',
    expand: "program_keahlian, pembimbing_sekolah",
    sort: 'terisi, -wilayah, nama'
  })
  if (data) {
    companies.value = data
    isLoading.value = false
    isMovingPage.value = false
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

// const companies = computed(() => {
//   return companies.value.items.filter((i) => {
//     return (
//       i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
//       i.wilayah.toLowerCase().includes(keyword.value.toLowerCase())
//     )
//   })
// })

onMounted(() => {
  getCompanies()
  client.autoCancellation(false)
  client.collection('iduka').subscribe('*', function(e) {
    if(e.action == 'delete') getCompanies()
  },{})
})
</script>

