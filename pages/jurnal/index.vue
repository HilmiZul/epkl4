<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <span class="h4 public-sans"><i class="bi bi-journals"></i> Jurnal Peserta</span>
    </div>
    <div class="card-body small">
      <div class="row">
        <div class="col-md-4">
          <!-- <div class="alert alert-warning shadow-lg small py-2">
            <div class="fs-5 mb-2">FYI</div>
            <ul class="p-0 mx-1">
              <li><span class="bg-info">&nbsp;&nbsp;&nbsp;</span> Kegiatan sesuai Elemen</li>
              <li><span class="bg-danger">&nbsp;&nbsp;&nbsp;</span> Kegiatan tidak sesuai Elemen</li>
              <li>Untuk memvalidasi kegiatan, klik <code>Validasi</code></li>
            </ul>
          </div> -->
          <div class="mb-3">
            <label for="filter">Filter Berdasarkan Tanggal</label>
            <input v-model="tanggal" type="date" id="filter" class="form form-control picker mt-2">
          </div>
          <div class="row justify-content-center">
            <jurnal-chart />
          </div>
        </div>
        <div class="col">
          <div class="mb-2 text-center text-muted">Menampilkan 2 dari 20 Jurnal</div>
          <div class="row">
            <div class="col">
              <div class="card jurnal-hover">
                <div class="card-body">
                  <div><strong class="fs-6">Nama Peserta</strong> &bull; <span class="text-muted fst-italic">14 Februari 2026</span></div>
                  <div class="my-2">
                    <span class="border border-2 border-dark p-1 bg-info"><i class="bi bi-journal-bookmark-fill"></i>
                      Elemen: Penerapan hard skills
                    </span>
                  </div>
                  <article class="my-2">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore quaerat ipsa atque porro ad molestias, animi nemo eligendi repudiandae mollitia laboriosam quidem. Saepe labore tempore illum exercitationem quaerat sequi expedita?
                  </article>
                  <div class="my-3 foto-container">
                    <img src="https://www.stonebridge.uk.com/blog/wp-content/uploads/2016/05/Web-design-and-development.jpg" alt="foto" class="foto" />
                  </div>
                  <span class="hand-cursor"><span class="text-danger"><i class="bi bi-heart"></i></span> Validasi</span>
                  <span class="text-danger"><i class="bi bi-heart-fill"></i></span> Valid
                  <span class="fst-italic text-muted">memvalidasi...</span>
                </div>
              </div>
              <div class="card jurnal-hover">
                <div class="card-body">
                  <div><strong class="fs-6">Nama Peserta</strong> &bull; <span class="text-muted fst-italic">14 Februari 2026</span></div>
                  <div class="my-2">
                    <span class="border border-2 border-dark p-1 bg-danger"><i class="bi bi-journal-bookmark-fill"></i>
                      Elemen: Lain-lain
                    </span>
                  </div>
                  <article class="my-2">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore quaerat ipsa atque porro ad molestias, animi nemo eligendi repudiandae mollitia laboriosam quidem. Saepe labore tempore illum exercitationem quaerat sequi expedita?
                  </article>
                  <div class="my-3 foto-container">
                    <img src="https://media.istockphoto.com/id/1308639642/photo/meeting-on-it-development-team-in-office.jpg?s=612x612&w=0&k=20&c=1lYZBc2Zh24ATF-OxX8U1RWpKASwUrhcmTSB-3w8PAQ=" alt="foto" class="foto" />
                  </div>
                  <span class="text-danger"><i class="bi bi-heart"></i></span> Validasi
                  <span class="text-danger"><i class="bi bi-heart-fill"></i></span> Valid
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col offset-md-4">
          <Loading class="mt-5" />
        </div>
      </div>
      <div class="row my-4 mb-4">
        <div class="col text-end">
          <button disabled class="btn btn-info"><i class="bi bi-arrow-left"></i> sebelumnya</button>
          <button class="btn btn-info">lanjut <i class="bi bi-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal Peserta — e-PKL / SMKN 4 Tasikmalaya." })
let tanggal = ref()
</script>

<style scoped>
input.picker[type="date"] {
  position: relative;
}
input.picker[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  color: transparent;
  background: transparent;
}

.foto-container {
  width: 400px;
  height: 200px;
}
.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.jurnal-hover:hover {
  background-color: #f7fddd;
}
.bg-danger {
  background-color: rgb(255, 99, 132) !important;
}
</style>
