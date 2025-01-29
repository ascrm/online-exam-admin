<!-- @format -->
<script setup lang="ts">
import { ref } from 'vue'
import SingleDialog from './singleDialog.vue'
import MultipleDialog from './multipleDialog.vue'
import JudgeDialog from './judgeDialog.vue'

interface dialogProps {
  title: string
  row: any
  api?: (params: any) => Promise<any>
  getTableList: () => void
}

const dialogFormVisible = ref(false)
const dialogParams = ref<dialogProps>({
  title: '',
  row: {},
  getTableList: () => {},
})

//打开对话框
const acceptParams = (params: any) => {
  dialogFormVisible.value = true
  dialogParams.value = params
}

const exitHandler = () => {
  dialogFormVisible.value = false
}

defineExpose({
  acceptParams,
})
</script>
<template>
  <div>
    <el-dialog v-model="dialogFormVisible" :title="`${dialogParams.title}试卷`" width="800">
      <el-tabs tab-position="top" class="demo-tabs">
        <el-tab-pane label="单选题">
          <SingleDialog :dialog-params="dialogParams" @exit="exitHandler"></SingleDialog>
        </el-tab-pane>
        <el-tab-pane label="多选题"> <MultipleDialog></MultipleDialog></el-tab-pane>
        <el-tab-pane label="判断题"> <JudgeDialog></JudgeDialog></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
