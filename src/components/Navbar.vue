<template>
  <TopAppBar :z-index="3" :disabled="!isMobile">
    <div class="navbar" :class="{'has-menu': showDrawer}">
      <div class="container">
        <div class="wrapper">
          <div class="left" :class="{'in-thread': inThreadView && !isMobile}">
            <button
              class="action"
              :class="{'is-active': showDrawer}"
              @click="handleNavMenuClick" v-if="!isMobile"
            >
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
              <span v-else>{{ threadListTitle }}</span>
            </div>
          </div>

          <div class="right">
            <template v-if="!inThreadView && !isMobile">
              <a href="https://github.com/colloquet/lihkg-web" target="_blank" rel="noopener"  class="action">
                <span class="icon-github"></span>
              </a>
              <button class="action" @click="handleReloadClick" title="F5">
                <span class="icon-refresh-ccw"></span>
              </button>
            </template>

            <template v-if="inThreadView && !isMobile">
              <button class="action bookmark" :class="{ 'is-active': isBookmarked }" @click="handleBookmark" v-if="!isMobile" title="本地留名">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  :fill="isBookmarked ? '#f6b701' : 'none'"
                  :stroke="isBookmarked ? '#f6b701' : 'currentColor'"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>
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
  </TopAppBar>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import helper from '@/helper'
import TopAppBar from './TopAppBar'

export default {
  components: {
    TopAppBar,
  },
  data() {
    return {
      tempDisable: false,
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile,
      showDrawer: state => state.ui.showDrawer,
      category: state => state.category.category,
      thread: state => state.thread.thread,
      threadListType: state => state.threadList.threadListType,
      relatedCatId: state => state.thread.thread.cat_id || 1,
      mediaList: state => state.thread.mediaList,
      bookmarks: state => state.app.bookmarks,
    }),
    inThreadView() {
      return this.$route.name === 'ThreadView'
    },
    inCatView() {
      return this.$route.name === 'CategoryView'
    },
    isBookmarked() {
      return this.bookmarks.includes(this.thread.thread_id)
    },
    threadListTitle() {
      return this.threadListType === 'bookmarks' ? '名已留' : this.category.name || 'LIHKG'
    },
  },
  methods: {
    ...mapActions(['fetchThreadList', 'fetchThreadListByIds', 'fetchMediaList']),
    ...mapMutations({
      toggleDrawer: 'TOGGLE_DRAWER',
      toggleSettingsModal: 'TOGGLE_SETTINGS_MODAL',
      setThreadList: 'SET_THREAD_LIST',
      toggleGallery: 'TOGGLE_GALLERY',
      addBookmark: 'ADD_BOOKMARK',
      removeBookmark: 'REMOVE_BOOKMARK',
    }),
    async handleReloadClick() {
      helper.trackEvent({
        eventCategory: 'Navbar',
        eventAction: 'click',
        eventLabel: 'F5',
      })
      this.setThreadList([])
      if (this.threadListType === 'bookmarks') {
        await this.fetchThreadListByIds({ threadIds: this.bookmarks })
      } else if (this.threadListType === 'category') {
        await this.fetchThreadList({ catId: this.category.cat_id })
      }
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
      if (this.threadListType) {
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
      if (this.mediaList) {
        // if already fetched, show immediately and fetch update in the background
        this.toggleGallery()
        this.fetchMediaList({
          threadId: this.thread.thread_id,
          openGallery: false,
          showProgress: false,
        })
      } else {
        this.fetchMediaList({
          threadId: this.thread.thread_id,
          openGallery: true,
        })
      }
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
    handleBookmark() {
      if (this.isBookmarked) {
        this.removeBookmark(this.thread.thread_id)
      } else {
        this.addBookmark(this.thread.thread_id)
      }
    },
    scrollToTop() {
      const c = document.documentElement.scrollTop || document.body.scrollTop
      if (c > 0) {
        window.requestAnimationFrame(this.scrollToTop)
        window.scrollTo(0, c - c / 8)
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: $navbar-height;
  line-height: $navbar-height;
  transition: box-shadow 0.45s ease;
  z-index: 3;

  .night-mode & {
    background: #282828;
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
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 0 1rem;
  height: $navbar-height;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  outline: 0;

  &.bookmark {
    display: flex;
  }

  &.is-active {
    color: #1ecd97;

    .night-mode & {
      color: #42b983;
    }
  }

  .is-hoverable &:hover {
    color: #1ecd97;

    &.bookmark {
      color: #f6b701;
    }
  }

  .is-hoverable.night-mode &:hover {
    color: #42b983;

    &.bookmark {
      color: #f6b701;
    }
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
    margin-top: 0.25rem;
    line-height: 1;
    font-size: 0.75rem;
  }
}

.wrapper {
  display: flex;
}

.left {
  display: flex;
  flex: 1 9999 0%;

  &.in-thread {
    flex-grow: 0;
  }
}

.center {
  flex: 0 1 auto;
  overflow: hidden;

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 1rem;

    .is-mobile & {
      padding: 0;
    }
  }
}

.right {
  display: flex;
  flex: 1 0 0%;
  justify-content: flex-end;
}
</style>
