<template>
  <div class="uk-text-center comment" v-if="!activeThread.thread_id">
    <span class="uk-icon-spin uk-icon-spinner"></span>
    載入中
  </div>
  <div v-else>
    <div class="page-container" v-for="(comments, page) in activeThread.item_page" :id="`page-${page}`" data-uk-scrollspy :data-page="page">
      <thread-navbar
        :page="page"
        :categoryName="activeCategory.name || activeThread.category.name"
        :back="backToThreadList"
        :totalPage="activeThread.total_page"
        :hasPrevPage="hasPrevPage(page)"
        :hasNextPage="hasNextPage(page)"
        :handlePageSwitch="handlePageSwitch"
        :handlePageSwitchFromSelect="handlePageSwitchFromSelect"
      />

      <div class="comments-container" :class="{'is-loading': isThreadLoading}">
        <ul class="uk-grid">
          <li class="uk-width-1-1 uk-margin-bottom" v-for="(comment, index) in comments" :id="index % 25 == 0 ? `page-${comment.page}` : ''">
            <div class="comment">
              <p>
                <small>
                  <span class="uk-text-muted" :class="{'author': activeThread.user.user_id === comment.user.user_id}">#{{ getCommentIndex(index, page) }}</span>
                  <span :class="comment.user.level === '999' ? 'admin' : comment.user.gender === 'M' ? 'male' : 'female'">{{ comment.user_nickname }}</span>
                  <span class="uk-text-muted">// {{ getRelativeTime(comment.reply_time) }}</span>
                  <span class="uk-icon-eye uk-float-right story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-if="storeyModeId === -1"></span>
                  <span class="uk-icon-eye-slash uk-float-right story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-else></span>
                </small>
              </p>
              <div v-html="prepareCommentMsg(comment.msg)" v-show="comment.user.user_id === storeyModeId || storeyModeId === -1"></div>
            </div>
          </li>
        </ul>
      </div>

      <thread-navbar
        :page="page"
        :categoryName="activeCategory.name || activeThread.category.name"
        :back="backToThreadList"
        :totalPage="activeThread.total_page"
        :hasPrevPage="hasPrevPage(page)"
        :hasNextPage="hasNextPage(page)"
        :handlePageSwitch="handlePageSwitch"
        :handlePageSwitchFromSelect="handlePageSwitchFromSelect"
      />

      <p class="uk-text-center" v-if="page >= activeThread.total_page">
        <button class="uk-button uk-button-large refresh-button" @click="handleRefresh">F5</button>
      </p>
    </div>


    <div class="uk-visible-small bottom-bar">
      <div class="uk-grid uk-grid-collapse">
        <div class="uk-width-1-6">
          <a class="return-link" v-if="activeCategory" @click.prevent="backToThreadList">
            <span class="uk-icon-reply"></span>
          </a>
        </div>
        <div class="uk-width-1-6 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <span class="uk-icon-thumbs-up"></span><span class="rating-number">{{ activeThread.like_count }}</span>
        </div>
        <div class="uk-width-1-6 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <span class="uk-icon-thumbs-down"></span><span class="rating-number">{{ activeThread.dislike_count }}</span>
        </div>
        <div class="uk-width-1-6">
          <a class="action-link" @click.prevent="enablePhotoMode">
            <span class="uk-icon-image"></span>
          </a>
        </div>
        <div class="uk-width-1-6" data-uk-dropdown="{mode:'click', pos: 'bottom-right'}">
          <a>
            <span class="uk-icon-qrcode"></span>
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
      <photo-gallery
        v-if="photoMode"
        @onClose="disablePhotoMode"
        :noImages="noImages"
        :images="images"
      />
    </transition>
  </div>
</template>

<script>
/* global $, UIkit, Image */
import qrCode from 'qrcode-npm'
import ThreadNavbar from '../components/ThreadNavbar'
import PhotoGallery from '../components/PhotoGallery'
import lihkg from '../api/lihkg'
import helper from '../helper'

export default {
  name: 'Thread',
  components: {
    ThreadNavbar,
    PhotoGallery
  },
  data () {
    return {
      isThreadLoading: false,
      fromThreadList: false,
      images: [],
      noImages: false,
      storeyModeId: -1
    }
  },
  computed: {
    activeCategory () {
      return this.$store.state.categories.category
    },
    activeThread () {
      return this.$store.state.threads.activeThread
    },
    threadId () {
      return this.$store.state.route.params.id
    },
    officeMode () {
      return this.$store.state.settings.officeMode
    },
    autoLoadImage () {
      return this.$store.state.settings.autoLoadImage
    },
    youtubePreview () {
      return this.$store.state.settings.youtubePreview
    },
    iconMap () {
      return this.$store.state.settings.iconMap
    },
    photoMode () {
      return this.$store.state.threads.photoMode
    },
    pageNumber: {
      get () {
        return +this.$store.state.route.params.page || 1
      },
      set (page) {
        this.$router.replace(`/thread/${this.threadId}/page/${page}`)
      }
    },
    lastLoadedPage () {
      return +Object.keys(this.activeThread.item_page)[Object.keys(this.activeThread.item_page).length - 1]
    }
  },
  methods: {
    fetchThread (page, scroll = false, refresh = false) {
      const self = this

      self.pageNumber = page

      // if page already loaded, scroll to page
      if (!refresh && self.activeThread.item_page && typeof self.activeThread.item_page[page] !== 'undefined') {
        UIkit.Utils.scrollToElement($(`#page-${page}`), { offset: 50 + 10 })
        return false
      }

      self.isThreadLoading = true
      lihkg.fetchThread(self.threadId, page).then(response => {
        self.isThreadLoading = false

        if (!self.activeCategory) {
          self.$store.commit('SET_ACTIVE_CATEGORY', response.data.response.category)
        }

        self.$store.commit('APPEND_ACTIVE_THREAD', response.data.response)

        if (scroll) {
          setTimeout(() => {
            UIkit.Utils.scrollToElement($(`#page-${page}`), { offset: 50 + 10 })
          }, 100)
        }

        self.$store.commit('UPDATE_HISTORY', {
          id: response.data.response.thread_id,
          page: page,
          no_of_reply: response.data.response.no_of_reply
        })
      }).catch((e) => {
        console.log(e)
        window.alert('伺服器出錯，請重試。')
      })
    },
    prepareCommentMsg (msg) {
      const self = this

      while (msg.indexOf('src="/assets') > 0) {
        msg = msg.replace('src="/assets', 'src="https://lihkg.com/assets')
      }
      msg = msg.replace(/<\/blockquote><br\s?\/>/g, '</blockquote>')

      const dom = document.createElement('div')
      const qsa = selector => {
        const nodeList = dom.querySelectorAll(selector)
        const array = []
        for (let i = 0; i < nodeList.length; i++) {
          array[i] = nodeList[i]
        }
        return array
      }
      dom.innerHTML = msg

      if (self.officeMode) {
        const icons = qsa('img.hkgmoji')
        icons.forEach(i => {
          const code = i.src.match(/faces\/(.*)\//)[1]
          const uri = i.src.split('lihkg.com/')[1]
          i.outerHTML = self.iconMap[code][uri]
        })
      }

      if (!self.autoLoadImage) {
        const images = qsa('img:not(.hkgmoji)')
        images.forEach(i => {
          i.setAttribute('data-src', i.src)
          i.src = '/static/placeholder.png'
          i.className = 'image-lazy-load'
        })
      }

      if (self.youtubePreview) {
        const youtubeLinks = qsa('a[href*="youtu"]')
        youtubeLinks.forEach(link => {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/
          const match = link.href.match(regExp)
          if (match && match[2].length === 11) {
            const iframe = document.createElement('iframe')
            const embedContainer = document.createElement('div')
            const responsiveContainer = document.createElement('div')
            const lineBreak = document.createElement('br')
            embedContainer.className = 'embed-container'
            responsiveContainer.className = 'responsive-container'
            iframe.width = 560
            iframe.height = 315
            iframe.src = 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0&enablejsapi=1'
            iframe.frameBorder = 0
            iframe.allowFullscreen = true
            embedContainer.appendChild(iframe)
            responsiveContainer.appendChild(embedContainer)
            link.parentNode.insertBefore(responsiveContainer, link.nextSibling)
            link.parentNode.insertBefore(lineBreak, link.nextSibling)
          }
        })
      }

      return dom.innerHTML
    },
    pageAppLink () {
      const threadId = this.$store.state.route.params.id
      const currentPage = +this.$store.state.route.params.page || 1
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
    getCommentIndex (index, page) {
      return index + ((page - 1) * 25)
    },
    getRelativeTime (timestamp) {
      return helper.getRelativeTime(timestamp)
    },
    toggleStoryMode (userId) {
      this.storeyModeId = this.storeyModeId === -1 ? userId : -1
    },
    backToThreadList () {
      if (this.fromThreadList) {
        this.$router.back()
      } else {
        this.$router.push(`/category/${this.activeCategory.cat_id}`)
      }
    },
    handlePageSwitch (page) {
      this.fetchThread(page, true)
    },
    handlePageSwitchFromSelect (event) {
      this.fetchThread(event.target.value, true)
    },
    handleLoadMore (page) {
      this.fetchThread(page, false)
    },
    handleRefresh () {
      this.fetchThread(this.lastLoadedPage, false, true)
    },
    handleScrollBottom () {
      $('html, body').animate({ scrollTop: $(document).height() }, 1000)
    },
    enablePhotoMode () {
      this.$store.commit('SET_PHOTO_MODE', true)
    },
    disablePhotoMode () {
      this.$store.commit('SET_PHOTO_MODE', false)
    }
  },
  watch: {
    photoMode (newVal, oldVal) {
      const self = this
      if (newVal && !self.images.length && !self.noImages) {
        lihkg.fetchImages(self.threadId).then((response) => {
          if (response.data.response.images.length) {
            self.images = response.data.response.images
            self.noImages = false
          } else {
            self.noImages = true
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    }
  },
  mounted () {
    const self = this

    this.$store.commit('SET_ACTIVE_THREAD', {})

    if (this.activeCategory) {
      this.fromThreadList = true
    }

    this.fetchThread(this.pageNumber)

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
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        if (!self.isThreadLoading && !$('body').hasClass('uk-offcanvas-page')) {
          if (self.lastLoadedPage < self.activeThread.total_page) {
            self.handleLoadMore(self.lastLoadedPage + 1)
          }
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
  opacity: 0.7;
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
  color: #f1c40f;

  .white-theme & {
    background: rgba(#fff, 0.8);
    color: #222;

    a {
      color: #222;
    }
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

    select {
      bottom: 0;
      left: 0;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%!important;
      height: 100%!important;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      cursor: pointer;
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

.refresh-button {
  .white-theme & {
    background: #fff;
    border: 1px solid #ddd;
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

.responsive-container {
  display: inline-block;
  max-width: 560px;
  width: 100%;
}
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;

  iframe,
  object,
  embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}


.rating-number {
  margin-top: 5px;
  font-size: 10px;
  line-height: 1;
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
