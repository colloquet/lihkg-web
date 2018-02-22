<template>
  <li>
    <router-link
      :id="thread.thread_id"
      class="thread-list-item"
      :to="routeObj"
    >
      <span class="icon-hot hot indicator" v-if="thread.is_hot"></span>
      <span class="unread indicator" v-if="hasUnread"></span>
      <span class="visited indicator" v-else-if="isVisited"></span>

      <div class="body">
        <small class="meta">
          <div class="meta-left">
            <span class="name" :class="usernameClass">
              {{ thread.user_nickname }}
            </span>

            <span class="time">{{ lastReplyTime }}</span>

            <span class="replies" v-if="!isMobile">
              <span class="icon-message-square"></span>
              {{ thread.no_of_reply }}
              <span class="new-reply" v-if="hasUnread">
                ( +{{ newReply }} )
              </span>
            </span>

            <span class="score" :class="scoreClass">
              <span class="icon-thumbs-up" v-if="score > -1"></span>
              <span class="icon-thumbs-down" v-else></span>
              {{ score }}
            </span>
          </div>

          <div class="meta-right">
            <label class="page-switcher" @click.prevent="handlePageSelectClick">
              {{ thread.total_page }} 頁 <span class="icon-chevron-down"></span>
              <select @change="handlePageSelect" class="hidden-select">
                <option>選擇頁數</option>
                <option :value="n" :key="n" v-for="n in thread.total_page">第 {{ n }} 頁</option>
              </select>
            </label>
          </div>
        </small>

        <div class="lower">
          <div class="lower-left" v-if="!isMobile && +thread.total_page > 1">
            <span class="title">{{ thread.title }}</span>

            <template v-for="page in +thread.total_page">
              <router-link
                v-if="page <= 6"
                :key="page"
                :to="`/thread/${thread.thread_id}/page/${page}`"
                class="page-link"
              >{{ page }}</router-link>

              <span :key="page" class="page-link" v-else-if="page > 6 && page === thread.total_page - 2" @click.prevent="handlePageSelectClick">
                ...
                <select @change="handlePageSelect" class="hidden-select">
                  <option>選擇頁數</option>
                  <option :value="n" :key="n" v-for="n in thread.total_page">第 {{ n }} 頁</option>
                </select>
              </span>

              <router-link
                v-else-if="thread.total_page - page < 2"
                :key="page"
                :to="`/thread/${thread.thread_id}/page/${page}`"
                class="page-link"
              >{{ page }}</router-link>
            </template>
          </div>
          <div class="lower-left" v-else>
            <span class="title">{{ thread.title }}</span>
          </div>

          <small class="category-label">
            {{ thread.category.name }}
          </small>
        </div>

      </div>
    </router-link>
  </li>
</template>

<script>
import { mapState } from 'vuex'
import helper from '@/helper'

export default {
  props: ['thread', 'isVisited', 'lastReadPage', 'lastReadPostId', 'newReply'],
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile,
    }),
    routeObj() {
      return {
        name: 'ThreadView',
        params: {
          threadId: this.thread.thread_id,
          page: this.lastReadPage || 1,
        },
        query: this.lastReadPostId
          ? {
              post: this.lastReadPostId,
            }
          : {},
      }
    },
    score() {
      return this.thread.like_count - this.thread.dislike_count
    },
    scoreClass() {
      return helper.getScoreClass(this.score)
    },
    usernameClass() {
      return helper.getUsernameClass(
        this.thread.user.level,
        this.thread.user_gender,
      )
    },
    lastReplyTime() {
      return helper.getRelativeTime(this.thread.last_reply_time)
    },
    hasUnread() {
      return this.newReply > 0
    },
  },
  methods: {
    handlePageSelectClick: () => false,
    handlePageSelect(event) {
      this.$router.push(
        `/thread/${this.thread.thread_id}/page/${event.target.value}`,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.thread-list-item {
  position: relative;
  display: flex;
  flex-direction: row;
  border-bottom: 0.5px solid #e6e6e6;
  padding: 1.5rem;
  padding-left: 2rem;
  text-decoration: none;
  color: inherit;

  .is-hoverable &:hover {
    background: #f5f6f7;
  }

  .is-hoverable.night-mode &:hover {
    background: darken(#202020, 2%);
  }

  .night-mode & {
    border-bottom-color: #333;
  }

  .is-mobile & {
    padding: 1rem;
    padding-left: 1.5rem;
  }
}

.indicator {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  left: 0.5rem;

  .is-mobile & {
    left: 0.25rem;
  }

  &.hot {
    top: 1.5rem;
    color: #f6b701;

    .is-mobile & {
      top: 1rem;
    }
  }

  &.visited,
  &.unread {
    top: 3rem;

    .is-mobile & {
      top: 2.5rem;
    }

    &:before {
      content: '';
      display: block;
      background: currentColor;
      border-radius: 50%;
      width: 0.5rem;
      height: 0.5rem;
    }
  }

  &.visited {
    color: #aaa;
  }

  &.unread {
    color: #e74c3c;
  }
}

.new-reply {
  color: #e74c3c;
}

.body {
  flex-grow: 1;

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    color: #aaa;
  }

  .meta-left {
    display: flex;
    align-items: center;

    > span:not(:first-of-type) {
      margin-left: 0.5rem;
    }
  }

  .meta-right {
    display: flex;
    align-items: center;
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .time,
  .replies,
  .score {
    flex-shrink: 0;
  }
}

.category-label {
  display: inline-block;
  flex-shrink: 0;
  border-radius: 12px;
  background: #f5f6f7;
  padding: 0.25rem 0.5rem;
  color: #aaa;
  font-size: 0.75rem;

  .night-mode & {
    background: #333;
  }
}

.lower {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: space-between;
}

.lower-left {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  font-size: 1.125rem;
}

.title {
  word-break: break-word;
  line-height: 1.5;
  margin-right: 0.5rem;
}

.page-link {
  border-radius: 4px;
  color: #848482;
  font-size: 0.75em;
  padding: 0.2rem 0.4rem;
  position: relative;
  text-decoration: none;

  &:hover {
    background: #e6e6e6;

    .night-mode & {
      background: #404040;
      color: #fff;
    }
  }
}

.page-switcher {
  position: relative;
  flex-shrink: 0;
  padding: 0.5rem;
  margin: -0.5rem;
  color: #aaa;
  font-size: 14px;

  .is-hoverable &:hover {
    color: #000;
  }

  .is-hoverable.night-mode &:hover {
    color: #fff;
  }
}

.highlight {
  animation: highlight 2s ease;

  .night-mode & {
    animation: highlight-dark 2s ease;
  }
}

@keyframes highlight {
  0% {
    background: #f5f6f7;
  }
  to {
    background: transparent;
  }
}

@keyframes highlight-dark {
  0% {
    background: #111;
  }
  to {
    background: transparent;
  }
}
</style>
