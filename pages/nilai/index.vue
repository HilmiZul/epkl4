<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-patch-check"></i> Nilai</span>
    </div>
    <div class="card-body small">
      <loading-placeholder v-if="isLoading" row="1" col="12" />
      <div v-else-if="nilaiNotValid?.length > 0" class="alert alert-warning fs-6">
        Ada <span class="fw-bold">{{ nilaiNotValid.length }}</span> Nilai yang belum divalidasi
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
          <div v-if="nilai" class="mb-3 text-grey float-end badge">{{ nilai.length }} nilai peserta</div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th width="3%" rowspan="2" class="align-content-center">#</th>
              <th width="50%" rowspan="2" class="align-content-center">Peserta</th>
              <th width="10%" rowspan="2" class="align-content-center">Skor</th>
              <th width="10%" rowspan="2" class="align-content-center">Sertifikat</th>
              <th width="5%" rowspan="2" class="align-content-center">Valid</th>
            </tr>
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
            <tr v-else-if="keyword.length > 0 && nilai?.length < 1">
              <td colspan="5" class="text-center">
                <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                <div class="pb-3">Tidak ditemukan</div>
              </td>
            </tr>
            <tr v-else-if="keyword.length < 1 && nilai?.length < 1">
              <td colspan="5" class="text-center">
                <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                <div class="pb-3">Belum ada nilai</div>
              </td>
            </tr>
            <tr v-else v-for="(n, i) in nilai" :key="i">
              <td>
                <span v-if="n.isValid" class="badge text-dark">{{ i+1 }}</span>
                <span v-else class="badge bg-danger">{{ i+1 }}</span>
              </td>
              <td>
                <nuxt-link :to="`/nilai/${n.id}`" class="link fw-bold">{{ n.expand.siswa.nama }}</nuxt-link> <br>
                <span class="text-muted small">{{ n.expand.siswa.kelas }}</span>
              </td>
              <td>{{ n.nilai_elemen1 + n.nilai_elemen2 + n.nilai_elemen3 + n.nilai_elemen4 }}</td>
              <td>
                <span v-if="n.isEntrust" class="badge bg-info">Ya</span>
                <span v-else class="badge bg-success">Tidak</span>
              </td>
              <td>
                <span v-if="n.isValid"><i class="bi bi-check-circle-fill text-success"></i></span>
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
let keyword = ref('')
let nilaiNotValid = ref('')
if(role == 'tu') navigateTo('/404')

async function getNilai(loading=true) {
  isLoading.value = loading
  let filter = ''
  if(keyword.value) filter = ` && siswa.nama~"${keyword.value}"`
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user_id}" ${filter}`,
    expand: "siswa, iduka, program_keahlian",
    sort: "isValid, siswa",
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
    filter: `iduka.pembimbing_sekolah="${user_id}" && isValid=false`
  })
  if(res) {
    nilaiNotValid.value = res
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
