import themeConfig from '@theme/lib/themeConfig'
import { objectDeepMerge } from '@theme/lib/util'
import ImgLazy from 'vuepress-plugin-img-lazy/ImgLazy'

export default ({ Vue, options,router,siteData }) => {
  // google ads↓
  if (typeof window !== 'undefined') {
    import('vue-google-adsense')
      .then(module => {
        const Ads = module.default
        Vue.use(require('vue-script2'))
        Vue.use(Ads.Adsense)
        Vue.use(Ads.InArticleAdsense)
        Vue.use(Ads.InFeedAdsense)
      })
      .catch(e => {
        console.log(e)
      })
  }
  // google ads↑

  Vue.component(ImgLazy.name, ImgLazy)
  Vue.mixin({
    computed: {
      $themeConfig() {
        return objectDeepMerge(themeConfig, this.$site.themeConfig)
      },
      $cover() {
        const item = this.$themeConfig.cover
        if (this.$frontmatter.image) {
          return this.$frontmatter.image
        } else if (typeof item === 'string') {
          return item
        } else if (item[this.$route.path]) {
          return item[this.$route.path]
        } else {
          return item.base || ''
        }
      },
      $isHome() {
        return (
          this.$localePath === this.$page.regularPath ||
          this.$page.regularPath.startsWith(
            '/' + this.$pluginConfig.paginatioPath
          )
        )
      }
    }
  })
}
