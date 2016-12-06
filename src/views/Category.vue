<template>
  <div>
    <thread-list
      :threads="uniqueThreads"
      :is-loading="isThreadListLoading"
      :handle-load-more="handleLoadMore"
      :has-more-threads="hasMoreThreads"
    ></thread-list>
  </div>
</template>

<script>
import uniqBy from 'lodash.uniqby'
import { mapGetters, mapActions } from 'vuex'
import ThreadList from '../components/ThreadList'

export default {
  name: 'Category',
  components: {
    ThreadList
  },
  head: {
    title () {
      return {
        inner: this.activeCategory ? this.activeCategory.name : ''
      }
    }
  },
  data () {
    return {
      page: 1
    }
  },
  computed: {
    ...mapGetters([
      'activeCategory'
    ]),
    catID () {
      return this.$store.state.route.params.id
    },
    activeThreads () {
      return this.$store.state.threads.threads
    },
    isThreadListLoading () {
      return this.$store.state.threads.isThreadListLoading
    },
    activeCategoryID () {
      return this.$store.state.categories.activeCategoryID
    },
    hasMoreThreads () {
      return this.$store.state.threads.hasMoreThreads
    },
    uniqueThreads () {
      return uniqBy(this.activeThreads, 'thread_id')
    }
  },
  methods: {
    ...mapActions([
      'fetchThreadList',
      'fetchMoreThreadList'
    ]),
    handleLoadMore () {
      this.page += 1
      this.$nextTick(() => {
        this.fetchMoreThreadList({
          catID: this.catID,
          page: this.page
        })
      })
    }
  },
  watch: {
    catID () {
      this.fetchThreadList({
        catID: this.catID,
        page: 1
      })
      this.$emit('updateHead')
    },
    activeCategory () {
      this.$emit('updateHead')
    }
  },
  mounted () {
    const self = this
    if (this.catID * 1 !== this.activeCategoryID * 1 || !this.activeThreads.length) {
      this.fetchThreadList({
        catID: this.catID,
        page: 1
      })
    }

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!self.isThreadListLoading && self.hasMoreThreads) {
          self.handleLoadMore()
        }
      }
    }
  },
  beforeDestroy () {
    window.onscroll = null
  }
}
</script>

<style lang="stylus">

</style>
