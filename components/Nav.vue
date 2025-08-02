<template>
  <div class="col-md-2">
    <div class="card shadow-lg">
      <div class="card-body">
        <nav>
          <ol class="list-group list-group-flush">
            <nuxt-link to="/">
              <li class="list-group-item"><i class="bi bi-speedometer"></i> Dashboard</li>
            </nuxt-link>
            <nuxt-link to="/peserta">
              <li class="list-group-item"><i class="bi bi-people-fill"></i> Peserta Didik</li>
            </nuxt-link>
            <nuxt-link to="/dudi">
              <li class="list-group-item"><i class="bi bi-buildings-fill"></i> DU/DI</li>
            </nuxt-link>
            <nuxt-link to="/pemetaan">
              <li class="list-group-item"><i class="bi bi-git"></i> Pemetaan</li>
            </nuxt-link>
            <nuxt-link to="/pemetaan">
              <li class="list-group-item"><i class="bi bi-person-fill"></i> Users</li>
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

<style scoped>
a {
  text-decoration: none;
}
a:hover > li {
  background-color: #f0f0f0;
}
</style>
