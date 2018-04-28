<template>
  <div class="container">
    <div class="meta animated"></div>
    <div class="msg line-1 animated"></div>
    <div class="msg line-2 animated"></div>
    <div class="msg line-3 animated"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 1.5rem 1rem;
  border-bottom: 0.5px solid #f1f1f1;

  &:first-of-type {
    border-top: 0.5px solid #f1f1f1;
  }

  .night-mode & {
    border-top-color: #333;
    border-bottom-color: #333;
  }
}

.meta {
  width: 140px;
  height: 16px;
  margin-bottom: 1.2rem;
}

.msg {
  height: 20px;
  margin-bottom: 4px;
}

.line-1 {
  width: 120px;
}

.line-2 {
  width: 180px;
}

.line-3 {
  width: 240px;
}
</style>
