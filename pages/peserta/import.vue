<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana">Peserta Didik / <span class="text-muted">Impor dari .csv</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4">
          <div class="mb-3">
            <label for="file" class="border border-2 border-grey p-2 cursor-pointer"><i class="bi-filetype-csv"></i> Pilih berkas</label>
            <input @change="getFile" id="file" type="file" accept=".csv" class="form form-control-file">
          </div>
          <!-- <label for="customFileInput" class="custom-file-upload">
            Pilih berkas .csv
          </label> -->
          <div v-if="isLoading" class="mb-3 text-muted">
            <em>Bentar, sedang menyimpan...</em>
          </div>
          <div v-if="studentTemp.length > 0" class="mb-3 text-muted">
            <div class="strong">Berhasil tersimpan!</div>
          </div>
          <!-- <button @click="()=>isLoading=!isLoading">tes</button> -->
          <nuxt-link to="/peserta" class="btn btn-dark btn-sm mb-3">Kembali</nuxt-link>
        </div>
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5">Perhatian!</div>
            <ul>
              <li>Tidak perlu impor apabila data peserta didik sudah lengkap</li>
              <li>Sebelum impor, pastikan sesuai dengan format <nuxt-link to="https://docs.google.com/spreadsheets/d/1Q5mfr7UTqWlmkGLVMe8NdYgQfczttdKiYtHJj9GX2gA/edit?usp=sharing" target="_blank" class="link">disini</nuxt-link></li>
              <li>Sistem hanya membaca file <code>.CSV</code></li>
              <li>Jika ingin mengubah isi tabel, silahkan salin dan hanya ubah pada kolom <code>nis</code>, <code>nama</code> dan <code>jk</code></li>
              <li>Proses impor akan menambahkan ke data saat ini, tidak menimpa data lama</li>
              <li>Selama proses berlangsung, mohon tunggu sampai muncul pesan <strong>Berhasil tersimpan</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
let client = usePocketBaseClient()
let studentTemp = ref([])
let isLoading = ref(false)

async function getFile(e) {
  isLoading.value = true
  let file = e.target.files.item(0)
  let csv = await file.text()
  const lines = csv.split('\n')
  const result = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    client.autoCancellation(false)
    let data = await client
      .collection('siswa')
      .create(obj)
    result.push(obj);
  }
  isLoading.value = false
  studentTemp.value = result
}
</script>

<style scoped>
.form-control-file {
  display: none;
}
</style>
