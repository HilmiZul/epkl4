<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary bg-white border-top border-bottom border-3 border-dark mb-3">
    <div class="container-fluid">
      <nuxt-link v-if="user" class="navbar-brand lexend-mega text-muted" to="/">Halo, <span class="text-dark">{{ username.toUpperCase() }}</span>! 😃</nuxt-link>
      <button class="navbar-toggler rounded-0 border-3 border-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <i class="bi-three-dots-vertical fs-1 text-dark"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav fw-bold text-center">
          <li class="nav-item">
            <nuxt-link  class="nav-link" to="/"><i class="bi bi-pie-chart-fill"></i> Overview</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link  class="nav-link" to="/personalisasi"><i class="bi bi-person"></i> Personalisasi</nuxt-link>
          </li>
          <li v-if="role === 'admin' || role === 'jurusan' || role === 'guru'" class="nav-item">
            <nuxt-link  class="nav-link" to="/elemen"><i class="bi bi-journal-bookmark-fill"></i> Elemen</nuxt-link>
          </li>
          <li v-if="role === 'admin' || role === 'jurusan'" class="nav-item">
            <nuxt-link  class="nav-link" to="/pembimbing"><i class="bi bi-emoji-smile"></i> Pembimbing</nuxt-link>
          </li>
          <li v-if="role === 'admin' || role === 'jurusan'" class="nav-item">
            <nuxt-link class="nav-link" to="/peserta"><i class="bi bi-person-fill"></i> Peserta Didik</nuxt-link>
          </li>
          <li v-if="role === 'admin' || role === 'jurusan' || role === 'wakasek'" class="nav-item">
            <nuxt-link class="nav-link" to="/iduka"><i class="bi bi-buildings-fill"></i> IDUKA</nuxt-link>
          </li>
          <li  class="nav-item">
            <nuxt-link class="nav-link" to="/pemetaan/pkl"><i class="bi bi-diagram-3-fill"></i> Pemetaan</nuxt-link>
          </li>
          <!-- <li v-if="role == 'admin' || role == 'jurusan'" class="nav-item">
            <nuxt-link class="nav-link" to="/peserta/users"><i class="bi bi-people-fill"></i> User Peserta</nuxt-link>
          </li>
          <li  class="nav-item">
            <nuxt-link class="nav-link" to="/pemetaan/pembimbing"><i class="bi bi-people-fill"></i> Pemetaan Pembimbing</nuxt-link>
          </li> -->
          <li v-if="role === 'admin' || role === 'jurusan' || role === 'guru'" class="nav-item">
            <nuxt-link class="nav-link" to="/jurnal"><i class="bi bi-journals"></i> Jurnal Peserta</nuxt-link>
          </li>
          <li v-if="role === 'admin' || role === 'tu'" class="nav-item">
            <nuxt-link class="nav-link" to="/pengaturan"><i class="bi bi-sliders"></i> Pengaturan</nuxt-link>
          </li>
          <li v-if="role === 'admin' || role === 'jurusan' || role === 'guru'" class="nav-item">
            <nuxt-link class="nav-link" to="/nilai"><i class="bi bi-patch-check"></i> Nilai</nuxt-link>
          </li>
          <!-- <li v-if="role === 'admin' || role === 'jurusan' || role === 'guru'" class="nav-item">
            <nuxt-link class="nav-link" to="/sertifikat"><i class="bi bi-person-vcard-fill"></i> Setifikat</nuxt-link>
          </li> -->
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/ubah-password"><i class="bi bi-key"></i> Ubah Password</nuxt-link>
          </li>
          <!-- <li class="nav-item">
            <nuxt-link class="nav-link" to="/verifikasi"><i class="bi bi-patch-check-fill"></i> Verifikasi</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/analitik"><i class="bi bi-bar-chart-fill"></i> Analitik</nuxt-link>
          </li> -->
          <li class="nav-item">
            <nuxt-link class="nav-link text-danger" to="/logout"><i class="bi bi-box-arrow-right"></i> Keluar</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = ref()
let nama = user?.user.value.nama
let role = user?.user.value.role
let username = user?.user.value.username

// const getProkel = async () => {
//   client.autoCancellation(false)
//   let data = await client
//     .collection('program_keahlian')
//     .getOne(user?.user.value.program_keahlian, {
//       expand: 'nama'
//     })
//   if(data) prokel.value = data.nama
// }

onMounted(() => {
  // getProkel()
})
</script>

<style scoped>
@media screen and (min-width: 992px) {
  .navbar {
    display: none;
  }
}
.nav-item a {
  color: #000;
}
</style>
