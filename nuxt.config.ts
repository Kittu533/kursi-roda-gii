export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/seo',
    'shadcn-nuxt',

  ],

  css: ['~/assets/css/main.css'],
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
  }
})