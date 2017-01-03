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
  head: {
    title () {
      return {
        inner: this.activeCategory ? this.activeCategory.name : '主頁'
      }
    }
  },
  data () {
    return {
      page: 1
    }
  },
  computed: {
    activeCategory () {
      return this.$store.getters.activeCategory
    },
    catId () {
      return this.$store.state.route.params.id
    },
    activeThreads () {
      return this.$store.state.threads.threads
    },
    isThreadListLoading () {
      return this.$store.state.threads.isThreadListLoading
    },
    activeCategoryId () {
      return this.$store.state.categories.activeCategoryId
    },
    hasMoreThreads () {
      return this.$store.state.threads.hasMoreThreads
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
      this.$emit('updateHead')
    },
    activeCategory () {
      this.$emit('updateHead')
    }
  },
  mounted () {
    const self = this
    if (+this.catId !== +this.activeCategoryId || !this.activeThreads.length) {
      this.fetchThreadList({
        catId: this.catId,
        page: 1
      })
    }

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!self.isThreadListLoading && self.hasMoreThreads && !$('body').hasClass('uk-offcanvas-page')) {
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
