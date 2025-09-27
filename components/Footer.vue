<template>
  <div>
    <footer class="my-4 text-muted text-center smallest">
      v{{ version }} <br>
      <span class="hand-cursor link-footer" data-bs-toggle="modal" data-bs-target="#privacy">Privacy</span> |
      <span class="hand-cursor link-footer" data-bs-toggle="modal" data-bs-target="#terms">Terms</span> <br>
      &copy;2018 - {{ year }} <span class="fw-bold hand-cursor link-footer" data-bs-toggle="modal" data-bs-target="#cooked">e-PKL</span>. <br>
    </footer>
    <!-- about e-PKL -->
    <div class="modal" id="cooked" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-0 border border-3 border-dark shadow-lg text-muted">
          <div class="modal-header border-bottom border-3 border-dark bg-success rounded-0">
            <span class="fs-5 fw-bold">What is e-PKL?</span>
            <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body small">
            <p>
              <strong>e-PKL</strong> (<strong>PKL</strong> stand for Praktik Kerja Lapangan) is an internship mapping app for students.
              I made this project is just for fun, because the Head of the Software Engineering Department challenged me to make an app that can generate letters.
            </p>
            <p>
              Original written in Python (with Django Framework) since 2018 and rewrite to Javascript (with Vue Framework) in 2022.
            </p>
            <p>
              This project is an open source software under MIT Licensed. Feel free if you want to contribute to this <nuxt-link to="https://github.com/hilmizul/epkl4" target="_blank" class="link-footer">project</nuxt-link>.
            </p>
            <div class="pt-3">
              Best regards,
              <div class="fw-bold">
                <nuxt-link to="https://zulhilmi.id" class="link-footer" target="_blank">Author</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /about e-PKL -->

    <!-- Kebijakan Privasi -->
    <div class="modal" id="privacy" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content rounded-0 border border-3 border-dark shadow-lg text-muted">
          <div class="modal-header border-bottom border-3 border-dark bg-success rounded-0">
            <span class="fs-5 fw-bold">Kebijakan Privasi</span>
            <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-justify">
            <p>
              Kebijakan Privasi ini bertujuan untuk membantu Anda memahami data yang kami kumpulkan. Dengan
              menggunakan aplikasi e-PKL, maka Anda setuju dengan dokumen kebijakan privasi ini.
            </p>
            <h5 class="fw-bold text-grey">Informasi yang Kami Simpan</h5>
            <div class="fw-bold">Informasi Personal</div>
            <p>
              Kami menyimpan informasi personal Anda diantaranya Nama, Email, Grup Program Keahlian
              dan Password sesuai dengan Program Keahlian.
            </p>
            <div class="fw-bold">Informasi Peserta Didik</div>
            <p>
              Kami menyimpan informasi Peserta Didik pada tingkat XII dari masing-masing program keahlian.
            </p>
            <div class="fw-bold">Informasi IDUKA</div>
            <p>
              Kami juga mengumpulkan dan menyimpan informasi IDUKA dari masing-masing program keahlian. Informasi ini
              kami kumpulkan dari kegiatan PKL sebelumnya sesuai dengan pembaharuan dari masing-masing program keahlian.
            </p>
            <h5 class="fw-bold text-grey">Bagaimana Kami Menggunakan Informasi Anda</h5>
            <p>
              Informasi personal Anda kami gunakan untuk pembagian otoritas pada masing-masing program keahlian diantaranya
              mengelola Elemen Mapel PKL, Peserta Didik, IDUKA, Pemetaan PKL dan Jurnal Harian Peserta.
            </p>
            <p>
              Informasi Peserta didik akan kami gunakan untuk otentikasi, otoritas terhadap pemetaan tempat PKL,
              mencatat jurnal harian peserta, waktu dan analitik data.
            </p>
            <p>
              Informasi IDUKA akan Kami gunakan untuk pemetaan Pembimbing pada masing-masing program keahlian,
              pemetaan kepada peserta didik serta digunakan untuk analitik data.
            </p>
            <p>
              Kami juga menggunakan jurnal harian peserta untuk mengelompokkan aktivitas harian yang sesuai dengan
              Elemen Mapel PKL serta digunakan untuk analitik data.
            </p>
            <h5 class="fw-bold text-grey">Bagaimana Kami Menjaga Keamanan Informasi Anda</h5>
            <p>
              Kami mengupayakan menjaga keamanan seluruh informasi Anda tetap aman agar tidak dicuri.
              Sebagai contoh, kami menyimpan <em>password</em> menggunakan mekanisme <em>hashing</em>, tidak dalam
              bentuk karakter asli. Selain itu kami membatasi akses terhadap semua informasi yang tersimpan pada
              aplikasi e-PKL, dengan kata lain hanya yang memiliki akun dan otoritas tertentu yang dapat mengakses informasi didalam aplikasi e-PKL.
              Kami tidak akan menggunakan informasi Anda untuk hal-hal lain diluar aplikasi e-PKL.
            </p>

            <p class="pt-3 text-grey small">
              Diperbaharui pada 27 September 2025
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- /kebijakan privasi -->

    <!-- Aturan dan Syarat penggunaan -->
    <div class="modal" id="terms" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content rounded-0 border border-3 border-dark shadow-lg text-muted">
          <div class="modal-header border-bottom border-3 border-dark bg-success rounded-0">
            <span class="fs-5 fw-bold">Aturan dan Syarat Penggunaan</span>
            <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-justify">
            <h5 class="fw-bold text-grey">Akun Anggota e-PKL</h5>
            <ul>
              <li>Warga sekolah di SMKN 4 Tasikmalaya.</li>
              <li>Manajemen, diantaranya Wakil Kepala Sekolah bidang Humas, Kepala Program dan Kepala Bengkel.</li>
              <li>Guru yang mengampu pada tingkat XII.</li>
              <li>Tata Usaha bagian persuratan.</li>
              <li>Setiap anggota yang terdaftar artinya sepakat dengan Kebijakan Privasi aplikasi e-PKL.</li>
              <li>Setiap anggota berhak dan dianjurkan memperbaharui password secara berkala.</li>
              <li>e-PKL berhak menonaktifkan akun anggota apabila terjadi hal lain misalnya perubahan jadwal atau cuti.</li>
            </ul>
            <h5 class="fw-bold text-grey">Alur Pemetaan PKL</h5>
            <ul>
              <li>Upayakan peserta didik melakukan konsultasi bersama pihak jurusan sebelum melakukan survey tempat PKL.</li>
              <li>
                Pihak jurusan wajib memfasilitasi, melayani dan mengarahkan peserta didik kepada IDUKA yang sesuai kompetensi,
                apabila terdaftar pada IDUKA dan masih kosong.
              </li>
              <li>Peserta didik masih dapat mengubah pilihan IDUKA selama surat permohonan belum terbit.</li>
              <li>Surat permohonan akan di <em>generate</em> oleh aplikasi e-PKL pasca pemetaan peserta ke IDUKA selesai.</li>
              <li>Surat permohonan akan di TTE oleh TU Persuratan apabila jumlah kuota IDUKA terisi penuh.</li>
              <li>TU Persuratan akan merilis dan mencetak surat permohonan yang telah selesai di TTE paling lambat setengah hari (tergantung ketersediaan personil).</li>
              <li>Upayakan peserta didik tidak mengubah atau mengundurkan diri dari IDUKA apabila telah diterima. Jika hal tersebut terjadi, maka peserta didik tersebut harus dipetakan ulang.</li>
            </ul>
            <h5 class="fw-bold text-grey">Terkait Elemen</h5>
            <ul>
              <li>Elemen berisi CP dan tujuan dari Mapel PKL.</li>
              <li>Dilarang keras mengubah Elemen default yang sudah ada pada aplikasi e-PKL.</li>
              <li>Setiap Kepala Program Keahlian wajib mengisi poin-poin elemen sesuai program keahlian.</li>
              <li>Elemen ini akan digunakan oleh peserta didik untuk mengisi Jurnal Harian.</li>
            </ul>
            <h5 class="fw-bold text-grey">Terkait Jurnal Harian</h5>
            <ul>
              <li>Setiap Guru Pembimbing wajib memantau dan memvalidasi aktivitas peserta pada halaman Jurnal Harian.</li>
              <li>Setiap jurnal peserta memiliki pita berwarna <span class="text-primary">Biru (sesuai elemen)</span> dan <span class="text-danger">Merah (tidak sesuai elemen)</span>.</li>
              <li>Guru Pembimbing hanya diperbolehkan memvalidasi Jurnal peserta apabila:
                <table class="table text-muted small">
                  <tbody>
                    <tr>
                      <th>Elemen</th>
                      <th>Konten</th>
                      <th>Status Validasi</th>
                    </tr>
                    <tr>
                      <td><i class="bi bi-bookmark-fill text-primary"></i> Pita Biru (sesuai)</td>
                      <td>Sesuai dengan elemen yang dipilih</td>
                      <td><i class="bi bi-check-circle-fill text-success"></i> Valid</td>
                    </tr>
                    <tr>
                      <td><i class="bi bi-bookmark-fill text-primary"></i> Pita Biru (sesuai)</td>
                      <td>Ada hubungannya dengan elemen yang dipilih</td>
                      <td><i class="bi bi-check-circle-fill text-success"></i> Valid</td>
                    </tr>
                    <tr>
                      <td> <i class="bi bi-bookmark-fill text-danger"></i> Pita Merah (tidak sesuai)</td>
                      <td>Lintas konsentrasi keahlian atau aktivitas masih berhubungan dengan pekerjaan</td>
                      <td><i class="bi bi-check-circle-fill text-success"></i> Valid</td>
                    </tr>
                  </tbody>
                </table>
                Selain yang tercantum diatas, Guru Pembimbing tidak berkenan memvalidasi.
              </li>
              <li>Jurnal peserta akan diurutkan berdasarkan status yang belum valid.</li>
              <li>Guru Pembimbing dapat memfilter jurnal berdasarkan tanggal dan atau peserta didik.</li>
            </ul>

            <p class="pt-3 text-grey small">
              Diperbaharui pada 27 September 2025
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- /aturan dan syarat penggunaan -->
  </div>

</template>

<script setup>
let config = useRuntimeConfig()
let version = config.public.appVersion
let author = config.public.author
let year = new Date().getFullYear()
let user = usePocketBaseUser()
</script>

<style scoped>
.smallest {
  font-size: .75em;
}
</style>
