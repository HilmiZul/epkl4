<template>
  <div class="col-lg-12">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Program Keahlian</th>
          <th>Dalam Kota</th>
          <th>Luar Kota</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="fw-bold">PPLG</td>
          <td>{{ jumlahDalamKota.pplg }}</td>
          <td>{{ jumlahLuarKota.pplg }}</td>
          <td>{{ jumlahDalamKota.pplg + jumlahLuarKota.pplg }}</td>
        </tr>
        <tr>
          <td class="fw-bold">TJKT</td>
          <td>{{ jumlahDalamKota.tjkt }}</td>
          <td>{{ jumlahLuarKota.tjkt }}</td>
          <td>{{ jumlahDalamKota.tjkt + jumlahLuarKota.tjkt }}</td>
        </tr>
        <tr>
          <td class="fw-bold">TSM</td>
          <td>{{ jumlahDalamKota.tsm }}</td>
          <td>{{ jumlahLuarKota.tsm }}</td>
          <td>{{ jumlahDalamKota.tsm + jumlahLuarKota.tsm }}</td>
        </tr>
        <tr>
          <td class="fw-bold">DKV</td>
          <td>{{ jumlahDalamKota.dkv }}</td>
          <td>{{ jumlahLuarKota.dkv }}</td>
          <td>{{ jumlahDalamKota.dkv + jumlahLuarKota.dkv }}</td>
        </tr>
        <tr>
          <td class="fw-bold">TOI</td>
          <td>{{ jumlahDalamKota.toi }}</td>
          <td>{{ jumlahLuarKota.toi }}</td>
          <td>{{ jumlahDalamKota.toi + jumlahLuarKota.toi }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let isLoadingDalamKota = ref(true)
let isLoadingLuarKota = ref(true)
let isLoadingTotal = ref(true)

let jumlahDalamKota = ref({
  pplg: 0,
  tjkt: 0,
  tsm: 0,
  dkv: 0,
  toi: 0,
})

let jumlahLuarKota = ref({
  pplg: 0,
  tjkt: 0,
  tsm: 0,
  dkv: 0,
  toi: 0,
})

async function getIduka(prokel, wilayah) {
  isLoadingDalamKota.value = true
  let res = await client.collection('iduka').getList(1,1,{
    filter: `wilayah="${wilayah}" && program_keahlian.nama="${prokel}" && isArchive=false`,
    expand: `program_keahlian`
  })
  if(res) {
    isLoadingDalamKota.value = false
    if(prokel == "PPLG" && wilayah == "dalam") jumlahDalamKota.value.pplg = res.totalItems
    else if(prokel == "TJKT" && wilayah == "dalam") jumlahDalamKota.value.tjkt = res.totalItems
    else if(prokel == "TSM" && wilayah == "dalam") jumlahDalamKota.value.tsm = res.totalItems
    else if(prokel == "DKV" && wilayah == "dalam") jumlahDalamKota.value.dkv = res.totalItems
    else if(prokel == "TOI" && wilayah == "dalam") jumlahDalamKota.value.toi = res.totalItems
    else if(prokel == "PPLG" && wilayah == "luar") jumlahLuarKota.value.pplg = res.totalItems
    else if(prokel == "TJKT" && wilayah == "luar") jumlahLuarKota.value.tjkt = res.totalItems
    else if(prokel == "TSM" && wilayah == "luar") jumlahLuarKota.value.tsm = res.totalItems
    else if(prokel == "DKV" && wilayah == "luar") jumlahLuarKota.value.dkv = res.totalItems
    else if(prokel == "TOI" && wilayah == "luar") jumlahLuarKota.value.toi = res.totalItems
  }
}


onMounted(() => {
  getIduka("PPLG", "dalam")
  getIduka("PPLG", "luar")
  getIduka("TJKT", "dalam")
  getIduka("TJKT", "luar")
  getIduka("TSM", "dalam")
  getIduka("TSM", "luar")
  getIduka("DKV", "dalam")
  getIduka("DKV", "luar")
  getIduka("TOI", "dalam")
  getIduka("TOI", "luar")
})

</script>
