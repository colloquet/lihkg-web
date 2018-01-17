<template>
  <blockquote>
    <button v-if="hideChildren" @click="hideChildren = false" class="button">顯示更多</button>
    <slot v-else></slot>
  </blockquote>
</template>

<script>
export default {
  name: 'Quote',
  props: ['level', 'isDeep'],
  data() {
    return {
      hideChildren: this.isDeep,
    }
  },
}
</script>

<style lang="scss" scoped>
.button {
  appearance: none;
  border: 1px solid;
  background: transparent;
  color: inherit;
  border-radius: 4px;
  font-size: .875rem;
  padding: .25rem .5rem;
  cursor: pointer;
}
</style>
