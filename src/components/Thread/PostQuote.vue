<template>
  <blockquote>
    <template v-if="this.quote.quote">
      <blockquote v-if="level === 3 && hideChildren">
        <button @click="hideChildren = false" class="button">顯示更多</button>
      </blockquote>
      <PostQuote :quote="this.quote.quote" :level="level + 1" v-else />
    </template>
    <Message :html="this.quote.msg" />
  </blockquote>
</template>

<script>
import Message from './Message/Message'
import PostQuote from './PostQuote'

export default {
  name: 'PostQuote',
  props: ['quote', 'level'],
  components: {
    Message,
    PostQuote,
  },
  data() {
    return {
      hideChildren: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.button {
  appearance: none;
  border: 1px solid;
  background: transparent;
  color: inherit;
  border-radius: 4px;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
</style>
