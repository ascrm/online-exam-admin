<!-- @format -->

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  row: {
    required: true,
    type: Object as PropType<any>,
  },
})
</script>

<template>
  <div>
    <el-form-item label="选项A" prop="optionA">
      <el-input v-model="props.row.optionA" autocomplete="off" />
    </el-form-item>
    <el-form-item label="选项B" prop="optionB">
      <el-input v-model="props.row.optionB" autocomplete="off" />
    </el-form-item>
    <el-form-item label="选项C" prop="optionC">
      <el-input v-model="props.row.optionC" autocomplete="off" />
    </el-form-item>
    <el-form-item label="选项D" prop="optionD">
      <el-input v-model="props.row.optionD" autocomplete="off" />
    </el-form-item>
    <el-form-item label="正确答案" prop="answer">
      <el-radio-group v-model="props.row.answer">
        <el-radio label="选项A" value="A"></el-radio>
        <el-radio label="选项B" value="B"></el-radio>
        <el-radio label="选项C" value="C"></el-radio>
        <el-radio label="选项D" value="D"></el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>
