<template>
  <div class="card">
    <div class="card-header">
      <span class="h4">Peserta Didik / Import .csv</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4">
          <div class="mb-3">
            <input @change="getFile" type="file" accept=".csv" class="form form-control-file">
          </div>
          <div v-if="isLoading" class="mb-3 text-muted">
            <em>Bentar, sedang menguraikan...</em>
          </div>
          <div v-if="studentTemp.length > 0" class="mb-3 text-muted">
            <div class="strong">Berhasil tersimpan!</div>
          </div>
          <!-- <button @click="()=>isLoading=!isLoading">tes</button> -->
          <nuxt-link to="/peserta" class="btn btn-dark">Kembali</nuxt-link>
        </div>
        <div class="col-md">
          <div class="alert alert-success border-5 border-dark shadow-lg">
            <p>Lihat format tabel CSV <nuxt-link to="#" class="link">disini</nuxt-link>.</p>
            <div class="h5">Perhatian!</div>
            <ul>
              <li>Sebelum impor, pastikan format kolom sesuai format diatas</li>
              <li>Sistem hanya membaca file <code>.CSV</code> bukan excel/xlsx</li>
              <li>Proses impor akan menambahkan ke data saat ini, tidak menimpa yang lama</li>
              <li>Selama proses menguraikan, mohon tunggu sampai muncul pesan <strong>Berhasil tersimpan</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
let client = usePocketBaseClient()
let studentTemp = ref([])
let isLoading = ref(false)

async function getFile(e) {
  isLoading.value = true
  let file = e.target.files.item(0)
  let csv = await file.text()
  const lines = csv.split('\n')
  const result = [];
  let clean = []
  const headers = lines[0].split(','); // delimiter (atau pemisahnya)

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    let data = await client
      .collection('siswa')
      .create(obj)
    result.push(obj);
  }
  isLoading.value = false
  studentTemp.value = result
}
</script>
