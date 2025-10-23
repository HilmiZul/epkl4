<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" row="1" col="6" />
      <span v-else class="h4 fw-bold text-muted">Validasi Nilai / <span class="text-dark">{{ certificate.expand.siswa.nama }}</span></span>
      <!-- <span v-if="!isLoading" class="float-end">
        <nuxt-link v-if="!isCertificate" to="/nilai/tambah" class="btn btn-info btn-sm"><i class="bi bi-plus-lg"></i> Buat Baru</nuxt-link>
      </span> -->
    </div>
    <div class="card-body">
      <div v-if="isLoading" class="row py-3">
        <div class="col-lg-12">
          <loading-placeholder row="1" col="12" />
        </div>
      </div>
      <div v-else>
        <div v-if="isCertificate" class="row">
          <div class="col-lg-12">
            <form @submit.prevent="updateNilai">
              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="el_1">Nilai Elemen 1</label>
                    <input v-model="form.nilai_elemen1" type="number" min="0" max="100" id="el_1" class="form form-control" required>
                  </div>
                  <div class="mb-4">
                    <label for="el_2">Nilai Elemen 2</label>
                    <input v-model="form.nilai_elemen2" type="number" min="0" max="100" id="el_2" class="form form-control" required>
                  </div>
                  <div class="mb-4">
                    <label for="el_3">Nilai Elemen 3</label>
                    <input v-model="form.nilai_elemen3" type="number" min="0" max="100" id="el_3" class="form form-control" required>
                  </div>
                  <div class="mb-4">
                    <label for="el_4">Nilai Elemen 4</label>
                    <input v-model="form.nilai_elemen4" type="number" min="0" max="100" id="el_4" class="form form-control" required>
                  </div>
                  <div class="mb-4">
                    <div class="badge bg-dark fw-bold p-2 fs-6">Total: {{ form.nilai_elemen1 + form.nilai_elemen2 + form.nilai_elemen3 + form.nilai_elemen4 }}</div>
                  </div>
                  <hr>
                  <!-- <div class="mb-4 form-check form-switch">
                    <input v-model="form.isEntrust" :checked="form.isEntrust" class="form-check-input" type="checkbox" id="entrust" switch>
                    <label for="entrust">Buatkan Sertifikat di Sekolah?</label>
                  </div> -->
                  <div v-if="form.isEntrust">
                    <div class="mb-4">
                      <label for="pj_penandatangan">Pejabat Penandatangan</label>
                      <input v-model="form.pj_penandatangan" type="text" id="pj_penandatangan" class="form form-control" placeholder="Contoh: CEO, Direktur, Kepala Dinas..." required>
                    </div>
                    <div class="mb-4">
                      <label for="logo_iduka">Logo IDUKA</label>
                      <div v-if="tempLogoImg" class="my-2"><img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${tempLogoImg}`" alt="Foto jurnal nilai" width="70"></div>
                      <input @change="compressFileLogo" class="form form-control" type="file" id="logo_iduka" accept="image/*" />
                    </div>
                  </div>
                  <div class="mb-4 form-check form-switch">
                    <input v-model="form.isValid" :checked="form.isValid" class="form-check-input" type="checkbox" id="entrust" switch>
                    <label for="entrust">Tandai valid</label>
                  </div>
                  <button :disabled="isSending" class="btn btn-success me-2 border border-2 border-dark mb-4">
                    <span v-if="isSending">Sedang menyimpan</span>
                    <span v-else>Simpan</span>
                  </button>
                  <nuxt-link to="/nilai" class="btn btn-danger border border-2 border-dark mb-4">Kembali</nuxt-link>
                  <span v-if="isSaved" class="ms-2 mb-4 small fst-italic text-muted fw-bold">Berhasil diperbaharui!</span>
                </div>
                <div class="col-lg-6">
                  <div class="mb-4">
                    <div class="fw-bold pb-2"><i class="bi bi-image-fill"></i> Pratinjau Nilai Elemen</div>
                    <img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${tempNilaiImg}`"
                      data-bs-toggle="modal" data-bs-target="#preview-nilai"
                      alt="Foto jurnal nilai" width="100%" class="border border-2 border-dark mb-2 hand-cursor">
                  </div>
                </div>
              </div>
            </form>
            <!-- Single Modal: Preview foto nilai -->
            <div class="modal" id="preview-nilai">
              <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content rounded-0 border border-3 border-dark shadow-lg text-muted">
                  <div class="modal-header border-bottom border-3 border-dark bg-success rounded-0 fs-4 fw-bold">
                    Preview
                    <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body">
                    <img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${tempNilaiImg}`" alt="preview" width="100%" />
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
import Compressor from 'compressorjs'
definePageMeta({ middleware: 'auth' })
useHead({ title: "Nilai — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let route = useRoute()
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let isError = ref(false)
let isErrorCompressOrExt = ref(false)
let isCertificate = ref(false)
let isLoadingMetaPemetaan = ref(true)
let prokel = user.user.value.program_keahlian
let siswa_id = user.user.value.siswa
let certificate = ref()
let tempLogoImg = ref()
let tempNilaiImg = ref()
let form = ref({
  "nilai_elemen1": 0,
  "nilai_elemen2": 0,
  "nilai_elemen3": 0,
  "nilai_elemen4": 0,
  "logo": "",
  "isValid": ""
})

async function updateNilai() {
  isSending.value = true
  isSaved.value = false
  try {
    let res = await client.collection('nilai').update(route.params.id, form.value)
    if(res) {
      isSending.value = false
      isSaved.value = true
      navigateTo('/nilai')
    }
  } catch(err) {
    isSending.value = false
    isSaved.value = false
    isError.value = true
  }
}

async function getNilai(loading=true, isCert=false) {
  isLoading.value = loading
  isCertificate.value = isCert
  client.autoCancellation(false)
  try {
    let res = await client.collection('nilai').getOne(route.params.id, {
      expand: "iduka, siswa"
    })
    if(res) {
      certificate.value = res
      form.value = res
      tempLogoImg.value = certificate.value.logo
      tempNilaiImg.value = certificate.value.foto_jurnal_nilai
      isLoading.value = false
      isCertificate.value = true
    }
  } catch(error) {
    isLoading.value = false
    isCertificate.value = false
  }
}

function compressFileLogo(e) {
  let file = e.target.files[0]
  if(!file) return
  new Compressor(file, {
    quality: 0.6,
    success(result) {
      form.value.logo = result
    },
    error(err) {
      console.log(err.message)
    }
  })
}

onMounted(() => {
  getNilai()
  client.autoCancellation(false)
  client.collection('nilai').subscribe('*', function(e) {
    // getNilai params:
    // - isLoading nilai default na true
    // - isCert nilai default na false
    if(e.action == 'update') getNilai(false, true)
  },{})
})
</script>
