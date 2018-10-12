<template>
  <div class="bottom-bar">
    <div class="wrapper">
      <div class="item">
        <button class="action" @click="handleDrawerClick">
          <span class="icon-menu"></span>
        </button>
      </div>

      <template v-if="inCatView">
        <div class="item">
          <button class="action" @click="handleReloadClick">
            <span class="icon-refresh-ccw"></span>
          </button>
        </div>
        <div class="item">
          <button class="action" @click="handleSettingsClick">
            <span class="icon-settings"></span>
          </button>
        </div>
      </template>

      <template v-if="inThreadView">
        <div class="item score">
          <span class="icon-thumbs-up"></span> <small>{{ thread.like_count || '-' }}</small>
        </div>
        <div class="item score">
          <span class="icon-thumbs-down"></span> <small>{{ thread.dislike_count || '-' }}</small>
        </div>
        <div class="item">
          <button class="action" @click="handleMediaModeClick">
            <span class="icon-image"></span>
          </button>
        </div>
        <div class="item">
          <button
            class="action"
            :class="{'is-active': $route.query.order === 'score'}"
            @click="handleHotReplyClick"
          >
            <span class="icon-trending-up"></span>
          </button>
        </div>
        <div class="item">
          <button class="action" :class="{ 'is-active': isBookmarked }" @click="handleBookmark" title="本地留名">
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
        </div>
        <div class="item">
          <button class="action" @click="handleScrollBottom">
            <span class="icon-chevrons-down"></span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import helper from '@/helper'

export default {
  computed: {
    ...mapState({
      thread: state => state.thread.thread,
      category: state => state.category.category,
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
  },
  methods: {
    ...mapActions(['fetchThreadList', 'fetchMediaList']),
    ...mapMutations({
      toggleDrawer: 'TOGGLE_DRAWER',
      toggleSettingsModal: 'TOGGLE_SETTINGS_MODAL',
      setThreadList: 'SET_THREAD_LIST',
      toggleGallery: 'TOGGLE_GALLERY',
      addBookmark: 'ADD_BOOKMARK',
      removeBookmark: 'REMOVE_BOOKMARK',
    }),
    handleDrawerClick() {
      helper.trackEvent({
        eventCategory: 'BottomBar',
        eventAction: 'click',
        eventLabel: 'Drawer',
      })
      this.toggleDrawer()
    },
    async handleReloadClick() {
      helper.trackEvent({
        eventCategory: 'BottomBar',
        eventAction: 'click',
        eventLabel: 'F5',
      })
      this.setThreadList([])
      await this.fetchThreadList({ catId: this.category.cat_id })
      window.scrollTo(0, 0)
    },
    handleSettingsClick() {
      helper.trackEvent({
        eventCategory: 'BottomBar',
        eventAction: 'click',
        eventLabel: 'Settings',
      })
      this.toggleSettingsModal()
    },
    handleScrollBottom() {
      helper.trackEvent({
        eventCategory: 'BottomBar',
        eventAction: 'click',
        eventLabel: 'Scroll to bottom',
      })
      window.scrollTo(0, document.body.scrollHeight)
    },
    handleMediaModeClick() {
      helper.trackEvent({
        eventCategory: 'BottomBar',
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
        eventCategory: 'BottomBar',
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
  },
}
</script>

<style lang="scss" scoped>
$bottom-bar-height: 3rem;

.bottom-bar {
  box-sizing: content-box;
  position: fixed;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  bottom: 0;
  left: 0;
  width: 100%;
  height: $bottom-bar-height;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 2;

  .night-mode & {
    background: #282828;
  }
}

.wrapper {
  box-sizing: border-box;
  display: flex;
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 0 15px;
  height: $bottom-bar-height;
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
    background: #f5f5f5;
  }

  .is-hoverable.night-mode &:hover {
    background: darken(#1b1b1b, 5%);
  }
}

.item {
  flex: 1;
  height: $bottom-bar-height;
  line-height: $bottom-bar-height;
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

.action {
  width: 100%;
  height: $bottom-bar-height;
  line-height: $bottom-bar-height;
}
</style>
