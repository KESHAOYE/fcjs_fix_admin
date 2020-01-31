<template>
  <div class="adeditor">
    <el-form>
      </el-form-item>
      <el-form-item label="分类中文名">
        <el-input placeholder="请输入品牌中文名" v-model="form.sortname" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="分类英文名">
        <el-input placeholder="请输入品牌英文名" v-model="form.sortename" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="form.isshow">
          <el-radio-button  label='1'>显示</el-radio-button>
          <el-radio-button  label='0'>不显示</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item align='center'>
         <el-button type="primary" size='medium' v-if="type!='NEW'" @click='change'>更改</el-button>
         <el-button type="primary" size='medium' v-if="type=='NEW'" @click="add">添加</el-button>
         <el-button type="danger">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getsortbyid,updatesort,addsort} from '@/api/api'
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
          this.getsort({sortid:this.$route.query.id})
      }
    },
    methods: {
      getsort(res){
        getsortbyid(res)
        .then(b => {
            let data = b.info[0]
           const a = {
               sortid :data.sortid,
               sortname: data.sortname,
               sortename: data.sortename,
               isshow: data.isshow
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
            sortid: this.form.sortid,
            sortname: this.form.sortname,
            sortename: this.form.sortename,
            isshow: this.form.isshow
          }
          addsort(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '添加成功',
                   type: 'success'
                 })
                 this.$router.push({name: 'sortManage'})
                 let tagName = this.current
    this.close({tagName});
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
            sortid: this.form.sortid,
            sortname: this.form.sortname,
            sortename: this.form.sortename,
            isshow: this.form.isshow
          }
         updatesort(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '修改成功',
                   type: 'success'
                 })
                 this.$router.push({name: 'sortManage'})
                 let tagName = this.current
    this.close({tagName});
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
    min-height: 200px;
    background: white;
  }
  .el-form-item{
      margin-bottom: 45px;
  }
</style>
