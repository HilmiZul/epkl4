<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold text-muted">IDUKA / <span class="text-dark">Impor dari .csv</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 quicksand">Perhatiin!</div>
            <ul>
              <li>Gunakan fitur impor ini untuk memindahkan daftar IDUKA lama sekaligus</li>
              <li>Sebelum impor, pastikan sesuai dengan format <nuxt-link to="https://docs.google.com/spreadsheets/d/1Q5mfr7UTqWlmkGLVMe8NdYgQfczttdKiYtHJj9GX2gA/edit?usp=sharing" target="_blank" class="link-external">disini</nuxt-link></li>
              <li>Sistem hanya membaca file <code>.CSV</code></li>
              <li>Jika ingin mengubah isi tabel, salin dan ubah ubah KECUALI kolom <code>program_keahlian</code>, kolom <code>pembimbing_sekolah</code> dan kolom <code>terisi</code></li>
              <li>Proses impor akan menambahkan ke data saat ini, tidak menimpa data lama</li>
              <li>Selama proses berlangsung, mohon tunggu sampai muncul pesan <strong>Berhasil tersimpan</strong></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="my-3">
            <label for="file" class="label-berkas p-2 hand-cursor"><i class="bi-filetype-csv"></i> Pilih berkas</label>
            <input @change="getFile" id="file" type="file" accept=".csv" class="form form-control-file">
          </div>
          <div v-if="isLoading" class="mb-3 text-muted">
            <em>Bentar, sedang menyimpan...</em>
          </div>
          <div v-if="isError" class="mb-3 text-muted">
            <div class="strong">Error: Periksa kembali berkas.</div>
          </div>
          <div v-if="idukaTemp.length > 0" class="mb-3 text-muted">
            <div class="strong">Berhasil tersimpan!</div>
          </div>
          <nuxt-link to="/iduka" class="btn btn-light mb-3"><i class="bi bi-arrow-left"></i> Kembali</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
useHead({ title: "Impor IDUKA — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let idukaTemp = ref([])
let isLoading = ref(false)
let isError = ref(false)
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

async function getFile(e) {
  isLoading.value = true
  isError.value = false
  let file = e.target.files.item(0)
  let csv = await file.text()
  const lines = csv.split('\n')
  const result = [];
  let objek = {}
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    // client.autoCancellation(false)
    // let data = await client
    //   .collection('iduka')
    //   .create(obj)
    result.push(obj);
  }
  let res_import = await Promise.all(
    result.map(data => {
      client.collection('iduka').create(data, {'$autoCancel': false })
    })
  )
  if(res_import) {
    isLoading.value = false
    idukaTemp.value = result
  }
}
</script>

<style scoped>
.form-control-file {
  display: none;
}
</style>
