<script setup lang="ts">
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import PictureList from '@/components/PictureList.vue'
import { formatSize } from '@/utils'

const props = defineProps<{
  id: number
}>()
const space = ref<API.SpaceVO>({})

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}

// 定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  spaceId: props.id,
  current: 1,
  pageSize: 12,
  sortOrder: 'descend',
})

// 调用接口
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const parms = {
    ...searchParams,
    tags: [] as string[],
  }
  if (selectedCategory.value !== 'all') {
    parms.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      parms.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPageUsingPost({ ...parms })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.data.message)
  }
  loading.value = false
}

// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

const loading = ref(true)

// 标签和分类列表
const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<boolean[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}

const onSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

onMounted(() => {
  onSearch()
  fetchSpaceDetail()
  getTagCategoryOptions()
})
</script>

<template>
  <div id="spaceDetailPage">
    <!-- 空间信息 -->
    <a-flex style="margin-bottom: 20px" justify="space-between">
      <h2>{{ space.spaceName }} （私有空间）</h2>
      <a-space :size="50">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank"
          >添加图片</a-button
        >
        <a-tooltip
          placement="topRight"
          :title="`当前占用空间大小：${formatSize(space.totalSize)} / ${formatSize(space.maxSize)} `"
        >
          <a-progress
            type="circle"
            :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
            :size="40"
          />
        </a-tooltip>
      </a-space>
    </a-flex>

    <!-- 搜索框 -->
    <div class="search-bar" style="margin-bottom: 30px">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="从空间图片中搜索"
        enter-button="搜索"
        size="large"
        @search="onSearch"
      />
    </div>
    <!-- 标签分类的标签筛选 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="onSearch">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
    </a-tabs>
    <!-- 标签栏 -->
    <div class="tag-bar" style="margin-bottom: 25px">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="onSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading" />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :showTotal="() => `共 ${total} 条`"
      @change="onPageChange"
    />
  </div>
</template>

<style scoped>
#spaceDetailPage {
  margin-bottom: 16px;
}
</style>
