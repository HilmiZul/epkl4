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
          <div class="mb-3">
            <label for="filter">Filter Berdasarkan Tanggal</label>
            <input @change="getJournals" v-model="tanggal" type="date" id="filter" class="form form-control picker mt-2">
          </div>
          <div class="row justify-content-center">
            <!-- <jurnal-chart /> -->
          </div>
        </div>
        <div class="col">
          <div v-if="!isLoadingJournals" class="mb-2 text-center text-muted">Menampilkan {{ journals.items.length }} dari {{ journals.totalItems }} Jurnal</div>
          <div class="row">
            <div class="col">
              <Loading v-if="isLoadingJournals" />
              <div v-else v-for="journal in journals.items" :key="journal.id" class="card jurnal-hover">
                <div class="card-body">
                  <div><strong class="fs-6">{{ journal.expand.siswa.expand.siswa.nama }}</strong> &bull; <span class="text-muted fst-italic">{{ journal.created }}</span></div>
                  <div class="my-2">
                    <span v-if="journal.expand.elemen.elemen == 'Lain-lain'" class="border border-2 border-dark p-1 bg-danger"><i class="bi bi-journal-bookmark-fill"></i>
                      {{ journal.expand.elemen.elemen }}
                    </span>
                    <span v-else class="border border-2 border-dark p-1 bg-info"><i class="bi bi-journal-bookmark-fill"></i>
                      {{ journal.expand.elemen.elemen }}
                    </span>
                  </div>
                  <article class="my-2 pre-text">
                    {{ journal.deskripsi }}
                  </article>
                  <!-- <div class="my-3 foto-container">
                    <img src="https://www.stonebridge.uk.com/blog/wp-content/uploads/2016/05/Web-design-and-development.jpg" alt="foto" class="foto" />
                  </div> -->
                  <span class="text-danger"><i class="bi bi-heart-fill"></i></span> Valid
                  <!-- <span class="fst-italic text-muted">memvalidasi...</span> -->
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

async function getJournals() {
  isLoadingJournals.value = true
  let queryFilter = "pembimbing='"+user.user.value.id+"'"
  if(tanggal.value) queryFilter = "pembimbing='"+user.user.value.id+"' && created~'"+tanggal.value+"'"
  if(user.user.value.role == 'admin') queryFilter = ""
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(1, perPage, {
    filter: queryFilter,
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "-created"
  })
  if(res) {
    journals.value = res
    // console.log(journals.value)
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

async function pagination(page) {
  isLoadingJournals.value = true
  let queryFilter = "pembimbing='"+user.user.value.id+"'"
  if(tanggal.value) queryFilter = "pembimbing='"+user.user.value.id+"' && created~'"+tanggal.value+"'"
  if(user.user.value.role == 'admin') queryFilter = ""
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(page, perPage, {
    filter: queryFilter,
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "-created"
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

onMounted(() => {
  getJournals()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e) {
    if(e.action == 'create') getJournals()
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
  width: 400px;
  height: 200px;
}
.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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
