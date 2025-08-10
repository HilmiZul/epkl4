<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 public-sans text-grey"><i class="bi bi-emoji-smile"></i> Pembimbing</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/pembimbing/tambah" class="btn btn-info btn-sm"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <!-- <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan nama atau NIP..." /> -->
            <input type="search" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan nama atau NIP..." />
          </div>
        </div>
        <div class="col align-content-center">
          <div class="mb-3 text-grey float-end">{{ itemFiltered.length }} pembimbing</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->
      <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th width="2%">#</th>
              <th>Nama</th>
              <th>Role</th>
              <th v-if="role == 'admin'" width="15%">Hapus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="text-center my-5">
              <td colspan="5"><Loading /></td>
            </tr>
            <tr v-else-if="itemFiltered.length < 1" class="text-center my-5">
              <td colspan="5">Data tidak ditemukan.</td>
            </tr>
            <tr v-else v-for="(pembimbing,i) in itemFiltered" :key="pembimbing.id">
              <td>{{ i+1 }}.</td>
              <td><nuxt-link :to="`/pembimbing/${pembimbing.id}`" class="link">{{ pembimbing.nama }}</nuxt-link></td>
              <td>{{ pembimbing.role.charAt(0).toUpperCase() + pembimbing.role.slice(1) }}</td>
              <td v-if="role == 'admin'"><button class="btn btn-danger btn-sm" data-bs-toggle="modal" :data-bs-target="`#pem-${pembimbing.id}`">hapus</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="itemFiltered.length > 0">
      <div v-for="pembimbing in itemFiltered" :key="pembimbing.id">
        <div class="modal" :id="`pem-${pembimbing.id}`">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
              <div class="modal-header rounded-0 h4 bg-danger text-white public-sans">
                Peringatan!
              </div>
              <div class="modal-body text-dark small">
                Yakin nih mau hapus <span class="romana">{{ pembimbing.nama }}</span> dari Pembimbing?
              </div>
              <div class="modal-footer">
                <button v-if="!isDeleted" class="btn btn-danger btn-sm" data-bs-dismiss="modal" @click="hapusData(pembimbing.id)" :disabled="isSending">
                  <span v-if="isSending">Sedang menghapus</span>
                  <span v-else>Hapus</span>
                </button>
                <span v-else class="me-2"><em>Berhasil dihapus!</em></span>
                <button @click="() => { isDeleted = false; isSending = flase }" class="btn btn-light btn-sm" data-bs-dismiss="modal">Gajadi</button>
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

async function hapusData(id) {
  console.log('belum dilakukan! karena terikat tabel lain.')
  // await client.collection('teacher_users').delete(id)
}

async function getPembimbingByProkel() {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client.collection('teacher_users').getFullList({
    filter: "program_keahlian='"+prokel+"' && role!='admin'",
    expand: "program_keahlian",
    sort: 'nama'
  })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

async function searchByKeyword() {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client.collection('teacher_users').getFullList({
    filter: "nama~'"+keyword.value+"' || username~'"+keyword.value+"' || role~'"+keyword.value+"' && program_keahlian='"+prokel+"'",
    expand: "program_keahlian",
    sort: 'nama'
  })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

const itemFiltered = computed(() => {
  return teachers.value.filter((i) => {
    return (
      i.username.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.role.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

onMounted(() => {
  getPembimbingByProkel()
  client.collection('teacher_users').subscribe('*', function(e) {
    if(e.action == "delete") getPembimbingByProkel()
  }, {})
})
</script>
