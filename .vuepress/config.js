module.exports = {
  title: 'Vuetify & Firebase',
  description: 'Construye un calendario con Vuetify y Firebase',
  base: '/vuetify/',
  locales:{
    '/':{
      lang: 'es-ES'
    }
  },
  themeConfig:{
    nav: [
      { text: 'Guía', link: '/' },
      // { text: 'Guia', link: '/docs/' },
      { text: 'Youtube', link: 'https://youtube.com/bluuweb' },
    ],
    sidebar:
      [
        '/',
        '/guia/'
      ]
  }
 
}