<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
      <el-button type="primary" class="news" @click="toEditor('NEW')">添加新维修机型</el-button>
    <!-- 查询工具 -->
    <div class="toolkits">
      <el-form :inline="true">
        <el-form-item label="维修机型名称">
          <el-input placeholder="请输入维修机型(支持模糊查询)" v-model="form.model_name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getfixmodels()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
       <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag v-for="(el,index) in scope.row.info" :key="index">所属分类:{{el.sort_name}}&nbsp; 项目名称:{{el.item_name}}&nbsp; 价格:{{el.price}}</el-tag><br/>
          </template>
      </el-table-column>
      <el-table-column label='机型图片(点击查看大图)' align='center'>
        <template slot-scope="scope">
          <el-image :src='scope.row.model_img' alt="" style="width: 80px; height: 80px;"
            :preview-src-list='scope.row.model_img|model_img'/>
        </template>
      </el-table-column>
      <el-table-column label="机型名称" align='center'>
        <template slot-scope="scope">
          {{scope.row.model_name}}
        </template>
      </el-table-column>
      <el-table-column label="商品品牌" align='center'>
        <template slot-scope="scope">
          {{scope.row.brand_name}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditor('CHANGE',scope.row.model_id)">编辑</el-button>
          <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deletefixmodels(scope.row.model_id)'>
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
    getfixmodel,
    deletefixmodel
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        form:{
          model_name: ''
        },
        tableData: [],
        pageSize: 5,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true,
        brandList:[],
        sortList:[],
        imgs:[]
      }
    },
    filters:{
        model_img(val){
            return [val]
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
      getfixmodels() {
        this.loading = true
        const qdata = {
          model_name: this.form.model_name,
          page: this.currentPage,
          pageSize:this.pageSize
        }
        getfixmodel(qdata)
          .then(data => {
            if (data.code == 200) {
              this.count = data.count
              this.tableData = data.info
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
            ...mapActions('d2admin/page', [
		  'close',
		]),
        toEditor(type,id){
        this.$router.push({name:'fixModelEditor',query:{id,id,type:type}})
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      deletefixmodels(id) {
        this.loading = true
        const qdata = {
          model_id: id,
        }
        deletefixmodel(qdata)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: data.message,
                type: 'success'
              })
              this.getfixmodels()
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
        this.getfixmodels()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getfixmodels()
      }
    },
    created() {
      this.getfixmodels()
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
  .el-tag{
    display: block;
    margin-top: 5px;
  }
</style>
