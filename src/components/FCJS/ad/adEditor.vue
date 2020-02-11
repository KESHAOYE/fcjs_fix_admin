<template>
  <div class="adeditor">
    <el-form>
      <el-form-item label="选择广告位">
        <el-radio-group v-model="form.adid">
          <el-radio-button  label='1'>首页轮播图</el-radio-button>
          <el-radio-button  label='2'>官方推荐</el-radio-button>
          <el-radio-button  disabled>更多区域..</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传广告图片">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="form.adimg" :src="form.adimg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="选择展示时间">
        <el-date-picker v-model="form.date" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="对应商品" v-if="form.adid == 2">
        <el-input placeholder="点击选择商品" @focus="openshop" style="width:350px;" v-model="shopname"></el-input>
      </el-form-item>
      <el-form-item label="广告描述" v-if="form.adid == 2">
        <el-input placeholder="输入商品描述" style="width:350px;" v-model="form.shopres"></el-input>
      </el-form-item>
      <el-form-item align='center'>
         <el-button type="primary" size='medium' v-if="type!='NEW'" @click='change'>更改</el-button>
         <el-button type="primary" size='medium' v-if="type=='NEW'" @click="add">添加</el-button>
         <el-button type="danger">取消</el-button>
      </el-form-item>
    </el-form>
    <shopChoose ref="shopchoose" @shop='changeshop'/>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import {getaad,updatead,addad} from '@/api/api'
  import shopChoose from '../shop/shopChoose'
  export default {
    data() {
      return {
        form: {
          adid: 1,
          adimg: '',
          date:[],
          shopid: '',
          shopres: ''
        },
        shopname:'',
        type: 'NEW'
      }
    },
    created(){
      this.type=this.$route.query.type
      if(this.type == 'CHANGE'){
          this.getad({id:this.$route.query.id})
      }
    },
    components:{
      shopChoose
    },
    methods: {
      changeshop(data){
        this.form.shopid =data.shopid
        this.shopname = data.shopname 
      },
      openshop(){
        this.$refs.shopchoose.open()
      },
      getad(res){
        getaad(res)
        .then(b => {
            let data = b.info
            let starttime = new Date(data.startdue)
             starttime=starttime.setDate(starttime.getDate()-1);
             starttime=new Date(starttime);
             let overtime = new Date(data.overdue)
             overtime=overtime.setDate(overtime.getDate()-1);
             overtime=new Date(overtime);
           const a = {
               adid: data.adid,
               adimg: data.adimg,
               date:[starttime,overtime],
               shopid: data.shopid
           }
           console.log(a)
           this.shopname = data.shopname
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
            adid: this.form.adid,
            adimg: this.form.adimg,
            startdue:this.form.date[0],
            overdue: this.form.date[1],
            shopid: this.form.shopid,
            shopres: this.form.shopres
          }
          addad(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '添加成功',
                   type: 'success'
                 })

                 this.form.adid == 1 ? this.$router.push({name: 'indexAdManage'}) :  this.$router.push({name: 'shopRecomment'})
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
            adid: this.form.adid,
            adimg: this.form.adimg,
            startdue:this.form.date[0],
            overdue: this.form.date[1],
            shopid: this.form.shopid,
            shopres: this.form.shopres
          }
         updatead(res).
         then(data=>{
             if(data.code == 200){
                 this.$message({
                   message: '修改成功',
                   type: 'success'
                 })
                 this.form.adid == 1 ? this.$router.push({name: 'indexAdManage'}) :  this.$router.push({name: 'shopRecomment'})
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
            this.form.adimg = imgFile
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
      margin-bottom: 45px;
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
    width: 250px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 250px;
    height: 250px;
    display: block;
  }

</style>
