import pkg from './package.json'
export default defineNuxtConfig({
  compatibilityDate: "2025-08-15",
  devtools: { enabled: false },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.min.css",
    "vue-multiselect/dist/vue-multiselect.min.css",
  ],
  plugins: ['~/plugins/vue-multiselect.ts'],
  ssr: false,
  app: {
    head: {
      htmlAttrs: {
        lang: 'id',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.2/dist/js/bootstrap.bundle.min.js" },
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.PB_API_BASE_URL,
			apiPort: process.env.PB_API_PORT,
      appVersion: pkg.version,
      author: pkg.author,
		},
	},
})
