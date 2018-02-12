<template>
  <div ref="container" class="container">
    <ul class="tab">
      <li
        ref="items"
        class="tab-item"
        :key="item.sub_cat_id"
        v-for="(item, index) in preparedList"
        v-if="index < visibleItemsCount"
      >
        <router-link class="tab-item-inner" :to="{ query: item.query }" exact>
          {{ item.name }}
        </router-link>
      </li>
      <li class="tab-item" v-if="visibleItemsCount < list.length">
        <div class="tab-item-inner" :class="{'is-active': activeSubCatHidden}">
          {{ activeSubCatHidden ? activeSubCat.name : '更多' }} <span class="icon-chevron-down"></span>
          <select class="hidden-select" @change="handleSubCatChange" :value="activeSubCat.sub_cat_id">
            <option>更多</option>
            <option
              :value="item.sub_cat_id"
              :key="item.sub_cat_id"
              v-for="(item, index) in preparedList"
              v-if="index >= visibleItemsCount"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import helper from '@/helper'
import isEqual from 'lodash/isEqual'

export default {
  props: ['list'],
  data() {
    return {
      visibleItemsCount: this.list.length,
    }
  },
  computed: {
    preparedList() {
      return this.list.map(item => {
        const { cat_id, ...query } = item.query
        return {
          ...item,
          query,
        }
      })
    },
    activeSubCat() {
      return this.preparedList.filter(item => isEqual(item.query, this.$route.query))[0]
    },
    activeSubCatIndex() {
      return this.preparedList.indexOf(this.activeSubCat)
    },
    activeSubCatHidden() {
      return this.activeSubCatIndex >= this.visibleItemsCount
    }
  },
  methods: {
    renderVisibleItems() {
      this.visibleItemsCount = this.list.length

      this.$nextTick(() => {
        const isOverflown = helper.isOverflown(this.$refs.container)

        if (!isOverflown) {
          return
        }

        let total = 0
        let count

        for (let index = 0; index < this.$refs.items.length; index++) {
          const item = this.$refs.items[index]
          total += item.clientWidth
          if (total > this.$refs.container.clientWidth) {
            count = index - 1
            break
          }
        }

        this.visibleItemsCount = count
      })
    },
    handleSubCatChange(event) {
      const subCatId = event.target.value
      const item = this.preparedList.filter(item => +item.sub_cat_id === +subCatId)[0]
      if (item) {
        this.$router.push({
          query: item.query,
        })
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.renderVisibleItems)
    this.renderVisibleItems()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.renderVisibleItems)
  }
}
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
}

.tab {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #f1f1f1;
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;

  .is-mobile & {
    justify-content: flex-start;
    margin: 0.5rem 0;
  }

  .night-mode & {
    border-bottom-color: #333;
  }
}

.tab-item {
  position: relative;
  text-align: center;

  .is-mobile & {
    flex-grow: 1;
    flex-shrink: 0;
  }
}

.tab-item-inner {
  display: block;
  padding: 0 1rem;
  height: 2.25rem;
  line-height: 2.25rem;
  margin-bottom: -1px;
  color: #999;

  &:hover {
    text-decoration: none;
    border-bottom: 1px solid #888;
  }

  &.is-active {
    border-bottom: 1px solid #1ecd97;
    color: inherit;

    .night-mode & {
      border-bottom-color: #42b983;
    }
  }
}
</style>
