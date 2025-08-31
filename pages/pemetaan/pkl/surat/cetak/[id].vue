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
        <table>
          <tr>
            <td><img :src="`${host}/api/files/${pengaturan.collectionId}/${pengaturan.id}/${pengaturan.logo}`" :alt="pengaturan.logo" class="logo" /></td>
            <td width="100%" class="text-center">
              <div>PEMERINTAH DAERAH PROVINSI JAWA BARAT</div>
              <div>DINAS PENDIDIKAN</div>
              <div>CABANG DINAS PENDIDIKAN WILAYAH XII</div>
              <h5 class="bold">{{ pengaturan.nama_sekolah }}</h5>
              <address class="small">Jln. Depok Kelurahan Sukamenak Kec. Purbaratu(0265) 312059</address>
              <div class="small">Website : www.smkn4-tsm.sch.id. Email : info@smkn4-tsm.sch.id</div>
              <div class="small">Kota Tasikmalaya - 46196</div>
            </td>
          </tr>
        </table>
        <div class="garis mt-2"></div>
        <table class="mt-3 small">
          <tr>
            <td>
              <table>
                <tr>
                  <td width="21%">Nomor</td>
                  <td>: {{ pengaturan.nomor_surat }}</td>
                </tr>
                <tr>
                  <td>Lampiran</td>
                  <td>: 1 (satu) lembar</td>
                </tr>
                <tr>
                  <td>Perihal</td>
                  <td>: Permohonan Bantuan Pelaksanaan <br> </td>
                </tr>
                <tr>
                  <td></td>
                  <td>&nbsp;&nbsp;Praktik Kerja Lapangan (PKL)</td>
                </tr>
              </table>
            </td>
            <td width="33%">
              <div>Tasikmalaya, {{ tanggal }}</div>
              <strong>Yth. Kepala/Pimpinan</strong>
              <div>{{ pemetaan[0].expand.iduka.nama }}</div>
              <div>di</div>
              <div>{{ pemetaan[0].expand.iduka.alamat }}</div>
            </td>
          </tr>
        </table>
        <p class="mt-2 justify">
          Dengar hormat,<br>
          Berdasarkan tujuan kurikulum Sekolah Menengah Kejuruan, diharapkan lembaga menyiapkan tamatan yang mampu:
        </p>
        <ol class="small">
          <li>Memasuki lapangan kerja serta dapat mengembangkan sikap professional sesuai dengan program keahlian</li>
          <li>Memiliki karir, berkompetensi dan mengembangkan diri</li>
          <li>Menjadi tenaga kerja tingkat menengah untuk mengisi kebutuhan dunia usaha dan industri pada saat ini maupun masa yang akan datang</li>
          <li>Menjadi warga negara yang produktif, adaftif dan kreatif</li>
        </ol>
        <p class="mt-3 justify">
          Maka untuk menunjang pencapaian tujuan tersebut dan mengaplikasikan antara pengetahuan dan keterampilan yang telah didapat siswa di
          sekolah dengan realita dunia kerja, SMK Negeri 4 Tasikmalaya akan melaksanakan Program Praktek Kerja Lapangan (PKL). Program ini wajib
          diikuti oleh seluruh siswa kelas XII pada semester VI (Enam).
        </p>
        <p class="mt-3 justify">
          Berkaitan dengan pelaksanaan tersebut di atas, Kami mohon bantuan kerja sama Bapak/Ibu untuk berkenan memberikan kesempatan kepada
          siswa kami untuk melaksanakan program tersebut di dinas/jawatan/perusahaan yang Bapak/Ibu pimpin. Mulai tanggal
          <strong>13 Januari sampai dengan 18 April 2026</strong>. Siswa yang akan melaksanakan PKL di dinas/jawatan/perusahaan Bapak/Ibu sebagai berikut:
        </p>
        <table class="mt-2 small table">
          <tr class="text-center">
            <td>No.</td>
            <td>Nama</td>
            <td width="12%">NIS</td>
            <td width="10%">Kelas</td>
            <td>Program Keahlian</td>
          </tr>
          <tr v-for="(p,i) in pemetaan" :key="p.id">
            <td class="text-center">{{ i+1 }}.</td>
            <td>{{ p.expand.siswa.nama.charAt(0).toUpperCase() + p.expand.siswa.nama.slice(1).toLowerCase() }}</td>
            <td class="text-center">{{ p.expand.siswa.nis }}</td>
            <td class="text-center">{{ p.expand.siswa.kelas }}</td>
            <td>{{ p.expand.program_keahlian.alias }}</td>
          </tr>
        </table>
        <p class="mt-2">
          Atas kesediaan dan kerjasama Bapak/Ibu, Kami mengucapkan terima kasih.
        </p>
        <table class="mt-3 small">
          <tr>
            <td></td>
            <td width="31%">
              Kepala Sekolah,
              <br>
              <br>
              <br>
              <br>
              <br>
              <span class="underline">{{ pengaturan.nama_kepala_sekolah }}</span><br>
              NIP. {{ pengaturan.nip }}
            </td>
          </tr>
        </table>
      </article>
    </section>
    <section class="kertas">
      <article class="small">
        <div class="bold text-center">LEMBAR PENERIMAAN PKL</div>
        <div class="mt-2">
          Yang bertanda tangan di bawah ini:
          <table class="mt-3 lineheigh">
            <tr>
              <td width="20%">Nama</td>
              <td>:</td>
            </tr>
            <tr>
              <td>Jabatan</td>
              <td>:</td>
            </tr>
            <tr>
              <td>Nama Industri</td>
              <td>:</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>:</td>
            </tr>
            <tr><td>&nbsp;</td></tr>
            <tr>
              <td>Telepon/HP</td>
              <td>:</td>
            </tr>
            <tr>
              <td>Waktu kegiatan</td>
              <td>:</td>
              <td class="bold">13 Januari sampai dengan 18 April 2026</td>
            </tr>
          </table>
          <div class="mt-4 text-center bold">MENERIMA / TIDAK MENERIMA *</div>
          <p class="mt-3">Siswa/i tersebut di bawah ini PKL dari {{ pengaturan.nama_sekolah }}.</p>
          <table class="mt-2 table">
            <tr class="text-center">
              <td>No.</td>
              <td>Nama</td>
              <td width="12%">NIS</td>
              <td width="10%">Kelas</td>
              <td>Program Keahlian</td>
            </tr>
            <tr v-for="(p,i) in pemetaan" :key="p.id">
              <td class="text-center">{{ i+1 }}.</td>
              <td>{{ p.expand.siswa.nama.charAt(0).toUpperCase() + p.expand.siswa.nama.slice(1).toLowerCase() }}</td>
              <td class="text-center">{{ p.expand.siswa.nis }}</td>
              <td class="text-center">{{ p.expand.siswa.kelas }}</td>
              <td>{{ p.expand.program_keahlian.alias }}</td>
            </tr>
          </table>
          <div class="mt-3">
            Demikian surat penerimaan PKL ini kami buat dan untuk digunakan sebagai mana mestinya.
          </div>
          <div class="mt-3">Catatan:</div>
          <div class="mt-2 italic">
            *Coret yang tidak perlu <br>
            Segala bentuk jawaban atas surat permohonan ini mohon di sampaikan melalui alamat: <br>
            {{ pengaturan.nama_sekolah }} <br>
            Jl. Depok Kelurahan Sukamenak Kecamatan Purbaratu Kota Tasikmalaya <br>
            Tlp. (0265)312059
          </div>
          <table class="mt-3 small">
            <tr>
              <td></td>
              <td width="31%">
                Tasikmalaya,.......................2025 <br>
                <div class="mt-2">Hormat Kami,</div>
                <div class="mt-2">a.n PT / CV ................................</div>
                <br>
                <br>
                <br>
                <br>
                ....................................................
              </td>
            </tr>
          </table>
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
useHead({ title: `Cetak Pemetaan — ${route.params.id}`})
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let isLoading = ref(true)
let pemetaan = ref([])
let pengaturan = ref([])
let prokel = user.user.value.program_keahlian
let date_now = new Date()
const date_options = {
  dateStyle: "long",
};
let tanggal = new Intl.DateTimeFormat('id-ID', date_options).format(date_now);

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
