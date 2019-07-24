<template>
  <li ref="container" :id="`post-${post.msg_num}`" class="post" :data-id="post.msg_num" :data-page="post.page">
    <small class="meta">
      <span :class="{'color-admin': isAuthor}">#{{ post.msg_num }}</span>
      <span class="username" v-username="post.user">{{ post.user_nickname }}</span>
      <PTag v-if="post.user.is_newbie" />
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
      <PostQuote :quote="this.post.quote" v-if="this.post.quote" :level="1" />
      <Message :html="this.post.msg" />
    </div>

    <small class="scores">
      <span>
        <span class="icon-arrow-up"></span> {{ likeCount }}
      </span>
      <span>
        <span class="icon-arrow-down"></span> {{ dislikeCount }}
      </span>
    </small>
  </li>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import helper from '@/helper'
import PostQuote from './PostQuote'
import Message from './Message/Message'
import PTag from '../PTag'

export default {
  props: ['post'],
  components: {
    PostQuote,
    Message,
    PTag,
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
      authodId: state => state.thread.thread.user_id,
      threadLikeCount: state => state.thread.thread.like_count,
      threadDislikeCount: state => state.thread.thread.dislike_count,
    }),
    userId() {
      return this.post.user.user_id
    },
    isAuthor() {
      return +this.authodId === +this.userId
    },
    likeCount() {
      return +this.post.msg_num === 1 ? this.threadLikeCount : this.post.like_count
    },
    dislikeCount() {
      return +this.post.msg_num === 1 ? this.threadDislikeCount : this.post.dislike_count
    },
    replyTime() {
      return {
        relative: helper.getRelativeTime(this.post.reply_time),
        absolute: helper.getConvertedTime(this.post.reply_time),
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

<style lang="scss">
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
    color: rgba(#000, 0.6);

    .night-mode & {
      color: rgba(#fff, 0.6);
    }

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

  blockquote {
    display: inline-block;
    width: 100%;
    margin: 0;
    margin-bottom: 1rem;
    padding-left: 1rem;
    border-left: 1px solid #ddd;
    color: #888;

    .night-mode & {
      border-left-color: #444;
    }
  }
}

.scores {
  display: inline-block;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 0.5rem;
  padding-right: 0.6rem;
  margin-top: 1rem;
  color: rgba(#000, 0.6);

  .night-mode & {
    background: mix(white, #121212, 7%);
    color: rgba(#fff, 0.6);
  }

  > span:first-child {
    margin-right: 0.5rem;
  }
}
</style>
