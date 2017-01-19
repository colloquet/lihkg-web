<template>
  <div class="uk-form">
    <input type="text" id="search" class="uk-width-1-1 uk-margin-bottom" v-model="searchQuery" placeholder="標題、會員名稱、主題編號" autofocus>
    <thread-list
      :threads="results"
      :is-loading="isLoading"
      :handle-load-more="handleLoadMore"
      :has-more-threads="hasMoreThreads"
    ></thread-list>
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
      searchQuery: '',
      page: 1,
      isLoading: false,
      results: [],
      errorMessage: null,
      hasMoreThreads: false
    }
  },
  watch: {
    searchQuery () {
      this.page = 1
      this.fetchSearchResult(this.page, true)
    }
  },
  methods: {
    fetchSearchResult: debounce(async function (page, replace = false) {
      const self = this
      self.isLoading = true
      try {
        const { data } = await lihkg.fetchSearchResult(self.searchQuery, page)
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
        self.isLoading = false
      } catch (e) {
        console.log(e)
        window.alert('伺服器出錯，請重試。')
      }
    }, 500),
    handleLoadMore () {
      this.page += 1
      this.fetchSearchResult(this.page)
    }
  },
  mounted () {
    const self = this

    document.getElementById('search').focus()

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

<style lang="stylus">
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
