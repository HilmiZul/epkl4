<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-patch-check"></i> Nilai</span>
    </div>
    <div class="card-body small">
      <loading-placeholder v-if="isLoading" row="1" col="12" />
      <div v-else-if="nilaiNotVerify?.length > 0" class="alert alert-warning fs-6">
        <i class="bi bi-info-circle"></i>
        Ada {{ nilaiNotVerify.length }} nilai yang belum di verifikasi
      </div>
      <div class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getNilai">
            <div class="my-3 mt-0 input-group">
              <input v-model="keyword" type="search" class="form form-control form-control-lg" placeholder="🔎 Cari nama peserta" />
              <button class="btn btn-info ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-if="nilai" class="mb-3 text-grey float-end">{{ nilai.length }} nilai peserta</div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th width="3%" rowspan="2" class="align-content-center">#</th>
              <th width="50%" rowspan="2" class="align-content-center">Peserta</th>
              <th width="10%" rowspan="2" class="align-content-center">Kelas</th>
              <th width="10%" rowspan="2" class="align-content-center">Titip Serti.</th>
              <th width="10%" rowspan="2" class="align-content-center">Verify</th>
              <!-- <th colspan="4">Nilai</th> -->
            </tr>
            <!-- <tr>
              <th width="6%">1</th>
              <th width="6%">2</th>
              <th width="6%">3</th>
              <th width="6%">4</th>
            </tr> -->
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5">
                <loading-placeholder row="1" col="12" />
                <loading-placeholder row="1" col="12" />
                <loading-placeholder row="1" col="12" />
                <loading-placeholder row="1" col="12" />
                <loading-placeholder row="1" col="12" />
              </td>
            </tr>
            <tr v-else-if="nilai?.length < 1">
              <td colspan="5" class="text-center">
                <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                <div class="pb-3">Data tidak ditemukan</div>
              </td>
            </tr>
            <tr v-else v-for="(n, i) in nilai" :key="i">
              <td>{{ i+1 }}.</td>
              <td>
                <nuxt-link :to="`/nilai/${n.id}`" class="link fw-bold">{{ n.expand.siswa.nama }}</nuxt-link>
              </td>
              <td>{{ n.expand.siswa.kelas }}</td>
              <td>
                <span v-if="n.isEntrust"><i class="bi bi-check-circle-fill text-success"></i></span>
                <span v-else><i class="bi bi-x-circle-fill text-danger"></i></span>
              </td>
              <td>
                <span v-if="n.isVerify"><i class="bi bi-check-circle-fill text-success"></i></span>
                <span v-else><i class="bi bi-x-circle-fill text-danger"></i></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Sertifikat — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let user_id = user?.user.value.id
let role = user?.user.value.role
let prokel = user?.user.value.program_keahlian
let nilai = ref()
let isLoaded = ref(false)
let isLoading = ref(true)
let keyword = ref()
let nilaiNotVerify = ref('')
if(role == 'tu') navigateTo('/404')

async function getNilai(loading=true) {
  isLoading.value = loading
  let filter = ''
  if(keyword.value) filter = ` && siswa.nama~"${keyword.value}"`
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user_id}" ${filter}`,
    expand: "siswa, iduka, program_keahlian",
    sort: "isVerify, siswa",
  })
  if(res) {
    nilai.value = res
    isLoading.value = false
  }
}

async function getNilaiByNotVerify() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user_id}" && isVerify=false`
  })
  if(res) {
    nilaiNotVerify.value = res
    isLoading.value = false
  }
}

onMounted(() => {
  getNilai()
  getNilaiByNotVerify()
  client.autoCancellation(false)
  client.collection('nilai').subscribe('*', function(e) {
    // param default getNilai: loading=true
    if(e.action == 'create' || e.action == 'update') getNilai(false)
  },{})
})
</script>
