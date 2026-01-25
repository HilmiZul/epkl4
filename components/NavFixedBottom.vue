<template>
  <nav class="navbar navbar-expand fixed-bottom bg-white border-top border-3 border-dark pt-1">
    <div class="container-fluid justify-content-center">
      <ul class="navbar-nav text-center fw-bold">
        <li class="nav-item me-2">
          <nuxt-link class="nav-link text-dark" to="/">
            <i class="bi bi-house-door fs-5"></i> <br>
            <span class="smallest">Home</span>
          </nuxt-link>
        </li>
        <li class="nav-item me-2">
          <nuxt-link class="nav-link text-dark" to="/pemetaan/pkl">
            <i class="bi bi-diagram-3-fill fs-5"></i> <br>
            <span class="smallest">Pemetaan</span>
          </nuxt-link>
        </li>
        <li class="nav-item me-2">
          <nuxt-link class="nav-link text-dark" to="/jurnal">
            <div v-if="countInvalidatedJournal > 0" class="badge bg-danger rounded-5 smallest">
              {{ countInvalidatedJournal }}
            </div>
            <i class="bi bi-journals fs-5"></i> <br>
            <span class="smallest">Jurnal</span>
          </nuxt-link>
        </li>
        <li class="nav-item me-2">
          <nuxt-link class="nav-link text-dark" href="/leger">
            <div v-if="countInvalidatedNilai > 0" class="badge bg-danger rounded-5 smallest">
              {{ countInvalidatedNilai }}
            </div>
            <i class="bi bi-patch-check fs-5"></i> <br>
            <span class="smallest">Nilai</span>
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link text-dark" href="/personalisasi">
            <i class="bi bi-person fs-5"></i> <br>
            <span class="smallest">Personal</span>
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



<script setup>
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let countInvalidatedJournal = ref(0)
let countInvalidatedNilai = ref(0)

async function getCountInvalidatedJournal() {
  let res = await client.collection('jurnal').getList(1,1, {
    filter: `iduka.pembimbing_sekolah="${user.user.value.id}" && isValid=false && isDraft=false`
  })
  if(res) {
    countInvalidatedJournal.value = res.totalItems
  }
}

async function getCountInvalidatedNilai() {
  let res = await client.collection('nilai').getList(1,1, {
    filter: `iduka.pembimbing_sekolah="${user.user.value.id}" && isValid=false`,
  })
  if(res) {
    countInvalidatedNilai.value = res.totalItems
  }
}

onMounted(() => {
  getCountInvalidatedJournal()
  getCountInvalidatedNilai()
  client.collection('jurnal').subscribe('*', function(e){
    if(e.action == 'create' || e.action == 'update') getCountInvalidatedJournal()
  },{})
  client.collection('nilai').subscribe('*', function(e){
    if(e.action == 'create' || e.action == 'update') getCountInvalidatedNilai()
  },{})
})
</script>

<style scoped>
.nav-item {
  position: relative;
} 
.nav-item .badge {
  color: #fff !important;
  border: 2px solid #fff !important;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
