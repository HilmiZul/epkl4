<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 romana text-grey"><i class="bi bi-patch-check-fill"></i> Verifikasi</span>
    </div>
    <div class="card-body small">
      <li>Buat jadwal</li>
      <li>Rilis jadwal</li>
      <li>Penilaian sesuai format sertifikat, dan</li>
      <li>link Karya (PPLG)?</li>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
