<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-emoji-smile"></i> Pembimbing</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan' || role == 'wakasek'" to="/pembimbing/tambah" class="btn btn-success btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <div v-if="teachers_jjm > 0" class="alert alert-warning">Ada <span class="fw-bold">{{ teachers_jjm }}</span> Guru yang belum memenuhi Jumlah Jam Mengajar (JP)</div>

      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <!-- <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control" placeholder="🔎 Cari nama atau NIP..." /> -->
            <input v-if="role == 'wakasek' || role == 'tu'" type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="🔎 Cari username/nama/program keahlian" />
            <input v-else type="search" v-model="keyword" class="form form-control form-control-lg" placeholder="🔎 Cari username / nama" />
          </div>
        </div>
        <div class="col align-content-center">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-else class="mb-3 text-grey float-end badge">{{ itemFiltered.length }} pembimbing</div>
        </div>
      </div>

      <div v-if="isLoading" class="text-center my-5">
        <LoadingPlaceholder :col="12" :row="5" />
      </div>

      <div v-else-if="!isLoading && itemFiltered.length < 1" class="text-center my-5">
        <div class="text-muted"><i class="bi bi-database-fill fs-1"></i></div>
        <div class="pb-3 text-muted">Pembimbing belum tersedia/tidak ditemukan</div>
      </div>

      <ul v-else v-for="(pembimbing,i) in itemFiltered" :key="pembimbing.id" class="list-group list-group-flush">
        <nuxt-link v-if="role == 'jurusan' || role == 'wakasek'" :to="`/pembimbing/${pembimbing.id}`" class="link">
          <li class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-2 border-grey">
            <div v-if="role == 'tu' || role == 'wakasek'" class="me-2">
              <span class="badge border border-1 border-grey text-muted rounded-pill">{{ pembimbing.expand.program_keahlian.nama }}</span>
            </div>

            <div class="ms-2 me-auto fw-bold">
              <div class="fs-6">{{ pembimbing.nama }}</div>

              <div class="text-muted mb-2">
                {{ pembimbing.username}}
              </div>

              <NuxtLink :to="`/pembimbing/${pembimbing.id}`" class="link text-muted">
                <i class="bi bi-lock-fill"></i> Reset Password
              </NuxtLink>
            </div>

            <span v-if="pembimbing.jjm < 2" class="badge text-bg-danger rounded-pill me-2">{{ pembimbing.jjm }} jp</span>
            <span v-else class="badge text-bg-dark rounded-pill me-2">{{ pembimbing.jjm }} jp</span>
            <span v-if="pembimbing.konversi_jjm_ke_jumlah_siswa > 0" class="badge text-bg-dark rounded-pill me-2">{{ pembimbing.konversi_jjm_ke_jumlah_siswa }} siswa</span>

            <span v-if="pembimbing.role == 'jurusan'" class="badge border border-1 border-grey text-muted rounded-pill">Manajemen</span>
            <span v-else class="badge border border-1 border-grey text-muted rounded-pill">Guru Pembimbing</span>
          </li>
        </nuxt-link>

        <li v-else-if="role == 'tu'" class="list-group-item d-flex justify-content-between align-items-start py-3 border-bottom border-2 border-grey">
          <div class="me-2">
            <span v-if="role == 'tu'" class="badge border border-1 border-grey text-muted rounded-pill">{{ pembimbing.expand.program_keahlian.nama }}</span>
          </div>

          <div class="ms-2 me-auto fw-bold">
            <div class="fs-6">{{ pembimbing.nama }}</div>

            <div v-if="role == 'tu'" class="text-muted mb-2">
              {{ pembimbing.username}}
            </div>

            <div v-else class="text-muted mb-2">
              {{ pembimbing.username}} &#8212;
              <span v-if="pembimbing.role == 'jurusan'">Manajemen</span>
              <span v-else>Guru Pembimbing</span>
            </div>
          </div>

          <span v-if="pembimbing.jjm < 2" class="badge border border-1 border-grey text-muted rounded-pill me-2 text-danger">{{ pembimbing.jjm }} jp</span>
          <span v-else class="badge border border-1 border-grey text-muted rounded-pill me-2">{{ pembimbing.jjm }} jp</span>

          <span v-if="role == 'jurusan'">
            <span v-if="pembimbing.role == 'jurusan'" class="badge border border-1 border-grey text-muted rounded-pill">Manajemen</span>
            <span v-else class="badge border border-1 border-grey text-muted rounded-pill">Guru Pembimbing</span>
          </span>
        </li>
      </ul>
    </div>

    <!-- <div v-if="itemFiltered.length > 0">
      <div v-for="pembimbing in itemFiltered" :key="pembimbing.id">
        <div class="modal" :id="`pem-${pembimbing.id}`" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
              <div class="modal-header rounded-0 h4 bg-danger text-white quicksand">
                Peringatan!
              </div>
              <div class="modal-body text-dark small">
                Yakin nih mau hapus {{ pembimbing.nama }} dari Pembimbing?
              </div>
              <div class="modal-footer">
                <button v-if="!isDeleted" class="btn btn-danger" data-bs-dismiss="modal" @click="hapusData(pembimbing.id)" :disabled="isSending">
                  <span v-if="isSending">Sedang menghapus</span>
                  <span v-else>Hapus</span>
                </button>
                <span v-else class="me-2"><em>Berhasil dihapus!</em></span>
                <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-light" data-bs-dismiss="modal">Gajadi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Pembimbing — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let teachers = ref([])
let isLoading = ref(true)
let isSending = ref(false)
let isDeleted = ref(false)
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let keyword = ref('')
let teachers_jjm = ref(0)

if(role != 'jurusan' && role != 'admin' && role != 'wakasek' && role != 'tu') navigateTo('/404')

// async function hapusData(id) {
  // isLoading.value = true
  // let res = await client.collection('siswa').getFullList({
  //   filter: "pembimbing='"+id+"'"
  // })
  // if(res) {
  //   if(res.length > 0) {
  //     for(let i=0; i<res.length; i++) {
  //       console.log(`update siswa: ${res[i].id}`)
  //       await client.collection('siswa').update(res[i].id, { pembimbing: '' })
  //     }
  //     await client.collection('teacher_users').delete(id)
  //     isLoading.value = false
  //   } else {
  //     await client.collection('teacher_users').delete(id)
  //     isLoading.value = false
  //   }
  // }
  // await client.collection('teacher_users').delete(id)
// }

async function getPembimbingByProkel() {
  isLoading.value = true

  // filter & sort berdasarkan role `wakasek` aja
  let filterQuery = `program_keahlian="${prokel}" && role!="admin"`
  let sorting = `-role, kelompok_mapel, nama`
  if(role == 'wakasek' || role == 'tu') {
    filterQuery = `role!="wakasek" && role!="admin" && role!="tu"`
    sorting = `program_keahlian.nama, nama`
  }

  client.autoCancellation(false)
  let data = await client.collection('teacher_users').getFullList({
    filter: filterQuery,
    expand: "program_keahlian",
    sort: sorting
  })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

async function getGuruByJjm() {
  let filters = `(role="guru" || role="jurusan") && program_keahlian="${prokel}" && jjm < 2`

  if(role == 'jurusan' || role == 'guru') {
    filters = `(role="guru" || role="jurusan") && program_keahlian="${prokel}" && jjm < 2`
  } else if(role == 'wakasek' || role == 'tu') {
    filters = `(role="guru" || role="jurusan") && jjm < 2`
  }

  let res = await client.collection('teacher_users').getList(1, 1, {
    filter: filters
  })

  if(res) {
    teachers_jjm.value = res.totalItems
  }
}

const itemFiltered = computed(() => {
  return teachers.value.filter((i) => {
    return (
      i.username.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.role.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.program_keahlian.nama.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

onMounted(() => {
  getGuruByJjm()
  getPembimbingByProkel()
  client.collection('teacher_users').subscribe('*', function(e) {
    if(e.action == "delete") getPembimbingByProkel()
  }, {})
})
</script>
