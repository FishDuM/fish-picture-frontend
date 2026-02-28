<template>
  <div id="userLoginPage">
    <h2 class="title">小鱼智能云图库在线登录</h2>
    <div class="desc">企业级智能云图库，提供在线图库服务</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish">
      <a-form-item
        label="账号"
        name="userAccount"
        :rules="[
          { required: true, message: '请输入你的账号' },
          { min: 7, message: '账号长度不能小于7' },
          { max: 16, message: '账号长度不能大于16' },
        ]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="userPassword"
        :rules="[
          { required: true, message: '请输入你的密码' },
          { min: 8, message: '密码长度不能小于8' },
          { max: 16, message: '密码长度不能大于16' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>
      <div class="tips">
        <span>没有账号？</span>
        <router-link to="/user/register">立即注册</router-link>
      </div>
      <a-form-item>
        <a-button style="width: 100%" type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { userLoginUsingPost } from '@/api/userController.ts'
import { userLoginStore } from '@/stores/userLoginStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

// 用于接收登录表单数据
const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const loginStore = userLoginStore()

// 登录表单提交
const onFinish = async (values: API.UserLoginRequest) => {
  const res = await userLoginUsingPost(values)
  // 登陆成功把全局登录态保存
  if (res.data.code === 0 && res.data.data) {
    message.success('登录成功')
    loginStore.setLoginUser(res.data.data)
    router.push({
      path: '/',
      // 登陆后无法后退回登录页
      replace: true,
    })
  } else {
    message.error('登录失败' + res.data.message)
  }
}
</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  color: #bbb;
  text-align: center;
  margin-bottom: 16px;
}

.tips {
  text-align: right;
  margin-bottom: 16px;
}
</style>
