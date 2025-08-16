<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 public-sans text-muted">Update Elemen / <span class="text-grey">{{ form.elemen }}</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="updateElemenCp">
            <div class="mb-3">
              <label for="elemen">Elemen</label>
              <input v-model="form.elemen" type="text" id="elemen" class="form form-control" placeholder="ketik elemen mapel PKL disini" required>
            </div>
            <div class="my-3">
              <label for="cp">Capaian Pembelajaran</label>
              <textarea v-model="form.cp" id="cp" rows="4" class="form form-control" placeholder="Pada akhir fase F ..." required></textarea>
            </div>
            <div class="my-3">
              <label for="tujuan">Tujuan</label>
              <textarea v-model="form.tujuan" id="tujuan" rows="4" class="form form-control" placeholder="Menerapkan softskills, menerapkan K3LH, ..." required></textarea>
            </div>
            <button :disabled="isSending || isLoading" class="btn btn-success me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/elemen" class="btn btn-light">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic">Berhasil tersimpan!</span>
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
let route = useRoute()
let form = ref({
  elemen: 'loading',
  cp: 'loading',
  tujuan: 'loading',
  program_keahlian: prokel
})

async function updateElemenCp() {
  isSending.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let res = await client.collection('elemen_cp').update(route.params.id, form.value)
  if(res) {
    isSending.value = false
    isSaved.value = true
  }
}

async function getElemenCpById() {
  isLoading.value = true
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
    if(e.action == 'update') getElemenCpById()
  }, {})
})
</script>
