---
display: home
title: 'Disqusと連携してVuepressにコメント機能を実装する'
description: Vuepressにコメント機能を実装します．
date: 2021-05-03
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - CSS
---
Disqusと連携してVuepressにコメント機能を実装します．

<!-- more -->

Githubとvuepress-comment-pluginを連携する手法もありますが，僕の場合，公式ドキュメント通りにしてもGithubとの連携ができなかったので，Disqusを使用します．

## ファイル構成
ファイル構成は以下通りです．
```
hamlet_engineer
└── src
    ├── (省略)
    └── .vuepress
        ├── (省略)
        └── components
             └── PostDisqus.vue
```

## Disqusの設定
参照したサイトがわかりやすかったので，文章をそのまま引用します．

引用元：[VuePressにDisqusでコメント機能を追加してみた](https://dorasu-tech.dorasu.com/posts/2020/03/18/vuepress-disqus.html)

### Disqusアカウント作成
>[Disqus公式ページ](https://disqus.com/)の「GET STARTED」からサインインでアカウントを作成します。

### セットアップ
>ログイン状態で[Disqusのトップページ](https://disqus.com/)に行くと以下のような画面になるので、再度「GET STARTED」

![](/image/vuepress_comment_01.png)<br><br>

> サイトの情報を入力します。

![](/image/vuepress_comment_02.png)<br><br>

> 次に「I want to install Disqus on my site」

![](/image/vuepress_comment_03.png)<br><br>

> Website Name: これがDisqusにアクセスするためのコードになります<br>
・Category: Techにしました<br>
・Language: Japanese<br>
・無料で使える「Basic」を選択<br>

![](/image/vuepress_comment_04.png)<br><br>

> VuePressはないので、下の方の「Universal Code」を選択

![](/image/vuepress_comment_05.png)<br><br>

すると，以下のコードが表示されます．

※15行目の｛Your Website name}の部分が，入力した情報と同じか確認
```js
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://｛Your Website name}.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
```

> `Website URL`に、コメント機能を入れるサイトのURLを入れて終了です。

![](/image/vuepress_comment_06.png)<br><br>

## コメントの表示
.vuepress/theme/components/PostDisqus.vueという名前で以下のコードを作成します．

```js
<template>
  <div id="disqus_thread"></div>
</template>

<script>
export default {
  name: 'PostDisqus',
  
  mounted() {
    var disqus_config = function () {
      this.page.url = window.location.origin;  
      this.page.identifier = window.location.pathname; 
    };
    (function() { // DON'T EDIT BELOW THIS LINE
      var d = document, s = d.createElement('script');
      s.src = 'https://｛Your Website name}.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }
}
</script>
```

作成後，コメント欄を表示したい場所に PostDisqusタグを入れると，コメントが表示されます．
```js
---
display: home
title: 'title'
description: description
date: date
categories: 
  - categories
tags:
  - tags
---

<PostDisqus/>
```

## Disqusの設定
以下の設定でログインしなくてもコメントできるように調整しました．
![](/image/guest_comment.png)


## まとめ
Disqusと連携してVuepressにコメント機能を実装しました．

僕は，毎回打ち込むのが面倒なので，Vuepressのlayoutで自動で打ち込むようにしています．

これについては，テンプレートとなるVuepressの構成によってことなるので，解説はしません．

<br>

## 参考サイト
[VuePressにDisqusでコメント機能を追加してみた](https://dorasu-tech.dorasu.com/posts/2020/03/18/vuepress-disqus.html)

[Vuepress に DISQUS でコメント欄をつける](https://passe-de-mode.uedasoft.com/ja/tips/software/frontend/vuepress/vuepress03.html)

[Disqusのコメントを承認制にする方法](https://hamazof.com/2019/06/17/disqus_comment_syouninsei/)