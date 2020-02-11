<template>
  <div class="adeditor">
    <el-form>
      <el-form-item label="上传机型图片">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="form.model_img" :src="form.model_img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="所属品牌">
        <el-select v-model="form.brand_id">
          <el-option v-for="(el,index) in brandList" :key="index" :label='el.brandname' :value="el.brandid">
            {{el.brandname}}/{{el.brandename}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机型名称">
        <el-input placeholder="请输入机型名称" v-model="form.model_name" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="维修项目">
        <el-tag closable v-for="(el,index) in form.item" :key="index" @close="handleClose(el.item_id)"
          v-if="form.item.length>0">项目:{{el.item_name}},价格:{{el.price}}</el-tag>
        <i class="el-icon-plus addspec" @click="additem()"></i>
      </el-form-item>
      <el-form-item align='center'>
        <el-button type="primary" size='medium' v-if="type!='NEW'" @click='change'>更改</el-button>
        <el-button type="primary" size='medium' v-if="type=='NEW'" @click="add">添加</el-button>
        <el-button type="danger">取消</el-button>
      </el-form-item>
    </el-form>
    <chooseFixItemDialog ref="chooseFixItemDialog" @choose='additems' />
  </div>
</template>

<script>
  import {
    getfixmodelbyid,
    updatefixmodel,
    addfixmodel,
    getbrand
  } from '@/api/api'
  import {
    mapState,
    mapActions
  } from 'vuex'
  import chooseFixItemDialog from './chooseFixItemDialog'
  export default {
    data() {
      return {
        form: {
          model_img: '',
          model_name: '',
          brand_id: '',
          item: []
        },
        brandList: [],
        type: 'NEW'
      }
    },
    created() {
      this.type = this.$route.query.type
      this.getbrands()
      if (this.type == 'CHANGE') {
        this.getfixmodel()
      }
    },
    components: {
      chooseFixItemDialog
    },
    methods: {
      getbrands() {
        const data = {
          brandname: '',
          isfix: 0,
          page: 1,
          pageSize: 100000
        }
        getbrand(data)
          .then(b => {
            let data = b.info
            this.brandList = data
          })
          .catch(err => {
            this.$message({
              message: `获取失败${err}`,
              type: 'error'
            })
          })
      },
      getfixmodel(){
         getfixmodelbyid({model_id: this.$route.query.id})
         .then(data=>{
             this.form = data.info[0]
             console.log(this.form);
         })
         .catch(err=>{
             this.$message({
                message: '获取失败',
                type: 'error' 
             })
         })
      },
      ...mapActions('d2admin/page', [
        'close',
      ]),
      add() {
        const res = {
          brand_id: this.form.brand_id,
          model_name: this.form.model_name,
          model_img: this.form.model_img,
          fixitem: this.form.item
        }
        addfixmodel(res).
        then(data => {
          if (data.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({
              name: 'fixModelManage'
            })
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        })
      },
      change() {
        const res = {
          model_id: this.$route.query.id,
          brand_id: this.form.brand_id,
          model_name: this.form.model_name,
          model_img: this.form.model_img,
          fixitem: this.form.item
        }
        updatefixmodel(res).
        then(data => {
          if (data.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$router.push({
              name: 'fixModelManage'
            })
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }
        })
      },
      additem() {
        this.$refs.chooseFixItemDialog.open()
      },
      additems(data) {
        let index = this.form.item.findIndex(el => {
          return el.item_id == data.item_id
        })
        if (index != -1) {
          this.$message({
            message: '添加失败,已添加过此项目',
            type: 'error'
          })
        } else {
          this.form.item.push(data)
        }
      },
      handleClose(data) {
         let index = this.form.item.findIndex(el => {
          return el.item_id == data
        })
        console.log(index)
        if(index!=-1){
            this.form.item.splice(index,1)
        }
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
            this.form.model_img = imgFile
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

  .el-form-item {
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

  .addspec {
    width: 50px;
    height: 30px;
    border: 1px dashed #d2d2d2;
    font-size: 1.2em;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    cursor: pointer;
    margin-left: 8px;
  }

</style>
