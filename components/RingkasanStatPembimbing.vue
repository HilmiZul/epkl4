<template>
  <div class="col-lg-12">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Program Keahlian</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="fw-bold">PPLG</td>
          <td>{{ totalPembimbing.pplg }}</td>
        </tr>
        <tr>
          <td class="fw-bold">TJKT</td>
          <td>{{ totalPembimbing.tjkt }}</td>
        </tr>
        <tr>
          <td class="fw-bold">TSM</td>
          <td>{{ totalPembimbing.tsm  }}</td>
        </tr>
        <tr>
          <td class="fw-bold">DKV</td>
          <td>{{ totalPembimbing.dkv  }}</td>
        </tr>
        <tr>
          <td class="fw-bold">TOI</td>
          <td>{{ totalPembimbing.toi  }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
let client = usePocketBaseClient()
let isLoading = ref(true)

let totalPembimbing = ref({
  pplg: 0,
  tjkt: 0,
  tsm: 0,
  dkv: 0,
  toi: 0,
})

// Ambil total pembimbing berdasarkan prokel (program keahlian)
// dengan role hanya `guru` atau `jurusan/manajemen`
// parameter prokel adalah nama prorgam keahlian, dipanggil dari onMounted
// biar hemat aja wkwkwk
async function getPembibming(prokel) {
  isLoading.value = true
  let res = await client.collection('teacher_users').getList(1,1,{
    filter: `program_keahlian.nama="${prokel}" && (role="guru" || role="jurusan")`,
  })
  if(res) {
    isLoading.value = false
    if(prokel == "PPLG") totalPembimbing.value.pplg = res.totalItems
    else if(prokel == "TJKT") totalPembimbing.value.tjkt = res.totalItems
    else if(prokel == "TSM") totalPembimbing.value.tsm = res.totalItems
    else if(prokel == "DKV") totalPembimbing.value.dkv = res.totalItems
    else if(prokel == "TOI") totalPembimbing.value.toi = res.totalItems
  }
}


onMounted(() => {
  getPembibming("PPLG")
  getPembibming("TJKT")
  getPembibming("TSM")
  getPembibming("DKV")
  getPembibming("TOI")
})

</script>
