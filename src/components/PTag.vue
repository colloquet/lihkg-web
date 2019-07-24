<template>
  <div class="p-tag">P</div>
</template>

<style lang="scss" scoped>
.p-tag {
  display: inline-block;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  font-weight: bold;
  color: #ff443a;

  .night-mode & {
    background: #ddd;
    border: none;
  }
}
</style>

