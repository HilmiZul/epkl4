<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand"><i class="bi bi-diagram-3-fill"></i> Pemetaan</span>
      <div v-if="isIdukaAvailable.length > 0" class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/pemetaan/pkl/tambah" class="btn btn-info btn-sm"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getPemetaan">
            <div class="my-3 mt-0 input-group">
              <input v-model="keyword" type="search" class="form form-control form-control-md" placeholder="🔎 Cari nama IDUKA / peserta" />
              <button class="btn btn-info ms-2">Cari</button>
            </div>
          </form>
        </div>
        <div v-if="role == 'tu'" class="col-lg-3">
          <div class="my-3 mt-0">
            <select v-model="selectedProkel" @change="getPemetaan" class="form form-select">
              <option value="">Semua Jurusan</option>
              <option v-for="p in opsiProkel" :key="p.id" :value="p.id">{{ p.nama }}</option>
            </select>
          </div>
        </div>
        <div class="col align-content-center small">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end">{{ mapping.totalItems }} peserta terpetakan</div>
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
                  <th width="10%">Surat</th>
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
                <tr v-else-if="mapping && mapping.totalItems < 1" class="text-center my-5">
                  <td colspan="3">
                    <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                    <div class="pb-3">Data tidak ditemukan</div>
                  </td>
                </tr>
                <tr v-else v-for="(pemetaan) in newMapping" :key="pemetaan.id">
                  <!-- <td >{{ i+1 }}.</td> -->
                  <td v-if="pemetaan.showIduka" :rowspan="pemetaan.idukaRowspan">
                    <span class="text-grey me-2"><i class="bi bi-building"></i></span><nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${pemetaan.expand.iduka.nama} ${pemetaan.expand.iduka.alamat}`" class="link" target="_blank"><span class="quicksand">{{ pemetaan.expand.iduka.nama }}</span> <sup><i class="bi bi-arrow-up-right"></i></sup></nuxt-link>
                    <div class="small text-grey mt-2">
                      <i class="bi bi-geo-alt me-2"></i>{{ pemetaan.expand.iduka.wilayah.charAt(0).toUpperCase() + pemetaan.expand.iduka.wilayah.slice(1) }} kota
                    </div>
                    <span v-if="pemetaan.expand.iduka.terisi < pemetaan.expand.iduka.jumlah_kuota" class="text-grey small"><i class="bi bi-ui-checks-grid me-2"></i>Terisi: <span class="text-dark fw-semibold">{{ pemetaan.expand.iduka.terisi }} dari {{ pemetaan.expand.iduka.jumlah_kuota }}</span></span>
                    <span v-else class="text-grey small"><i class="bi bi-people me-2"></i>{{ pemetaan.expand.iduka.terisi }} peserta</span>
                    <div class="small fst-italitc text-grey"><i class="bi bi-person-workspace me-2"></i>
                      <span v-if="pemetaan.expand.iduka?.pembimbing_sekolah == '-' || pemetaan.expand.iduka?.pembimbing_sekolah == ''">&#8212;</span>
                      <span v-else> {{ pemetaan.expand.iduka?.expand.pembimbing_sekolah?.nama }}</span>
                    </div>
                    <div v-if="pemetaan.status_acc_pkl" class="badge bg-info my-2"><i class="bi bi-patch-check"></i> Diterima</div>
                    <div v-else-if="pemetaan.status_acc_pkl || role == 'admin' || role == 'jurusan'" class="badge bg-warning hand-cursor my-2" data-bs-toggle="modal" :data-bs-target="`#status-${pemetaan.id}`">Konfirmasi penerimaan <i class="bi bi-person-fill-check"></i></div>
                  </td>
                  <td class="py-1">
                    <nuxt-link v-if="role == 'admin' || role == 'jurusan'" :to="`/pemetaan/pkl/${pemetaan.id}`" class="link text-dark fw-bolder">
                      {{ pemetaan.expand.siswa.nama }}
                    </nuxt-link>
                    <span v-else>{{ pemetaan.expand.siswa.nama }}</span>
                    <div class="mt-1 text-muted smallest">{{ pemetaan.expand.siswa.kelas }}</div>
                  </td>
                  <td v-if="pemetaan.showIduka" :rowspan="pemetaan.idukaRowspan" class="align-middle text-center">
                    <nuxt-link v-if="!pemetaan.status_acc_pkl" :to="`/pemetaan/pkl/surat/cetak/${pemetaan.iduka}`" target="_blank" class="btn btn-light btn-sm smallest"><i class="bi bi-printer"></i> Cetak</nuxt-link>
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
              <button :disabled="isMovingPage || mapping.page < 2" @click="pagination(mapping.page - 1, false)" class="btn btn-info btn-sm me-2">
                <i class="bi bi-arrow-left"></i> sebelumnya
              </button>
              <button :disabled="isMovingPage || mapping.page >= mapping.totalPages" @click="pagination(mapping.page + 1, false)" class="btn btn-info btn-sm">
                lanjut <i class="bi bi-arrow-right"></i>
              </button>
            </span>
          </div>

          <!-- modal pertanyaan apakah diterima IDUKA PKL? -->
          <div>
            <div v-for="(pemetaan) in newMapping" :key="pemetaan.id">
              <div class="modal" :id="`status-${pemetaan.id}`" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
                    <div class="modal-header rounded-0 h4 bg-warning quicksand">
                      Konfrimasi Penerimaan
                    </div>
                    <div class="modal-body text-dark">
                      Apakah <strong>{{ pemetaan.expand.iduka.nama }}</strong> sudah konfirmasi menerima Peserta?
                    </div>
                    <div class="modal-footer">
                      <button @click="handleAccPkl(pemetaan.iduka)" class="btn btn-success" data-bs-dismiss="modal">Udah!</button>
                      <button class="btn btn-light" data-bs-dismiss="modal">belum</button>
                    </div>
                  </div>
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
let isFail = ref(false)
let opsiWilayah = ref('')
let keyword = ref('')
let isIdukaAvailable = ref([])
let perPage = 20
let isMovingPage = ref(false)
let opsiProkel = ref([])
let selectedProkel = ref('')

async function getProkelForOption() {
  let res_prokel = await client.collection('program_keahlian').getFullList({
    sort: "created"
  })
  if(res_prokel) opsiProkel = res_prokel
}

async function handleAccPkl(iduka) {
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
  if(role == 'tu') {
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
  // atur filter berdasarkan role: `tu` atau selain `tu`
  let filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"
  if(role == 'tu') filterQuery = ""
  else if(role == 'jurusan') filterQuery = "program_keahlian='"+prokel+"'"
  else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"
  // else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && siswa.pembimbing='"+user.user.value.id+"'"

  client.autoCancellation(false)
  let data = await client.collection("pemetaan").getList(page, perPage, {
    filter: filterQuery,
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
  let data = await client.collection('iduka').getFullList({
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
