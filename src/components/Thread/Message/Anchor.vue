<template>
  <div>
    <youtube-player
      v-if="linkInfo.isYoutube && youtubePreview"
      :video-id="linkInfo.videoId"
      :start="linkInfo.start"
    ></youtube-player>

    <a :href="href" target="_blank">
      <slot></slot>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import YoutubePlayer from './YoutubePlayer'

const regex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{10,12})(?:[&?#].*?)*?(?:[&?#]start|t=(\d+|[\dhm]+s))?$/

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
  name: 'Anchor',
  props: ['href'],
  components: {
    YoutubePlayer,
  },
  computed: {
    ...mapState({
      youtubePreview: state => state.app.youtubePreview,
    }),
    linkInfo() {
      const matches = this.href.match(regex)
      const isYoutube = matches && matches[1]
      const videoId = matches && matches[1]
      const start =
        matches && matches[2] ? parseDuration(matches[2].toLowerCase()) : 0

      return { isYoutube, videoId, start }
    },
  },
}
</script>
