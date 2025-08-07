<template>
  <div>
    <div class="card">
      <div class="card-header">
        <span class="h4 romana text-grey"><i class="bi bi-pie-chart-fill"></i> Statistik</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-5">
            <chart-statistik-pemetaan />
          </div>
          <DetailStatistik v-if="role === 'admin'" />
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
