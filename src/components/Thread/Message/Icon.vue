<template>
  <span v-if="officeMode">{{ code }}</span>
  <img :src="source" :alt="code" v-else />
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['src'],
  computed: {
    ...mapState({
      flattenIconMap: state => state.app.flattenIconMap,
      officeMode: state => state.app.officeMode,
      staticIcons: state => state.app.staticIcons,
    }),
    source() {
      return this.staticIcons
        ? this.src.replace('/faces/', '/faces_png/').replace('.gif', '.png')
        : this.src
    },
    code() {
      const uri = this.src.split('lihkg.com/')[1]
      return this.flattenIconMap[uri]
    },
  },
}
</script>
