<template>
    <div class="adeditor">
      <el-form>
        </el-form-item>
        <el-form-item label="收款银行中文名">
          <el-input placeholder="请输入收款银行中文名" v-model="form.receive_name" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="收款银行英文名">
          <el-input placeholder="请输入收款银行英文名" v-model="form.receive_ename" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="收款银行图标">
            <el-input placeholder="请输入收款银行图标" v-model="form.receive_icon" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="收款账号">
            <el-input placeholder="请输入收款账号" v-model="form.receive_account" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item align='center'>
           <el-button type="primary" size='medium' v-if="type=='NEW'" @click="add">添加</el-button>
           <el-button type="danger">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
    import {addreceive} from '@/api/api'
      import { mapState, mapActions } from 'vuex'
    export default {
      data() {
        return {
          form: {
            receive_name: '',
            receive_ename: '',
            receive_icon: '',
            receive_account: ''
          },
          type: 'NEW'
        }
      },
      created(){
        this.type=this.$route.query.type
      },
      methods: {
        add(){
          addreceive(this.form).
           then(data=>{
               if(data.code == 200){
                   this.$message({
                     message: '添加成功',
                     type: 'success'
                   })
                   this.$router.push({name: 'setBank'})
               } else {
                   this.$message({
                     message: '添加失败',
                     type: 'error'
                   })
               }
           })
        },
    }
}
  
  </script>
  
  <style lang="scss" scoped>
    .adeditor {
      width: calc(100% - 40px);
      padding: 30px 20px;
      min-height: 200px;
      background: white;
    }
    .el-form-item{
        margin-bottom: 45px;
    }
  </style>
  