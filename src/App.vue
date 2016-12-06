<template>
  <div id="app" :class="{'white-theme': whiteTheme, 'is-safari': isSafari}">

    <nav class="uk-flex uk-flex-space-between navbar">
      <a href="#offcanvas-categories" class="sidebar-toggle" data-uk-offcanvas="{mode:'none'}"><span class="uk-icon-bars"></span> {{ activeCategory ? activeCategory.name : '轉台' }}</a>

      <div v-if="$route.name === 'Category'">
        <router-link to="/search" class="search-toggle"><span class="uk-icon-search"></span> 搜尋</router-link>
        <a class="refresh-toggle" @click.prevent="handleRefresh"><span class="uk-icon-refresh"></span> F5</a>
      </div>

      <div class="nav-title" v-if="$route.name === 'Thread'" @click="goToTop">
        <span>{{ activeThread ? activeThread.title : '載入中…' }}</span>
      </div>

      <div class="rating" v-if="activeThread && $route.name === 'Thread'">
        <span class="uk-icon-thumbs-up like-color"></span> {{ activeThread.like_count }}
        <span class="uk-icon-thumbs-down uk-margin-small-left dislike-color"></span> {{ activeThread.dislike_count }}
      </div>
    </nav>

    <div class="uk-container uk-container-center uk-margin-top uk-margin-bottom">
      <!-- <div class="uk-alert" data-uk-alert>
        <a href="#" class="uk-alert-close uk-close"></a>
        <p>收到巴打通知hkg.plus redirect左黎呢個網，我想係到澄清本站同hkg.plus絕無任何關係。</p>
      </div> -->
      <router-view></router-view>
    </div>

    <div id="offcanvas-categories" class="uk-offcanvas">
      <div class="uk-offcanvas-bar">
        <ul class="uk-nav uk-nav-offcanvas">
          <li>
            <div class="uk-grid uk-grid-collapse offcanvas-header">
              <div class="uk-width-1-2" @click="closeOffcanvas">
                <router-link :to="'/category/1'">
                  LIHK 討論區
                </router-link>
              </div>
              <div class="uk-width-1-2">
                <a href="#modal-setting" data-uk-modal>
                  <span class="uk-icon-cog"></span> 設定
                </a>
              </div>
            </div>
          </li>
          <li
            v-for="category in allCategories"
            :key="category.cat_id"
            :class="{'uk-active': activeCategory ? category.cat_id === activeCategory.cat_id : false}"
            @click="closeOffcanvas">
            <router-link :to="'/category/' + category.cat_id">
              {{ category.name }}
            </router-link>
          </li>
          <li>
            <a href="#modal-about" data-uk-modal>關於本站</a>
          </li>
        </ul>
      </div>
    </div>

    <div id="modal-about" class="uk-modal">
      <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        嗚謝：
        <ul>
          <li>連尼住巴打</li>
          <li>HKG+巴打</li>
          <li>望遠巴打</li>
          <li><a href="https://na.cx" target="_blank">https://na.cx</a></li>
        </ul>
        <p>Made in Hong Kong by <a href="http://colloquet.github.io" target="_blank">Coke_Zero</a></p>
        <p>View source code on GitHub: <a href="https://github.com/colloquet/lihkg-web" target="_blank">https://github.com/colloquet/lihkg-web</a></a></p>
      </div>
    </div>

    <div id="modal-setting" class="uk-modal">
      <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <a class="theme-toggle toggle" @click.prevent="toggleWhiteTheme">
          白底 {{ whiteTheme ? 'ON' : 'OFF' }}
        </a>
        <a class="auto-load-image-toggle toggle" @click.prevent="toggleAutoLoadImage">
          自動撈圖 {{ autoLoadImage ? 'ON' : 'OFF' }}
        </a>
        <a class="toggle" @click.prevent="resetThreadHistory">
          清除睇post記錄
        </a>
      </div>
    </div>
  </div>
</template>

<script>
/* global UIkit */
import FastClick from 'fastclick'
import { mapGetters, mapActions } from 'vuex'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)
}

export default {
  name: 'app',
  computed: {
    ...mapGetters([
      'activeCategory'
    ]),
    allCategories () {
      return this.$store.state.categories.categories
    },
    activeThread () {
      return this.$store.state.threads.activeThread
    },
    whiteTheme () {
      return this.$store.state.settings.whiteTheme
    },
    autoLoadImage () {
      return this.$store.state.settings.autoLoadImage
    },
    threadHistory () {
      return this.$store.state.settings.threadHistory
    },
    isSafari () {
      return navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1
    }
  },
  methods: {
    ...mapActions([
      'fetchCategories',
      'fetchThreadList'
    ]),
    closeOffcanvas () {
      UIkit.offcanvas.hide()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    handleRefresh () {
      this.fetchThreadList({
        catID: this.activeCategory.cat_id,
        page: 1
      })
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    toggleWhiteTheme () {
      this.$store.commit('TOGGLE_WHITE_THEME')
    },
    toggleAutoLoadImage () {
      this.$store.commit('TOGGLE_AUTO_LOAD_IMAGE')
    },
    resetThreadHistory () {
      this.$store.commit('RESET_THREAD_HISTORY')
      window.alert('底已洗')
    },
    goToTop () {
      UIkit.Utils.scrollToElement(UIkit.$('#app'))
    }
  },
  watch: {
    whiteTheme (newVal, oldVal) {
      window.localStorage.setItem('whiteTheme', newVal)
    },
    autoLoadImage (newVal, oldVal) {
      window.localStorage.setItem('autoLoadImage', newVal)
    }
  },
  mounted () {
    const self = this
    if (!self.allCategories.length) {
      self.fetchCategories()
    }

    if (window.localStorage.getItem('whiteTheme') === 'true') {
      this.$store.commit('TOGGLE_WHITE_THEME')
    }

    if (window.localStorage.getItem('autoLoadImage') === 'true') {
      this.$store.commit('TOGGLE_AUTO_LOAD_IMAGE')
    }

    if (window.localStorage.getItem('threadHistory')) {
      this.$store.commit('SET_THREAD_HISTORY', JSON.parse(window.localStorage.getItem('threadHistory')))
    }

    // if (document.referrer.indexOf('hkg.plus') >= 0) {
    //   window.location.replace('http://hkgolden.com')
    // }
  }
}
</script>

<style lang="scss">
html {
  background: #222;
  font-size: 16px;

  &.white-theme {
    background: #f1f1f1;
  }
}

#app {
  background: #222;
  color: #e6e6e6;
  padding: 40px 0 50px;


  &.white-theme {
    background: #f1f1f1;
    color: #444;
  }
}

a {
  color: #f1c40f;

  &:hover, &:focus, &:active {
    color: darken(#f1c40f, 2%);
  }
}

h1, ,h2, h3, h4, h5, h6 {
  color: inherit;
}

blockquote {
  border-left: 1px solid #585858;
  font-style: normal;
  font-size: inherit;
  line-height: inherit;
  color: #888;
}

.uk-container {
  padding: 0 15px;
}

.navbar {
  position: fixed;
  box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.3);
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(#222, 0.5);
  backdrop-filter: blur(10px);
  z-index: 999;
}

.sidebar-toggle {
  flex-shrink: 0;
  border-right: 1px solid #757575;
  // color: #e6e6e6;
  height: 40px;
  padding: 0 15px;
  line-height: 40px;
  text-decoration: none;

  &:hover, &:focus, &:active {
    text-decoration: none;
  }
}

.refresh-toggle, .search-toggle {
  display: inline-block;
  border-left: 1px solid #757575;
  height: 40px;
  padding: 0 15px;
  line-height: 40px;
}

.nav-title {
  border-right: 1px solid #757575;
  padding: 0 15px;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 40px;
  color: #e6e6e6;
  cursor: pointer;
}

.rating {
  flex-shrink: 0;
  height: 40px;
  padding: 0 15px;
  line-height: 40px;
  color: #e6e6e6;
}

.uk-offcanvas-bar {
  box-shadow: 1px 1px 4px 1px #000;

  &:after {
    display: none;
  }

  .is-safari & {
    background: rgba(#222, 0.7);
    backdrop-filter: blur(10px);
  }
}

.offcanvas-header {
  a {
    display: block;
    padding: 10px 15px;
    text-align: center;
  }
}

.uk-alert {
  background: #2d2d2d;
  border: 1px solid #444;
  color: #e6e6e6;
  text-shadow: none;

  .white-theme & {
    background: #fafafa;
    border: 1px solid #ddd;
    color: #444;
  }
}

.uk-modal {
  .uk-modal-dialog {
    background: #2b2b2b;

    .white-theme & {
      background: #f1f1f1;
    }
  }
}

.uk-close {
  color: #f1c40f;
  opacity: 1;
}

.toggle {
  display: block;
  padding: 15px;
  border-bottom: 1px solid #444;

  .white-theme & {
    border-bottom: 1px solid #ddd;
  }

  &:last-child {
    border-bottom: 0;
  }
}

.uk-dropdown-scrollable {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
