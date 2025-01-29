<!-- @format -->
<script setup lang="ts">
import { ref } from 'vue'
import QuestionTemplate from './questionTemplate.vue'
import { getQuestionViewerByIdApi } from '@/api/modules/question'

interface dialogProps {
  title: string
  row: any
  api?: (params: any) => Promise<any>
  getTableList: () => void
  isView: boolean
}

const dialogFormVisible = ref(false)
const dialogParams = ref<dialogProps>({
  title: '',
  row: {},
  getTableList: () => {},
  isView: false,
})

//打开对话框
const acceptParams = async (params: any) => {
  dialogFormVisible.value = true
  if (Object.keys(params.row).length === 0) {
    dialogParams.value = params
  } else {
    console.log(params.row.id)
    const { data }: any = await getQuestionViewerByIdApi({ id: params.row.id })
    if (data.questionType === 2) data.answer = data.answer.split(',')
    dialogParams.value = { ...params, row: data }
  }
}

//退出对话框
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
      <el-tabs v-if="Object.keys(dialogParams.row).length === 0" tab-position="top" class="demo-tabs">
        <el-tab-pane label="单选题">
          <QuestionTemplate :question-type="1" :dialog-params="dialogParams" @exit="exitHandler"></QuestionTemplate>
        </el-tab-pane>
        <el-tab-pane label="多选题">
          <QuestionTemplate :question-type="2" :dialog-params="dialogParams" @exit="exitHandler"></QuestionTemplate>
        </el-tab-pane>
        <el-tab-pane label="判断题">
          <QuestionTemplate :question-type="3" :dialog-params="dialogParams" @exit="exitHandler"></QuestionTemplate>
        </el-tab-pane>
      </el-tabs>

      <QuestionTemplate
        v-else
        :question-type="dialogParams.row.questionType"
        :dialog-params="dialogParams"
        @exit="exitHandler"
      ></QuestionTemplate>
    </el-dialog>
  </div>
</template>
