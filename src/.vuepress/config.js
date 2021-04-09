module.exports = {
  // metaタグ
  head: [
    ['meta', { name: 'google-site-verification', content: 'BDXGk8FJfikB_I6Pyxv35Zc87jBMziCgRMvmpNDpdYA' }],
    ],
  // プラグイン
  plugins: {
    // サイトマップ(案内図)
    //hostnameは自身のサイトのトップページです．
    'sitemap': {
      hostname: 'https://www.hamlet-engineer.com/',
      //excludeはいらんところを案内図からはずす
      exclude: ["/404.html"],
      //dateFormatterは更新の度にサイトマップも更新
      dateFormatter: val => {
          return new Date().toISOString()
        }
    },

    // Google Analytics
    // gaは．Google Analytics登録時に発行されるトラッキングID
    // 最新のGA4で発行されるG-00000000のIDは未対応
    '@vuepress/google-analytics': {
        'ga': 'UA-189978044-1'
    },

    // seo(metaタグ)
    'seo': {
        // descriptionは検索時に表示されるサイトの説明
        description: ($page, $site) => $page.frontmatter.description || ($page.excerpt && $page.excerpt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")) || $site.description || "",
        // titleは検索時に表示されるサイトのタイトル
        title: ($page, $site) => $page.title || $site.title,
        // imageはSNSでリンクした際などにプレビュー表示される画像
        twitterCard: _ => 'summary_large_image',
        image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain || '') + $page.frontmatter.image) || 'https://placehold.jp/40//333/600x315.png?css=%7B"padding"%3A"%200%2080px"%2C"background-image"%3A"%20url(https://lh3.googleusercontent.com/pw/ACtC-3d3gJEIns_Ufsr-NuGVe54oIqIZCcWTSR_u8KXhVz9L09TQMoPCO_qTdzKkQS-h8AUfYBRhdakl-qXxjnGOQv7ypd2RwB2mLzb2gMGB-o0pDy5s8Juln8qZfbCG3GDdu1nWw5JJ-NxjAYg7-bXPGIM=w600-h315-no?authuser=0)"%7D&text='+encodeURIComponent($page.title||$site.title),
    },
  },
  // サイトのタイトル
  title: 'ハムレット型エンジニアのカンニングノート',
  // サイトの説明
  description: 'ハムレット型エンジニアのカンニングノート',
  // 言語設定
  locales: {
    '/': {
        lang: 'ja-jp',
    },
  },
  base: '/',
  dest: 'docs',
  // テーマを指定
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
      { text: 'ページ集', link: '/about/' },
      { text: '技術', link: '/posts/' },
      { text: 'メンタル', link: '/mental/' },
      { text: 'その他', link: '/other/' },
      { text: 'タグ', link: '/tag/' },
      { text: 'カテゴリ', link: '/category/' },
      { text: '筆者', link: 'https://twitter.com/hirasu1231' },
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
