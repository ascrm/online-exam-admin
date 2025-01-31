<!-- @format -->

<script lang="ts" setup>
import { ref } from 'vue'
import { cn } from '@/utils/cn'

const questionViewerList = [1, 2, 3, 4, 5, 6, 7]

const activeIndex = ref(4)
const right = ref(1)
const error = ref(2)
const finished = ref(3)
</script>

<template>
  <div class="mt-[40px] grid grid-cols-5 gap-4 px-[20px]">
    <div
      :class="
        cn(
          'flex h-[50px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-[1.5em] hover:bg-blue-300 hover:text-blue-600',
          index + 1 === activeIndex && 'bg-blue-300 text-blue-600',
        )
      "
      v-for="(item, index) in questionViewerList"
      :key="index"
    >
      <div :class="(index + 1 === right || index + 1 === error || index + 1 === finished) && 'hidden'">
        {{ index + 1 }}
      </div>
      <div
        :class="
          cn(
            'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-green-300',
            index + 1 === right && 'flex',
          )
        "
      >
        <el-icon class="text-green-600"><Select /></el-icon>
      </div>
      <div
        :class="
          cn(
            'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-red-300',
            index + 1 === error && 'flex',
          )
        "
      >
        <el-icon class="text-red-600"><CloseBold /></el-icon>
      </div>
      <div
        :class="
          cn(
            'hidden h-[100%] w-[100%] items-center justify-center rounded-md bg-blue-300',
            index + 1 === finished && 'flex',
          )
        "
      >
        <el-icon class="text-blue-600"><SemiSelect /></el-icon>
      </div>
    </div>
  </div>
</template>
