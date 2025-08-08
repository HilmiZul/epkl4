<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana text-grey">
        {{ form.nama }} / {{ form.kelas }}
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="alert alert-warning shadow-lg border-2 border-dark">
            <h5 class="romana">Perhatian!</h5>
            <ul class="small">
              <li>Peserta PKL adalah siswa Semester 6</li>
              <li>Telah menuntaskan nilai rapor Semester 1 s.d 5</li>
              <li>Status <strong>Pemetaan PKL</strong> diubah oleh sistem ketika siswa di petakan</li>
              <li>Jika ada nilai rapor yang belum tuntas, silahkan ubah status ketuntasan rapor</li>
              <li v-if="form.status_pemetaan_pkl" class="text-success">Mengubah status penerimaan PKL, apabila siswa sudah terpetakan dan diterima di IDUKA tersebut</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form @submit.prevent="simpanPerubahan">
            <div class="my-3 form-check form-switch">
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
            <button :disabled="isLoadingSave || isLoading" class="btn btn-dark btn-sm mb-2 me-2">Simpan</button>
            <nuxt-link to="/peserta" class="btn btn-light btn-sm me-2 mb-2">Kembali</nuxt-link>
            <div class="my-3">
              <em v-if="isSaved" class="text-muted">Berhasil tersimpan!</em>
              <em v-if="isLoadingSave" class="text-muted">Bentar lagi menyimpan...</em>
            </div>
          </form>
        </div>
      </div>
      <hr class="my-4">
      <div class="row">
        <!-- <div class="col-2 align-content-center">
          <div class="emoji text-center">🙅🏻‍♂️</div>
        </div> -->
        <div class="col">
          <div class="alert text-danger border-danger">
            <h5 class="romana">Danger Zone!</h5>
            <p class="small">Apabila Siswa yang bernama <span class="border-2 border-bottom border-danger pb-1">{{ form.nama }}</span> telah pindah/mengundurkan diri, silahkan hapus!</p>
            <button class="btn btn-danger btn-sm border-danger" data-bs-toggle="modal" :data-bs-target="`#siswa-${form.id}`">Hapus</button>
            <div class="modal" :id="`siswa-${form.id}`">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-0 border-3 border-dark shadow-lg">
                  <div class="modal-header rounded-0 h4 bg-danger text-white">
                    Peringatan!
                  </div>
                  <div class="modal-body text-dark">
                    Yakin nih mau hapus? pikir-piki dulu deh!
                  </div>
                  <div class="modal-footer">
                    <button class="btn text-dark" data-bs-dismiss="modal">Iya iyaa</button>
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
definePageMeta({
  middleware: ['auth']
})
useHead({ title: "Update Peserta — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let route = useRoute()
let isLoading = ref(true)
let isLoadingSave = ref(false)
let isSaved = ref(false)
let student = ref()
let form = ref({
  id: '',
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

<style scoped>
.emoji {
  font-size: 5vw;
}
</style>
