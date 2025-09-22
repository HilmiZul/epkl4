<template>
  <div>
    <footer class="my-4 text-muted text-center smallest metropolis">
      v{{ version }} <br>
      &copy;2018 - {{ year }} <span class="fw-bold hand-cursor link-footer" data-bs-toggle="modal" data-bs-target="#cooked">e-PKL</span>. <br>
    </footer>
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
