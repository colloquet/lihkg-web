<template>
  <div id="app" :class="{'is-safari': isSafari}">

    <navbar></navbar>

    <div class="uk-container uk-container-center uk-margin-top uk-margin-bottom">
      <div class="uk-alert" data-uk-alert>
        <a href="#" class="uk-alert-close uk-close"></a>
        <p>LIHKG網站現已推出 (已有回覆功能): <a href="https://lihkg.com/" target="_blank">https://lihkg.com/</a></p>
      </div>
      <router-view></router-view>
    </div>

    <offcanvas></offcanvas>

    <modal id="modal-about">
      嗚謝：
      <ul>
        <li>連尼住巴打</li>
        <li>HKG+巴打</li>
        <li>望遠巴打</li>
        <li><a href="https://na.cx" target="_blank">https://na.cx</a></li>
      </ul>
      <p>Made in Hong Kong by <a href="http://colloquet.github.io" target="_blank">Coke_Zero</a></p>
      <p>View source code on GitHub: <a href="https://github.com/colloquet/lihkg-web" target="_blank">https://github.com/colloquet/lihkg-web</a></a></p>
    </modal>

    <modal id="modal-setting">
      <a class="theme-toggle settings-toggle" @click.prevent="toggleWhiteTheme">
        白底 {{ whiteTheme ? 'ON' : 'OFF' }}
      </a>
      <a class="auto-load-image-toggle settings-toggle" @click.prevent="toggleOfficeMode">
        公司模式 {{ officeMode ? 'ON' : 'OFF' }}
      </a>
      <a class="settings-toggle" @click.prevent="resetThreadHistory">
        清除睇post記錄
      </a>
    </modal>

  </div>
</template>

<script>
/* global $ */
import FastClick from 'fastclick'
import { mapActions } from 'vuex'
import Navbar from './components/Navbar'
import Offcanvas from './components/Offcanvas'
import Modal from './components/Modal'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)
}

export default {
  name: 'app',
  components: {
    Navbar,
    Offcanvas,
    Modal
  },
  metaInfo () {
    return {
      title: this.title || '載入中',
      titleTemplate: this.officeMode ? null : '%s | LIHKG 討論區',
      link: this.officeMode ? [
        { rel: 'shortcut icon', href: 'https://www.google.com.hk/images/branding/product/ico/googleg_lodp.ico' }
      ] : null
    }
  },
  computed: {
    activeCategory () {
      return this.$store.state.categories.category
    },
    activeThread () {
      return this.$store.state.threads.activeThread
    },
    allCategories () {
      return this.$store.state.categories.categories
    },
    whiteTheme () {
      return this.$store.state.settings.whiteTheme
    },
    officeMode () {
      return this.$store.state.settings.officeMode
    },
    isSafari () {
      return navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1
    },
    title () {
      if (this.officeMode) {
        return 'Google'
      } else {
        if (this.$route.name === 'Category') {
          return this.activeCategory.name
        } else if (this.$route.name === 'Thread') {
          return this.activeThread.title
        } else {
          return '主頁'
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'fetchCategories'
    ]),
    toggleWhiteTheme () {
      this.$store.commit('TOGGLE_WHITE_THEME')
    },
    toggleOfficeMode () {
      this.$store.commit('TOGGLE_OFFICE_MODE')
    },
    resetThreadHistory () {
      this.$store.commit('RESET_THREAD_HISTORY')
      window.alert('底已洗')
    }
  },
  watch: {
    whiteTheme (newVal, oldVal) {
      if (newVal) {
        $('html').addClass('white-theme')
      } else {
        $('html').removeClass('white-theme')
      }
    }
  },
  mounted () {
    if (!this.allCategories.length) {
      this.fetchCategories()
    }

    if (this.whiteTheme) {
      $('html').addClass('white-theme')
    } else {
      $('html').removeClass('white-theme')
    }
  }
}
</script>

<style lang="stylus">
html {
  background: #222;
  font-size: 16px;
  font-family: "Helvetica Neue", "Helvetica", Arial, Microsoft JhengHei, sans-serif;

  &.white-theme {
    background: #f1f1f1;
  }
}

#app {
  background: #222;
  color: #e6e6e6;
  padding: 50px 0;


  .white-theme & {
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

  > blockquote {
    > blockquote {
      > blockquote {
        display: none;
      }
    }
  }
}

.uk-container {
  max-width: 980px;
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
    color: #222;
  }

  &:last-child {
    border-bottom: 0;
  }
}
</style>
