<template>
  <div class="loader" :class="{f5}">Loading...</div>
</template>

<script>
export default {
  props: ['f5']
}
</script>


<style lang="scss" scoped>
.loader,
.loader:after {
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  overflow: hidden;
}
.loader {
  display: inline-block;
  border-top: 3px solid rgba(#888, 0.2);
  border-right: 3px solid rgba(#888, 0.2);
  border-bottom: 3px solid rgba(#888, 0.2);
  border-left: 3px solid #888;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  will-change: transform;
  animation: load 1.1s infinite linear;

  .night-mode & {
    border-top: 3px solid rgba(#fff, 0.2);
    border-right: 3px solid rgba(#fff, 0.2);
    border-bottom: 3px solid rgba(#fff, 0.2);
    border-left: 3px solid #fff;
  }

  &.f5 {
    border-top: 3px solid rgba(#1ecd97, 0.2);
    border-right: 3px solid rgba(#1ecd97, 0.2);
    border-bottom: 3px solid rgba(#1ecd97, 0.2);
    border-left: 3px solid #1ecd97;
  }
}
@-webkit-keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
