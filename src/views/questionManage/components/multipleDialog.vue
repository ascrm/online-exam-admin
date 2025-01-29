<!-- @format -->

<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import { PropType, reactive, ref } from 'vue'

const props = defineProps({
  dialogParams: {
    required: true,
    type: Object as PropType<{
      title: string
      row: any
      api?: (params: any) => Promise<any>
      getTableList: () => void
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

      if (props.dialogParams.row.questionType == null) props.dialogParams.row.questionType = 2

      console.log(props.dialogParams.row.isPublished)
      await props.dialogParams.api!(props.dialogParams.row)
      ElMessage.success({ message: `${props.dialogParams.title}用户成功！` })
      props.dialogParams.getTableList!()
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
    <el-form ref="ruleFormRef" :rules="rules" label-width="120px" label-suffix=" :" :model="dialogParams.row">
      <el-form-item label="题目名称" prop="name">
        <el-input v-model="dialogParams.row.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="题干" prop="description">
        <el-input type="textarea" :rows="5" resize="none" v-model="dialogParams.row.description" />
      </el-form-item>
      <el-form-item label="选项A" prop="optionA">
        <el-input v-model="dialogParams.row.optionA" autocomplete="off" />
      </el-form-item>
      <el-form-item label="选项B" prop="optionB">
        <el-input v-model="dialogParams.row.optionB" autocomplete="off" />
      </el-form-item>
      <el-form-item label="选项C" prop="optionC">
        <el-input v-model="dialogParams.row.optionC" autocomplete="off" />
      </el-form-item>
      <el-form-item label="选项D" prop="optionD">
        <el-input v-model="dialogParams.row.optionD" autocomplete="off" />
      </el-form-item>
      <el-form-item label="正确答案" prop="answer">
        <el-checkbox-group v-model="dialogParams.row.answer">
          <el-checkbox label="选项A" value="A" />
          <el-checkbox label="选项B" value="B" />
          <el-checkbox label="选项C" value="C" />
          <el-checkbox label="选项D" value="D" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="题目分数" prop="score">
        <el-input-number v-model="dialogParams.row.score" :min="0" :max="20" :step="2" />
      </el-form-item>
      <el-form-item label="难度" prop="difficulty">
        <el-select v-model="dialogParams.row.difficulty">
          <el-option label="入门" value="1"></el-option>
          <el-option label="简单" value="2"></el-option>
          <el-option label="普通" value="3"></el-option>
          <el-option label="中等" value="4"></el-option>
          <el-option label="困难" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="解析" prop="analysis">
        <el-input type="textarea" :rows="5" resize="none" v-model="dialogParams.row.analysis" />
      </el-form-item>
    </el-form>

    <div style="display: flex; justify-content: end" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitHandler"> 确定 </el-button>
    </div>
  </div>
</template>
