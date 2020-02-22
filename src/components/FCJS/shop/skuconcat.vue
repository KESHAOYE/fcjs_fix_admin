<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
    <span class="title">商品信息</span> 
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' :showpage='false' center style="margin-top:20px;">
       <el-table-column type="expand">
          <template slot-scope="scope">
             <span class="shopinfo">商品id ：{{scope.row.shop_id}}</span>
             <span class="shopinfo">商品名称 ：{{scope.row.shopName}}</span>
             <span class="shopinfo">商品品牌 ：{{scope.row.brandname}}</span>
             <span class="shopinfo">商品分类 ：{{scope.row.sortname}}</span>
             <span class="shopinfo" v-for="(el,index) in scope.row.spu" :key="'spu'+index">{{el.spec_name}} ：{{el.spec_value}}</span>
          </template>
      </el-table-column>
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
      <el-table-column label="商品介绍" align='center'>
        <template slot-scope="scope">
          {{scope.row.shopdes}}
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
    </ftable>
    <span class="title">属性组合及库存</span>
    <el-button type="primary" style="margin-top:20px;" @click="open('NEW')">添加组合</el-button> 
    <ftable v-loading='loading' :data='tableDatas' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange" style="margin-top:20px;">
      <el-table-column label="属性值" align='center'>
        <template slot-scope="scope">
          {{scope.row.sku_concat}}
        </template>
      </el-table-column>
      <el-table-column label="价格" align='center'>
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column label="库存" align='center'>
        <template slot-scope="scope">
          {{scope.row.stock}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
        <el-button @click="open('ADD',scope.row.id)">修改库存</el-button>
        <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deletes(scope.row.id)'>
            <el-button type="danger" plain slot="reference" style="margin-left:20px">删除</el-button>
          </el-popconfirm>
          </template>
      </el-table-column>
    </ftable>
    <skuDialog ref="skuDialog" :value='sku' :id="id" :type='type' :ids='ids' @ok='getsku()'/>
  </div>
</template>

<script>
  import ftable from '../util/table'
  import skuDialog from './concate'
  import {
    getshopbyid,
    getskubyid,
    deletesku
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        tableData: [],
        tableDatas: [],
        pageSize: 5,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true,
        brandList:[],
        sortList:[],
        imgs:[],
        sku: [],
        type: 'NEW',
        id:'',
        ids:0
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
      ftable,
      skuDialog
    },
    computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
    methods: {
      changeimg(scope){
        this.imgs = []
        this.$nextTick(()=>{
        scope.row.img.forEach(el=>{
          this.imgs.push(el.path)  
        })
        })
      },
      getsku(){
        let data= {
            shopid: this.$route.query.id
        }
        getskubyid(data)
        .then(data=>{
          this.tableDatas = data.info
          this.count = data.count
          this.pageCount = Math.floor((parseInt(this.count) + parseInt(this.pageSize)-1) / parseInt(this.pageSize));
              setTimeout(() => {
                this.loading = false
              }, 500);
        })
        .catch(err => {
            this.$message({
              message: `获取失败${err}`,
              type: 'error'
            })
          })
      },
      getshop(res) {
        getshopbyid(res)
          .then(b => {         
            this.tableData=b.info
            this.loading = false
          })
          .catch(err => {
            this.$message({
              message: `获取失败${err}`,
              type: 'error'
            })
          })
      },
      open(type,id){
         this.type = type
         this.sku = this.tableData[0].sku
         this.id = this.tableData[0].shop_id
         this.ids = id
         this.$refs.skuDialog.open()
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      handleCurrentChange(el) {
        this.currentPage = el
        this.getsku()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getsku()
      },
      deletes(id){
          deletesku({id:id})
          .then(data=>{
            this.$message({
                message: '删除成功',
                type: 'success'
            })
            this.getsku()
        })
        .catch(err=>{
            this.$message({
                message: '删除失败',
                type: 'error'
            })
        })
      }
    },
    created() {
      this.getshop({
          shopid: this.$route.query.id
        })
       this.getsku()
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
  .title{
    font-size: 1.2em;
    font-weight: bolder;
    margin-top: 30px;
    display: block;
  }
</style>
