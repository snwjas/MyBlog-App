<template>
  <div>
    <!-- 头像 -->
    <div class="avatar">
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">您好啊，朋友<br>欢迎您光临鄙人的博客</div>
        <el-avatar :size="120" fit="contain">
          <img :src="profile.avatar" alt="">
        </el-avatar>
      </el-tooltip>
    </div>
    <!-- 简介 -->
    <div class="introduction">
      <p>{{ profile.description }}</p>
    </div>
    <!-- 社交 -->
    <div class="social">
      <a v-for="(scl,index) in social" :key="index" target="_blank" :href="scl.link">
        <el-avatar :src="scl.icon" fit="cover">
          {{ scl.name }}
        </el-avatar>
      </a>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      social: [
        {
          name: 'GitHub',
          link: 'https://github.com/snwjas',
          icon: 'https://ico.mikelin.cn/github.com'
        },
        {
          name: 'Gitee',
          link: 'https://gitee.com/snwjas',
          icon: 'https://ico.mikelin.cn/gitee.com'
        },
        {
          name: 'CSDN',
          link: 'https://blog.csdn.net/u012131025',
          icon: 'https://ico.mikelin.cn/csdn.net'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['profile'])
  }
}
</script>

<style scoped lang="scss">
.avatar {
  text-align: center;
}

.introduction {
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.75rem;
}

.social {
  text-align: center;
  margin-top: 1.2rem;

  a {
    margin-right: 7px;
  }
}
</style>
