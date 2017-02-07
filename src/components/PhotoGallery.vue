<template>
  <div class="photo-mode-container">
    <div class="uk-clearfix photo-mode-header">
      <span class="uk-icon-image"></span> 圖片模式
      <a class="uk-float-right photo-mode-close" @click.prevent="$emit('onClose')"><span class="uk-icon-remove"></span> 關閉</a>
    </div>
    <div class="photo-mode-body">
      <div class="uk-container uk-container-center">
        <p class="uk-text-center" v-if="noImages && !isImagesLoading">此post冇圖片</p>
        <div class="uk-grid uk-grid-small uk-grid-width-1-3 uk-grid-width-medium-1-4 uk-grid-width-large-1-5 uk-grid-width-xlarge-1-6" v-else>
          <div v-for="image in images">
            <a :href="image.url" @click.prevent="$emit('image-click', image.url)">
              <div class="image-container" :style="{backgroundImage: `url(${image.url})`}"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: ['no-images', 'images', 'is-images-loading']
}
</script>

<style lang="stylus">
.photo-mode-container {
  position: fixed;
  background: #222;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;

  .white-theme & {
    background: #f1f1f1;
  }

  .photo-mode-header {
    box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.3);
    background: #333;
    padding: 0 15px;
    line-height: 40px;

    .white-theme & {
      background: #fff;
      color: #222;
    }
  }

  .photo-mode-body {
    position: absolute;
    top: 40px;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 15px 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .image-container {
      background-size: cover;
      background-position: center center;
      background-color: #333;
      width: 100%;
      padding-bottom: 100%;
      margin-bottom: 15px;

      .white-theme & {
        background: #ddd;
      }
    }
  }
}
</style>
