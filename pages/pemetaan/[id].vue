<template>
  <div class="card">
    <div class="card-header">
      <span v-if="!isLoading" class="h4 romana text-grey">{{ pemetaan.expand.siswa.nama }} > {{ pemetaan.expand.iduka.nama }}</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="updatePemetaan">
            <div class="mb-3">
              <label for="wilayah">Wilayah (dalam/luar kota)</label>
              <!-- <multiselect
                v-model="selectWilayah"
                :options="wilayah"
                @select="getCompanies"
                placeholder="dalam atau luar kota?"
                required>
              </multiselect> -->
              <select @change="getCompanies" v-model="selectWilayah" id="wilayah" class="form form-control form-select" required>
                <option value="dalam" selected>Dalam kota</option>
                <option value="luar">Luar kota</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="iduka">IDUKA</label>
              <multiselect
                v-model="form.iduka"
                :options="companies"
                :modelValue="integer"
                :clear-on-select="false"
                :custom-label="({nama, jumlah_kuota, terisi}) => `${nama} — ${terisi} dari ${jumlah_kuota}`"
                track-by="nama"
                label="nama"
                id="iduka"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }"><strong>{{ option.nama }} / {{ option.terisi }} dari {{ option.jumlah_kuota }}</strong></template>
              </multiselect>
            </div>
            <button :disabled="isSending || form.iduka.length < 1" class="btn btn-dark btn-sm me-2">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pemetaan" class="btn btn-light btn-sm me-2">Kembali</nuxt-link>
            <em v-if="isSaved" class="text-muted">Berhasil terpetakan!</em>
          </form>
        </div>
        <div class="col">
          <div class="alert alert-warning border-5 border-dark shadow-lg">
            <div class="h5 romana">Perhatian!</div>
            <ul class="small">
              <li>Tentukan wilayah untuk mengubah IDUKA</li>
              <li>IDUKA yang muncul hanya yang masih kosong</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Update Pemetaan — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let route = useRoute()
let prokel = user.user.value.program_keahlian
let pemetaan = ref()
let isLoading = ref(true)
let isLoadingCompanies = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let selectWilayah = ref('')
let companies = ref([])
let form = ref({
  iduka: '',
})
let wilayah = ref(['dalam', 'luar'])

async function updatePemetaan() {
  isSending.value = true
  isSaved.value = false
  let updateTerisi_lama = pemetaan.value.expand.iduka.terisi - 1
  let updateTerisi_baru = form.value.iduka.terisi + 1
  form.value.iduka = form.value.iduka.id
  // console.log("lama: "+pemetaan.value.iduka)
  // console.log(form.value) // pemetaan yang baru
  // console.log("---") // lanjut masukkan yang ada dalam console.log ini ke query
  // console.log("lama: "+updateTerisi_lama)
  // console.log("baru: "+updateTerisi_baru)
  // client.autoCancellation(false)
  let data = await client.collection("pemetaan").update(route.params.id, form.value)
  // -1 kolom `terisi` iduka lama
  // +1 kolom `terisi` iduka baru
  await client.collection("iduka").update(pemetaan.value.iduka, { terisi: updateTerisi_lama })
  await client.collection("iduka").update(form.value.iduka, { terisi: updateTerisi_baru })
  if(data) {
    isSending.value = false
    isSaved.value = true
    // status_pemetaan_pkl=true
    // await client.collection("siswa").update(form.value.siswa, { status_pemetaan_pkl: true })
  }
}

async function getSingleMapping() {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client.collection("pemetaan").getOne(route.params.id, {
    filter: "program_keahlian='"+prokel+"'",
    expand: "iduka, siswa"
  })
  if(data) {
    isLoading.value = false
    pemetaan.value = data
  }
}

async function getCompanies() {
  isLoadingCompanies.value = true
  client.autoCancellation(false)
  // nunggu sampe data pemetaan dimuat, karena ada filter iduka berdasarkan pemetaan.iduka
  if(pemetaan.value) {
    let data = await client.collection("iduka")
      .getFullList({
        filter: "wilayah='"+selectWilayah.value+"' && program_keahlian='"+prokel+"' && id!='"+pemetaan.value.iduka+"' && terisi < jumlah_kuota",
      })
    if(data) {
      isLoadingCompanies.value = false
      companies.value = data
    }
  }
}

onMounted(() => {
  getSingleMapping()
  getCompanies()
  client.collection('pemetaan').subscribe(route.params.id, function (e) {
    if(e.action == 'update') getSingleMapping()
  }, {});
})
</script>
