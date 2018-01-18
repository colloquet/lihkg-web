<template>
  <transition name="slide-fade">
    <div ref="menu" class="menu" v-if="showDrawer">
      <div class="container">
        <div class="grid">
          <div
            class="grid-item"
            :key="section"
            v-for="(categories, section) in categoryList"
            :class="{'is-single': section === '其他'}"
          >
            <span class="title" v-if="section">{{ section }}</span>
            <ul class="submenu">
              <li v-for="category in categories" :key="category.cat_id">
                <a
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
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import helper from '@/helper'

export default {
  name: 'CategoryMenu',
  data: () => ({
    categoryList: helper.categoryList,
  }),
  computed: {
    ...mapState({
      showDrawer: state => state.ui.showDrawer,
      activeCategoryId: state => state.category.category.cat_id,
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
  color: #aaa;
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

    a {
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
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.45s cubic-bezier(0.36, 0.66, 0.04, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-100%);
}
</style>
