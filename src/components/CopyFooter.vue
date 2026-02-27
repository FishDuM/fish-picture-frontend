<script setup lang="ts"></script>

<template>
  <div class="copy">
    <div class="left">
      <div class="logo">
        <div class="logoImage"></div>
        <div class="font">
          <div class="logoText">小鱼云图库</div>
          <div class="url">- picture.ljx.hk -</div>
        </div>
      </div>
      <div class="copyText">小鱼云图库&copy; by 会飞的鱼</div>
    </div>
    <div class="right">
      <div class="aboutProject">
        <div class="title"><strong> • 关于项目 </strong></div>
        <ul>
          <li class="firstLi"><router-link to="">关于图库</router-link></li>
          <li><router-link to="">关于付费</router-link></li>
          <li><router-link to="">关于文档</router-link></li>
        </ul>
      </div>
      <div class="aboutMe">
        <div class="title"><strong> • 联系我 </strong></div>
        <ul>
          <li><img style="width: 100px" src="../assets/qcode.jpg" alt="Fish的全栈之路" /></li>
          <li><router-link to="">联系站长小鱼</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.copy {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  min-width: 100%;
}

.left {
  width: 50%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.right {
  width: 50%;
  flex-shrink: 0;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  padding: 0 200px;
  gap: 100px;
}

.aboutProject,
.aboutMe {
  flex-shrink: 0;
}

.footer .logo {
  display: flex;
  align-items: center;
  width: auto;
  flex-shrink: 0;
  margin-top: 20px;
}

.copy .logoImage {
  width: 100px;
  height: 100px;
  background-image: url(@/assets/logo_white.png);
  background-size: 100px auto;
  background-repeat: no-repeat;
  flex-shrink: 0;
}

.logo .font {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
}

.logo .logoText {
  margin-top: 18px;
  font-weight: bold;
  font-size: 50px;
  user-select: none;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.logo .url {
  font-size: 20px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.copyText {
  margin-top: 25px;
  user-select: none;
}

ul {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
  font-size: 18px;
  margin-bottom: 10px;
  white-space: nowrap;
}

li a,
li a:link,
li a:visited,
li a:active {
  color: #202020;
  text-decoration: none;
}

li a:hover {
  color: #3e44ef;
  font-weight: bold;
}

.firstLi {
  margin-top: 20px;
}

.title {
  margin-left: -10px;
  margin-bottom: 10px;
  font-size: 20px;
  font-style: italic;
}
</style>
