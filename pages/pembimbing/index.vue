<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 romana text-grey"><i class="bi bi-emoji-smile"></i> Pembimbing</span>
      <span class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/pembimbing/tambah" class="btn btn-dark btn-sm"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-lg-6">
          <div class="mb-4">
            <input type="search" @input="searchByKeyword" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan nama atau NIP..." />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="mb-4 text-muted">{{ teachers.length }} pembimbing</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->
      <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th width="2%">#</th>
              <th width="40%">NIP</th>
              <th>Nama</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="teachers.length < 1" class="text-center my-5">
              <td colspan="6">Data tidak ditemukan.</td>
            </tr>
            <tr v-else v-for="(pembimbing,i) in teachers" :key="pembimbing.id">
              <td>{{ i+1 }}.</td>
              <td>{{ pembimbing.nip }}</td>
              <td><nuxt-link :to="`/pembimbing/${pembimbing.id}`" class="link">{{ pembimbing.nama }}</nuxt-link></td>
            </tr>
          </tbody>
        </table>
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
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let keyword = ref('')

async function getPembimbingByProkel() {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client.collection('pembimbing').getFullList({
    filter: "program_keahlian='"+prokel+"'",
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
  let data = await client.collection('pembimbing').getFullList({
    filter: "nama~'"+keyword.value+"' || nip~'"+keyword.value+"' && program_keahlian='"+prokel+"'",
    expand: "program_keahlian",
    sort: 'nama'
  })
  if(data) {
    isLoading.value = false
    teachers.value = data
  }
}

onMounted(() => {
  getPembimbingByProkel()
})
</script>
