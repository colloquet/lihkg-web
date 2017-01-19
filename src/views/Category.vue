<template>
  <div>
    <thread-list
      :threads="uniqueThreads"
      :is-loading="isThreadListLoading"
      :handle-load-more="handleLoadMore"
      :has-more-threads="hasMoreThreads"
    ></thread-list>

    <div class="uk-visible-small bottom-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-3">
          <a class="f5-link" @click.prevent="handleRefresh">
            <span class="uk-icon-refresh"></span> F5
          </a>
        </div>
        <div class="uk-width-1-3">
          <a href="#offcanvas-categories" data-uk-offcanvas="{mode:'slide'}">轉台</a>
        </div>
        <div class="uk-width-1-3">
          <router-link to="/search"><span class="uk-icon-search"></span> 搜尋</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapActions, mapState, mapGetters } from 'vuex'
import ThreadList from '../components/ThreadList'

export default {
  name: 'Category',
  components: {
    ThreadList
  },
  data () {
    return {
      page: 1,
      canLoadMore: false
    }
  },
  computed: {
    ...mapState({
      activeCategory: state => state.categories.category,
      isThreadListLoading: state => state.categories.isThreadListLoading,
      hasMoreThreads: state => state.categories.hasMoreThreads,
      catId: state => state.route.params.id
    }),
    ...mapGetters([
      'uniqueThreads'
    ])
  },
  methods: {
    ...mapActions([
      'fetchThreadList',
      'fetchMoreThreadList'
    ]),
    handleRefresh () {
      this.fetchThreadList({
        catId: this.activeCategory.cat_id,
        page: 1
      })
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    handleLoadMore () {
      this.page += 1
      this.$nextTick(() => {
        this.fetchMoreThreadList({
          catId: this.catId,
          page: this.page
        })
      })
    }
  },
  watch: {
    catId () {
      this.fetchThreadList({
        catId: this.catId,
        page: 1
      })
    }
  },
  mounted () {
    const self = this

    setTimeout(() => {
      self.canLoadMore = true
    }, 100)

    if (+this.catId !== +this.activeCategory.cat_id || !this.uniqueThreads.length) {
      this.fetchThreadList({
        catId: this.catId,
        page: 1
      })
    }

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        const canLoadMore = !self.isThreadListLoading && self.hasMoreThreads && self.canLoadMore && !$('body').hasClass('uk-offcanvas-page')
        if (canLoadMore) {
          self.handleLoadMore()
        }
      }
    }
  },
  beforeDestroy () {
    window.onscroll = null
  }
}
</script>
