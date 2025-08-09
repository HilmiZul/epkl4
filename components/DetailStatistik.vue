<template>
  <loading v-if="isLoading" />
  <div v-else class="col-md-6">
    <div class="card mb-4">
      <div class="card-body">
        <h4>{{ jurusan?.nama }}</h4>
        <table class="table fs-6 fw-semibold border-0">
          <tbody>
            <tr>
              <td width="65%">Terpetakan</td>
              <td>: {{ count_terpetakan?.length }} dari {{ count_peserta?.length }}</td>
            </tr>
            <tr>
              <td>Terserap di dalam kota</td>
              <td>: {{ count_terserap_dalam?.length }} dari {{ count_peserta?.length }}</td>
            </tr>
            <tr>
              <td>Terserap di luar kota</td>
              <td>: {{ count_terserap_luar?.length }} dari {{ count_peserta?.length }}</td>
            </tr>
            <tr>
              <td>IDUKA dalam kota</td>
              <td>: {{ count_iduka_dalam?.length}}</td>
            </tr>
            <tr>
              <td>IDUKA luar kota</td>
              <td>: {{ count_iduka_luar?.length }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(false)
let prokels = ref([])
let classNameCard = ref('')
let jurusan = ref()
let count_terpetakan = ref(0)
let count_peserta = ref(0)
let count_iduka_dalam = ref(0)
let count_iduka_luar = ref(0)
let count_terserap_dalam = ref(0)
let count_terserap_luar = ref(0)

async function getProkelName() {
  isLoading.value = true
  let res = await client.collection("program_keahlian").getOne(prokel)
  if(res) {
    isLoading.value = false
    jurusan.value = res
  }
}

async function countTerpetakan() {
  isLoading.value = true
  let res = await client.collection('pemetaan').getFullList({ filter: "program_keahlian='"+prokel+"'" })
  if(res) {
    isLoading.value = false
    count_terpetakan.value = res
  }
}

async function countPeserta() {
  isLoading.value = true
  let res = await client.collection('siswa').getFullList({ filter: "program_keahlian='"+prokel+"'" })
  if(res) {
    isLoading.value = false
    count_peserta.value = res
  }
}

async function countIduka(wilayah) {
  isLoading.value = true
  let res = await client.collection('iduka').getFullList({ filter: "program_keahlian='"+prokel+"' && wilayah='"+wilayah+"'" })
  if(res) {
    isLoading.value = false
    if(wilayah == 'dalam') count_iduka_dalam.value = res
    else count_iduka_luar.value = res
  }
}

async function countTerserap(wilayah) {
  isLoading.value = true
  let res = await client.collection('pemetaan').getFullList({
    filter: "program_keahlian='"+prokel+"' && iduka.wilayah='"+wilayah+"'",
    expand: "iduka"
  })
  if(res) {
    isLoading.value = false
    if(wilayah == 'dalam') count_terserap_dalam.value = res
    else count_terserap_luar.value = res
  }
}


onMounted(() => {
  getProkelName()
  countPeserta()
  countTerpetakan()
  countIduka("dalam")
  countIduka("luar")
  countTerserap("dalam")
  countTerserap("luar")
})

// async function getProkels() {
//   isLoading.value = true
//   let data = await client.collection('program_keahlian').getFullList({
//     sort: 'created'
//   })
//   if(data) {
//     isLoading.value = false
//     prokels.value = data
//     for(let i=0; i<prokels.value.length; i++) {
//       if(prokels.value[i].nama == 'PPLG') classNameCard.value = 'card-body bg-success'
//       else if(prokels.value[i].nama == 'TJKT') classNameCard.value = 'card-body bg-info'
//       else if(prokels.value[i].nama == 'TSM') classNameCard.value = 'card-body bg-danger'
//       else if(prokels.value[i].nama == 'DKV') classNameCard.value = 'card-body bg-warning'
//       else if(prokels.value[i].nama == 'TOI') classNameCard.value = 'card-body bg-grey'
//     }
//   }
// }

</script>
