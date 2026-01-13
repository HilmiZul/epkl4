<template>
  <!-- <page size="A4">
    <div v-if="!isLoading">
      <h3>{{ pemetaan[0].expand.iduka.nama }}</h3>
      <h3>{{ pemetaan[0].expand.iduka.alamat }}</h3>
      <ul v-for="p in pemetaan" :key="p.id">
        <li>{{ p.expand.siswa.nama }}</li>
      </ul>
      {{ tanggal }}
    </div>
  </page>
  <page size="A4">
    <div v-if="!isLoading">
      Lembar penerimaan
    </div>
  </page> -->
  <loading-placeholder v-if="isLoading" col="12" row="10" />
  <div v-else class="base F4">
    <section class="kertas">
      <article>
        <table class="header">
          <tbody>
            <tr>
              <td><img :src="`${host}/api/files/${pengaturan.collectionId}/${pengaturan.id}/${pengaturan.logo}`" :alt="pengaturan.logo" class="logo" /></td>
              <td width="100%" class="text-center">
                <div class="fs-14">PEMERINTAH DAERAH PROVINSI JAWA BARAT</div>
                <div class="fs-16">DINAS PENDIDIKAN</div>
                <div class="fs-14">CABANG DINAS PENDIDIKAN WILAYAH XII</div>
                <div class="fs-16 bold">{{ pengaturan.nama_sekolah }}</div>
                <address class="smallest">
                  Jln. Depok Kelurahan Sukamenak Kec. Purbaratu(0265) 312059 <br>
                  Website : www.smkn4-tsm.sch.id. Email : info@smkn4-tsm.sch.id <br>
                  Kota Tasikmalaya - 46196 <br>
                </address>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="garis mt-2"></div>

        <div class="mt-3 text-center fw-bold">BERITA ACARA PENYERAHAN SISWA PESERTA PKL</div>
        <div class="text-center fw-bold">SMK NEGERI 4 TASIKMALAYA</div>
        <div class="mb-3 text-center fw-bold">TAHUN PELAJARAN {{ tahun-1 }}/{{ tahun }}</div>

        <p>
          Pada hari ……………..…Tanggal ……… Bulan  Januari tahun Dua Ribu Dua Puluh Enam. <br>
          Telah menyerahkan  peserta Praktik Kerja Lapangan (PKL) atas nama: 
        </p>

        <table width="100%" class="mt-3 smallest siswa">
          <tbody>
            <tr class="text-center">
              <td>No.</td>
              <td width="12%">NIS</td>
              <td>Nama Siswa</td>
              <td>Kelas</td>
            </tr>
            <tr v-for="(p,i) in pemetaan" :key="p.id">
              <td class="text-center">{{ i+1 }}.</td>
              <td class="text-center">{{ p.expand.siswa.nis }}</td>
              <td>{{ p.expand.siswa.nama.charAt(0).toUpperCase() + p.expand.siswa.nama.slice(1).toLowerCase() }}</td>
              <td>XII.{{ p.expand.siswa.kelas }}</td>
            </tr>
          </tbody>
        </table>
        <p class="fst-italic">*)Coret yang tidak perlu</p> 

        <p class="mt-3">
          Kepada IDUKA/Instansi/Bengkel <span class="fw-bold">{{ pemetaan[0].expand.iduka.nama }}</span> untuk melaksanakan kegiatan Praktik Kerja Lapangan (PKL) mulai tanggal
          {{ pengaturan.rentang_pelaksanaan }}.
        </p>

        <p class="mt-3">
          Demikian Berita Acara Serah Terima ini dibuat untuk diketahui oleh semua pihak.
        </p>

        <div class="row mt-5">
          <div class="col-md-4">
            Yang menerima, <br>
            Pimpinan/Pembimbing Perusahaan/Bengkel
            <br> <br>

            <div class="mt-5">
              ….................................................. <br>
              NIP./NIK:
            </div>
          </div>
          <div class="col-md-4">
          </div>
          <div class="col-md-4">
            Yang menyerahkan, <br>
            Pembimbing SMKN 4 Tasikmalaya
            <br> <br>

            <div class="mt-5">
              ….................................................. <br>
              NIP./NIK:
            </div>
          </div>
        </div>

      </article>
    </section>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'print',
  middleware: 'auth'
})
let route = useRoute()
useHead({ title: `Cetak Berita Acara — PKL`})
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let user = usePocketBaseUser()
let role = user.user.value.role
if(role != 'tu') navigateTo('/404')
let client = usePocketBaseClient()
let isLoading = ref(true)
let pemetaan = ref([])
let pengaturan = ref([])
let date_now = new Date()
let tahun = date_now.getFullYear()
const date_options = {
  dateStyle: "long",
};

async function getPengaturanAndPemetaanById() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_pengaturan = await client.collection('pengaturan').getOne('pt7b25ofddwhngp')
  let res_pemetaan = await client.collection('pemetaan').getFullList({
    expand: "iduka, siswa, program_keahlian",
    filter: "iduka='"+route.params.id+"'"
  })
  if(res_pengaturan && res_pemetaan) {
    pengaturan.value = res_pengaturan
    pemetaan.value = res_pemetaan
    isLoading.value = false
  }
  return isLoading.value
}

onMounted(() => {
  getPengaturanAndPemetaanById()
  // if(getPengaturanAndPemetaanById()) {
  //   setTimeout(function () { window.print(); }, 700);
  //   window.onfocus=function() {
  //     setTimeout(function () { window.close(); }, 100);
  //   }
  // }
})

</script>
