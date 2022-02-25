import Vue from 'vue'
import { tryCopyDomText } from '@/utils'
// 引入代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css'
// 行号插件
import hljsNumbers from '@/plugin/highlightjs/highlightjs-line-numbers'

window.hljs = hljs
hljsNumbers(window, document)
hljs.configure({
  ignoreUnescapedHTML: true
})

// 高亮代码方法
Vue.prototype.$highlightCode = () => {
  const $codeList = document.querySelectorAll('#post-content pre code')
  $codeList.forEach(($code) => {
    // 添加复制按钮
    const icon = document.createElement('i')
    icon.className = 'icon-copy el-icon-copy-document'
    icon.onclick = function(e) {
      tryCopyDomText($code)
    }
    $code.parentNode.appendChild(icon)
    // 高亮代码
    hljs.highlightBlock($code)
    // 添加行号
    hljs.lineNumbersBlock($code)
  })
}

