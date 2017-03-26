<template>
  <div id="app" :class="{'is-safari': isSafari}">

    <navbar />

    <div class="uk-container uk-container-center uk-margin-top uk-margin-bottom">
      <div class="uk-alert" data-uk-alert>
        <a href="#" class="uk-alert-close uk-close"></a>
        <p>LIHKG網站現已推出 (已有回覆功能): <a href="https://lihkg.com/" target="_blank">https://lihkg.com/</a></p>
      </div>
      <router-view></router-view>
    </div>
    
    <offcanvas />

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
      <div class="settings-toggle">
        <label for="white-mode">白底</label>
        <input class="tgl tgl-light" id="white-mode" type="checkbox" :checked="whiteTheme" @change="toggleWhiteTheme" />
        <label class="tgl-btn" for="white-mode"></label>
      </div>
      <div class="settings-toggle">
        <label for="office-mode">公司模式</label>
        <input class="tgl tgl-light" id="office-mode" type="checkbox" :checked="officeMode" @change="toggleOfficeMode" />
        <label class="tgl-btn" for="office-mode"></label>
      </div>
      <div class="settings-toggle">
        <label for="autoload-image">自動撈圖</label>
        <input class="tgl tgl-light" id="autoload-image" type="checkbox" :checked="autoLoadImage" @change="toggleAutoLoadImage" />
        <label class="tgl-btn" for="autoload-image"></label>
      </div>
      <div class="settings-toggle">
        <label for="youtube-preview">YouTube預覽</label>
        <input class="tgl tgl-light" id="youtube-preview" type="checkbox" :checked="youtubePreview" @change="toggleYoutubePreview" />
        <label class="tgl-btn" for="youtube-preview"></label>
      </div>
      <a class="settings-toggle" @click.prevent="resetThreadHistory">
        清除睇post記錄
      </a>
    </modal>

  </div>
</template>

<script>
/* global $ */
import FastClick from 'fastclick'
import { mapActions, mapState, mapMutations } from 'vuex'
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
      ] : []
    }
  },
  computed: {
    ...mapState({
      activeCategory: state => state.categories.category,
      activeThread: state => state.threads.activeThread,
      allCategories: state => state.categories.categories,
      officeMode: state => state.settings.officeMode,
      whiteTheme: state => state.settings.whiteTheme,
      autoLoadImage: state => state.settings.autoLoadImage,
      youtubePreview: state => state.settings.youtubePreview,
      iconMap: state => state.settings.iconMap
    }),
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
    ...mapMutations({
      toggleWhiteTheme: 'TOGGLE_WHITE_THEME',
      toggleOfficeMode: 'TOGGLE_OFFICE_MODE',
      toggleAutoLoadImage: 'TOGGLE_AUTO_LOAD_IMAGE',
      toggleYoutubePreview: 'TOGGLE_YOUTUBE_PREVIEW',
      resetThreadHistory: 'RESET_THREAD_HISTORY'
    })
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

<style lang="scss">
html {
  background: #222;
  box-sizing: border-box;
  font-size: 16px;
  font-family: "Helvetica Neue", "Helvetica", Arial, Microsoft JhengHei, sans-serif;

  &.white-theme {
    background: #f1f1f1;
  }
}

*, *:after, *:before {
  box-sizing: inherit;
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

  .white-theme & {
    color: #444;
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

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, .4);
  background-clip: padding-box;

  &:hover {
    background-color: rgba(128, 128, 128, .6);
  }
}


.settings-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #444;
  color: #f1c40f;

  .white-theme & {
    border-bottom: 1px solid #ddd;
    color: #222;
  }

  &:last-child {
    border-bottom: 0;
  }
}

.tgl {
	display: none;

	+ .tgl-btn {
		outline: 0;
		display: block;
		width: 3em;
		height: 1.5em;
		position: relative;
		cursor: pointer;
    user-select: none;
		&:after,
    &:before {
			position: relative;
			display: block;
			content: "";
			width: 50%;
			height: 100%;
		}

		&:after {
			left: 0;
		}

		&:before {
			display: none;
		}
	}

	&:checked + .tgl-btn:after {
		left: 50%;
	}
}

.tgl-light {
	+ .tgl-btn {
		background: #444;
		border-radius: 1.5em;
		padding: 2px;
		transition: all .4s ease;
		&:after {
			border-radius: 50%;
			background: #888;
			transition: all .2s ease;

      .white-theme & {
        background: #fff;
      }
		}

    .white-theme & {
      background: #ddd;
    }
	}

	&:checked {
  	+ .tgl-btn {
  		background: #f1c40f;
      &:after {
        background: #fff;
      }

      .white-theme & {
        background: #86d993;
      }
  	}
  }
}
</style>
