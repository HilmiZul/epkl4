<template>
  <div class="col-sm-3 side-nav">
    <div class="card shadow-lg">
      <div class="card-body p-0">
        <div v-if="user" class="romana text-center text-muted py-2">Halo, <span class="border-3 border-bottom">{{ prokel }}</span>! 😃</div>
        <nav>
          <ol class="list-group list-group-flush">
            <nuxt-link to="/">
              <li class="list-group-item"><i class="bi bi-pie-chart-fill"></i> Statistik</li>
            </nuxt-link>
            <nuxt-link to="/peserta">
              <li class="list-group-item"><i class="bi bi-person-fill"></i> Peserta Didik</li>
            </nuxt-link>
            <nuxt-link to="/iduka">
              <li class="list-group-item"><i class="bi bi-buildings-fill"></i> IDUKA</li>
            </nuxt-link>
            <nuxt-link to="/pemetaan">
              <li class="list-group-item"><i class="bi bi-diagram-3-fill"></i> Pemetaan</li>
            </nuxt-link>
            <nuxt-link to="/jurnal">
              <li class="list-group-item"><i class="bi bi-journals"></i> Jurnal Peserta</li>
            </nuxt-link>
            <nuxt-link to="/verifikasi">
              <li class="list-group-item"><i class="bi bi-patch-check-fill"></i> Verifikasi</li>
            </nuxt-link>
            <nuxt-link to="/analitik">
              <li class="list-group-item"><i class="bi bi-bar-chart-fill"></i> Analitik</li>
            </nuxt-link>
            <nuxt-link to="/users" v-if="role === 'admin'">
              <li class="list-group-item"><i class="bi bi-people-fill"></i> Users</li>
            </nuxt-link>
            <nuxt-link to="/logout">
              <li class="list-group-item text-danger"><i class="bi bi-box-arrow-right"></i> Keluar</li>
            </nuxt-link>
            <div class="modal fade" id="logout">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header"><h3>Logout</h3></div>
                  <div class="modal-body">
                    keluar dari app?
                  </div>
                  <div class="modal-footer">
                    <nuxt-link to="/logout" class="btn btn-dark">keluar</nuxt-link>
                    <button class="btn btn-light" data-bs-dismiss="modal">tidak</button>
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
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = ref()
let nama = user?.user.value.nama
let role = user?.user.value.role

const getProkel = async () => {
  client.autoCancellation(false)
  let data = await client
    .collection('program_keahlian')
    .getOne(user?.user.value.program_keahlian, {
      expand: 'nama'
    })
  if(data) prokel.value = data.nama
}

onMounted(() => {
  getProkel()
})
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover > li {
  background-color: #f0f0f0;
}
.list-group-item {
  border: none !important;
  border-bottom: 1px solid #dfdfdf !important;
}
@media screen and (max-width: 992px) {
  .side-nav {
    display: none;
  }
}
</style>
