module.exports = {
  title: 'Theme',
  description: 'theme for Vuepress',
  base: '/ououe_hamlet_engineer/',
  dest: 'docs',
  theme: require.resolve('../../'),
  themeConfig: {
    // defaultTheme: { dark: [19, 6] },
    showThemeButton: false,
    cover: '/cover.jpg',
    logo: '/logo.png',
    search: true,
    backgroundImage: false,
    pageGroup: 10,
    // postTime: {
    //   createTime: 'Create Time',
    //   lastUpdated: 'Last Updated',
    //   options: {
    //     dateStyle: 'full',
    //     timeStyle: 'short',
    //     hour12: false,
    //     weekday: 'long'
    //   }
    // },
    nav: [
      { text: 'ホーム', link: '/' },
      { text: '技術', link: '/posts/' },
      { text: 'メンタル', link: '/mental/' },
      { text: 'タグ', link: '/tag/' },
      { text: 'カテゴリ', link: '/category/' },
      { text: 'サイトマップ', link: '/about/' },
      { text: 'Twitter', link: 'https://twitter.com/hirasu1231' },
      { text: 'Github', link: 'https://github.com/hirasu1231' }
    ],
    footer: [
      { text: 'Twitter', link: 'https://twitter.com/hirasu1231' },
      { text: 'Github', link: 'https://github.com/hirasu1231' }
    ]
  },
  // postcss: {
  //   plugins: [
  //     require('css-prefers-color-scheme/postcss'),
  //     require('autoprefixer')
  //   ]
  // }
}
