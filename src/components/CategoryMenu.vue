<template>
  <transition name="slide-fade" :duration="450">
    <div v-if="showDrawer">
      <div
        class="overlay"
        @click="hideDrawer"
      ></div>
      <div ref="menu" class="menu">
        <div class="container">
          <div class="navigations">
            <a
              href="/bookmarks"
              class="nav-item"
              :class="{'is-active': threadListType === 'bookmarks'}"
              @click.prevent="handleLinkClick"
            >
              名已留
            </a>
          </div>
          <div class="grid">
            <div
              class="grid-item"
              :key="section.name"
              v-for="section in fixedCategoryList"
              :class="{'is-single': section.name === '其他'}"
            >
              <span class="title">{{ section.name || '一般' }}</span>
              <ul class="submenu">
                <li v-for="category in section.cat_list" :key="category.cat_id">
                  <a
                    class="nav-item"
                    :class="{'is-active': category.cat_id === activeCategoryId}"
                    :href="`/category/${category.cat_id}`"
                    @click.prevent="handleLinkClick"
                  >
                    {{ category.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      fixedCategoryList: state => state.category.fixedCategoryList,
      showDrawer: state => state.ui.showDrawer,
      activeCategoryId: state => state.category.category.cat_id,
      threadListType: state => state.threadList.threadListType,
    }),
  },
  methods: {
    ...mapMutations({
      hideDrawer: 'HIDE_DRAWER',
    }),
    handleClick(event) {
      if (!this.$refs.menu) return
      if (!this.$refs.menu.contains(event.target)) {
        this.hideDrawer()
      }
    },
    handleScroll() {
      window.requestAnimationFrame(this.update)
    },
    handleLinkClick(event) {
      setTimeout(() => {
        this.$router.push(event.target.pathname)
      }, 400)
      this.hideDrawer()
    },
    update() {
      const distanceScrolled = Math.abs(
        window.pageYOffset - this.lastKnownScrollY,
      )
      if (distanceScrolled > 10 && this.showDrawer) {
        this.hideDrawer()
      }

      this.lastKnownScrollY = window.pageYOffset
    },
  },
  mounted() {
    const self = this
    window.requestAnimationFrame(() => {
      window.addEventListener('click', self.handleClick)
      window.addEventListener('scroll', self.handleScroll)
    })
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleClick)
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(#000, 0.2);
  z-index: 1;
  will-change: opacity;

  .night-mode & {
    background-color: rgba(#000, 0.5);
  }
}

.menu {
  position: fixed;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  top: 3rem;
  left: 0;
  width: 100%;
  transition: background 1s ease;
  will-change: transform;
  z-index: 2;

  .night-mode & {
    background: #1b1b1b;
  }
}

.container {
  max-width: 60rem;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

.navigations {
  margin-bottom: 0.5rem;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  margin-left: -1.5rem;

  @media (max-width: 767px) {
    margin-left: -15px;
  }
}

.grid-item {
  padding-left: 1.5rem;
  flex: 2;

  @media (max-width: 767px) {
    flex-basis: 50%;
    padding-left: 1rem;
  }

  &.is-single {
    flex: 1;

    @media (max-width: 767px) {
      flex-basis: 50%;
    }
  }
}

.title {
  display: block;
  margin-bottom: 1rem;
  margin-top: 10px;
  color: rgba(#000, 0.54);
  font-size: 0.875rem;

  .night-mode & {
    color: #888;
  }
}

.submenu {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    flex-shrink: 0;
    width: 50%;
    margin-bottom: 0.5rem;

    .is-single & {
      width: 100%;
    }
  }
}

.nav-item {
  position: relative;
  display: inline-block;
  border-radius: 4px;
  padding: 0.25rem;
  margin-left: -0.25rem;
  color: inherit;
  text-decoration: none;
  font-size: 14px;

  &.is-active:after {
    content: '';
    position: absolute;
    display: block;
    background: #1ecd97;
    bottom: 0;
    left: 0.25rem;
    right: 0.25rem;
    height: 2px;

    .night-mode & {
      background: #42b983;
    }
  }

  .is-hoverable &:hover {
    background: #f5f5f5;
  }

  .is-hoverable.night-mode &:hover {
    background: #333;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  .overlay, .menu {
    transition: all 0.45s cubic-bezier(0.36, 0.66, 0.04, 1);
  }
}
.slide-fade-enter,
.slide-fade-leave-to {
  .overlay {
    opacity: 0;
  }

  .menu {
    transform: translateY(-100%);
  }
}
</style>
