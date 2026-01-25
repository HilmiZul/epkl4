<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-journals"></i> Jurnal</span>
    </div>
    <div class="card-body">
      <loading-placeholder v-if="isLoadingJournals" col="12" row="1" />
      <div v-else-if="count_not_valid > 0" class="alert alert-warning">
        Ada <span class="fw-bold">{{ count_not_valid }}</span> Jurnal yang belum divalidasi
      </div>
      <div class="row">
        <div class="col-md-7 p-0">
          <div v-if="!isLoadingJournals" class="mb-2 text-center text-muted smallest">
            <!--<span v-if="journals.totalItems" class="float-start">Halaman {{ journals.page }} dari {{ journals.totalPages }}</span>-->
            <span v-if="journals.totalItems" class="badge text-dark"><span class="fw-bold">{{ journals.totalItems }}</span> Jurnal</span>
            <!-- <span v-if="journals.totalItems">Menampilkan {{ journals.items.length }}  dari {{ journals.totalItems }} Jurnal</span> -->
          </div>
          <div class="row">
            <div class="col-md-12">
              <!-- Menunggu jurnal termuat -->
              <LoadingPlaceholder v-if="isLoadingJournals" col="12" row="1" />
              <!-- is jurnal kosong? -->
              <div v-else-if="!isLoadingJournals && journals?.totalItems == 0" class="text-center text-muted">
                <div class="pt-5"><i class="bi bi-database-fill fs-1"></i></div>
                <div class="fs-4">Belum ada jurnal</div>
              </div>
              <div v-else v-for="journal in journals.items" :key="journal.id" class="card jurnal-hover jurnal-item no-shadow">
                <div class="card-body">
                  <div class="bookmark fs-2">
                    <div class="bookmark-icon text-danger" v-if="journal.expand.elemen.elemen == 'Lain-lain'"><i class="bi bi-bookmark-fill"></i></div>
                    <div class="bookmark-icon text-info" v-else><i class="bi bi-bookmark-fill"></i></div>
                  </div>
                  <div class="mt-3">
                    <strong class="fs-6">{{ journal.expand.siswa.expand.siswa.nama }}</strong> {{ journal.expand.siswa.expand.siswa.currentMood?.emoji }} &bull; {{ journal.expand.iduka.nama }}
                  </div>
                  <div class="my-2 smallest fw-bold text-muted">
                    <span v-if="journal.expand.elemen.elemen == 'Lain-lain'">{{ journal.expand.elemen.elemen }}</span>
                    <span v-else>{{ journal.expand.elemen.elemen }}</span>
                  </div>
                  <div class="text-muted smallest"><i class="bi bi-calendar2-date"></i> {{ journal.created }}</div>
                  <article class="my-3 pre-text">
                    {{ journal.deskripsi }}
                  </article>
                  <div v-if="journal.foto" class="my-3 foto-container hand-cursor" data-bs-toggle="modal" :data-bs-target="`#foto-${journal.id}`">
                    <img :src="`${host}/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`" :alt="journal.deskripsi" class="foto" />
                  </div>

                  <div class="float-start fs-5 me-3">
                    <span v-if="journal.isValid" @click="handleValidasi(journal.id, journal.isValid)" class="hand-cursor text-muted"><span class="text-danger"><i class="bi bi-heart-fill"></i></span></span>
                    <span v-else @click="handleValidasi(journal.id, journal.isValid)" class="hand-cursor"><span class="text-danger"><i class="bi bi-heart"></i></span></span>
                  </div>

                  <span v-if="journal.isComment" @click="getKomentarByIdJurnal(journal)" data-bs-toggle="modal" data-bs-target="#modal-lihat-komentar" class="float-end text-muted small hand-cursor">
                    <i class="bi bi-chat-left-fill"></i> Lihat komentar
                  </span>
                  <span v-else @click="setModalKomentar(journal)" data-bs-toggle="modal" data-bs-target="#modal-komentar" class="float-end text-muted small hand-cursor">
                    <i class="bi bi-chat-left"></i> Komentarin
                  </span>

                  <!-- <span class="fst-italic text-muted">memvalidasi...</span> -->
                </div>

                <!-- MODAL FOTO PREVIEW -->
                <div v-if="journal.foto" class="modal" :id="`foto-${journal.id}`">
                  <div class="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                      <div class="modal-header bg-success rounded-0 border-bottom border-3 border-dark fs-4 fw-bold">
                        Preview
                        <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                      </div>
                      <div class="modal-body p-0">
                        <img :src="`${host}/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`" :alt="journal.deskripsi" class="foto-preview" />
                      </div>
                    </div>
                  </div>
                </div>
               
                <!-- single modal: komentar -->
                <div class="modal" id="modal-komentar">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                      <div class="modal-header bg-success rounded-0 border-bottom border-3 border-dark fs-4 fw-bold">
                        Beri Komentar
                        <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="mb-4">
                          <textarea v-model="formKomentar.komentar" name="komentar" id="komentar" rows="4" class="form form-control form-lg" placeholder="berikan motivasi/apresiasi..." required></textarea>
                        </div>
                        <button @click="handleComment" :disabled="formKomentar.komentar.length < 4" class="btn btn-success border border-2 border-dark" data-bs-dismiss="modal">
                          Kirim
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- single modal: lihat komentar -->
                <div class="modal" id="modal-lihat-komentar">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                      <div class="modal-body">
                        <loading-placeholder v-if="isLoadingKomentar" row="1" col="12" /> 
                        <div v-else>
                          <div v-if="pratinjauKomentar" class="text-muted small">{{ pratinjauKomentar.created }}</div>
                          <div v-if="pratinjauKomentar.isOpen" class="text-muted fst-italic small">
                            <i class="bi bi-check-all"></i> Dibaca
                          </div>
                          <div v-if="pratinjauKomentar" class="my-2 pre-text">
                            {{ pratinjauKomentar.komentar }}
                          </div>
                          <span class="float-end text-muted fw-bold mt-3 hand-cursor" data-bs-dismiss="modal">Tutup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div class="row my-4 mb-4">
                <div v-if="!isLoadingJournals" class="col-md-12">
                  <loading-placeholder v-if="isMovingPage" row="1" col="12" />
                  <!--<div v-else>
                    <div v-if="journals || isMovingPage" class="text-muted smallest mb-2">
                      <span v-if="journals.totalItems">Halaman {{ journals.page }} dari {{ journals.totalPages }}</span>
                    </div>
                  </div>
                  <button v-if="journals.totalItems" :disabled="isMovingPage || journals.page < 2" @click="pagination(journals.page - 1, false)" class="btn btn-info me-2 border border-2 border-dark">
                    <i class="bi bi-arrow-left"></i> sebelumnya
                  </button>-->
                  <div class="text-center">
                    <button v-if="journals.totalItems" :disabled="isMovingPage || journals.page >= journals.totalPages" @click="pagination(journals.page + 1, false)" class="btn btn-info border border-2 border-dark">
                      muat lagi <i class="bi bi-arrow-down"></i>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="sticky">
            <div class="mb-4">
              <label for="filter">Filter Tanggal</label>
              <input @change="getJournals" v-model="tanggal" type="date" id="filter" class="form form-control picker">
            </div>
            <div class="mb-4">
              <label for="filter-peserta">Filter IDUKA</label>
              <select @change="getJournals" v-model="opsiIduka" name="filter-iduka" id="filter-iduka" class="form form-select">
                <option value="">&#8212; Semua &#8212;</option>
                <option v-for="i in iduka" :key="i.id" :value="i.id">{{ i.nama }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="filter-peserta">Filter Peserta</label>
              <select @change="getJournals" v-model="opsiPeserta" name="filter-peserta" id="filter-peserta" class="form form-select">
                <option value="">&#8212; Semua &#8212;</option>
                <option v-for="student in students" :key="student.id" :value="student.siswa">{{ student.expand.siswa.nama }}</option>
              </select>
            </div>
            <loading-placeholder v-if="isLoadingJournals" col="12" row="1" />
            <div v-if="count_sesuai > 0 || count_tidak_sesuai > 0" class="row justify-content-center">
              <jurnal-chart :countSesuai="count_sesuai" :countTidakSesuai="count_tidak_sesuai" />
            </div>
          </div>
        </div>
      </div>
      <!-- ./jurnal -->
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal Peserta — e-PKL / SMKN 4 Tasikmalaya." })
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
let tanggal = ref('')
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoadingJournals = ref(true)
let isLoadingStudent = ref(true)
let isLoadingIduka = ref(true)
let journals = ref([])
let perPage = 30
let count_not_valid = ref(0)
let count_sesuai = ref(0)
let count_tidak_sesuai = ref(0)
let students = ref([])
let iduka = ref([])
let opsiPeserta = ref('')
let opsiIduka = ref('')
let isMovingPage = ref(false)
let formKomentar = ref({
  "idJurnal": "",
  "komentar": "",
  "pembimbing": ""
})
let isLoadingKomentar = ref(true)
let pratinjauKomentar = ref()

async function getJournals(loading=true) {
  isLoadingJournals.value = loading
  let queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && isDraft=false`
  if(tanggal.value && opsiPeserta.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && created~"${tanggal.value}" && siswa.siswa.id="${opsiPeserta.value}" && isDraft=false`
  }
  else if(tanggal.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && created~"${tanggal.value}" && isDraft=false`
  }
  else if(opsiIduka.value && opsiPeserta.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && siswa.siswa.id="${opsiPeserta.value}" && iduka.id="${opsiIduka.value}" && isDraft=false`
  }
  else if(opsiPeserta.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && siswa.siswa.id="${opsiPeserta.value}" && isDraft=false`
  }
  else if(opsiIduka.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && iduka="${opsiIduka.value}" && isDraft=false`
  }
  else {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && isDraft=false`
  }
  if(user.user.value.role == 'admin') queryFilter = ""

  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(1, perPage, {
    filter: queryFilter,
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "isValid, -created"
  })
  if(res) {
    journals.value = res

    // konversi waktu UTC dari server ke full date lokal indo
    for(let i=0; i<journals.value.items.length; i++) {
      const date = new Date(journals.value.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      journals.value.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
    }
    isLoadingJournals.value = false
  }
}

async function pagination(page, loading=true) {
  isLoadingJournals.value = loading
  isMovingPage.value = true
  let queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && isDraft=false`
  if(tanggal.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && created~"${tanggal.value}" && isDraft=false`
  }
  else if(opsiIduka.value && opsiPeserta.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && siswa.siswa.id="${opsiPeserta.value}" && iduka.id="${opsiIduka.value}" && isDraft=false`
  }
  else if(opsiPeserta.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && siswa.siswa.id="${opsiPeserta.value}" && isDraft=false`
  }
  else if(opsiIduka.value) {
    queryFilter = `iduka.pembimbing_sekolah="${user.user.value.id}" && iduka="${opsiIduka.value}" && isDraft=false`
  }
  if(user.user.value.role == 'admin') queryFilter = ""


  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(page, perPage, {
    filter: queryFilter,
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "isValid, -created"
  })
  if(res) {
    for(let i=0; i<res.items.length; i++) {
      const date = new Date(res.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      res.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
    }
    
    journals.value.page = res.page
    journals.value.perPage = res.perPage
    journals.value.totalItems = res.totalItems
    journals.value.totalPages = res.totalPages
    journals.value.items = journals.value.items.concat(res.items)
    isLoadingJournals.value = false
    isMovingPage.value = false
  }
}

async function handleValidasi(id, isValid) {
  let currValidate = isValid
  if(currValidate) currValidate = !isValid
  else currValidate = !isValid
  client.autoCancellation(false)
  await client.collection('jurnal').update(id, { isValid: currValidate })
}

async function getJournalCountNotValid(loading=true) {
  isLoadingJournals.value = loading
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getFullList({
    filter: `iduka.pembimbing_sekolah="${user.user.value.id}" && isValid=false && isDraft=false`
  })
  if(res) {
    isLoadingJournals.value = false
    count_not_valid.value = res.length
  }
}

async function getJournalCountSesuaiElemen(loading=true) {
  isLoadingJournals.value = loading
  client.autoCancellation(false)
  let res_count_sesuai = await client.collection('jurnal').getFullList({
    filter: "iduka.pembimbing_sekolah='"+user.user.value.id+"' && elemen.elemen!='Lain-lain'",
    expand: "elemen"
  })
  let res_count_tidak_sesuai = await client.collection('jurnal').getFullList({
    filter: "iduka.pembimbing_sekolah='"+user.user.value.id+"' && elemen.elemen='Lain-lain'",
    expand: "elemen"
  })
  if(res_count_sesuai && res_count_tidak_sesuai) {
    count_sesuai.value = res_count_sesuai.length
    count_tidak_sesuai.value = res_count_tidak_sesuai.length
    isLoadingJournals.value = false
  }
}

async function getStudentsByPemetaan() {
  isLoadingStudent.value = true
  let res_student = await client.collection("pemetaan").getFullList({
    filter: "program_keahlian='"+prokel+"' && iduka.pembimbing_sekolah='"+user.user.value.id+"'",
    expand: "iduka, iduka.pembimbing_sekolah, siswa, program_keahlian",
    sort: "siswa.nama",
  })
  if(res_student) {
    isLoadingStudent.value = false
    students.value = res_student
  }
}

async function getIdukaByCurrentUser() {
  isLoadingIduka.value = true
  let res_iduka = await client.collection("iduka").getFullList({
    filter: `program_keahlian="${prokel}" && pembimbing_sekolah="${user.user.value.id}" && isArchive=false`,
    sort: "nama",
  })
  if(res_iduka) {
    isLoadingIduka.value = false
    iduka.value = res_iduka 
  }
}


function setModalKomentar(journal) {
  formKomentar.value.idJurnal = journal.id
  formKomentar.value.pembimbing = journal.expand.iduka.pembimbing_sekolah
}

async function getKomentarByIdJurnal(journal) {
  isLoadingKomentar.value = true
  let res = await client.collection('jurnal_komentar').getList(1,1, {
    filter: `idJurnal="${journal.id}"`
  })
  if(res) {
    pratinjauKomentar.value = res.items[0]
    isLoadingKomentar.value = false
    const date = new Date(pratinjauKomentar.value.created);
    const options = {
      dateStyle: "full",
      timeStyle: "short"
    }
    pratinjauKomentar.value.created = new Intl.DateTimeFormat('id-ID', options).format(date);
  }
}

async function handleComment() {
  await client.collection('jurnal').update(formKomentar.value.idJurnal, { isComment: true })
  let res = await client.collection('jurnal_komentar').create(formKomentar.value)
  if(res) {
    formKomentar.value.komentar = ""
  }
}

onMounted(() => {
  getJournals()
  getJournalCountNotValid()
  getStudentsByPemetaan()
  getJournalCountSesuaiElemen()
  getIdukaByCurrentUser()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e) {
    if(e.action == 'create' || e.action == 'update') {
      getJournals(false)
      getJournalCountNotValid(false)
      getJournalCountSesuaiElemen(false)
    }
  },{})
  client.collection('siswa').subscribe('*', function(e) {
    if(e.action == 'update') {
      getJournals(false)
    }
  })
})
</script>

<style scoped>
input.picker[type="date"] {
  position: relative;
}
input.picker[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  color: transparent;
  background: transparent;
}

.foto-container {
  width: 100%;
  height: 200px;
}
.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.foto-preview {
  width: 100%;
  /*height: 100%;*/
}
.jurnal-hover:hover {
  background-color: #f9f9f9;
}
.bg-danger {
  background-color: rgb(255, 99, 132) !important;
}
.pre-text {
  white-space: pre-wrap;
}
.bookmark {
  position: relative;
}
.bookmark .bookmark-icon {
  position: absolute;
  top: -20px;
  right: -5px;
}
.jurnal-item {
  border: none !important;
  border-bottom: 1px solid #cfcfcf !important
}
.no-shadow {
  box-shadow: none !important;
}
</style>
