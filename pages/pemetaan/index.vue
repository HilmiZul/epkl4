<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 romana text-grey"><i class="bi bi-diagram-3-fill"></i> Pemetaan</span>
      <div v-if="isIdukaAvailable.length > 0" class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/pemetaan/tambah" class="btn btn-dark btn-sm"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </div>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-lg-6">
          <div class="mb-4">
            <input v-model="keyword" type="search" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan peserta atau IDUKA..." />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="mb-4 text-muted">{{ mappingFiltered.length }} peserta terpetakan</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th width="2%">#</th>
                  <th width="45%">Peserta</th>
                  <th>IDUKA</th>
                  <th width="20%">Cetak</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading" class="text-center my-5">
                  <td colspan="4"><Loading /></td>
                </tr>
                <tr v-else-if="mappingFiltered.length < 1" class="text-center my-5">
                  <td colspan="4">Data tidak ditemukan</td>
                </tr>
                <tr v-for="(pemetaan,i) in mappingFiltered" :key="pemetaan.id">
                  <td >{{ i+1 }}.</td>
                  <td>
                    <nuxt-link :to="`/pemetaan/${pemetaan.id}`" class="link">
                      {{ pemetaan.expand.siswa.nama }}
                    </nuxt-link>
                  </td>
                  <td v-if="pemetaan.showIduka" :rowspan="pemetaan.idukaRowspan">
                    {{ pemetaan.expand.iduka.nama }}
                    <div class="fst-italic text-muted">{{ pemetaan.expand.iduka.wilayah.charAt(0).toUpperCase() + pemetaan.expand.iduka.wilayah.slice(1) }} kota</div>
                  </td>
                  <td v-if="pemetaan.showIduka" :rowspan="pemetaan.idukaRowspan">
                    <nuxt-link :to="`/pemetaan/surat/cetak/${pemetaan.iduka}`" target="_blank" class="link">Surat permohonan <i class="bi bi-box-arrow-up-right"></i></nuxt-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Pemetaan — e-PKL / SMKN 4 Tasikmalaya." })
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

async function getPemetaan() {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client.collection("pemetaan").getFullList({
    filter: "program_keahlian='"+prokel+"'",
    expand: "iduka, siswa, program_keahlian",
    sort: "iduka.wilayah, iduka.nama",
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
      i.expand.iduka.wilayah.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.siswa.nama.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

async function getIdukaIsAvailable() {
  isLoading.value = true
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
</style>
