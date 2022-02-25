<template>
  <el-row type="flex" justify="center" class="footer" style="background-color:#545c64">
    <el-col :md="18" :sm="20" :xs="24" v-html="attributes.footer" />
  </el-row>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Footer',
  computed: {
    ...mapGetters(['attributes'])
  }
}
</script>

<style scoped lang="scss">
.footer {
  margin-top: 7vh;
  padding: 20px;
  text-align: center;

  * {
    color: white;
    font-size: 16px;
  }
}
</style>
