<template>
  <blockquote>
    <template v-if="this.quote.quote">
      <blockquote v-if="level === 3 && hideChildren">
        <button @click="hideChildren = false" class="button">顯示更多</button>
      </blockquote>
      <PostQuote :quote="this.quote.quote" :level="level + 1" v-else />
    </template>
    <Message :html="this.quote.msg">
      <a
        :href="link"
        target="_blank"
        class="link"
        title="跳至回覆"
        slot="link"
      >
        <span class="icon-external-link"></span>
      </a>
    </Message>
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
  computed: {
    link() {
      return `/thread/${this.quote.thread_id}/page/${this.quote.page}?post=${this.quote.msg_num}`
    },
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
  opacity: 0.5;

  .is-hoverable &:hover {
    opacity: 1;
  }
}

.link {
  display: inline-block;
  margin-left: 0.5rem;
  opacity: 0.5;
  color: inherit;

  .is-hoverable &:hover {
    opacity: 1;
  }
}
</style>
