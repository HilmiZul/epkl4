<template>
  <div>
    <h1>print!!!</h1>
    <div v-if="!isLoading">
      <h2>iduka {{ pemetaan[0].iduka }}</h2>
      <h2>prokel {{ prokel }}</h2>
      <h3>{{ pemetaan[0].expand.iduka.nama }}</h3>
      <h3>{{ pemetaan[0].expand.iduka.alamat }}</h3>
      <ul v-for="p in pemetaan" :key="p.id">
        <li>{{ p.expand.siswa.nama }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'print',
  middleware: 'auth'
})
let route = useRoute()
useHead({ title: `Cetak Pemetaan — ${route.params.id}`})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let isLoading = ref(true)
let pemetaan = ref([])
let prokel = user.user.value.program_keahlian

async function getPemetaanById() {
  isLoading.value = true
  let data = await client.collection('pemetaan').getFullList({
    expand: "iduka, siswa, program_keahlian",
    filter: "iduka='"+route.params.id+"'"
  })
  if(data) {
    isLoading.value = false
    pemetaan.value = data
  }
}

onMounted(() => getPemetaanById())

setTimeout(function () { window.print(); }, 500);
window.onfocus=function() {
  setTimeout(function () { window.close(); }, 100);
}
</script>
