<template>
  <li class="uk-width-1-1" :key="thread.thread_id">
    <div class="thread-container">
      <router-link :to="`/thread/${thread.thread_id}/page/${history ? history.page : 1}`" class="uk-link-reset thread">
        <span class="uk-icon-bolt hot-indicator" v-if="thread.is_hot"></span>
        <span class="uk-icon-circle read-indicator" :class="{'has-new': thread.no_of_reply > history.no_of_reply}" v-if="history"></span>
        {{ thread.title }}<br>
        <small class="uk-text-muted">
          <span :class="thread.user.level === '999' ? 'admin' : thread.user.gender === 'M' ? 'male' : 'female'">{{ thread.user_nickname }}</span> //
          <span>{{ thread.category.name }}</span> //
          {{ replyTime }} //
          {{ thread.no_of_reply }}個回覆 //
          <span :class="{'like-color': score >= 100, 'dislike-color': score <= -100}">
            <span :class="score < 0 ? 'uk-icon-thumbs-down' : 'uk-icon-thumbs-up'"></span>
            {{ score }}
          </span>
        </small>
      </router-link>
      <div class="page-switcher">
        {{ thread.total_page }} 頁&nbsp;<span class="uk-icon-caret-down"></span>
        <select @change="handlePageSwitch">
          <option value="" selected>選擇頁數</option>
          <option :value="n" v-for="n in thread.total_page">第 {{ n }} 頁</option>
        </select>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'threadlistItem',
  props: ['thread', 'history', 'reply-time', 'score'],
  methods: {
    handlePageSwitch (event) {
      this.$router.push(`/thread/${this.thread.thread_id}/page/${event.target.value}`)
    }
  }
}
</script>

<style lang="stylus">
.thread-container {
  display: flex;
  position: relative;
  background: #2d2d2d;
  border-bottom: 1px solid #444;

  .white-theme & {
    background: #fafafa;
    border-bottom: 1px solid #ddd;
  }

  .page-switcher {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    padding: 15px;
    min-width: 82px;
    cursor: pointer;

    @media(max-width: 767px) {
      min-width: 70px;
      font-size: 12px;
    }

    &:hover {
      background: #383838;

      .white-theme & {
        background: #eaeaea;
      }
    }

    select {
      bottom: 0;
      left: 0;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%!important;
      height: 100%!important;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      cursor: pointer;
    }
  }
}

.thread {
  position: relative;
  display: block;
  flex-grow: 1;
  border-right: 1px solid #444;
  padding: 15px;
  padding-left: 30px;

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
