<!-- @format -->

<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <div class="text-[1.5em] [&_div]:py-[5px]">
      <div>昵称：{{ userInfo.nickName }}</div>
      <div>账号：{{ userInfo.username }}</div>
      <div>性别：{{ userInfo.gender }}</div>
      <div>邮箱：{{ userInfo.email }}</div>
      <div>手机号：{{ userInfo.phone }}</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { computed, ref } from 'vue'

const dialogVisible = ref(false)
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({ openDialog })
</script>
