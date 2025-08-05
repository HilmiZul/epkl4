<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 romana text-grey"><i class="bi bi-diagram-3-fill"></i> Pemetaan</span>
    </div>
    <div class="card-body small">
      <ul>
        <li>card by card 4 col</li>
        <li>filter by wilayah</li>
        <li>serch by keyword "IDUKA"</li>
        <li>every item show:
          <ul>
            <li>nama IDUKA</li>
            <li>kuota terisi ... dari ... / penuh</li>
            <li>detil: daftar peserta didik</li>
            <li class="text-danger">print surat pengantar?</li>
            <li>foto ilustrasi?</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
