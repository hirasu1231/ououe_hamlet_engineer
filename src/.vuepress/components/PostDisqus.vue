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
      (function() {
        var d = window.document, s = d.createElement('script');
        s.src = 'https://hamlet-engineer.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
      })();
    }
  }
</script>