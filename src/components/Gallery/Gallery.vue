<template>
  <transition
    name="gallery"
    @before-enter="onBeforeEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
  >
    <div class="gallery" @click.self="handleCloseClick">
      <nav class="nav">
        <div class="container">
          <div class="wrapper">
            <span class="item"><span class="icon-image"></span> 媒體模式</span>

            <button class="action" @click="handleCloseClick">
              <span class="icon-x"></span>
            </button>
          </div>
        </div>
      </nav>

      <div ref="body" class="body" @click.self="handleCloseClick">
        <div class="container" @click.self="handleCloseClick">
          <div class="grid" @click.self="handleCloseClick">
            <div class="grid-item" :key="media.url" v-for="(media, index) in mediaList">
              <Media :media="media" @click="handleMediaClick(index)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import Media from './Media'

export default {
  props: ['mediaList'],
  components: {
    Media,
  },
  data() {
    return {
      isListened: false,
    }
  },
  computed: {
    ...mapState({
      mediaIndex: state => state.thread.mediaIndex,
      imageProxy: state => state.app.imageProxy,
    }),
  },
  methods: {
    ...mapMutations({
      toggleGallery: 'TOGGLE_GALLERY',
      setMediaIndex: 'SET_MEDIA_INDEX',
    }),
    onBeforeEnter() {
      this.scrollPos = window.pageYOffset
    },
    onAfterEnter() {
      this.$nextTick(() => {
        document.getElementById('route-container').style.display = 'none'
      })
    },
    onBeforeLeave() {
      document.getElementById('route-container').style.display = null
      window.scrollTo(0, this.scrollPos)
    },
    handleCloseClick() {
      this.toggleGallery()
    },
    handleMediaClick(index) {
      this.setMediaIndex(index)
    },
    handleKeyDown(event) {
      if (event.keyCode === 27) {
        this.handleCloseClick()
      }
    },
    handleAddKeyListener() {
      window.addEventListener('keydown', this.handleKeyDown)
      this.isListened = true
    },
    handleRemoveKeyListener() {
      window.removeEventListener('keydown', this.handleKeyDown)
      this.isListened = false
    },
  },
  watch: {
    mediaIndex(index) {
      if (index !== null && this.isListened) {
        this.handleRemoveKeyListener()
      } else if (index === null && !this.isListened) {
        this.handleAddKeyListener()
      }
    },
  },
  mounted() {
    this.handleAddKeyListener()
  },
  beforeDestroy() {
    this.handleRemoveKeyListener()
  },
}
</script>


<style lang="scss" scoped>
$navbar-height: 3rem;

.gallery {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: #fff;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  transition: all 0.3s ease;
  will-change: opacity, transform;

  .night-mode & {
    background: #202020;
  }
}

.container {
  max-width: 60rem;
  width: 100%;
  margin: 0 auto;
}

.nav {
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  height: $navbar-height;
  line-height: $navbar-height;
  z-index: 3;

  .night-mode & {
    background: #1b1b1b;
  }

  .wrapper {
    display: flex;
    justify-content: space-between;
  }

  .item,
  .action {
    display: inline-block;
    padding: 0 1rem;
    height: $navbar-height;
    line-height: $navbar-height;
    color: inherit;
  }

  .action {
    border: 0;
    border-radius: 0;
    background: transparent;
    cursor: pointer;
    text-decoration: none;
    outline: 0;

    .is-hoverable &:hover {
      color: #1ecd97;
    }

    .is-hoverable.night-mode &:hover {
      color: #42b983;
    }
  }
}

.body {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  margin-left: -3px;

  .grid-item {
    flex-basis: 20%;
    padding-left: 3px;
    margin-bottom: 3px;

    .is-mobile & {
      flex-basis: 33.33%;
    }
  }
}

.gallery-enter,
.gallery-leave-active {
  opacity: 0;
}

.gallery-enter,
.gallery-leave-active {
  transform: translate3d(0, 1.5rem, 0);
}
</style>
