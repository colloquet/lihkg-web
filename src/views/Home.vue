<template>
  <ul>
    <li v-for="category in allCategories" :key="category.cat_id">
      <router-link :to="'category/' + category.cat_id">{{ category.name }}</router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'allCategories'
    ])
  }
}
</script>

<style lang="scss">

</style>
