<template>
  <div
    class="slidey"
    :style="{backgroundImage: `url(${bgURL})`, height: isBlogMode ? '50vh': '80vh'}"
  >
    <div class="mask" />
    <div class="info">
      <div v-if="isBlogMode" class="post">
        <div class="title">{{ blogData.title }}</div>
        <div class="description">
          <div style="margin-right: 20px;">
            <i class="el-icon-folder" style="margin-right: 5px;" />
            <span>{{ blogData && blogData.category && blogData.category.name ? blogData.category.name : '未分类' }}</span>
          </div>
          <div v-if="blogData.tags && blogData.tags.length > 0">
            <i class="el-icon-collection-tag" style="margin-right: 5px;" />
            <el-tag
              v-for="(tag,index) in blogData.tags"
              :key="index"
              size="mini"
              type="info"
              style="margin-right: 5px"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
        <div class="description">
          <el-avatar :src="profile.avatar" />&nbsp;&nbsp;
          {{ `${profile.nickname} · 发布于 ${blogData.createTime} · 最后编辑于 ${blogData.updateTime} · ${blogData.visits}次阅读` }}
        </div>
      </div>
      <div v-else class="home">
        <p class="title">{{ attributes.name }}</p>
        <p class="description">{{ attributes.description }}</p>
      </div>
    </div>
    <div class="toContent" @click="scrollToElem">
      <i class="el-icon-arrow-down" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Slidey',
  data() {
    return {
      slideHeight: 0,
      imgLoop: null,
      bgURL: '',
      blogData: {}
    }
  },
  computed: {
    isBlogMode() {
      return this.blogData &&
        Object.prototype.toString.call(this.blogData) === '[object Object]' &&
        Object.keys(this.blogData).length > 0
    },
    ...mapGetters(['attributes', 'profile'])
  },
  created() {
    this.setImgLoop()
  },
  methods: {
    getRandomBg() {
      const lx = ['dongman', 'fengjing']
      const img_api = `https://api.btstu.cn/sjbz/api.php?method=zsy&lx=${lx[Math.floor(Math.random() * lx.length)]}`
      return `${img_api}&_t=${new Date().getTime()}`
    },
    changeBg() {
      this.bgURL = this.getRandomBg()
    },
    // 设置图片循环播放
    setImgLoop() {
      this.clearImgLoop()
      this.changeBg()
      this.imgLoop = setInterval(this.changeBg, 60000)
    },
    clearImgLoop() {
      if (this.imgLoop) {
        clearInterval(this.imgLoop)
      }
    },
    // 滚动到元素（主内容）
    scrollToElem() {
      this.$scrollToContent()
    },
    setBlogData(data) { // 博客模式，则显示当前博客信息
      this.blogData = data
      if (this.isBlogMode) {
        this.clearImgLoop()
        this.bgURL = this.blogData.thumbnail ? this.blogData.thumbnail : this.getRandomBg()
      } else {
        this.setImgLoop()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.slidey {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 1s ease-in-out;

  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
  }

  .info {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translateX(-50%) translateY(-55%);
    text-align: center;
    color: white;

    .home {
      .title {
        font-size: 4.5vw;
        font-weight: 600;
      }

      .description {
        margin-top: 24px;
        font-size: 1.75vw;
      }
    }

    .post {
      .title {
        font-size: 2rem;
        font-weight: 600;
      }

      .description {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 18px;
        font-size: 15px;
        font-weight: normal;
      }
    }

  }

  .toContent {
    position: absolute;
    bottom: 10px;
    left: 50%;
    cursor: pointer;
    animation: arrowUpDown 2s infinite;

    i {
      font-size: 36px;
      font-weight: bolder;
      color: white;
    }

    @keyframes arrowUpDown {
      0%, 100% {
        opacity: 0.8;
        transform: translateY(0);
      }

      50% {
        opacity: 0.4;
        transform: translateY(-20px);
      }
    }
  }
}
</style>
