<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand"><i class="bi bi-journals"></i> Jurnal Peserta</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4">
          <!-- <div class="alert alert-warning shadow-lg small py-2">
            <div class="fs-5 mb-2">FYI</div>
            <ul class="p-0 mx-1">
              <li><span class="bg-info">&nbsp;&nbsp;&nbsp;</span> Kegiatan sesuai Elemen</li>
              <li><span class="bg-danger">&nbsp;&nbsp;&nbsp;</span> Kegiatan tidak sesuai Elemen</li>
              <li>Untuk memvalidasi kegiatan, klik <code>Validasi</code></li>
            </ul>
          </div> -->
          <div class="mb-4">
            <label for="filter">Filter Berdasarkan Tanggal</label>
            <input @change="getJournals" v-model="tanggal" type="date" id="filter" class="form form-control picker">
          </div>
          <div v-if="!isLoadingJournals" class="mb-4">
            <div v-if="count > 0" class="text-danger"><strong>{{ count }}</strong> Jurnal belum di validasi</div>
            <!-- <div v-else>Semua jurnal tervalidasi</div> -->
          </div>
          <div v-if="count_sesuai || count_tidak_sesuai" class="row justify-content-center">
            <jurnal-chart :countSesuai="count_sesuai" :countTidakSesuai="count_tidak_sesuai" />
          </div>
        </div>
        <div class="col">
          <div v-if="!isLoadingJournals" class="mb-2 text-center text-muted">Menampilkan
            <span v-if="journals.items">{{ journals.items.length }}</span>  dari {{ journals.totalItems }} Jurnal
          </div>
          <div class="row">
            <div class="col">
              <Loading v-if="isLoadingJournals" />
              <div v-else v-for="journal in journals.items" :key="journal.id" class="card jurnal-hover">
                <div class="card-body">
                  <div><strong class="fs-6">{{ journal.expand.siswa.expand.siswa.nama }}</strong> &bull; <span class="small text-muted fst-italic">{{ journal.created }}</span></div>
                  <div class="my-2">
                    <span v-if="journal.expand.elemen.elemen == 'Lain-lain'" class="small border border-2 border-dark p-1 bg-danger"><i class="bi bi-journal-bookmark-fill"></i>
                      {{ journal.expand.elemen.elemen }}
                    </span>
                    <span v-else class="small border border-2 border-dark p-1 bg-info"><i class="bi bi-journal-bookmark-fill"></i>
                      {{ journal.expand.elemen.elemen }}
                    </span>
                  </div>
                  <article class="my-3 pre-text">
                    {{ journal.deskripsi }}
                  </article>
                  <div v-if="journal.foto" class="my-3 foto-container hand-cursor" data-bs-toggle="modal" :data-bs-target="`#foto-${journal.id}`">
                    <img :src="`http://localhost:8090/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`" :alt="journal.deskripsi" class="foto" />
                  </div>
                  <span v-if="journal.isValid" @click="handleValidasi(journal.id, journal.isValid)" class="hand-cursor"><span class="text-danger"><i class="bi bi-heart-fill"></i></span> Valid</span>
                  <span v-else @click="handleValidasi(journal.id, journal.isValid)" class="hand-cursor"><span class="text-danger"><i class="bi bi-heart"></i></span> Validasi</span>
                  <!-- <span class="fst-italic text-muted">memvalidasi...</span> -->
                </div>
                <!-- MODAL FOTO PREVIEW -->
                <div class="modal" :id="`foto-${journal.id}`" aria-hidden="true" tabindex="-1">
                  <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
                      <div class="modal-header rounded-0">
                        <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                      </div>
                      <div class="modal-body p-0">
                        <img :src="`http://localhost:8090/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`" :alt="journal.deskripsi" class="foto-preview" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="row">
        <div class="col offset-md-4">
          <Loading class="mt-5" />
        </div>
      </div> -->
      <div class="row my-4 mb-4">
        <div v-if="!isLoadingJournals" class="col text-end">
          <button :disabled="journals.page < 2" @click="pagination(journals.page - 1)" class="btn btn-info me-2"><i class="bi bi-arrow-left"></i> sebelumnya</button>
          <button :disabled="journals.page >= journals.totalPages" @click="pagination(journals.page + 1)" class="btn btn-info">lanjut <i class="bi bi-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal Peserta — e-PKL / SMKN 4 Tasikmalaya." })
let tanggal = ref()
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoadingJournals = ref(true)
let journals = ref([])
let perPage = 5
let count = ref(0)
let count_sesuai = ref()
let count_tidak_sesuai = ref()

async function getJournals(loading=true) {
  isLoadingJournals.value = loading
  let queryFilter = "pembimbing='"+user.user.value.id+"'"
  if(tanggal.value) queryFilter = "pembimbing='"+user.user.value.id+"' && created~'"+tanggal.value+"'"
  if(user.user.value.role == 'admin') queryFilter = ""
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(1, perPage, {
    filter: queryFilter,
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "isValid, -created"
  })
  let res_count_sesuai = await client.collection('jurnal').getList(1, perPage, {
    filter: "pembimbing='"+user.user.value.id+"' && elemen.elemen!='Lain-lain'",
    expand: "elemen"
  })
  let res_count_tidak_sesuai = await client.collection('jurnal').getList(1, perPage, {
    filter: "pembimbing='"+user.user.value.id+"' && elemen.elemen='Lain-lain'",
    expand: "elemen"
  })
  if(res && res_count_sesuai && res_count_tidak_sesuai) {
    journals.value = res
    count_sesuai.value = res_count_sesuai.items.length
    count_tidak_sesuai.value = res_count_tidak_sesuai.items.length
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
  }
}

async function handleValidasi(id, isValid) {
  let currValidate = isValid
  if(currValidate) currValidate = !isValid
  else currValidate = !isValid
  client.autoCancellation(false)
  await client.collection('jurnal').update(id, { isValid: currValidate })
}

async function getJournalCount(loading=true) {
  isLoadingJournals.value = loading
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getFullList({
    filter: "pembimbing='"+user.user.value.id+"' && isValid=false"
  })
  if(res) {
    isLoadingJournals.value = false
    count.value = res.length
  }
}

onMounted(() => {
  getJournals()
  getJournalCount()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e) {
    if(e.action == 'create' || e.action == 'update') {
      getJournals(false)
      getJournalCount(false)
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
  height: 100%;
}
.jurnal-hover:hover {
  background-color: #f7fddd;
}
.bg-danger {
  background-color: rgb(255, 99, 132) !important;
}
.pre-text {
  white-space: pre-wrap;
}
</style>
