<template>
  <div class="comments-container" v-if="!activeThread.thread_id">
    <div class="uk-text-center comment">
      <span class="uk-icon-spin uk-icon-spinner"></span>
      載入中
    </div>
  </div>
  <div v-else>
    <div class="page-container" v-for="(comments, page) in activeThread.item_page" :id="`page-${page}`" :data-page="page">
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

      <div class="comments-container">
        <ul class="uk-grid">
          <comment-item
            v-for="(comment, index) in comments"
            v-if="+comment.status === 1"
            :index="index"
            :comment="comment"
            :isAuthor="activeThread.user.user_id === comment.user.user_id"
            :toggleStoryMode="toggleStoryMode"
            :prepareCommentMsg="prepareCommentMsg"
            :storeyModeId="storeyModeId"
            :threadLikeCount="activeThread.like_count"
            :threadDislikeCount="activeThread.dislike_count"
          ></comment-item>
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

    <div class="comments-container" v-if="isThreadLoading">
      <div class="uk-text-center comment">
        <span class="uk-icon-spin uk-icon-spinner"></span>
        載入中
      </div>
    </div>

    <div class="uk-visible-small bottom-bar">
      <div class="actions">
        <div class="action">
          <a href="#offcanvas-categories" data-uk-offcanvas="{mode:'slide'}">
            <span class="uk-icon-bars"></span>
          </a>
        </div>
        <div class="action uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <span class="uk-icon-thumbs-up"></span><span class="rating-number">{{ activeThread.like_count }}</span>
        </div>
        <div class="action uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <span class="uk-icon-thumbs-down"></span><span class="rating-number">{{ activeThread.dislike_count }}</span>
        </div>
        <div class="action">
          <a class="action-link" @click.prevent="setPhotoMode(true)">
            <span class="uk-icon-image"></span>
          </a>
        </div>
        <div class="action" data-uk-dropdown="{mode:'click', pos: 'bottom-right'}">
          <a>
            <span class="uk-icon-qrcode"></span>
          </a>
          <div class="uk-dropdown-blank mobile-entry-popup">
            <a :href="currentThreadLink" target="_blank"><div class="row"><span class="uk-icon-external-link"></span> 電話繼續追</div></a>
            <div class="row" v-html="qr()"></div>
          </div>
        </div>
        <div class="action">
          <a class="action-link" @click.prevent="handleScrollBottom">
            <span class="uk-icon-arrow-down"></span>
          </a>
        </div>
      </div>
    </div>

    <transition name="slide">
      <photo-gallery
        v-if="photoMode"
        :noImages="noImages"
        :images="images"
        :isImagesLoading="isImagesLoading"
        @image-click="handleImageClick"
        @onClose="setPhotoMode(false)"
      />
    </transition>

    <transition name="fade">
      <div class="uk-flex uk-flex-center uk-flex-middle overlay" v-if="isImagesLoading && noImages">
        <span class="uk-icon-spin uk-icon-spinner"></span>
      </div>
    </transition>
  </div>
</template>

<script>
/* global $, UIkit, Image */
import { mapState, mapGetters, mapMutations } from 'vuex'
import qrCode from 'qrcode-npm'
import ThreadNavbar from '../components/ThreadNavbar'
import PhotoGallery from '../components/PhotoGallery'
import CommentItem from '../components/CommentItem'
import lihkg from '../api/lihkg'

export default {
  name: 'Thread',
  components: {
    ThreadNavbar,
    PhotoGallery,
    CommentItem
  },
  data () {
    return {
      isThreadLoading: false,
      isImagesLoading: false,
      fromThreadList: false,
      images: [],
      noImages: true,
      storeyModeId: -1
    }
  },
  computed: {
    ...mapState({
      activeCategory: state => state.categories.category,
      activeThread: state => state.threads.activeThread,
      photoMode: state => state.threads.photoMode,
      threadId: state => state.route.params.id,
      officeMode: state => state.settings.officeMode,
      autoLoadImage: state => state.settings.autoLoadImage,
      youtubePreview: state => state.settings.youtubePreview,
      iconMap: state => state.settings.iconMap
    }),
    ...mapGetters([
      'lastLoadedPage'
    ]),
    pageNumber: {
      get () {
        return +this.$store.state.route.params.page || 1
      },
      set (page) {
        this.$router.replace(`/thread/${this.threadId}/page/${page}`)
      }
    },
    currentThreadLink () {
      return `https://lihkg.com/thread/${this.threadId}/page/${this.pageNumber}?ref=lihk-firebase`
    },
    imagesForLightbox () {
      const self = this
      return self.images.map((image, index) => ({
        source: image.url,
        type: 'image',
        title: `${index + 1} / ${self.images.length}`
      }))
    }
  },
  methods: {
    ...mapMutations({
      resetThread: 'RESET_THREAD',
      setPhotoMode: 'SET_PHOTO_MODE',
      setActiveCategory: 'SET_ACTIVE_CATEGORY',
      setActiveThread: 'SET_ACTIVE_THREAD',
      updateHistory: 'UPDATE_HISTORY'
    }),
    async fetchThread (page, scroll = false, refresh = false) {
      const self = this
      const isPageLoaded = self.activeThread.item_page && typeof self.activeThread.item_page[page] !== 'undefined'
      self.pageNumber = page

      // if page already loaded, scroll to page
      if (isPageLoaded && !refresh) {
        UIkit.Utils.scrollToElement($(`#page-${page}`), { offset: 50 + 10 })
        return
      }

      self.isThreadLoading = true
      try {
        const { data } = await lihkg.fetchThread(self.threadId, page)
        self.isThreadLoading = false
        if (!self.activeCategory) {
          self.setActiveCategory(data.response.category)
        }
        self.setActiveThread(data.response)
        self.updateHistory({
          id: data.response.thread_id,
          no_of_reply: data.response.no_of_reply,
          page
        })
        if (scroll) {
          self.$nextTick(() => {
            UIkit.Utils.scrollToElement($(`#page-${page}`), { offset: 50 + 10 })
          })
        }
      } catch (e) {
        console.log(e)
        window.alert('伺服器出錯，請重試。')
      }
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
    qr () {
      try {
        const qr = qrCode.qrcode(4, 'M')
        qr.addData(this.currentThreadLink)
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
    toggleStoryMode (userId) {
      this.storeyModeId = this.storeyModeId === -1 ? userId : -1
    },
    backToThreadList () {
      if (this.fromThreadList) {
        this.$router.back()
      } else {
        this.$router.push(`/category/${this.activeThread.category.cat_id}`)
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
    async fetchImages () {
      const self = this
      self.isImagesLoading = true
      try {
        const { data } = await lihkg.fetchImages(self.threadId)
        if (data.response.images.length) {
          self.images = data.response.images
          self.noImages = false
        } else {
          self.noImages = true
        }
      } catch (e) {
        console.log(e)
      }
      self.isImagesLoading = false
    },
    async handleImageClick (e) {
      const url = e.target ? e.target.src : e
      if (!this.images.length) {
        await this.fetchImages()
      }
      this.lightbox = UIkit.lightbox.create(this.imagesForLightbox)
      const index = this.imagesForLightbox.findIndex(image => image.source === decodeURIComponent(url))
      this.lightbox.show(index)
    },
    handlePlaceholderClick (e) {
      const target = $(e.target)
      const src = target.data('src')
      let newImg = new Image()

      target.attr('src', '/static/loading.png')

      newImg.onload = () => {
        target.attr('src', src)
        target.removeClass('image-lazy-load')
      }
      newImg.onerror = () => {
        target.attr('src', src)
      }
      newImg.src = src
    },
    handleOnScroll () {
      if ((window.innerHeight + (window.scrollY || window.pageYOffset)) >= document.body.offsetHeight - 200) {
        if (!this.isThreadLoading && !$('body').hasClass('uk-offcanvas-page')) {
          if (this.lastLoadedPage < this.activeThread.total_page) {
            this.handleLoadMore(this.lastLoadedPage + 1)
          }
        }
      }
    }
  },
  watch: {
    photoMode (newVal, oldVal) {
      if (newVal) {
        this.fetchImages()
      }
    }
  },
  mounted () {
    if (this.activeCategory.name) {
      this.fromThreadList = true
    }

    this.resetThread()
    this.setPhotoMode(false)
    this.fetchThread(this.pageNumber)

    $('body').on('click', '.image-lazy-load', this.handlePlaceholderClick)
    $('body').on('click', 'img:not(.image-lazy-load):not(.hkgmoji)', this.handleImageClick)
    $(window).on('scroll', this.handleOnScroll)
  },
  beforeDestroy () {
    $('body').off('click', '.image-lazy-load')
    $('body').off('click', 'img:not(.image-lazy-load):not(.hkgmoji)')
    $(window).off('scroll')
  }
}
</script>

<style lang="scss">
.comments-container {
  @media(max-width: 767px) {
    margin: 0 -15px;
  }
}

.is-loading {
  opacity: 0.5;
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

  .actions {
    display: flex;
  }
  .action {
    flex: 1;
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

  .white-theme & {
    background: rgba(#fff, 0.8);
    color: #222;

    a {
      color: #222;
    }
  }
}

.refresh-button {
  .white-theme & {
    background: #fff;
    border: 1px solid #ddd;
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

.image-lazy-load,
img:not(.image-lazy-load):not(.hkgmoji) {
  cursor: pointer;
}

.rating-number {
  margin-top: 5px;
  font-size: 10px;
  line-height: 1;
}

.overlay {
  position: fixed;
  background: rgba(#000, 0.5);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
}

.slide-enter-active,
.slide-leave-active {
  transition: all .3s ease;
}

.slide-enter,
.slide-leave-active {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
