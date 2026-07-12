<template>
  <div class="col-md-6">
    <div v-if="isLoading">
      <loading-placeholder row="1" col="12" />
    </div>
    <div v-else-if="students && students.totalItems > 0">
      <div class="mb-2">
        <h5 class="fw-bold">Peserta belum terpetakan</h5>
        <div class="small text-muted">{{ students.totalItems }} peserta</div>
      </div>
      <table class="table table-striped border border-3 border-dark small">
        <tbody>
          <tr v-for="(s,i) in students.items" :key="s.id" class="fw-bold">
            <td>
              {{ s.nama }} <br>
              <span class="smallest text-muted">{{ s.kelas }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isMovingPage" class="text-muted small mb-2 fst-italic">sedang berpindah halaman</div>
      <div v-else>
        <div v-if="students || isMovingPage" class="text-muted small mb-2">
          <span v-if="students.totalItems">Halaman {{ students.page }} dari {{ students.totalPages }}</span>
        </div>
      </div>
      <button :disabled="isMovingPage || students.page < 2" @click="pagination(students.page - 1, false)" class="btn btn-dark me-2 border border-2 border-dark">
        <i class="bi bi-arrow-left"></i> sebelumnya
      </button>
      <button :disabled="isMovingPage || students.page >= students.totalPages" @click="pagination(students.page + 1, false)" class="btn btn-outline-dark border border-2 border-dark">
        selanjutnya <i class="bi bi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let prokel = user?.user.value.program_keahlian
let students = ref([])
let isLoading = ref(false)
let isMovingPage = ref(false)
let totalPerPage = 10

async function getPesertaBelumTerpetakanByProkel() {
  isLoading.value = true
  let res_student = await client.collection('siswa').getList(1, totalPerPage, {
    filter: "program_keahlian='"+prokel+"' && status_pemetaan_pkl=false",
    sort: "kelas, nama"
  })
  if(res_student) {
    students.value = res_student
    isLoading.value = false
  }
}

async function pagination(page) {
  isMovingPage.value = true
  let res_student = await client.collection('siswa').getList(page, totalPerPage, {
    filter: "program_keahlian='"+prokel+"' && status_pemetaan_pkl=false",
    sort: "kelas, nama"
  })
  if(res_student) {
    students.value = res_student
    isMovingPage.value = false
  }
}

onMounted(() => getPesertaBelumTerpetakanByProkel())
</script>
