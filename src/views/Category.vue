<template>
  <div>
    <div class="threads-container">
      <ul class="uk-grid" :class="{'is-loading': isThreadListLoading}">
        <li class="uk-width-1-1" v-for="thread in uniqueThreads" :key="thread.thread_id">
          <router-link :to="'/thread/' + thread.thread_id" class="uk-link-reset thread">
            {{ thread.title }}<br>
            <small class="uk-text-muted">
              <span :class="{male: thread.user.gender === 'M', female: thread.user.gender === 'F', admin: thread.user.level === '999'}">{{ thread.user.nickname }}</span> //
              {{ getRelativeTime(thread.last_reply_time) }} //
              {{ thread.no_of_reply }}個回覆 //
              <span :class="{'like-color': (thread.like_count - thread.dislike_count) >= 100, 'dislike-color': (thread.like_count - thread.dislike_count) <= -100}">
                <span :class="thread.like_count - thread.dislike_count < 0 ? 'uk-icon-thumbs-down' : 'uk-icon-thumbs-up'"></span>
              </span>
              {{ thread.like_count - thread.dislike_count }}
            </small>
          </router-link>
        </li>
      </ul>
    </div>
    <p class="uk-text-center" v-if="hasMoreThreads">
      <button class="uk-button" @click="handleLoadMore" :disabled="isThreadListLoading">
        {{ isThreadListLoading ? '載入中…' : '載入更多' }}
      </button>
    </p>
    <p v-else>沒有更多</p>
  </div>
</template>

<script>
import uniqBy from 'lodash.uniqby'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'

moment.locale('zh-hk')

export default {
  name: 'Category',
  data () {
    return {
      page: 1
    }
  },
  computed: {
    ...mapGetters([
      'activeCategory'
    ]),
    catID () {
      return this.$store.state.route.params.id
    },
    activeThreads () {
      return this.$store.state.threads.threads
    },
    isThreadListLoading () {
      return this.$store.state.threads.isThreadListLoading
    },
    activeCategoryID () {
      return this.$store.state.categories.activeCategoryID
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
    getRelativeTime (timestamp) {
      return moment.unix(timestamp).fromNow()
    },
    handleLoadMore () {
      this.page += 1
      this.$nextTick(() => {
        this.fetchMoreThreadList({
          catID: this.catID,
          page: this.page
        })
      })
    }
  },
  watch: {
    catID () {
      this.fetchThreadList({
        catID: this.catID,
        page: 1
      })
    }
  },
  mounted () {
    const self = this
    if (this.catID * 1 !== this.activeCategoryID * 1 || !this.activeThreads.length) {
      this.fetchThreadList({
        catID: this.catID,
        page: 1
      })
    }

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!self.isThreadListLoading && self.hasMoreThreads) {
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
.is-loading {
  opacity: 0.3;
}

.threads-container {
  margin: 0 -15px;
}

.thread {
  display: block;
  border-bottom: 1px solid #444;
  padding: 15px;

  &:hover {
    background: #383838;
  }

  .white-theme & {
    border-bottom: 1px solid #ddd;

    &:hover {
      background: #f5f5f5;
    }
  }
}

.like-color {
  color: #f1c40f;
}

.dislike-color {
  color: #e74c3c;
}
</style>
