<template>
  <b-form-group :label="label" :label-for="inputId" class="mb-3">
    <b-form-input
      v-if="inputRef === 'postcode'"
      v-model="localValue"
      :id="inputId"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <b-form-input
      v-if="inputRef === 'address'"
      v-model="localValue"
      :id="inputId"
      :placeholder="placeholder"
    />
    <slot></slot>
    <div v-if="error" class="text-danger">{{ error }}</div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FormInput",
  props: {
    label: {
      type: String,
      default: "",
      required: true,
    },
    inputId: {
      type: String,
      default: "",
      required: true,
    },
    error: {
      type: String,
      default: "",
      required: false,
    },
    value: {
      type: String,
      default: "",
      required: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    inputRef: {
      type: String,
      default: "",
      required: false,
    },
  },
  data() {
    return {
      localValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.localValue = newValue;
    },
    localValue(newValue) {
      this.$emit("input", newValue);
    },
  },
  methods: {
    handleInput(event: Event) {
      this.$emit("input", this.localValue);
    },
  },
});
</script>
