<template>
  <div class="card">
    <div class="card-header">
      <span class="h5 quicksand fw-bold"><i class="bi bi-person-workspace"></i> Walikelas</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'wakasek'" to="/walikelas/tambah" class="btn btn-dark btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <input type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="Cari nama/rombel" />
          </div>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end badge">{{ itemFiltered.length }} walikelas</div>
        </div>
      </div>

      <div v-if="isLoading" class="text-center my-5">
        <LoadingPlaceholder :col="12" :row="5" />
      </div>

      <div v-else-if="!isLoading && itemFiltered.length < 1" class="text-center my-5">
        <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
        <div class="pb-3 text-muted">Belum tersedia/tidak ditemukan</div>
      </div>

      <!-- list display item -->
      <ul v-else v-for="(guru,i) in itemFiltered" :key="guru.id" class="list-group list-group-flush">
        <nuxt-link v-if="role == 'jurusan' || role == 'wakasek'" :to="`/walikelas/${guru.id}`" class="link">
          <li class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-1 border-grey">
            <div class="ms-2 me-auto fw-bold">
              <div class="fs-6">{{ guru.nama }}</div>

              <div class="text-muted mb-2">
                {{ guru.nip}}
              </div>

              <div class="mb-2 smallest">
                <span class="badge border border-1 border-grey text-muted rounded-pill me-1">{{ guru.expand.rombel.nama }}</span>
              </div>
            </div>
          </li>
        </nuxt-link>
      </ul>
      <!-- tutup list display -->

    </div>
  </div>
</template>


<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Walikelas — e-PKL / SMKN 4 Tasikmalaya." })

let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user.user.value.role

let teachers = ref([])
let isLoading = ref(true)

let keyword = ref('')

if(role != 'wakasek') navigateTo('/404')


async function getWalikelas() {
  isLoading.value = true

  let res = await client.collection('walikelas').getFullList({
    expand: `program_keahlian, rombel`,
    sort: `rombel.nama, nama`
  })

  if(res) {
    teachers.value = res

    isLoading.value = false
  }
}


const itemFiltered = computed(() => {
  return teachers.value.filter((i) => {
    return (
      i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.rombel.nama.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})


onMounted(() => {
  getWalikelas()
})

</script>
