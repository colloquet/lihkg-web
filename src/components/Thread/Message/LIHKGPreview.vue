<template>
  <a :href="href" target="_blank" class="container">
    <div class="inner">
      <div class="icon">
        <span class="icon-link"></span>
      </div>
      <div class="body">
        <div v-if="isLoading">載入中...</div>
        <div v-else-if="title" class="title">{{ title }}</div>
        <small class="link">{{ href }}</small>
      </div>
    </div>
  </a>
</template>

<script>
import API from '@/api'

export default {
  props: ['threadId', 'href'],
  data() {
    return {
      isLoading: false,
      title: null,
    }
  },
  async mounted() {
    try {
      this.isLoading = true
      const { response } = await API.fetchThread({ threadId: this.threadId })
      this.title = response.title
    } catch (err) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: inline-block;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  color: inherit;
  line-height: 1.2;
  max-width: 100%;

  .night-mode & {
    background: #2b2b2b;
    border: 1px solid #444;
  }

  .is-mobile & {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .is-mobile * + & {
    margin-top: 0.5rem;
  }

  * + & {
    margin-top: 1rem;
  }

  .inner {
    display: flex;
  }

  .icon {
    display: flex;
    align-items: center;
    padding-right: 1rem;
    border-right: 1px solid #ddd;
    margin-right: 1rem;
    color: #999;
    font-size: 1.2rem;

    .night-mode & {
      border-right: 1px solid #444;
    }

    .is-mobile & {
      padding-right: 0.5rem;
      margin-right: 0.5rem;
    }
  }

  .body {
    overflow: hidden;
    white-space: nowrap;
  }

  .title, .link {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  small {
    color: #999;
  }
}
</style>
