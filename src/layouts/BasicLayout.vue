<script setup lang="ts">
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
        <div>小鱼云图库&copy; by 会飞的鱼</div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.header {
  padding-inline: 20px;
  margin-bottom: 16px;
  color: unset;
  background: white;
}

.content {
  padding: 20px;
  background: linear-gradient(to right, #fff, #fafafa);
  margin-bottom: 35px;
}

.footer {
  background-color: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
