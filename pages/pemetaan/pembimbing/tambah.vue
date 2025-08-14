<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 public-sans text-muted">Pemetaan Pembimbing / <span class="text-grey">Tambah baru</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 public-sans">Perhatiin!</div>
            <ul class="small">
              <li>Jumlah siswa sesuai rasio....</li>
              <li>Jumlah siswa sesuai rasio....</li>
            </ul>
            {{ form.siswa.length }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="buatPemetaan">
            <div class="my-3">
              <label for="pembimbing">Pembimbing (pilih satu)</label>
              <multiselect
                v-model="form.pembimbing"
                :options="teachers"
                :custom-label="({nama}) => `${nama}`"
                track-by="nama"
                label="nama"
                id="pembimbing"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }"><strong>{{ option.nama }}</strong></template>
              </multiselect>
            </div>
            <div class="my-3">
              <label for="pembimbing">Peserta didik (pilih lebih dari satu)</label>
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
              <!-- <multiselect
                v-model="siswa"
                :options="students"
                :multiple="true"
                :taggable="true"
                @tag="addStudentToModel"
                :preserve-search="true"
                :close-on-select="false"
                :clear-on-select="false"
                :custom-label="({nama, kelas}) => `${nama} - ${kelas}`"
                id="multiselect"
                placeholder="Pilih lebih dari satu"
                required>
                <template v-slot:singleLabel="{ option }">
                  <strong>{{ option.nama }}</strong>
                </template>
              </multiselect> -->
            </div>
            <button :disabled="isSending || form.siswa.length < 1 || form.pembimbing.length < 1" class="btn btn-success btn-sm me-2">
              <span v-if="isSending">Sedang memetakan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/pemetaan/pembimbing" class="btn btn-light btn-sm me-2">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-muted">Berhasil tersimpan!</em>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Tambah Pemetaan Pembimbing — e-PKL / SMKN 4 Tasikmalaya."})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let role = user.user.value.role
let teachers = ref([])
let students = ref([])
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let siswa = ref([])
let form = ref({
  pembimbing: '',
  siswa: [],
  program_keahlian: ''
})

function addStudentToModel(newTag) {
  siswa.value
}

async function buatPemetaan() {
  form.value.program_keahlian = prokel
  form.value.pembimbing = form.value.pembimbing.id
  let tempStudents = []
  for(let i=0; i<form.value.siswa.length; i++) {
    tempStudents.push(form.value.siswa[i].id)
  }
  isSending.value = true
  isSaved.value = false
  form.value.siswa = tempStudents
  console.log(form.value)
  let data = await client.collection('pemetaan_pembimbing').create(form.value)
  // ubah status pemetaan guru dan siswa
  await client.collection('teacher_users').update(form.value.pembimbing, { status_pemetaan:true })
  for(let i=0; i<form.value.siswa.length; i++) {
    await client.collection('siswa').update(form.value.siswa[i], { status_pemetaan_pembimbing:true })
  }
  if(data) {
    isSending.value = false
    isSaved.value = true
  }
}

async function getReferences() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_teachers = await client.collection('teacher_users').getFullList({
    filter: "program_keahlian='"+prokel+"' && role!='admin' && status_pemetaan=false",
    sort: "nama"
  })
  let res_students = await client.collection('siswa').getFullList({
    filter: "program_keahlian='"+prokel+"' && status_pemetaan_pembimbing=false",
    sort: "nama"
  })
  if(res_teachers && res_students) {
    isLoading.value = false
    teachers.value = res_teachers
    students.value = res_students
  }
}

onMounted(() => {
  getReferences()
})
</script>
