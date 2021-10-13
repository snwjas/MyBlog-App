<template>
  <div>
    <div v-for="blog in blogList" :key="blog.id" class="content">
      <h1 class="title">
        <router-link :to="`/blog/${blog.url}`">{{ blog.title }}</router-link>
      </h1>
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
            v-for="tag in blog.tags"
            :key="tag.id"
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
      <div class="readBtn">
        <router-link :to="`/blog/${blog.url}`">
          <el-button type="primary" size="medium">
            阅读全文
            <i class="el-icon-right" />
          </el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogList',
  // eslint-disable-next-line vue/require-prop-types
  props: ['blogList'],
  data() {
    return {}
  },
  methods: {
    getCategoryName(category) {
      if (category) {
        return category.name
      }
      return '未分类'
    }
  }
}
</script>

<style scoped lang="scss">
.content {
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

  .readBtn {
    text-align: center;
    margin-top: 1.5rem;
  }
}
</style>
