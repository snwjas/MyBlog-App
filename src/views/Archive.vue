<template>
  <!-- 归档 -->
  <el-row id="main" type="flex" justify="center">
    <el-col :sm="3" hidden-xs-only>
      <div class="left-year">
        <el-radio-group v-model="year" :class="[sticky?'sticky':'']" @change="yearSelect">
          <el-radio-button v-for="y in Object.keys(archive)" :key="y" :label="y">
            {{ y }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </el-col>
    <el-col :sm="15" :xs="22">
      <timeline>
        <div v-for="(value,key,index) in archive" :key="index">
          <timeline-title :id="key" bg-color="transparent" class="title">
            <i slot="others" class="el-icon-s-flag" />
            {{ key }}
          </timeline-title>
          <timeline-item v-for="item in value" :key="item.id" :bg-color="randomColor()" class="item">
            <router-link :to="`/blog/${item.url}`">
              {{ item.title }}
            </router-link>
            <p>{{ item.createTime }}</p>
          </timeline-item>
        </div>
      </timeline>
    </el-col>
  </el-row>
</template>

<script>
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import { randomColor, scrollToElement } from '@/utils'
import { listAchievement } from '@/api/blog'

export default {
  name: 'Achievement',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data() {
    return {
      year: null,
      archive: {},
      contentTop: window.screenTop,
      sticky: false,
      scrollEventToBind: [] // 用于取消绑定
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      const _this = this
      function fun() {
        const scroll = document.documentElement.scrollTop || document.body.scrollTop
        _this.sticky = scroll >= _this.contentTop
      }
      this.scrollEventToBind.push(fun)
      document.addEventListener('scroll', fun)
    })
  },
  created() {
    this.listAchievement()
  },
  updated() {
    this.contentTop = this.$getContentTop()
    this.$scrollToContent()
  },
  destroyed() {
    for (const fun of this.scrollEventToBind) {
      document.removeEventListener('scroll', fun)
    }
  },
  methods: {
    randomColor() {
      return randomColor()
    },
    yearSelect(val) {
      scrollToElement('#' + val)
    },
    listAchievement() {
      listAchievement().then(resp => {
        this.archive = resp.data
        if (Object.keys(this.archive).length !== 0) {
          this.year = Object.keys(this.archive)[0]
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-radio-group {
  width: 12.5vw;
}

.el-radio-button {
  width: 80px;
  display: block;

  &:first-child, &:last-child {
    .el-radio-button__inner {
      border: none;
      border-radius: 0;
    }
  }

  .el-radio-button__inner {
    width: 100%;
    margin: 0;
    border: none;
    border-radius: 0;
  }
}

</style>

<style scoped lang="scss">
.title {
  i {
    font-size: x-large;
    margin-top: -5px;
  }
}

.item {
  a {
    color: #409EFF;
  }

  p {
    font-size: 13px;
    color: #909399;
    margin-top: 7px;
  }
}

.left-year {
  position: relative;
}

.sticky {
  position: fixed;
  top: 70px;
  height: calc(100vh - 140px);
  width: 80px;
  text-align: center;
  overflow-y: scroll;
  -ms-overflow-style: none;
  overflow: -moz-hidden-unscrollable;
  transition: all .3s;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
