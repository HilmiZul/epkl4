<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 quicksand fw-bold"><i class="bi bi-patch-check"></i> Leger</span>
    </div>

    <div v-if="role == 'wakasek'" class="card-body">
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-info small px-4">
            <li>Pilih kelas untuk menampilkan pratinjau nilai</li>
            <li>Daftar yang muncul hanya yang sudah divalidasi oleh Guru pembimbing</li>
            <li>Leger dapat diunduh per kelas apabila Guru pembimbing selesai memvalidasi</li>
          </div>
        </div>
        <div class="col-md-2">
          <select @change="getNilaiFilterByClass" v-model="opsiKelas" name="opsiKelas" class="form form-select">
            <option value="">Kelas</option>
            <option v-for="(k,i) in kelas" :key="i" :value="k">{{ k }}</option>
          </select>
        </div>

        <div v-if="listLeger.length > 0 && countSiswaOnRombel == 32" class="col-md-3">
          <button @click="unduhLeger()" class="btn btn-success border border-2 border-dark">
            <i class="bi bi-download"></i> Unduh
          </button>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-12">
          <div class="mb-2 small">Total {{ listLeger.length }} dari {{ countSiswaOnRombel }}</div>

          <div v-if="isLoading">
            <LoadingPlaceholder row="1" col="12" />
            <LoadingPlaceholder row="1" col="12" />
            <LoadingPlaceholder row="1" col="12" />
            <LoadingPlaceholder row="1" col="12" />
            <LoadingPlaceholder row="1" col="12" />
          </div>
          <div v-else-if="!isLoading && listLeger.length < 1" class="text-center text-muted my-3">
            <div class="fs-1"><i class="bi bi-database-fill"></i></div>
            <div class="fs-4">Belum tersedia</div>
          </div>
          <div v-else class="table-responseive smallest">
            <table class="table">
              <thead>
                <tr>
                  <th width="3%">#</th>
                  <th width="7%">NIS</th>
                  <th>NAMA</th>
                  <th>KELAS</th>
                  <th width="10%">NILAI 1</th>
                  <th width="10%">NILAI 2</th>
                  <th width="10%">NILAI 3</th>
                  <th width="10%">NILAI 4</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="!isLoading && listLeger.length < 1">
                  <td colspan="7" class="text-center text-muted">
                    <div class="fs-1"><i class="bi bi-database-fill"></i></div>
                    <div class="fs-4">Belum tersedia</div>
                  </td>
                </tr>

                <tr v-else v-for="(list,i) in listLeger" :key="list.id">
                  <td>{{ i+1 }}</td>
                  <td>{{ list?.expand.siswa.nis }}</td>
                  <td>{{ list?.expand.siswa.nama }}</td>
                  <td>{{ list?.expand.siswa.kelas }}</td>
                  <td>{{ list.nilai_elemen1 }}</td>
                  <td>{{ list.nilai_elemen2 }}</td>
                  <td>{{ list.nilai_elemen3 }}</td>
                  <td>{{ list.nilai_elemen4 }}</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>

    <div v-else-if="role == 'jurusan' || role == 'guru'" class="card-body">
      <div v-if="nilaiNotValid?.length > 0" class="alert alert-warning fs-6">
        Ada <span class="fw-bold">{{ nilaiNotValid.length }}</span> Nilai yang belum divalidasi
      </div>

      <div class="row">
        <div class="col-lg-6">
          <form @submit.prevent="getNilai">
            <div class="my-3 mt-0 input-group">
              <input v-model="keyword" type="search" class="form form-control form-control-lg" placeholder="🔎 Cari nama peserta" />
              <button class="btn btn-info ms-2 border border-2 border-dark">Cari</button>
            </div>
          </form>
        </div>
        <div class="col-lg-6 align-content-center text-end">
          <LoadingPlaceholder v-if="isLoading" col="12" row="1" />
          <div v-if="nilai" class="mb-3 text-dark badge me-2">{{ nilai.length }} peserta</div>
          <div v-if="count_entrust" class="mb-3 text-white badge bg-dark">{{ count_entrust.length }} menitip sertifikat</div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div v-if="isLoading">
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
            <loading-placeholder row="1" col="12" />
          </div>
          <div v-else-if="nilai?.length < 1" class="text-center text-muted my-3">
            <span v-if="searchActived">
              <div class="fs-1"><i class="bi bi-search"></i></div>
              <div class="fs-4">Pencarian tidak ditemukan</div>
            </span>
            <span v-else>
              <div class="fs-1"><i class="bi bi-database-fill"></i></div>
              <div class="fs-4">Belum tersedia</div>
              <div class="pb-3">Nilai akan tampil apabila masa PKL selesai & peserta menyerehkan nilai.</div>
            </span>
          </div>
          <ul v-else v-for="(n, i) in nilai" :key="i" class="list-group list-group-flush">
            <nuxt-link :to="`/leger/${n.id}`" class="fw-bold">
              <li class="list-group-item py-3 border-bottom border-2 border-grey">
                {{ n.expand.siswa.nama }} <br>
                <div class="text-muted mt-2">{{ n.expand.siswa.kelas }}</div>
                <div v-if="n.isEntrust" class="text-muted mt-1">
                  <i class="bi bi-person-vcard-fill"></i> Titip Sertifikat
                </div>
                <div class="text-muted mt-1">
                  <span v-if="n.isValid"><i class="bi bi-check-circle-fill"></i> Valid</span>
                  <span v-else class="text-danger"><i class="bi bi-dash-circle-fill"></i> Belum divalidasi</span>
                </div>
              <!-- <nuxt-link v-if="!n.isValid" :to="`/leger/${n.id}`" class="mt-2 btn btn-danger btn-sm border border-2 border-dark">Validasi sekarang <i class="bi bi-arrow-right"></i></nuxt-link> -->
              </li>
            </nuxt-link>
          </ul>

          <!-- <div class="table-responsive">
            <table class="table">
              <tbody>
                <tr >
                  <td colspan="5">

                  </td>
                </tr>
                <tr >
                  <td colspan="5" class="text-center text-muted">

                  </td>
                </tr>
                <tr  class="border-bottom border-2 border-dark">
                  <td width="3%">
                    <span v-if="n.isValid" class="badge text-dark">{{ i+1 }}</span>
                    <nuxt-link v-else :to="`/leger/${n.id}`"><span class="badge bg-danger">{{ i+1 }}</span></nuxt-link>
                  </td>
                  <td>
                    <nuxt-link :to="`/leger/${n.id}`" class="link fw-bold">{{ n.expand.siswa.nama }}</nuxt-link> <br>
                    <div class="text-muted fw-bold small mt-2">{{ n.expand.siswa.kelas }}</div>
                    <div v-if="n.isEntrust" class="text-muted small">
                      <i class="bi bi-person-vcard-fill"></i> Titip Sertifikat
                    </div>
                    <div class="text-muted small">
                      <span v-if="n.isValid"><i class="bi bi-check-circle-fill"></i> Valid</span>
                      <span v-else class="text-danger"><i class="bi bi-dash-circle-fill"></i> Belum divalidasi</span>
                    </div>
                    <nuxt-link v-if="n.isValid" :to="`/leger/${n.id}`" class="mt-2 btn btn-info btn-sm border border-2 border-dark">Lihat <i class="bi bi-arrow-right"></i></nuxt-link>
                    <nuxt-link v-else :to="`/leger/${n.id}`" class="mt-2 btn btn-danger btn-sm border border-2 border-dark">Validasi sekarang <i class="bi bi-arrow-right"></i></nuxt-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { utils, writeFileXLSX } from 'xlsx'

definePageMeta({ middleware: 'auth' })
useHead({ title: "Leger Nilai — e-PKL / SMKN 4 Tasikmalaya." })
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let user_id = user?.user.value.id
let role = user?.user.value.role
let prokel = user?.user.value.program_keahlian
let nilai = ref()
let isLoaded = ref(false)
let isLoading = ref(true)
let keyword = ref('')
let nilaiNotValid = ref('')
let count_entrust = ref('')
let searchActived = ref(false)
if(role == 'tu') navigateTo('/404')
let kelas = ref([
  'TSM-1',
  'TSM-2',
  'TSM-3',
  'TSM-4',
  'TJKT-1',
  'TJKT-2',
  'TJKT-3',
  'TJKT-4',
  'PPLG-1',
  'PPLG-2',
  'PPLG-3',
  'PPLG-4',
  'DKV-1',
  'DKV-2',
  'TOI',
])
let opsiKelas = ref('')
let listLeger = ref([])
let countSiswaOnRombel = ref(0)

async function getNilai(loading=true) {
  isLoading.value = loading
  let filter = ''
  if(keyword.value) {
    searchActived.value = true
    filter = ` && siswa.nama~"${keyword.value}"`
  } else {
    searchActived.value = false
  }
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user_id}" ${filter}`,
    expand: "siswa, iduka, program_keahlian",
    sort: "isValid, siswa",
  })
  if(res) {
    nilai.value = res
    isLoading.value = false
  }
}

async function getNilaiByNotVerify() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user_id}" && isValid=false`
  })
  if(res) {
    nilaiNotValid.value = res
    isLoading.value = false
  }
}

async function getEntrust() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('nilai').getFullList({
    filter: `iduka.pembimbing_sekolah="${user_id}" && isEntrust=true`,
  })
  if(res) {
    count_entrust.value = res
    isLoading.value = false
  }
}

async function getNilaiFilterByClass() {
  isLoading.value = true

  let res_nilai = await client.collection('nilai').getFullList({
    filter: `siswa.kelas="${opsiKelas.value}" && isValid=true`,
    expand: `iduka.pembimbing_sekolah, siswa, program_keahlian`,
    sort: `program_keahlian, siswa.kelas, siswa.nama`
  })

  let res_rombel = await client.collection('siswa').getList(1,1, {
    filter: `kelas="${opsiKelas.value}"`
  })

  if(res_rombel) {
    countSiswaOnRombel.value = res_rombel.totalItems
    if(res_nilai) {
      listLeger.value = res_nilai
      isLoading.value = false
    }
  }
}

function unduhLeger() {
  const raw_data = listLeger.value

  // flatten objects
  const rows = raw_data.map((row,i) => ({
    no: i+1,
    nis: row.expand.siswa.nis,
    nisn: row.expand.siswa.nisn,
    nama: row.expand.siswa.nama,
    kelas: `XII.${row.expand.siswa.kelas}`,
    iduka: row.expand.iduka.nama,
    instruktur: row.expand.iduka.pembimbing_iduka,
    guru_pembimbing: row.expand.iduka.expand.pembimbing_sekolah.nama,
    nilai_elemen1: row.nilai_elemen1,
    nilai_elemen2: row.nilai_elemen2,
    nilai_elemen3: row.nilai_elemen3,
    nilai_elemen4: row.nilai_elemen4,
    sakit: row.sakit,
    izin: row.izin,
    absen: row.tanpa_keterangan,
  }));

  // generate worksheet & workbook
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, worksheet, `XII.${opsiKelas.value}`);

  // fix headers
  utils.sheet_add_aoa(worksheet, [["NO", "NIS", "NISN", "NAMA", "KELAS", 
                                    "IDUKA", "INSTRUKTUR", "GURU PEMBIMBING", "NILAI 1", "NILAI 2", "NILAI 3", "NILAI 4",
                                    "SAKIT", "IZIN", "ABSEN"]], { origin: "A1" });
  
  // buat file dan download dengan ext .xlsx
  writeFileXLSX(workbook, `Leger Rapor PKL - XII.${opsiKelas.value}.xlsx`, { compression: true });
}

onMounted(() => {
  getNilai()
  getEntrust()
  getNilaiByNotVerify()
  client.autoCancellation(false)
  client.collection('nilai').subscribe('*', function(e) {
    // param default getNilai: loading=true
    if(e.action == 'create' || e.action == 'update') getNilai(false)
  },{})
})
</script>
