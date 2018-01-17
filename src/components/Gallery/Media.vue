<template>
  <div
    class="container"
    v-lazy:background-image="this.src"
    @click="$emit('click')"
  ></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Media',
  props: ['media'],
  computed: {
    ...mapState({
      imageProxy: state => state.app.imageProxy,
    }),
    src() {
      return this.imageProxy ? `https://i.lihkg.com/200/${this.media.url}` : this.media.url
    },
  },
}
</script>


<style lang="scss" scoped>
.container {
  padding-bottom: 100%;
  background-color: #f5f5f5;
  background-size: cover;
  background-position: center;
  cursor: pointer;

  .night-mode & {
    background-color: #333;
  }
}
</style>
