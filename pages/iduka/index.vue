<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold"><i class="bi bi-buildings-fill"></i> IDUKA</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/tambah" class="btn btn-dark btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
        <!-- <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/import" class="btn btn-success btn-sm ms-2 border border-2 border-dark"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link> -->
      </span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getCompanies">
            <div class="my-3 mt-0 input-group">
              <input type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="Cari nama IDUKA" />
              <button class="btn btn-dark ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>
        <div v-if="role == 'admin' || role == 'jurusan'" class="col-lg-3">
          <div class="my-3 mt-0">
            <select v-model="selectedArchive" @change="getCompanies" class="form form-select form-select-lg">
              <option value="semua">Semua</option>
              <option value="arsip">Arsip</option>
              <option value="hide">Sembunyikan Arsip</option>
            </select>
          </div>
        </div>
        <div v-if="role == 'tu' || role == 'wakasek'" class="col-lg-3">
          <div class="my-3 mt-0">
            <select v-model="selectedProkel" @change="getCompanies" class="form form-select form-select-lg">
              <option value="">Semua Jurusan</option>
              <option v-for="p in opsiProkel" :key="p.id" :value="p.id">{{ p.nama }}</option>
            </select>
          </div>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <span v-else>
            <div v-if="arsip" class="mb-3 ms-1 bg-dark float-end badge">{{ arsip }} Arsip</div>
            <div class="mb-3 text-grey float-end badge">{{ companies.totalItems }} IDUKA</div>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div v-if="isLoading" class="text-center my-5">
            <LoadingPlaceholder :col="12" :row="5" />
          </div>

          <div v-else-if="companies && companies.totalItems < 1" class="text-center my-5">
            <div v-if="searchActivated">
              <div class="text-muted"><i class="bi bi-search fs-1"></i></div>
              <div class="pb-3 text-muted">Pencarian tidak ditemukan</div>
            </div>
            <div v-else>
              <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
              <div class="pb-3 text-muted">Belum tersedia</div>
            </div>
          </div>

          <!-- list display item -->
          <ul v-else v-for="(company, i) in companies.items" :key="i" class="list-group list-group-flush">
            <nuxt-link v-if="role == 'jurusan' || role == 'wakasek'" :to="`/iduka/${company.id}`" class="link">
              <li class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-1 border-grey">
                <a @click="setModalCatatanById(company.id, company)" data-bs-toggle="modal" data-bs-target="#catatan" class="text-muted fs-6 hand-cursor me-1"><i class="bi bi-chat-right-text"></i></a>
                <div class="ms-2 me-auto fw-bold">
                  <span v-if="(role == 'admin' || role == 'jurusan') && company.isArchive" class="badge smallest text-bg-dark rounded-pill">Arsip</span>

                  <div class="fs-6 mb-2">
                    <span v-if="company.isArchive" class="text-muted">{{ company.nama.toUpperCase() }}</span>
                    <span v-else>{{ company.nama.toUpperCase() }}</span>
                  </div>

                  <div class="text-muted mb-2">
                    {{ company?.expand.pembimbing_sekolah?.nama }}
                  </div>

                  <div class="text-muted mb-2">
                    <span class="badge border border-1 border-grey smallest text-muted rounded-pill me-1">{{ company.wilayah.charAt(0).toUpperCase() + company.wilayah.slice(1) }} kota</span>
                    <span v-if="role == 'wakasek'" class="badge border border-1 border-grey smallest text-muted rounded-pill me-1">{{ company.expand.program_keahlian.nama }}</span>
                    <span v-if="company.terisi < company.jumlah_kuota && role == 'jurusan'" class="badge border border-1 border-grey smallest text-muted rounded-pill me-1">{{ company.terisi }} / {{ company.jumlah_kuota }}</span>
                    <span v-else-if="company.terisi >= company.jumlah_kuota && role == 'jurusan'" class="badge border border-1 border-dark smallest text-bg-danger rounded-pill me-1">penuh</span>
                  </div>

                  <div v-if="company.terisi < 1 && role == 'jurusan'">
                    <a @click="setModalDeleteById(company.id, company.nama)" class="link text-muted" data-bs-toggle="modal" data-bs-target="#delete"><i class="bi bi-trash"></i> hapus</a>
                  </div>
                </div>

                <NuxtLink :to="`https://www.google.com/maps/search/?api=1&query=${company.nama} ${company.alamat}`" target="_blank" class="link text-grey"><i class="bi bi-arrow-up-right-square"></i></NuxtLink>
              </li>
            </nuxt-link>

            <li v-else class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-1 border-grey">
              <div class="ms-2 me-auto fw-bold">
                <div class="fs-6 mb-2">
                  {{ company.nama }}
                </div>

                <div class="text-muted mb-2">
                  <NuxtLink :to="`https://www.google.com/maps/search/?api=1&query=${company.nama} ${company.alamat}`" target="_blank" class="link text-grey">Lihat peta <i class="bi bi-arrow-up-right-square"></i></NuxtLink>
                </div>

                <div class="text-muted small">
                  <span class="badge border border-1 border-grey smallest text-muted rounded-pill me-1">{{ company.wilayah.charAt(0).toUpperCase() + company.wilayah.slice(1) }} kota</span>
                  <span class="badge border border-1 border-grey smallest text-muted rounded-pill me-1">{{ company.expand.program_keahlian.nama }}</span>
                </div>
              </div>
            </li>
          </ul>
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
          <button :disabled="isMovingPage || companies.page < 2" @click="pagination(companies.page - 1, false)" class="btn btn-dark me-2 border border-2 border-dark">
            <i class="bi bi-arrow-left"></i>
          </button>
          <button :disabled="isMovingPage || companies.page >= companies.totalPages" @click="pagination(companies.page + 1, false)" class="btn btn-outline-dark border border-2 border-dark">
            <i class="bi bi-arrow-right"></i>
          </button>
        </span>
      </div>

    </div>
  </div>

  <!-- Single Modal: hapus iduka -->
  <div class="modal" id="delete" aria-hidden="true" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
        <div class="modal-header rounded-0 h4 bg-danger fw-bold border-bottom border-3 border-dark">
          Peringatan!
        </div>
        <div class="modal-body">
          Yakin mau hapus <strong>{{ company_name }}</strong> dari daftar IDUKA?
        </div>
        <div class="modal-footer border-0 justify-content-center">
          <button v-if="!isDeleted" class="btn btn-danger border border-2 border-dark me-2" data-bs-dismiss="modal" @click="hapusData(company_id)" :disabled="isSending">
            <span v-if="isSending">Sedang menghapus</span>
            <span v-else>Hapus</span>
          </button>
          <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-light border border-2 border-dark" data-bs-dismiss="modal">Gajadi</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Single Modal: Pratinjau / Quick preview -->
  <div class="modal" id="catatan" aria-hidden="true" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border border-3 border-dark shadow-lg">
        <div class="modal-header fw-bold border-bottom border-3 border-dark">
          <div class="fs-4">{{ pratinjau_iduka?.nama }} <span v-if="pratinjau_iduka.isArchive" class="badge text-bg-white text-muted border-grey">Arsip</span></div>
          <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
        </div>
        <div v-if="pratinjau_iduka" class="modal-body py-3">
          <div v-if="pratinjau_iduka.wilayah == 'dalam'" class="mb-3 badge border-grey text-muted">{{ pratinjau_iduka.wilayah.charAt(0).toUpperCase() + pratinjau_iduka.wilayah.slice(1) }} kota</div>
          <div v-else class="mb-3 badge border-grey text-muted">{{ pratinjau_iduka.wilayah.charAt(0).toUpperCase() + pratinjau_iduka.wilayah.slice(1) }} kota</div>

          <span v-if="pratinjau_iduka.jumlah_kuota" class="ms-2 badge text-muted border-grey">
            Kuota: {{ pratinjau_iduka.jumlah_kuota }}
          </span>

          <div class="fw-bold">Alamat</div>
          <p>{{ pratinjau_iduka.alamat }}</p>

          <div class="fw-bold">PIC Sekolah</div>
          <p v-if="pratinjau_iduka.pembimbing_sekolah">{{ pratinjau_iduka.expand.pembimbing_sekolah.nama }}</p>
          <p v-else>&#8212;</p>

          <div class="fw-bold">Instruktur IDUKA</div>
          <p v-if="pratinjau_iduka.pembimbing_iduka">{{ pratinjau_iduka.pembimbing_iduka }}</p>
          <p v-else>&#8212;</p>

          <div class="fw-bold">Catatan</div>
          <p v-if="pratinjau_iduka.catatan">{{ pratinjau_iduka.catatan }}</p>
          <p v-else>&#8212;</p>
        </div>
        <div v-if="(role == 'admin' || role == 'jurusan') && pratinjau_iduka.terisi < 1" class="modal-footer border-0">
          <button v-if="!pratinjau_iduka.isArchive" @click="handleArchive(true,pratinjau_iduka.id)" class="btn btn-dark border border-2 border-dark" data-bs-dismiss="modal"><i class="bi bi-archive"></i> Arsipkan</button>
          <button v-else @click="handleArchive(false,pratinjau_iduka.id)" class="btn btn-dark border border-2 border-dark" data-bs-dismiss="modal"><i class="bi bi-archive"></i> Buka arsip</button>
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
let isLoadingModalDelete = ref(false)
let isLoadingModalCatatan = ref(false)
let isSending = ref(false)
let isDeleted = ref(false)
let keyword = ref('')
let prokel = user.user.value.program_keahlian
let opsiWilayah = ref('')

let perPage = 20
let isMovingPage = ref(false)
let company_id = ref('') // single data untuk render ke Modal Delete
let company_name = ref('')
let catatan_id = ref('') // single data untuk render ke Modal Catatan
let pratinjau_iduka = ref('')
let opsiProkel = ref([])
let selectedProkel = ref('')
let selectedArchive = ref('hide')
let searchActivated = ref(false)
let arsip = ref(0)

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

async function getCompanies(loading=true) {
  isLoading.value = loading
  let searchFilter = ''
  let filterQuery = `program_keahlian = "${user.user.value.program_keahlian}"`
  if(keyword.value != '') {
    searchActivated.value = true
    if(selectedArchive.value == 'arsip') {
      searchFilter = ` && nama~"${keyword.value}" && isArchive=true`
    } else if(selectedArchive.value == 'hide') {
      searchFilter = ` && nama~"${keyword.value}" && isArchive=false`
    } else {
      searchFilter = ` && nama~"${keyword.value}"`
    }
  } else {
    searchActivated.value = false
    if(selectedArchive.value == 'arsip') {
      searchFilter = ` && isArchive=true`
    }
    else if(selectedArchive.value == 'hide') {
      searchFilter = ` && isArchive=false`
    }
  }

  // filter by role
  if(role == 'wakasek' || role == 'tu') {
    filterQuery = ''
    searchFilter = ''
    if(keyword.value != '' && selectedProkel.value != '') {
      searchActivated.value =true
      filterQuery = `program_keahlian="${selectedProkel.value}" && isArchive=false`
      searchFilter = ` && (nama~"${keyword.value}" || pembimbing_sekolah.nama~"${keyword.value}")`
    } else if(keyword.value != '') {
      searchActivated.value = true
      filterQuery = `isArchive=false && `
      searchFilter = `nama~"${keyword.value}" || pembimbing_sekolah.nama~"${keyword.value}"`
    } else if(selectedProkel.value != '') {
      filterQuery = `program_keahlian="${selectedProkel.value}" && isArchive=false`
    } else {
      filterQuery = `isArchive=false`
    }
  }

  if(role == 'guru') {
    filterQuery = `pembimbing_sekolah="${user.user.value.id}" `
  }

  let data = await client.collection('iduka').getList(1, perPage, {
    filter: filterQuery + searchFilter,
    expand: "program_keahlian, pembimbing_sekolah",
    sort: 'program_keahlian, terisi, -wilayah, nama'
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
  let searchFilter = ''
  let filterQuery = `program_keahlian = "${user.user.value.program_keahlian}"`
  // filter by arsip
  if(selectedArchive.value == 'arsip') {
    searchFilter = ` && isArchive=true`
  }
  else if(selectedArchive.value == 'hide') {
    searchFilter = ` && isArchive=false`
  }

  // filter by role
  if(role == 'wakasek' || role == 'tu') {
    filterQuery = ''
    searchFilter = ''
    if(keyword.value != '' && selectedProkel.value != '') {
      searchActivated.value = true
      filterQuery = `program_keahlian="${selectedProkel.value}" && isArchive=false`
      searchFilter = ` && (nama~"${keyword.value}" || pembimbing_sekolah.nama~"${keyword.value}")`
    } else if(keyword.value != '') {
      searchActivated.value = true
      filterQuery = `isArchive=false && `
      searchFilter = `nama~"${keyword.value}" || pembimbing_sekolah.nama~"${keyword.value}"`
    } else if(selectedProkel.value != '') {
      filterQuery = `program_keahlian="${selectedProkel.value}" && isArchive=false`
    } else {
      filterQuery = `isArchive=false`
    }
  }

  let data = await client.collection('iduka').getList(page, perPage, {
    filter: filterQuery + searchFilter,
    expand: "program_keahlian, pembimbing_sekolah",
    sort: 'program_keahlian, terisi, -wilayah, nama'
  })
  if (data) {
    companies.value = data
    isLoading.value = false
    isMovingPage.value = false
    // console.log(companies.value[0].expand.pembimbing_sekolah.nama)
  }
}

// ambil IDUKA dari id saat tombol delete dihapus
// ini akan memuat single record yang akan dirender ke Modal
async function setModalDeleteById(id, name) {
  company_id.value = id
  company_name.value = name
}

// ambil IDUKA dari id saat tombol catatan ditekan
// ini akan memuat single record yang akan dirender ke Modal catatan
async function setModalCatatanById(id, content) {
  catatan_id.value = id
  pratinjau_iduka.value = content
}

async function handleArchive(archiveStatus, id) {
  client.autoCancellation(false)
  await client.collection('iduka').update(id, { isArchive: archiveStatus })
}

async function getCompaniesArchived() {
  client.autoCancellation(false)
  let res = await client.collection('iduka').getFullList({
    filter: `program_keahlian="${prokel}" && isArchive=true`
  })
  if(res) {
    arsip.value = res.length
  }
}

/*async function filterByWilayah() {
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
}*/

async function getProkelForOption() {
  if(role == 'admin' || role == 'jurusan' || role == 'wakasek' || role == 'tu') {
    let res_prokel = await client.collection('program_keahlian').getFullList({
      sort: "created"
    })
    if(res_prokel) opsiProkel.value = res_prokel
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
  getProkelForOption()
  getCompaniesArchived()
  client.collection('iduka').subscribe('*', function(e) {
    if(e.action == 'delete' || e.action == 'update') {
      getCompanies(false)
      getCompaniesArchived()
    }
  },{})
})
</script>

