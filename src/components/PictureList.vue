<script setup lang="ts">
import { useRouter } from 'vue-router'

// 定义数据属性
interface Props {
  dataList: API.PictureVO[]
  loading: boolean
}
const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
})

// 点击图片查看详情
const router = useRouter()
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      style="padding: 0"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.thumbnailurl ?? picture.url"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag style="color: green">{{ picture.category ?? '默认' }}</a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">{{ tag }}</a-tag>
                </a-flex>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
#homePages {
  margin-bottom: 16px;
}
</style>
