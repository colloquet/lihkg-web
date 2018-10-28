<template>
  <div class="container" :class="{'is-open': isOpen}">
    <div
      class="overlay"
      :class="{'is-pressed': isPressed}"
      @click="hideDrawer"
      :style="`opacity: ${opacity}`"
    ></div>

    <div
      ref="drawer"
      class="drawer"
      :class="{'is-pressed': isPressed}"
      :style="`transform: translate3d(${xPos}px, 0, 0);`"
    >
      <div class="header">
        <span class="brand">
          LIHKG
        </span>
        <button class="action" @click="handleSettingsClick">
          <span class="icon-settings"></span>
        </button>
      </div>
      <div class="navigations">
        <a
          href="/bookmarks"
          class="nav-item"
          :class="{'is-active': threadListType === 'bookmarks'}"
          @click.prevent="handleLinkClick"
        >
          名已留
        </a>
      </div>
      <div
        class="section"
        :key="section.name"
        v-for="section in fixedCategoryList"
      >
        <span class="title">{{ section.name || '一般' }}</span>
        <ul class="submenu">
          <li v-for="category in section.cat_list" :key="category.cat_id">
            <a
              class="nav-item"
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

const DRAWER_WIDTH = 200

function isInTag(node, tag) {
  let parent = node
  while (parent.parentNode) {
    if (parent.nodeName.toLowerCase() === tag) {
      return true
    }
    parent = parent.parentNode
  }
  return false
}

export default {
  data() {
    return {
      deltaX: 0,
      isPressed: false,
    }
  },
  computed: {
    ...mapState({
      fixedCategoryList: state => state.category.fixedCategoryList,
      isOpen: state => state.ui.showDrawer,
      activeCategoryId: state => state.category.category.cat_id,
      threadListType: state => state.threadList.threadListType,
      isSwipeDisabled: state => state.thread.mediaList !== null || state.thread.mediaIndex !== null,
    }),
    xPos() {
      return this.isOpen
        ? Math.min(Math.max(this.deltaX, -DRAWER_WIDTH), 0)
        : Math.min(Math.max(this.deltaX, 0), DRAWER_WIDTH) - DRAWER_WIDTH
    },
    opacity() {
      return this.isOpen ? 1 : this.deltaX / DRAWER_WIDTH
    },
  },
  methods: {
    ...mapMutations({
      openDrawer: 'OPEN_DRAWER',
      hideDrawer: 'HIDE_DRAWER',
      toggleSettingsModal: 'TOGGLE_SETTINGS_MODAL',
    }),
    handleSettingsClick() {
      helper.trackEvent({
        eventCategory: 'Drawer',
        eventAction: 'click',
        eventLabel: 'Settings',
      })
      this.hideDrawer()
      this.toggleSettingsModal()
    },
    handleLinkClick(event) {
      setTimeout(() => {
        this.$router.push(event.target.pathname)
      }, 200)
      this.hideDrawer()
    },
    handleTouchStart(event) {
      const isScrollingCode =
        event.target.tagName.toLowerCase() === 'pre' || isInTag(event.target, 'pre')
      // prevent overlap with iOS swipe back gesture
      const startDistance = helper.isIOS() ? 50 : 20
      if (event.touches[0].pageX < startDistance || this.isSwipeDisabled || isScrollingCode) return
      this.downX = event.touches[0].pageX
      this.downY = event.touches[0].pageY
      this.isPressed = true
    },
    handleTouchMove(event) {
      if (!this.isPressed) return
      const inDrawer = this.$refs.drawer.contains(event.target)
      const deltaX = event.touches[0].pageX - this.downX
      const deltaY = event.touches[0].pageY - this.downY
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX > 5 || absY > 5) {
        const willOpen = absX / absY > 2.5
        this.direction = this.direction || (willOpen ? 'x' : 'y')

        if (
          this.direction === 'x' &&
          ((!this.isOpen && deltaX > 0) || (this.isOpen && deltaX < 0))
        ) {
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
  transition: all 0.3s ease;
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
  background-color: rgba(#000, 0.5);
  transition: opacity 0.3s ease;
  z-index: 1;
  will-change: opacity;
}

.drawer {
  position: absolute;
  background: #fff;
  padding: 1rem 0.5rem 3rem;
  padding-bottom: calc(3rem + constant(safe-area-inset-bottom));
  padding-bottom: calc(3rem + env(safe-area-inset-bottom));
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  transition: transform 0.2s ease;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 2;
  will-change: transform;

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
  justify-content: space-between;
  padding-left: 1rem;
  margin-bottom: 1rem;
}

.brand {
  letter-spacing: 6px;
  font-weight: 100;
}

.action {
  padding: 1rem;
  margin-top: -1rem;
  margin-bottom: -1rem;
  color: inherit;
  border: 0;
  border-radius: 0;
  background: transparent;
  cursor: pointer;
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

.navigations {
  padding-left: 0.5rem;
  margin-bottom: 1rem;
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
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
  }
}

.nav-item {
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

.drawer-enter,
.drawer-leave-active {
  .drawer {
    transform: translate3d(-100%, 0, 0);
  }

  .drawer-overlay {
    opacity: 0;
  }
}
</style>
