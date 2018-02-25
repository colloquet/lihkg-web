<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click.self="$emit('close')">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    handleKeyDown(event) {
      if (event.keyCode === 27) {
        this.$emit('close')
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }
}
</script>


<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
  will-change: opacity;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 18rem;
  margin: 0px auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  will-change: transform;

  .night-mode & {
    background: #202020;
  }
}

.modal-header h3 {
  display: inline-block;
  margin: 0;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #1ecd97;

  .night-mode & {
    border-bottom-color: #42b983;
  }
}

.modal-body {
  margin: 1rem 0 0;
}

.modal-enter,
.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: translate3d(0, 2rem, 0);
}
</style>
