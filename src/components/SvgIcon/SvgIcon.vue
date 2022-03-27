<template>
  <svg class="svg-icon">
    <use :xlink:href="`#${iconName}`" />
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps({
    iconName: {
      type: String,
      required: true
    }
  })
</script>

<style scoped>
.svg-icon {
  @apply fill-current overflow-hidden w-full h-full
}
</style>