<template>
  <div class="categoryview-container">
    <ThreadList
      :thread-list="threadList"
      :is-loading="isLoading"
      @load-more="handleLoadMore"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import ThreadList from '../components/ThreadList/ThreadList'

export default {
  components: {
    ThreadList,
  },
  metaInfo() {
    return {
      title: this.officeMode ? 'Google' : '名已留',
    }
  },
  data() {
    return {
      canLoadMore: false,
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile,
      officeMode: state => state.app.officeMode,
      threadList: state => state.threadList.threadList,
      threadListType: state => state.threadList.threadListType,
      page: state => state.threadList.page,
      isLoading: state => state.threadList.isLoading,
      activeThreadId: state => state.thread.thread.thread_id,
      bookmarks: state => state.app.bookmarks,
    }),
  },
  methods: {
    ...mapActions(['fetchThreadListByIds']),
    ...mapMutations({
      setCategory: 'SET_CATEGORY',
      setThreadList: 'SET_THREAD_LIST',
      setThreadListType: 'SET_THREAD_LIST_TYPE',
    }),
    fetchAndScrollTop() {
      this.setThreadList([])
      window.scrollTo(0, 0)
      this.fetchThreadListByIds({ threadIds: this.bookmarks })
    },
    handleLoadMore() {
      if (this.canLoadMore) {
        this.fetchNextPage()
      }
    },
    fetchNextPage() {
      this.fetchThreadListByIds({ threadIds: this.bookmarks, page: this.page + 1 })
    },
  },
  watch: {
    threadListType(newVal, oldVal) {
      if (oldVal !== newVal && newVal === 'bookmarks') {
        this.setCategory({})
        this.fetchAndScrollTop()
      }
    },
  },
  mounted() {
    this.setThreadListType('bookmarks')

    setTimeout(() => {
      this.canLoadMore = true
    }, 200)

    if (this.activeThreadId) {
      const threadItem = document.getElementById(this.activeThreadId)
      if (threadItem) {
        threadItem.classList.add('highlight')
        setTimeout(() => {
          threadItem.classList.remove('highlight')
        }, 2000)
      }
    }
  },
}
</script>

