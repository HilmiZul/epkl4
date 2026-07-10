<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-person-fill"></i> Personalisasi</span>
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
              <input v-model="form.nip" :disabled="form.nama.length < 4" type="text" id="nip" class="form form-control form-control-lg" placeholder="kosongkan jika tidak ada">
            </div>

            <div class="my-4">
              <label for="pangkat_golongan">Pangkat Golongan</label>
              <select v-model="form.pangkat_golongan" :disabled="isLoading" id="pangkat_golongan" class="form form-control form-select form-select-lg" required>
                <option disabled value="">—</option>
                <option value="III/a">III/a</option>
                <option value="III/b">III/b</option>
                <option value="III/c">III/c</option>
                <option value="III/d">III/d</option>
                <option value="IV/a">IV/a</option>
                <option value="IV/b">IV/b</option>
                <option value="IV/c">IV/c</option>
                <option value="IV/d">IV/d</option>
                <option value="IV/e">IV/e</option>
                <option value="IX/IX">IX/IX</option>
              </select>
            </div>

            <div class="my-4">
              <label for="kelompok_mapel">Kelompok Mapel</label>
              <select v-model="form.kelompok_mapel" :disabled="isLoading" id="kelompok_mapel" class="form form-control form-select form-select-lg" required>
                <option disabled value="">—</option>
                <option value="Guru Kejuruan">Guru Kejuruan</option>
                <option value="Guru Umum">Guru Umum</option>
              </select>
            </div>

            <button :disabled="isSending || form.nama.length < 4" class="btn btn-success me-2 border border-2 border-dark">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <span v-if="isSaved" class="ms-2 mb-3"><em>Berhasil tersimpan!</em></span>
          </form>
        </div>
      </div>
    </div>
    <!-- tutup .card-body -->

  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Personalisasi — e-PKL / SMKN 4 Tasikmalaya'})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user?.user.value.role
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let isError = ref(false)

let form = ref({
  nama: user?.user.value.nama,
  nip: user?.user.value.nip,
  pangkat_golongan: '',
  kelompok_mapel: '',
})

if(role != 'jurusan' && role != 'admin' && role != 'guru') navigateTo('/404')

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


async function getTeacherByCurrentLoginId() {
  isLoading.value = true

  let data = await client.collection('teacher_users').getOne(user?.user.value.id, {})

  if(data) {
    form.value = data

    isLoading.value = false
  }
}


onMounted(() => {
  getTeacherByCurrentLoginId()
})
</script>
