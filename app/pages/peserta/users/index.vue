<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand"><i class="bi bi-people-fill"></i> User Peserta</span>
      <span class="float-end">
        <!-- <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/users/tambah" class="btn btn-info btn-sm me-2"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link> -->
        <!-- <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/users/import" class="btn btn-success btn-sm"><i class="bi bi-download"></i> Impor dari .csv</nuxt-link> -->
      </span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <input type="search" v-model="keyword" class="form form-control" placeholder="🔎 Cari username / nama / kelas" />
          </div>
        </div>
        <div class="col align-content-center">
          <div class="mb-3 text-grey float-end">{{ studentsFiltered.length }} peserta</div>
        </div>
      </div>
      <!-- <div v-if="isLoading"><Loading /></div> -->
      <div class="table-responsive">
        <table class="table table-hover table-striped table-borderless">
          <thead>
            <tr>
              <th width="2%">#</th>
              <th width="17%">Username</th>
              <th>Nama</th>
              <th>Kelas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="text-center my-5">
              <td colspan="4"><Loading /></td>
            </tr>
            <tr v-else-if="studentsFiltered.length < 1" class="text-center my-5">
              <td colspan="4">Data tidak ditemukan.</td>
            </tr>
            <tr v-for="(user,i) in studentsFiltered" :key="user.id">
              <td>{{ i+1 }}. </td>
              <td>{{ user.username }}</td>
              <td class="fw-bold">
                <nuxt-link :to="`/peserta/users/${user.id}`" class="link">{{ user.expand.siswa.nama }}</nuxt-link>
              </td>
              <td>{{ user.expand.siswa.kelas }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "User Peserta — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let students = ref([])
let isLoading = ref(true)
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let keyword = ref('')
let isCreatingUser = ref(false)
let isCreated = ref(false)
if(user?.user.value.role != 'jurusan' && user?.user.value.role != 'admin') navigateTo('/404')

onMounted(() => getUsers())

const getUsers = async () => {
  isLoading.value = true
  client.autoCancellation(false)
  const data = await client
    .collection('student_users')
    .getFullList({
      expand: "siswa",
      filter: "program_keahlian='"+prokel+"'",
      sort: 'siswa.kelas, siswa.nama',
    })
  if(data) {
    isLoading.value = false
    students.value = data
  }
}

const buatAkunPeserta = async () => {
  let s = students.value
  let tempUsers = []
  isCreatingUser.value = true
  isCreated.value = false
  try {
    for(let i=0; i<s.length; i++) {
      tempUsers.push({
        "username": s[i].nis,
        "email": "student@smkn4-tsm.sch.id",
        "emailVisibility": true,
        "password": "20276063",
        "passwordConfirm": "20276063",
        "program_keahlian": prokel,
        "siswa": s[i].id
      })
    }
    // console.log(tempUsers)
    // client.autoCancellation(false)
    // for (const item of tempUsers) {
    //   await client.collection('student_users').create(item)
    // }
    isCreated.value = true
    isCreatingUser.value = false
  } catch(error) {
    isCreated.value = true
    isCreatingUser.value = false
    console.error("Terjadi kesalahan: ",error)
  }
}

const searchByKeyword = async () => {
  isLoading.value = true
  client.autoCancellation(false)
  let data = await client
    .collection('student_users')
    .getFullList({
      expand: "siswa",
      filter: "username~'"+keyword.value+"' || siswa.nama~'"+keyword.value+"' && program_keahlian='"+prokel+"'"
    })
  if(data) {
    isLoading.value = false
    students.value = data
  }
}

const studentsFiltered = computed(() => {
  return students.value.filter((i) => {
    return (
      i.username.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.siswa.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.siswa.kelas.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})
</script>

