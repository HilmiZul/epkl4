<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 romana text-grey"><i class="bi bi-bar-chart-fill"></i> Analitik Kesesuaian DU/DI</span>
    </div>
    <div class="card-body">
      <li>Data statistik DU/DI per Program Keahlian</li>
      <li>Data statistik Rankink</li>
      <li>Prosentase Kesesuaian dari jumlah DU/DI per Program Keahlian</li>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
