<template>
  <div :id="`page-${pageNumber}`">
    <ul class="post-list">
      <Post
        v-for="post in pageObj"
        v-if="+post.status === 1"
        :key="post.post_id"
        :post="post"
      />
    </ul>
  </div>
</template>

<script>
import Post from './Post'

export default {
  components: {
    Post,
  },
  props: ['pageObj', 'pageNumber', 'threadId'],
}
</script>

<style lang="scss" scoped>
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
