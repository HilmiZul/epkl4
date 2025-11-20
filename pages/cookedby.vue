<template>
  <nuxt-link to="/" class="btn btn-light btn-sm border border-2 border-dark"><i class="bi bi-arrow-left"></i>
    Kembali</nuxt-link>
  <div class="card mt-3">
    <div class="card-body text-dark">
      <p>
        <strong>e-PKL</strong> (<strong>PKL</strong> stand for Praktik Kerja Lapangan) is an internship mapping app for
        students.
        I made this project is just for fun, because the Head of the Software Engineering Department challenged me to
        make
        an app that can generate letters.
      </p>
      <p>
        Original written in Python (with Django Framework) since 2018 and rewrite to Javascript (with Vue Framework) in
        2022.
      </p>
      <p>
        This project is an open source software under MIT Licensed. Feel free if you want to contribute to this
        <nuxt-link to="https://github.com/hilmizul/epkl4" target="_blank" class="link-footer">project</nuxt-link>.
      </p>
      <div class="pt-3">
        Best regards,
        <div class="fw-bold">
          <nuxt-link to="https://zulhilmi.id" class="link-footer" target="_blank">Author</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
definePageMeta({ layout: 'public' })
useHead({
  title: "Cooked by — e-PKL / SMKN 4 Tasikmalaya.",
  meta: [
    { name: "description", content: "Aturan dan Syarat Penggunaan pada SaaS/App Pemetaan dan Jurnal Peserta PKL (Praktik Kerja Lapangan) tingkat SMK." }
  ]
})
</script>
