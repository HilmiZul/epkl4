<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-journals"></i> Jurnal Peserta</span>
    </div>
    <div class="card-body">
      <loading-placeholder v-if="isLoadingJournals" col="12" row="1" />
      <div v-else-if="count_not_valid > 0" class="alert alert-warning">
        <i class="bi bi-info-circle"></i> Ada <span class="fw-bold">{{ count_not_valid }}</span> Jurnal yang belum divalidasi
      </div>
      <div class="row">
        <div class="col-md-7 p-0">
          <div v-if="!isLoadingJournals" class="mb-2 mx-3 text-end text-muted smallest">
            <span v-if="journals.totalItems" class="float-start">Halaman {{ journals.page }} dari {{ journals.totalPages }}</span>
            <span v-if="journals.totalItems"><span class="fw-bold">{{ journals.totalItems }}</span> Jurnal</span>
            <!-- <span v-if="journals.totalItems">Menampilkan {{ journals.items.length }}  dari {{ journals.totalItems }} Jurnal</span> -->
          </div>
          <div class="row">
            <div class="col-md-12">
              <div v-if="!isLoadingJournals" class="text-center text-muted">
                <span v-if="journals.totalItems == 0">
                  <div class="fs-1 pt-5"><i class="bi bi-journals"></i></div>
                  <div class="pb-5 fw-bold">Belum ada jurnal</div>
                </span>
              </div>
              <LoadingPlaceholder v-if="isLoadingJournals" col="12" row="1" />
              <div v-else v-for="journal in journals.items" :key="journal.id" class="card jurnal-hover jurnal-item no-shadow">
                <div class="card-body">
                  <div class="bookmark fs-2">
                    <div class="bookmark-icon text-danger" v-if="journal.expand.elemen.elemen == 'Lain-lain'"><i class="bi bi-bookmark-fill"></i></div>
                    <div class="bookmark-icon text-info" v-else><i class="bi bi-bookmark-fill"></i></div>
                  </div>
                  <div class="mt-3"><strong class="fs-6">{{ journal.expand.siswa.expand.siswa.nama }}</strong> &bull; {{ journal.expand.iduka.nama }}</div>
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
                  <span v-if="journal.isValid" @click="handleValidasi(journal.id, journal.isValid)" class="hand-cursor"><span class="text-danger"><i class="bi bi-heart-fill"></i></span> Valid</span>
                  <span v-else @click="handleValidasi(journal.id, journal.isValid)" class="hand-cursor"><span class="text-danger"><i class="bi bi-heart"></i></span> Valid</span>
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
              </div>
              <div class="row my-4 mb-4 ms-1">
                <div v-if="!isLoadingJournals" class="col-md-12">
                  <div v-if="isMovingPage" class="text-muted smallest mb-2 fst-italic">sedang berpindah halaman</div>
                  <div v-else>
                    <div v-if="journals || isMovingPage" class="text-muted smallest mb-2">
                      <span v-if="journals.totalItems">Halaman {{ journals.page }} dari {{ journals.totalPages }}</span>
                    </div>
                  </div>
                  <button v-if="journals.totalItems" :disabled="isMovingPage || journals.page < 2" @click="pagination(journals.page - 1, false)" class="btn btn-info me-2 border border-2 border-dark">
                    <i class="bi bi-arrow-left"></i> sebelumnya
                  </button>
                  <button v-if="journals.totalItems" :disabled="isMovingPage || journals.page >= journals.totalPages" @click="pagination(journals.page + 1, false)" class="btn btn-info border border-2 border-dark">
                    lanjut <i class="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="mb-4">
            <label for="filter">Filter Tanggal</label>
            <input @change="getJournals" v-model="tanggal" type="date" id="filter" class="form form-control picker">
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
      <!-- <div class="row">
        <div class="col offset-md-4">
          <Loading class="mt-5" />
        </div>
      </div> -->

    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal Peserta — e-PKL / SMKN 4 Tasikmalaya." })
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
let tanggal = ref()
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoadingJournals = ref(true)
let isLoadingStudent = ref(true)
let journals = ref([])
let perPage = 5
let count_not_valid = ref(0)
let count_sesuai = ref(0)
let count_tidak_sesuai = ref(0)
let students = ref([])
let opsiPeserta = ref('')
let isMovingPage = ref(false)

async function getJournals(loading=true) {
  isLoadingJournals.value = loading
  let queryFilter = "pembimbing='"+user.user.value.id+"'"
  if(tanggal.value && opsiPeserta.value) queryFilter = "pembimbing='"+user.user.value.id+"' && created~'"+tanggal.value+"' && siswa.siswa.id='"+opsiPeserta.value+"'"
  else if(tanggal.value) queryFilter = "pembimbing='"+user.user.value.id+"' && created~'"+tanggal.value+"'"
  else if(opsiPeserta.value) queryFilter = "pembimbing='"+user.user.value.id+"' && siswa.siswa.id='"+opsiPeserta.value+"'"
  else queryFilter = "pembimbing='"+user.user.value.id+"'"
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
  let queryFilter = "pembimbing='"+user.user.value.id+"'"
  if(tanggal.value) queryFilter = "pembimbing='"+user.user.value.id+"' && created~'"+tanggal.value+"'"
  if(user.user.value.role == 'admin') queryFilter = ""
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(page, perPage, {
    filter: queryFilter,
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "isValid, -created"
  })
  if(res) {
    journals.value = res
    for(let i=0; i<journals.value.items.length; i++) {
      const date = new Date(journals.value.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      journals.value.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
    }
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
    filter: "pembimbing='"+user.user.value.id+"' && isValid=false"
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
    filter: "pembimbing='"+user.user.value.id+"' && elemen.elemen!='Lain-lain'",
    expand: "elemen"
  })
  let res_count_tidak_sesuai = await client.collection('jurnal').getFullList({
    filter: "pembimbing='"+user.user.value.id+"' && elemen.elemen='Lain-lain'",
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

onMounted(() => {
  getJournals()
  getJournalCountNotValid()
  getStudentsByPemetaan()
  getJournalCountSesuaiElemen()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e) {
    if(e.action == 'create' || e.action == 'update') {
      getJournals(false)
      getJournalCountNotValid(false)
      getJournalCountSesuaiElemen(false)
    }
  },{})
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
  border-bottom: 1px solid #000 !important
}
.no-shadow {
  box-shadow: none !important;
}
</style>
