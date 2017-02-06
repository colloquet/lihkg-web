<template>
  <div :id="id" class="uk-modal">
    <div class="uk-modal-dialog">
      <a href="#" class="uk-modal-close uk-close"></a>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: ['id']
}
</script>

<style lang="stylus">
.uk-modal {
  .uk-modal-dialog {
    background: #2b2b2b;

    .white-theme & {
      background: #f1f1f1;
    }
  }

  .uk-close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
