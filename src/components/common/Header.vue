<template>
  <div
    :class="['header', isScrollToTop?'show':'hide']"
    :style="'background-color:' + (scrollCur===0?'rgba(0,0,0,0)':'#545c64')"
  >
    <el-row type="flex" justify="center">
      <el-col :md="18" :sm="20" :xs="22">
        <div class="clearfix">
          <router-link :to="{name: 'Index'}" class="nav-item">
            <el-link class="nav-item" icon="el-icon-s-home" :underline="false">首页</el-link>
          </router-link>
          <router-link :to="{name: 'Archive'}" class="nav-item">
            <el-link class="nav-item" icon="el-icon-s-management" :underline="false">归档</el-link>
          </router-link>
          <el-link class="nav-item" icon="el-icon-link" :underline="false">友链</el-link>
          <div style="float: right">
            <el-link class="nav-item" icon="el-icon-search" :underline="false" @click="openSearch">搜索</el-link>
            <el-link class="nav-item" icon="el-icon-warning-outline" :underline="false">关于</el-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <v-search ref="search" />
  </div>
</template>

<script>
export default {
  name: 'Header',
  components: {
    'v-search': () => import('@/components/common/Search')
  },
  data() {
    return {
      scrollLast: 0,
      scrollCur: 0
    }
  },
  computed: {
    isScrollToTop: function() {
      return this.scrollLast >= this.scrollCur
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      document.addEventListener('scroll', () => {
        this.scrollLast = this.scrollCur
        this.scrollCur = document.documentElement.scrollTop || document.body.scrollTop
      })
    })
  },
  methods: {
    openSearch() {
      this.$refs.search.open()
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
  transition: all 0.3s;

  &.show {
    transform: translateY(0);
  }

  &.hide {
    transform: translateY(-101%);
  }

  .nav-item {
    height: 54px;
    line-height: 54px;
    margin-right: 24px;
    color: #ffffff;
    font-size: 18px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: #409EFF;
    }
  }
}

</style>
