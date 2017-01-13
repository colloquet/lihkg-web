<template>
  <div class="photo-mode-container">
    <div class="uk-clearfix photo-mode-header">
      <span class="uk-icon-image"></span> 圖片模式
      <a class="uk-float-right photo-mode-close" @click.prevent="$emit('onClose')"><span class="uk-icon-remove"></span> 關閉</a>
    </div>
    <div class="photo-mode-body">
      <div class="uk-container uk-container-center">
        <p class="uk-text-center" v-if="noImages">此post冇圖片</p>
        <div class="uk-grid uk-grid-small uk-grid-width-1-3 uk-grid-width-medium-1-4 uk-grid-width-large-1-5 uk-grid-width-xlarge-1-6" v-else>
          <div v-for="image in images">
            <a :href="image.url" data-uk-lightbox="{group:'photo-mode'}" data-lightbox-type="image">
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
  props: ['no-images', 'images']
}
</script>

<style lang="stylus">

</style>
