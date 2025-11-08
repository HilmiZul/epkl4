<template>
  <nuxt-link to="/" class="btn btn-light btn-sm border border-2 border-dark"><i class="bi bi-arrow-left"></i> Kembali</nuxt-link>
  <nuxt-link to="/privacy" class="btn btn-info btn-sm border border-2 border-dark ms-2">Kebijakan Privasi</nuxt-link>
  <div class="card mt-3">
    <div class="card-header bg-success fw-bold fs-5">
      Aturan dan Syarat Penggunaan
    </div>
    <div class="card-body text-dark">
      <p class="text-muted small">
        Diperbaharui pada 8 November 2025
      </p>
      <h5 class="fw-bold">Akun Anggota e-PKL</h5>
      <ul>
        <li>Warga sekolah di SMKN 4 Tasikmalaya.</li>
        <li>Manajemen, diantaranya Wakil Kepala Sekolah bidang Humas, Kepala Program dan Kepala Bengkel.</li>
        <li>Guru yang mengampu pada tingkat XII.</li>
        <li>Tata Usaha bagian persuratan.</li>
        <li>Setiap anggota yang terdaftar artinya sepakat dengan Kebijakan Privasi aplikasi e-PKL.</li>
        <li>Setiap anggota berhak dan dianjurkan memperbaharui password secara berkala.</li>
        <li>e-PKL berhak menonaktifkan akun anggota apabila terjadi hal lain misalnya perubahan jadwal atau cuti.</li>
      </ul>
      <h5 class="fw-bold">Alur Pemetaan PKL</h5>
      <ul>
        <li>Hanya peserta didik yang sudah tuntas nilai rapor 4 semester terakhir yang dapat dipetakan.</li>
        <li>Jurusan wajib mengajak peserta didik melakukan konsultasi sebelum survey tempat PKL.</li>
        <li>
          Jurusan wajib memfasilitasi, melayani dan mengarahkan peserta didik kepada IDUKA yang sesuai kompetensi,
          apabila terdaftar pada halaman IDUKA dan masih kosong.
        </li>
        <li>Peserta didik masih dapat mengubah pilihan IDUKA selama surat permohonan belum terbit.</li>
        <li>Surat permohonan akan di <em>generate</em> oleh aplikasi e-PKL pasca pemetaan peserta ke IDUKA selesai.</li>
        <li>Surat permohonan akan di TTE oleh TU Persuratan apabila jumlah kuota IDUKA terisi penuh.</li>
        <li>TU Persuratan akan merilis dan mencetak surat permohonan yang telah selesai di TTE paling lambat setengah hari (tergantung ketersediaan personil).</li>
        <li>Upayakan peserta didik tidak mengubah atau mengundurkan diri dari IDUKA apabila telah diterima. Jika hal tersebut terjadi, maka peserta didik tersebut harus dipetakan ulang.</li>
      </ul>
      <h5 class="fw-bold">Terkait Elemen</h5>
      <ul>
        <li>Elemen berisi CP dan tujuan dari Mapel PKL.</li>
        <li>Dilarang keras mengubah Elemen default yang sudah ada pada aplikasi e-PKL.</li>
        <li>Setiap Kepala Program Keahlian wajib mengisi poin-poin elemen sesuai program keahlian.</li>
        <li>Elemen ini akan digunakan oleh peserta didik untuk mengisi Jurnal Harian.</li>
      </ul>
      <h5 class="fw-bold">Terkait Jurnal Harian</h5>
      <ul>
        <li>Setiap Guru Pembimbing wajib memantau dan memvalidasi aktivitas peserta pada halaman Jurnal Harian.</li>
        <li>Setiap jurnal peserta memiliki pita berwarna <span class="text-info">Biru (sesuai elemen)</span> dan <span class="text-danger">Merah (tidak sesuai elemen)</span>.</li>
        <li>Guru Pembimbing hanya diperbolehkan memvalidasi Jurnal peserta apabila:
          <table class="table text-muted small mt-3">
            <tbody>
              <tr>
                <th>Elemen</th>
                <th>Konten</th>
              </tr>
              <tr>
                <td><i class="bi bi-bookmark-fill text-info"></i> Pita Biru</td>
                <td>Sesuai dengan elemen yang dipilih</td>
              </tr>
              <tr>
                <td><i class="bi bi-bookmark-fill text-info"></i> Pita Biru</td>
                <td>Ada hubungannya dengan elemen yang dipilih</td>
              </tr>
              <tr>
                <td> <i class="bi bi-bookmark-fill text-danger"></i> Pita Merah</td>
                <td>Lintas konsentrasi keahlian atau aktivitas masih berhubungan dengan pekerjaan</td>
              </tr>
            </tbody>
          </table>
          Yang tidak tercantum diatas, Guru Pembimbing tidak berkenan memvalidasi jurnal.
        </li>
        <li>Jurnal peserta akan diurutkan berdasarkan status yang belum valid.</li>
        <li>Guru Pembimbing dapat memfilter jurnal berdasarkan tanggal dan atau peserta didik.</li>
      </ul>
      <h5 class="fw-bold">Terkait Nilai</h5>
      <ul>
        <li>Guru Pembimbing berkewajiban mengingatkan peserta untuk menyerahkan nilai PKL.</li>
        <li>Guru Pembimbing berkewajiban memeriksa dan memastikan data yang serahkan sesuai.</li>
        <li>Guru Pembimbing berkewajiban memvalidasi nilai yang yang sudah diperiksa dan sesuai.</li>
      </ul>
      <h5 class="fw-bold">Terkait Sertifikat</h5>
      <ul>
        <li>Guru Pembimbing berkewajiban mencetak Sertifikat dari peserta yang menitipkan.</li>
        <li>Guru Pembimbing berkewajiban mengumpulkan dan menyerahkan Sertifikat yang sudah ditanda tangan oleh IDUKA bersangkutan kepada Panitia/HUBIN.</li>
      </ul>
      <h5 class="fw-bold">Terkait Rapor PKL</h5>
      <ul>
        <li>Guru Pembimbing memeriksa kembali nilai yang sudah divalidasi.</li>
        <li>Guru Pembimbing berkewajiban mencetak Rapor peserta dan menandatangani.</li>
        <li>Guru Pembimbing berkewajiban menyerahkan Rapor yang sudah ditanda tangan kepada Walikelas.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'public' })
useHead({
  title: "Aturan dan Syarat Penggunaan — e-PKL / SMKN 4 Tasikmalaya.",
  meta: [
    { name: "description", content: "Aturan dan Syarat Penggunaan pada SaaS/App Pemetaan dan Jurnal Peserta PKL (Praktik Kerja Lapangan) tingkat SMK."}
  ]
})
</script>
