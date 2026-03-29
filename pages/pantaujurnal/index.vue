<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-eye-fill"></i> Pantau Jurnal</span>
    </div>
   
    <div v-if="isLoading && !isError" class="card-body">
      <div class="row">
        <div class="col-lg-3">
          <loading-placeholder row="1" col="12" />
        </div>
        <div class="col-lg-9">
          <loading-placeholder row="1" col="8" />
          <loading-placeholder row="1" col="10" />
          <loading-placeholder row="1" col="6" />
          <loading-placeholder row="1" col="8" />
        </div>
      </div>
    </div>
    <div v-else class="card-body">
      <div class="row">
        <div class="col-lg-12">
          <div class="alert alert-warning mb-3">Ada <strong>{{ journals.totalItems }}</strong> Jurnal Peserta yang belum divalidasi Guru Pembimbing!</div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 mb-3">
          <select @change="getJournalByInvalidAndPublic" v-model="opsiFilter" class="form form-select sticky">
            <option value="terbaru">Terbaru</option>
            <option value="lama">Lama</option>
          </select>
        </div>

        <div class="col-lg-9">
          <div v-for="journal in journals.items" :key="journal.id" class="item border-2 border-bottom boder-dark pb-3 mb-3">
            <div class="item-body">
              <div class="fw-bold text-muted">
                <i v-if="journal.expand.elemen.elemen == 'Lain-lain'" class="bi bi-bookmark-fill text-danger"></i>
                <i v-else class="bi bi-bookmark-fill text-info"></i>
                {{ journal.expand.iduka.nama }}
              </div>
              <div class="small text-muted">{{ journal.created }}</div>
              <div class="text-muted py-3 pre-text">{{ journal.deskripsi.slice(0, 50) }}*****</div>
              <div class="small text-muted">{{ journal.expand.program_keahlian.nama }}</div>
              <div class="small fw-bold pt-1 text-muted">
                Guru Pembimbing: {{ journal.expand.iduka.expand.pembimbing_sekolah.nama.charAt(0) + journal.expand.iduka.expand.pembimbing_sekolah.nama.charAt(1) }}***** 
              </div>
            </div>
          </div>
          
          <div v-if="isMovingPage" class="my-2">
            <loading-placeholder row="1" col="8" />
            <loading-placeholder row="1" col="10" />
            <loading-placeholder row="1" col="6" />
            <loading-placeholder row="1" col="8" />
          </div>
          <div class="text-center">
            <button v-if="journals.totalItems" :disabled="isMovingPage || journals.page >= journals.totalPages" @click="loadMore(journals.page + 1, false)" class="btn btn-info border border-2 border-dark">
              muat lagi <i class="bi bi-arrow-down"></i>
            </button>
          </div>
        </div>

      </div>
    </div> 

    <div v-if="journals?.totalItems == 0" class="card-body text-muted text-center p-5">
      <div class="fs-1 fw-bold"><i class="bi bi-check-circle"></i></div>
      <div class="fs-4">
        Semua Jurnal sudah divalidasi!
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Pantau Jurnal Peserta — e-PKL / SMKN 4 Tasikmalaya." })

let client = usePocketBaseClient()
let user = usePocketBaseUser()
if(user?.user.value.role != 'wakasek') navigateTo('/404')
let opsiFilter = ref('terbaru')
let isLoading = ref(true)
let perPage = 50 
let journals = ref([])
let isError = ref(false)
let isMovingPage = ref(false)

async function getJournalByInvalidAndPublic(loading=true) {
  isError.value = false
  isLoading.value = loading 
  
  let filter = `isDraft=false && isValid=false`
  let sort = ``
  if(opsiFilter.value == 'terbaru') sort = `-created`
  else if(opsiFilter.value = 'lama') sort = `created`

  try {
    let res = await client.collection('jurnal').getList(1, perPage, {
      filter: filter,
      expand: `siswa.siswa, iduka.pembimbing_sekolah, program_keahlian, elemen`,
      sort: sort
    })

    if(res) {
      journals.value = res
      
      // konversi waktu UTC dari server ke full date lokal indo
      for(let i=0; i<res.totalItems; i++) {
        const date = new Date(journals.value.items[i].created);
        const options = {
          dateStyle: "full",
          timeStyle: "short"
        };
        journals.value.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
      }
      isLoading.value = false
      isError.value = false
    } 
  } catch(error) {
    isError.value = true
  }
}

async function loadMore(page, loading=true) {
  isError.value = false
  isLoading.value = loading 
  isMovingPage.value = true
  
  let filter = `isDraft=false && isValid=false`
  let sort = ``
  if(opsiFilter.value == 'terbaru') sort = `-created`
  else if(opsiFilter.value = 'lama') sort = `created`

  let res = await client.collection('jurnal').getList(page, perPage, {
    filter: filter,
    expand: `siswa.siswa, iduka.pembimbing_sekolah, program_keahlian, elemen`,
    sort: sort
  })

  if(res) {
    // konversi waktu UTC dari server ke full date lokal indo
    for(let i=0; i<res.items.length; i++) {
      const date = new Date(res.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      res.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
    }

    // perbaharui curr status page dan items
    journals.value.page = res.page
    journals.value.perPage = res.perPage
    journals.value.totalItems = res.totalItems
    journals.value.totalPages = res.totalPages
    
    // gabungin item lama dengan yang baru
    journals.value.items = journals.value.items.concat(res.items)
    isLoading.value = false
    isMovingPage.value = false
    isError.value = false
  } 
}
onMounted(() => {
  getJournalByInvalidAndPublic()
  client.collection('jurnal').subscribe('*', function(e) {
    if(e.action == 'create' || e.action == 'update') {
      getJournalByInvalidAndPublic(false)
    }
  },{})
})
</script>

<style scoped>
.pre-text {
  white-space: pre-wrap;
}
</style>
