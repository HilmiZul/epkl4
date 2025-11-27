<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand text-muted">Update Pemetaan Pembimbing ></span>
      <span v-if="!isLoading" class="h4 quicksand text-grey">{{ pemetaan.expand.pembimbing.nama }}</span>
      <p v-else class="placeholder-glow"><span class="placeholder col-3"></span></p>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Perhatiin!</div>
            <ul class="small">
              <li>Perubahan ini akan menambahkan ke daftar peserta yang dibimbing saat ini</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="isLoading"><Loading /></div>
      <div v-else class="row">
        <div class="col-md-6 mb-3">
          <form @submit.prevent="updatePemetaan">
            <div class="my-3">
              <label for="pembimbing">Ubah Pemilihan peserta? (pilih lebih dari satu)</label>
              <multiselect
                v-model="form.siswa"
                :options="students"
                :multiple="true"
                :close-on-search="false"
                :clear-on-select="false"
                :custom-label="({nama, kelas}) => `${nama} - ${kelas}`"
                id="pembimbing"
                placeholder="Pilih lebih dari satu"
                label="nama"
                track-by="nama"
                required>
              </multiselect>
            </div>
            <button :disabled="isSending || form.siswa.length < 1" class="btn btn-success me-2 border border-2 border-dark">
              <span v-if="isSending">Sedang memetakan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/pemetaan/pembimbing" class="btn btn-light me-2 border border-2 border-dark">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-muted">Berhasil tersimpan!</em>
          </form>
        </div>
        <div class="col-md-6">
          <div class="alert alert-info shadow-lg">
            <div class="mb-2">Peserta yang dibimbing saat ini</div>
            <table class="table border-0">
              <tbody>
                <tr v-if="curr_students?.length < 1"><td class="fst-italic">Belum dipasangkan dengan Peserta didik</td></tr>
                <tr v-else v-for="student in curr_students" :key="student.id">
                  <td>{{ student.nama }}</td>
                  <td>{{ student.kelas }}</td>
                </tr>
              </tbody>
            </table>
            <span class="small text-grey">{{ curr_students?.length }} peserta</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Update Pemetaan Pembimbing — e-PKL / SMKN 4 Tasikmalaya." })
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
if(role == 'guru' || role == 'tu') navigateTo('/404')

async function updatePemetaan() {
  isSending.value = true
  isSaved.value = false
  let tempStudents = curr_students.value.concat(form.value.siswa)
  // console.log(tempStudents)
  let tempStudentsUpdate = []
  for(let i=0; i<tempStudents.length; i++) {
    tempStudentsUpdate.push(tempStudents[i].id)
    await client.collection('siswa').update(tempStudents[i].id, { status_pemetaan_pembimbing: true })
  }
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
    expand: "pembimbing, siswa"
  })
  let res_students = await client.collection('siswa').getFullList({
    filter: "program_keahlian='"+prokel+"' && status_pemetaan_pembimbing=false",
    sort: "kelas, nama"
  })
  if(res_pemetaan && res_students) {
    isLoading.value = false
    pemetaan.value = res_pemetaan
    students.value = res_students
    if(pemetaan.value.expand.siswa) curr_students.value = pemetaan.value.expand.siswa
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
