<template>
  <div id="app" :class="{'white-theme': whiteTheme, 'is-safari': isSafari}">

    <navbar></navbar>

    <div class="uk-container uk-container-center uk-margin-top uk-margin-bottom">
      <!-- <div class="uk-alert" data-uk-alert>
        <a href="#" class="uk-alert-close uk-close"></a>
        <p>收到巴打通知hkg.plus redirect左黎呢個網，我想係到澄清本站同hkg.plus絕無任何關係。</p>
      </div> -->
      <router-view></router-view>
    </div>

    <offcanvas></offcanvas>

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
        <a class="theme-toggle settings-toggle" @click.prevent="toggleWhiteTheme">
          白底 {{ whiteTheme ? 'ON' : 'OFF' }}
        </a>
        <a class="auto-load-image-toggle settings-toggle" @click.prevent="toggleAutoLoadImage">
          自動撈圖 {{ autoLoadImage ? 'ON' : 'OFF' }}
        </a>
        <a class="settings-toggle" @click.prevent="resetThreadHistory">
          清除睇post記錄
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import FastClick from 'fastclick'
import { mapActions } from 'vuex'
import Navbar from './components/Navbar'
import Offcanvas from './components/Offcanvas'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)
}

export default {
  name: 'app',
  components: {
    Navbar,
    Offcanvas
  },
  computed: {
    allCategories () {
      return this.$store.state.categories.categories
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
      'fetchCategories'
    ]),
    toggleWhiteTheme () {
      this.$store.commit('TOGGLE_WHITE_THEME')
    },
    toggleAutoLoadImage () {
      this.$store.commit('TOGGLE_AUTO_LOAD_IMAGE')
    },
    resetThreadHistory () {
      this.$store.commit('RESET_THREAD_HISTORY')
      window.alert('底已洗')
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

<style lang="stylus">
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

.uk-dropdown-scrollable {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.uk-nav-dropdown {
  line-height: 20px;

  >li>a:focus, >li>a:hover {
    background: #f1c40f;
  }
}

.settings-toggle {
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
</style>
