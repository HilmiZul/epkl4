<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-diagram-3-fill"></i> Pemetaan</span>
      <div v-if="isIdukaAvailable?.totalItems > 0" class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/pemetaan/pkl/tambah" class="btn btn-info btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getPemetaan">
            <div class="my-3 mt-0 input-group">
              <input v-model="keyword" type="search" class="form form-control form-control-lg" placeholder="🔎 Cari nama IDUKA / peserta" />
              <button class="btn btn-info ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>
        <div v-if="role == 'tu' || role == 'wakasek'" class="col-lg-3">
          <div class="my-3 mt-0">
            <select v-model="selectedProkel" @change="getPemetaan" class="form form-select form-select-lg">
              <option value="">Semua Jurusan</option>
              <option v-for="p in opsiProkel" :key="p.id" :value="p.id">{{ p.nama }}</option>
            </select>
          </div>
        </div>
        <div class="col align-content-center small">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end badge">{{ mapping.totalItems }} peserta terpetakan</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <!-- <th width="2%">#</th> -->
                  <th>IDUKA</th>
                  <th width="45%">Peserta</th>
                  <th v-if="role == 'jurusan' || role == 'tu' || role == 'admin'" width="10%">Surat</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading" class="text-center my-5">
                  <td colspan="3">
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                    <LoadingPlaceholder col="12" row="1" />
                  </td>
                </tr>
                <tr v-else-if="mapping && mapping.totalItems < 1" class="text-center text-muted my-5">
                  <td colspan="3">
                    <div><i class="bi bi-database-fill fs-1"></i></div>
                    <div class="pb-3">Data belum ada/tidak ditemukan</div>
                  </td>
                </tr>
                <tr v-else v-for="(pemetaan) in newMapping" :key="pemetaan.id">
                  <!-- <td >{{ i+1 }}.</td> -->
                  <td v-if="pemetaan.showIduka" :rowspan="pemetaan.idukaRowspan">
                    <span @click="setModalIdukaById(pemetaan.id, pemetaan)" data-bs-toggle="modal" data-bs-target="#pratinjau-iduka" class="link hand-cursor fw-bold">{{ pemetaan.expand.iduka.nama }} <i class="bi bi-arrow-up-right-square"></i></span>
                    <!-- <span class="text-grey me-2"><i class="bi bi-building"></i></span><nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${pemetaan.expand.iduka.nama} ${pemetaan.expand.iduka.alamat}`" class="link" target="_blank"><span class="fw-bold">{{ pemetaan.expand.iduka.nama }}</span> <sup><i class="bi bi-arrow-up-right"></i></sup></nuxt-link> -->
                    <div class="small text-grey mt-2">
                      <nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${pemetaan.expand.iduka.nama} ${pemetaan.expand.iduka.alamat}`" class="link" target="_blank">Lihat peta <i class="bi bi-arrow-up-right"></i></nuxt-link>
                    </div>
                    <div class="small text-grey mt-2">
                      <i class="bi bi-geo-alt me-2"></i>{{ pemetaan.expand.iduka.wilayah.charAt(0).toUpperCase() + pemetaan.expand.iduka.wilayah.slice(1) }} kota
                    </div>
                    <span v-if="pemetaan.expand.iduka.terisi < pemetaan.expand.iduka.jumlah_kuota" class="text-grey small"><i class="bi bi-ui-checks-grid me-2"></i>Terisi: <span class="text-dark fw-semibold">{{ pemetaan.expand.iduka.terisi }} dari {{ pemetaan.expand.iduka.jumlah_kuota }}</span></span>
                    <span v-else class="text-grey small"><i class="bi bi-people me-2"></i>{{ pemetaan.expand.iduka.terisi }} peserta</span>
                    <div class="small fst-italitc text-grey"><i class="bi bi-person-workspace me-2"></i>
                      <span v-if="pemetaan.expand.iduka?.pembimbing_sekolah == '-' || pemetaan.expand.iduka?.pembimbing_sekolah == ''">&#8212;</span>
                      <span v-else> {{ pemetaan.expand.iduka?.expand.pembimbing_sekolah?.nama }}</span>
                    </div>
                    <div v-if="pemetaan.status_acc_pkl" class="badge bg-success my-2"><i class="bi bi-patch-check"></i> Diterima</div>
                    <div v-else-if="pemetaan.status_acc_pkl || role == 'admin' || role == 'jurusan'" @click="setModalKonfirmasiPenerimaan(pemetaan.iduka, pemetaan.expand.iduka.nama)" class="badge bg-warning hand-cursor my-2" data-bs-toggle="modal" data-bs-target="#konfirmasi-penerimaan">Konfirmasi penerimaan <i class="bi bi-person-fill-check"></i></div>
                  </td>
                  <td class="py-1">
                    <nuxt-link v-if="role == 'admin' || role == 'jurusan'" :to="`/pemetaan/pkl/${pemetaan.id}`" class="link text-dark fw-bolder">
                      {{ pemetaan.expand.siswa.nama }}
                    </nuxt-link>
                    <span v-else class="fw-bold">{{ pemetaan.expand.siswa.nama }}</span>
                    <div class="mt-1 text-muted smallest">{{ pemetaan.expand.siswa.kelas }}</div>
                  </td>
                  <td v-if="pemetaan.showIduka && (role == 'jurusan' || role == 'tu' || role == 'admin')" :rowspan="pemetaan.idukaRowspan" class="align-middle text-center">
                    <button v-if="!pemetaan.status_acc_pkl" @click="setCetakSurat(pemetaan.iduka)" class="btn btn-light btn-sm border border-2 border-dark" data-bs-toggle="modal" data-bs-target="#cetak"><i class="bi bi-printer"></i> Cetak</button>
                    <!-- <div class="mb-2"><nuxt-link v-if="!pemetaan.status_acc_pkl" :to="`/pemetaan/pkl/surat/cetak/tte/${pemetaan.iduka}`" target="_blank" class="btn btn-light btn-sm smallest"><i class="bi bi-qr-code"></i> TTE</nuxt-link></div>
                    <nuxt-link v-if="!pemetaan.status_acc_pkl" :to="`/pemetaan/pkl/surat/cetak/non-tte/${pemetaan.iduka}`" target="_blank" class="btn btn-light btn-sm smallest"><i class="bi bi-pencil-square"></i> TTB</nuxt-link> -->
                    <span v-else class="text-muted small">Sudah</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-2">
            <loading-placeholder v-if="isLoading" col="3" row="1" />
            <span v-else>
              <div v-if="isMovingPage" class="text-muted small mb-2 fst-italic">sedang berpindah halaman</div>
              <div v-else>
                <div v-if="mapping || isMovingPage" class="text-muted small mb-2">
                  <span v-if="mapping.totalItems">Halaman {{ mapping.page }} dari {{ mapping.totalPages }}</span>
                </div>
              </div>
              <button :disabled="isMovingPage || mapping.page < 2" @click="pagination(mapping.page - 1, false)" class="btn btn-info btn-sm me-2 border border-2 border-dark">
                <i class="bi bi-arrow-left"></i> sebelumnya
              </button>
              <button :disabled="isMovingPage || mapping.page >= mapping.totalPages" @click="pagination(mapping.page + 1, false)" class="btn btn-info btn-sm border border-2 border-dark">
                lanjut <i class="bi bi-arrow-right"></i>
              </button>
            </span>
          </div>

          <!-- Single Modal: Opsi Jenis Surat TTE / TTB -->
          <div class="modal" id="cetak" aria-hidden="true" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                <div class="modal-header rounded-0 bg-info h4 fw-bold border-bottom border-3 border-dark">
                  Konfirmasi Jenis Surat
                  <button class="btn-close small" data-bs-dismiss="modal" label="Close"></button>
                </div>
                <div class="modal-body">
                  <select v-model="cetakSurat.opsi_jenis_surat"  @change="setJenisSurat" class="form form-select form-select-lg">
                    <option value="" disabled>&#8212; Pilih Jenis Surat &#8212;</option>
                    <option value="ttb">Tanda Tangan Basah</option>
                    <option value="tte">Tanda Tangan Elektronik</option>
                  </select>
                </div>
                <div class="modal-footer border-0 justify-content-center">
                  <nuxt-link v-if="cetakSurat.opsi_jenis_surat" :to="`/pemetaan/pkl/surat/cetak/${cetakSurat.opsi_jenis_surat}/${cetakSurat.id_iduka}`" target="_blank" class="btn btn-info border border-2 border-dark"><i class="bi bi-printer me-2"></i> Cetak</nuxt-link>
                  <button v-else class="btn btn-light border border-2 border-dark" disabled><i class="bi bi-printer me-2"></i> Cetak</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Single Modal: Konfirmasi penerimaan -->
          <div class="modal" id="konfirmasi-penerimaan" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                <div class="modal-header rounded-0 h4 bg-info fw-bold border-bottom border-3 border-dark">
                  Konfrimasi Penerimaan
                </div>
                <div class="modal-body text-dark">
                  Apakah <strong>{{ iduka_nama }}</strong> sudah konfirmasi menerima Peserta?
                </div>
                <div class="modal-footer border-0 justify-content-center">
                  <button @click="handleAccPkl(iduka_id)" class="btn btn-info border border-2 border-dark me-2" data-bs-dismiss="modal">Udah!</button>
                  <button class="btn btn-light border border-2 border-dark" data-bs-dismiss="modal">belum</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Single Modal: Pratinjau / Quick preview -->
          <div class="modal" id="pratinjau-iduka" aria-hidden="true" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                <div class="modal-header rounded-0 bg-info fw-bold border-bottom border-3 border-dark">
                  <div class="fs-4">Pratinjau IDUKA</div>
                  <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
                </div>
                <div v-if="pratinjau_iduka" class="modal-body py-3">
                  <div v-if="pratinjau_iduka.expand.iduka.wilayah == 'dalam'" class="mb-3 badge bg-dark">{{ pratinjau_iduka.expand.iduka.wilayah.charAt(0).toUpperCase() + pratinjau_iduka.expand.iduka.wilayah.slice(1) }} kota</div>
                  <div v-else class="mb-3 badge text-dark">{{ pratinjau_iduka.expand.iduka.wilayah.charAt(0).toUpperCase() + pratinjau_iduka.expand.iduka.wilayah.slice(1) }} kota</div>
                  <!-- <loading-placeholder v-if="isLoadingModalCatatan" col="12" row="1" /> -->
                  <div class="fw-bold">Nama </div>
                  <p>{{ pratinjau_iduka.expand.iduka.nama }}</p>
                  <div class="fw-bold">Alamat</div>
                  <p>{{ pratinjau_iduka.expand.iduka.alamat }}</p>
                  <div class="fw-bold">Pembimbing</div>
                  <p v-if="pratinjau_iduka.expand.iduka.pembimbing_sekolah">{{ pratinjau_iduka.expand.iduka.expand.pembimbing_sekolah.nama }}</p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Pemetaan PKL — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let mapping = ref([])
let newMapping = ref([])
let isLoading = ref(true)
let isLoadingModalKonfirmasi = ref(false)
let isFail = ref(false)
let opsiWilayah = ref('')
let keyword = ref('')
let isIdukaAvailable = ref([])
let perPage = 20
let isMovingPage = ref(false)
let opsiProkel = ref([])
let selectedProkel = ref('')
// state untuk jenis surat dan id iduka sebelum kehalaman cetak surat
let cetakSurat = ref({
  id_iduka: '',
  opsi_jenis_surat: ''
})
let iduka_dari_pemetan = ref()
let iduka_id = ref('') // single data untuk render ke Modal konfirmasi penerimaan
let iduka_nama = ref('') // single data untuk render ke Modal konfirmasi penerimaan
let pratinjau_iduka = ref('')

// setCetakSurat: mengambil ID IDUKA untuk ditetapkan kedalam cetakSurat.id_iduka
// setJenisSurat: tte atau ttb untuk link cetak surat: /{opsi_jenis_surat}/{id_iduka}
function setCetakSurat(iduka) {
  cetakSurat.value.id_iduka = iduka
}
function setJenisSurat() {
  cetakSurat.value.opsi_jenis_surat = cetakSurat.value.opsi_jenis_surat
}
async function setModalIdukaById(id, content) {
  pratinjau_iduka.value = content
}

// load single record dari pemetaan berdasarkan id `iduka`
// set ke variable iduka
async function setModalKonfirmasiPenerimaan(id, nama) {
  iduka_id.value = id
  iduka_nama.value = nama
}

async function getProkelForOption() {
  if(role == 'tu' || role == 'wakasek') {
    let res_prokel = await client.collection('program_keahlian').getFullList({
      sort: "created"
    })
    if(res_prokel) opsiProkel.value = res_prokel
  }
}

// handleAccPkl: menerima parameter id IDUKA
// load semua record dari pemetaan yang id IDUKA nya sama dengan parameter
async function handleAccPkl(iduka) {
  isLoading.value = true
  // kumpulkan peserta yang iduka-nya sama. ubah status Acc. PKL dengan looping
  let idukaById = await client.collection('pemetaan').getFullList({
    filter: "program_keahlian='"+prokel+"' && iduka='"+iduka+"'"
  })
  if(idukaById) {
    try {
      let promises = await Promise.all(
        idukaById.map((item) => {
          client.collection('pemetaan').update(item.id, { status_acc_pkl: true }, {'$autoCancel': false })
          // console.log(item.id)
          // console.log('ubah ke true')
          // console.log('--------------------')
        })
      )
      if(promises) {
        isLoading.value = false
        return true
      }
    } catch(error) {
      isFail.value = true
      console.log(`Terjadi error: ${error}`)
    }
  }
}

async function getPemetaan() {
  isLoading.value = true
  let searchActive = ''
  if(keyword.value != '') searchActive = " && (iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"')"
  // atur filter berdasarkan role: `tu` atau selain `tu`
  let filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"

  // filterQuery dikosongkan untuk role: TU tanpa keyword pencarian
  // atau dengan opsi filter prokel
  if(role == 'tu' || role == 'wakasek') {
    filterQuery = ""
    searchActive = ""
    if(keyword.value != '' && selectedProkel.value != '') {
      filterQuery = "program_keahlian='"+selectedProkel.value+"'"
      searchActive = " && (iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"')"
    }
    else if(keyword.value != '') {
      searchActive = "iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"'"
    }
    else if(selectedProkel.value != '') {
      filterQuery = "program_keahlian='"+selectedProkel.value+"'"
      // searchActive = " && (iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"')"
    }
  }
  // filterQuery diisi untuk role: TU dengan keyword pencarian
  // if(role == 'tu' && keyword.value != '') searchActive = "iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"'"
  // filterQuery untuk role: jurusan/manajemen
  else if(role == 'jurusan') filterQuery = "program_keahlian='"+prokel+"'"
  // filterQuery untuk role: guru pembimbing
  else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"
  // else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && siswa.pembimbing='"+user.user.value.id+"'"

  client.autoCancellation(false)
  let data = await client.collection("pemetaan").getList(1, perPage, {
    filter: filterQuery + searchActive,
    expand: "iduka, iduka.pembimbing_sekolah, siswa, program_keahlian",
    sort: "status_acc_pkl, iduka.wilayah, iduka.nama",
  })
  if(data) {
    isLoading.value = false
    mapping.value = data

    // grouping untuk rowspan
    const tempMapping = []
    let prevIduka = null
    let rowspanCount = 0
    mapping.value.items.forEach((item, index) => {
      if(item.iduka !== prevIduka) {
        rowspanCount = 1
        // cari banyaknya baris dari banyaknya iduka yang sama
        for(let i=index+1; i<mapping.value.items.length; i++) {
          if(mapping.value.items[i].iduka === item.iduka) {
            rowspanCount++
          } else {
            break
          }
        }
        tempMapping.push({
          ...item,
          showIduka: true,
          idukaRowspan: rowspanCount
        })
      } else {
        tempMapping.push({
          ...item,
          showIduka: false,
          idukaRowspan: 1
        })
      }
      prevIduka = item.iduka
    })
    newMapping.value = tempMapping
  }
}

async function pagination(page, loading=true) {
  isLoading.value = loading
  isMovingPage.value = true
  let searchActive = ''
  // atur filter berdasarkan role: `tu` atau selain `tu`
  let filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"
  if(role == 'tu' || role == 'wakasek') {
    filterQuery = ""
    searchActive = ""
    if(keyword.value != '' && selectedProkel.value != '') {
      filterQuery = "program_keahlian='"+selectedProkel.value+"'"
      searchActive = " && (iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"')"
    }
    else if(keyword.value != '') {
      searchActive = "iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"'"
    }
    else if(selectedProkel.value != '') {
      filterQuery = "program_keahlian='"+selectedProkel.value+"'"
      // searchActive = " && (iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"')"
    }
  }
  else if(role == 'jurusan') filterQuery = "program_keahlian='"+prokel+"'"
  else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"
  // else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && siswa.pembimbing='"+user.user.value.id+"'"

  client.autoCancellation(false)
  let data = await client.collection("pemetaan").getList(page, perPage, {
    filter: filterQuery + searchActive,
    expand: "iduka, iduka.pembimbing_sekolah, siswa, program_keahlian",
    sort: "status_acc_pkl, iduka.wilayah, iduka.nama",
  })
  if(data) {
    isLoading.value = false
    mapping.value = data

    // grouping untuk rowspan
    const tempMapping = []
    let prevIduka = null
    let rowspanCount = 0
    mapping.value.items.forEach((item, index) => {
      if(item.iduka !== prevIduka) {
        rowspanCount = 1
        // cari banyaknya baris dari banyaknya iduka yang sama
        for(let i=index+1; i<mapping.value.items.length; i++) {
          if(mapping.value.items[i].iduka === item.iduka) {
            rowspanCount++
          } else {
            break
          }
        }
        tempMapping.push({
          ...item,
          showIduka: true,
          idukaRowspan: rowspanCount
        })
      } else {
        tempMapping.push({
          ...item,
          showIduka: false,
          idukaRowspan: 1
        })
      }
      prevIduka = item.iduka
    })
    newMapping.value = tempMapping
    isMovingPage.value = false
  }
}

const mappingFiltered = computed(() => {
  return newMapping.value.filter((i) => {
    return (
      i.expand.iduka.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.iduka.wilayah.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

async function getIdukaIsAvailable(loading=true) {
  // memeriksa apakah Prokel tersebut sudah memiliki daftar IDUKA?
  // apabila belum, maka proses pemetaan belum diizinkan. :D
  isLoading.value = loading
  let data = await client.collection('iduka').getList(1, 1, {
    filter: "program_keahlian='"+prokel+"'"
  })
  if(data) {
    isLoading.value = false
    isIdukaAvailable.value = data
  }
}

onMounted(() => {
  getPemetaan()
  getIdukaIsAvailable()
  getProkelForOption()
  client.autoCancellation(false)
  client.collection('pemetaan').subscribe('*', function(e) {
    if(e.action == 'update') {
      getPemetaan()
      getIdukaIsAvailable(false)
    }
  },{})
})
</script>

<style scoped>
.count {
  position: relative;
}
.count_num {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 1.6em;
  height: 1.6em;
  border-radius: 100%;
  border: 2px solid #000;
  text-align: center;
  font-size: 1.5em;
}
a.link.link-card .card:hover {
  transform: scale(.995);
  box-shadow: 1px 1px 0 #000 !important;
}
a.link.link-card .card {
  transition: all 0.2s ease-out;
}
.smallest {
  font-size: 12px;
}
table tr, table td {
  border-bottom: 2px solid #000;
  border-right: 2px solid #000;
}
</style>
