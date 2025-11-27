<template>
  <div class="card">
    <div class="card-header">
      <loading-placeholder v-if="isLoading" row="1" col="6" />
      <span v-else class="h4 fw-bold text-muted">Validasi / <span class="text-dark">{{ certificate.expand.siswa.nama }}</span></span>
    </div>
    <div v-if="$device.isMobileOrTablet" class="card-body">
      <div class="alert alert-warning">Silahkan gunakan komputer/laptop!</div>
    </div>
    <div v-else class="card-body">
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
                <div class="col-lg-12">
                  <div class="fs-5 fw-bold"><i class="bi bi-buildings"></i>
                    {{ certificate.expand.iduka.nama }}
                    <span v-if="form.isEntrust" class="badge bg-info">Menitip Sertifikat</span>
                  </div>
                  <hr>
                </div>
                <div class="col-lg-12">
                  <div v-if="isSaved" class="alert alert-success">Berhasil diperbaharui!</div>
                </div>
                <div class="col-lg-6">
                  <nav>
                    <div class="nav nav-tabs small" id="nav-tab" role="tablist">
                      <button @click="() => isSaved = false" class="nav-link p-2 active" id="nilai-tab" data-bs-toggle="tab" data-bs-target="#nav-nilai" type="button" role="tab" aria-controls="nav-nilai" aria-selected="true">Nilai</button>
                      <!-- <button @click="() => isSaved = false" class="nav-link p-2" id="presensi-tab" data-bs-toggle="tab" data-bs-target="#nav-deskripsi" type="button" role="tab" aria-controls="nav-deskripsi" aria-selected="false">Deskripsi</button> -->
                      <button @click="() => isSaved = false" class="nav-link p-2" id="presensi-tab" data-bs-toggle="tab" data-bs-target="#nav-presensi" type="button" role="tab" aria-controls="nav-presensi" aria-selected="false">Kehadiran</button>
                      <button @click="() => isSaved = false" v-if="form.isEntrust" class="nav-link p-2" id="sertifikat-tab" data-bs-toggle="tab" data-bs-target="#nav-sertifikat" type="button" role="tab" aria-controls="nav-sertifikat" aria-selected="false">Sertifikat</button>
                    </div>
                  </nav>
                </div>
                <div class="tab-content pt-3" id="nav-tabContent">
                  <!-- pane: nilai -->
                  <div class="tab-pane fade show active" id="nav-nilai" role="tabpanel" aria-labelledby="nav-nilai-tab" tabindex="0">
                    <!-- <div class="alert alert-info mb-3">
                      <div class="fw-bold">Perhatikan!</div>
                      <ul class="mb-0 px-3">
                        <li>Pilih deksripsi disebalah kanan untuk masing-masing item elemen</li>
                        <li>Sesuaikan deskripsi dengan ....</li>
                        <li>text writing ini minta kepada kurikulum...</li>
                      </ul>
                    </div> -->
                    <div data-bs-toggle="modal" data-bs-target="#preview-nilai" class="mb-4 mt-2">
                      <span class="hand-cursor fw-bold text-muted border-bottom border-1 border-dark"><i class="bi bi-eye-fill"></i> Lihat foto nilai</span>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="mb-4">
                          <label for="el_1">Menerapkan soft skills yang dibutuhkan dalam dunia kerja <span class="text-danger">*</span></label>
                          <input v-model="form.nilai_elemen1" type="number" min="0" max="100" id="el_1" class="form form-control form-control-lg" required>
                          <textarea v-model="form.deskripsi_elemen1" class="form form-control" cols="30" rows="6" placeholder="salin deskripsi disamping..."></textarea>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="text-muted">
                          <div class="fw-bold">Pilih deskripsi sesuai capaian</div>
                          Peserta didik sudah memiliki dan
                          <span v-for="(e,i) in deskripsi.elemen1" :key="i">
                            {{ e }}<span v-if="i < deskripsi.elemen1.length-1">, </span>
                          </span>
                        </div>
                        <!-- <div v-for="(e,i) in deskripsi.elemen1" :key="i" class="mb-1 form-check">
                          <label :for="`${i}-${e}`" class="fw-normal">{{ e }}
                            <input v-model="deskripsi_temp1" :value="e" class="form-check-input" type="checkbox" :id="`${i}-${e}`">
                          </label>
                        </div> -->
                      </div>
                    </div>
                    <hr>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="mb-4">
                          <label for="el_2">Menerapkan norma, POS, dan K3LH yang ada pada dunia kerja <span class="text-danger">*</span></label>
                          <input v-model="form.nilai_elemen2" type="number" min="0" max="100" id="el_2" class="form form-control form-control-lg" required>
                          <textarea v-model="form.deskripsi_elemen2" class="form form-control" cols="30" rows="6" placeholder="salin deskripsi disamping..."></textarea>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="text-muted">
                          <div class="fw-bold">Pilih deskripsi sesuai capaian</div>
                          Peserta didik sudah mampu
                          <span v-for="(e,i) in deskripsi.elemen1" :key="i">
                            {{ e }}<span v-if="i < deskripsi.elemen1.length-1">, </span>
                          </span>
                        </div>
                        <!-- <div v-for="(e,i) in deskripsi.elemen2" :key="i" class="mb-1 form-check">
                          <label :for="`${i}-${e}`" class="fw-normal">{{ e }}
                            <input v-model="deskripsi_temp2" :value="e" class="form-check-input" type="checkbox" :id="`${i}-${e}`">
                          </label>
                        </div> -->
                      </div>
                    </div>
                    <hr>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="mb-4">
                          <label for="el_3">Menerapkan kompetensi teknis yang sudah dipelajari di sekolah dan/atau baru dipelajari pada dunia kerja <span class="text-danger">*</span></label>
                          <input v-model="form.nilai_elemen3" type="number" min="0" max="100" id="el_3" class="form form-control form-control-lg" required>
                          <textarea v-model="deskripsi_temp3" readonly class="form form-control" cols="30" rows="6" placeholder="pratinjau deskripsi..."></textarea>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <label for="" class="mb-2 text-muted fw-bold">Pilih deskripsi sesuai capaian</label>
                        <div v-for="(e,i) in deskripsi.elemen2" :key="i" class="mb-1 form-check">
                          <!-- <li>{{ e }}</li> -->
                          <label :for="`${i}-${e}`" class="fw-normal">{{ e }}
                            <input v-model="deskripsi_temp3" :value="e" class="form-check-input" type="checkbox" :id="`${i}-${e}`">
                          </label>
                        </div>
                      </div>
                    </div>
                    <hr>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="mb-4">
                          <label for="el_4">Memahami alur bisnis dunia kerja tempat PKL <span class="text-danger">*</span></label>
                          <input v-model="form.nilai_elemen4" type="number" min="0" max="100" id="el_4" class="form form-control form-control-lg" required>
                          <textarea v-model="deskripsi_temp4" readonly class="form form-control" cols="30" rows="6" placeholder="pratinjau deskripsi..."></textarea>
                        </div>
                        <div class="mb-3">
                          <div class="badge bg-dark fw-bold p-2 fs-6">Total: {{ form.nilai_elemen1 + form.nilai_elemen2 + form.nilai_elemen3 + form.nilai_elemen4 }}</div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <label for="" class="mb-2 text-muted fw-bold">Pilih deskripsi sesuai capaian</label>
                        <div v-for="(e,i) in deskripsi.elemen4" :key="i" class="mb-1 form-check">
                          <!-- <li>{{ e }}</li> -->
                          <label :for="`${i}-${e}`" class="fw-normal">{{ e }}
                            <input v-model="deskripsi_temp4" :value="e" class="form-check-input" type="checkbox" :id="`${i}-${e}`">
                          </label>
                        </div>
                      </div>
                      <!-- <div class="col-lg-6">
                        <div class="mb-4">
                          <div class="fw-bold pb-2"><i class="bi bi-image-fill"></i> Foto Halaman Nilai</div>
                          <div class="container-foto-nilai">
                            <img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${tempNilaiImg}`"
                            data-bs-toggle="modal" data-bs-target="#preview-nilai"
                            alt="Foto jurnal nilai" width="100%" class="border border-2 border-dark mb-2 hand-cursor foto-nilai">
                          </div>
                        </div>
                      </div> -->
                    </div>
                  </div>
                  <!-- pane: deskripsi -->
                  <!-- <div class="tab-pane fade show" id="nav-deskripsi" role="tabpanel" aria-labelledby="nav-nilai-tab" tabindex="0">
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="mb-4">
                          <label for="des_1">Deskripsi 1 <span class="text-danger">*</span></label>
                          <textarea v-model="form.deskripsi_elemen1" id="des_1" rows="5" class="form form-control" placeholder="Contoh: Peserta didik sudah..." required></textarea>
                        </div>
                        <div class="mb-4">
                          <label for="des_1">Deskripsi 2 <span class="text-danger">*</span></label>
                          <textarea v-model="form.deskripsi_elemen2" id="des_2" rows="5" class="form form-control" placeholder="Contoh: Peserta didik sudah..." required></textarea>
                        </div>
                        <div class="mb-4">
                          <label for="des_1">Deskripsi 3 <span class="text-danger">*</span></label>
                          <textarea v-model="form.deskripsi_elemen3" id="des_3" rows="5" class="form form-control" placeholder="Contoh: Peserta didik sudah..." required></textarea>
                        </div>
                        <div class="mb-4">
                          <label for="des_4">Deskripsi 4 <span class="text-danger">*</span></label>
                          <textarea v-model="form.deskripsi_elemen4" id="des_4" rows="5" class="form form-control" placeholder="Contoh: Peserta didik sudah..." required></textarea>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="fw-bold">Elemen PKL</div>
                        <loading-placeholder v-if="isLoadingElemen" row="1" col="6" />
                        <div v-else v-for="(el, i) in elemens" :key="el.id" class="accordion accordion-flush border border-3 border-dark mt-2 mb-3" id="accorElemen">
                          <div class="accordion-item">
                            <h2 class="accordion-header">
                              <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" :data-bs-target="`#elemen-${el.id}`" aria-expanded="false" :aria-controls="`elemen-${el.id}`">
                                <span class="badge text-dark me-2">{{ i+1 }}</span> {{ el.elemen }}
                              </button>
                            </h2>
                            <div :id="`elemen-${el.id}`" class="accordion-collapse collapse" data-bs-parent="#accorElemen">
                              <div class="accordion-body">
                                <div class="fw-bold">Capaian Pembelajaran</div>
                                <p>{{ el.cp }}</p>
                                <div class="fw-bold">Tujuan</div>
                                <p class="pre-text">{{ el.tujuan }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> -->
                  <!-- pane: kehadiran -->
                  <div class="tab-pane fade" id="nav-presensi" role="tabpanel" aria-labelledby="nav-presensi-tab" tabindex="0">
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="mb-4">
                          <label for="sakit">Sakit <span class="text-danger">*</span></label>
                          <input v-model="form.sakit" name="sakit" type="number" min="0" id="sakit" class="form form-control form-control-lg" required>
                        </div>
                        <div class="mb-4">
                          <label for="izin">Izin <span class="text-danger">*</span></label>
                          <input v-model="form.izin" type="number" min="0" id="izin" class="form form-control form-control-lg" required>
                        </div>
                        <div class="mb-4">
                          <label for="tanpa_keterangan">Tanpa keterangan <span class="text-danger">*</span></label>
                          <input v-model="form.tanpa_keterangan" type="number" min="0" id="tanpa_keterangan" class="form form-control form-control-lg" required>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- pane: sertifikat -->
                  <div v-if="form.isEntrust" class="tab-pane fade" id="nav-sertifikat" role="tabpanel" aria-labelledby="nav-sertifikat-tab" tabindex="0">
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="mb-4">
                          <label for="pj_penandatangan">Pejabat Penandatangan <span class="text-danger">*</span></label>
                          <input v-model="form.pj_penandatangan" type="text" id="pj_penandatangan" class="form form-control form-control-lg" placeholder="Contoh: CEO, Direktur, Kepala Dinas..." required>
                        </div>
                        <div class="mb-4">
                          <label for="nama_pj_penandatangan">Nama Pejabat Penandatangan <span class="text-danger">*</span></label>
                          <input :disabled="form.pj_penandatangan < 1" v-model="form.nama_pj_penandatangan" type="text" id="nama_pj_penandatangan" class="form form-control form-control-lg" placeholder="Tulis mama lengkapnya..." required>
                        </div>
                        <div class="mb-4">
                          <label for="nomor_pegawai">Nomor Pegawai</label>
                          <input v-model="form.nomor_pegawai" type="text" id="nomor_pegawai" class="form form-control form-control-lg" placeholder="Kosongkan jika tidak ada">
                        </div>
                        <div class="mb-4">
                          <label for="nomor_sertifikat">Nomor Sertifikat</label>
                          <input v-model="form.nomor_sertifikat" type="text" id="nomor_sertifikat" class="form form-control form-control-lg" placeholder="Kosongkat jika tidak ada">
                        </div>
                        <div class="mb-4">
                          <label for="logo_iduka">Logo IDUKA</label>
                          <div v-if="tempLogoImg" class="my-2"><img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${tempLogoImg}`" alt="Foto jurnal nilai" width="70"></div>
                          <input @change="compressFileLogo" class="form form-control form-control-lg" type="file" id="logo_iduka" accept="image/*" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-6">
                  <div class="border-bottom border-2 border-dark mt-2 mb-4"></div>
                  <!-- <div class="mb-4 form-check form-switch">
                    <input v-model="form.isEntrust" :checked="form.isEntrust" class="form-check-input" type="checkbox" id="entrust" switch>
                    <label for="entrust">Buatkan Sertifikat di Sekolah?</label>
                  </div> -->
                  <div class="mb-4 form-check form-switch">
                    <input v-model="form.isValid" :checked="form.isValid" class="form-check-input" type="checkbox" id="entrust" switch>
                    <label for="entrust">Tandai valid</label>
                  </div>
                  <button :disabled="isSending"
                    class="btn btn-success me-2 border border-2 border-dark mb-4">
                    <span v-if="isSending">Sedang menyimpan</span>
                    <span v-else>Simpan</span>
                  </button>
                  <nuxt-link to="/leger" class="btn btn-light border border-2 border-dark mb-4">Kembali</nuxt-link>
                  <span v-if="isSaved" class="align-content-center text-muted ms-2">Berhasil diperbaharui!</span>
                </div>

              </div>
            </form>
            <!-- Single Modal: Preview foto nilai -->
            <div class="modal" id="preview-nilai">
              <div class="modal-dialog modal-dialog-centered modal-fullscreen">
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
useHead({ title: "Validasi Nilai — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let role = user?.user.value.role
if(role != 'jurusan' && role != 'admin' && role != 'guru') navigateTo('/404')
let route = useRoute()
let isLoading = ref(true)
let isLoadingElemen = ref(true)
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
let elemens = ref('')
let form = ref({
  "nilai_elemen1": 0,
  "nilai_elemen2": 0,
  "nilai_elemen3": 0,
  "nilai_elemen4": 0,
  "logo": "",
  "isValid": "",
  "nama_pj_penandatangan": "",
  "nomor_sertifikat": "",
  "nomor_pegawai": "",
  "sakit": "",
  "izin": "",
  "tanpa_keterangan": "",
  "deskripsi_elemen1": "",
  "deskripsi_elemen2": "",
  "deskripsi_elemen3": '',
  "deskripsi_elemen4": '',
})
let deskripsi = ref({
  elemen1: [],
  elemen2: [],
  elemen3: [],
  elemen4: [],
})
// variable temporary untuk menghimpun deskripsi sementara
// ini dilakukan untuk menghindari null yang disebabkan oleh tipe data JSON dari BE
// deskripsi_temp{i} diinisialisasi dengan [] kosong
let deskripsi_temp1 = ref([])
let deskripsi_temp2 = ref([])
let deskripsi_temp3 = ref([])
let deskripsi_temp4 = ref([])

async function updateNilai() {
  isSending.value = true
  isSaved.value = false
  try {
    // form.value.deskripsi_elemen1 = deskripsi_temp1.value
    // form.value.deskripsi_elemen2 = deskripsi_temp2.value
    form.value.deskripsi_elemen3 = deskripsi_temp3.value
    form.value.deskripsi_elemen4 = deskripsi_temp4.value
    let res = await client.collection('nilai').update(route.params.id, form.value)
    if(res) {
      isSending.value = false
      isSaved.value = true
      // navigateTo('/leger')
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
      // if(form.value.deskripsi_elemen1 == '')
      // form.value.deskripsi_elemen1 = "Peserta didik sudah memiliki soft skill dengan Amat Baik dalam menunjukkan integritas, memiliki etos kerja, menunjukkan kemandirian, menunjukkan kerjasama dan menunjukkan kepedulian sosial dan lingkungan"
      // if(form.value.deskripsi_elemen2 == '')
      // form.value.deskripsi_elemen2 = "Peserta didik sudah mampu menerapkan norma, POS dan K3LH dengan Amat Baik pada penggunaan APD dengan tertib dan benar dan melaksanakan pekerjaan sesuai POS"

      // memindahkan nilai deskripsi_elemen{i} ke variable temporary
      // sebelum di assign, divalidasi terlebih dahulu agar tidak terjadi null dengan mengganti ke default [] kosong
      // deskripsi_temp1.value = form.value.deskripsi_elemen1 || []
      // deskripsi_temp2.value = form.value.deskripsi_elemen2 || []
      deskripsi_temp3.value = form.value.deskripsi_elemen3 || []
      deskripsi_temp4.value = form.value.deskripsi_elemen4 || []
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

async function getElemen() {
  isLoadingElemen.value = true
  client.autoCancellation(false)
  let res = await client.collection('elemen_cp').getFullList({
    filter: `program_keahlian="${prokel}" && elemen!="Lain-lain"`
  })
  if(res) {
    elemens.value = res
    isLoadingElemen.value = false
    for (let i = 0; i < elemens.value.length; i++) {
      if(elemens.value[i].elemen == 'Internalisasi dan penerapan soft skills') {
        deskripsi.value.elemen1.push(elemens.value[i].tujuan)
      }
      else if(elemens.value[i].elemen == 'Penerapan hard skills') {
        deskripsi.value.elemen2.push(elemens.value[i].tujuan)
      }
      else if(elemens.value[i].elemen == 'Peningkatan dan pengembangan hard skills') {
        deskripsi.value.elemen3.push(elemens.value[i].tujuan)
      }
      else if(elemens.value[i].elemen == 'Penyiapan Kemandirian Berwirausaha') {
        deskripsi.value.elemen4.push(elemens.value[i].tujuan)
      }
    }
    // gabungin tujuan hardskill el 2 dan 3 (pengembangan)
    // lalu deskripsi.elemen2 di looping di Peningkatan dan Pengembangan hardskill
    deskripsi.value.elemen2 = deskripsi.value.elemen2.concat(deskripsi.value.elemen3)

  }
}

onMounted(() => {
  getNilai()
  getElemen()
  client.autoCancellation(false)
  client.collection('nilai').subscribe('*', function(e) {
    // getNilai params:
    // - isLoading nilai default na true
    // - isCert nilai default na false
    if(e.action == 'update') getNilai(false, true)
  },{})
})
</script>

<style scoped>
.nav-link {
  color: #4f4f4f;
  transition: none;
}
.nav-link:hover {
  transition: none;
  border-radius: 0;
}
.nav-link.active {
  color: #000;
  font-weight: bold;
  border-left: 2px solid #000;
  border-top: 2px solid #000;
  border-right: 2px solid #000;
  border-radius: 0;
  background-color: #efefef;
}
.container-foto-nilai {
  width: 100%;
  height: 200px;
}
.container-foto-nilai .foto-nilai {
  height: 100%;
  object-fit: cover;
}
.pre-text {
  white-space: pre-wrap;
}
.accordion .accordion-header .accordion-button {
  box-shadow: none !important;
}
</style>
