<template>
  <!-- <div class="col-lg-12"> -->
    <!-- <div :class="classNameRow">
      <div :class="classNameCol"> -->
        <div class="card mb-5 border border-2 border-dark bg-success">
          <div class="fs-1 text-center lexend-mega py-1">
            <span class="text-shadow">e-PKL.</span>
          </div>
        </div>
        <!-- <div class="mb-4 public-sans text-muted">Pemetaan siswa Praktik Kerja Lapangan (PKL)</div> -->
      <!-- </div>
    </div> -->
  <!-- </div> -->
</template>

<script setup>
let user = usePocketBaseUser()
// let classNameRow = ref('row')
// let classNameCol = ref('col-lg-4')

// if(user.user.value == null) {
//   classNameRow.value = "row justify-content-center mt-4"
//   classNameCol.value = "col-lg-4"
// } else {
//   classNameRow.value = "mt-4"
//   classNameCol.value = "col-lg-12"
// }
</script>

<style scoped>
.card {
  background-color: transparent;
}
.text-shadow {
  text-shadow: 3px -2px #fff;
}
.card.mb-5 {
  margin-bottom: 2em !important;
}
</style>
