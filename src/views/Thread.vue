<template>
  <div v-if="activeThread">
    <div class="page-container" v-for="(comments, page) in activeThread.item_page" :id="`page-${page}`" data-uk-scrollspy :data-page="page">
      <div class="uk-margin-bottom navigation-bar">
        <div class="uk-grid uk-grid-collapse">
          <div class="uk-width-1-5 uk-width-1-5 uk-hidden-small">
            <a class="return-link" v-if="activeCategory" @click.prevent="backToThreadList">
              <span class="uk-icon-reply"></span> {{ activeCategory.name }}
            </a>
          </div>
          <div class="uk-width-1-1 uk-width-medium-3-5">
            <div class="uk-grid uk-grid-collapse">
              <div class="uk-width-1-3">
                <a :class="{'uk-invisible': !hasPrevPage(page)}" @click="handlePageSwitch(+page - 1)"><span class="uk-icon-angle-left"></span> 上一頁</a>
              </div>
              <div class="uk-width-1-3">
                <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'bottom-center', mode: 'click'}">
                  <div>第 {{ page }} 頁 <span class="uk-icon-caret-down"></span></div>
                  <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                    <ul class="uk-nav uk-nav-dropdown">
                      <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="handlePageSwitch(n)" :class="{'is-active': n == page}">第 {{ n }} 頁</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="uk-width-1-3">
                <a :class="{'uk-invisible': !hasNextPage(page)}" @click="handlePageSwitch(+page + 1)">下一頁 <span class="uk-icon-angle-right"></span></a>
              </div>
            </div>
          </div>
          <div class="uk-width-1-5 uk-hidden-small">
            <div class="uk-position-relative" data-uk-dropdown="{pos:'bottom-right', mode: 'click'}">
              <a class="more-link">
                <span class="uk-icon-ellipsis-v"></span> 更多
              </a>
              <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                <ul class="uk-nav uk-nav-dropdown">
                  <li>
                    <a class="uk-dropdown-close" @click.prevent="enablePhotoMode">
                      <span class="uk-icon-image"></span> 圖片模式
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="comments-container" :class="{'is-loading': isThreadLoading}">
        <ul class="uk-grid">
          <li class="uk-width-1-1 uk-margin-bottom" v-for="(comment, index) in comments" :id="index % 25 == 0 ? `page-${comment.page}` : ''">
            <div class="comment">
              <p>
                <small>
                  <span class="uk-text-muted" :class="{'author': activeThread.user.user_id === comment.user.user_id}">#{{ getCommentIndex(index, page) }}</span>
                  <span :class="comment.user.level === '999' ? 'admin' : comment.user.gender === 'M' ? 'male' : 'female'">{{ comment.user_nickname }}</span>
                  <span class="uk-text-muted">// {{ getRelativeTime(comment.reply_time) }}</span>
                  <span class="uk-icon-eye uk-float-right story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-if="storeyModeID === -1"></span>
                  <span class="uk-icon-eye-slash uk-float-right story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-else></span>
                </small>
              </p>
              <div v-html="prepareCommentMsg(comment.msg)" v-show="comment.user.user_id === storeyModeID || storeyModeID === -1"></div>
            </div>
          </li>
        </ul>
      </div>

      <div class="uk-margin-bottom navigation-bar">
        <div class="uk-grid uk-grid-collapse">
          <div class="uk-width-1-5 uk-width-1-5 uk-hidden-small">
            <a class="return-link" v-if="activeCategory" @click.prevent="backToThreadList">
              <span class="uk-icon-reply"></span> {{ activeCategory.name }}
            </a>
          </div>
          <div class="uk-width-1-1 uk-width-medium-3-5">
            <div class="uk-grid uk-grid-collapse">
              <div class="uk-width-1-3">
                <a :class="{'uk-invisible': !hasPrevPage(page)}" @click="handlePageSwitch(+page - 1)"><span class="uk-icon-angle-left"></span> 上一頁</a>
              </div>
              <div class="uk-width-1-3">
                <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'bottom-center', mode: 'click'}">
                  <div>第 {{ page }} 頁 <span class="uk-icon-caret-down"></span></div>
                  <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                    <ul class="uk-nav uk-nav-dropdown">
                      <li v-for="n in activeThread.total_page"><a class="uk-dropdown-close" @click.prevent="handlePageSwitch(n)" :class="{'is-active': n == page}">第 {{ n }} 頁</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="uk-width-1-3">
                <a :class="{'uk-invisible': !hasNextPage(page)}" @click="handlePageSwitch(+page + 1)">下一頁 <span class="uk-icon-angle-right"></span></a>
              </div>
            </div>
          </div>
          <div class="uk-width-1-5 uk-hidden-small">
            <div class="uk-position-relative" data-uk-dropdown="{pos:'bottom-right', mode: 'click'}">
              <a class="more-link">
                <span class="uk-icon-ellipsis-v"></span> 更多
              </a>
              <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                <ul class="uk-nav uk-nav-dropdown">
                  <li>
                    <a class="uk-dropdown-close" @click.prevent="enablePhotoMode">
                      <span class="uk-icon-image"></span> 圖片模式
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="uk-text-center" v-if="page >= activeThread.total_page">
        <button class="uk-button uk-button-large" @click="handleRefresh">F5</button>
      </p>
    </div>


    <div class="uk-visible-small bottom-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-6">
          <a class="return-link" v-if="activeCategory" @click.prevent="backToThreadList">
            <span class="uk-icon-reply"></span>
          </a>
        </div>
        <div class="uk-width-1-6 uk-flex uk-flex-column uk-flex-center uk-flex-middle admin">
          <span class="uk-icon-thumbs-up"></span><span class="rating-number">{{ activeThread.like_count }}</span>
        </div>
        <div class="uk-width-1-6 uk-flex uk-flex-column uk-flex-center uk-flex-middle admin">
          <span class="uk-icon-thumbs-down"></span><span class="rating-number">{{ activeThread.dislike_count }}</span>
        </div>
        <div class="uk-width-1-6">
          <a class="action-link" @click.prevent="enablePhotoMode">
            <span class="uk-icon-image"></span>
          </a>
        </div>
        <div class="uk-width-1-6" data-uk-dropdown="{mode:'click', pos: 'bottom-right'}">
          <a>
            <span class="uk-icon-qrcode like-color"></span>
          </a>
          <div class="uk-dropdown-blank mobile-entry-popup">
            <a :href="pageAppLink()" target="_blank"><div class="row"><span class="uk-icon-external-link"></span> 電話繼續追</div></a>
            <div class="row" v-html="qr()"></div>
          </div>
        </div>
        <div class="uk-width-1-6">
          <a class="action-link" @click.prevent="handleScrollBottom">
            <span class="uk-icon-arrow-down"></span>
          </a>
        </div>
      </div>
    </div>

    <transition name="slide">
      <div class="photo-mode-container" v-if="photoMode">
        <div class="uk-clearfix photo-mode-header">
          <span class="uk-icon-image"></span> 圖片模式
          <a class="uk-float-right photo-mode-close" @click.prevent="disablePhotoMode"><span class="uk-icon-remove"></span> 關閉</a>
        </div>
        <div class="photo-mode-body">
          <div class="uk-container uk-container-center">
            <p class="uk-text-center" v-if="noImages">此post冇圖片</p>
            <div class="uk-grid uk-grid-small uk-grid-width-1-3 uk-grid-width-medium-1-4 uk-grid-width-large-1-5 uk-grid-width-xlarge-1-6" v-else>
              <div v-for="image in images">
                <a :href="image.url" data-uk-lightbox="{group:'photo-mode'}" data-lightbox-type="image">
                  <div class="image-container" :style="{backgroundImage: `url(${image.url})`}"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* global $, UIkit, Image */
import qrCode from 'qrcode-npm'
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
      fromThreadList: true,
      photoMode: false,
      images: [],
      noImages: false
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
    threadHistory () {
      return this.$store.state.settings.threadHistory
    },
    globalHasNextPage () {
      return +$('.page-container:last').data('page') < this.activeThread.total_page
    }
  },
  methods: {
    pageAppLink () {
      const threadId = this.$store.state.route.params.id
      const currentPage = this.$store.state.route.params.page * 1 || 1
      return `https://lihkg.com/thread/${threadId}/page/${currentPage}?ref=lihk-firebase`
    },
    qr () {
      try {
        const qr = qrCode.qrcode(4, 'M')
        const refLink = this.pageAppLink()
        qr.addData(refLink)
        qr.make()
        return qr.createTableTag(4)
      } catch (e) {
        return 'QR code: 你條Link 太長.'
      }
    },
    hasNextPage (page) {
      return page < this.activeThread.total_page
    },
    hasPrevPage (page) {
      return page > 1
    },
    fetchThread (page, append = true, scroll = false, refresh = false) {
      const self = this
      if (!refresh && self.activeThread.item_page && typeof self.activeThread.item_page[page] !== 'undefined') {
        UIkit.Utils.scrollToElement(UIkit.$(`#page-${page}`), {
          offset: 40
        })
        self.pageNumber = page
        return false
      }
      self.isThreadLoading = true
      lihkg.fetchThread(self.threadID, page).then(response => {
        self.isThreadLoading = false

        if (!self.activeCategory) {
          self.$store.commit('SET_ACTIVE_CATEGORY', response.data.response.cat_id)
        }

        if (append) {
          self.$store.commit('APPEND_ACTIVE_THREAD', response.data.response)
        } else {
          self.$store.commit('SET_ACTIVE_THREAD', response.data.response)
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }
        if (scroll) {
          setTimeout(() => {
            UIkit.Utils.scrollToElement(UIkit.$(`#page-${page}`), {
              offset: 40
            })
          }, 100)
        }
        self.$emit('updateHead')
        self.$store.commit('UPDATE_HISTORY', {
          id: response.data.response.thread_id,
          page: page,
          no_of_reply: response.data.response.no_of_reply
        })
        self.pageNumber = page
      }).catch((e) => {
        console.log(e)
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
      return (index) + ((page - 1) * 25)
    },
    getRelativeTime (timestamp) {
      return moment.unix(timestamp).fromNow()
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
    handlePageSwitch (page) {
      this.fetchThread(page, true, true)
    },
    handleLoadMore (page) {
      this.fetchThread(page, true, false)
    },
    handleRefresh () {
      const page = +$('.page-container:last').data('page')
      this.fetchThread(page, true, false, true)
    },
    handleScrollBottom () {
      $('html, body').animate({ scrollTop: $(document).height() }, 1000)
    },
    enablePhotoMode () {
      const self = this
      self.photoMode = true
      if (!self.images.length && !self.noImages) {
        lihkg.fetchImages(this.threadID).then((response) => {
          if (response.data.response.images.length) {
            self.images = response.data.response.images
          } else {
            self.noImages = true
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    },
    disablePhotoMode () {
      this.photoMode = false
    }
  },
  mounted () {
    const self = this

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

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        const page = +$('.page-container:last').data('page')
        if (!self.isThreadLoading && page < self.activeThread.total_page && !$('body').hasClass('uk-offcanvas-page')) {
          self.handleLoadMore(page + 1)
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
  line-height: 1.5;

  .white-theme & {
    /*box-shadow: 0 1px 4px rgba(0,0,0,.15);*/
    border: 1px solid #ddd;
    background: #fafafa;
  }

  img {
    vertical-align: text-bottom;
  }

  small {
    font-size: 80%;
  }
}

.bottom-bar {
  position: fixed;
  box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.3);
  background: rgba(#222, 0.5);
  backdrop-filter: blur(10px);
  left: 0;
  bottom: 0;
  width: 100%;
  font-size: 14px;
  z-index: 999;

  .white-theme & {
    background: rgba(#222, 0.7);
  }

  .page-switcher {
    color: #e6e6e6;
  }
}

.navigation-bar {
  background: #2d2d2d;

  @media(max-width: 767px) {
    margin: 0 -15px;
  }

  .white-theme & {
    /*box-shadow: 0 1px 4px rgba(0,0,0,.15);*/
    border: 1px solid #ddd;
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

      @media(max-width: 375px) {
        padding: 0 10px;
      }
    }
  }

  .page-switcher {
    height: 50px;
    padding: 0 15px;
    line-height: 50px;
    cursor: pointer;

    @media(max-width: 375px) {
      padding: 0 10px;
    }

    .is-active {
      background: #eee;
      font-weight: bold;
    }
  }
}

.more-link {
  display: block;
  height: 50px;
  padding: 0 15px;
  line-height: 50px;

  @media(max-width: 375px) {
    padding: 0 10px;
  }
}

.photo-mode-container {
  position: fixed;
  background: #222;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;

  .white-theme & {
    background: #f1f1f1;
  }

  .photo-mode-header {
    box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.3);
    background: #333;
    padding: 0 15px;
    line-height: 40px;

    .white-theme & {
      color: #e6e6e6;
    }
  }

  .photo-mode-body {
    position: absolute;
    top: 40px;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 15px 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .image-container {
      background-size: cover;
      background-position: center center;
      background-color: #333;
      width: 100%;
      padding-bottom: 100%;
      margin-bottom: 15px;

      .white-theme & {
        background: #ddd;
      }
    }
  }
}

.rating-number {
  font-size: 10px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all .3s ease;
}

.slide-enter,
.slide-leave-active {
  transform: translateY(100%);
}
</style>
