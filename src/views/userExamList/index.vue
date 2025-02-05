<!-- @format -->

<script setup>
import { onMounted, ref } from 'vue'
import { getUserExamListApi } from '@/api/modules/examPaper'
import { cn } from '@/utils/cn.ts'
import router from '@/routers'

onMounted(() => {
  getUserExamList()
})

//获取考试列表
const examList = ref([])
const getUserExamList = async () => {
  console.log('你无敌了')
  const { data } = await getUserExamListApi()
  examList.value = data
}

//跳转到考试界面
const routerPushHandler = params => {
  router.push('/userExaming')
  localStorage.setItem('examPaper', JSON.stringify(params))
}

const backgroundColor = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
]
const getColor = () => {
  return backgroundColor[Math.floor(Math.random() * backgroundColor.length)]
}
</script>

<template>
  <div class="grid grid-cols-5 gap-10 p-[10px]">
    <div
      @click="routerPushHandler(item)"
      v-for="(item, index) in examList"
      class="cursor-pointer rounded-md bg-white transition-all duration-500 ease-in-out hover:scale-110"
    >
      <div :class="cn('bg flex h-[140px] items-center justify-center rounded-t-md', getColor())">
        <img class="w-[64px] rounded-t-md" src="@/assets/icons/doctorialhat.svg" alt="" />
      </div>

      <div class="px-[10px] pb-[10px]">
        <div class="mt-[5px] text-[1.5em]">{{ item.name }}</div>
        <div class="mt-[5px] text-[1.2em]">作者：{{ item.createdBy }}</div>
        <div class="mt-[5px] text-[1.2em]">创建时间:{{ item.createdAt.split(' ')[0] }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
