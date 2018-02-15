<template>
  <div v-if="linkInfo.isYoutube && youtubePreview">
    <YoutubePlayer
      :video-id="linkInfo.videoId"
      :start="linkInfo.start"
    />
    <a :href="href" target="_blank">
      <slot></slot>
    </a>
  </div>
  <a :href="href" target="_blank" v-else>
    <slot></slot>
  </a>
</template>

<script>
import { mapState } from 'vuex'
import YoutubePlayer from './YoutubePlayer'
import helper from '@/helper'

function parseDuration(duration) {
  const matches = duration.match(/[0-9]+[hms]/g)
  let seconds = 0

  if (!matches) {
    return duration
  }

  matches.forEach(part => {
    const unit = part.charAt(part.length - 1)
    const amount = parseInt(part.slice(0, -1), 10)

    switch (unit) {
      case 'h':
        seconds += amount * 60 * 60
        break
      case 'm':
        seconds += amount * 60
        break
      case 's':
        seconds += amount
        break
      default:
      // noop
    }
  })

  return seconds
}

export default {
  props: ['href'],
  components: {
    YoutubePlayer,
  },
  computed: {
    ...mapState({
      youtubePreview: state => state.app.youtubePreview,
    }),
    linkInfo() {
      const matches = this.href.match(helper.ytRegex)
      const isYoutube = matches && matches[1]
      const videoId = matches && matches[1]
      const start =
        matches && matches[2] ? parseDuration(matches[2].toLowerCase()) : 0

      return { isYoutube, videoId, start }
    },
  },
}
</script>
