<template>
  <div v-if="isYoutube && youtubePreview">
    <YoutubePlayer
      :video-id="linkInfo.videoId"
      :start="linkInfo.start"
    />
    <a :href="href" target="_blank">
      <slot></slot>
    </a>
  </div>

  <LIHKGPreview :thread-id="linkInfo.threadId" :href="href" v-else-if="isLihkg" />

  <a :href="href" target="_blank" v-else>
    <slot></slot>
  </a>
</template>

<script>
import { mapState } from 'vuex'
import YoutubePlayer from './YoutubePlayer'
import LIHKGPreview from './LIHKGPreview'
import helper from '@/helper'

export default {
  props: ['href'],
  components: {
    YoutubePlayer,
    LIHKGPreview,
  },
  data() {
    return {
      isYoutube: false,
      isLihkg: false,
      linkInfo: {},
    }
  },
  computed: {
    ...mapState({
      youtubePreview: state => state.app.youtubePreview,
    }),
  },
  beforeMount() {
    const ytMatches = this.href.match(helper.ytRegex)
    const isYoutube = ytMatches && ytMatches[1]
    this.isYoutube = isYoutube
    if (isYoutube) {
      const videoId = ytMatches && ytMatches[1]
      const start = ytMatches && ytMatches[2] ? helper.parseDuration(ytMatches[2].toLowerCase()) : 0
      this.linkInfo = { videoId, start }
      return
    }

    const lihkgMatches = this.href.match(helper.lihkgRegex)
    const isLihkg = lihkgMatches && lihkgMatches[1]
    this.isLihkg = isLihkg
    if (isLihkg) {
      const threadId = lihkgMatches && lihkgMatches[1]
      this.linkInfo = { threadId }
    }
  },
}
</script>
