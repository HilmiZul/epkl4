<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand">Elemen / <span class="text-dark fw-bold">Tambah</span></span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="buatElemenCp">
            <div class="mb-4">
              <label for="elemen">Elemen</label>
              <input v-model="form.elemen" type="text" id="elemen" class="form form-control" placeholder="ketik elemen mapel PKL disini" required>
            </div>
            <div class="my-4">
              <label for="cp">Capaian Pembelajaran</label>
              <textarea :disabled="form.elemen.length < 9" v-model="form.cp" id="cp" rows="4" class="form form-control" placeholder="Pada akhir fase F ..." required></textarea>
            </div>
            <div class="my-4">
              <label for="tujuan">Tujuan</label>
              <textarea :disabled="form.cp.length < 9" v-model="form.tujuan" id="tujuan" rows="4" class="form form-control" placeholder="Menerapkan softskills, menerapkan K3LH, ..." required></textarea>
            </div>
            <button :disabled="isSending || form.elemen.length < 9 || form.cp.length < 9 || form.tujuan.length < 9" class="btn btn-success me-2">
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
useHead({ title: 'Tambah Elemen — e-PKL / SMKN 4 Tasikmalaya.' })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user?.user.value.program_keahlian
let isSaved = ref(false)
let isSending = ref(false)
let form = ref({
  elemen: '',
  cp: '',
  tujuan: '',
  program_keahlian: prokel
})

async function buatElemenCp() {
  isSending.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let res = await client.collection('elemen_cp').create(form.value)
  if(res) {
    isSending.value = false
    isSaved.value = true
    form.value.elemen = ''
    form.value.cp = ''
    form.value.tujuan = ''
  }
}
</script>
