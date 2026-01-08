<template>
  <div>
    <div v-if="isLoading">
      <p class="placeholder-glow">
        <span class="placeholder col-6 py-3"></span>
      </p>
    </div>
    <div v-else-if="!isLoading && count > 0" class="alert alert-warning">
      Ada <span class="fw-bold">{{ count }}</span> Jurnal yang belum divalidasi.
      <nuxt-link to="/jurnal" class="link fw-bold">Ayo validasi <i class="bi bi-arrow-right"></i></nuxt-link>
    </div>
  </div>
</template>

<script setup>
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let isLoading = ref(true)
let count = ref(0)

async function getJournalCount(loading=true) {
  isLoading.value = loading
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getFullList({
    filter: `iduka.pembimbing_sekolah="${user.user.value.id}" && isValid=false && isDraft=false`
  })
  if(res) {
    isLoading.value = false
    count.value = res.length
  }
}

onMounted(() => {
  getJournalCount()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e){
    if(e.action == 'update' || e.action == 'create') getJournalCount(false)
  },{})
})
</script>
