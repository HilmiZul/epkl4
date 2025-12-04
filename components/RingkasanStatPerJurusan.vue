<template>
  <!-- PPLG -->
  <div class="col-md-3">
    <div class="card mb-4">
      <div class="card-header fw-bold">PPLG</div>
      <div class="card-body">
        <table class="table">
          <tbody>
            <tr>
              <td>Jumlah Peserta</td>
              <td>: {{ pplg_jumlah_peserta }}</td>
            </tr>
            <tr>
              <td>Sudah diterima</td>
              <td>: {{ pplg_jumlah_diterima }}</td>
            </tr>
            <tr>
              <td>Belum diterima</td>
              <td>: {{ pplg_jumlah_belum_diterima }}</td>
            </tr>
            <tr>
              <td>Belum pemetaan</td>
              <td>: {{ pplg_jumlah_belum_pemetaan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- TKJ -->
  <div class="col-md-3">
    <div class="card mb-4">
      <div class="card-header fw-bold">TJKT</div>
      <div class="card-body">
        <table class="table">
          <tbody>
            <tr>
              <td>Jumlah Peserta</td>
              <td>: {{ tkj_jumlah_peserta }}</td>
            </tr>
            <tr>
              <td>Sudah diterima</td>
              <td>: {{ tkj_jumlah_diterima }}</td>
            </tr>
            <tr>
              <td>Belum diterima</td>
              <td>: {{ tkj_jumlah_belum_diterima }}</td>
            </tr>
            <tr>
              <td>Belum pemetaan</td>
              <td>: {{ tkj_jumlah_belum_pemetaan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- TSM-->
  <div class="col-md-3">
    <div class="card mb-4">
      <div class="card-header fw-bold">TSM</div>
      <div class="card-body">
        <table class="table">
          <tbody>
            <tr>
              <td>Jumlah Peserta</td>
              <td>: {{ tsm_jumlah_peserta }}</td>
            </tr>
            <tr>
              <td>Sudah diterima</td>
              <td>: {{ tsm_jumlah_diterima }}</td>
            </tr>
            <tr>
              <td>Belum diterima</td>
              <td>: {{ tsm_jumlah_belum_diterima }}</td>
            </tr>
            <tr>
              <td>Belum pemetaan</td>
              <td>: {{ tsm_jumlah_belum_pemetaan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- DKV -->
  <div class="col-md-3">
    <div class="card mb-4">
      <div class="card-header fw-bold">DKV</div>
      <div class="card-body">
        <table class="table">
          <tbody>
            <tr>
              <td>Jumlah Peserta</td>
              <td>: {{ dkv_jumlah_peserta }}</td>
            </tr>
            <tr>
              <td>Sudah diterima</td>
              <td>: {{ dkv_jumlah_diterima }}</td>
            </tr>
            <tr>
              <td>Belum diterima</td>
              <td>: {{ dkv_jumlah_belum_diterima }}</td>
            </tr>
            <tr>
              <td>Belum pemetaan</td>
              <td>: {{ dkv_jumlah_belum_pemetaan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- TOI-->
  <div class="col-md-3">
    <div class="card mb-4">
      <div class="card-header fw-bold">TOI</div>
      <div class="card-body">
        <table class="table">
          <tbody>
            <tr>
              <td>Jumlah Peserta</td>
              <td>: {{ toi_jumlah_peserta }}</td>
            </tr>
            <tr>
              <td>Sudah diterima</td>
              <td>: {{ toi_jumlah_diterima }}</td>
            </tr>
            <tr>
              <td>Belum diterima</td>
              <td>: {{ toi_jumlah_belum_diterima }}</td>
            </tr>
            <tr>
              <td>Belum pemetaan</td>
              <td>: {{ toi_jumlah_belum_pemetaan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let isLoadingJumlahPeserta = ref(true)
let isLoadingJumlahDiterima = ref(true)
let isLoadingJumlahBelumDiterima = ref(true)
let isLoadingJumlahBelumPemetaan = ref(true)

let pplg_jumlah_peserta = ref(0)
let pplg_jumlah_diterima = ref(0)
let pplg_jumlah_belum_diterima = ref(0)
let pplg_jumlah_belum_pemetaan = ref(0)

let tkj_jumlah_peserta = ref(0)
let tkj_jumlah_diterima = ref(0)
let tkj_jumlah_belum_diterima = ref(0)
let tkj_jumlah_belum_pemetaan = ref(0)

let tsm_jumlah_peserta = ref(0)
let tsm_jumlah_diterima = ref(0)
let tsm_jumlah_belum_diterima = ref(0)
let tsm_jumlah_belum_pemetaan = ref(0)

let dkv_jumlah_peserta = ref(0)
let dkv_jumlah_diterima = ref(0)
let dkv_jumlah_belum_diterima = ref(0)
let dkv_jumlah_belum_pemetaan = ref(0)

let toi_jumlah_peserta = ref(0)
let toi_jumlah_diterima = ref(0)
let toi_jumlah_belum_diterima = ref(0)
let toi_jumlah_belum_pemetaan = ref(0)

async function getJumlahPeserta() {
  isLoadingJumlahPeserta.value = true
  let res_pplg = await client.collection('siswa').getFullList({
    filter: `program_keahlian="1oxybjgp1yzjsf2"`
  })
  let res_tkj = await client.collection('siswa').getFullList({
    filter: `program_keahlian="dn9c8m8i5ycdj6o"`
  })
  let res_tsm = await client.collection('siswa').getFullList({
    filter: `program_keahlian="gkxskc1e02ja0g1"`
  })
  let res_dkv = await client.collection('siswa').getFullList({
    filter: `program_keahlian="4co5ufcfj8299x1"`
  })
  let res_toi = await client.collection('siswa').getFullList({
    filter: `program_keahlian="dwj17n1t1apuovp"`
  })
  if(res_pplg && res_tkj && res_tsm && res_dkv && res_toi) {
    pplg_jumlah_peserta.value = res_pplg.length
    tkj_jumlah_peserta.value = res_tkj.length
    tsm_jumlah_peserta.value = res_tsm.length
    dkv_jumlah_peserta.value = res_dkv.length
    toi_jumlah_peserta.value = res_toi.length
    isLoadingJumlahPeserta.value = false
  }
}

async function getJumlahDiterima() {
  isLoadingJumlahDiterima.value = true
  let res_pplg = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="1oxybjgp1yzjsf2" && status_acc_pkl=true`
  })
  let res_tkj = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="dn9c8m8i5ycdj6o" && status_acc_pkl=true`
  })
  let res_tsm = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="gkxskc1e02ja0g1" && status_acc_pkl=true`
  })
  let res_dkv = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="4co5ufcfj8299x1" && status_acc_pkl=true`
  })
  let res_toi = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="dwj17n1t1apuovp" && status_acc_pkl=true`
  })
  if(res_pplg && res_tkj && res_tsm && res_dkv && res_toi) {
    pplg_jumlah_diterima.value = res_pplg.length
    tkj_jumlah_diterima.value = res_tkj.length
    tsm_jumlah_diterima.value = res_tsm.length
    dkv_jumlah_diterima.value = res_dkv.length
    toi_jumlah_diterima.value = res_toi.length
    isLoadingJumlahDiterima.value = false
  }
}

async function getJumlahBelumDiterima() {
  isLoadingJumlahBelumDiterima.value = true
  let res_pplg = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="1oxybjgp1yzjsf2" && status_acc_pkl=false`
  })
  let res_tkj = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="dn9c8m8i5ycdj6o" && status_acc_pkl=false`
  })
  let res_tsm = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="gkxskc1e02ja0g1" && status_acc_pkl=false`
  })
  let res_dkv = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="4co5ufcfj8299x1" && status_acc_pkl=false`
  })
  let res_toi = await client.collection('pemetaan').getFullList({
    filter: `program_keahlian="dwj17n1t1apuovp" && status_acc_pkl=false`
  })
  if(res_pplg && res_tkj && res_tsm && res_dkv && res_toi) {
    pplg_jumlah_belum_diterima.value = res_pplg.length
    tkj_jumlah_belum_diterima.value = res_tkj.length
    tsm_jumlah_belum_diterima.value = res_tsm.length
    dkv_jumlah_belum_diterima.value = res_dkv.length
    toi_jumlah_belum_diterima.value = res_toi.length
    isLoadingJumlahBelumDiterima.value = false
  }
}

async function getJumlahBelumPemetaan() {
  isLoadingJumlahBelumPemetaan.value = true
  let res_pplg = await client.collection('siswa').getFullList({
    filter: `program_keahlian="1oxybjgp1yzjsf2" && status_pemetaan_pkl=false`
  })
  let res_tkj = await client.collection('siswa').getFullList({
    filter: `program_keahlian="dn9c8m8i5ycdj6o" && status_pemetaan_pkl=false`
  })
  let res_tsm = await client.collection('siswa').getFullList({
    filter: `program_keahlian="gkxskc1e02ja0g1" && status_pemetaan_pkl=false`
  })
  let res_dkv = await client.collection('siswa').getFullList({
    filter: `program_keahlian="4co5ufcfj8299x1" && status_pemetaan_pkl=false`
  })
  let res_toi = await client.collection('siswa').getFullList({
    filter: `program_keahlian="dwj17n1t1apuovp" && status_pemetaan_pkl=false`
  })
  if(res_pplg && res_tkj && res_tsm && res_dkv && res_toi) {
    pplg_jumlah_belum_pemetaan.value = res_pplg.length
    tkj_jumlah_belum_pemetaan.value = res_tkj.length
    tsm_jumlah_belum_pemetaan.value = res_tsm.length
    dkv_jumlah_belum_pemetaan.value = res_dkv.length
    tsm_jumlah_belum_pemetaan.value = res_toi.length
    isLoadingJumlahBelumPemetaan.value = false
  }
}

onMounted(() => {
  getJumlahPeserta()
  getJumlahDiterima()
  getJumlahBelumDiterima()
  getJumlahBelumPemetaan()
})

</script>
