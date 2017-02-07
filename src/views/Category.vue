<template>
  <div>
    <div class="uk-margin-bottom navigation-bar range-type-bar" v-if="catId == 2">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-3">
          <router-link :to="{ path: '/category/2' }" exact>即時熱門</router-link>
        </div>
        <div class="uk-width-1-3">
          <router-link :to="{ path: '/category/2', query: { type: 'daily' }}" exact>今天熱門</router-link>
        </div>
        <div class="uk-width-1-3">
          <router-link :to="{ path: '/category/2', query: { type: 'weekly' }}" exact>本週精選</router-link>
        </div>
      </div>
    </div>

    <thread-list
      :threads="uniqueThreads"
      :is-loading="isThreadListLoading"
      :is-replacing="isReplacing"
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
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import ThreadList from '../components/ThreadList'

export default {
  name: 'Category',
  components: {
    ThreadList
  },
  data () {
    return {
      canLoadMore: false
    }
  },
  computed: {
    ...mapState({
      activeCategory: state => state.categories.category,
      isThreadListLoading: state => state.categories.isThreadListLoading,
      isReplacing: state => state.categories.isReplacing,
      hasMoreThreads: state => state.categories.hasMoreThreads,
      catId: state => state.route.params.id,
      rangeType: state => state.route.query.type
    }),
    ...mapGetters([
      'uniqueThreads'
    ]),
    page: {
      get () {
        return this.$store.state.categories.page
      },
      set (page) {
        this.setCategoryPage(page)
      }
    }
  },
  methods: {
    ...mapMutations({
      setCategoryPage: 'SET_CATEGORY_PAGE'
    }),
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
    },
    handleOnScroll () {
      if ((window.innerHeight + (window.scrollY || window.pageYOffset)) >= document.body.offsetHeight - 200) {
        const canLoadMore = !this.isThreadListLoading && this.hasMoreThreads && this.canLoadMore && !$('body').hasClass('uk-offcanvas-page')
        if (canLoadMore) {
          this.handleLoadMore()
        }
      }
    }
  },
  watch: {
    catId () {
      this.fetchThreadList({
        catId: this.catId,
        page: 1
      })
    },
    rangeType (newVal, oldVal) {
      this.fetchThreadList({
        catId: this.catId,
        page: 1,
        rangeType: newVal
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
        page: 1,
        rangeType: this.rangeType
      })
    }

    $(window).on('scroll', this.handleOnScroll)
  },
  beforeDestroy () {
    $(window).off('scroll')
  }
}
</script>

<style lang="stylus">
.range-type-bar {
  border: 1px solid #444;

  .white-theme & {
    border: 1px solid #ddd;
  }

  .uk-width-1-3:nth-child(n+2) {
    a {
      border-left: 1px solid #444;

      .white-theme & {
        border-left: 1px solid #ddd;
      }
    }
  }

  a {
    &.uk-active {
      background: #383838;
    }

    .white-theme & {
      color: #222;

      &.uk-active {
        background: #eee;
      }
    }
  }
}
</style>
