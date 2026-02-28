<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { inject } from 'vue'
import type { Locale } from 'ant-design-vue/es/locale-provider'
const appLocale = inject<Locale>('appLocale')
</script>

<template>
  <a-config-provider :locale="appLocale">
    <BasicLayout />
  </a-config-provider>
</template>

<style scoped></style>
