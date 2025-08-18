<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand">
        {{ form.kelas }} / <span class="text-dark fw-bold">{{ form.nama }}</span>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="alert alert-warning shadow-lg border-2 border-dark">
            <h5 class="">Perhatiin!</h5>
            <ul>
              <li>Jika ada nilai rapor yang belum tuntas, silahkan ubah status <strong>Ketuntasan Rapor</strong></li>
              <li>Status <strong>Pemetaan PKL</strong> diubah oleh sistem ketika siswa di petakan ke IDUKA</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
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
            <!-- <div v-if="form.status_pemetaan_pkl" class="mb-3 form-check form-switch">
              <input v-model="form.status_acc_pkl" :checked="form.status_acc_pkl" class="form-check-input" type="checkbox" id="checkAcc" switch>
              <label class="form-check-label" for="checkAcc">
                Diterima tempat PKL?
              </label>
            </div> -->
            <button :disabled="isLoadingSave || isLoading" class="btn btn-success mb-2 me-2">
              <span v-if="isLoadingSave">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/peserta" class="btn btn-light me-2 mb-2">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-grey">Berhasil tersimpan!</em>
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
            <p>Apabila Siswa yang bernama <span class="border-2 border-bottom border-danger pb-1">{{ form.nama }}</span> telah pindah/mengundurkan diri, silahkan hapus!</p>
            <button class="btn btn-danger border-dark" data-bs-toggle="modal" :data-bs-target="`#siswa-${form.id}`">Hapus</button>
            <div class="modal" :id="`siswa-${form.id}`" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
                  <div class="modal-header rounded-0 h4 bg-danger text-white quicksand">
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
let prokel = user.user.value.program_keahlian
let role = user.user.value.role
let route = useRoute()
let isLoading = ref(true)
let isLoadingSave = ref(false)
let isSaved = ref(false)
let student = ref()
let teachers = ref([])
let form = ref({
  id: '',
  nama: '⏳',
  kelas: '⏳',
  status_rapot: false,
  status_pemetaan_pkl: false,
})
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function simpanPerubahan() {
  isLoadingSave.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let data = await client.collection('siswa').update(route.params.id, { status_rapot: form.value.status_rapot })
  if(data) {
    isLoading.value = false
    isLoadingSave.value = false
    isSaved.value = true
  }
}

async function getTeachersByProkelNotAdmin() {
  isLoading.value = true
  let data = await client.collection('teacher_users').getFullList({
    filter: "program_keahlian='"+prokel+"' && role!='admin'"
  })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

async function getStudentById() {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client.collection('siswa').getOne(route.params.id, {
    expand: 'program_keahlian'
  })
  if(data) {
    isLoading.value = false
    form.value = data
  }
}


onMounted(() => {
  getStudentById()
  getTeachersByProkelNotAdmin()
  client.collection('siswa').subscribe('update', function (e) {
    if(e.action == 'update') {
      getStudentById()
      getTeachersByProkelNotAdmin()
    }
  }, {});
})
</script>

<style scoped>
.emoji {
  font-size: 5vw;
}
</style>
