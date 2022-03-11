<template>
  <div class="new-music" v-loading="loading">
    <div class="new-music-table">
      <el-table :data="tableData" stripe @row-dblclick="play">
        <el-table-column prop="id" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="artists" label="Artist" />
        <el-table-column prop="album" label="Album" />
        <el-table-column prop="duration" label="Duration" />
      </el-table>
    </div>
  </div>
  
</template>

<script lang="ts">
import { useNewMusic } from '@/components/NewMusic/NewMusic'

export default {
  name: 'NewMusic',
  setup() {
    const { init, play, loading, tableData } = useNewMusic()
    init()
    return {
      play,
      loading,
      tableData
    }
  },
  created(){

  },
  data() {
    return {
      
    }
  },
  methods: {
    
  },
}
</script>

<style>
  .new-music {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;
  }

  .new-music >>> .el-loading-spinner {
    top: 50%;
  }

  .new-music-table {
    width: 100%;
  }
</style>