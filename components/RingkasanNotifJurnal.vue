<template>
  <div>
    <div v-if="isLoading">
      <p class="placeholder-glow">
        <span class="placeholder col-6 py-3"></span>
      </p>
    </div>
    <div v-else-if="!isLoading && count > 0" class="alert alert-info">
      <i class="bi bi-info-circle"></i> Ada {{ count }} Jurnal yang belum divalidasi.
      <nuxt-link to="/jurnal" class="btn btn-warning btn-sm border border-2 border-dark">Ayo validasi <i class="bi bi-arrow-right"></i></nuxt-link>
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
    filter: "pembimbing='"+user.user.value.id+"' && isValid=false"
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
