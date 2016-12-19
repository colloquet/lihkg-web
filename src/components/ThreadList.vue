<template>
  <div class="threads-container">
    <ul class="uk-grid" :class="{'is-loading': isLoading}">
      <li class="uk-width-1-1" v-for="thread in threads" :key="thread.thread_id">
        <div class="thread-container">
          <router-link :to="'/thread/' + thread.thread_id + '/page/1'" class="uk-link-reset thread">
            <span class="uk-icon-bolt hot-indicator" v-if="thread.is_hot"></span>
            <span class="uk-icon-circle read-indicator" :class="{'has-new': thread.no_of_reply > threadHistory[thread.thread_id].no_of_reply}" v-if="threadHistory[thread.thread_id]"></span>
            {{ thread.title }}<br>
            <small class="uk-text-muted">
              <span :class="thread.user.level === '999' ? 'admin' : thread.user.gender === 'M' ? 'male' : 'female'">{{ thread.user_nickname }}</span> //
              {{ getRelativeTime(thread.last_reply_time) }} //
              {{ thread.no_of_reply }}個回覆 //
              <span :class="{'like-color': (thread.like_count - thread.dislike_count) >= 100, 'dislike-color': (thread.like_count - thread.dislike_count) <= -100}">
                <span :class="thread.like_count - thread.dislike_count < 0 ? 'uk-icon-thumbs-down' : 'uk-icon-thumbs-up'"></span>
                {{ thread.like_count - thread.dislike_count }}
              </span>
            </small>
          </router-link>
          <div class="page-switcher" data-uk-dropdown="{pos:'bottom-right', mode: 'click'}">
            <div>{{ thread.total_page }} 頁 <span class="uk-icon-caret-down"></span></div>
            <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
              <ul class="uk-nav uk-nav-dropdown">
                <li v-for="n in thread.total_page">
                  <router-link :to="`/thread/${thread.thread_id}/page/${n}?page-switcher=true`">第 {{ n }} 頁</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
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
import moment from 'moment'

moment.locale('zh-hk')

export default {
  name: 'threadlist',
  props: ['is-loading', 'threads', 'handle-load-more', 'has-more-threads'],
  computed: {
    threadHistory () {
      return this.$store.state.settings.threadHistory
    }
  },
  methods: {
    getRelativeTime (timestamp) {
      return moment.unix(timestamp).fromNow()
    }
  }
}
</script>

<style lang="stylus">
.is-loading {
  opacity: 0.3;
}

.threads-container {
  margin: 0 -15px;
}

.thread-container {
  position: relative;
  border-bottom: 1px solid #444;

  .white-theme & {
    border-bottom: 1px solid #ddd;
  }

  .page-switcher {
    position: absolute;
    display: inline-block;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    cursor: pointer;

    &.uk-open {
      z-index: 10;
    }
  }
}

.thread {
  position: relative;
  display: block;
  padding: 15px;
  padding-left: 30px;
  margin-right: 80px;

  &:hover {
    background: #383838;
  }

  .white-theme & {
    &:hover {
      background: #f5f5f5;
    }
  }

  small {
    font-size: 70%;
  }
}

.hot-indicator {
  color: #f1c40f;
  position: absolute;
  top: 18px;
  left: 15px;
}

.read-indicator {
  position: absolute;
  top: 40px;
  left: 14px;
  font-size: 10px;

  &.has-new {
    color: #e74c3c;
  }
}

.like-color {
  color: #f1c40f;
}

.dislike-color {
  color: #e74c3c;
}

.load-more {
  a, span {
    display: block;
    padding: 15px;
    text-align: center;
  }
}
</style>
