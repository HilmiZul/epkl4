<template>
  <div>
    <div class="card">
      <div class="card-header">
        <span class="h4 public-sans text-grey"><i class="bi bi-pie-chart-fill"></i> Ringkasan</span>
      </div>
      <div class="card-body">
        <div class="alert alert-warning shadow-lg">
          <span class="h4"><i class="bi bi-lightbulb"></i> FYI</span>
          <ul>
            <li>Terserap = Peserta yang sudah diterima IDUKA</li>
            <li>Terpetakan = Peserta yang baru ditempatkan saja</li>
            <li>Belum diterima = Peserta yang sudah dipetakan menunggu respon/balasan IDUKA</li>
          </ul>
        </div>
        <ringkasan-card v-if="role === 'admin' || role === 'jurusan'" />
        <div class="row mt-4 justify-content-center">
          <ringkasan-chart />
          <ringkasan-detail-statistik v-if="role === 'admin' || role === 'jurusan'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})
useHead({ title: "e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let role = user?.user.value.role

</script>
