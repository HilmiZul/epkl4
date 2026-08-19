<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand text-muted fw-bold">Pemetaan Pembimbing / Tambah Peserta / </span>
      <span v-if="!isLoading" class="h5 quicksand text-grey fw-bold">{{ pemetaan.expand.pembimbing.nama }}</span>
      <p v-else class="placeholder-glow"><span class="placeholder col-3"></span></p>
      <span class="float-end">
        <NuxtLink to="/pemetaan/pembimbing" class="btn btn-light btn-sm border border-2 border-dark">kembali</NuxtLink>
      </span>
    </div>
    <div class="card-body">
      <div v-if="isLoading"><Loading /></div>
      <div v-else class="row">
        <div class="col-md-6 mb-3">
          <form @submit.prevent="updatePemetaan">
            <div class="mb-4">
              <label for="siswa">Tambah peserta? (pilih lebih dari satu)</label>
              <multiselect
                v-model="form.siswa"
                :options="students"
                :multiple="true"
                :close-on-search="false"
                :clear-on-select="false"
                :custom-label="({expand}) => `${expand?.siswa?.nama} - ${expand?.siswa?.kelas} - ${expand?.iduka?.nama}`"
                :disabled="pemetaan?.expand.pembimbing.konversi_jjm_ke_jumlah_siswa == form.siswa.length+curr_students.length"
                id="siswa"
                placeholder="Pilih lebih dari satu"
                label="nama"
                required>
              </multiselect>
            </div>

            <button :disabled="isSending || form.siswa.length < 1" class="btn btn-dark me-3 border border-2 border-dark">
              <span v-if="isSending">Sedang memetakan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/pemetaan/pembimbing" class="link">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-muted">Berhasil tersimpan!</em>
          </form>
        </div>

        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6">
              <div class="alert">
                <div class="fs-4 fw-bold">{{ pemetaan?.expand.pembimbing?.jjm }}</div>
                JP
              </div>
            </div>

            <div class="col-md-6">
              <div class="alert">
                <div class="fs-4 fw-bold">{{ pemetaan?.expand.pembimbing.konversi_jjm_ke_jumlah_siswa }}</div>
                Peserta
              </div>
            </div>

            <div class="col-md-12">
              <div :class="`alert ${form.siswa.length + curr_students.length == pemetaan?.expand.pembimbing.konversi_jjm_ke_jumlah_siswa ? 'text-bg-dark' : 'alert-secondary'}`">
                <div class="fs-4 fw-bold">{{ form.siswa.length + curr_students.length }}</div>
                <span v-if="form.siswa.length + curr_students.length < pemetaan?.expand.pembimbing.konversi_jjm_ke_jumlah_siswa">dari {{ pemetaan?.expand.pembimbing.konversi_jjm_ke_jumlah_siswa }} Peserta</span>
                <span v-else>Peserta akan dibimbing</span>
              </div>
            </div>
          </div>

          <ul v-for="(s,i) in curr_students" :key="s.id" class="list-group list-group-flush">
            <li class="list-group-item">
              {{ s.nama }} <br>
              <span class="small text-muted">{{ s.kelas }}</span>
            </li>
          </ul>

          <hr />

          <ul v-for="(s,i) in form.siswa" :key="s.id" class="list-group list-group-flush">
            <li class="list-group-item">
              <button @click="()=>form.siswa.splice(i, 1)" class="border-0 bg-transparent float-end">X</button>
              {{ s?.expand?.siswa?.nama }} - {{ s.expand?.iduka?.nama }} <br>
              <span class="small text-muted">{{ s.expand?.siswa?.kelas }}</span>
            </li>
          </ul>
          <!-- <table class="table border-0">
            <tbody>
              <tr v-if="curr_students?.length < 1"><td class="fst-italic">Belum dipasangkan dengan Peserta didik</td></tr>
              <tr v-else v-for="student in curr_students" :key="student.id">
                <td>{{ student.nama }}</td>
                <td>{{ student.kelas }}</td>
              </tr>
            </tbody>
          </table> -->
          <!-- <span class="small text-grey">{{ curr_students?.length }} peserta</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Tambah Peserta — e-PKL / SMKN 4 Tasikmalaya." })
let route = useRoute()
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let role = user.user.value.role
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let pemetaan = ref([])
let students = ref([])
let curr_students = ref([])
let form = ref({
  siswa: []
})

if(role == 'guru' || role == 'tu' || role == 'wakasek') navigateTo('/404')

async function updatePemetaan() {
  isSending.value = true
  isSaved.value = false

  // TODO: MERGE SISWA ARRAY MASIH BELUM FIX!!

  // 1: Ekstrak list siswa dari pemetaan dan masukkan ke var `tempStudents`
  let tempStudents = []
  for(let i=0; i<form.value.siswa.length; i++) {
    // masukkan id siswa dari field pemetaan.siswa ke form.value.siswa dengan cara push array
    // tempStudents.push(form.value.siswa[i].siswa)
    tempStudents.push(form.value.siswa[i].expand.siswa)
  }

  // 2: Gabungkan list siswa yang sudah diesktrak dengan data siswa lama jika ada, ini tersimpan pada var curr_students
  tempStudents = tempStudents.concat(curr_students.value)

  // 3: buat var untuk nampun dan ekstrak id siswa dengan nama tempStudentsUpdate,
  // field yang di update pada siswa: status_pemetaan_pembimbing dan guru_pembimbing
  let tempStudentsUpdate = []
  for(let i=0; i<tempStudents.length; i++) {
    tempStudentsUpdate.push(tempStudents[i].id)
    await client.collection('siswa').update(tempStudents[i].id, { 
      status_pemetaan_pembimbing: true,
      guru_pembimbing: pemetaan.value.pembimbing
    })
  }

  // 4: update multiple relasi pada field siswa di pemetaan_pembimbing dengan yang baru, data yang baru tersimpan pada tempStudentsUpdate
  client.autoCancellation(false)
  let res = await client.collection('pemetaan_pembimbing').update(route.params.id, { siswa: tempStudentsUpdate })
  if(res) {
    form.value.siswa = []
    isSending.value = false
    isSaved.value = true
    navigateTo('/pemetaan/pembimbing')
  }
}

async function getReference() {
  isLoading.value = true
  let res_pemetaan = await client.collection('pemetaan_pembimbing').getOne(route.params.id, {
    filter: `pembimbing.jjm >= 2 && pembimbing.konversi_jjm_ke_jumlah_siswa > 0 && program_keahlian="${prokel}" && pembimbing.role!="admin" && status_pemetaan=false`,
    expand: "pembimbing, siswa",
  })

  // let res_students = await client.collection('siswa').getFullList({
  //   // filter: "program_keahlian='"+prokel+"' && status_pemetaan_pembimbing=false",
  //   // filter: "status_pemetaan_pembimbing=false",
  //   filter: client.filter(`program_keahlian ?= "${prokel}" && status_pemetaan_pembimbing=false`),
  //   sort: "program_keahlian, kelas, nama"
  // })
  let res_students = await client.collection('pemetaan').getFullList({
    // filter: "program_keahlian='"+prokel+"' && status_pemetaan_pembimbing=false",
    // filter: "status_pemetaan_pembimbing=false",
    // filter: client.filter("program_keahlian ?= {:p}", { p: prokel }),
    // filter: client.filter(`program_keahlian ?= "${prokel}" && status_pemetaan_pembimbing=false`),
    filter: `program_keahlian="${prokel}" && siswa.status_pemetaan_pembimbing=false`,
    expand: `siswa, program_keahlian, iduka`,
  })

  if(res_pemetaan && res_students) {
    isLoading.value = false
    pemetaan.value = res_pemetaan
    students.value = res_students
    if (pemetaan.value.expand.siswa) {
      curr_students.value = pemetaan.value.expand.siswa
      // form.value.siswa = curr_students.value
    }
    else curr_students.value = []
  }
}

onMounted(() => {
  getReference()
  client.autoCancellation(false)
  client.collection('pemetaan_pembimbing').subscribe('*', function(e){
    if(e.action == 'update') getReference()
  }, { })
})
</script>
