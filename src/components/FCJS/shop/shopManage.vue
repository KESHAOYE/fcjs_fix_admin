<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
      <el-button type="primary" class="news" @click="toEditor('NEW')">添加新商品</el-button>
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
       <el-table-column type="expand">
          <template slot-scope="props">
              
          </template>
      </el-table-column>
      <el-table-column label='商品图片(点击查看所有图片)' align='center'>
        <template slot-scope="scope">
          <el-image :src='scope.row.img[0]' alt="" style="width: 80px; height: 80px;"
            :preview-src-list='scope.row.img' />
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
          {{scope.row.isold}}
        </template>
      </el-table-column>
      <el-table-column label="二手定义" align='center'>
        <template slot-scope="scope">
          {{scope.row.oldtype}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditor('CHANGE',scope.row.shop_id)">编辑</el-button>
          <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deleteshops(scope.row.shop_id)'>
            <el-button type="danger" plain slot="reference" style="margin-left:20px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </ftable>
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
        pageSize: 5,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true,
        brandList:[],
        sortList:[]
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
        toEditor(type,id){
        this.$router.push({name:'shopEditor',query:{id,id,type:type}})
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      deleteshops(id) {
        this.loading = true
        const qdata = {
          shopId: id,
        }
        deleteshop(qdata)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: data.message,
                type: 'success'
              })
              this.getshops()
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              })
              if (data.code == 601) {
                this.logout({
                  confirm: false
                })
              }
              this.loading = false
            }
          })
      },
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
      this.getsorts();
      this.getbrands();
      this.getshops()
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
</style>
