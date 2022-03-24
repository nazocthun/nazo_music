<template>
  <div class="header flex h-16 px-30">
    <h2 class="text-2xl text-orange-700 top-2.5 mr-10">
      Nazo Music
    </h2>
    <div class="btns">
      <div class="nav" @click="go(-1)">
        <el-icon><arrow-left /></el-icon>
      </div>
      <div class="nav" @click="go(1)">
        <el-icon><arrow-right /></el-icon> 
      </div>
      
    </div>
    <div class="serachbar">
      <el-input class="searchbox" placeholder="搜索"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()

function go(destnation: any) {
  router.go(destnation)
}

</script>

<style lang="scss">
  .btns {
    margin-right: auto;
    display: flex;
  }

  .btns .nav {
    height: 100%;
    font-size: 20px;
    color: rgb(0, 0, 0);
    border-radius: 50%;
    margin: 0 10px;
    padding: 9px 13px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .btns .nav:hover {
      background-color: rgba(255, 255, 255, 0.3);
  }

  .searchbox input {
    width: 200px;
    border-radius: 20px;
    box-shadow: none;
    outline: none;
    font-size: 14px;
    background-color: rgb(169, 123, 123);
    --el-input-hover-border-color: transparent;
    --el-input-focus-border-color: transparent;
    
  }

  .searchbar{
    margin: auto 8px auto auto ;
    box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, 1);
  }
</style>
