<template>
  <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
    <el-scrollbar>
      <el-menu>
        <el-menu-item index="1">
          <el-icon>
            <edit></edit>
          </el-icon>
          <span>Navigator One</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span>Navigator Three</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>

export default {
  name: 'sidebar',
  components: {
    
  },
  data() {
    return {
      
    }
  },

  mounted() {
    
  },

  methods: {
    
  },
};
</script>

<style lang="scss">

</style>
