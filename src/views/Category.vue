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
          <a href="#offcanvas-categories" data-uk-offcanvas="{mode:'none'}">轉台</a>
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
import uniqBy from 'lodash.uniqby'
import { mapActions } from 'vuex'
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
    activeThreads () {
      return this.$store.state.categories.threads
    },
    activeCategory () {
      return this.$store.state.categories.category
    },
    catId () {
      return this.$store.state.route.params.id
    },
    isThreadListLoading () {
      return this.$store.state.categories.isThreadListLoading
    },
    hasMoreThreads () {
      return this.$store.state.categories.hasMoreThreads
    },
    uniqueThreads () {
      return uniqBy(this.activeThreads, 'thread_id')
    }
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
    }, 500)

    if (+this.catId !== +this.activeCategory.cat_id || !this.activeThreads.length) {
      this.fetchThreadList({
        catId: this.catId,
        page: 1
      })
    }

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
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

<style lang="stylus">

</style>
