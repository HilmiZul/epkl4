<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold"><span class="text-muted">Walikelas / </span> Tambah Baru</span>
      <span class="float-end">
        <nuxt-link to="/walikelas" class="btn btn-light btn-sm border border-2 border-dark">Kembali</nuxt-link>
      </span>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div v-if="isError" class="alert alert-danger">
            Terjadi kesalahan. Periksa kembali input form.
          </div>

          <form @submit.prevent="buatWalikelasBaru">
            <div class="mb-4">
              <label for="nama">Nama <span class="text-danger">*</span></label>
              <input v-model="form.nama" type="text" id="nama" class="form form-control form-control-lg" placeholder="nama lengkap dan gelar" required autofocus>
            </div>

            <div class="mb-4">
              <label for="nip">NIP <span class="text-muted">(opsional)</span></label>
              <input v-model="form.nip" type="text" id="nip" class="form form-control form-control-lg" placeholder="NIP apabila ada">
            </div>

            <div class="mb-4">
              <label for="program_keahlian">Program Keahlian <span class="text-danger">*</span></label>
              <select @change="getRombel" v-model="form.program_keahlian" class="form form-select form-select-lg" id="program_keahlian" required>
                <option disabled value="">&#8212;</option>
                <option v-for="item in program_keahlian" :key="item.id" :value="item.id">{{ item.nama }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="rombel">Rombel <span class="text-danger">*</span></label>
              <select v-model="form.rombel" :disabled="isLoading || form.program_keahlian.length < 3" class="form form-select form-select-lg" id="rombel" required>
                <option disabled value="">&#8212;</option>
                <option v-for="item in rombel" :key="item.id" :value="item.id">{{ item.nama }}</option>
              </select>
            </div>

            <button :disabled="isSending || form.nama.length < 3 || form.rombel.length < 4 || form.program_keahlian.length < 3" class="btn btn-dark me-2 border border-2 border-dark me-3">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/walikelas" class="link">Kembali</nuxt-link>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup vapor>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Tambah Walikelas — e-PKL / SMKN 4 Tasikmalaya." })

let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user.user.value.role
let prokel = user.user.value.prokel

let isLoading = ref(true)
let isSending = ref(false)
let isError = ref(false)

let rombel = ref([])
let program_keahlian = ref([])

let form = ref({
  "nama": "",
  "nip": "",
  "rombel": "",
  "program_keahlian": ""
})

async function buatWalikelasBaru() {
  isSending.value = true
  isError.value = false

  try {
    let res = await client.collection('walikelas').create(form.value)

    if(res) {
      isSending.value = false
      isError.value = false
      navigateTo('/walikelas')
    }
  } catch(err) {
    isError.value = true
    isSending.value = false
    console.error(`Terjadi kesalahan: ${err}`)
  }
}

async function getRombel() {
  isLoading.value = true

  let res = await client.collection('rombel').getFullList({
    filter: `program_keahlian="${form.value.program_keahlian}"`,
    sort: `created`
  })

  if(res) {
    rombel.value = res
    isLoading.value = false
  }
}

async function getProkel() {
  isLoading.value = true

  let res = await client.collection('program_keahlian').getFullList({
    sort: `created`
  })

  if(res) {
    program_keahlian.value = res
    isLoading.value = false
  }
}

onMounted(() => {
  getProkel()
})

</script>
