export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      coreServiceBaseUrl: process.env.NUXT_PUBLIC_CORE_SERVICE_BASE_URL,
      masterdataServiceBaseUrl: process.env.NUXT_PUBLIC_MASTERDATA_SERVICE_BASE_URL,
      authenticationServiceBaseUrl: process.env.NUXT_PUBLIC_AUTHENTICATION_SERVICE_BASE_URL,
      fileServiceBaseUrl: process.env.NUXT_PUBLIC_FILE_SERVICE_BASE_URL
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/seo',
    'shadcn-nuxt',
    '@nuxtjs/leaflet'
  ],

  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],
  app: {
    head: {
      title: 'Wheelchair Rental App',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  icon: {
    componentName: 'NuxtIcon'
  },
  build: {
    transpile: ['pdf-lib'] // Add problematic packages here
  }
})