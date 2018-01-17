<template>
  <div class="wrapper">
    <div class="meta animated"></div>
    <div class="title animated"></div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
  padding: 1.5rem;
  padding-left: 2rem;
  border-bottom: 1px solid #f5f5f5;

  .is-mobile & {
    padding: 1rem;
    padding-left: 1.5rem;
    height: 84px;
  }

  .night-mode & {
    border-bottom-color: #2b2b2b;
  }
}

.meta {
  display: inline-block;
  width: 100%;
  max-width: 200px;
  height: 14px;
}

.title {
  display: inline-block;
  width: 100%;
  height: 20px;
}

.animated {
  border-radius: 4px;
  background: linear-gradient(45deg, #f9f9f9, #e9e9e9, #f9f9f9);
  animation: loading 2s ease infinite;
  background-size: 600% 600%;

  .night-mode & {
    background: linear-gradient(45deg, #222, #333, #222);
    background-size: 600% 600%;
  }
}

@keyframes loading {
  0%,
  to {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
