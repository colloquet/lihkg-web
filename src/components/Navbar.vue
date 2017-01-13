<template>
  <nav class="uk-flex uk-flex-space-between navbar">
    <a href="#offcanvas-categories" class="sidebar-toggle" data-uk-offcanvas="{mode:'slide'}"><span class="uk-icon-bars"></span><span v-show="$route.name === 'Category'"> {{ activeCategory.name || '轉台' }}</span></a>

    <div v-show="$route.name === 'Category'">
      <a href="https://github.com/colloquet/lihkg-web" target="_blank" class="refresh-toggle"><span class="uk-icon-github"></span> GitHub</a>
      <router-link to="/search" class="uk-hidden-small search-toggle"><span class="uk-icon-search"></span> 搜尋</router-link>
      <a class="uk-hidden-small refresh-toggle" @click.prevent="handleRefresh"><span class="uk-icon-refresh"></span> F5</a>
    </div>

    <div class="nav-title" v-show="$route.name === 'Thread'" @click="goToTop">
      <span>{{ activeThread ? activeThread.title : '載入中…' }}</span>
    </div>

    <div class="uk-hidden-small nav-item" v-show="activeThread && $route.name === 'Thread'">
      <span class="uk-icon-thumbs-up like-color"></span> {{ activeThread.like_count }}
      <span class="uk-icon-thumbs-down uk-margin-small-left dislike-color"></span> {{ activeThread.dislike_count }}
    </div>

    <div class="uk-hidden-small nav-item" v-show="$route.name === 'Thread'">
      <a @click.prevent="enablePhotoMode">
        <span class="uk-icon-image"></span> 圖片模式
      </a>
    </div>

    <div class="uk-hidden-small nav-item" data-uk-dropdown="{mode:'click', pos: 'bottom-right'}" v-show="activeThread && $route.name === 'Thread'">
      <a>
        <span class="uk-icon-qrcode like-color"></span><span class="uk-hidden-small"> 開APP</span>
      </a>
      <div class="uk-dropdown-blank mobile-entry-popup" v-show="activeThread && $route.name === 'Thread'">
        <a :href="pageAppLink()" target="_blank"><div class="row"><span class="uk-icon-external-link"></span> 電話繼續追</div></a>
        <div class="row" v-html="qr()"></div>
      </div>
    </div>

  </nav>
</template>

<script>
/* global UIkit */
import { mapActions } from 'vuex'
import qrCode from 'qrcode-npm'

export default {
  name: 'navbar',
  computed: {
    activeCategory () {
      return this.$store.state.categories.category
    },
    activeThread () {
      return this.$store.state.threads.activeThread
    }
  },
  methods: {
    ...mapActions([
      'fetchThreadList'
    ]),
    handleRefresh () {
      this.fetchThreadList({
        catId: this.activeCategory.cat_id,
        page: 1
      })
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    goToTop () {
      UIkit.Utils.scrollToElement(UIkit.$('#app'))
    },
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
    enablePhotoMode () {
      this.$store.commit('SET_PHOTO_MODE', true)
    }
  }
}
</script>

<style lang="stylus">
.navbar {
  position: fixed;
  box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.3);
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(#222, 0.5);
  backdrop-filter: blur(10px);
  z-index: 999;

  .white-theme & {
    background: rgba(#fff, 0.8);

    a {
      color: #222;
    }
  }
}

.sidebar-toggle {
  flex-shrink: 0;
  height: 50px;
  padding: 0 15px;
  line-height: 50px;
  text-decoration: none;

  @media(max-width: 375px) {
    padding: 0 10px;
  }

  &:hover, &:focus, &:active {
    text-decoration: none;
  }
}

.refresh-toggle, .search-toggle {
  display: inline-block;
  height: 50px;
  padding: 0 15px;
  line-height: 50px;

  @media(max-width: 375px) {
    padding: 0 10px;
  }
}

.nav-title {
  padding: 0 15px;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 50px;
  color: #e6e6e6;
  cursor: pointer;

  .white-theme & {
    color: #222;
  }
}

.nav-item {
  flex-shrink: 0;
  height: 50px;
  padding: 0 15px;
  line-height: 50px;
  color: #e6e6e6;

  .white-theme & {
    color: #222;
  }
}

.mobile-entry-popup {
  margin-top: 10px;
  width: 200px;

  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  background: #fafafa;
  word-wrap: break-word;

  .row {
   border-bottom: 1px solid rgba(0,0,0,.3);
   text-align: center;
   padding: 10px 15px;
   line-height: 1.5;
 }
}
</style>
