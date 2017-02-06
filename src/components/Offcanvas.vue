<template>
  <div id="offcanvas-categories" class="uk-offcanvas">
    <div class="uk-offcanvas-bar">
      <ul class="uk-nav uk-nav-offcanvas">
        <li>
          <div class="uk-grid uk-grid-collapse offcanvas-header">
            <div class="uk-width-1-2">
              <router-link to="/category/1" class="uk-offcanvas-close">
                LIHKG 討論區
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
        >
          <a :href="`/category/${category.cat_id}`" class="uk-offcanvas-close" @click.prevent="handleSwitchCategory(category.cat_id)">
            {{ category.name }}
          </a>
        </li>
        <li>
          <a href="#modal-about" data-uk-modal>關於本站</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'offcanvas',
  computed: {
    ...mapState({
      activeCategory: state => state.categories.category,
      allCategories: state => state.categories.categories
    })
  },
  methods: {
    ...mapActions([
      'fetchCategories'
    ]),
    handleSwitchCategory (catId) {
      setTimeout(() => {
        this.$router.push(`/category/${catId}`)
      }, 400)
    }
  }
}
</script>

<style lang="stylus">
.uk-offcanvas-bar {
  background: #222;
  box-shadow: 1px 1px 4px 1px rgba(#000, 0.5);

  .white-theme & {
    background: #fff;
  }

  &:after {
    display: none;
  }

  .is-safari & {
    background: rgba(#222, 0.7);
    backdrop-filter: blur(10px);

    .white-theme & {
      background: rgba(#fff 0.7);
    }
  }
}

.offcanvas-header {
  a {
    display: block;
    padding: 10px 5px;
    text-align: center;
  }
}

.uk-nav-offcanvas > li {
  > a {
    box-shadow: none;
    border-top: 1px solid #333;
    text-shadow: none;

    .white-theme & {
      border-top: 1px solid #ddd;
      color: #222;
    }

    &:hover {
      .white-theme & {
        background: #f5f5f5 !important;
        color: #222 !important;
      }
    }
  }

  &.uk-active > a {
    .white-theme & {
      background: #f5f5f5 !important;
      color: #222 !important;
      box-shadow: none !important;
      
      .is-safari & {
        background: #ddd !important;
      }
    }

  }
}
</style>
