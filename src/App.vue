<template>
  <div id="app">
    <Navbar />

    <div id="route-container" class="route-container">
      <router-view></router-view>
    </div>

    <BottomBar v-if="isMobile" />

    <Drawer v-if="isMobile" />
    <CategoryMenu v-else />

    <Gallery v-if="showGallery" :media-list="mediaList" />
    <Lightbox v-if="mediaIndex !== null" :media-index="mediaIndex" />

    <SettingsModal v-if="showSettingsModal" @close="toggleSettingsModal" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import Navbar from './components/Navbar'
import BottomBar from './components/BottomBar'
import Drawer from './components/Drawer'
import CategoryMenu from './components/CategoryMenu'
import SettingsModal from './components/SettingsModal'

const Gallery = () => import('./components/Gallery/Gallery')
const Lightbox = () => import('./components/Lightbox')

export default {
  metaInfo() {
    const nightModeClass = this.nightMode ? 'night-mode' : ''
    const isMobileClass = this.isMobile ? 'is-mobile' : ''
    const isHoverableClass = this.isHoverable ? 'is-hoverable' : ''
    return {
      title: this.officeMode ? 'Google' : 'LIHKG',
      titleTemplate: this.officeMode ? null : '%s | LIHKG（非官方)',
      htmlAttrs: {
        class: `${nightModeClass} ${isMobileClass} ${isHoverableClass}`,
      },
      meta: [
        {
          name: 'theme-color',
          content: this.nightMode ? '#1b1b1b' : '#ffffff',
        },
      ],
      link: [
        this.officeMode
          ? {
              rel: 'shortcut icon',
              href:
                'https://www.google.com.hk/images/branding/product/ico/googleg_lodp.ico',
            }
          : {},
      ],
    }
  },
  components: {
    Navbar,
    BottomBar,
    Drawer,
    CategoryMenu,
    SettingsModal,
    Gallery,
    Lightbox,
  },
  computed: {
    ...mapState({
      isHoverable: state => state.app.isHoverable,
      isMobile: state => state.app.isMobile,
      officeMode: state => state.app.officeMode,
      nightMode: state => state.app.nightMode,
      showSettingsModal: state => state.ui.showSettingsModal,
      mediaList: state => state.thread.mediaList,
      mediaIndex: state => state.thread.mediaIndex,
      showGallery: state => state.ui.showGallery,
    }),
  },
  methods: {
    ...mapMutations({
      toggleSettingsModal: 'TOGGLE_SETTINGS_MODAL',
      setIsMobile: 'SET_IS_MOBILE',
      setIsHoverable: 'SET_IS_HOVERABLE',
      setMediaList: 'SET_MEDIA_LIST',
      setMediaIndex: 'SET_MEDIA_INDEX',
    }),
    handleResize() {
      const isMobile = window.innerWidth < 768
      const isHoverable = !window.matchMedia('(hover: none)').matches

      if (isMobile && !this.isMobile) {
        this.setIsMobile(true)
      } else if (!isMobile && this.isMobile) {
        this.setIsMobile(false)
      }

      if (isHoverable && !this.isHoverable) {
        this.setIsHoverable(true)
      } else if (!isHoverable && this.isHoverable) {
        this.setIsHoverable(false)
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
}
</script>

<style lang="scss">
html {
  font-family: sans-serif;
  box-sizing: border-box;
  height: 100%;
  font-size: 16px;

  &.night-mode {
    color: rgba(#fff, 0.8);
  }
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  min-height: 100%;

  .night-mode & {
    background: #202020;
  }
}

img {
  max-width: 100%;
}

a {
  color: #2574a9;
  text-decoration: none;

  .night-mode & {
    color: #3498db;
  }
}

.hidden-select {
  appearance: none;
  border: 0;
  bottom: 0;
  cursor: pointer;
  height: 100% !important;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100% !important;
}

.route-container {
  max-width: 60rem;
  width: 100%;
  margin: 0 auto;
  padding-top: 3rem;
}

.color-admin {
  color: #f1c40f;
}

.color-male {
  color: #3498db;

  .night-mode & {
    color: #3693d0;
  }
}

.color-female {
  color: #e74c3c;

  .night-mode & {
    color: #d74839;
  }
}

.headroom {
  position: fixed;
}

#nprogress {
  .bar {
    height: 4px;
    background: #1ecd97;

    .night-mode & {
      background: #42b983;
    }
  }
}
</style>
