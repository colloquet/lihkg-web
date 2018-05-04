<template>
  <div ref="container" :id="`post-${post.id}`" class="post" :data-id="post.id" :data-page="page">
    <small class="meta">
      <span :class="{'color-admin': isAuthor}">#{{ post.index || 0 }}</span>
      <span class="username" v-username="post.authorGender">{{ post.authorName }}</span>
      <span class="temp-visible-toggle" @click="tempVisible = !tempVisible" v-if="storyMode && +storyMode !== +userId">
        暫時{{ tempVisible ? '隱藏' : '顯示' }}
      </span>
      <span
        class="reply-time"
        :title="showAbsoluteTime ? replyTime.relative : replyTime.absolute"
        @click="showAbsoluteTime = !showAbsoluteTime"
        v-else
      >{{ showAbsoluteTime ? replyTime.absolute : replyTime.relative }}</span>
      <span :class="`icon-eye${storyMode ? '-off' : ''} story-mode-toggle`" title="追估模式" @click="handleToggleStoryMode"></span>
    </small>

    <div class="post-msg" v-show="!storyMode || +storyMode === +userId || tempVisible">
      <Message :html="this.post.content" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import helper from '@/helper'
import Message from './Message/Message'

export default {
  props: ['post', 'page'],
  components: {
    Message,
  },
  data() {
    return {
      tempVisible: false,
      showAbsoluteTime: false,
    }
  },
  computed: {
    ...mapState({
      storyMode: state => state.thread.storyMode,
      authodId: state => state.thread.thread.authorId,
      threadLikeCount: state => state.thread.thread.marksGood,
      threadDislikeCount: state => state.thread.thread.marksBad,
    }),
    userId() {
      return this.post.authorId
    },
    isAuthor() {
      return +this.authodId === +this.userId
    },
    replyTime() {
      return {
        relative: helper.getRelativeTime(this.post.replyDate || this.post.messageDate),
        absolute: helper.getConvertedTime(this.post.replyDate || this.post.messageDate),
      }
    },
  },
  methods: {
    ...mapMutations({
      setStoryMode: 'SET_STORY_MODE',
    }),
    handleToggleStoryMode() {
      helper.trackEvent({
        eventCategory: 'ThreadView',
        eventAction: 'click',
        eventLabel: 'Story mode',
      })
      const { top } = this.$refs.container.getBoundingClientRect()
      this.setStoryMode(this.storyMode ? null : this.userId)
      this.$nextTick(() => {
        window.scrollTo(0, this.$refs.container.offsetTop - top)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.post {
  padding: 1.5rem 1rem;
  border-bottom: 0.5px solid #f1f1f1;

  &:first-of-type {
    border-top: 0.5px solid #f1f1f1;
  }

  .night-mode & {
    border-top-color: #333;
    border-bottom-color: #333;
  }

  .meta {
    display: flex;
    align-items: flex-end;
    color: #aaa;

    > span {
      margin-right: 0.5rem;

      &:last-of-type {
        margin-right: 0;
      }
    }

    .username {
      font-size: 110%;
    }

    .reply-time {
      cursor: pointer;
    }

    .story-mode-toggle {
      margin-left: auto;
      cursor: pointer;
    }

    .temp-visible-toggle {
      cursor: pointer;
    }
  }
}

.post-msg {
  margin-top: 1rem;
  word-break: break-word;
  line-height: 1.5;
  font-size: 1.125rem;
}

.scores {
  display: inline-block;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 1rem;
  color: #aaa;

  .night-mode & {
    background: #2b2b2b;
  }

  > span:first-child {
    margin-right: 0.5rem;
  }
}
</style>
