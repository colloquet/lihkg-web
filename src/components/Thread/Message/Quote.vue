<template>
  <blockquote>
    <button v-if="hideChildren" @click="hideChildren = false" class="button">顯示更多</button>
    <slot v-else></slot>
  </blockquote>
</template>

<script>
export default {
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
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  opacity: 0.5;

  .is-hoverable &:hover {
    opacity: 1;
  }
}
</style>
