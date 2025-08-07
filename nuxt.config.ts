export default defineNuxtConfig({
  compatibilityDate: "2024-10-18",
  devtools: { enabled: false },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.min.css",
    "vue-multiselect/dist/vue-multiselect.min.css"
  ],
  plugins: ['~/plugins/vue-multiselect.ts'],
  ssr: false,
  app: {
    head: {
      script: [
        { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.2/dist/js/bootstrap.bundle.min.js" }
      ]
    }
  },

})
