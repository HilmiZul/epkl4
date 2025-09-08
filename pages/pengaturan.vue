<template>
  <div class="card">
    <div class="card-header">
      <span class="h4"><i class="bi bi-sliders"></i> Pengaturan</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="updatePengaturan">
            <div class="mb-3">
              <label for="no">Nomor Surat</label>
              <input v-model="form.nomor_surat" id="no" type="text" class="form form-control" placeholder="masukkan nomor surat permohonan PKL" required>
            </div>
            <div class="mb-3">
              <label for="rentang_pelaksanaan">Rentang Pelaksanaan</label>
              <input v-model="form.rentang_pelaksanaan"  id="rentang_pelaksanaan" type="text" class="form form-control" placeholder="misal: 11 Januari sampai dengan 20 April 2026" required>
            </div>
            <div class="mb-3">
              <label for="npsn">NPSN</label>
              <input v-model="form.npsn" id="npsn" type="text" class="form form-control" placeholder="masukkan NPSN Sekolah" required>
            </div>
            <div class="mb-3">
              <label for="sekolah">Nama Sekolah</label>
              <input v-model="form.nama_sekolah" id="sekolah" type="text" class="form form-control" placeholder="masukkan nama Sekolah" required>
            </div>
            <div class="mb-3">
              <label for="kepala">Kepala Sekolah</label>
              <input v-model="form.nama_kepala_sekolah" id="kepala" type="text" class="form form-control" placeholder="masukkan nama Kepala Sekolah" required>
            </div>
            <div class="mb-3">
              <label for="nip">NIP Kepala Sekolah</label>
              <input v-model="form.nip" id="nip" type="text" class="form form-control" placeholder="masukkan NIP Kepala Sekolah" required>
            </div>
            <div class="mb-3">
              <span v-if="form.logo" class="me-3"><img :src="`${host}/api/files/${form.collectionId}/${form.id}/${form.logo}`" alt="logo" class="logo"></span>
              <label for="logo" class="label-berkas p-2 hand-cursor"><i class="bi-filetype-png"></i> Unggah logo</label>
              <input id="logo" type="file" accept="image/png" class="form form-control-file">
            </div>
            <button :disabled="isSending" class="btn btn-success me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <span v-if="isSaved" class="text-grey fst-italic">Berhasil tersimpan!</span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Pengaturan — e-PKL / SMKN 4 Tasikmalaya." })
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let user = usePocketBaseUser()
if(user?.user.value.role != 'tu' && user?.user.value.role != 'admin') navigateTo('/404')
let client = usePocketBaseClient()
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let form = ref({
  "npsn": "",
  "nama_sekolah": "",
  "nama_kepala_sekolah": "",
  "nip": "",
  "nomor_surat": "",
  "logo": "",
  "rentang_pelaksanaan": ''
})

async function updatePengaturan() {
  isLoading.value = true
  isSending.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let res = await client.collection('pengaturan').update("pt7b25ofddwhngp", form.value)
  if(res) {
    isLoading.value = false
    isSending.value = false
    isSaved.value = true
  }
}

async function getPengaturan() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('pengaturan').getOne("pt7b25ofddwhngp")
  if(res) {
    isLoading.value = false
    form.value = res
  }
}

onMounted(() => {
  getPengaturan()
  client.autoCancellation(false)
  client.collection('pengaturan').subscribe('*', function(e) {
    if(e.action == 'update') getPengaturan()
  }, {})
})
</script>

<style scoped>
.form-control-file {
  display: none;
}
.logo {
  width: 100px;
}
</style>
