<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :sm="13" :xs="22">
        <div id="blog" class="blog">
          <!--<h1 :id="blog.title" class="title">{{ blog.title }}</h1>-->
          <!--<div class="info">-->
          <!--  <div>-->
          <!--    <i class="el-icon-date" style="margin-right: 5px;" />-->
          <!--    <span>{{ blog.createTime }}</span>-->
          <!--  </div>-->
          <!--  <div>-->
          <!--    <i class="el-icon-folder" style="margin-right: 5px;" />-->
          <!--    <span>{{ categoryName }}</span>-->
          <!--  </div>-->
          <!--  <div>-->
          <!--    <i v-if="blog.tags && blog.tags.length > 0" class="el-icon-collection-tag" style="margin-right: 5px;" />-->
          <!--    <el-tag-->
          <!--      v-for="(tag,index) in blog.tags"-->
          <!--      :key="index"-->
          <!--      size="mini"-->
          <!--      type="info"-->
          <!--      style="margin-right: 5px"-->
          <!--    >-->
          <!--      {{ tag.name }}-->
          <!--    </el-tag>-->
          <!--  </div>-->
          <!--</div>-->
          <div class="summary" v-html="blog.summary" />
          <div id="post-content" class="content" v-html="blog.formatContent" />
          <!--图片浏览-->
          <div id="post-img-viewer">
            <el-image
              style="display: none;"
              :src="curImg"
              :preview-src-list="imgList"
            />
          </div>
          <el-divider content-position="center">END</el-divider>
          <div v-if="!(blog.allowComment === 'UNALLOWED')">
            <v-comment
              ref="comment"
              :blog-id.sync="blog.id"
              :comment-num.sync="commentAll"
              :comment-list.sync="commentList"
              @doSend="publishComment"
            />
            <div style="text-align: center;">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="commentTotal"
                :page-size="7"
                :current-page.sync="commentCurrentPage"
                @current-change="listComments(true)"
              />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="5" class="hidden-sm-and-down">
        <el-tabs :class="['profile',profileSticky?'sticky':'']" :stretch="true">
          <el-tab-pane label="文章目录">
            <div id="post-toc" />
          </el-tab-pane>
          <el-tab-pane label="站点概览">
            <v-profile />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-backtop />
  </div>
</template>

<script>
import { getBlog, listComments, publishComment } from '@/api/blog'
import { deepClone } from '@/utils'

export default {
  name: 'Blog',
  components: {
    'v-profile': () => import('@/components/index/Profile'),
    'v-comment': () => import('@/components/index/Comment')
  },
  data() {
    return {
      contentTop: window.screenTop,
      profileSticky: false,
      blog: {},
      imgList: [], // 文章内容图片
      curImg: '', // 当前点击查看的图片
      isViewImg: false, // 防止dom更新滚动
      currentSelectedToc: undefined, // 当前选择的目录dom元素
      isScrollChangeToc: false, // 检测滚动到那个dom,
      commentList: [],
      commentTotal: 0,
      commentCurrentPage: 1,
      commentAll: 0,
      scrollEventToBind: [] // 用于取消绑定
    }
  },
  computed: {
    categoryName: function() {
      return this.blog && this.blog.category && this.blog.category.name
        ? this.blog.category.name : '未分类'
    }
  },
  created() {
    this.getBlog(this.$route.params.url)
  },
  mounted: function() {
    this.$nextTick(() => {
      const _this = this

      function fun() {
        const scroll = document.documentElement.scrollTop || document.body.scrollTop
        _this.profileSticky = scroll >= _this.contentTop
      }

      this.scrollEventToBind.push(fun)
      document.addEventListener('scroll', fun)
    })
  },
  updated() {
    this.contentTop = this.$getContentTop()
    // if (this.isViewImg) return
    // this.$scrollToContent()
  },
  destroyed() {
    for (const fun of this.scrollEventToBind) {
      document.removeEventListener('scroll', fun)
    }
    if (this.$parent.$refs.slidey) {
      this.$parent.$refs.slidey.setBlogData(null)
    }
  },
  methods: {
    getCategoryName(category) {
      if (category) {
        return category.name
      }
      return '未分类'
    },
    getBlog(url) {
      getBlog(url).then(resp => {
        this.blog = resp.data
        this.$nextTick(function() {
          this.isViewImg = true
          this.initImgViewer()
          this.generateToc()
          this.$highlightCode()
          if (!(this.blog.allowComment === 'UNALLOWED')) {
            this.listComments()
          }
          if (this.$parent.$refs.slidey) {
            this.$parent.$refs.slidey.setBlogData(this.blog)
          }
        })
      })
    },
    initImgViewer() {
      const $imgs = document.querySelectorAll('#blog .content p img')
      if ($imgs.length === 0) return
      const viewer = document.querySelector('#post-img-viewer .el-image')
      for (const $img of $imgs.values()) {
        this.imgList.push($img.src)
        $img.onclick = function(e) {
          this.curImg = $img.src
          const $i = viewer.querySelector('img')
          if ($i) $i.click()
        }.bind(this)
      }
    },
    generateToc() {
      const $toc = document.getElementById('post-toc')
      const nodeList = document.querySelectorAll('#post-content > *')
      let index = 0
      const tocIds = []
      for (const $node of nodeList) {
        const nodeName = ($node.nodeName || '').toLocaleLowerCase()
        if (!/h[1-9]/i.test(nodeName)) continue
        const $cloneNode = $node.cloneNode(true)
        const $a = $cloneNode.querySelector('a')
        tocIds.push($a.id)
        $cloneNode.setAttribute('data-id', $a.id)
        $cloneNode.className = 'toc-item'
        if (index === 0) {
          this.currentSelectedToc = $cloneNode
          $cloneNode.className = 'toc-item selected'
        }
        $cloneNode.onclick = () => {
          this.isScrollChangeToc = true
          document.getElementById($a.id).scrollIntoView({
            behavior: 'smooth'
          })
          this.currentSelectedToc.className = 'toc-item'
          this.currentSelectedToc = $cloneNode
          this.currentSelectedToc.className = 'toc-item selected'
          setTimeout(() => {
            this.isScrollChangeToc = false
          }, 300)
        }
        $cloneNode.removeChild($a)
        $toc.appendChild($cloneNode)
        index++
      }
      // 存在目录，滚动检测，修改当前选择左侧目录
      const _this = this

      function fun() {
        if (_this.isScrollChangeToc) return
        _this.isScrollChangeToc = true
        setTimeout(() => {
          try {
            for (let i = 0; i < tocIds.length; i++) {
              if (document.getElementById(tocIds[i]).getBoundingClientRect().top >= 1) {
                const idx = i > 0 ? i - 1 : 0
                const $lt = document.querySelector(`#post-toc > .toc-item[data-id="${tocIds[idx]}"]`)
                _this.currentSelectedToc.className = 'toc-item'
                _this.currentSelectedToc = $lt
                _this.currentSelectedToc.className = 'toc-item selected'
                break
              }
            }
          } finally {
            _this.isScrollChangeToc = false
          }
        }, 300)
      }

      if (index > 0) {
        this.scrollEventToBind.push(fun)
        document.addEventListener('scroll', fun)
      } else {
        $toc.parentNode.innerHTML = `<div>暂无数据</div>`
      }
    },
    publishComment(data) {
      if (!data.author) {
        this.$message.warning('请输入昵称')
        return
      }
      if (!data.email ||
        !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i.test(data.email)) {
        this.$message.warning('请输入有效的邮箱地址')
        return
      }
      if (!data.content) {
        this.$message.warning('请输入评论内容')
        return
      }
      publishComment(data).then(resp => {
        this.$refs.comment.doSendSucceed()
        this.$refs.comment.clearReply(data.parentId)
        this.$message.success(resp.message)
        this.listComments()
      })
    },
    covertCommentData(parentData, dataList, deep, result) {
      if (!dataList || dataList.length === 0) return
      for (const data of dataList) {
        const d1 = deepClone(data)
        delete d1.children
        const d2 = deepClone(d1)
        if (deep === 1) {
          d1.childrenList = []
          result.push(d1)
        } else {
          d1.parent = parentData
          result[result.length - 1].childrenList.push(d1)
        }
        this.covertCommentData(d2, data.children, deep + 1, result)
      }
    },
    listComments(moveToHead = false) {
      const params = {
        bid: this.blog.id,
        cur: this.commentCurrentPage
      }
      listComments(params).then(resp => {
        const result = []
        try {
          this.covertCommentData({}, resp.data.list, 1, result)
        } catch (e) {
          console.error(e)
        }
        this.commentList = result
        this.commentTotal = resp.data.total
        this.commentAll = resp.data.all
        if (moveToHead) {
          this.$refs.comment.moveToHead()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

.profile {
  background-color: #fff;
  padding: 1rem;
  width: 18.8vw;
  margin-left: 2vw;
  border-radius: 5px;

  .el-tabs__nav {
    float: none;
    text-align: center;
  }

  &.sticky {
    position: fixed;
    top: 60px;
  }
}

.blog {
  padding: 1rem 2rem;
  background-color: #fff;
  margin-bottom: 1.5rem;
  border-radius: 5px;

  .title {
    text-align: center;

    a {
      color: #303133;
      transition: color .3s;
    }

    & a:hover {
      color: #409EFF;
    }
  }

  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem 0;
    font-size: 16px;
    color: #545c64;

    div {
      margin-right: 1.5rem;
    }
  }

  .summary {
    margin-top: 1rem;
    font-size: 16px;
    line-height: 200%;
    border: 1px #ccc dashed;
    padding: 10px 12px;
    border-radius: 5px;
    position: relative;
    text-align: center;

    &:after {
      content: "概述";
      position: absolute;
      top: -15px;
      left: 50%;
      padding: 0 12px;
      transform: translateX(-50%);
      background-color: #fff;
      color: #999;
      font-size: 15px;
      font-weight: bold;
    }
  }

  .content {
    margin-top: 2rem;
  }
}

</style>

<style lang="scss">
@import 'src/styles/github-markdown.scss';

.content {
  p {
    margin-bottom: 16px;
    line-height: 160%;

    img {
      width: 100%;
      cursor: zoom-in;
    }
  }

  pre .hljs {
    position: relative;
    background-color: #f3f4f5;
    padding: 12px;

    tr {
      line-height: 140%;
      font-size: 14px;
    }

    &:hover .icon-copy {
      visibility: visible;
    }

    .icon-copy {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 16px;
      transition: all .3s ease;
      visibility: hidden;
      cursor: pointer;
      color: #60627a;

      &:hover {
        color: #409EFF;
      }
    }
  }
}

#post-toc {
  line-height: 160%;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: normal;
    font-size: 15px;
    border-left: 2px solid #dcdcdc;

    &:hover {
      cursor: pointer;
      color: #409EFF;
    }
  }

  .selected {
    font-weight: 700;
    border-left-color: #409EFF;
    color: #409EFF;
  }

  h1 {
    padding-left: 10px;
  }

  h2 {
    padding-left: 20px;
  }

  h3 {
    padding-left: 30px;
  }

  h4 {
    padding-left: 40px;
  }

  h5 {
    padding-left: 50px;
  }

  h6 {
    padding-left: 60px;
  }
}
</style>
