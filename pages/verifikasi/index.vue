<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 romana text-grey"><i class="bi bi-patch-check-fill"></i> Verifikasi</span>
    </div>
    <div class="card-body">
      <li>Jadwal</li>
      <li>Penilaian dan</li>
      <li>Karya?</li>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
