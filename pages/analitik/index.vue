<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand text-grey"><i class="bi bi-bar-chart-fill"></i> Analitik Kesesuaian IDUKA</span>
    </div>
    <div class="card-body small">
      <li>Data statistik IDUKA per Program Keahlian</li>
      <li>Data statistik Ranking</li>
      <li>Prosentase Kesesuaian dari jumlah IDUKA per Program Keahlian</li>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Analitik — e-PKL / SMKN 4 Tasikmalaya." })
</script>
