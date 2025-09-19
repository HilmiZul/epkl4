<template>
  <div class="col-lg-3 side-nav">
    <Header />
    <div class="card shadow-lg">
      <div v-confetti v-if="isConfetti" class="posiiton-absolute top-0 start-50 translate-middle-x"></div>
      <div class="card-body p-0">
        <div v-if="user" class="lexend-mega text-center py-2 border-2 border-bottom border-dark text-muted">Halo, <span class="text-dark">{{ username.toUpperCase() }}</span>!
          <span @click="moreConfetti" class="hand-cursor">😃</span>
        </div>
        <nav>
          <ol class="list-group list-group-flush quicksand fw-bold">
            <nuxt-link to="/" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-pie-chart-fill"></i> Ringkasan</li>
            </nuxt-link>
            <nuxt-link v-if="role === 'admin' || role === 'jurusan'" to="/elemen" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-journal-bookmark-fill"></i> Elemen</li>
            </nuxt-link>
            <nuxt-link v-if="role === 'admin' || role === 'jurusan'" to="/pembimbing" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-emoji-smile"></i> Pembimbing</li>
            </nuxt-link>
            <nuxt-link v-if="role === 'admin' || role === 'jurusan'" to="/peserta" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-person-fill"></i> Peserta Didik</li>
            </nuxt-link>
            <nuxt-link v-if="role === 'admin' || role === 'jurusan'" to="/iduka" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-buildings-fill"></i> IDUKA</li>
            </nuxt-link>
            <nuxt-link to="/pemetaan/pkl" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-diagram-3-fill"></i> Pemetaan</li>
            </nuxt-link>
            <!-- <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/peserta/users">
              <li class="list-group-item"><i class="bi bi-people-fill"></i> User Peserta</li>
            </nuxt-link> -->
            <!-- <nuxt-link to="/pemetaan/pembimbing">
              <li class="list-group-item"><i class="bi bi-people-fill"></i> Pemetaan Pembimbing</li>
            </nuxt-link> -->
            <nuxt-link v-if="role === 'admin' || role === 'jurusan' || role === 'guru'" to="/jurnal" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-journals"></i> Jurnal Peserta</li>
            </nuxt-link>
            <nuxt-link v-if="role === 'admin' || role === 'tu'" to="/pengaturan" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-sliders"></i> Pengaturan</li>
            </nuxt-link>
            <!-- <nuxt-link v-if="role === 'admin' || role === 'jurusan'" to="/sertifikat" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-person-vcard-fill"></i> Sertifikat</li>
            </nuxt-link> -->
            <nuxt-link to="/ubah-password" :activeClass="activeClass">
              <li class="list-group-item"><i class="bi bi-key"></i> Ubah Password</li>
            </nuxt-link>
            <!-- <nuxt-link v-if="role === 'admin' || role === 'jurusan'" to="/verifikasi">
              <li class="list-group-item"><i class="bi bi-patch-check"></i> Verifikasi</li>
            </nuxt-link> -->
            <!-- <nuxt-link to="/analitik">
              <li class="list-group-item"><i class="bi bi-bar-chart-fill"></i> Analitik</li>
            </nuxt-link> -->
            <nuxt-link to="/logout" :activeClass="activeClass">
              <li class="list-group-item text-danger"><i class="bi bi-box-arrow-right"></i> Keluar</li>
            </nuxt-link>
            <div class="modal" id="logout" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header"><h3>Logout</h3></div>
                  <div class="modal-body">
                    keluar dari app?
                  </div>
                  <div class="modal-footer">
                    <nuxt-link to="/logout" class="btn btn-success">keluar</nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </ol>
        </nav>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { vConfetti } from '@neoconfetti/vue'

let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = ref({})
let nama = user?.user.value.nama
let role = user?.user.value.role
let username = user?.user.value.username
let isConfetti = ref(false)
let activeClass = ref('list-group-item-active')

const moreConfetti = async () => {
  isConfetti.value = false
  await Promise.resolve()
  isConfetti.value = true
}
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover > li {
  background-color: #f0f0f0;
}
.list-group-item {
  font-size: 1.2em;
  border: none !important;
  border-bottom: 2px solid #000 !important;
}
.list-group-item:hover,
a.list-group-item-active > li {
  background-color: #b5d2ad !important;
}
@media screen and (max-width: 992px) {
  .side-nav {
    display: none;
  }
}
</style>
