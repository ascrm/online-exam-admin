<!-- @format -->

<script setup>
import { cn } from '@/utils/cn'
import { defineProps } from 'vue'

const props = defineProps({
  questionType: {
    required: true,
    type: Number,
  },
  activeItem: {
    required: true,
  },
  questionList: {
    required: true,
  },
})

const emit = defineEmits(['changeActiveItem'])
//切换题目
const changeActiveIndex = item => {
  emit('changeActiveItem', item)
}
</script>

<template>
  <div class="py-[10px]">
    <div class="flex cursor-default items-center justify-between px-[10px] text-blue-500">
      <div class="flex items-center text-[1.5em]">
        <slot name="left"></slot>
      </div>
      <div class="text-[1.5em]">
        {{ props.questionList.length }}
      </div>
    </div>
    <div class="mt-[5px] grid grid-cols-5 gap-4 px-[20px]">
      <div
        :class="
          cn(
            'flex h-[50px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-[1.5em] hover:bg-blue-300 hover:text-blue-600',
            item.id === props.activeItem.id && 'bg-blue-300 text-blue-600',
          )
        "
        v-for="(item, index) in props.questionList"
        :key="index"
        @click="changeActiveIndex(item)"
      >
        <div :class="item.answer && 'hidden'">
          {{ index + 1 }}
        </div>
        <div :class="'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-green-300'">
          <el-icon class="text-green-600"><Select /></el-icon>
        </div>
        <div :class="'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-red-300'">
          <el-icon class="text-red-600"><CloseBold /></el-icon>
        </div>
        <div
          :class="
            cn('hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-blue-300', item.answer && 'flex')
          "
        >
          <el-icon class="text-blue-600"><SemiSelect /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
