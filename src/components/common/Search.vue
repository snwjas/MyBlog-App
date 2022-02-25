<template>
  <div :class="['search-popup',active?'active':'']">
    <div class="search-popup__overlay" @click="close" />
    <div class="search-popup__inner">
      <div class="search-popup__form">
        <input v-model="keyword" type="text" name="search" placeholder="输入关键字搜索...." @keyup.enter="search">
        <button @click="search">
          <i class="el-icon-search" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Search',
  data() {
    return {
      keyword: '',
      active: false
    }
  },
  methods: {
    open() {
      this.active = true
      // 隐藏滚动条禁止页面滑动
      document.body.style.overflow = 'hidden'
    },
    close() {
      this.keyword = ''
      this.active = false
      // 恢复滚动条
      document.body.style.overflow = ''
    },
    search() {
      this.$router.push({ name: 'Search', params: { keyword: this.keyword }})
      this.close()
      this.$scrollToContent()
    }
  }
}
</script>

<style scoped lang="scss">
.search-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  transform: scale(1, 0);
  transform-origin: bottom center;
  transition: transform .7s ease;

  &.active {
    transform-origin: top center;
    transform: scale(1, 1);
  }

  &__overlay {
    width: 100%;
    height: 100%;
    background-color: #000;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    opacity: .7;
  }

  &__inner {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__form {
    position: relative;
    z-index: 9991;
    width: 100%;
    padding: 15px;
    max-width: 600px;

    input {
      border: none;
      outline: none;
      width: 100%;
      height: 60px;
      color: #012237;
      font-size: 18px;
      background-color: #fff;
      padding-left: 30px;
    }

    button {
      border: none;
      outline: none;
      width: 90px;
      height: 61px;
      color: #fff;
      background-color: #409eff;
      cursor: pointer;
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      transition: all .4s ease;

      &:hover {
        background-color: #66b1ff;
      }

      i {
        font-size: 24px;
      }
    }
  }
}
</style>
