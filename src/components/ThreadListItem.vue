<template>
  <li class="uk-width-1-1" :key="thread.thread_id">
    <div class="thread-container">
      <router-link :to="`/thread/${thread.thread_id}/page/${history ? history.page : 1}`" class="uk-link-reset thread">
        <span class="uk-icon-bolt hot-indicator" v-if="thread.is_hot"></span>
        <span class="uk-icon-circle read-indicator" :class="{'has-new': thread.no_of_reply > history.no_of_reply}" v-if="history"></span>
        {{ thread.title }}<br>
        <small class="uk-text-muted">
          <span :class="thread.user.level === '999' ? 'admin' : thread.user.gender === 'M' ? 'male' : 'female'">{{ thread.user_nickname }}</span> //
          {{ replyTime }} //
          {{ thread.no_of_reply }}個回覆 //
          <span :class="{'like-color': score >= 100, 'dislike-color': score <= -100}">
            <span :class="score < 0 ? 'uk-icon-thumbs-down' : 'uk-icon-thumbs-up'"></span>
            {{ score }}
          </span>
        </small>
      </router-link>
      <div class="page-switcher" data-uk-dropdown="{pos:'bottom-right', mode: 'click'}">
        <div>{{ thread.total_page }} 頁 <span class="uk-icon-caret-down"></span></div>
        <div class="uk-dropdown uk-dropdown-small uk-dropdown-scrollable">
          <ul class="uk-nav uk-nav-dropdown">
            <li v-for="n in thread.total_page">
              <router-link :to="`/thread/${thread.thread_id}/page/${n}`">第 {{ n }} 頁</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'threadlistItem',
  props: ['thread', 'history', 'reply-time', 'score']
}
</script>

<style lang="stylus">
.thread-container {
  position: relative;
  background: #2d2d2d;
  border-bottom: 1px solid #444;

  .white-theme & {
    background: #fafafa;
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
  border-right: 1px solid #444;
  padding: 15px;
  padding-left: 30px;
  margin-right: 80px;

  &:hover {
    background: #383838;
  }

  .white-theme & {
    border-right: 1px solid #ddd;

    &:hover {
      background: #eaeaea;
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
</style>
