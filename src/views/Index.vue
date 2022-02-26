<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :md="13" :sm="20" :xs="22">
        <v-bloglist :blog-list="blogList" />
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size.sync="searchParams.pageSize"
          :current-page.sync="searchParams.current"
          @current-change="getBlogList"
          @size-change="getBlogList"
        />
      </el-col>
      <el-col :md="5" class="hidden-sm-and-down">
        <v-profile :class="['profile',profileSticky?'sticky':'']" />
      </el-col>
    </el-row>
    <el-backtop />
  </div>
</template>

<script type="module">
import { listBlogs } from '@/api/blog'

export default {
  name: 'Index',
  components: {
    'v-bloglist': () => import('@/components/index/BlogList'),
    'v-profile': () => import('@/components/index/Profile')
  },
  data() {
    return {
      contentTop: window.screenTop,
      profileSticky: false,
      blogList: [],
      total: 0,
      searchParams: {
        current: 1,
        pageSize: 10,
        title: null,
        tagId: null,
        categoryId: null
      }
    }
  },
  watch: {
    $scroll: {
      deep: true,
      handler: function(val) {
        const scrollNow = val.scrollNow
        this.profileSticky = scrollNow >= this.contentTop
      }
    },
    $route(to, from) {
      this.searchParams = {
        current: 1,
        pageSize: 10,
        title: null,
        tagId: null,
        categoryId: null
      }
      const keyword = this.$route.params.keyword
      if (!keyword) {
        this.$store.dispatch('info/getAttributes')
        this.$store.dispatch('info/getProfile')
        this.getBlogList()
      } else {
        this.searchParams.title = keyword
        this.getBlogList()
      }
    }
  },
  mounted() {
    // 不是搜索
    const keyword = this.$route.params.keyword
    if (!keyword) {
      this.getBlogList()
    } else {
      this.searchParams.title = keyword
      this.getBlogList()
    }
  },
  updated() {
    this.contentTop = document.getElementById('main-content').offsetTop
  },
  methods: {
    getBlogList() {
      listBlogs(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.blogList = resp.data.list
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

  &.sticky {
    position: fixed;
    top: 60px;
  }
}

.pagination {
  background-color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 1rem 0;
}

</style>
