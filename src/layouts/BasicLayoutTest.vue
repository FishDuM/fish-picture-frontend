<script setup lang="ts">
import CopyFooter from '@/components/CopyFooter.vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<template>
  <div id="basicLayout">
    <!-- min-height: 100vh 使得页面可视区域为整个屏幕-->
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <!--底部栏-->
      <a-layout-footer class="footer">
        <CopyFooter />
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding-inline: 20px;
  background: white;
}

.content {
  padding: 20px;
  background: linear-gradient(to right, #fff, #fafafa);
  margin-bottom: 250px;
}

.footer {
  background-color: #efefef;
  padding: 16px;
  bottom: 0;
  height: 200px;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: nowrap !important;
  white-space: nowrap;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  min-width: 1200px;
  box-sizing: border-box;
}
</style>
