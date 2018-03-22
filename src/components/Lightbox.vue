<template>
  <transition name="lightbox">
    <div class="lightbox" @click.self="handleCloseClick">
      <button class="action close" @click="handleCloseClick">
        <span class="icon-x"></span>
      </button>

      <button class="action prev" @click="handleNavigation(-1)" v-if="hasPrev">
        <span class="icon-chevron-left"></span>
      </button>
      <button class="action next" @click="handleNavigation(1)" v-if="hasNext">
        <span class="icon-chevron-right"></span>
      </button>

      <transition :name="transitionName" mode="out-in">
        <a :key="media.url" class="image-link" :href="media.url" target="_blank" :class="{'is-loaded': imageLoaded, 'is-error': imageError}">
          <div class="error" v-if="imageError"></div>
          <img :src="media.url" :alt="media.url" class="image" @load="imageLoaded = true" @error="imageError = true">
        </a>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: ['mediaIndex'],
  data() {
    return {
      transitionName: 'next',
      imageLoaded: false,
      imageError: false,
    }
  },
  computed: {
    ...mapState({
      mediaList: state => state.thread.mediaList,
    }),
    media() {
      return this.mediaList[this.mediaIndex]
    },
    hasPrev() {
      return this.mediaIndex > 0
    },
    hasNext() {
      return this.mediaIndex + 1 !== this.mediaList.length
    },

  },
  methods: {
    ...mapMutations({
      setMediaIndex: 'SET_MEDIA_INDEX',
    }),
    handleCloseClick() {
      this.setMediaIndex(null)
    },
    handleKeyDown(event) {
      switch (event.keyCode) {
        case 27:
        case 40:
          event.preventDefault()
          this.handleCloseClick()
          break
        case 37:
          if (!this.hasPrev) return
          this.handleNavigation(-1)
          break
        case 39:
          if (!this.hasNext) return
          this.handleNavigation(1)
          break
        default:
      }
    },
    handleNavigation(step) {
      this.setMediaIndex(this.mediaIndex + step)
    },
  },
  watch: {
    mediaIndex(newVal, oldVal) {
      this.imageLoaded = false
      this.imageError = false
      this.transitionName = newVal < oldVal ? 'prev' : 'next'
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
  },
}
</script>

<style lang="scss" scoped>
.lightbox {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(#000, 0.9);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  transition: all 0.3s ease;
  will-change: opacity, transform;

  .image {
    opacity: 0;
    height: 0;
    width: 0;
    max-width: 80vw;
    max-height: 80vh;

    .is-mobile & {
      max-width: 100vw;
      max-height: 90vh;
    }
  }

  .image-link {
    transition: all 0.2s ease;
    will-change: opacity, transform;

    &.is-loaded {
      img {
        opacity: 1;
        height: auto;
        width: auto;
      }
    }

    &.is-error {
      img {
        display: none;
      }
    }
  }
}

.action {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0;
  background: rgba(#000, 0.1);
  height: 3rem;
  width: 3rem;
  padding: 10px;
  cursor: pointer;
  text-decoration: none;
  outline: 0;
  font-size: 1.5rem;
  color: rgba(#fff, 0.8);
  z-index: 1;

  .is-hoverable &:hover {
    color: #1ecd97;
  }

  .is-hoverable.night-mode &:hover {
    color: #42b983;
  }
}

.close {
  border-radius: 50%;
  top: 1rem;
  right: 1rem;
}

.prev,
.next {
  top: 50%;
  transform: translateY(-50%);
}

.prev {
  left: 1rem;

  .is-mobile & {
    left: 0;
  }
}

.next {
  right: 1rem;

  .is-mobile & {
    right: 0;
  }
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

.lightbox-enter,
.lightbox-leave-active {
  opacity: 0;
}

.lightbox-enter .image-link,
.lightbox-leave-active .image-link {
  transform: translate3d(0, 1.5rem, 0);
}

.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: all 0.2s ease;
}
.next-enter {
  opacity: 0;
  transform: translate3d(1.5rem, 0, 0);
}
.next-leave-to {
  opacity: 0;
  transform: translate3d(-1.5rem, 0, 0);
}
.prev-enter {
  opacity: 0;
  transform: translate3d(-1.5rem, 0, 0);
}
.prev-leave-to {
  opacity: 0;
  transform: translate3d(1.5rem, 0, 0);
}
</style>
