import pkg from './package.json' with { type: 'json' }
import { readFileSync } from 'fs'
import { read, utils } from 'xlsx'

export default defineNuxtConfig({
  compatibilityDate: "2025-08-15",
  devtools: { enabled: false },
  modules: ['@nuxtjs/robots', '@nuxtjs/device'],
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
  // Workaround bug Nuxt 4.6.4: `devServer.host` yang tidak di-set akan
  // ter-resolve menjadi objek kosong `{}` (bukan string/undefined), sehingga
  // `nuxt dev` gagal dengan "options.hostname.toLowerCase is not a function".
  // Nilainya di-set eksplisit agar selalu berupa string.
  devServer: {
    host: process.env.NUXT_HOST || process.env.NITRO_HOST || process.env.HOST || 'localhost',
  },
  robots: {
    UserAgent: '*',
    Disallow: '/'
  },
  vite: {
    build: {
      // limit hasil build yg >= 700 dalam kB
      // lieur warning wae lah
      chunkSizeWarningLimit: 950,
    },
    // Pre-bundle dependensi client supaya tidak ditemukan saat runtime
    // (menghindari reload/re-optimize di tengah pemakaian).
    optimizeDeps: {
      include: [
        'chart.js/auto',
        'compressorjs',
        'html2pdf.js',
        'pocketbase',
        'vue-multiselect',
        'xlsx',
      ],
    },
    assetsInclude: ['**/*.xlsx'], // xlsx file should be treated as assets

    plugins: [
      {
        name: "vite-sheet",
        transform(_code, id) {
          if(!id.match(/\.xlsx$/)) return;
          var wb = read(readFileSync(id.replace(/\?sheetjs$/, "")));
          var data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          return `export default JSON.parse('${JSON.stringify(data).replace(/\\/g, "\\\\")}')`;
        }
      },
    ],
  },
  vue: {
    vapor: false,
  },
})
