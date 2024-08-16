<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "TextComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator(value: string) {
        return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(value);
      },
    },
    classes: {
      type: String,
      default: "",
    },
  },
});
</script>
<template>
  <component :is="type" :class="[classes]">{{ text }}</component>
</template>
