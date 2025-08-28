<template>
  <div class="card">
    <div class="card-header">
      <span v-if="isLoading">Loading</span>
      <span v-else class="h4 quicksand text-grey">Update Pemetaan / {{ mappings?.expand.iduka.nama }}</span>
    </div>
    <div class="card-body">
      <div class="row">
        <!-- <div class="col-md-6">
          <form @submit.prevent="updatePemetaan">
            <div class="mb-3">
              <multiselect
                v-model="form.siswa"
                :options="students"
                :multiple="true"
                :modelValue="integer"
                :clear-on-select="false"
                :close-on-select="false"
                :custom-label="({nama, kelas}) => `${nama} — ${kelas}`"
                @remove="(removedOption, id) => removes.push(removedOption.id)"
                track-by="nama"
                label="nama"
                id="peserta"
                placeholder="Pilih satu atau lebih">
                <template #selection="{ values }">
                  <span class="multiselect__single" v-for="student in values" :key="student.id">{{ student.nama }} / {{ student.kelas }}</span>
                </template>
              </multiselect>
            </div>
            <button class="btn btn-success me-2">Simpan</button>
            <nuxt-link to="/pemetaan" class="btn btn-light">Kembali</nuxt-link>
          </form>
        </div> -->
        <div class="col-md-6">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Peserta didik yang terpetakan</div>
            <div v-if="isLoading"><Loading /></div>
            <ul v-else class="small">
              <li v-for="studentMap in mappings.expand.siswa" :key="studentMap.id">{{ studentMap }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'admin-auth' })
useHead({ title: "Update Pemetaan — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let route = useRoute()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let mappings = ref([])
let students = ref([])
let studentsMap = ref([])
let selectWilayah = ref('dalam')
let isLoadingCompanies = ref(true)
let isLoadingStudents = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let form = ref({
  iduka: '',
  siswa: [],
  program_keahlian: ''
})
let removes = ref([])

async function updatePemetaan() {
  isSending.value = true
  form.value.program_keahlian = prokel // nilai ini diubah untuk disesuaikan kedalam form.value
  form.value.iduka = mappings.value.expand.iduka.id // nilai ini juga sama.
  let tempSiswa = []
  for(let i=0; i<form.value.siswa.length; i++) {
    tempSiswa.push(form.value.siswa[i].id)
  }
  form.value.siswa = tempSiswa

  // update pemetan terbaru
  let data = await client.collection('pemetaan').update(route.params.id, { siswa: form.value.siswa })
  if(data) {
    isSending.value = false
    isSaved.value = true
    // ada pengurangan
    if(removes.value.length > 0) {
      // nilai `terisi` saat ini - banyaknya siswa yang diubah
      let curr_terisi = mappings.value.expand.iduka.terisi - form.value.siswa.length
      await client.collection('iduka').update(form.value.iduka, { terisi: curr_terisi })

      // loop siswa sebanyak yang dihapus. data diambil dari removes.value
      for(let i=0; i<removes.value.length; i++) {
        await client.collection('siswa').update(removes.value[i], { status_pemetaan_pkl:false })
      }
    }
    // ada penambahan
    if(form.value.siswa.length > mappings.value.expand.iduka.terisi) {
      let curr_terisi = mappings.value.expand.iduka.terisi + form.value.siswa.length
      // console.log(curr_terisi)
      // console.log(mappings.value.expand.iduka.id)
      // console.log(form.value.siswa.length)
      await client.collection('iduka').update(form.value.iduka, { terisi: curr_terisi })
      for(let i=0; i<form.value.siswa.length; i++) {
        await client.collection('siswa').update(form.value.siswa[i], { status_pemetaan_pkl:true })
      }
    }
    // pemetaan dengan konsisi peserta kosong
    else if(form.value.siswa.length < 1) {
      await client.collection('iduka').update(form.value.iduka, { terisi: 0 })
    }
  }

}

async function getPemetaanById() {
  isLoading.value = true
  let data = await client.collection('pemetaan').getOne(route.params.id, {
    filter: "program_keahlian='"+prokel+"'",
    expand: "iduka, siswa, program_keahlian",
  })
  if(data) {
    isLoading.value = false
    mappings.value = data
    form.value.siswa = data.expand.siswa
  }
}

async function getStudentsByProkel() {
  isLoadingStudents.value = true
  let data = await client
    .collection("siswa")
    .getFullList({
      filter: "program_keahlian='"+prokel+"' && status_rapot=true"
    })
  if(data) {
    isLoadingStudents.value = false
    students.value = data
  }
}

// async function getStudentsByPemetaan() {
//   isLoadingStudents.value = true
//   let data = await client
//     .collection("pemetaan")
//     .getOne(route.params.id, {
//       filter: "program_keahlian='"+prokel+"'",
//       expand: "siswa"
//     })
//   if(data) {
//     isLoadingStudents.value = false
//     console.log(data)
//   }
// }

onMounted(() => {
  getPemetaanById()
  getStudentsByProkel()
  // getStudentsByPemetaan()
})
</script>
