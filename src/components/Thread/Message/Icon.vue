<template>
  <span v-if="officeMode">{{ alt }}</span>
  <img :src="`https://web.hkgolden.com${src}`" :alt="alt" v-else />
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['src', 'alt'],
  computed: {
    ...mapState({
      officeMode: state => state.app.officeMode,
    }),
  },
}
</script>
