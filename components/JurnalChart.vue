<template>
  <div class="col-md-12 mb-5">
    <canvas id="myChart"></canvas>
  </div>
</template>

<script setup>
import Chart from 'chart.js/auto'

let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let count_terserap_semua = []
let count_terpetakan_semua = []
let count_belum_terpetakan = []
let count_belum_terserap = []

async function countTerserapSemuaPeserta() {
  try {
    isLoading.value = true
    let resTerserap = await client.collection('pemetaan').getFullList({ filter: "program_keahlian='"+prokel+"' && status_acc_pkl=true" })
    let resTerpetakan = await client.collection('pemetaan').getFullList({ filter: "program_keahlian='"+prokel+"'" })
    let resBelumTerpetakan = await client.collection('siswa').getFullList({ filter: "program_keahlian='"+prokel+"' && status_pemetaan_pkl=false" })
    let resBelumTerserap = await client.collection('pemetaan').getFullList({ filter: "program_keahlian='"+prokel+"' && status_acc_pkl=false" })
    if(resTerserap && resTerpetakan && resBelumTerpetakan && resBelumTerserap) {
      isLoading.value = false
      count_terserap_semua = resTerserap
      count_terpetakan_semua = resTerpetakan
      count_belum_terpetakan = resBelumTerpetakan
      count_belum_terserap = resBelumTerserap
    }
    return [count_terpetakan_semua, count_terserap_semua, count_belum_terserap, count_belum_terpetakan]
  } catch(error) {
    console.log('Gagal mengambil data: ', error)
    return null
  }
}

async function initChartData() {
  let chartData = await countTerserapSemuaPeserta()
  if(chartData) {
    const labels = [
      'Sesuai Elemen',
      'Belum Sesuai Elemen',
    ];

    const data = {
      labels: labels,
      datasets: [{
        label: "Jumlah",
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
        ],
        borderColor: 'rgb(0, 0, 0)',
        data: [
          chartData[0].length,
          chartData[1].length,
        ],
      }]
    };

    const config = {
      type: 'pie',
      data: data,
      options: {}
    }
    const canvas = document.getElementById('myChart')
    new Chart(canvas, config)
  }
}

const gambarChart = () => {
}

onMounted(() => {
  countTerserapSemuaPeserta()
  initChartData()
})
</script>

