<template>
  <div class="threads-container">
    <ul class="uk-grid">
      <thread-list-item
        v-for="thread in threads"
        :key="thread.thread_id"
        :thread="thread"
        :history="threadHistory[thread.thread_id]"
        :replyTime="getRelativeTime(thread.last_reply_time)"
        :score="thread.like_count - thread.dislike_count"
      />
      <li class="uk-width-1-1 load-more">
        <a @click="handleLoadMore" v-if="hasMoreThreads">
          {{ isLoading ? '載入中…' : '載入更多' }}
        </a>
        <span v-else>沒有更多</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ThreadListItem from './ThreadListItem'
import helper from '../helper'

export default {
  name: 'threadList',
  components: {
    ThreadListItem
  },
  props: ['is-loading', 'threads', 'handle-load-more', 'has-more-threads'],
  computed: {
    ...mapState({
      threadHistory: state => state.settings.threadHistory
    })
  },
  methods: {
    getRelativeTime (timestamp) {
      return helper.getRelativeTime(timestamp)
    }
  }
}
</script>

<style lang="stylus">
.threads-container {
  margin: 0 -15px;

  @media(min-width: 768px) {
    border: 1px solid #444;
    margin: 0;

    .white-theme & {
      border: 1px solid #ddd;
    }
  }
}

.load-more {
  a, span {
    display: block;
    padding: 15px;
    text-align: center;
  }
}
</style>
