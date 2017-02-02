<template>
  <div class="uk-margin-bottom navigation-bar">
    <div class="uk-grid uk-grid-collapse">
      <div class="uk-width-1-5 uk-hidden-small">
        <a class="return-link" v-if="categoryName" @click.prevent="back">
          <span class="uk-icon-reply"></span> {{ categoryName }}
        </a>
      </div>
      <div class="uk-width-1-1 uk-width-medium-3-5">
        <div class="uk-grid uk-grid-collapse">
          <div class="uk-width-1-3">
            <a :class="{'uk-invisible': !hasPrevPage}" @click="handlePageSwitch(+page - 1)"><span class="uk-icon-angle-left"></span> 上一頁</a>
          </div>
          <div class="uk-width-1-3">
            <div class="uk-position-relative page-switcher">
              <div>第 {{ page }} 頁 <span class="uk-icon-caret-down"></span></div>
              <select @change="handlePageSwitchFromSelect">
                <option :value="n" v-for="n in totalPage" :selected="page == n">第 {{ n }} 頁</option>
              </select>
            </div>
          </div>
          <div class="uk-width-1-3">
            <a :class="{'uk-invisible': !hasNextPage}" @click="handlePageSwitch(+page + 1)">下一頁 <span class="uk-icon-angle-right"></span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'threadNavBar',
  props: ['page', 'category-name', 'back', 'total-page', 'has-prev-page', 'has-next-page', 'handle-page-switch', 'handle-page-switch-from-select']
}
</script>

<style lang="stylus">
.navigation-bar {
  background: #2d2d2d;

  [class*=uk-width-1-] {
    text-align: center;

    > a {
      display: block;
      height: 50px;
      padding: 0 15px;
      line-height: 50px;

      @media(max-width: 375px) {
        padding: 0 10px;
      }
    }
  }

  .page-switcher {
    height: 50px;
    padding: 0 15px;
    line-height: 50px;
    cursor: pointer;

    @media(max-width: 375px) {
      padding: 0 10px;
    }

    .is-active {
      background: #eee;
      font-weight: bold;
    }

    select {
      bottom: 0;
      left: 0;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%!important;
      height: 100%!important;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      cursor: pointer;
    }
  }

  @media(max-width: 767px) {
    margin: 0 -15px;
  }

  .white-theme & {
    /*border: 1px solid #ddd;*/
    background: #fafafa;
  }
}
</style>
