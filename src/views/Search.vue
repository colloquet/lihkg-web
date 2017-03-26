<template>
  <div class="uk-form">
    <div class="uk-margin-bottom navigation-bar range-type-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-3">
          <router-link :to="{ path: '/search', query: { q: searchQuery }}" exact>最相關</router-link>
        </div>
        <div class="uk-width-1-3">
          <router-link :to="{ path: '/search', query: { q: searchQuery, sort: 'desc_create_time' }}" exact>主題新至舊</router-link>
        </div>
        <div class="uk-width-1-3">
          <router-link :to="{ path: '/search', query: { q: searchQuery, sort: 'desc_reply_time' }}" exact>回覆新至舊</router-link>
        </div>
      </div>
    </div>
    <input type="text" id="search" class="uk-width-1-1 uk-margin-bottom" v-model="searchQuery" placeholder="標題、會員名稱、主題編號" autofocus>
    <thread-list
      :threads="results"
      :is-loading="isLoading"
      :is-replacing="isReplacing"
      :handle-load-more="handleLoadMore"
      :has-more-threads="hasMoreThreads"
      v-if="searchQuery"
    ></thread-list>
    <span v-else>請輸入關鍵字</span>
  </div>
</template>

<script>
import lihkg from '../api/lihkg'
import debounce from 'lodash.debounce'
import ThreadList from '../components/ThreadList'

export default {
  name: 'search',
  components: {
    ThreadList
  },
  data () {
    return {
      searchQuery: this.$store.state.route.query.q || '',
      page: 1,
      isLoading: false,
      isReplacing: false,
      results: [],
      errorMessage: null,
      hasMoreThreads: false
    }
  },
  computed: {
    // searchQuery () {
    //   return this.$store.state.route.query.q || ''
    // },
    sortType () {
      return this.$store.state.route.query.sort
    }
  },
  methods: {
    fetchSearchResult: debounce(async function (page, replace = false) {
      const self = this
      self.isLoading = true
      if (replace) {
        self.isReplacing = true
      }
      try {
        const { data } = await lihkg.fetchSearchResult(self.searchQuery, page, self.sortType)
        if (replace) {
          self.results = []
        }
        if (data.error_message) {
          self.errorMessage = data.error_message
          self.hasMoreThreads = false
        } else {
          const threads = data.response.items
          self.errorMessage = null
          self.results = self.results.concat(threads)
          self.hasMoreThreads = threads.length >= 30
        }
      } catch (e) {
        console.log(e)
        window.alert('伺服器出錯，請重試。')
      }
      self.isLoading = false
      if (replace) {
        self.isReplacing = false
      }
    }, 500),
    handleLoadMore () {
      this.page += 1
      this.fetchSearchResult(this.page)
    }
  },
  watch: {
    searchQuery (newVal) {
      this.page = 1
      this.$router.replace({
        path: 'search',
        query: {
          q: newVal,
          sort: this.sortType
        }
      })
      this.fetchSearchResult(this.page, true)
    },
    sortType () {
      this.page = 1
      this.fetchSearchResult(this.page, true)
    }
  },
  mounted () {
    const self = this

    document.getElementById('search').focus()

    if (this.searchQuery) {
      this.fetchSearchResult(this.page, true)
    }

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        if (!self.isLoading && self.hasMoreThreads) {
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

<style lang="scss">
#search {
  border: 1px solid #545454;
  background: #313131;
  color: #e6e6e6;

  .white-theme & {
    border: 1px solid #ddd;
    background: #fff;
    color: #444;
  }

  &:focus {
    border: 1px solid #7d7b7b;
  }
}
</style>
