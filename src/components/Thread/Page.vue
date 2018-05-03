<template>
  <div :id="`page-${pageNumber}`">
    <Post
      v-for="post in pageObj"
      :key="post.id"
      :post="post"
      :page="pageNumber"
    />
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
