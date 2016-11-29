<template>
  <div v-if="activeThread">
    
    <div class="uk-hidden-small uk-margin-bottom navigation-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-4">
          <router-link :to="`/category/${activeCategory.cat_id}`" v-if="activeCategory" class="return-link"><span class="uk-icon-reply"></span> {{ activeCategory.name }}</router-link>
        </div>
        <div class="uk-width-3-4">
          <div class="uk-grid uk-grid-collapse">
            <div class="uk-width-1-3">
              <router-link :to="`/thread/${threadID}/page/${pageNumber - 1}`" :class="{'uk-invisible': pageNumber <= 1}">上一頁</router-link>
            </div>
            <div class="uk-width-1-3">
              <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'bottom-center', mode: 'click'}">
                <div>第 {{ pageNumber }} 頁</div>
                <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                  <ul class="uk-nav uk-nav-dropdown">
                    <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="pageNumber = n">第 {{ n }} 頁</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="uk-width-1-3">
              <router-link :to="`/thread/${threadID}/page/${pageNumber + 1}`" :class="{'uk-invisible': pageNumber >= activeThread.total_page}">下一頁</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="comments-container" :class="{'is-loading': isThreadLoading}">
      <ul class="uk-grid">
        <li class="uk-width-1-1 uk-margin-bottom" v-for="(comment, index) in activeThread.item_data">
          <div class="comment">
            <p>
              <span class="uk-text-muted" :class="{'author': activeThread.user.user_id === comment.user.user_id}">#{{ getCommentIndex(index, comment.page) }}</span>
              <span :class="{male: comment.user.gender === 'M', female: comment.user.gender === 'F', admin: comment.user.level === '999'}">{{ comment.user.nickname }}</span>
              <span class="uk-text-muted">// {{ getRelativeTime(comment.reply_time) }}</span>
            </p>
            <div v-html="prepareCommentMsg(comment.msg)"></div>
          </div>
        </li>
      </ul>
    </div>

    <div class="uk-hidden-small uk-margin-bottom navigation-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-4">
          <router-link :to="`/category/${activeCategory.cat_id}`" v-if="activeCategory" class="return-link"><span class="uk-icon-reply"></span> {{ activeCategory.name }}</router-link>
        </div>
        <div class="uk-width-3-4">
          <div class="uk-grid uk-grid-collapse">
            <div class="uk-width-1-3">
              <router-link :to="`/thread/${threadID}/page/${pageNumber - 1}`" :class="{'uk-invisible': pageNumber <= 1}">上一頁</router-link>
            </div>
            <div class="uk-width-1-3">
              <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'top-center', mode: 'click'}">
                <div>第 {{ pageNumber }} 頁</div>
                <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                  <ul class="uk-nav uk-nav-dropdown">
                    <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="pageNumber = n">第 {{ n }} 頁</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="uk-width-1-3">
              <router-link :to="`/thread/${threadID}/page/${pageNumber + 1}`" :class="{'uk-invisible': pageNumber >= activeThread.total_page}">下一頁</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="uk-text-center" v-if="pageNumber >= activeThread.total_page">
      <button class="uk-button uk-button-large" @click="refresh">F5</button>
    </p>

    <div class="uk-visible-small bottom-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-4">
          <router-link :to="`/category/${activeCategory.cat_id}`" v-if="activeCategory" class="return-link"><span class="uk-icon-reply"></span> {{ activeCategory.name }}</router-link>
        </div>
        <div class="uk-width-3-4">
          <div class="uk-grid uk-grid-collapse">
            <div class="uk-width-1-3">
              <router-link :to="`/thread/${threadID}/page/${pageNumber - 1}`" :class="{'uk-invisible': pageNumber <= 1}">上一頁</router-link>
            </div>
            <div class="uk-width-1-3">
              <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'top-center', mode: 'click'}">
                <div>第 {{ pageNumber }} 頁</div>
                <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                  <ul class="uk-nav uk-nav-dropdown">
                    <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="pageNumber = n">第 {{ n }} 頁</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="uk-width-1-3">
              <router-link :to="`/thread/${threadID}/page/${pageNumber + 1}`" :class="{'uk-invisible': pageNumber >= activeThread.total_page}">下一頁</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import lihkg from '../api/lihkg'

export default {
  name: 'Thread',
  data () {
    return {
      isThreadLoading: false
    }
  },
  computed: {
    activeCategory () {
      return this.$store.getters.activeCategory
    },
    activeThread () {
      return this.$store.state.threads.activeThread
    },
    threadID () {
      return this.$store.state.route.params.id
    },
    pageNumber: {
      get () {
        return this.$store.state.route.params.page * 1 || 1
      },
      set (page) {
        this.$router.push(`/thread/${this.threadID}/page/${page}`)
      }
    }
  },
  methods: {
    fetchThread (page) {
      const self = this
      self.isThreadLoading = true
      lihkg.fetchThread(self.threadID, page).then(response => {
        self.isThreadLoading = false

        if (!self.activeCategory) {
          self.$store.commit('SET_ACTIVE_CATEGORY', response.data.response.cat_id)
        }

        self.$store.commit('SET_ACTIVE_THREAD', response.data.response)
      }).catch(() => {
        window.alert('伺服器出錯，請重試。')
      })
    },
    prepareCommentMsg (msg) {
      return msg.replace(/\/assets\/faces\//g, 'https://lihkg.com/assets/faces/')
    },
    getCommentIndex (index, page) {
      return (index + 1) + ((page - 1) * 25)
    },
    getRelativeTime (timestamp) {
      return moment.unix(timestamp).fromNow()
    },
    refresh () {
      this.fetchThread(this.pageNumber)
    }
  },
  watch: {
    pageNumber (newVal, oldVal) {
      this.fetchThread(newVal)
    }
  },
  mounted () {
    this.fetchThread(this.pageNumber)
    this.$store.commit('SET_ACTIVE_THREAD', {})
  }
}
</script>

<style lang="scss">
.male {
  color: #237afd;
}

.female {
  color: #e60d64;
}

.admin {
  color: #f1c40f !important;
}

.author {
  color: #f1c40f !important;
}

.comments-container {
  @media(max-width: 767px) {
    margin: 0 -15px;
  }
}

.is-loading {
  opacity: 0.5;
}

.comment {
  background: #2d2d2d;
  padding: 15px;
  word-wrap: break-word;

  .white-theme & {
    box-shadow: 0 1px 4px rgba(0,0,0,.15);
    background: #fff;
  }

  img {
    vertical-align: text-bottom;
  }
}

.bottom-bar {
  position: fixed;
  box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.3);
  background: #3c3c3c;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;

  .page-switcher {
    color: #e6e6e6;
  }
}

.navigation-bar {
  background: #2d2d2d;

  .white-theme & {
    box-shadow: 0 1px 4px rgba(0,0,0,.15);
    background: #fff;
  }
}

.bottom-bar, .navigation-bar {

  [class*=uk-width-1-] {
    border-color: #757575 !important;
    text-align: center;

    > a {
      display: block;
      height: 50px;
      padding: 0 15px;
      line-height: 50px;
    }
  }

  .page-switcher {
    height: 50px;
    padding: 0 15px;
    line-height: 50px;
    cursor: pointer;

    .uk-nav-dropdown {
      line-height: 20px;

      >li>a:focus, >li>a:hover {
        background: #f1c40f;
      }
    }
  }

  .uk-dropdown-scrollable {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
}


</style>
