<template>
  <div>
    <h3>Hello, {{ nama }}! <span class="text-muted">({{ prokel }})</span></h3>
    <div class="card">
      <div class="card-body">
        <div class="mb-4">Statistik Pemetaan PKL dalam dan luar kota.</div>
        <div class="row">
          <div class="col-md-5">
            <chart-statistik-pemetaan />
          </div>
          <DetailStatistik v-if="role === 'admin'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let nama = user.user.value.nama
let role = user.user.value.role
let prokel_id = user.user.value.program_keahlian
let prokel = ref()

const getProkel = async () => {
  let data = await client
    .collection('program_keahlian')
    .getOne(prokel_id, {
      expand: 'nama'
    })
  if(data) prokel.value = data.nama
}

onMounted(() => {
  getProkel()
})
</script>
