<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana">
        {{ form.nama }} /
        <span class="text-muted">{{ form.kelas }}</span>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4">
          <form @submit.prevent="simpanPerubahan">
            <div class="mb-3 form-check form-switch">
              <input v-model="form.status_rapot" :checked="form.status_rapot" class="form-check-input" type="checkbox" id="checkRapor" switch>
              <label class="form-check-label" for="checkRapor">
                Ketuntasan Rapor
              </label>
            </div>
            <div class="mb-3 form-check form-switch">
              <input :checked="form.status_pemetaan_pkl" disabled class="form-check-input" type="checkbox" id="checkPemetaan" switch>
              <label class="form-check-label" for="checkPemetaan">
                Pemetaan PKL
              </label>
            </div>
            <div v-if="form.status_pemetaan_pkl" class="mb-3 form-check form-switch">
              <input v-model="form.status_acc_pkl" :checked="form.status_acc_pkl" class="form-check-input" type="checkbox" id="checkAcc" switch>
              <label class="form-check-label" for="checkAcc">
                Diterima tempat PKL?
              </label>
            </div>
            <button :disabled="isLoadingSave || isLoading" class="btn btn-dark mb-2">Simpan</button>
            <nuxt-link to="/peserta" class="btn btn-light ms-2 me-2 mb-2">Kembali</nuxt-link>
            <div class="my-3">
              <em v-if="isSaved" class="text-muted">Berhasil tersimpan!</em>
              <em v-if="isLoadingSave" class="text-muted">Bentar lagi menyimpan...</em>
            </div>
          </form>
        </div>
        <div class="col">
          <div class="alert alert-warning shadow-lg border-2 border-dark">
            <h5 class="romana">Perhatian!</h5>
            <ul>
              <li>Peserta PKL adalah siswa Semester 6</li>
              <li>Telah menuntaskan nilai rapor Semester 1 s.d 5</li>
              <li>Status <strong>Pemetaan PKL</strong> diubah oleh sistem ketika siswa di petakan</li>
              <li>Jika ada nilai rapor yang belum tuntas, silahkan ubah status ketuntasan rapor</li>
              <li v-if="form.status_pemetaan_pkl" class="text-success">Mengubah status penerimaan PKL, apabila siswa sudah terpetakan dan diterima di DU/DI tersebut</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let route = useRoute()
let isLoading = ref(true)
let isLoadingSave = ref(false)
let isSaved = ref(false)
let student = ref()
let form = ref({
  nama: '⏳',
  kelas: '⏳',
  status_rapot: false,
  status_pemetaan_pkl: false,
  status_acc_pkl: false,
})

async function simpanPerubahan() {
  isLoadingSave.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let data = await client
    .collection('siswa')
    .update(route.params.id, {
      status_rapot: form.value.status_rapot,
      status_acc_pkl: form.value.status_acc_pkl
    })
  if(data) {
    isLoading.value = false
    isLoadingSave.value = false
    isSaved.value = true
  }
}

async function getStudentById() {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client
    .collection('siswa')
    .getOne(route.params.id, {
      expand: 'program_keahlian'
    })
  if(data) {
    isLoading.value = false
    form.value = data
  }
}

onMounted(() => {
  getStudentById()
  client.collection('siswa').subscribe(route.params.id, function (e) {
    if(e.action == 'update') getStudentById()
  }, {});
})
</script>
