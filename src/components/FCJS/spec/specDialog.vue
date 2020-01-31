<template>
  <div>
    <el-dialog title="添加/编辑规格" :visible="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="规格名">
          <el-input v-model="form.specName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格说明">
          <el-input v-model="form.specRes" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="change" v-if="this.type == 'CHANGE'">更新</el-button>
        <el-button type="primary" @click="add" v-if="this.type == 'NEW'">添加</el-button>
        <el-button type="danger" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getspecbyid,updatespec,addspec} from '@/api/api'
  export default {
    props:{
      type:{
          type: String,
          default:'NEW',
      },
      specId:{
          type: String,
          default:''
      }
    },
    data(){
    return{
      form:{
          specName:'',
          specRes:'',
      },
      dialogFormVisible: false
    }
    },
    methods:{
      open(){
        this.dialogFormVisible = true
        if(this.type == 'CHANGE'){
         this.getspec({specId: this.specId})
      }
      },
      getspec(res){
        getspecbyid(res)
        .then(b => {
           let data = b.info[0]
           const a = {
              specName: data.spec_name,
              specRes: data.spec_des
           }
           this.form = a
        })
        .catch(err=>{
            this.$message({
              message: `获取失败${err}`,
              type:'error'
            })
        })
      },
      add(){
          const res={
            specId: this.specId,
            specName: this.form.specName,
            specRes: this.form.specRes,
          }
          addspec(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '添加成功',
                   type: 'success'
                 })
                 this.dialogFormVisible =false
                 this.$router.push({name: 'specManage'})
             } else {
                 this.$message({
                   message: '添加失败',
                   type: 'error'
                 })
             }
         })
         this.$emit('ok')
      },
      change(){
          const res={
            specId: this.specId,
            specName: this.form.specName,
            specRes: this.form.specRes,
          }
         updatespec(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '修改成功',
                   type: 'success'
                 })
                 this.dialogFormVisible =false
                 this.$router.push({name: 'specManage'})
             } else {
                 this.$message({
                   message: '修改失败',
                   type: 'error'
                 })
             }
             this.$emit('ok')
         })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
