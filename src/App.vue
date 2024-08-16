<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App",
});
</script>
<template>
  <!-- TODO provide a responsive container for all views so the form renders on mobile and desktop appropriately -->
  <div id="app">
    <router-view :key="$route.path" />
  </div>
</template>
