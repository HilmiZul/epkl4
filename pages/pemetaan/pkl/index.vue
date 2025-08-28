<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand"><i class="bi bi-diagram-3-fill"></i> Pemetaan PKL</span>
      <div v-if="isIdukaAvailable.length > 0" class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/pemetaan/pkl/tambah" class="btn btn-info btn-sm"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <input v-model="keyword" type="search" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan IDUKA / wilayah" />
          </div>
        </div>
        <div class="col align-content-center small">
          <div class="mb-3 text-grey float-end">{{ mappingFiltered.length }} peserta terpetakan</div>
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
                  <td colspan="3"><Loading /></td>
                </tr>
                <tr v-else-if="mappingFiltered.length < 1" class="text-center my-5">
                  <td colspan="3">Data tidak ditemukan</td>
                </tr>
                <tr v-else v-for="(pemetaan) in mappingFiltered" :key="pemetaan.id">
                  <!-- <td >{{ i+1 }}.</td> -->
                  <td v-if="pemetaan.showIduka" :rowspan="pemetaan.idukaRowspan">
                    <span class="text-grey me-2"><i class="bi bi-building"></i></span><nuxt-link :to="`https://www.google.com/maps/search/?api=1&query=${pemetaan.expand.iduka.alamat}`" class="link" target="_blank"><span class="quicksand">{{ pemetaan.expand.iduka.nama }}</span> <sup><i class="bi bi-arrow-up-right"></i></sup></nuxt-link>
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
                    <div class="mt-1 text-muted small">{{ pemetaan.expand.siswa.kelas }}</div>
                  </td>
                  <td v-if="pemetaan.showIduka" :rowspan="pemetaan.idukaRowspan" class="align-middle text-center">
                    <nuxt-link v-if="!pemetaan.status_acc_pkl" :to="`/pemetaan/pkl/surat/cetak/${pemetaan.iduka}`" target="_blank" class="btn btn-light btn-sm smallest"><i class="bi bi-printer"></i> Cetak</nuxt-link>
                    <span v-else class="text-muted small">Sudah</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- modal pertanyaan apakah diterima IDUKA PKL? -->
          <div>
            <div v-for="(pemetaan) in mapping" :key="pemetaan.id">
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
                      <button @click="handleAccPkl(pemetaan.iduka)" class="btn btn-success" data-bs-dismiss="modal">Udah dong!</button>
                      <button class="btn btn-light" data-bs-dismiss="modal">eh belum</button>
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
let opsiWilayah = ref('')
let keyword = ref('')
let isIdukaAvailable = ref([])

async function handleAccPkl(iduka) {
  // kumpulkan peserta yang iduka-nya sama. ubah status Acc. PKL dengan looping
  let idukaById = await client.collection('pemetaan').getFullList({
    filter: "program_keahlian='"+prokel+"' && iduka='"+iduka+"'"
  })
  if(idukaById) {
    for(let i=0; i<idukaById.length; i++) {
      // console.log(count_dudi[i].id)
      // console.log('ubah ke true')
      // console.log('--------------------')
      await client.collection('pemetaan').update(idukaById[i].id, { status_acc_pkl: true })
    }
  }
}

async function getPemetaan() {
  isLoading.value = true
  // atur filter berdasarkan role: `tu` atau selain `tu`
  let filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"
  if(role == 'tu') filterQuery = ""
  else if(role == 'jurusan') filterQuery = "program_keahlian='"+prokel+"'"
  else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'"
  // else if(role == 'guru') filterQuery = "program_keahlian='"+prokel+"' && siswa.pembimbing='"+user.user.value.id+"'"

  client.autoCancellation(false)
  let data = await client.collection("pemetaan").getFullList({
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
    mapping.value.forEach((item, index) => {
      if(item.iduka !== prevIduka) {
        rowspanCount = 1
        // cari banyaknya baris dari banyaknya iduka yang sama
        for(let i=index+1; i<mapping.value.length; i++) {
          if(mapping.value[i].iduka === item.iduka) {
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
    mapping.value = tempMapping
  }
}

async function filterByWilayah() {
  isLoading.value = true
  if(opsiWilayah.value.length > 0) {
    client.autoCancellation(false)
    const data = await client
      .collection('pemetaan')
      .getFullList({
        filter: "iduka.wilayah='"+opsiWilayah.value+"' && program_keahlian='"+prokel+"'",
        expand: "iduka, siswa, program_keahlian",
        sort: "iduka.wilayah, iduka.nama"
      })
    if(data) {
      isLoading.value = false
      mapping.value = data

      // grouping untuk rowspan
      const tempMapping = []
      let prevIduka = null
      let rowspanCount = 0
      mapping.value.forEach((item, index) => {
        if(item.iduka !== prevIduka) {
          rowspanCount = 1
          // cari banyaknya baris dari banyaknya iduka yang sama
          for(let i=index+1; i<mapping.value.length; i++) {
            if(mapping.value[i].iduka === item.iduka) {
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
      mapping.value = tempMapping
    }
  } else {
    getPemetaan()
  }
}

async function searchByKeyword() {
  isLoading.value = true
  client.autoCancellation(false)
  if(keyword.value.length > 0) {
    let data = await client
      .collection('pemetaan')
      .getFullList({
        filter: "iduka.nama~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"' && program_keahlian='"+prokel+"'",
        expand: "iduka, siswa, program_keahlian",
        sort: "iduka.wilayah"
      })
    if(data) {
      isLoading.value = false
      mapping.value = data

      // grouping untuk rowspan
      const tempMapping = []
      let prevIduka = null
      let rowspanCount = 0
      mapping.value.forEach((item, index) => {
        if(item.iduka !== prevIduka) {
          rowspanCount = 1
          // cari banyaknya baris dari banyaknya iduka yang sama
          for(let i=index+1; i<mapping.value.length; i++) {
            if(mapping.value[i].iduka === item.iduka) {
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
      mapping.value = tempMapping
    }
  } else {
    getPemetaan()
  }
}

const mappingFiltered = computed(() => {
  return mapping.value.filter((i) => {
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
