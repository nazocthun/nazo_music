<template>
  <div>
    <PlayControl  :musicUrl="globalMusicUrl" @timeupdate="updateTime" @play="playStatus" @pause="pauseStatus" @next="next" @prev="prev" @end="next"></PlayControl>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlayControl from '@/components/index/PlayControl/PlayControl.vue'
export default {
  name: 'PageFooter',
  components: {
    PlayControl,
  },
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState(['globalMusicUrl', 'globalMusicInfo', 'musicQueue', 'nowIndex', 'queueStyle']),
  },
  mounted() {
    this.$store.state.globalMusicUrl = 'http://m2.music.126.net/hmZoNQaqzZALvVp0rE7faA==/0.mp3'
  },
  methods: {
    
  },
};
</script>

<style lang="scss">

</style>
