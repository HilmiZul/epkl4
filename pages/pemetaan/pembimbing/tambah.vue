<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold"><span class="text-muted">Pemetaan Pembimbing /</span> Tambah baru</span>
      <span class="float-end">
        <NuxtLink to="/pemetaan/pembimbing" class="btn btn-light btn-sm border border-2 border-dark">kembali</NuxtLink>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 mb-3">
          <form @submit.prevent="buatPemetaan">
            <div class="mb-4">
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
            <div class="mb-4">
              <label for="siswa">Peserta didik (pilih lebih dari satu)</label>
              <multiselect
                v-model="form.siswa"
                :options="students"
                :multiple="true"
                :close-on-search="false"
                :clear-on-select="false"
                :disabled="!form.pembimbing || form.pembimbing.konversi_jjm_ke_jumlah_siswa == form.siswa.length"
                :custom-label="({nama, kelas}) => `${nama} - ${kelas}`"
                id="siswa"
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
            <button :disabled="isSending || !form.siswa || !form.pembimbing" class="btn btn-dark me-3 border border-2 border-dark">
              <span v-if="isSending">Sedang memetakan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/pemetaan/pembimbing" class="link">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-muted">Berhasil tersimpan!</em>
          </form>
        </div>

        <div class="col-md-6">
          <div v-if="form.pembimbing" class="row">
            <div class="col-md-6">
              <div class="alert">
                <div class="fs-4 fw-bold">{{ form.pembimbing?.jjm }}</div>
                JP
              </div>
            </div>

            <div class="col-md-6">
              <div class="alert">
                <div class="fs-4 fw-bold">{{ form.pembimbing.konversi_jjm_ke_jumlah_siswa }}</div>
                Peserta
              </div>
            </div>

            <div class="col-md-12">
              <div :class="`alert ${form.siswa.length == form.pembimbing.konversi_jjm_ke_jumlah_siswa ? 'text-bg-dark' : 'alert-secondary'}`">
                <div class="fs-4 fw-bold">{{ form.siswa.length }}</div>
                <span v-if="form.siswa.length < form.pembimbing.konversi_jjm_ke_jumlah_siswa">dari {{ form.pembimbing.konversi_jjm_ke_jumlah_siswa }} Peserta</span>
                <span v-else>Peserta akan dibimbing</span>
              </div>
            </div>

            <!-- <div class="text-muted mb-3"><span class="fw-bold">{{ form.pembimbing?.nama }}</span> akan membimbing {{ form.siswa.length }} peserta:</div> -->
            <ul v-for="(s,i) in form.siswa" :key="s.id" class="list-group list-group-flush">
              <li class="list-group-item">
                </br><button @click="()=>form.siswa.splice(i, 1)" class="border-0 bg-transparent float-end">X</button>
                {{ s.nama }} <br>
                <span class="small text-muted">{{ s.kelas }}</span>
              </li>
            </ul>
          </div>
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

if(role == 'guru' || role == 'tu') navigateTo('/404')


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
  let data = await client.collection('pemetaan_pembimbing').create(form.value)
  // ubah status pemetaan guru dan siswa
  await client.collection('teacher_users').update(form.value.pembimbing, { status_pemetaan:true })
  for(let i=0; i<form.value.siswa.length; i++) {
    await client.collection('siswa').update(form.value.siswa[i], { status_pemetaan_pembimbing:true })
  }
  if(data) {
    isSending.value = false
    isSaved.value = true
    navigateTo('/pemetaan/pembimbing')
  }
}

async function getReferences() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_teachers = await client.collection('teacher_users').getFullList({
    filter: `jjm >= 2 && konversi_jjm_ke_jumlah_siswa > 0 && program_keahlian="${prokel}" && role!="admin" && status_pemetaan=false`,
    expand: `program_keahlian`,
    sort: "nama"
  })
  let res_students = await client.collection('siswa').getFullList({
    // filter: "program_keahlian='"+prokel+"' && status_pemetaan_pembimbing=false",
    filter: "status_pemetaan_pembimbing=false",
    sort: "program_keahlian, kelas, nama"
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
