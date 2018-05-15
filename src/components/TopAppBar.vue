<template>
  <div :class="$style.appBar" ref="appBar" :style="{ top: `${top}px`, zIndex }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    maxHeight: {
      type: Number,
      default: 64,
    },
    zIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      top: 0,
      lastScrollPosition: window ? window.scrollY : 0,
      topAppBarHeight: null,
      wasDocked: true,
      isDockedShowing: true,
      currentAppBarOffsetTop: 0,
      isCurrentlyBeingResized: false,
    }
  },
  methods: {
    checkForUpdate() {
      const offscreenBoundaryTop = -this.topAppBarHeight
      const hasAnyPixelsOffscreen = this.currentAppBarOffsetTop < 0
      const hasAnyPixelsOnscreen = this.currentAppBarOffsetTop > offscreenBoundaryTop
      const partiallyShowing = hasAnyPixelsOffscreen && hasAnyPixelsOnscreen

      if (partiallyShowing) {
        this.wasDocked = false
      } else {
        if (!this.wasDocked) {
          this.wasDocked = true
          return true
        } else if (this.isDockedShowing !== hasAnyPixelsOnscreen) {
          this.isDockedShowing = hasAnyPixelsOnscreen
          return true
        }
      }

      return partiallyShowing
    },
    moveTopAppBar() {
      if (this.checkForUpdate()) {
        let offset = this.currentAppBarOffsetTop
        if (Math.abs(offset) >= this.topAppBarHeight) {
          offset = -this.maxHeight
        }

        this.top = offset
      }
    },
    scrollHandler() {
      const currentScrollPosition = Math.max(window.scrollY, 0)
      const diff = currentScrollPosition - this.lastScrollPosition
      this.lastScrollPosition = currentScrollPosition

      if (!this.isCurrentlyBeingResized) {
        this.currentAppBarOffsetTop -= diff

        if (this.currentAppBarOffsetTop > 0) {
          this.currentAppBarOffsetTop = 0
        } else if (Math.abs(this.currentAppBarOffsetTop) > this.topAppBarHeight) {
          this.currentAppBarOffsetTop = -this.topAppBarHeight
        }

        this.moveTopAppBar()
      }
    },
  },
  mounted() {
    this.topAppBarHeight = this.$refs.appBar.clientHeight

    window.addEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHandler)
  },
}
</script>

<style module>
.appBar {
  position: fixed;
  width: 100%;
  z-index: 1;
}
</style>
