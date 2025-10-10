<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-journal-bookmark-fill"></i> Elemen</span>
      <span v-if="role == 'admin' || role == 'jurusan'" class="float-end">
        <nuxt-link to="/elemen/tambah" class="btn btn-info btn-sm"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <input v-model="keyword" type="search" class="form form-control form-control-md" placeholder="🔎 Cari nama elemen / tujuan" />
          </div>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end">{{ elements.length }} elemen</div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover table-striped table-borderless">
          <thead>
            <tr>
              <th width="30%">Elemen</th>
              <th width="40%">Capaian Pembelajaran</th>
              <th width="30%">Tujuan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="text-center my-5">
              <td colspan="3">
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
                <LoadingPlaceholder col="12" row="1" />
              </td>
            </tr>
            <tr v-else-if="elementsFiltered.length < 1">
              <td colspan="3" class="text-center">
                <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                <div class="pb-3">Data tidak ditemukan</div>
              </td>
            </tr>
            <tr v-else v-for="e in elementsFiltered" :key="e.id">
              <td class="fw-bold">
                <nuxt-link v-if="role == 'admin' || role == 'jurusan'" :to="`/elemen/${e.id}`" class="link">{{ e.elemen }}</nuxt-link>
                <span v-else>{{ e.elemen }}</span>
              </td>
              <td>{{ e.cp }}</td>
              <td><span class="pre-text">{{ e.tujuan }}</span></td>
            </tr>
          </tbody>
        </table>
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
if(role == 'admin' && role == 'jurusan' && role == 'guru') navigateTo('/404')

async function getElemenCp() {
  isLoading.value = true
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

onMounted(() => getElemenCp())
</script>

<style scoped>
.pre-text {
  white-space: pre-wrap;
}
</style>
