<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :sm="13" :xs="22">
        <div id="blog" class="blog">
          <h1 :id="blog.title" class="title">{{ blog.title }}</h1>
          <div class="info">
            <div>
              <i class="el-icon-date" />
              <span>{{ blog.createTime }}</span>
            </div>
            <div>
              <i class="el-icon-folder" />
              <span>{{ getCategoryName(blog.category) }}</span>
            </div>
            <div>
              <i class="el-icon-collection-tag" />
              <el-tag
                v-for="(tag,index) in blog.tags"
                :key="index"
                size="mini"
                type="info"
                style="margin-right: 5px"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
          <div class="summary">
            <p>{{ blog.summary }}</p>
          </div>
          <div class="content" v-html="blog.formatContent" />
        </div>
      </el-col>
      <el-col :sm="5" class="hidden-sm-and-down">
        <el-tabs :class="['profile',profileSticky?'sticky':'']" :stretch="true">
          <el-tab-pane label="文章目录">
            <el-tree
              class="catalog"
              :data="blog.toc"
              :props="defaultProps"
              accordion
            />
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
import { getBlog } from '@/api/blog'

export default {
  name: 'Blog',
  components: {
    'v-profile': () => import('@/components/index/Profile')
  },
  data() {
    return {
      scroll: this.$scroll,
      contentTop: window.screenTop,
      profileSticky: false,
      blog: {},
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    scroll: {
      deep: true,
      handler: function(val) {
        const scrollNow = val.scrollNow
        this.profileSticky = scrollNow >= this.contentTop
      }
    }
  },
  created() {
    this.getBlog(this.$route.params.url)
  },
  updated() {
    this.contentTop = document.getElementById('main-content').offsetTop
    if (this.$parent.$refs.slidey) {
      this.$parent.$refs.slidey.scrollToElem()
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

    p {
      font-size: 16px;
      line-height: 200%;
    }
  }

  .content {
    margin-top: 1rem;
  }
}

</style>
