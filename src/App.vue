<template>
  <div id="app">
    <v-header />
    <v-slidey ref="slidey" />
    <div id="main-content">
      <router-view />
    </div>
    <v-footer />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    'v-header': () => import('@/components/common/Header'),
    'v-footer': () => import('@/components/common/Footer'),
    'v-slidey': () => import('@/components/index/Slidey')
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
#main-content {
  padding-top: 60px;

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
}
</style>
