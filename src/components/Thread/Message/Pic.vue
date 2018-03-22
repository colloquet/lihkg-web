<template>
  <lazy-component style="display: inline-block;">
    <template  v-if="autoLoadImage || showImage">
      <a :href="original" class="link" target="_blank" @click.prevent="handleImageClick">
        <img :src="this.src" class="lazy" :class="{loaded: loaded}" @load="onLoad" @error="onError" />
      </a>
      <div class="error" v-if="error"></div>
      <Loader v-else-if="!loaded" />
    </template>
    <img :src="placeholder" class="placeholder" @click="loadImage" v-else />
  </lazy-component>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import placeholder from '@/assets/image-placeholder.png'
import Loader from '../../Loader'

export default {
  props: ['src', 'original'],
  components: {
    Loader,
  },
  data() {
    return {
      placeholder,
      loaded: false,
      error: false,
      showImage: false,
    }
  },
  computed: {
    ...mapState({
      autoLoadImage: state => state.app.autoLoadImage,
      mediaList: state => state.thread.mediaList,
      threadId: state => state.thread.thread.thread_id,
    }),
    mediaIndex() {
      return this.mediaList ? this.mediaList.findIndex(media => media.url === this.original) : -1
    }
  },
  methods: {
    ...mapActions(['fetchMediaList']),
    ...mapMutations({
      setMediaIndex: 'SET_MEDIA_INDEX',
    }),
    async handleImageClick() {
      if (this.mediaIndex === -1) {
        await this.fetchMediaList({ threadId: this.threadId })
      }
      this.setMediaIndex(this.mediaIndex)
    },
    loadImage() {
      this.showImage = true
    },
    onLoad() {
      this.loaded = true
    },
    onError() {
      this.error = true
    },
  },
}
</script>

<style lang="scss" scoped>
.lazy {
  height: 0;
  width: 0;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.loaded {
  height: auto;
  width: auto;
  visibility: visible;
  opacity: 1;
}

.placeholder {
  cursor: pointer;
}

.link {
  display: inline-block;
  max-width: 500px;
}

.error {
  border: 1px solid;
  color: #1d2129;
  display: inline-block;
  height: 1.5rem;
  visibility: visible;
  width: 1.5rem;

  .night-mode & {
    color: #aaa;
  }
}
</style>
