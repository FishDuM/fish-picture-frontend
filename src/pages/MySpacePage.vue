<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userLoginStore } from '@/stores/userLoginStore.ts'
import { listSpaceVoByPageUsingPost } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'

const router = useRouter()
const userLogin = userLoginStore()

const getUserPace = async () => {
  const user = userLogin.loginUser
  // 判断用户是否登录
  if (!user.id) {
    router.replace('/user/login')
    return
  }
  // 查询用户的空间
  const res = await listSpaceVoByPageUsingPost({
    userId: user.id,
    current: 1,
    pageSize: 1,
  })
  if (res.data.code === 0) {
    if (res.data.data?.records?.length > 0) {
      const space = res.data.data?.records[0]
      await router.replace(`/space/${space.id}`)
    } else {
      await router.replace('/add_space')
      message.warn('请先创建空间')
    }
  } else {
    message.error('获取空间失败，请稍后再试' + res.data.message)
  }
}

onMounted(async () => {
  await getUserPace()
})
</script>

<template>
  <div id="mySpacePage">
    <p>正在转跳中...</p>
  </div>
</template>

<style scoped></style>
