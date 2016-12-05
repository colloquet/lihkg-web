<template>
  <div v-if="activeThread">
    <div class="uk-hidden-small uk-margin-bottom navigation-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-5">
          <a class="return-link" v-if="activeCategory" @click.prevent="backToThreadList">
            <span class="uk-icon-reply"></span> {{ activeCategory.name }}
          </a>
        </div>
        <div class="uk-width-3-5">
          <div class="uk-grid uk-grid-collapse">
            <div class="uk-width-1-3">
              <a :class="{'uk-invisible': !hasPrevPage}" @click="handleLoadPrevPage"><span class="uk-icon-angle-left"></span> 上一頁</a>
            </div>
            <div class="uk-width-1-3">
              <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'bottom-center', mode: 'click'}">
                <div>第 {{ pageNumber }} 頁 <span class="uk-icon-caret-down"></span></div>
                <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                  <ul class="uk-nav uk-nav-dropdown">
                    <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="pageNumber = n" :class="{'is-active': n === pageNumber}">第 {{ n }} 頁</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="uk-width-1-3">
              <a :class="{'uk-invisible': !hasNextPage}" @click="handleLoadNextPage">下一頁 <span class="uk-icon-angle-right"></span></a>
            </div>
          </div>
        </div>
        <div class="uk-width-1-5"></div>
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
              <span class="uk-icon-eye uk-float-right story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-if="storeyModeID === -1"></span>
              <span class="uk-icon-eye-slash uk-float-right story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-else></span>
            </p>
            <div v-html="prepareCommentMsg(comment.msg)" v-show="comment.user.user_id === storeyModeID || storeyModeID === -1"></div>
          </div>
        </li>
      </ul>
    </div>

    <div class="uk-hidden-small uk-margin-bottom navigation-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-5">
          <a class="return-link" v-if="activeCategory" @click.prevent="backToThreadList">
            <span class="uk-icon-reply"></span> {{ activeCategory.name }}
          </a>
        </div>
        <div class="uk-width-3-5">
          <div class="uk-grid uk-grid-collapse">
            <div class="uk-width-1-3">
              <a :class="{'uk-invisible': !hasPrevPage}" @click="handleLoadPrevPage"><span class="uk-icon-angle-left"></span> 上一頁</a>
            </div>
            <div class="uk-width-1-3">
              <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'top-center', mode: 'click'}">
                <div>第 {{ pageNumber }} 頁 <span class="uk-icon-caret-down"></span></div>
                <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                  <ul class="uk-nav uk-nav-dropdown">
                    <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="pageNumber = n" :class="{'is-active': n === pageNumber}">第 {{ n }} 頁</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="uk-width-1-3">
              <a :class="{'uk-invisible': !hasNextPage}" @click="handleLoadNextPage">下一頁 <span class="uk-icon-angle-right"></span></a>
            </div>
          </div>
        </div>
        <div class="uk-width-1-5"></div>
      </div>
    </div>

    <p class="uk-text-center" v-if="!hasNextPage">
      <button class="uk-button uk-button-large" @click="refresh">F5</button>
    </p>

    <div class="uk-visible-small bottom-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-4">
          <a class="return-link" v-if="activeCategory" @click.prevent="backToThreadList">
            <span class="uk-icon-reply"></span> {{ activeCategory.name }}
          </a>
        </div>
        <div class="uk-width-3-4">
          <div class="uk-grid uk-grid-collapse">
            <div class="uk-width-1-3">
              <a :class="{'uk-invisible': !hasPrevPage}" @click="handleLoadPrevPage"><span class="uk-icon-angle-left"></span> 上一頁</a>
            </div>
            <div class="uk-width-1-3">
              <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'top-center', mode: 'click'}">
                <div>第 {{ pageNumber }} 頁 <span class="uk-icon-caret-down"></span></div>
                <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                  <ul class="uk-nav uk-nav-dropdown">
                    <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="pageNumber = n" :class="{'is-active': n === pageNumber}">第 {{ n }} 頁</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="uk-width-1-3">
              <a :class="{'uk-invisible': !hasNextPage}" @click="handleLoadNextPage">下一頁 <span class="uk-icon-angle-right"></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $, Image */
import moment from 'moment'
import lihkg from '../api/lihkg'

export default {
  name: 'Thread',
  head: {
    title () {
      return {
        inner: this.activeThread ? this.activeThread.title : ''
      }
    }
  },
  data () {
    return {
      isThreadLoading: false,
      storeyModeID: -1,
      fromThreadList: true
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
    autoLoadImage () {
      return this.$store.state.settings.autoLoadImage
    },
    pageNumber: {
      get () {
        return this.$store.state.route.params.page * 1 || 1
      },
      set (page) {
        this.$router.replace(`/thread/${this.threadID}/page/${page}`)
      }
    },
    hasNextPage () {
      return this.pageNumber < this.activeThread.total_page
    },
    hasPrevPage () {
      return this.pageNumber > 1
    },
    threadHistory () {
      return this.$store.state.settings.threadHistory
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
        self.$emit('updateHead')
        this.$store.commit('UPDATE_HISTORY', {
          id: response.data.response.thread_id,
          page: page,
          no_of_reply: response.data.response.no_of_reply
        })
      }).catch(() => {
        window.alert('伺服器出錯，請重試。')
      })
    },
    prepareCommentMsg (msg) {
      const regex = /<img(.*?)src="(.*?)"(.*?)>/gi
      const str = msg
      let m
      let newMsg

      while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        const str = m[3]
        if (str.indexOf('hkgmoji') === -1) {
          const newImgTag = m[0].replace(/<img(.*?)src="(.*?)"(.*?)>/gi, '<img src="/static/placeholder.png" data-src="$2" class="image-lazy-load" />')
          newMsg = newMsg ? newMsg.replace(m[0], newImgTag) : msg.replace(m[0], newImgTag)
        }
      }

      const output = () => {
        if (this.autoLoadImage) {
          return msg
        } else {
          return newMsg || msg
        }
      }

      return output().replace(/\/assets\/faces\//g, 'https://lihkg.com/assets/faces/')
    },
    getCommentIndex (index, page) {
      return (index + 1) + ((page - 1) * 25)
    },
    getRelativeTime (timestamp) {
      return moment.unix(timestamp).fromNow()
    },
    refresh () {
      this.fetchThread(this.pageNumber)
    },
    toggleStoryMode (userID) {
      this.storeyModeID = this.storeyModeID === -1 ? userID : -1
    },
    backToThreadList () {
      if (this.fromThreadList) {
        this.$router.back()
      } else {
        this.$router.push(`/category/${this.activeCategory.cat_id}`)
      }
    },
    handleLoadNextPage () {
      if (this.hasNextPage) {
        this.pageNumber += 1
      }
    },
    handleLoadPrevPage () {
      if (this.hasPrevPage) {
        this.pageNumber -= 1
      }
    }
  },
  watch: {
    pageNumber (newVal, oldVal) {
      this.fetchThread(newVal)
    }
  },
  mounted () {
    this.$store.commit('SET_ACTIVE_THREAD', {})

    if (this.threadHistory[this.threadID] && this.threadHistory[this.threadID] !== 1 && !this.$route.query['page-switcher']) {
      this.pageNumber = this.threadHistory[this.threadID].page || 1
      this.fetchThread(this.pageNumber)
    } else {
      this.fetchThread(this.pageNumber)
    }

    if (!this.activeCategory) {
      this.fromThreadList = false
    }

    document.onkeydown = (e) => {
      e = e || window.event
      if (e.keyCode === 37) {
        this.handleLoadPrevPage()
      } else if (e.keyCode === 39) {
        this.handleLoadNextPage()
      }
    }

    $('body').on('click', '.image-lazy-load', (e) => {
      const target = $(e.target)
      const src = target.data('src')
      let newImg = new Image()

      target.attr('src', '/static/loading.png')

      newImg.onload = () => {
        target.attr('src', src)
      }
      newImg.onerror = () => {
        target.attr('src', src)
      }
      newImg.src = src
    })
  },
  beforeDestroy () {
    document.onkeydown = null
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

.story-mode-toggle {
  cursor: pointer;
}

.comment {
  background: #2d2d2d;
  padding: 15px;
  word-wrap: break-word;

  .white-theme & {
    box-shadow: 0 1px 4px rgba(0,0,0,.15);
    background: #fafafa;
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
    background: #fafafa;
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

    .is-active {
      background: #eee;
      font-weight: bold;
    }

    .uk-nav-dropdown {
      line-height: 20px;

      >li>a:focus, >li>a:hover {
        background: #f1c40f;
      }
    }
  }
}


</style>
