<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-person"></i> Personalisasi</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="updatePersonal">
            <div v-if="isError" class="alert alert-danger border border-2 border-dark">Terjadi kesalahan.</div>
            <div class="mb-4">
              <label for="nama">Nama Lengkap</label>
              <input v-model="form.nama" type="text" id="nama" class="form form-control form-control-lg" placeholder="nama lengkap dan gelar" required>
            </div>
            <div class="mb-4">
              <label for="nip">NIP</label>
              <input v-model="form.nip" :disabled="form.nama.length < 3" type="text" id="nip" class="form form-control form-control-lg" placeholder="kosongkan jika tidak ada">
            </div>
            <button :disabled="isSending || form.nama.length < 8" class="btn btn-success me-2 border border-2 border-dark">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <span v-if="isSaved" class="ms-2 mb-3"><em>Berhasil diperbaharui!</em></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Personalisasi — e-PKL / SMKN 4 Tasikmalaya'})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let isError = ref(false)
let form = ref({
  nama: user?.user.value.nama,
  nip: user?.user.value.nip,
})

async function updatePersonal() {
  isSending.value = true
  isSaved.value = false
  isError.value = false
  try {
    let data = await client.collection('teacher_users').update(user.user.value.id, form.value)
    if(data) {
      isSending.value = false
      isSaved.value = true
      isError.value = false
    }
  } catch {
    isSending.value = false
    isSaved.value = false
    isErrorOldPass.value = true
  }
}
</script>
