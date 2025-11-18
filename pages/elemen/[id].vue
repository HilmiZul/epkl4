<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" col="5" row="1" />
      <span v-else class="h4 quicksand fw-bold text-muted">Update Elemen / <span class="text-dark">{{ form.elemen }}</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div v-if="isFail" class="alert alert-danger p-2">
            Terjadi error: {{ errMessage }}
          </div>
          <form @submit.prevent="updateElemenCp">
            <div class="mb-4">
              <label for="elemen">Elemen</label>
              <select v-model="form.elemen" class="form form-select form-select-lg" id="elemen" required>
                <option value="">&#8212; Pilih Elemen &#8212;</option>
                <option value="Internalisasi dan penerapan soft skills">Internalisasi dan penerapan soft skills</option>
                <option value="Penerapan hard skills">Penerapan hard skills</option>
                <option value="Peningkatan dan pengembangan hard skills">Peningkatan dan pengembangan hard skills</option>
                <option value="Penyiapan Kemandirian Berwirausaha">Penyiapan Kemandirian Berwirausaha</option>
              </select>
            </div>
            <div class="my-4">
              <label for="cp">Capaian Pembelajaran</label>
              <textarea v-model="form.cp" :disabled="isLoading" id="cp" rows="4" class="form form-control form-control-lg" placeholder="Pada akhir fase F ..." required></textarea>
            </div>
            <div class="my-4">
              <label for="tujuan">Tujuan</label>
              <textarea v-model="form.tujuan" :disabled="isLoading" id="tujuan" rows="4" class="form form-control form-control-lg" placeholder="Menerapkan softskills, menerapkan K3LH, ..." required></textarea>
            </div>
            <button :disabled="isSending || isLoading" class="btn btn-success me-2 border border-2 border-dark">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/elemen" class="btn btn-light border border-2 border-dark">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil tersimpan!</span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Update Elemen — e-PKL / SMKN 4 Tasikmalaya.' })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user?.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let isFail = ref(false)
let errMessage = ref('')
let route = useRoute()
let form = ref({
  elemen: 'loading',
  cp: 'loading',
  tujuan: 'loading',
  program_keahlian: prokel
})
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function updateElemenCp() {
  try {
    isSending.value = true
    isSaved.value = false
    client.autoCancellation(false)
    let res = await client.collection('elemen_cp').update(route.params.id, form.value)
    if(res) {
      isSending.value = false
      isSaved.value = true
      navigateTo('/elemen')
    }
  } catch(error) {
    isSending.value = false
    isSaved.value = false
    isFail.value = true
    errMessage.value = error
  }
}

async function getElemenCpById(loading=true) {
  isLoading.value = loading
  client.autoCancellation(false)
  let res = await client.collection('elemen_cp').getOne(route.params.id)
  if(res) {
    isLoading.value = false
    form.value = res
  }
}

onMounted(() => {
  getElemenCpById()
  client.autoCancellation(false)
  client.collection('elemen_cp').subscribe('*', function(e) {
    if(e.action == 'update') getElemenCpById(false)
  }, {})
})
</script>
