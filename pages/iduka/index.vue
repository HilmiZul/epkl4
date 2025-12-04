<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-buildings-fill"></i> IDUKA</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/tambah" class="btn btn-info btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
        <!-- <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/iduka/import" class="btn btn-success btn-sm ms-2 border border-2 border-dark"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link> -->
      </span>
    </div>
    <div class="card-body small">
      <div v-if="role == 'admin' || role == 'jurusan'" class="row">
        <div class="col-lg-12">
          <div class="alert alert-info alert-dismissible">
            <div class="fs-5 fw-bold"><i class="bi bi-lightbulb-fill"></i> Ada yang baru!</div>
            Sekarang Anda dapat mengarsipkan IDUKA yang tidak terisi dan memfilternya. Klik icon <i class="bi bi-chat-right-text"></i> lalu klik tombol <span class="fw-bold">Arsipkan</span>. <br>
            IDUKA yang diarsipkan tidak dapat diisi/petakan. Untuk membukanya, klik lagi icon <i class="bi bi-chat-right-text"></i> lalu klik tombol <span class="fw-bold">Buka arsip</span>.
            <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getCompanies">
            <div class="my-3 mt-0 input-group">
              <input type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="🔎 Cari nama IDUKA" />
              <button class="btn btn-info ms-2 border border-2 border-dark">Cari</button>
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
          <div class="table-responsive">
            <table class="table table-hover table-striped table-bordereless">
              <thead>
                <tr>
                  <!-- <th width="2%">#</th> -->
                  <th width="60%">Nama</th>
                  <th width="10%">Wilayah</th>
                  <th v-if="role == 'admin' || role == 'jurusan'" width="6%">Terisi</th>
                  <th v-if="role == 'admin' || role == 'jurusan'" width="17%">Pembimbing</th>
                  <th v-if="role == 'wakasek' || role == 'tu'" width="17%">Program Keahlian</th>
                  <th v-if="role == 'admin' || role == 'jurusan'" width="5%">Hapus</th>
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
                  <td v-if="searchActivated" colspan="6">
                    <div class="text-muted"><i class="bi bi-search fs-1"></i></div>
                    <div class="pb-3 text-muted">Pencarian tidak ditemukan</div>
                  </td>
                  <td v-else colspan="6">
                    <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
                    <div class="pb-3 text-muted">IDUKA belum tersedia</div>
                  </td>
                </tr>
                <!-- tanda merah menandakan IDUKA yang diarsipkan -->
                <tr v-else v-for="(company, i) in companies.items" :key="i">
                  <td class="fw-bold">
                    <span @click="setModalCatatanById(company.id, company)" data-bs-toggle="modal" data-bs-target="#catatan" class="hand-cursor me-3"><i class="bi bi-chat-right-text"></i></span>
                    <span v-if="(role == 'admin' || role == 'jurusan') && company.isArchive" class="text-danger me-1">&bull;</span>
                    <nuxt-link v-if="role == 'admin' || role == 'jurusan'" :to="`/iduka/${company.id}`" class="link">
                      <span v-if="company.isArchive" class="text-muted">{{ company.nama }}</span>
                      <span v-else>{{ company.nama }}</span>
                    </nuxt-link>
                    <span v-else>{{ company.nama }}</span>
                    <!-- <nuxt-link v-if="(role == 'admin' || role == 'jurusan') && company.alamat" :to="`https://www.google.com/maps/search/?api=1&query=${company.nama} ${company.alamat}`" target="_blannk" class="hand-cursor ms-2 text-dark"><i class="bi bi-geo-alt-fill"></i></nuxt-link> -->
                  </td>
                  <td class="smallest">{{ company.wilayah.charAt(0).toUpperCase() + company.wilayah.slice(1) }} kota </td>
                  <td v-if="role == 'admin' || role == 'jurusan'" class="smallest">
                    <span v-if="company.terisi < company.jumlah_kuota">{{ company.terisi }} / {{ company.jumlah_kuota }}</span>
                    <span v-else class="badge bg-danger">Penuh</span>
                  </td>
                  <td v-if="role == 'admin' || role == 'jurusan'" class="smallest">{{ company.expand.pembimbing_sekolah?.nama }} </td>
                  <td v-if="role == 'wakasek' || role == 'tu'" class="smallest">{{ company.expand.program_keahlian?.nama }} </td>
                  <td v-if="role == 'admin' || role == 'jurusan'" class="smallest">
                    <button v-if="company.terisi < 1" @click="setModalDeleteById(company.id, company.nama)" class="btn btn-danger btn-sm border border-2 border-dark" data-bs-toggle="modal" data-bs-target="#delete"><i class="bi bi-trash3"></i></button>
                    <button v-else class="btn btn-sm btn-disabled" disabled><i class="bi bi-trash3"></i></button>
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
          <button :disabled="isMovingPage || companies.page < 2" @click="pagination(companies.page - 1, false)" class="btn btn-info btn-sm me-2 border border-2 border-dark">
            <i class="bi bi-arrow-left"></i> sebelumnya
          </button>
          <button :disabled="isMovingPage || companies.page >= companies.totalPages" @click="pagination(companies.page + 1, false)" class="btn btn-info btn-sm border border-2 border-dark">
            lanjut <i class="bi bi-arrow-right"></i>
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
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
        <div class="modal-header bg-info rounded-0 fw-bold border-bottom border-3 border-dark">
          <div class="fs-4">Pratinjau <span v-if="pratinjau_iduka.isArchive" class="text-grey">(Arsip)</span></div>
          <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
        </div>
        <div v-if="pratinjau_iduka" class="modal-body py-3">
          <div v-if="pratinjau_iduka.wilayah == 'dalam'" class="mb-3 badge bg-dark">{{ pratinjau_iduka.wilayah.charAt(0).toUpperCase() + pratinjau_iduka.wilayah.slice(1) }} kota</div>
          <div v-else class="mb-3 badge text-dark">{{ pratinjau_iduka.wilayah.charAt(0).toUpperCase() + pratinjau_iduka.wilayah.slice(1) }} kota</div>
          <!-- <loading-placeholder v-if="isLoadingModalCatatan" col="12" row="1" /> -->
          <div class="fw-bold">Nama </div>
          <p>{{ pratinjau_iduka.nama }}</p>
          <div class="fw-bold">Alamat</div>
          <p>{{ pratinjau_iduka.alamat }}</p>
          <div class="fw-bold">Pembimbing</div>
          <p v-if="pratinjau_iduka.pembimbing_sekolah">{{ pratinjau_iduka.expand.pembimbing_sekolah.nama }}</p>
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
if(role == 'guru') navigateTo('/404')
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
      searchFilter = ` && (iduka.nama~"${keyword.value}" || siswa.nama~"${keyword.value}")`
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
  client.autoCancellation(false)
  client.collection('iduka').subscribe('*', function(e) {
    if(e.action == 'delete' || e.action == 'update') {
      getCompanies(false)
      getCompaniesArchived()
    }
  },{})
})
</script>

