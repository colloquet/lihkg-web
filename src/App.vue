<template>
  <div id="app" :class="{'white-theme': whiteTheme}">

    <nav class="uk-flex uk-flex-space-between navbar">
      <a href="#offcanvas-categories" class="sidebar-toggle" data-uk-offcanvas="{mode:'none'}"><span class="uk-icon-bars"></span> {{ activeCategory ? activeCategory.name : '轉台' }}</a>

      <div class="refresh" v-if="$route.name === 'Category'">
        <a href="#" class="refresh-toggle" @click="handleRefresh"><span class="uk-icon-refresh"></span> F5</a>
      </div>

      <div class="nav-title" v-if="$route.name === 'Thread'">
        <span>{{ activeThread ? activeThread.title : '載入中…' }}</span>
      </div>

      <div class="rating" v-if="activeThread && $route.name === 'Thread'">
        <span class="uk-icon-thumbs-up like-color"></span> {{ activeThread.like_count }}
        <span class="uk-icon-thumbs-down uk-margin-small-left dislike-color"></span> {{ activeThread.dislike_count }}
      </div>
    </nav>

    <div class="uk-container uk-container-center uk-margin-top uk-margin-bottom">
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
                <a class="theme-toggle" @click="toggleWhiteTheme">
                  白底 {{ whiteTheme ? 'ON' : 'OFF' }}
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
        </ul>
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
    },
    toggleWhiteTheme () {
      this.$store.commit('TOGGLE_WHITE_THEME')
    }
  },
  watch: {
    whiteTheme (newVal, oldVal) {
      window.localStorage.whiteTheme = newVal
    }
  },
  mounted () {
    const self = this
    if (!self.allCategories.length) {
      self.fetchCategories()
    }

    if (window.localStorage.whiteTheme === 'true') {
      this.$store.commit('TOGGLE_WHITE_THEME')
    }
  }
}
</script>

<style lang="scss">
html {
  background: #222;

  &.white-theme {
    background: #fbfbfb;
  }
}

#app {
  background: #222;
  color: #e6e6e6;
  padding: 40px 0 50px;


  &.white-theme {
    background: #fbfbfb;
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
  background: #3c3c3c;
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

.refresh-toggle {
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
}

.rating {
  flex-shrink: 0;
  height: 41px;
  padding: 0 15px;
  line-height: 40px;
  color: #e6e6e6;
}

.uk-offcanvas-bar {
  box-shadow: 1px 1px 4px 1px #000;

  &:after {
    display: none;
  }
}

.offcanvas-header {
  a {
    display: block;
    padding: 10px 15px;
    text-align: center;
  }
}
</style>
