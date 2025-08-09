<template>
  <div>
    <div class="card">
      <div class="card-header">
        <span class="h4 public-sans text-grey"><i class="bi bi-pie-chart-fill"></i> Ringkasan</span>
      </div>
      <div class="card-body">
        <overview-card v-if="role === 'admin' || role === 'jurusan'" />
        <div class="row mt-4 justify-content-center">
          <chart-statistik-pemetaan />
          <DetailStatistik v-if="role === 'admin' || role === 'jurusan'" />
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
