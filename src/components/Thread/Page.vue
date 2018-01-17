<template>
  <div :id="`page-${pageNumber}`" class="page-container">
    <ul class="post-list">
      <post
        v-for="post in pageObj"
        v-if="+post.status === 1"
        :key="post.post_id"
        :post="post"
      ></post>
    </ul>
  </div>
</template>

<script>
import Post from './Post'

export default {
  name: 'Page',
  components: {
    Post,
  },
  props: ['pageObj', 'pageNumber', 'threadId'],
}
</script>

<style lang="scss">
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
