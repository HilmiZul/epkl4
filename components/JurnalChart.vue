<template>
  <div class="col-md-12 mb-5">
    <canvas id="myChart"></canvas>
  </div>
</template>

<script setup>
import Chart from 'chart.js/auto'
let props = defineProps(['countSesuai', 'countTidakSesuai'])
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let count_sesuai = ref(0)
let count_tidak_sesuai = ref(0)
let chartInstance = null
let sesuai = 0
let tidak_sesuai = 0

async function countJurnalSesuaiDanTidak(loading=true) {
  try {
    isLoading.value = loading
    if(props) {
      isLoading.value = false
      count_sesuai.value = props.countSesuai
      count_tidak_sesuai.value = props.countTidakSesuai
    }
    return [count_sesuai.value, count_tidak_sesuai.value]
  } catch(error) {
    console.log('Gagal mengambil data: ', error)
    return null
  }
}

async function initChartData() {
  let chartData = await countJurnalSesuaiDanTidak()
  if(chartData) {
    const labels = [
      'Sesuai Elemen',
      'Tidak Sesuai Elemen',
    ];

    const data = {
      labels: labels,
      datasets: [{
        label: "Jumlah Jurnal",
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
        ],
        borderColor: [
          'rgb(0, 0, 0)',
          'rgb(0, 0, 0)',
        ],
        borderWidth: 2,
        data: [
          chartData[0],
          chartData[1],
        ],
      }]
    };

    const config = {
      type: 'doughnut',
      data: data,
      options: {}
    }
    const canvas = document.getElementById('myChart')
    chartInstance = new Chart(canvas, config)
  }
}

// Pass fungsi initChartData 
// watch digunakan untuk memperbaharui chart berdasar filtering data dari parent pages/jurnal/index
// disini async gadibutuhin.
// ambil props, masukin ke newData, update data pada chartInstance
// terakhir update chart nya
watch(() => [props.countSesuai, props.countTidakSesuai], (newData) => {
  chartInstance.data.datasets[0].data = newData
  if(chartInstance) chartInstance.update()
})

onMounted(() => {
  countJurnalSesuaiDanTidak()
  initChartData()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e){
    if(e.action == 'create') countJurnalSesuaiDanTidak(false)
  })
})
</script>
