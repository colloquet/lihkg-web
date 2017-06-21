<template>
  <li class="uk-width-1-1 uk-margin-bottom" :id="index % 25 == 0 ? `page-${comment.page}` : ''">
    <div class="comment">
      <small class="meta">
        <span class="uk-text-muted uk-margin-small-right" :class="{'author': isAuthor}">
          #{{ comment.msg_num || getCommentIndex(index, comment.page) }}
        </span>
        <span class="uk-margin-small-right" :class="comment.user.level === '999' ? 'admin' : comment.user.gender === 'M' ? 'male' : 'female'">
          {{ comment.user_nickname }}
        </span>
        <span class="uk-text-muted reply-time">// {{ getRelativeTime(comment.reply_time) }}</span>

        <span
          class="uk-text-muted uk-margin-small-right story-mode-toggle"
          @click="toggleTempShow"
          v-if="storyModeOn && !isStoryModeUser"
        >暫時顯示</span>
        <span class="uk-icon-eye-slash story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-if="storyModeOn"></span>
        <span class="uk-icon-eye story-mode-toggle" @click="toggleStoryMode(comment.user.user_id)" v-else></span>
      </small>

      <div v-html="prepareCommentMsg(comment.msg)" v-show="isStoryModeUser || !storyModeOn || tempShow" />

      <div class="rating-container" v-if="getCommentIndex(index, comment.page) === 0">
        <span class="uk-icon-thumbs-up" />
        <span :class="{'like-color': threadLikeCount >= 20}">{{ threadLikeCount }}</span>
        &nbsp;
        <span class="uk-icon-thumbs-down" />
        <span :class="{'dislike-color': threadDislikeCount >= 20}">{{ threadDislikeCount }}</span>
      </div>
      <div class="rating-container" v-else>
        <span class="uk-icon-arrow-up" />
        <span :class="{'like-color': comment.like_count >= 20}">{{ comment.like_count }}</span>
        &nbsp;
        <span class="uk-icon-arrow-down" />
        <span :class="{'dislike-color': comment.dislike_count >= 20}">{{ comment.dislike_count }}</span>
      </div>
    </div>
  </li>
</template>

<script>
import helper from '../helper'

export default {
  name: 'commentItem',
  props: ['index', 'comment', 'isAuthor', 'toggleStoryMode', 'prepareCommentMsg', 'storeyModeId', 'threadLikeCount', 'threadDislikeCount'],
  data () {
    return {
      tempShow: false
    }
  },
  computed: {
    storyModeOn () {
      return this.storeyModeId !== -1
    },
    isStoryModeUser () {
      return this.comment.user.user_id === this.storeyModeId
    }
  },
  methods: {
    toggleTempShow () {
      this.tempShow = !this.tempShow
    },
    getCommentIndex (index, page) {
      return index + ((page - 1) * 25)
    },
    getRelativeTime (timestamp) {
      return helper.getRelativeTime(timestamp)
    }
  }
}
</script>

<style lang="scss">
.story-mode-toggle {
  cursor: pointer;
}

.comment {
  background: #2d2d2d;
  padding: 15px;
  word-wrap: break-word;
  line-height: 1.5;

  .white-theme & {
    /*box-shadow: 0 1px 4px rgba(0,0,0,.15);*/
    /*border: 1px solid #ddd;*/
    background: #fafafa;
  }

  .meta {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .reply-time {
    margin-right: auto;
  }

  img {
    vertical-align: text-bottom;
  }

  small {
    font-size: 80%;
  }

  sub {
    display: inline-block;
    border: 2px dotted #bdc3c7;
    color: inherit;
    padding: 5px 15px;
    border-radius: 5px;
    margin: 5px;
    font-size: inherit;
    line-height: 1;
  }

  .image-lazy-load {
    width: 100px;
  }
}

.rating-container {
  display: inline-block;
  padding: 3px 10px;
  margin-top: 15px;
  background: #3c3c3c;
  font-size: 14px;

  .white-theme & {
    background: #eee;
  }
}
</style>
