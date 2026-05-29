<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand text-grey"><i class="bi bi-bar-chart-fill"></i> Analitik Kesesuaian IDUKA</span>
    </div>
    <div class="card-body small">
      <!-- <li>Data statistik IDUKA per Program Keahlian</li> -->
      <!-- <li>Data statistik Ranking</li> -->
      <!-- <li>Prosentase Kesesuaian dari jumlah IDUKA per Program Keahlian</li> -->

      <p class="fw-bold">Ranking IDUKA diambil berdasarkan Jurnal yang dibuat Peserta dan sesuai dengan elemen/tujuan pembelajaran.</p>
      <div class="row">
        <div class="col-md-4">
          <div class="card bg-success mb-3">
            <div class="card-body">
              <h3 class="fw-bold">{{ countAllJournal }}</h3>
              <div class="fs-5">Jurnal</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="card bg-info mb-3">
                <div class="card-body">
                  <h3 class="fw-bold">{{ countMatchJournal }}</h3>
                  <div class="fw-bold">Jurnal sesuai</div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card bg-danger mb-3">
                <div class="card-body">
                  <h3 class="fw-bold">{{ countNotMatchJournal }}</h3>
                  <div class="fw-bold">Jurnal tidak sesuai</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="col-md-8">
          <div class="fs-5">Ranking IDUKA</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: "Analitik — e-PKL / SMKN 4 Tasikmalaya." })

const user = usePocketBaseUser()
const client = usePocketBaseClient()
const role = user?.user.value.role
const prokel = user?.user.value.program_keahlian
const isLoading = ref(true)
const countAllJournal = ref(0)
const countMatchJournal = ref(0)
const countNotMatchJournal = ref(0)

if(role != 'admin' && role != 'jurusan') navigateTo('/404')

async function getCountJournalByProkel(matchFilter) {
  isLoading.value = true
  let currFilter = `program_keahlian="${prokel}"`

  // matchFilter hanya menangkap 3 nilai:
  // match = sesuai
  // not match = tidak sesuai
  // all = semua
  if(matchFilter == "match") {
    currFilter = `program_keahlian="${prokel}" && elemen.cp!="Lain-lain"`
  } else if(matchFilter == "not match"){
    currFilter = `program_keahlian="${prokel}" && elemen.cp="Lain-lain"`
  }

  let res = await client.collection('jurnal').getList(1, 1, {
    filter: currFilter
  })

  if(res && matchFilter == "match") {
    countMatchJournal.value = res.totalItems
    isLoading.value = false
  } else if(res && matchFilter == "not match") {
    countNotMatchJournal.value = res.totalItems
    isLoading.value = false
  } else if(res && matchFilter == "all") {
    countAllJournal.value = res.totalItems
    isLoading.value = false
  }
}

onMounted(() => {
  getCountJournalByProkel("all")
  getCountJournalByProkel("match")
  getCountJournalByProkel("not match")
})
</script>
