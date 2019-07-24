<template>
  <div class="navigation">
    <div class="navigation-item">
      <a :href="`/thread/${threadId}/page/${+page - 1}`" v-if="hasPrevPage" @click.prevent="$emit('navigate', page - 1, true)">
        <span class="icon-chevron-up"></span> 上一頁
      </a>
    </div>

    <div class="navigation-item">
      <span>
        第 {{ page }} 頁 <span class="icon-chevron-down"></span>
        <select class="hidden-select" :value="page" @change="switchPage">
          <option :key="n" :value="n" v-for="n in totalPage">第 {{ n }} 頁</option>
        </select>
      </span>
    </div>

    <div class="navigation-item">
      <a :href="`/thread/${threadId}/page/${+page + 1}`" v-if="hasNextPage" @click.prevent="$emit('navigate', page + 1)">
        下一頁 <span class="icon-chevron-down"></span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['threadId', 'page', 'totalPage'],
  computed: {
    hasNextPage() {
      return this.page < this.totalPage
    },
    hasPrevPage() {
      return this.page > 1
    },
  },
  methods: {
    switchPage(event) {
      this.$emit('navigate', event.target.value)
    },
  },
}
</script>

<style lang="scss">
.navigation {
  display: flex;
  flex-direction: row;
  margin: 1rem 0;

  &-item {
    flex: 1;
    padding: 0.5rem;
    text-align: center;

    a {
      color: #fbc308;
    }
  }

  span {
    position: relative;
  }
}
</style>
