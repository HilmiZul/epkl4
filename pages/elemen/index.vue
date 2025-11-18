<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-journal-bookmark-fill"></i> Elemen</span>
      <span v-if="role == 'admin' || role == 'jurusan'" class="float-end">
        <nuxt-link to="/elemen/tambah" class="btn btn-info btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <input v-model="keyword" type="search" class="form form-control form-control-lg" placeholder="🔎 Cari nama elemen / tujuan" />
          </div>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end badge">{{ elements.length }} items</div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover table-striped table-borderless">
          <thead>
            <tr>
              <th width="30%">Tujuan</th>
              <th width="40%">Capaian Pembelajaran</th>
              <th width="30%">Elemen</th>
              <th v-if="role == 'admin' || role == 'jurusan'" width="5%">Hapus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="text-center my-5">
              <td v-if="role == 'admin' || role == 'jurusan'" colspan="4">
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
              </td>
              <td v-else colspan="3">
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
              </td>
            </tr>
            <tr v-else-if="elementsFiltered.length < 1">
              <td colspan="3" class="text-center">
                <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
                <div class="pb-3 text-muted">Data belum ada/tidak ditemukan</div>
              </td>
            </tr>
            <tr v-else v-for="e in elementsFiltered" :key="e.id">
              <td class="fw-bold">
                <nuxt-link v-if="role == 'admin' || role == 'jurusan'" :to="`/elemen/${e.id}`" class="link"><span class="pre-text">{{ e.tujuan }}</span></nuxt-link>
                <span v-else>{{ e.tujuan }}</span>
              </td>
              <td>{{ e.cp }}</td>
              <td>{{ e.elemen }}</td>
              <td v-if="role == 'admin' || role == 'jurusan'" class="smallest">
                <button @click="setModalDeleteById(e.id, e.tujuan)" class="btn btn-danger btn-sm border border-2 border-dark" data-bs-toggle="modal" data-bs-target="#delete"><i class="bi bi-trash3"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
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
                <button v-if="!isDeleted" class="btn btn-danger border border-2 border-dark me-2" data-bs-dismiss="modal" @click="hapusData(elemen_id)" :disabled="isSending">
                  <span v-if="isSending">Sedang menghapus</span>
                  <span v-else>Hapus</span>
                </button>
                <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-light border border-2 border-dark" data-bs-dismiss="modal">Gajadi</button>
              </div>
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
  client.autoCancellation(false)
  let res = await client.collection('elemen_cp').getFullList({
    filter: "program_keahlian='"+prokel+"'",
    sort: "created"
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
