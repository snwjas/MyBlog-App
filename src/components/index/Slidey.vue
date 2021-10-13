<template>
  <div class="slidey" :style="{...bgi}">
    <div class="mask" />
    <div class="info">
      <p class="title">{{ attributes.name }}</p>
      <p class="description">{{ attributes.description }}</p>
    </div>
    <div class="control">
      <div class="pre" @click="preImg">
        <i class="el-icon-arrow-left" />
      </div>
      <div class="next" @click="nextImg">
        <i class="el-icon-arrow-right" />
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
  // eslint-disable-next-line vue/require-prop-types
  props: ['scrollToElemId'],
  data() {
    return {
      slideHeight: 0,
      imgLoop: null,
      currentBGI: 0,
      imgNames: [
        'https://cn.bing.com/th?id=OHR.SnowCraterLake_ZH-CN9218350129_1920x1080.jpg',
        'https://cn.bing.com/th?id=OHR.FoucaultsPendulum_ZH-CN9435794626_1920x1080.jpg',
        'https://cn.bing.com/th?id=OHR.SnowCraterLake_ZH-CN9218350129_1920x1080.jpg',
        'https://cn.bing.com/th?id=OHR.DiamondBeach_ZH-CN3165398805_1920x1080.jpg',
        'https://cn.bing.com/th?id=OHR.DiamondBeach_ZH-CN3165398805_1920x1080.jpg'
      ]
    }
  },
  computed: {
    bgi() {
      return { backgroundImage: `url(${this.imgNames[this.currentBGI]})` }
    },
    ...mapGetters(['attributes'])
  },
  created() {
    this.setImgLoop()
  },
  methods: {
    // 切换到上一张图片
    preImg() {
      clearInterval(this.imgLoop)
      if (this.currentBGI > 0) {
        this.currentBGI -= 1
      } else {
        this.currentBGI = this.imgNames.length - 1
      }
      this.setImgLoop()
    },
    // 切换到下一张图片
    nextImg() {
      clearInterval(this.imgLoop)
      if (this.currentBGI >= this.imgNames.length - 1) {
        this.currentBGI = 0
      } else {
        this.currentBGI += 1
      }
      this.setImgLoop()
    },
    // 设置图片循环播放
    setImgLoop() {
      this.imgLoop = setInterval(this.nextImg, 7000)
    },
    // 滚动到元素（主内容）
    scrollToElem() {
      window.scrollTo({
        top: document.getElementById(this.scrollToElemId).offsetTop,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.slidey {
  position: relative;
  height: 80vh;
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

    * {
      color: white;
      font-weight: 600;
    }

    .title {
      font-size: 4.5vw;
    }

    .description {
      margin-top: 24px;
      font-size: 1.75vw;
    }
  }

  .control {
    div {
      position: absolute;
      top: 45%;
      cursor: pointer;
      color: white;
      font-size: 32px;
      font-weight: bolder;
    }

    .pre {
      left: 20px;
    }

    .next {
      right: 20px;
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
