<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
    <el-dialog title="选择商品" :visible="dialogFormVisible" :before-close='close'>
    <!-- 查询工具 -->
    <div class="toolkits">
      <el-form :inline="true">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="form.shopName" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="form.sortid">
            <el-option v-for="(el,index) in sortList" :key="index" :label='el.sortname' :value="el.sortid">{{el.sortname}}/{{el.sortename}}</el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="所属品牌">
          <el-select v-model="form.brandid">
           <el-option v-for="(el,index) in brandList" :key="index" :label='el.brandname' :value="el.brandid">{{el.brandname}}/{{el.brandename}}</el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="是否为二手">
          <el-radio-group v-model="form.isold">
          <el-radio-button label='1'>是</el-radio-button>
          <el-radio-button label='0'>否</el-radio-button>
        </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getshops">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <el-table-column label='商品图片(点击查看所有图片)' align='center'>
        <template slot-scope="scope">
          <el-image :src='scope.row.img[0].path' alt="" style="width: 80px; height: 80px;"
            :preview-src-list='imgs' @click="changeimg(scope)"/>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align='center'>
        <template slot-scope="scope">
          {{scope.row.shopName}}
        </template>
      </el-table-column>
      <el-table-column label="商品品牌" align='center'>
        <template slot-scope="scope">
          {{scope.row.brandname}}
        </template>
      </el-table-column>
      <el-table-column label="商品分类" align='center'>
        <template slot-scope="scope">
          {{scope.row.sortname}}
        </template>
      </el-table-column>
      <el-table-column label="是否为二手" align='center'>
        <template slot-scope="scope">
          {{scope.row.isold|isold}}
        </template>
      </el-table-column>
      <el-table-column label="二手定义" align='center'>
        <template slot-scope="scope">
          {{scope.row.oldtype|oldtype}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align='center'>
          <template slot-scope="scope" >
           <span style="cursor:pointer;color:#0084ff;" @click="choose(scope.row)">选择</span>
        </template>
      </el-table-column>
    </ftable>
    </el-dialog>
  </div>
</template>

<script>
  import ftable from '../util/table'
  import {
    getshop,
    deleteshop,
    getsort,
    getbrand
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        form:{
          shopName: '',
          sortid:'',
          brandid:'',
          isold:''
        },
        tableData: [],
        pageSize: 3,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true,
        brandList:[],
        sortList:[],
        imgs:[],
        dialogFormVisible: false
      }
    },
    filters:{
      isold(val){
        return {
          0: '否',
          1: '是'
        }[val]
      },
      oldtype(val){
          if(val == null || val == 'undefined'){
             return '非二手'
          }else{
            return `${val}成新`
          }
      }
    },
    components: {
      ftable
    },
    computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
    methods: {
        choose(row){
          this.close();
          console.log('object');
          this.$emit('shop',{shopid: row.shop_id,shopname: row.shopName}) 
        },
       open(){
         this.dialogFormVisible = true
         this.getsorts();
      this.getbrands();
      this.getshops()
      },
      close(){
          this.dialogFormVisible = false
      },
      changeimg(scope){
        this.imgs = []
        this.$nextTick(()=>{
        scope.row.img.forEach(el=>{
          this.imgs.push(el.path)  
        })
                console.log(this.imgs);
        })
      },
      getshops() {
        this.loading = true
        const qdata = {
          shopName: this.form.shopName,
          brandid: this.form.brandid,
          sortid: this.form.sortid,
          isold: this.form.isold,
          pageSize: this.pageSize,
          page: this.currentPage
        }
        getshop(qdata)
          .then(data => {
            if (data.code == 200) {
              this.tableData = data.info
              this.count = data.count
              data.info.length>0&&data.info[0].img.forEach(el=>{
                this.imgs.push(el.path)
              })
              this.pageCount = Math.floor((parseInt(this.count) + parseInt(this.pageSize)-1) / parseInt(this.pageSize));
              setTimeout(() => {
                this.loading = false
              }, 500);
            } else
              this.$message({
                message: data.message,
                type: 'error'
              })
          })
      },
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
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      handleCurrentChange(el) {
        this.currentPage = el
        this.getshops()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getshops()
      }
    },
    created() {
      
    }
  }

</script>

<style lang="scss" scoped>
  .toolkits {
    background: white;
    width: calc(100% - 40px);
    min-height: 120px;
    padding: 0 20px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
  .news{
    position: relative;
    //right: 15px;
    margin-bottom: 15px;
  }
  .el-form-item{
    margin-bottom:0;
    margin-top: 12px;
  }
  .shopinfo{
    font-size: 1.1em;
    font-family: "等线";
    display: block;
    margin-top: 5px;
  }
</style>
