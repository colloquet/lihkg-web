<template>
  <div class="yt-outer">
    <div class="yt-inner" @click="playVideo">
      <img src="../../../assets/youtube-play.png" alt="Play" class="yt-play-button" v-if="!isReady">
      <div
        class="yt-spacer"
        :style="isReady ? '' : `background-image: url(${`https://img.youtube.com/vi/${videoId}/0.jpg`})`"
      >
        <div ref="iframe" class="iframe"></div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from '@/helper'

export default {
  name: 'YoutubePlayer',
  props: ['videoId', 'start'],
  data() {
    return {
      isReady: false,
    }
  },
  methods: {
    playVideo() {
      this.player = new window.YT.Player(this.$refs.iframe, {
        height: '390',
        width: '640',
        videoId: this.videoId,
        startSeconds: this.start,
        playerVars: {
          rel: 0,
        },
        events: {
          onReady: event => {
            this.isReady = true
            event.target.playVideo()
          },
        },
      })
    },
  },
  mounted() {
    helper.initYoutube()
  },
}
</script>

<style lang="scss">
.yt-outer {
  margin: 0.25rem 0;
}

.yt-inner {
  display: inline-block;
  position: relative;
  width: 100%;
  max-width: 500px;
  cursor: pointer;
  overflow: hidden;
}

.yt-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.yt-spacer {
  position: relative;
  padding-bottom: 56.25%;
  background-size: cover;
  background-position: center;
  z-index: 1;

  > iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
