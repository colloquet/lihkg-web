<template>
  <div class="categoryview-container">
    <ul v-if="category.postable" class="tab">
      <li><router-link :to="{ query: null }" exact>最新</router-link></li>
      <li><router-link :to="{ query: { order: 'hot' } }" @click.native="handleHotClick">熱門</router-link></li>
    </ul>
    <ul v-else-if="+category.cat_id === 2" class="tab">
      <li><router-link :to="{ query: null }" exact>即時熱門</router-link></li>
      <li><router-link :to="{ query: { type: 'daily' } }" exact>今天熱門</router-link></li>
      <li><router-link :to="{ query: { type: 'weekly' } }" exact>本週精選</router-link></li>
    </ul>

    <thread-list :thread-list="threadList" @load-more="handleLoadMore" :is-loading="isLoading"></thread-list>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import helper from '@/helper'
import ThreadList from '../components/ThreadList/ThreadList'

export default {
  name: 'categoryView',
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
      threadList: state => state.category.threadList,
      page: state => state.category.page,
      isLoading: state => state.category.isLoading,
      activeThreadId: state => state.thread.thread.thread_id,
    }),
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
        order: this.$route.query.order,
        type: this.$route.query.type,
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
        page: this.page + 1,
        order: this.$route.query.order,
        type: this.$route.query.type,
      })
    },
    handleHotClick() {
      helper.trackEvent({
        eventCategory: 'CategoryView',
        eventAction: 'click',
        eventLabel: 'Hot',
      })
    },
  },
  watch: {
    catId() {
      this.fetchAndScrollTop()
    },
    // eslint-disable-next-line
    '$route.query': function() {
      this.fetchAndScrollTop()
    },
  },
  mounted() {
    setTimeout(() => {
      this.canLoadMore = true
    }, 200)

    if (this.threadList.length && +this.$route.params.catId === +this.category.cat_id) {
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

<style lang="scss" scoped>
.tab {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #f1f1f1;
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;

  .is-mobile & {
    margin: .5rem 0 0;
  }

  .night-mode & {
    border-bottom-color: #333;
  }

  li {
    text-align: center;

    .is-mobile & {
      flex: 1;
    }

    a {
      display: block;
      padding: .5rem 1rem;
      margin-bottom: -1px;
      color: #999;

      &:hover {
        text-decoration: none;
        border-bottom: 1px solid #888;
      }

      &.is-active {
        border-bottom: 1px solid #1ecd97;
        color: inherit;

        .night-mode & {
          border-bottom-color: #42b983;
        }
      }
    }
  }
}
</style>
