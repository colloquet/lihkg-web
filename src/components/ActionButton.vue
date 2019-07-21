<template>
  <button class="button" :class="{ success }" @click="$emit('click')">
    <span class="top">
      <slot name="text"></slot>
    </span>
    <span class="bottom">
      <slot name="successText"></slot>
    </span>
  </button>
</template>

<script>
export default {
  props: ['success'],
}
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  background: transparent;
  border: 0;
  border-radius: 4px;
  padding: 0 1rem;
  height: 2rem;
  text-align: center;
  color: inherit;
  cursor: pointer;
  outline: none;
  overflow: hidden;

  .is-hoverable &:hover {
    background: #f5f5f5;
  }

  .is-hoverable.night-mode &:hover {
    background: mix(white, #121212, 8%);
  }

  .top,
  .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    transition: transform 0.2s ease;
  }

  .bottom {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
  }

  &.success {
    .top {
      transform: translateY(-100%);
    }

    .bottom {
      transform: translateY(-100%);
    }
  }
}

.success {
  animation: success 1s ease;

  .night-mode & {
    animation: success-dark 1s ease;
  }
}

@keyframes success {
  0% {
    background: #1ecd97;
  }
  to {
    background: transparent;
  }
}

@keyframes success-dark {
  0% {
    background: #42b983;
  }
  to {
    background: transparent;
  }
}
</style>
