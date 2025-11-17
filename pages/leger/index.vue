<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-patch-check"></i> Leger</span>
    </div>
    <div class="card-body">
      <loading-placeholder v-if="isLoading" row="1" col="12" />
      <div v-else-if="nilaiNotValid?.length > 0" class="alert alert-warning fs-6">
        Ada <span class="fw-bold">{{ nilaiNotValid.length }}</span> Nilai yang belum divalidasi
      </div>
      <div v-if="nilai?.length > 0" class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getNilai">
            <div class="my-3 mt-0 input-group">
              <input v-model="keyword" type="search" class="form form-control form-control-lg" placeholder="🔎 Cari nama peserta" />
              <button class="btn btn-info ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>
        <div class="col-lg-6 align-content-center text-end">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-if="nilai" class="mb-3 text-dark badge me-2">{{ nilai.length }} peserta</div>
          <div v-if="count_entrust" class="mb-3 text-white badge bg-dark">{{ count_entrust.length }} menitip sertifikat</div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div v-if="isLoading">
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
          </div>
          <div v-else-if="nilai?.length < 1" class="text-center text-muted my-3">
            <div class="fs-1"><i class="bi bi-database-fill"></i></div>
            <div class="fs-4">Belum ada nilai</div>
            <div class="pb-3">Nilai akan tampil apabila masa PKL selesai & peserta menyerehkan nilai.</div>
          </div>
          <ul v-else v-for="(n, i) in nilai" :key="i" class="list-group list-group-flush">
            <nuxt-link :to="`/leger/${n.id}`" class="fw-bold">
              <li class="list-group-item py-3 border-bottom border-2 border-grey">
                {{ n.expand.siswa.nama }} <br>
                <div class="text-muted mt-2">{{ n.expand.siswa.kelas }}</div>
                <div v-if="n.isEntrust" class="text-muted mt-1">
                  <i class="bi bi-person-vcard-fill"></i> Titip Sertifikat
                </div>
                <div class="text-muted mt-1">
                  <span v-if="n.isValid"><i class="bi bi-check-circle-fill"></i> Valid</span>
                  <span v-else class="text-danger"><i class="bi bi-dash-circle-fill"></i> Belum divalidasi</span>
                </div>
              <!-- <nuxt-link v-if="!n.isValid" :to="`/leger/${n.id}`" class="mt-2 btn btn-danger btn-sm border border-2 border-dark">Validasi sekarang <i class="bi bi-arrow-right"></i></nuxt-link> -->
              </li>
            </nuxt-link>
          </ul>
          <!-- <div class="table-responsive">
            <table class="table">
              <tbody>
                <tr >
                  <td colspan="5">

                  </td>
                </tr>
                <tr >
                  <td colspan="5" class="text-center text-muted">

                  </td>
                </tr>
                <tr  class="border-bottom border-2 border-dark">
                  <td width="3%">
                    <span v-if="n.isValid" class="badge text-dark">{{ i+1 }}</span>
                    <nuxt-link v-else :to="`/leger/${n.id}`"><span class="badge bg-danger">{{ i+1 }}</span></nuxt-link>
                  </td>
                  <td>
                    <nuxt-link :to="`/leger/${n.id}`" class="link fw-bold">{{ n.expand.siswa.nama }}</nuxt-link> <br>
                    <div class="text-muted fw-bold small mt-2">{{ n.expand.siswa.kelas }}</div>
                    <div v-if="n.isEntrust" class="text-muted small">
                      <i class="bi bi-person-vcard-fill"></i> Titip Sertifikat
                    </div>
                    <div class="text-muted small">
                      <span v-if="n.isValid"><i class="bi bi-check-circle-fill"></i> Valid</span>
                      <span v-else class="text-danger"><i class="bi bi-dash-circle-fill"></i> Belum divalidasi</span>
                    </div>
                    <nuxt-link v-if="n.isValid" :to="`/leger/${n.id}`" class="mt-2 btn btn-info btn-sm border border-2 border-dark">Lihat <i class="bi bi-arrow-right"></i></nuxt-link>
                    <nuxt-link v-else :to="`/leger/${n.id}`" class="mt-2 btn btn-danger btn-sm border border-2 border-dark">Validasi sekarang <i class="bi bi-arrow-right"></i></nuxt-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Leger Nilai — e-PKL / SMKN 4 Tasikmalaya." })
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
let count_entrust = ref('')
if(role != 'jurusan' && role != 'admin' && role != 'guru') navigateTo('/404')

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

async function getEntrust() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user_id}" && isEntrust=true`,
  })
  if(res) {
    count_entrust.value = res
    isLoading.value = false
  }
}

onMounted(() => {
  getNilai()
  getEntrust()
  getNilaiByNotVerify()
  client.autoCancellation(false)
  client.collection('nilai').subscribe('*', function(e) {
    // param default getNilai: loading=true
    if(e.action == 'create' || e.action == 'update') getNilai(false)
  },{})
})
</script>
