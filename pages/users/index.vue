<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 public-sans text-grey"><i class="bi bi-people-fill"></i> Users</span>
      <span v-if="!isLoading && role == 'jurusan' || role == 'admin'" class="float-end">
        <nuxt-link class="btn btn-info"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <input type="search" @change="usersFiltered" v-model="keyword" class="form form-control form-control-md" placeholder="🔎 Cari berdasarkan username / nama / role..." />
          </div>
        </div>
        <div class="col align-content-center">
          <div class="mb-3 text-grey float-end">{{ usersFiltered?.length }} user</div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Nama</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="text-center my-5">
              <td colspan="4"><Loading /></td>
            </tr>
            <tr v-else-if="usersFiltered.length < 1" class="text-center my-5">
              <td colspan="5">Data tidak ditemukan</td>
            </tr>
            <tr v-for="(user,i) in usersFiltered" :key="user.id">
              <td>{{ i+1 }}.</td>
              <td>{{ user.username }}</td>
              <td>{{ user.nama }}</td>
              <td>{{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Users management — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let users = ref([])
let keyword = ref('')

async function getUsers() {
  isLoading.value = true
  let res = await client.collection('teacher_users').getFullList({
    expand: "pembimbing, program_keahlian",
    filter: "program_keahlian='"+prokel+"' && role!='admin'",
  })
  if(res) {
    isLoading.value = false
    users.value = res
  }
}

const usersFiltered = computed(() => {
  return users.value.filter((i) => {
    return (
      i.username.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.pembimbing.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.role.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

onMounted(() => {
  getUsers()
  client.collection('teacer_users').subscribe('*', function(e) {
    if(e.action == 'update') getUsers()
  }, {})
})
</script>
