<template>
  <el-container direction="vertical">
    <el-row :span="24">
      <el-col :span="24">
        <pageheader></pageheader>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <mainpage class="mainpage"></mainpage>
      </el-col>
    </el-row>

  
    <pagefooter class="footer"></pagefooter>
  </el-container>
</template>

<script>
import pageheader from './views/Header.vue';
import mainpage from './views/MainPage.vue';
import pagefooter from './views/Footer.vue';
export default {
  name: 'NazoMusicApp',
  components: {
    pageheader,
    mainpage,
    pagefooter,
  },
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
.header {
  position: relative;
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  width: 100%;
  height: 50px;
}
.mainpage{
  background-color: #b3c0d1;
  height: 70%;
  position: sticky;
  bottom: 0;
}
.footer{
  position: absolute;
  bottom: 0;
  background-color: #b3c0d1;
  height: 10%;
  width: 100%;
}
</style>
