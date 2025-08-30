<template>
  <div class="col-md-6">
    <LoadingPlaceholder v-if="isLoading" col="12" row="3" />
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ count_iduka_dalam }}</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span>IDUKA dalam kota</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ count_iduka_luar }}</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span>IDUKA luar kota</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ count_terserap_dalam }} / {{ count_peserta }}</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span>Terserap dalam kota</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h2 v-if="!isLoading" class="fs-2 fw-bold">{{ count_terserap_luar }} / {{ count_peserta }}</h2>
            <h4 v-else>
              <p class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </h4>
            <span>Terserap luar kota</span>
          </div>
        </div>
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
let count_terserap_semua = ref(0)
let count_terpetakan_semua = ref(0)
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

// async function countTerserapSemuaPeserta() {
//   isLoading.value = true
//   let resTerserap = await client.collection('pemetaan').getFullList({ filter: "program_keahlian='"+prokel+"' && status_acc_pkl=true" })
//   let resTerpetakan = await client.collection('pemetaan').getFullList({ filter: "program_keahlian='"+prokel+"'" })
//   if(resTerserap && resTerpetakan) {
//     let temp_count_peserta = await countPeserta()
//     if(temp_count_peserta) {
//       isLoading.value = false
//       count_terserap_semua.value = (resTerserap.length / temp_count_peserta.length) * 100
//       count_terpetakan_semua.value = resTerpetakan.length
//     }
//   }
// }

async function countPeserta() {
  isLoading.value = true
  let res = await client.collection('siswa').getFullList({ filter: "program_keahlian='"+prokel+"'" })
  if(res) {
    isLoading.value = false
    count_peserta.value = res.length
  }
}

async function countIduka(wilayah) {
  isLoading.value = true
  let res = await client.collection('iduka').getFullList({ filter: "program_keahlian='"+prokel+"' && wilayah='"+wilayah+"'" })
  if(res) {
    isLoading.value = false
    if(wilayah == 'dalam') count_iduka_dalam.value = res.length
    else count_iduka_luar.value = res.length
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
    if(wilayah == 'dalam') count_terserap_dalam.value = res.length
    else count_terserap_luar.value = res.length
  }
}


onMounted(() => {
  getProkelName()
  countPeserta()
  // countTerserapSemuaPeserta()
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
