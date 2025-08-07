<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 romana text-grey"><i class="bi bi-journals"></i> Jurnal Peserta</span>
    </div>
    <div class="card-body small">
      jurnal harian peserta:
      <ul>
        <li>timeline-like?</li>
        <li>filter by kelas</li>
        <li>search by keyword (what)...?</li>
        <li>2 columns:
          <ul>
            <li>right: ...?</li>
            <li>left: timeline</li>
          </ul>
        </li>
        <li>timeline show:
          <ul>
            <li>kegiatan</li>
            <li>deskripsi</li>
            <li>foto</li>
            <li>tanggal</li>
            <li>verifikasi(ttd)</li>
          </ul>
        </li>
        <li>create deskripsi based-on Elemen, tempat PKL dan foto (summaries by AI)?</li>
        <li>insert emoji into a journal post?</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal Peserta — e-PKL / SMKN 4 Tasikmalaya." })
</script>
