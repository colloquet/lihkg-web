<template>
  <div class="container" :class="{'is-open': isOpen}">
    <div
      class="overlay"
      :class="{'is-pressed': isPressed}"
      @click="hideDrawer"
      :style="`opacity: ${this.opacity}`"
    ></div>

    <div
      ref="drawer"
      class="drawer"
      :class="{'is-pressed': isPressed}"
      :style="`left: ${this.xPos}`"
    >
      <div class="header">
        <span class="brand">
          LIHKG
        </span>
        <a href="https://github.com/colloquet/lihkg-web" target="_blank" rel="noopener" class="github-link">
          <span class="icon-github"></span>
        </a>
      </div>
      <div
        class="section"
        :key="section"
        v-for="(categories, section) in categoryList"
      >
        <span class="title" v-if="section">{{ section }}</span>
        <ul class="submenu">
          <li v-for="category in categories" :key="category.cat_id">
            <a
              :class="{'is-active': category.cat_id === activeCategoryId}"
              :href="`/category/${category.cat_id}`"
              @click.prevent="handleLinkClick"
            >
              {{ category.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import helper from '@/helper'

export default {
  name: 'Drawer',
  data: () => ({
    categoryList: helper.categoryList,
    deltaX: 0,
    isPressed: false,
  }),
  computed: {
    ...mapState({
      isOpen: state => state.ui.showDrawer,
      activeCategoryId: state => state.category.category.cat_id,
      isSwipeDisabled: state => state.thread.mediaList !== null || state.thread.mediaIndex !== null,
    }),
    xPos() {
      return this.isOpen
        ? `${Math.min(Math.max(this.deltaX, -200), 0)}px`
        : `${Math.min(Math.max(this.deltaX, 0), 200) - 200}px`
    },
    opacity() {
      return this.isOpen ? 1 : this.deltaX / 200
    },
  },
  methods: {
    ...mapMutations({
      openDrawer: 'OPEN_DRAWER',
      hideDrawer: 'HIDE_DRAWER',
    }),
    handleLinkClick(event) {
      setTimeout(() => {
        this.$router.push(event.target.pathname)
      }, 200)
      this.hideDrawer()
    },
    handleTouchStart({ touches }) {
      // prevent overlap with iOS swipe back gesture
      const startDistance = helper.isIOS() ? 50 : 20
      if (event.touches[0].pageX < startDistance || this.isSwipeDisabled) return
      this.downX = touches[0].pageX
      this.downY = touches[0].pageY
      this.isPressed = true
    },
    handleTouchMove(event) {
      if (!this.isPressed) return
      const inDrawer = this.$refs.drawer.contains(event.target)
      const deltaX = event.touches[0].pageX - this.downX
      const deltaY = event.touches[0].pageY - this.downY
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX > 10 || absY > 10) {
        const willOpen = absX > absY
        this.direction = this.direction || (willOpen ? 'x' : 'y')

        if (this.direction === 'x' && ((!this.isOpen && deltaX > 0) || (this.isOpen && deltaX < 0))) {
          event.preventDefault()
          this.deltaX = deltaX
        } else if (this.direction === 'y') {
          if (this.isOpen && !inDrawer) {
            event.preventDefault()
          }
        }
      }
    },
    handleTouchEnd() {
      if (this.deltaX > 60) {
        this.openDrawer()
        helper.trackEvent({
          eventCategory: 'Drawer',
          eventAction: 'swipe',
          eventLabel: 'Open',
        })
      } else if (this.deltaX < -40) {
        this.hideDrawer()
        helper.trackEvent({
          eventCategory: 'Drawer',
          eventAction: 'swipe',
          eventLabel: 'Close',
        })
      }
      this.isPressed = false
      this.downX = null
      this.direction = null
      this.deltaX = 0
    },
  },
  mounted() {
    window.addEventListener('touchstart', this.handleTouchStart)
    window.addEventListener('touchmove', this.handleTouchMove)
    window.addEventListener('touchend', this.handleTouchEnd)
  },
  beforeDestroy() {
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('touchend', this.handleTouchEnd)
  },
}
</script>

<style lang="scss" scoped>
.is-pressed {
  transition: none !important;
}

.container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  transition: all .3s ease;
  pointer-events: none;

  &.is-open {
    pointer-events: auto;
  }
}

.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(#000, .5);
  transition: opacity .3s ease;
  z-index: 1;
  will-change: opacity;
}

.drawer {
  position: absolute;
  background: #fff;
  padding: 1rem .5rem 3rem;
  padding-bottom: calc(3rem + constant(safe-area-inset-bottom));
  padding-bottom: calc(3rem + env(safe-area-inset-bottom));
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  transition: left .2s ease;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 2;
  will-change: left;

  .night-mode & {
    background: #222;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

.header {
  display: flex;
  padding-left: 1rem;
  margin-bottom: 1rem;
}

.brand {
  letter-spacing: 6px;
  font-weight: 100;
}

.github-link {
  padding: 1rem;
  color: #1ecd97;
  margin-top: -1rem;
  margin-bottom: -1rem;

  .night-mode & {
    color: #42b983;
  }
}

.section {
  margin-bottom: 1rem;
}

.title {
  display: block;
  padding-left: 1rem;
  margin-bottom: 1rem;
  color: #aaa;
  font-size: 14px;

  .night-mode & {
    color: #888;
  }
}

.submenu {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    flex-shrink: 0;
    width: 50%;
    margin-bottom: .5rem;
    padding-left: .5rem;

    a {
      position: relative;
      display: inline-block;
      border-radius: 4px;
      padding: 5px;
      color: inherit;
      text-decoration: none;

      &.is-active {
        color: #1ecd97;

        .night-mode & {
          color: #42b983;
        }
      }

      .is-hoverable &:hover {
        background: #f5f5f5;
      }

      .is-hoverable.night-mode &:hover {
        background: #333;
      }
    }
  }
}

.drawer-enter,
.drawer-leave-active {
  .drawer {
    transform: translateX(-100%);
  }

  .drawer-overlay {
    opacity: 0;
  }
}
</style>
