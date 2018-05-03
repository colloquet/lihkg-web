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

import helper from '@/helper'
import ThreadList from '../components/ThreadList/ThreadList'

export default {
  props: ['catId'],
  components: {
    ThreadList,
  },
  metaInfo() {
    return {
      title: this.officeMode ? 'Google' : this.category.name || 'LIHKG',
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
      category: state => state.category.category,
      categoryList: state => state.category.categoryList,
      threadList: state => state.category.threadList,
      page: state => state.category.page,
      isLoading: state => state.category.isLoading,
      activeThreadId: state => state.thread.thread.thread_id,
    }),
    subCategoryList() {
      const category = this.categoryList.find(cat => +cat.cat_id === +this.catId)
      return category ? category.sub_category : []
    }
  },
  methods: {
    ...mapActions(['fetchThreadList']),
    ...mapMutations({
      setThreadList: 'SET_THREAD_LIST',
    }),
    fetchAndScrollTop() {
      this.setThreadList([])
      window.scrollTo(0, 0)
      this.fetchThreadList({
        catId: this.catId,
        page: this.$route.params.page,
      })
    },
    handleLoadMore() {
      if (this.canLoadMore) {
        this.fetchNextPage()
      }
    },
    fetchNextPage() {
      this.fetchThreadList({
        catId: this.catId,
        page: +this.page + 1,
      })
    },
  },
  watch: {
    catId: 'fetchAndScrollTop',
  },
  mounted() {
    setTimeout(() => {
      this.canLoadMore = true
    }, 200)

    if (
      this.threadList.length &&
      +this.$route.params.catId === +this.category.cat_id
    ) {
      if (this.activeThreadId) {
        const threadItem = document.getElementById(this.activeThreadId)
        if (threadItem) {
          threadItem.classList.add('highlight')
          setTimeout(() => {
            threadItem.classList.remove('highlight')
          }, 2000)
        }
      }
    } else {
      this.fetchAndScrollTop()
    }
  },
}
</script>
