<!-- @format -->

<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import { PropType, reactive, ref } from 'vue'
import SingleDialog from './singleDialog.vue'
import MultipleDialog from './multipleDialog.vue'
import JudgeDialog from './judgeDialog.vue'

const props = defineProps({
  questionType: {
    required: true,
    type: Number,
  },
  dialogParams: {
    required: true,
    type: Object as PropType<{
      title: string
      row: any
      api?: (params: any) => Promise<any>
      getTableList: () => void
      isView: boolean
    }>,
  },
})

const rules = reactive({
  name: [{ required: true, message: '请输入题目名称' }],
  description: [{ required: true, message: '请输入题干内容' }],
  optionA: [{ required: true, message: '请输入选项A的内容' }],
  optionB: [{ required: true, message: '请输入选项B的内容' }],
  optionC: [{ required: true, message: '请输入选项C的内容' }],
  optionD: [{ required: true, message: '请输入选项D的内容' }],
  answer: [{ required: true, message: '请选择正确答案' }],
  score: [{ required: true, message: '请输入题目分数' }],
  difficulty: [{ required: true, message: '请选择题目难度' }],
})

//提交数据
const ruleFormRef = ref<FormInstance>()
const submitHandler = async () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return
    try {
      if (props.dialogParams.row.createdAt != null)
        props.dialogParams.row.createdAt = props.dialogParams.row.createdAt.split(' ').join('T')
      if (props.dialogParams.row.updatedAt != null)
        props.dialogParams.row.updatedAt = props.dialogParams.row.updatedAt.split(' ').join('T')
      if (props.dialogParams.row.answer instanceof Array)
        props.dialogParams.row.answer = props.dialogParams.row.answer.join(',')

      props.dialogParams.row.questionType = props.questionType
      await props.dialogParams.api!(props.dialogParams.row)
      ElMessage.success({ message: `${props.dialogParams.title}题目成功！` })
      props.dialogParams.getTableList!()
      emit('exit')
    } catch (error) {
      console.log(error)
    }
  })
}

//退出对话框
const emit = defineEmits<{
  (e: 'exit'): void
}>()
const exitDialog = () => {
  emit('exit')
}
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :disabled="props.dialogParams.isView"
      :rules="rules"
      label-width="120px"
      label-suffix=" :"
      :model="props.dialogParams.row"
    >
      <el-form-item label="题目名称" prop="name">
        <el-input v-model="props.dialogParams.row.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="题干" prop="description">
        <el-input type="textarea" :rows="5" resize="none" v-model="props.dialogParams.row.description" />
      </el-form-item>
      <SingleDialog v-if="props.questionType === 1" :row="props.dialogParams.row"></SingleDialog>
      <MultipleDialog v-if="props.questionType === 2" :row="props.dialogParams.row"></MultipleDialog>
      <JudgeDialog v-if="props.questionType === 3" :row="props.dialogParams.row"></JudgeDialog>
      <el-form-item label="题目分数" prop="score">
        <el-input-number v-model="props.dialogParams.row.score" :min="0" :max="20" :step="2" />
      </el-form-item>
      <el-form-item label="难度" prop="difficulty">
        <el-select v-model="props.dialogParams.row.difficulty">
          <el-option label="入门" value="1"></el-option>
          <el-option label="简单" value="2"></el-option>
          <el-option label="普通" value="3"></el-option>
          <el-option label="中等" value="4"></el-option>
          <el-option label="困难" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="解析" prop="analysis">
        <el-input type="textarea" :rows="5" resize="none" v-model="props.dialogParams.row.analysis" />
      </el-form-item>
    </el-form>

    <div style="display: flex; justify-content: end" class="dialog-footer">
      <el-button @click="exitDialog">取消</el-button>
      <el-button type="primary" @click="submitHandler"> 确定 </el-button>
    </div>
  </div>
</template>
