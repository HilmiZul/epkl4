<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-diagram-3-fill"></i> Pemetaan Pembimbing</span>
      <div v-if="isPembimbingAvailable.length > 0" class="float-end">
        <nuxt-link v-if="role == 'admin' || role == 'jurusan'" to="/pemetaan/pembimbing/tambah" class="btn btn-info btn-sm border border-2 border-dark"><i class="bi bi-plus-lg"></i> Tambah</nuxt-link>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <div class="my-3 mt-0">
            <input @input="searchByKeyword" v-model="keyword" type="search" class="form form-control form-control-lg" placeholder="🔎 Cari nama pembimbing">
          </div>
        </div>
        <div class="col align-content-center">
          <div class="mb-3 text-grey float-end badge text-dark">{{ mapping.length }} pemetaan</div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-borderless table-striped table-hover">
              <thead>
                <tr>
                  <th width="2%">#</th>
                  <th>Pembimbing</th>
                  <th>Peserta Didik</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading" class="text-center my-5">
                  <td colspan="3"><Loading /></td>
                </tr>
                <tr v-else-if="mapping.length < 1" class="text-center">
                  <td colspan="3">Data tidak ditemukan</td>
                </tr>
                <tr v-for="(pemetaan, i) in mapping" :key="pemetaan.id">
                  <td><span class="badge text-dark">{{ i+1 }}</span></td>
                  <td>
                    <nuxt-link :to="`/pemetaan/pembimbing/${pemetaan.id}`" class="link fw-bold">{{ pemetaan.expand.pembimbing.nama }}</nuxt-link>
                    <p v-if="pemetaan.siswa.length > 0" class="my-2 small text-muted">{{ pemetaan.siswa.length }} peserta</p>
                  </td>
                  <td>
                    <table class="table">
                      <tbody>
                        <tr v-if="pemetaan.siswa.length < 1">
                          <td class="text-danger">Belum dipasangkan dengan peserta didik</td>
                        </tr>
                        <tr v-for="(student,i) in pemetaan.expand.siswa" :key="student.id">
                          <td width="2%"><span class="badge text-dark">{{ i+1 }}</span></td>
                          <td>
                            <div class="fw-bold">{{ student.nama }}</div>
                            <div class="text-muted fw-bold small">{{ student.kelas }}</div>
                          </td>
                          <td width="17%"><button class="btn btn-danger border border-2 border-dark" data-bs-toggle="modal" :data-bs-target="`#student-${student.id}`">hapus</button></td>
                          <!-- modal confirm: apakah ingin mengapus siswa terpilih dari pemetaan guru ini? -->
                          <div class="modal" :id="`student-${student.id}`" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
                                <div class="modal-header rounded-0 h4 bg-danger quicksand">
                                  Hapus dari Pembimbing
                                </div>
                                <div class="modal-body text-dark">
                                  Hapus <span class="fw-bold">{{ student.nama }}</span> dari daftar bimbingan <span class="fw-bold">{{ pemetaan.expand.pembimbing.nama }}</span>?
                                </div>
                                <div class="modal-footer">
                                  <button @click="hapusPesertaDariBimbingan(pemetaan.id, student.id)" class="btn btn-danger border border-2 border-dark" data-bs-dismiss="modal">Hapus</button>
                                  <button class="btn btn-light border border-2 border-dark" data-bs-dismiss="modal">Gajadi</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Pemetaan Pembimbing — e-PKL / SMKN 4 Tasikmalaya."})
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let role = user.user.value.role
let prokel = user.user.value.program_keahlian
let mapping = ref([])
let isLoading = ref(true)
let keyword = ref('')
let isPembimbingAvailable = ref([])
let curr_students = ref([])

async function hapusPesertaDariBimbingan(id_pemetaan, id_siswa) {
  client.autoCancellation(false)
  let res = await client.collection('siswa').update(id_siswa, { status_pemetaan_pembimbing: false})
  let res_siswa = await client.collection('pemetaan_pembimbing').getOne(id_pemetaan, {
    expand: "siswa"
  })
  // console.log(res_siswa)
  if(res_siswa.siswa.length == 1) {
    await client.collection('pemetaan_pembimbing').update(id_pemetaan, { siswa: [] })
  }
  let tempSiswaKetemu = []
  for(let i=0; i<res_siswa.siswa.length; i++) {
    if(res_siswa.siswa[i] != id_siswa) {
      tempSiswaKetemu.push(res_siswa.siswa[i])
      await client.collection('pemetaan_pembimbing').update(id_pemetaan, { siswa:tempSiswaKetemu })
    }
  }
  // console.log(tempSiswaKetemu)
  if(res) {
    isLoading.value = false
  }
}

async function getPemetaanPembimbing() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_pemetaan = await client.collection("pemetaan_pembimbing").getFullList({
    filter: "program_keahlian='"+prokel+"'",
    expand: "pembimbing, siswa, progarm_keahlian",
    sort: "pembimbing.nama"
  })
  // memeriksa apakah Prokel tersebut memiliki Pembimbing? (kecuali admin)
  // kalo belum, proses pemetaan pembimbing ga diizinin haha
  // bagian hanya dilakukan saat halaman ini dibuka
  let res_pembimbing = await client.collection('teacher_users').getFullList({
    filter: "program_keahlian='"+prokel+"' && role!='admin'"
  })
  if(res_pemetaan && res_pembimbing) {
    isLoading.value = false
    mapping.value = res_pemetaan
    isPembimbingAvailable.value = res_pembimbing
    for(let i=0; i<res_pemetaan.length; i++) {
      curr_students.value.push(res_pemetaan[i].expand.siswa)
    }
  }
}

async function searchByKeyword() {
  isLoading.value = true
  client.autoCancellation(false)
  if(keyword.value.length > 0) {
    let data = await client.collection('pemetaan_pembimbing').getFullList({
      filter: "program_keahlian='"+prokel+"' && pembimbing.nama~'"+keyword.value+"'",
      expand: "pembimbing, siswa, program_keahlian",
      sort: "pembimbing.nama"
    })
    if(data) {
      isLoading.value = false
      mapping.value = data
    }
  } else {
    getPemetaanPembimbing()
  }
}

const mappingFiltered = computed(() => {
  return mapping.value.filter((i) => {
    return (
      i.expand.pembimbing.nama.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.expand.siswa.nama.toLowerCase().includes(keyword.value.toLowerCase())
    )
  })
})

onMounted(() => {
  getPemetaanPembimbing()
  client.autoCancellation(false)
  client.collection('pemetaan_pembimbing').subscribe('*', function(e) {
    if(e.action == 'update') getPemetaanPembimbing()
  },{ })
})
</script>
