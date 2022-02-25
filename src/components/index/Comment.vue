<template>
  <!-- 评论插件改自@wanglinyong：https://github.com/wanglinyong/hbl-comment -->
  <div class="hbl-fa">
    <div class="hbl-comm">
      <div class="info-input">
        <el-form :inline="true" size="mini">
          <el-form-item label="">
            <el-popover
              ref="popoverAuthor"
              placement="top"
              trigger="focus"
              content="可输入QQ号点击右侧按钮获取信息"
            />
            <el-input v-model="author" v-popover:popoverAuthor placeholder="* 昵称" maxlength="63" clearable />
          </el-form-item>
          <el-form-item label="">
            <el-popover
              ref="popoverEmail"
              placement="top"
              trigger="focus"
              content="或将收到回复邮件提醒"
            />
            <el-input v-model="email" v-popover:popoverEmail type="email" placeholder="* 邮箱地址" maxlength="127" clearable />
          </el-form-item>
          <el-form-item label="">
            <img class="qq-btn" src="@/asset/img/icon/qq-circle.png" alt="QQ" @click="getInfoFromQQApi">
          </el-form-item>
        </el-form>
      </div>
      <div class="comment-box">
        <div v-if="showAvatar" class="comment-avatar">
          <el-avatar :size="46" :src="getAvatar(avatar)" />
        </div>
        <div class="comment">
          <el-input
            v-model="textareaMap[0]"
            class="comment-input"
            type="textarea"
            show-word-limit
            :maxlength="1023"
            :autosize="{minRows: 5}"
            resize="none"
            :placeholder="placeholder"
            @focus="showButton(0)"
          />
          <div v-if="buttonMap[0]" class="hbl-owo">
            <div :class="!pBodyMap[0]?'OwO':'OwO OwO-open'" class="emoj publish" :style="{width:emojiWidth}">
              <div class="OwO-logo" @click="pBodyStatus(0)">Emoji表情</div>
              <div class="OwO-body">
                <ul class="OwO-items OwO-items-show">
                  <li v-for="(value,key,index) in OwOlist" :key="index" class="OwO-item" @click="choseEmoji(0,key)">
                    <img :src="requireFace(value)" :alt="`[${key}]`" :title="key">
                  </li>
                </ul>
              </div>
            </div>
            <div class="publish publish-btn">
              <button class="btn" @click="doSend(0)">发送</button>
              <button class="btn btn-cancel" @click="cancel(0)">取消</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div id="comment-list" class="comm">
      <div class="su com-rep" />
      <div class="com-rep com-title">评论（{{ commentNum }}）</div>
    </div>

    <div v-for="(item,index) in commentList" :key="index" class="hbl-child">
      <div class="reply" />
      <div :id="`comment-${item.id}`" class="content">
        <div v-if="showAvatar" class="comment-f avatar">
          <el-avatar :size="46" :src="getAvatar(item.avatar)" />
        </div>

        <div class="comment-f">
          <div>
            <div class="nickname author">
              {{ item.author }}
            </div>
            <div v-if="item.isAdmin" class="icon author">{{ label }}</div>
            <div class="date">
              {{ item.createTime }}
            </div>
          </div>
        </div>

        <div class="reply-content" v-html="analyzeEmoji(item.content)" />

        <div class="reply-content reply-fa">
          <div class="reply-font">
            <span @click="doReply(item.id)">
              <img src="@/asset/img/icon/reply.png" class="icon-reply">
              <span class="icon-reply icon-hf">回复</span>
            </span>
          </div>

          <div v-if="replyMap[item.id]" class="r-comment">
            <el-input
              v-model="textareaMap[item.id]"
              class="comment-input"
              type="textarea"
              show-word-limit
              :maxlength="1023"
              :autosize="{minRows: 5}"
              resize="none"
              :placeholder="placeholder"
              @focus="showButton(item.id)"
            />

            <div v-if="buttonMap[item.id]" class="hbl-owo">
              <div :class="!pBodyMap[item.id]?'OwO':'OwO OwO-open'" class="emoj publish" :style="{width:emojiWidth}">
                <div class="OwO-logo" @click="pBodyStatus(item.id)">Emoji表情</div>
                <div class="OwO-body">
                  <ul class="OwO-items OwO-items-show">
                    <li v-for="(value,key,jindex) in OwOlist" :key="jindex" class="OwO-item" @click="choseEmoji(item.id,key)">
                      <img :src="requireFace(value)" :alt="`[${key}]`" :title="key">
                    </li>
                  </ul>
                </div>
              </div>

              <div class="publish publish-btn">
                <button class="btn" @click="doSend(item.id)">发送</button>
                <button class="btn btn-cancel" @click="cancel(item.id)">取消</button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div v-for="(ritem,rindex) in item.childrenList" :key="rindex" class="children">
        <div class="reply" />
        <div :id="`comment-${ritem.id}`" class="content">

          <div v-if="showAvatar" class="comment-f avatar">
            <el-avatar :size="46" :src="getAvatar(ritem.avatar)" />
          </div>

          <div class="comment-f">
            <div>
              <div class="nickname author">
                {{ ritem.author }}
              </div>
              <div v-if="ritem.isAdmin" class="icon author">{{ label }}</div>
              <div class="date">
                {{ ritem.createTime }}
              </div>
            </div>
          </div>

          <div class="reply-content">
            <div class="cc cc-to">
              <span class="cc-name" @click="markParentComment(ritem.parent.id)">@{{ ritem.parent.author }}
                <span v-if="ritem.parent.isAdmin" class="icon author">
                  {{ label }}
                </span>
              </span>
            </div>
            <div :class="['cc',ritem.isAdmin?'admin':'']" v-html="analyzeEmoji(ritem.content)" />
          </div>
          <div class="reply-content reply-fa">
            <div class="reply-font">
              <span @click="doReply(ritem.id)">
                <img src="@/asset/img/icon/reply.png" class="icon-reply">
                <span class="icon-reply icon-hf">回复</span>
              </span>
            </div>

            <div v-if="replyMap[ritem.id]" class="r-comment">
              <el-input
                v-model="textareaMap[ritem.id]"
                class="comment-input"
                type="textarea"
                show-word-limit
                :maxlength="1023"
                :autosize="{minRows: 5}"
                resize="none"
                :placeholder="placeholder"
                @focus="showButton(ritem.id)"
              />

              <div v-if="buttonMap[ritem.id]" class="hbl-owo">
                <div :class="!pBodyMap[ritem.id]?'OwO':'OwO OwO-open'" class="emoj publish" :style="{width:emojiWidth}">
                  <div class="OwO-logo" @click="pBodyStatus(ritem.id)">Emoji表情</div>
                  <div class="OwO-body">
                    <ul class="OwO-items OwO-items-show">
                      <li v-for="(value,key,owoindex) in OwOlist" :key="owoindex" class="OwO-item" @click="choseEmoji(ritem.id,key)">
                        <img :src="requireFace(value)" :alt="`[${key}]`">
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="publish publish-btn">
                  <button class="btn" @click="doSend(ritem.id)">发送</button>
                  <button class="btn btn-cancel" @click="cancel(ritem.id)">取消</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import OwOlist from '@/asset/face/default'
import { getQQInfo } from '@/api/others'
import { scrollTo } from '@/utils'

export default {
  name: 'Comment',
  props: {
    emojiWidth: {
      type: String,
      default: '560px'
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '在此输入评论内容...'
    },
    label: {
      type: String,
      default: '作者'
    },
    commentNum: {
      type: Number,
      default: 0
    },
    commentList: {
      type: Array,
      default: () => []
    },
    blogId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      replyMap: {},
      buttonMap: {},
      pBodyMap: {},
      textareaMap: {},
      OwOlist: OwOlist,
      author: '',
      email: '',
      avatar: '',
      currentMarkParentCommentId: undefined
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // '$route':'routeChange'
  },
  created() { // 生命周期函数
    this.getInfoFromLocalStorage()
  },
  mounted() { // 页面加载完成后

  },
  methods: {
    requireFace(name) {
      return require(`@/asset/face/default/${name}`)
    },
    getAvatar(avatar) {
      return avatar || require('@/asset/img/avatar.jpg')
    },
    showButton(index) {
      this.$set(this.buttonMap, index, true)
    },
    cancel(index) {
      this.$set(this.buttonMap, index, false)
      if (index !== 0) {
        this.$set(this.replyMap, index, false)
      }
    },
    doSend(id) {
      this.$emit('doSend', {
        blogId: this.blogId,
        parentId: id || 0,
        content: this.dealWithContent(this.textareaMap[id]),
        author: this.author,
        email: this.email,
        avatar: this.avatar
      })
    },
    doSendSucceed() { // 发送成功回调，父组件调用
      this.setInfoToLocalStorage()
    },
    clearReply(index) {
      this.$set(this.textareaMap, index, '')
      this.cancel(index)
    },
    // 选择表情包
    choseEmoji: function(index, inner) {
      if (!this.textareaMap[index]) {
        this.$set(this.textareaMap, index, '')
      }
      var emoji = '[' + inner + ']'
      this.$set(this.textareaMap, index, this.textareaMap[index] + emoji)
    },

    dealWithContent(cont) {
      if (!cont) return ''
      return cont.replace(/<\/?.+?\/?>/g, '') // 删除HTML标签
    },

    analyzeEmoji: function(cont) { // 编译表情替换成图片展示出来
      cont = cont.replaceAll('\n', '<br>')
      var pattern = /\[.+?\]/g
      var content = cont.match(pattern)
      if (content) {
        content = Array.from(new Set(content))
        for (var item of content) { // [name]
          var name = item.replace(/(\[|\])/g, '')
          var owoSrc = this.OwOlist[name]
          if (owoSrc) {
            var src = this.requireFace(owoSrc)
            var imoj = `<img class="imoj" src="${src}" alt="${item}" title="${name}">`
            cont = cont.replaceAll(item, `${imoj}`)
          }
        }
      }
      return cont
    },
    doReply(index) {
      this.$set(this.replyMap, index, true)
    },

    pBodyStatus(index) {
      this.$set(this.pBodyMap, index, !this.pBodyMap[index])
    },

    markParentComment(id) {
      if (this.currentMarkParentCommentId) {
        const $elem = document.getElementById(this.currentMarkParentCommentId)
        $elem.className = 'content'
      }
      this.currentMarkParentCommentId = `comment-${id}`
      const $elem = document.getElementById(this.currentMarkParentCommentId)
      $elem.className = 'content mark'
      $elem.scrollIntoView({ behavior: 'smooth' })
    },

    moveToHead() {
      scrollTo('#comment-list')
    },

    setInfoToLocalStorage() {
      localStorage.setItem('CommentAuthorInfo', JSON.stringify({
        author: this.author,
        avatar: this.avatar,
        email: this.email
      }))
    },

    getInfoFromLocalStorage() {
      const info = JSON.parse(localStorage.getItem('CommentAuthorInfo'))
      if (Object.prototype.toString.call(info) === '[object Object]') {
        this.author = info.author || ''
        this.avatar = info.avatar || ''
        this.email = info.email || ''
      }
    },

    getInfoFromQQApi() {
      if (!this.author || !/^\d+$/.test(this.author)) {
        this.$message.info('请在昵称输入框输入QQ号')
        return
      }
      getQQInfo(this.author).then(resp => {
        this.author = resp.author
        this.avatar = resp.avatar
        this.email = resp.email
        this.setInfoToLocalStorage()
      }).catch(err => {
        this.$message.error(`获取QQ信息错误：${err}`)
      })
    }
  }

}
</script>
<style scoped lang="scss">

.comment-box {
  display: table;
  width: 100%;
}

.comment-avatar {
  display: table-cell;
  vertical-align: top;
  width: 50px;
}

.comment {
  display: table-cell;
  width: calc(100% - 50px);
}

.publish {
  margin-top: 10px;
  display: inline-block;
  vertical-align: top;
}

.publish-btn {
  float: right;
}

.btn {
  width: 70px;
  margin-top: 3px;
  height: 30px;
  border-width: 0;
  border-radius: 3px;
  background: #3CB371;
  cursor: pointer;
  outline: none;
  font-family: Microsoft YaHei, serif;
  color: white;
  font-size: 13px;
  text-align: center;
  line-height: 30px;
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
}

.btn-cancel {
  background: grey;
}

.tmsgBox {
  position: relative;
  background: #fff;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.tmsg-respond h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.tmsg-respond h3 small {
  font-size: smaller;
  cursor: pointer;
}

.tmsg-respond textarea {
  background: #f4f6f7;
  height: 100px;
  margin-bottom: 10px;
}

.OwO {
  position: relative;
  z-index: 1;
}

.OwO .OwO-logo {
  position: relative;
  border-radius: 4px;
  color: #444;
  display: inline-block;
  background: #fff;
  border: 1px solid #ddd;
  font-size: 13px;
  padding: 0 6px;
  cursor: pointer;
  height: 30px;
  box-sizing: border-box;
  z-index: 2;
  line-height: 30px;
}

.OwO .OwO-logo:hover {
  animation: a 5s infinite ease-in-out;
}

.OwO .OwO-body {
  position: absolute;
  background: #fff;
  border: 1px solid #ddd;
  z-index: 1;
  top: 29px;
  border-radius: 0 4px 4px 4px;
  display: none;
}

.OwO-open .OwO-body {
  display: block;
}

.OwO-open .OwO-logo {
  border-radius: 4px 4px 0 0;
  border-bottom: none;
}

.OwO-open .OwO-logo:hover {
  animation: none;
}

.OwO .OwO-items {
  max-height: 197px;
  overflow: auto;
  font-size: 0;
  padding: 10px;
  z-index: 1
}

.OwO .OwO-items .OwO-item {
  background: #f7f7f7;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin: 0 10px 12px 0;
  transition: 0.3s;
  line-height: 19px;
  font-size: 20px;
  cursor: pointer;
}

.OwO .OwO-items .OwO-item:hover {
  background: #eee;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
  0 3px 1px -2px rgba(0, 0, 0, .2),
  0 1px 5px 0 rgba(0, 0, 0, .12);
  animation: a 5s infinite ease-in-out;
}

.OwO .OwO-body .OwO-bar {
  width: 100%;
  height: 30px;
  border-top: 1px solid #ddd;
  background: #fff;
  border-radius: 0 0 4px 4px;
  color: #444;
}

.OwO .OwO-body .OwO-bar .OwO-packages li {
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
  margin-right: 3px;
  text-align: center;
}

.OwO .OwO-body .OwO-bar .OwO-packages li:first-of-type {
  border-radius: 0 0 0 3px;
}

@keyframes a {
  2% {
    transform: translateY(1.5px) rotate(1.5deg)
  }
  4% {
    transform: translateY(-1.5px) rotate(-.5deg)
  }
  6% {
    transform: translateY(1.5px) rotate(-1.5deg)
  }
  8% {
    transform: translateY(-1.5px) rotate(-1.5deg)
  }
  10% {
    transform: translateY(2.5px) rotate(1.5deg)
  }
  12% {
    transform: translateY(-.5px) rotate(1.5deg)
  }
  14% {
    transform: translateY(-1.5px) rotate(1.5deg)
  }
  16% {
    transform: translateY(-.5px) rotate(-1.5deg)
  }
  18% {
    transform: translateY(.5px) rotate(-1.5deg)
  }
  20% {
    transform: translateY(-1.5px) rotate(2.5deg)
  }
  22% {
    transform: translateY(.5px) rotate(-1.5deg)
  }
  24% {
    transform: translateY(1.5px) rotate(1.5deg)
  }
  26% {
    transform: translateY(.5px) rotate(.5deg)
  }
  28% {
    transform: translateY(.5px) rotate(1.5deg)
  }
  30% {
    transform: translateY(-.5px) rotate(2.5deg)
  }
  32%, 34% {
    transform: translateY(1.5px) rotate(-.5deg)
  }
  36% {
    transform: translateY(-1.5px) rotate(2.5deg)
  }
  38% {
    transform: translateY(1.5px) rotate(-1.5deg)
  }
  40% {
    transform: translateY(-.5px) rotate(2.5deg)
  }
  42% {
    transform: translateY(2.5px) rotate(-1.5deg)
  }
  44% {
    transform: translateY(1.5px) rotate(.5deg)
  }
  46% {
    transform: translateY(-1.5px) rotate(2.5deg)
  }
  48% {
    transform: translateY(-.5px) rotate(.5deg)
  }
  50% {
    transform: translateY(.5px) rotate(.5deg)
  }
  52% {
    transform: translateY(2.5px) rotate(2.5deg)
  }
  54% {
    transform: translateY(-1.5px) rotate(1.5deg)
  }
  56% {
    transform: translateY(2.5px) rotate(2.5deg)
  }
  58% {
    transform: translateY(.5px) rotate(2.5deg)
  }
  60% {
    transform: translateY(2.5px) rotate(2.5deg)
  }
  62% {
    transform: translateY(-.5px) rotate(2.5deg)
  }
  64% {
    transform: translateY(-.5px) rotate(1.5deg)
  }
  66% {
    transform: translateY(1.5px) rotate(-.5deg)
  }
  68% {
    transform: translateY(-1.5px) rotate(-.5deg)
  }
  70% {
    transform: translateY(1.5px) rotate(.5deg)
  }
  72% {
    transform: translateY(2.5px) rotate(1.5deg)
  }
  74% {
    transform: translateY(-.5px) rotate(.5deg)
  }
  76% {
    transform: translateY(-.5px) rotate(2.5deg)
  }
  78% {
    transform: translateY(-.5px) rotate(1.5deg)
  }
  80% {
    transform: translateY(1.5px) rotate(1.5deg)
  }
  82% {
    transform: translateY(-.5px) rotate(.5deg)
  }
  84% {
    transform: translateY(1.5px) rotate(2.5deg)
  }
  86% {
    transform: translateY(-1.5px) rotate(-1.5deg)
  }
  88% {
    transform: translateY(-.5px) rotate(2.5deg)
  }
  90% {
    transform: translateY(2.5px) rotate(-.5deg)
  }
  92% {
    transform: translateY(.5px) rotate(-.5deg)
  }
  94% {
    transform: translateY(2.5px) rotate(.5deg)
  }
  96% {
    transform: translateY(-.5px) rotate(1.5deg)
  }
  98% {
    transform: translateY(-1.5px) rotate(-.5deg)
  }
  0%, to {
    transform: translate(0) rotate(0deg)
  }
}

/*用户输入表单*/
.tmsg-r-info {
  margin: 10px 0;
}

.tmsg-r-info input {
  height: 30px;
  border-radius: 4px;
  background: #f4f6f7;
}

.tmsg-r-info .info-submit {
  margin: 10px 0;
  text-align: center;
}

.tmsg-r-info .info-submit p, .tmsg-commentshow h1 {
  /*background: #97dffd;*/
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  /*transition: all .3s ease-in-out;*/
  height: 30px;
  line-height: 30px;
  text-align: center;
}

/*.tmsg-r-info .info-submit p:hover{
    background: #47456d;
}*/
/*评论列表*/
.tmsg-comments .tmsg-comments-tip {
  display: block;
  border-left: 2px solid #363d4c;
  padding: 0 10px;
  margin: 40px 0;
  font-size: 20px;
}

.tmsg-commentlist {
  margin-bottom: 20px;

}

.tmsg-commentshow > .tmsg-commentlist {
  border-bottom: 1px solid #e5eaed;
}

.tmsg-c-item {
  border-top: 1px solid #e5eaed;
}

.tmsg-c-item article {
  margin: 20px 0;
}

.tmsg-c-item article header {
  margin-bottom: 10px;
}

.tmsg-c-item article header img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  float: left;
  transition: all .4s ease-in-out;
  margin-right: 15px;
  object-fit: cover;
}

.tmsg-c-item article header img:hover {
  transform: rotate(360deg);
}

.tmsg-c-item article header .i-name {
  font-size: 14px;
  margin: 5px 8px 7px 0;
  color: #444;
  font-weight: bold;
  display: inline-block;
}

.tmsg-c-item article header .i-class {
  display: inline-block;
  margin-left: 10px;
  background: #dff0d8;
  color: #3c763d;
  border-radius: 5px;
  padding: 3px 6px;
  font-size: 12px;
  font-weight: 400;
}

.tmsg-c-item article header .i-time {
  color: #aaa;
  font-size: 12px;
}

.tmsg-c-item article section {
  margin-left: 80px;
}

.tmsg-c-item article section p img {
  vertical-align: middle;
}

.tmsg-c-item article section .tmsg-replay {
  margin: 10px 0;
  font-size: 12px;
  color: #64609E;
  cursor: pointer;
}

.hbl-owo {
  text-align: left;
}

.info-input {
  text-align: center;
}

.qq-btn {
  width: 28px;
  cursor: pointer;
}

.comm {
  padding: 20px;
}

.su {
  margin-top: 2px;
  width: 5px;
  height: 23px;
  background: #3CB371; /*#1E90FF*/
}

.com-rep {
  display: inline-block;
  vertical-align: top;
}

.com-title {
  font-size: 20px;
  margin-left: 5px;
}

.hbl-fa {
  text-align: left;
}

.hbl-comm {
  padding: 40px;
}

.reply {
  border-top: solid 1px #D9D9D9;
}

.content {
  margin-top: 20px;
  margin-bottom: 20px;

}

.content.mark .reply-content:nth-child(3) {
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #3cb371;
  border-radius: 3px;
}

.comment-f {
  display: inline-block;
  vertical-align: top;
}

.comment-f.avatar {
  margin-right: 10px;
}

.nickname {
  font-size: 14px;
}

.author {
  display: inline-block;
  line-height: initial
}

.icon {
  background: #dff0d8;
  color: #3c763d;
  border-radius: 5px;
  padding: 3px 6px;
  font-size: 12px;
  font-weight: 400;
}

.date {
  font-size: 12px;
  margin-top: 5px;
  color: grey;
}

.reply-content {
  word-wrap: break-word;
  width: 90%;
  font-size: 15px;
  line-height: 25px;
  margin-left: 56px;
}

.reply-fa {
  margin-top: 5px;
}

.reply-font {
  margin-bottom: 5px;
  color: grey;
  cursor: pointer;
}

.children {
  padding-left: 40px;
}

.cc {
  display: inline-block;
}

.cc-to .cc-name {
  cursor: pointer;
  color: #409eff;
  padding-right: 5px;
}

.icon-reply {
  display: inline-block;
  vertical-align: top;
}

.icon-hf {
  margin-top: 2px;
}

.hbl-child {
  padding: 20px;
}
</style>

<style lang="css">
.cc.admin img {
  width: fit-content;
  max-width: 100%;
}

.cc img.imoj {
  width: initial;
}
</style>
