<template>
  <div class="adeditor">
    <el-form>
      <div class="photo">
      <template v-for="(sl,index) in form.shopimg" v-if="form.shopimg.length > 0">
        <img :src="sl.path" :value='sl.imgid' class="avatar" @click="deleteimg(index)">
      </template>
      <el-form-item>
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      </div>
      <el-form-item label="商品名称">
        <el-input placeholder="请输入商品名称" v-model="form.shopname" style="width:270px"></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input placeholder="请输入商品描述" v-model="form.shopdes" style="width:270px"></el-input>
      </el-form-item>
      <el-form-item label="最低价格">
        <el-input placeholder="请输入基础价格" v-model="form.price" style="width:270px"></el-input>
      </el-form-item>
      <el-form-item label="所属分类">
         <el-select v-model="form.sortid">
            <el-option v-for="(el,index) in sortList" :key="index" :label='el.sortname' :value="el.sortid">{{el.sortname}}/{{el.sortename}}</el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="所属品牌">
        <el-select v-model="form.brandid">
           <el-option v-for="(el,index) in brandList" :key="index" :label='el.brandname' :value="el.brandid">{{el.brandname}}/{{el.brandename}}</el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="是否为二手产品">
        <el-radio-group v-model="form.isold">
          <el-radio-button label='1'>是</el-radio-button>
          <el-radio-button label='0'>否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="新旧成色" v-if='form.isold == 1'>
        <el-input placeholder="请输入新旧成色(例:9.5 九五新)"></el-input>
      </el-form-item>
      <el-form-item label="配置SPU(商品固定参数)">
         <el-tag closable v-for="(el,index) in form.spu" :key="index" v-if="form.spu.length>0" @close="handleClose('SPU',el.spec_id)">{{el.spec_name}}:{{el.spec_value}}</el-tag>
         <i class="el-icon-plus addspec" @click="addspec('SPU')" @close="handleClose(el)"></i>
      </el-form-item>
      <el-form-item label="配置SKU(商品参数)">
           <el-tag closable v-for="(el,index) in form.sku" :key="index" @close="handleClose('SKU',el.spec_id)" v-if="form.sku.length>0">{{el.spec_name}}:{{el.spec_value}},加价:{{el.price}}</el-tag>
         <i class="el-icon-plus addspec" @click="addspec('SKU')"></i>
      </el-form-item>
      <el-form-item label="商品详情">
         <d2-ueditor v-model="form.shopdetail"></d2-ueditor>
      </el-form-item>
      <el-form-item align='center'>
        <el-button type="primary" size='medium' v-if="type!='NEW'" @click='change' v-loading.fullscreen.lock="fullscreenLoading">更改</el-button>
        <el-button type="primary" size='medium' v-if="type=='NEW'" @click="add" v-loading.fullscreen.lock="fullscreenLoading">添加</el-button>
        <el-button type="danger">取消</el-button>
      </el-form-item>
    </el-form>
    <skuDialog :type='type' :sort='sort' ref="skueditor" @add='dealadd'></skuDialog>
  </div>
</template>

<script>
  import {
    getshopbyid,
    updateshop,
    addshop,
    getsort,
    getbrand
  } from '@/api/api'
    import { mapState, mapActions } from 'vuex'
  import skuDialog from './skuDialog'
  export default {
    name:'shopEditor',
    data() {
      return {
        form: {
          shopimg: [],
          shopname: '',
          price:'',
          sku:[],
          spu:[],
          isold: '0',
          oldtype: '',
          brandid: '',
          sortid: '',
          shopdes:'',
          shopdetail:''
        },
        brandList:[],
        sortList:[],
        type:'NEW',
        sort: 'SKU',
        fullscreenLoading: false
      }
    },
    components:{
        skuDialog
    },
    created() {
      this.type = this.$route.query.type
      if (this.type == 'CHANGE') {
        this.getshop({
          shopid: this.$route.query.id
        })
      }
      this.getsorts()
      this.getbrands()
    },
    methods: {
      getsorts(){
          const qdata = {
          sortname: '',
          pageSize: 100000,
          page: 1
        }
        getsort(qdata)
          .then(data => {
            if (data.code == 200) {
              this.sortList = data.info
            } else
              this.$message({
                message: `分类获取失败:${data.message}`,
                type: 'error'
              })
          })
      },
            ...mapActions('d2admin/page', [
		  'close',
		]),
      dealadd(data){
        if(data.type == 'SPU'){
          console.log(data.info.spec_id);
            if(this.form.spu.findIndex(el=>{
                return el.spec_id == data.info.spec_id
            })!=-1){
                this.$message({
                    message: '添加失败,已存在该属性,不能重复添加',
                    type: 'error'
                })
                return false
            }else if (this.form.sku.findIndex(el=>{
                return el.spec_id == data.info.spec_id
            })!=-1){
              this.$message({
                    message: '您已将此属性配置为SKU属性,配置失败',
                    type: 'error'
                })
                return false
            }
            else{
              this.form.spu.push(data.info)
            }
        } else {
            if(this.form.spu.findIndex(el=>{
                return el.spec_id == data.info.spec_id
            })!=-1){
              this.$message({
                    message: '您已将此属性配置为SPU属性,配置失败',
                    type: 'error'
                })
                return false
            }
            else{
              this.form.sku.push(data.info)
            }
        }
      },
      handleClose(type,id){
        let index = type == 'SPU' ? this.form.spu.forEach(el=>{
          return el.spec_id == id
        }) : this.form.sku.forEach(el=>{
          return el.spec_id == id
        })
        if(type == 'SPU'){
          this.form.spu.splice(index,1)
        }else{
          this.form.sku.splice(index,1)
        }
      },
      getbrands() {
        const qdata = {
          brandname: '',
          isfix:0,
          pageSize: 100000,
          page: 1
        }
        getbrand(qdata)
          .then(data => {
            if (data.code == 200) {
              this.brandList = data.info
            } else
              this.$message({
                message: data.message,
                type: 'error'
              })
          })
      },
      getshop(res) {
        getshopbyid(res)
          .then(b => {
            let data = b.info[0]
            let sku = []
            data.sku.forEach(el=>{
              el.value.forEach(es=>{
                let a = {
                  spec_id: el.spec_id,
                  spec_name: el.spec_name,
                  price: es.price,
                  sku_id :es.sku_id,
                  spec_value: es.spec_value
                }
                sku.push(a)
              }) 
            })
            const a = {
              shop_id: data.shop_id,
              shopname: data.shopName,
              shopimg: data.img,
              isold: data.isold,
              price: data.price,
              sku:sku,
              spu:data.spu,
              shopdes: data.shopdes,
              brandid: data.brandid,
              sortid:data.sortid,
              shopdetail: data.shopdetail
            }
            this.form = a
            console.log(this.form)
          })
          .catch(err => {
            this.$message({
              message: `获取失败${err}`,
              type: 'error'
            })
          })
      },
      addspec(type){
        this.sort = type
        this.$refs.skueditor.open()
      },
      add() {
        this.fullscreenLoading = true
        const res = {
          shopname: this.form.shopname,
          shopimg: this.form.shopimg,
          isold: this.form.isold,
          oldtype:this.form.oldtype,
          sku: this.form.sku,
          spu: this.form.spu,
          shopdes: this.form.shopdes,
          brandid: this.form.brandid,
          sortid: this.form.sortid,
          price: this.form.price,
          shopdetail: this.form.shopdetail
        }
        addshop(res).
        then(data => {
          if (data.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.fullscreenLoading = false
            this.$router.push({
              name: 'shopManage'
            })
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
      change() {
        this.$confirm('更改商品信息将会清空库存,是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullscreenLoading = true
        const res = {
          shop_id:this.form.shop_id,
          shopname: this.form.shopname,
          shopimg: this.form.shopimg,
          isold: this.form.isold,
          oldtype:this.form.oldtype,
          sku: this.form.sku,
          spu: this.form.spu,
          shopdes: this.form.shopdes,
          brandid: this.form.brandid,
          sortid: this.form.sortid,
          price: this.form.price,
          shopdetail: this.form.shopdetail
        }
        updateshop(res).
        then(data => {
          if (data.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.fullscreenLoading = false
            this.$router.push({
              name: 'shopManage'
            })
            let tagName = this.current
    this.close({tagName});
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }
        })
        })
      },
      deleteimg(el){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.shopimg.splice(el,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
            this.form.shopimg.push({imgid:'',path:imgFile})
          }
        }
        return isJPG && isLt2M;
      }
    }
  }

</script>

<style lang="scss" scoped>
.el-scrollbar__bar{
    display: none !important;
}
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
    display: flex;
    flex-flow: row wrap;
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
    margin-top: 5px;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    float: left;
    margin-right: 15px;
    border: 1px solid #d2d2d2;
    position: relative;
    top: 0;
    animation: photoshow .2s linear;
    margin-top: 5px;
    cursor: pointer;
  }
  @keyframes photoshow {
    0%{
        top: 15px;
    }
    50%{
       top: 7.5px
    }
    100%{
        top: 0
    }
  }
  .photo {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
  }
  .addspec{
     width: 50px;
     height: 30px;
     border:1px dashed #d2d2d2;
     font-size: 1.2em;
     text-align: center;
     line-height: 30px;
     border-radius: 6px; 
     cursor: pointer;
     margin-left: 8px;
  }
  .el-tag{
      margin-left: 8px;
  }

</style>
