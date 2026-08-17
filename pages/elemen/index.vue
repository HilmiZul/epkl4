<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold"><i class="bi bi-journal-bookmark-fill"></i> Elemen</span>
      <span v-if="role == 'admin' || role == 'jurusan'" class="float-end">
        <nuxt-link to="/elemen/tambah" class="btn btn-dark btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0 input-group">
            <input v-model="keyword" type="search" class="form form-control form-control-lg" placeholder="Cari nama elemen / tujuan" />
          </div>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end badge">{{ elementsFiltered.length }} items</div>
        </div>
      </div>

      <div v-if="isLoading" class="text-center my-5">
        <LoadingPlaceholder :col="12" :row="5" />
      </div>

      <div v-else-if="!isLoading && elementsFiltered.length < 1" class="text-center my-5">
        <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
        <div class="pb-3 text-muted">Belum tersedia/tidak ditemukan</div>
      </div>

      <div v-else class="accordion accordion-flush" id="accordion-parent">
        <div v-for="elemen in elementsFiltered" :key="elemen.id" class="accordion-item border-bottom border- border-grey">
          <div class="accordion-header">
            <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-${elemen.id}`" aria-expanded="false" :aria-controls="`flush-${elemen.id}`">
              <!-- <span class="badge text-muted border border-1 border-grey me-2">{{ i+1 }}</span> -->
              <span v-if="role == 'guru'" class="badge text-muted border border-1 border-grey me-2">{{ elemen.expand.program_keahlian.nama }}</span> {{ elemen.elemen }} &nbsp;
            </button>
          </div>
          <div :id="`flush-${elemen.id}`" class="accordion-collapse collapse" data-bs-parent="#accordion-parent">
            <div class="accordion-body">
              <strong>CP</strong>
              <p>{{ elemen.cp }}</p>
              <strong>Tujuan</strong>
              <p class="pre-text">{{ elemen.tujuan }}</p>
              <nuxt-link v-if="role == 'admin' || role == 'jurusan'" :to="`/elemen/${elemen.id}`" class="link text-muted"><i class="bi bi-pencil-square"></i> Edit</nuxt-link>
            </div>
          </div>
        </div>
      </div>

      <!-- <div v-if="!isLoading" class="my-4"> -->
      <!--   <div v-if="isMovingPage"> -->
      <!--     <loading-placeholder row="1" col="12" /> -->
      <!--     <loading-placeholder row="1" col="12" /> -->
      <!--     <loading-placeholder row="1" col="12" /> -->
      <!--     <loading-placeholder row="1" col="12" /> -->
      <!--   </div> -->
      <!---->
      <!--   <div class="text-center"> -->
      <!--     <button v-if="elements.totalItems" :disabled="isMovingPage || elements.page >= elements.totalPages" @click="loadMore(elements.page + 1, false)" class="btn btn-dark border border-2 border-dark"> -->
      <!--       muat lagi <i class="bi bi-arrow-down"></i> -->
      <!--     </button> -->
      <!--   </div> -->
      <!-- </div> -->

      <!-- Single Modal: hapus iduka -->
      <div class="modal" id="delete" aria-hidden="true" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
            <div class="modal-header rounded-0 h4 bg-danger fw-bold border-bottom border-3 border-dark">
              Peringatan!
            </div>
            <div class="modal-body">
              Yakin mau hapus Tujuan: <strong>{{ tujuan }}</strong> dari daftar elemen?
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <a v-if="!isDeleted" class="link hand-cursor me-2" data-bs-dismiss="modal" @click="hapusData(elemen_id)" :disabled="isSending">
                <span v-if="isSending">Sedang menghapus</span>
                <span v-else>Hapus</span>
              </a>
              <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-danger border border-2 border-dark" data-bs-dismiss="modal">Gajadi</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Elemen — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let role = user?.user.value.role
let prokel = user?.user.value.program_keahlian
let elements = ref([])
let isLoading = ref(true)
let keyword = ref('')
let elemen_id = ref('')
let tujuan = ref('')
let isSending = ref(false)
let isDeleted = ref(false)

if(role == 'admin' && role == 'jurusan' && role == 'guru') navigateTo('/404')


async function getElemenCp(loading=true) {
  isLoading.value = loading

  let filters = prokel.map(id => `program_keahlian ?= "${id}"`).join(' || ')

  client.autoCancellation(false)
  let res = await client.collection('elemen_cp').getFullList({
    expand: `program_keahlian`,
    filter: filters,
    // filter: client.filter(`program_keahlian.id ?= "${prokel}"`),
    sort: "program_keahlian, created, -elemen"
  })

  if(res) {
    isLoading.value = false
    elements.value = res
  }
}


const elementsFiltered = computed(() => {
  return elements.value.filter((i) => {
    return (
      i.elemen.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.tujuan.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

async function setModalDeleteById(id, name) {
  elemen_id.value = id
  tujuan.value = name
}

async function hapusData(id) {
  client.autoCancellation(false)
  await client.collection('elemen_cp').delete(id)
}

onMounted(() => {
  getElemenCp()
  client.autoCancellation(false)
  client.collection('elemen_cp').subscribe('*', function(e) {
    if(e.action == 'delete') getElemenCp(false)
  },{})
})
</script>

<style scoped>
.pre-text {
  white-space: pre-wrap;
}
</style>
