<template>
  <div class="uk-form">
    <input type="text" id="search" class="uk-width-1-1 uk-margin-bottom" v-model="searchQuery" placeholder="標題、會員名稱、主題編號" autofocus>
    <div class="threads-container">
      <ul class="uk-grid" :class="{'is-loading': isLoading}">
        <li class="uk-width-1-1" v-for="thread in results" :key="thread.thread_id">
          <div class="thread-container">
            <router-link :to="'/thread/' + thread.thread_id + '/page/1'" class="uk-link-reset thread">
              <span class="uk-icon-bolt hot-indicator" v-if="thread.is_hot"></span>
              <span class="uk-icon-circle read-indicator" :class="{'has-new': thread.no_of_reply > threadHistory[thread.thread_id].no_of_reply}" v-if="threadHistory[thread.thread_id]"></span>
              {{ thread.title }}<br>
              <small class="uk-text-muted">
                <span :class="thread.user.level === '999' ? 'admin' : thread.user.gender === 'M' ? 'male' : 'female'">{{ thread.user.nickname }}</span> //
                {{ getRelativeTime(thread.last_reply_time) }} //
                {{ thread.no_of_reply }}個回覆 //
                <span :class="{'like-color': (thread.like_count - thread.dislike_count) >= 100, 'dislike-color': (thread.like_count - thread.dislike_count) <= -100}">
                  <span :class="thread.like_count - thread.dislike_count < 0 ? 'uk-icon-thumbs-down' : 'uk-icon-thumbs-up'"></span>
                  {{ thread.like_count - thread.dislike_count }}
                </span>
              </small>
            </router-link>
            <div class="page-switcher" data-uk-dropdown="{pos:'bottom-right', mode: 'click'}">
              <div>第 {{ thread.total_page }} 頁 <span class="uk-icon-caret-down"></span></div>
              <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                <ul class="uk-nav uk-nav-dropdown">
                  <li v-for="n in thread.total_page">
                    <router-link :to="`/thread/${thread.thread_id}/page/${n}?page-switcher=true`">第 {{ n }} 頁</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="uk-width-1-1 load-more" v-show="searchQueryDirty">
          <a @click="handleLoadMore" v-if="hasMoreThreads">
            {{ isLoading ? '載入中…' : '載入更多' }}
          </a>
          <span v-else>沒有更多</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import lihkg from '../api/lihkg'
import moment from 'moment'
import debounce from 'lodash.debounce'

export default {
  data () {
    return {
      searchQuery: '',
      searchQueryDirty: false,
      page: 1,
      isLoading: false,
      results: [],
      errorMessage: null,
      hasMoreThreads: true
    }
  },
  computed: {
    threadHistory () {
      return this.$store.state.settings.threadHistory
    }
  },
  watch: {
    searchQuery () {
      this.page = 1
      this.searchQueryDirty = true
      this.fetchSearchResult(this.page, true)
    }
  },
  methods: {
    getRelativeTime (timestamp) {
      return moment.unix(timestamp).fromNow()
    },
    fetchSearchResult: debounce(function (page, replace = false) {
      const self = this
      self.isLoading = true
      lihkg.fetchSearchResult(self.searchQuery, page).then(response => {
        if (replace) {
          self.results = []
        }
        if (response.data.error_message) {
          self.errorMessage = response.data.error_message
          self.hasMoreThreads = false
        } else {
          const threads = response.data.response.items
          self.errorMessage = null
          self.results = self.results.concat(threads)
          if (threads.length < 30) {
            self.hasMoreThreads = false
          } else {
            self.hasMoreThreads = true
          }
        }
        self.isLoading = false
      }).catch((e) => {
        console.log(e)
        window.alert('伺服器出錯，請重試。')
      })
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
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
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
