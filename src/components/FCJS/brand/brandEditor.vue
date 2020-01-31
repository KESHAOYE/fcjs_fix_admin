<template>
  <div class="adeditor">
    <el-form>
      <el-form-item label="上传品牌图片">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="form.brandimg" :src="form.brandimg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="品牌中文名">
        <el-input placeholder="请输入品牌中文名" v-model="form.brandname" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="品牌英文名">
        <el-input placeholder="请输入品牌英文名" v-model="form.brandename" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="是否提供维修">
        <el-radio-group v-model="form.isfix">
          <el-radio-button  label='1'>提供</el-radio-button>
          <el-radio-button  label='0'>不提供</el-radio-button>
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
  import {getbrandbyid,updatebrand,addbrand} from '@/api/api'
    import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        form: {
          brandimg: '',
          brandname: '',
          brandename: '',
          isfix: ''
        },
        type: 'NEW'
      }
    },
    created(){
      this.type=this.$route.query.type
      if(this.type == 'CHANGE'){
          this.getbrand({brandid:this.$route.query.id})
      }
    },
    methods: {
      getbrand(res){
        getbrandbyid(res)
        .then(b => {
            let data = b.info
           const a = {
               brandid: data.brandid,
               brandname: data.brandname,
               brandename: data.brandename,
               brandimg: data.brandimg,
               isfix: data.isfix
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
            ...mapActions('d2admin/page', [
		  'close',
		]),
      add(){
          const res={
            id: this.$route.query.id,
            brandid: this.form.brandid,
            brandname: this.form.brandname,
            brandename: this.form.brandename,
            brandimg: this.form.brandimg,
            isfix: this.form.isfix
          }
          addbrand(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '添加成功',
                   type: 'success'
                 })
                 this.$router.push({name: 'brandManage'})
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
      change(){
          const res={
            id: this.$route.query.id,
            brandid: this.form.brandid,
            brandname: this.form.brandname,
            brandename: this.form.brandename,
            brandimg: this.form.brandimg,
            isfix: this.form.isfix
          }
         updatebrand(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '修改成功',
                   type: 'success'
                 })
                 this.$router.push({name: 'brandManage'})
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
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        } else if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        } else {
          let files = new FileReader();
          files.readAsDataURL(file)
          files.onload = e => {
            let imgFile = e.target.result;
            this.form.brandimg = imgFile
          }
        }
        return isJPG && isLt2M;
      }
    }
  }

</script>

<style lang="scss" scoped>
  .adeditor {
    width: calc(100% - 40px);
    padding: 30px 20px;
    min-height: 300px;
    background: white;
  }
  .el-form-item{
      margin-bottom: 25px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    border: 1px dashed #d9d9d9;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
