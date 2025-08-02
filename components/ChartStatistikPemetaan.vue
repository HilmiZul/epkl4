<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script setup>
import Chart from 'chart.js/auto'
const labels = [
  'PPLG',
  'TJKT',
  'TSM',
  'DKV',
  'TOI'
];

const data = {
  labels: labels,
  datasets: [{
    label: 'Terserap',
    backgroundColor: [
      'rgb(10, 138, 102)',
      'rgb(54, 162, 235)',
      'rgb(255, 99, 132)',
      'rgb(255, 205, 86)',
      'rgb(127, 127, 127)'
    ],
    // borderColor: 'rgb(255, 99, 132)',
    data: [20, 10, 5, 2, 20],
  }]
};

const config = {
  type: 'doughnut',
  data: data,
  options: {}
}

onMounted(() => {
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  )
})
</script>

