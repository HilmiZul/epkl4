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
let count_sesuai = 0
let count_tidak_sesuai = 0

async function countTerserapSemuaPeserta() {
  try {
    isLoading.value = true
    if(props) {
      isLoading.value = false
      count_sesuai = props.countSesuai
      count_tidak_sesuai = props.countTidakSesuai
      // console.log(count_sesuai)
      // console.log(count_tidak_sesuai)
    }
    return [count_sesuai, count_tidak_sesuai]
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
      'Tidak Sesuai Elemen',
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
          chartData[0],
          chartData[1],
        ],
      }]
    };

    const config = {
      type: 'bar',
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

