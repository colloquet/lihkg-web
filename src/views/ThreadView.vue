<template>
  <div class="threadview-container" v-if="thread.thread_id">
    <template v-for="(pageObj, pageNumber) in thread.pages">
      <ThreadNavigation
        :key="`${pageNumber}-header`"
        :thread-id="thread.thread_id"
        :page="+pageNumber"
        :total-page="thread.total_page"
        @navigate="fetchPage"
      />

      <Page
        :key="pageNumber"
        :page-obj="pageObj"
        :page-number="+pageNumber"
        :thread-id="thread.thread_id"
      />

      <ThreadNavigation
        v-if="loadedPages.indexOf(pageNumber) === loadedPages.length - 1"
        :key="`${pageNumber}-footer`"
        :thread-id="thread.thread_id"
        :page="+pageNumber"
        :total-page="thread.total_page"
        @navigate="fetchPage"
      />
    </template>

    <div v-waypoint="{ active: true, callback: onEndReached }"></div>

    <div class="f5-container">
      <button class="f5-button spin" @click="handleReloadClick" :class="{processing: isLoading}">
        <span>F5</span>
      </button>
    </div>
  </div>
  <div class="loader-container" v-else>
    <Loader />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import helper from '@/helper'
import Page from '@/components/Thread/Page'
import ThreadNavigation from '@/components/Thread/ThreadNavigation'
import Loader from '@/components/Loader'

export default {
  metaInfo() {
    return {
      title: this.officeMode ? 'Google' : this.thread.title || 'LIHKG',
    }
  },
  components: {
    Page,
    ThreadNavigation,
    Loader,
  },
  props: ['threadId', 'page'],
  computed: {
    ...mapState({
      officeMode: state => state.app.officeMode,
      thread: state => state.thread.thread,
      isLoading: state => state.thread.isLoading,
    }),
    loadedPages() {
      return Object.keys(this.thread.pages || {})
    },
    maxPage() {
      return Math.max(...this.loadedPages)
    },
    minPage() {
      return Math.min(...this.loadedPages)
    },
    hasNextPage() {
      return this.maxPage < this.thread.total_page
    },
  },
  methods: {
    ...mapActions(['fetchThread']),
    ...mapMutations({
      setThread: 'SET_THREAD',
      updateHistory: 'UPDATE_HISTORY',
      setMediaList: 'SET_MEDIA_LIST',
      hideGallery: 'HIDE_GALLERY',
    }),
    updateUrl(page) {
      this.$router.replace({ params: { page }, query: this.$route.query })
    },
    onEndReached(event) {
      if (this.isLoading) return
      if (event.going !== 'in' || !event.direction) return

      if (this.hasNextPage) {
        this.fetchNextPage()
      } else {
        this.reload()
      }
    },
    async tryFetchThread({ page, append = false }) {
      return this.fetchThread({
        threadId: this.threadId,
        page,
        append,
        order: this.$route.query.order,
      })
    },
    fetchNextPage() {
      this.tryFetchThread({
        page: this.maxPage + 1,
        append: true,
      })
      this.updateUrl(this.maxPage + 1)
    },
    jumpToPage(page) {
      const pageContainer = document.getElementById(`page-${page}`)
      if (pageContainer) {
        const top = document.getElementById(`page-${page}`).offsetTop - 120
        window.scrollTo(0, top)
      }
    },
    async fetchPage(page) {
      const append = +page === +this.maxPage + 1 || +page === +this.minPage - 1
      const isPageLoaded = page in this.thread.pages
      if (!isPageLoaded) {
        await this.tryFetchThread({
          page,
          append,
        })
      }
      this.updateUrl(page)
      this.jumpToPage(page)
    },
    async reload() {
      const data = await this.tryFetchThread({
        page: this.page,
        append: true,
      })
      if (data.response && data.response.total_page > this.maxPage) {
        this.fetchNextPage()
      }
    },
    handleReloadClick() {
      helper.trackEvent({
        eventCategory: 'ThreadView',
        eventAction: 'click',
        eventLabel: 'F5',
      })
      this.reload()
    },
    getLastRead() {
      let postId
      let page
      const posts = document.querySelectorAll('.post')
      for (let index = 0; index < posts.length; index += 1) {
        const post = posts[index]
        if (helper.elementInViewport(post)) {
          postId = post.getAttribute('data-id')
          page = post.getAttribute('data-page')
          break
        }
      }
      return { postId, page }
    },
    saveLastRead() {
      const { postId, page } = this.getLastRead()
      this.updateHistory({
        threadId: this.threadId,
        postId,
        page,
      })
      return { postId, page }
    },
    jumpToPost(postId) {
      const post = document.getElementById(`post-${postId}`)
      if (post) {
        window.scrollTo(0, post.offsetTop - 50)
      }
    },
  },
  watch: {
    async $route(to, from) {
      if (to.query.order !== from.query.order) {
        this.setThread({})
        if (to.query.order === 'score') {
          this.lastRead = this.saveLastRead()
          this.fetchPage(1)
        } else {
          await this.tryFetchThread({
            page: this.lastRead ? this.lastRead.page : 1,
          })
          if (this.lastRead && this.lastRead.postId) {
            this.jumpToPost(this.lastRead.postId)
          }
        }
      }
    },
  },
  beforeMount() {
    this.setThread({})
  },
  async mounted() {
    if (!this.thread.thread_id) {
      await this.tryFetchThread({
        page: this.page,
      })
      const postId = this.$route.query.post
      if (postId) {
        this.jumpToPost(postId)
      }
    }

    window.onbeforeunload = () => {
      this.saveLastRead()
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setMediaList(null)
    this.hideGallery()
    if (this.$route.query.order !== 'score') {
      this.saveLastRead()
    }
    next()
  },
  beforeDestroy() {
    window.onbeforeunload = null
  },
}
</script>

<style lang="scss" scoped>
$color: #1ecd97;

.f5-container {
  padding: 1rem;
  padding-bottom: 5rem;
  padding-bottom: calc(5rem + constant(safe-area-inset-bottom));
  padding-bottom: calc(5rem + env(safe-area-inset-bottom));
  text-align: center;
}

.f5-button {
  position: relative;
  appearance: none;
  padding: 0;
  width: 6rem;
  height: 3rem;
  border-radius: 1.5rem;
  background-color: transparent;
  outline: 0;
  cursor: pointer;
  overflow: hidden;
}

.loader-container {
  margin: 1rem;
  text-align: center;
}

.spin {
  border: 2px solid $color;
  color: $color;
  font-weight: 600;
  transition: all 0.1s ease-in-out;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: opacity 0.1s ease-in-out;
  }

  .is-hoverable &:hover {
    background-color: $color;
    color: #fff;
  }

  &.processing {
    pointer-events: none;
    cursor: default;
    width: 3rem;
    border-width: 4px;
    border-right-color: #eee;
    border-bottom-color: #eee;

    animation: spin;
    animation-delay: 0.3s;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;

    .night-mode & {
      border-right-color: #3e3e3e;
      border-bottom-color: #3e3e3e;
    }

    &:hover {
      background-color: transparent;
    }

    span:first-child {
      opacity: 0;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(720deg);
  }
}
</style>
