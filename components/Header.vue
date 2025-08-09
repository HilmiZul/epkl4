<template>
  <div :class="classNameRow">
    <div :class="classNameCol">
      <div class="card my-3 border border-2 border-dark bg-success">
        <div class="fs-1 text-center lexend-mega">
          <span class="">e-PKL.</span>
        </div>
      </div>
      <!-- <div class="mb-4 romana text-muted">Pemetaan siswa Praktik Kerja Lapangan (PKL)</div> -->
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let classNameRow = ref('row')
let classNameCol = ref('col-lg-4')

if(user.user.value == null) {
  classNameRow.value = "row justify-content-center mt-4"
  classNameCol.value = "col-lg-4"
} else {
  classNameRow.value = "row mt-4"
  classNameCol.value = "col-lg-3"
}
</script>

<style scoped>
.card {
  background-color: transparent;
}
</style>
