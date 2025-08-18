<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand"><i class="bi bi-patch-check"></i> Verifikasi</span>
    </div>
    <div class="card-body">
      <li>Buat jadwal</li>
      <li>Rilis jadwal</li>
      <li>Penilaian sesuai format sertifikat, dan</li>
      <li>link Karya (PPLG)?</li>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Verifikasi — e-PKL / SMKN 4 Tasikmalaya." })
</script>
