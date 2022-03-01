<template>
  <el-header>
    <el-input
      class="w-50 m-2"
      placeholder="Please Input"
      :suffix-icon="Search"
    />
  </el-header>
</template>

<script>
export default {
  name: 'pageheader',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    
  },
};
</script>

<style lang="scss">
  .layout-container-demo .el-header {
    position: relative;
    background-color: #b3c0d1;
    color: var(--el-text-color-primary);
  }
</style>
