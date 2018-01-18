<template>
  <div>
    <input class="toggle" :id="id" type="checkbox" :checked="on" @click="$emit('change')" />
    <label class="toggle-btn" data-tg-off="關" data-tg-on="開" :for="id"></label>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  props: ['on'],
  data() {
    return {
      id: `${Date.now()}${Math.round(Math.random() * 10000)}`,
    }
  },
}
</script>

<style lang="scss" scoped>
.toggle {
  display: none;

  + .toggle-btn {
    border-radius: 4px;
    outline: 0;
    display: block;
    width: 3rem;
    height: 2rem;
    position: relative;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    backface-visibility: hidden;
    transition: all 0.2s ease;
    font-family: sans-serif;
    background: #888;

    &:after,
    &:before {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      width: 100%;
      height: 100%;
      text-align: center;
      position: absolute;
      color: #fff;
      will-change: left, background;
    }

    &:after {
      left: 100%;
      content: attr(data-tg-on);
    }

    &:before {
      left: 0;
      content: attr(data-tg-off);
    }

    &:active {
      background: #888;

      &:before {
        left: -10%;
      }
    }
  }

  &:checked + .toggle-btn {
    background: #1ecd97;

    .night-mode & {
      background: #42b983;
    }

    &:before {
      left: -100%;
    }

    &:after {
      left: 0;
    }

    &:active:after {
      left: 10%;
    }
  }
}
</style>
