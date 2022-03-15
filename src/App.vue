<template>
  <el-container direction="vertical">
    <PageHeader></PageHeader>
    <MainPage class="mainpage"></MainPage>
    <PageFooter class="footer"></PageFooter>
  </el-container>
</template>

<script lang="ts">
import PageHeader from './components/index/PageHeader.vue';
import MainPage from './components/index/MainPage.vue';
import PageFooter from './components/index/Footer.vue';
export default {
  name: 'NazoMusicApp',
  components: {
    PageHeader,
    MainPage,
    PageFooter,
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
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

html, body{
  margin:0;
  height:100%;
}

.header {
  position: relative;
  align-items: center;
  background-color: rgb(240, 214, 214);
  padding: 0 30px;
}

.mainpage{
  position: fixed;
  top: 60px;
  bottom: 60px;
  width: 100%;
}
.footer{
  position: fixed;
  bottom: 0;
  background-color: #b3c0d1;
  height: 60px;
  width: 100%;
}
</style>
