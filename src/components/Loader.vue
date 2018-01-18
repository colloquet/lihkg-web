<template>
  <div class="loader">Loading...</div>
</template>

<style lang="scss" scoped>
.loader,
.loader:after {
  border-radius: 50%;
  width: 32px;
  height: 32px;
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
  transform: translateZ(0);
  animation: load 1.1s infinite linear;

  .night-mode & {
    border-top: 3px solid rgba(#fff, 0.2);
    border-right: 3px solid rgba(#fff, 0.2);
    border-bottom: 3px solid rgba(#fff, 0.2);
    border-left: 3px solid #fff;
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
