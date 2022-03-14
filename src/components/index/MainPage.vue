<template>
<div class="mainpage">
  <div class="sidebar">
    <ul>
      <li>
          <router-link to="/">我的首页</router-link>
      </li>
      <li>
          <router-link to="/songlists">发现歌单</router-link>
      </li>
      <li>
          <router-link to="/newmusic">最新音乐</router-link>
      </li>
      <li>
          <router-link to="/musicvideo">音乐视频</router-link>
      </li>
    </ul>
  </div>

  <div class="content">
    <el-scrollbar style="height:100%">
      <router-view></router-view>
    </el-scrollbar>
  </div>
</div>
  
</template>

<script>
export default {
  name: 'MainPage',
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
  .sidebar {
    margin: 0;
    padding: 0;
    width: 200px;
    min-width: 200px;
    background-color: rgb(121, 139, 154);
    text-align: center;
    border-right: 1px solid #ededed;
  }
  .sidebar ul {
    list-style: none;
    margin-top: 0;
    padding-left: 0;
  }
  .sidebar ul li {
    text-align: left;
    cursor: pointer;
    letter-spacing: .3rem;
    height: 60px;
    line-height: 60px;
    width: 100%;
    display: flex;
  }
  .sidebar li:hover {
    background-color: #ededed;
  }

  .sidebar a::before {
    content: '';
    margin-right: 10px;
  }

  .sidebar a {
    text-decoration: none;
    color: rgb(138, 71, 71);
    display: block;
    width: 100%;
    height: 100%;
    font-size: 18px;
    padding-left: 30px; 
    text-align: left;  
  }

  .mainpage{
    display: flex;
    background-color: rgba(123, 94, 94, 0.824);
  }
  .content{
    margin: 0px;
    width:100%;
  }
</style>
