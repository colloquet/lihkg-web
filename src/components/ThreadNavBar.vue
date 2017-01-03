<template>
  <div class="uk-margin-bottom navigation-bar">
    <div class="uk-grid uk-grid-collapse">
      <div class="uk-width-1-5 uk-width-1-5 uk-hidden-small">
        <a class="return-link" v-if="category" @click.prevent="back">
          <span class="uk-icon-reply"></span> {{ category.name }}
        </a>
      </div>
      <div class="uk-width-1-1 uk-width-medium-3-5">
        <div class="uk-grid uk-grid-collapse">
          <div class="uk-width-1-3">
            <a :class="{'uk-invisible': !hasPrevPage}" @click="handlePageSwitch(+page - 1)"><span class="uk-icon-angle-left"></span> 上一頁</a>
          </div>
          <div class="uk-width-1-3">
            <div class="uk-position-relative page-switcher" data-uk-dropdown="{pos:'bottom-center', mode: 'click'}">
              <div>第 {{ page }} 頁 <span class="uk-icon-caret-down"></span></div>
              <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
                <ul class="uk-nav uk-nav-dropdown">
                  <li v-for="n in totalPage"><a class="uk-dropdown-close" @click.prevent="handlePageSwitch(n)" :class="{'is-active': n == page}">第 {{ n }} 頁</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="uk-width-1-3">
            <a :class="{'uk-invisible': !hasNextPage}" @click="handlePageSwitch(+page + 1)">下一頁 <span class="uk-icon-angle-right"></span></a>
          </div>
        </div>
      </div>
      <div class="uk-width-1-5 uk-hidden-small">
        <div class="uk-position-relative" data-uk-dropdown="{pos:'bottom-right', mode: 'click'}">
          <a class="more-link">
            <span class="uk-icon-ellipsis-v"></span> 更多
          </a>
          <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
            <ul class="uk-nav uk-nav-dropdown">
              <li>
                <a class="uk-dropdown-close" @click.prevent="photoMode">
                  <span class="uk-icon-image"></span> 圖片模式
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'threadNavBar',
  props: ['page', 'category', 'back', 'total-page', 'has-prev-page', 'has-next-page', 'handle-page-switch', 'photo-mode']
}
</script>

<style lang="stylus">
</style>
