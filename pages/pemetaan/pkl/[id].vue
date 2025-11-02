<template>
  <div class="card">
    <div v-if="pemetaan?.status_acc_pkl" v-confetti class="posiiton-absolute top-0 start-50 translate-middle-x"></div>
    <div class="card-header">
      <loading-placeholder v-if="isLoading" col="5" row="1" />
      <span v-else class="h4 quicksand fw-bold text-muted">
        {{ pemetaan.expand.siswa.nama }} <i class="bi bi-chevron-right"></i> <span class="text-dark">{{ pemetaan.expand.iduka.nama }}</span>
      </span>
    </div>
    <div class="card-body">
      <div v-if="isLoading">
        <loading-placeholder v-if="isLoading" col="12" row="1" />
      </div>
      <div v-else class="row">
        <div v-if="pemetaan?.status_acc_pkl" class="col-md-12">
          <div class="alert alert-info border border-2 border-dark quicksand text-center py-5 fs-4">
            <span class="fw-bold">{{ pemetaan.expand.siswa.nama }}</span> diterima PKL di <span class="fw-bold">{{ pemetaan.expand.iduka.nama }}</span>!
          </div>
          <div v-if="pemetaan?.status_acc_pkl" class="my-3">
            <nuxt-link to="/pemetaan/pkl" class="btn btn-light border border-2 border-dark"><i class="bi bi-arrow-left"></i> Kembali</nuxt-link>
          </div>
        </div>
        <div v-else class="col-md-6">
          <div v-if="isFail"  class="alert alert-danger p-2 mb-0 mt-2">
            Terjadi error: {{ errMessage }}
          </div>
          <form @submit.prevent="updatePemetaan">
            <div class="mb-4">
              <label for="wilayah">Wilayah</label>
              <!-- <multiselect
                v-model="selectWilayah"
                :options="wilayah"
                @select="getCompanies"
                placeholder="dalam atau luar kota?"
                required>
              </multiselect> -->
              <select @change="getCompanies" v-model="selectWilayah" id="wilayah" class="form form-control form-select form-select-lg" required>
                <option value="dalam" selected>Dalam kota</option>
                <option value="luar">Luar kota</option>
              </select>
            </div>
            <div class="mb-4">
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
            <button :disabled="isSending || form.iduka.length < 1" class="btn btn-success me-2 mb-3 border border-2 border-dark">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <nuxt-link to="/pemetaan/pkl" class="btn btn-light me-2 mb-3 border border-2 border-dark">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-2 mb-3 fst-italic text-grey small">Berhasil dipetakan ulang!</span>
          </form>
        </div>
        <div class="col-lg-6">
          <div class="row">
            <div v-if="!pemetaan.status_acc_pkl" class="col-md-12">
              <div class="alert alert-info border-5 border-dark">
                <div class="h5 quicksand">Transfer Pemetaan</div>
                <ul class="mb-0">
                  <li>Tentukan wilayah luar/dalam kota</li>
                  <li>Pilih target IDUKA</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-4">
      <loading-placeholder v-if="isLoading" col="12" row="1" />
      <div v-else class="row">
        <div class="col-md-12">
          <div class="alert text-danger border-danger">
            <h5 class="fw-bold">Danger Zone!</h5>
            <p class="mb-0">Apabila Pemetaan ini dihapus, maka harus buat pemetaan ulang!</p>
            <p class="pt-0">Usahakan <strong>TIDAK</strong> menghapus/memindahkan peserta ini apabila sudah diterima.</p>
            <button class="btn btn-danger border border-2 border-dark" data-bs-toggle="modal" :data-bs-target="`#pemetaan-${route.params.id}`">Hapus</button>
            <div class="modal" :id="`pemetaan-${route.params.id}`" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                  <div class="modal-header rounded-0 h4 bg-danger fw-bold border-bottom border-3 border-dark">
                    Peringatan!
                  </div>
                  <div class="modal-body text-dark">
                    Yakin nih mau hapus <strong>{{ pemetaan?.expand.siswa.nama }}</strong> dari Pemetaan?
                  </div>
                  <div class="modal-footer border-0 justify-content-center">
                    <button @click="hapusData(pemetaan.id)" class="btn btn-danger border border-2 border-dark" data-bs-dismiss="modal">Hapus</button>
                    <button class="btn btn-light border border-2 border-dark" data-bs-dismiss="modal">Gajadi</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { vConfetti } from '@neoconfetti/vue'
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
let isFail = ref(false)
let errMessage = ref('')
let selectWilayah = ref('')
let companies = ref([])
let form = ref({
  iduka: '',
})
let wilayah = ref(['dalam', 'luar'])

async function hapusData(id) {
  try {
    // let curr_terisi = pemetaan.value.expand.iduka.terisi
    client.autoCancellation(false)
    let new_terisi = pemetaan.value.expand.iduka.terisi - 1
    await client.collection('siswa').update(pemetaan.value.siswa, {
      status_pemetaan_pkl: false,
      status_acc_pkl: false
    })
    await client.collection('iduka').update(pemetaan.value.iduka, { terisi: new_terisi })
    await client.collection('pemetaan').delete(id)
    navigateTo("/pemetaan/pkl")
    // console.log("Terisi saat ini: "+curr_terisi)
    // console.log("Terisi terbaru: "+new_terisi)
    // console.log("ID peserta: "+pemetaan.value.siswa)
    // console.log("ID pemetaan: "+id)
  } catch(error) {
    isFail.value = true
    errMessage.value = errMessage
  }
}

async function updatePemetaan() {
  try {
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
    client.autoCancellation(false)
    let data = await client.collection("pemetaan").update(route.params.id, form.value)
    // -1 kolom `terisi` iduka lama
    // +1 kolom `terisi` iduka baru
    await client.collection("iduka").update(pemetaan.value.iduka, { terisi: updateTerisi_lama })
    await client.collection("iduka").update(form.value.iduka, { terisi: updateTerisi_baru })
    if(data) {
      isSending.value = false
      isSaved.value = true
      navigateTo('/pemetaan/pkl')
      // status_pemetaan_pkl=true
      // await client.collection("siswa").update(form.value.siswa, { status_pemetaan_pkl: true })
    }
  } catch(error) {
    isSending.value = false
    isSaved.value = false
    isFail.value = true
    errMessage.value = errMessage
  }
}

async function getSingleMapping(loading=true) {
  isLoading.value = loading
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
  client.collection('pemetaan').subscribe('*', function (e) {
    if(e.action == 'update') {
      getSingleMapping(false)
      getCompanies()
    }
  }, {})
})
</script>
