<template>
  <sub>
    <button v-if="hideChildren" @click="hideChildren = false">顯示更多</button>
    <slot v-else></slot>
  </sub>
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
