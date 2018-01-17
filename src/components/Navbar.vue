<template>
  <headroom
    :disabled="!isMobile || tempDisable"
    :z-index="3"
    :up-tolerance="10"
    :down-tolerance="10"
    :offset="50"
  >
    <div class="navbar" :class="{'has-menu': showDrawer}">
      <div class="container">
        <div class="wrapper">
          <div class="left">
            <button class="action" @click="handleNavMenuClick" v-if="!isMobile">
              <span :class="showDrawer ? 'icon-x' : 'icon-menu'"></span>
            </button>

            <template v-if="inThreadView">
              <button class="action" @click="handleBackClick" v-if="inThreadView">
                <span class="icon-arrow-left"></span>
              </button>
            </template>
          </div>

          <div class="center">
            <div @click="scrollToTop">
              <span v-if="inThreadView" :title="thread.title">{{ thread.title || 'LIHKG' }}</span>
              <span v-else>{{ category.name || 'LIHKG' }}</span>
            </div>
          </div>

          <div class="right">
            <template v-if="inCatView && !isMobile">
              <a class="action" href="https://github.com/colloquet/lihkg-web" target="_blank">
                <span class="icon-github"></span>
              </a>
              <button class="action" @click="handleReloadClick" title="F5">
                <span class="icon-refresh-ccw"></span>
              </button>
            </template>

            <template v-if="inThreadView && !isMobile">
              <div class="item score">
                <span class="icon-thumbs-up"></span> <small>{{ thread.like_count || '-' }}</small>
              </div>
              <div class="item score">
                <span class="icon-thumbs-down"></span> <small>{{ thread.dislike_count || '-' }}</small>
              </div>
              <button class="action" @click="handleMediaModeClick" v-if="!isMobile" title="圖片模式">
                <span class="icon-image"></span>
              </button>
              <button
                class="action"
                :class="{'is-active': $route.query.order === 'score'}"
                @click="handleHotReplyClick"
                v-if="!isMobile"
                title="熱門回覆"
              >
                <span class="icon-trending-up"></span>
              </button>
            </template>

            <button class="action" @click="handleSettingsClick" v-if="!isMobile" title="設定">
              <span class="icon-settings"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </headroom>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { headroom } from 'vue-headroom'
import helper from '@/helper'

export default {
  name: 'Navbar',
  components: {
    headroom,
  },
  data: () => ({
    tempDisable: false,
  }),
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile,
      showDrawer: state => state.ui.showDrawer,
      category: state => state.category.category,
      thread: state => state.thread.thread,
      relatedCatId: state => state.thread.thread.cat_id || 1,
    }),
    inThreadView() {
      return this.$route.name === 'ThreadView'
    },
    inCatView() {
      return this.$route.name === 'CategoryView'
    },
  },
  methods: {
    ...mapActions(['fetchThreadList', 'fetchMediaList']),
    ...mapMutations({
      toggleDrawer: 'TOGGLE_DRAWER',
      toggleSettingsModal: 'TOGGLE_SETTINGS_MODAL',
      setThreadList: 'SET_THREAD_LIST',
    }),
    async handleReloadClick() {
      helper.trackEvent({
        eventCategory: 'Navbar',
        eventAction: 'click',
        eventLabel: 'F5',
      })
      this.setThreadList([])
      await this.fetchThreadList({ catId: this.category.cat_id })
      window.scrollTo(0, 0)
    },
    handleNavMenuClick() {
      helper.trackEvent({
        eventCategory: 'Navbar',
        eventAction: 'click',
        eventLabel: 'Drawer',
      })
      this.toggleDrawer()
    },
    handleSettingsClick() {
      helper.trackEvent({
        eventCategory: 'Navbar',
        eventAction: 'click',
        eventLabel: 'Settings',
      })
      this.toggleSettingsModal()
    },
    handleBackClick() {
      helper.trackEvent({
        eventCategory: 'Navbar',
        eventAction: 'click',
        eventLabel: 'Back',
      })
      if (this.category.cat_id) {
        window.history.back()
      } else {
        this.$router.push(`/category/${this.relatedCatId}`)
      }
    },
    handleMediaModeClick() {
      helper.trackEvent({
        eventCategory: 'Navbar',
        eventAction: 'click',
        eventLabel: 'Media',
      })
      this.fetchMediaList({ threadId: this.thread.thread_id, openGallery: true })
    },
    handleHotReplyClick() {
      helper.trackEvent({
        eventCategory: 'Navbar',
        eventAction: 'click',
        eventLabel: 'Hot Reply',
      })
      if (this.$route.query.order === 'score') {
        this.$router.replace({ query: null })
      } else {
        this.$router.replace({ query: { order: 'score' } })
      }
    },
    scrollToTop() {
      const c = document.documentElement.scrollTop || document.body.scrollTop
      if (c > 0) {
        window.requestAnimationFrame(this.scrollToTop)
        window.scrollTo(0, c - (c / 8))
      }
    },
  },
  watch: {
    $route(to, from) {
      if (to.name === 'ThreadView' && from.name === 'CategoryView') {
        this.tempDisable = true

        setTimeout(() => {
          this.tempDisable = false
        }, 500)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$navbar-height: 3rem;

.navbar {
  display: flex;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, .05);
  height: $navbar-height;
  line-height: $navbar-height;
  transition: box-shadow .45s ease;
  z-index: 3;

  .night-mode & {
    background: #1b1b1b;
  }

  &.has-menu {
    box-shadow: none;
  }
}

.container {
  max-width: 60rem;
  width: 100%;
  margin: 0 auto;
}

.action {
  display: inline-block;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 0 1rem;
  height: $navbar-height;
  line-height: $navbar-height;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  outline: 0;

  &.is-active {
    color: #1ecd97;

    .night-mode & {
      color: #42b983;
    }
  }

  .is-hoverable &:hover {
    color: #1ecd97;
  }

  .is-hoverable.night-mode &:hover {
    color: #42b983;
  }
}

.item {
  padding: 0 1rem;
  height: $navbar-height;
  line-height: $navbar-height;
  color: inherit;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  small {
    margin-top: .25rem;
    line-height: 1;
    font-size: .75rem;
  }
}

.wrapper {
  display: flex;
}

.left {
  display: flex;
  flex: 1 9999 0%;
}

.center {
  flex: 0 1 auto;
  overflow: hidden;

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.right {
  display: flex;
  flex: 1 0 0%;
  justify-content: flex-end;
}

.category {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.thread {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>
