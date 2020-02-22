<template>
  <div class="adeditor">
    <el-form>
      </el-form-item>
      <el-form-item label="分类名">
        <el-input placeholder="请输入分类名" v-model="form.sort_name" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item align='center'>
         <el-button type="primary" size='medium' v-if="type!='NEW'" @click='change'>更改</el-button>
         <el-button type="primary" size='medium' v-if="type=='NEW'" @click="add">添加</el-button>
         <el-button type="danger" plain>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getfixitemsortbyid,updatefixitemsort,addfixitemsort} from '@/api/api'
    import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        form: {
          sortname: '',
          sortename: '',
          isshow: '',
        },
        type: 'NEW'
      }
    },
    created(){
      this.type=this.$route.query.type
      if(this.type == 'CHANGE'){
          this.getsort({sort_id:this.$route.query.id})
      }
    },
    methods: {
      getsort(res){
        getfixitemsortbyid(res)
        .then(b => {
            let data = b.info[0]
           const a = {
               sort_id :data.sort_id,
               sort_name: data.sort_name,
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
            sort_name: this.form.sort_name,
          }
          addfixitemsort(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '添加成功',
                   type: 'success'
                 })
                 this.$router.push({name: 'fixSortManage'})
             } else {
                 this.$message({
                   message: '添加失败',
                   type: 'error'
                 })
             }
         })
      },
            ...mapActions('d2admin/page', [
		  'close',
		]),
      change(){
          const res={
            sort_id: this.form.sort_id,
            sort_name: this.form.sort_name,
          }
         updatefixitemsort(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '修改成功',
                   type: 'success'
                 })
                 this.$router.push({name: 'fixSortManage'})
             } else {
                 this.$message({
                   message: '修改失败',
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
    min-height: 100px;
    background: white;
  }
  .el-form-item{
      margin-bottom: 45px;
  }
</style>
