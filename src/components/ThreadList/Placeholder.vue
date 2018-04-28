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
</style>
