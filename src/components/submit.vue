<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SubmitComponent",
  methods: {
    submit() {
      this.$emit("submitForm");
    },
  },
});
</script>
<template>
  <b-button @click="submit">Submit</b-button>
</template>
