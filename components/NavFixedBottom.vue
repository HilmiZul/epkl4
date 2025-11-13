<template>
  <nav class="navbar navbar-expand fixed-bottom bg-white border-top border-3 border-dark p-0">
    <div class="container-fluid justify-content-around">
      <ul class="navbar-nav text-center fw-bold">
        <li class="nav-item me-3">
          <nuxt-link class="nav-link text-dark" to="/">
            <i class="bi bi-house-door fs-2"></i> <br>
            <!-- <span class="smallest">Home</span> -->
          </nuxt-link>
        </li>
        <li class="nav-item me-3">
          <nuxt-link class="nav-link text-dark" to="/pemetaan/pkl">
            <i class="bi bi-diagram-3-fill fs-2"></i> <br>
            <!-- <span class="smallest">Pemetaan</span> -->
          </nuxt-link>
        </li>
        <li class="nav-item me-3">
          <nuxt-link class="nav-link  text-dark" to="/jurnal">
            <i class="bi bi-journals fs-2"></i> <br>
            <!-- <span class="smallest">Jurnal</span> -->
          </nuxt-link>
        </li>
        <li class="nav-item me-2">
          <nuxt-link class="nav-link text-dark" href="/nilai">
            <i class="bi bi-patch-check fs-2"></i> <br>
            <!-- <span class="smallest">Nilai</span> -->
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link text-dark" href="/personalisasi">
            <i class="bi bi-person fs-2"></i> <br>
            <!-- <span class="smallest">Personal</span> -->
          </nuxt-link>
        </li>
        <!-- <li class="nav-item">
          <nuxt-link class="nav-link  text-dark" href="/ubah-password">
            <i class="bi bi-key fs-4"></i> <br>
            <span class="smallest">Password</span>
          </nuxt-link>
        </li> -->
      </ul>
    </div>
  </nav>
</template>
