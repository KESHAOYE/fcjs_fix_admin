<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
      <el-button type="primary" class="news" @click="toEditor('NEW')">添加新维修项目</el-button>
    <!-- 查询工具 -->
    <div class="toolkits">
      <el-form :inline="true">
        <el-form-item label="项目名称">
          <el-input placeholder="请输入项目名称" v-model="form.item_name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getfixitems">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <el-table-column label="项目名称" align='center'>
        <template slot-scope="scope">
          {{scope.row.item_name}}
        </template>
      </el-table-column>
      <el-table-column label="所属维修品类" align='center'>
        <template slot-scope="scope">
          {{scope.row.sort_name}}
        </template>
      </el-table-column>
      <el-table-column label="项目介绍" align='center'>
        <template slot-scope="scope">
          {{scope.row.item_des}}
        </template>
      </el-table-column>
      <el-table-column label="维修方式" align='center'>
        <template slot-scope="scope">
          {{scope.row.item_method}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditor('CHANGE',scope.row.item_id)">编辑</el-button>
          <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deletefixitems(scope.row.item_id)'>
            <el-button type="danger" plain slot="reference" style="margin-left:20px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </ftable>
    <fixitemDialog :type='type' :id="id" ref="fixitemDialog"/>
  </div>
</template>

<script>
  import ftable from '../util/table'
  import fixitemDialog from './fixitemDialog'
  import {
    getfixitem,
    deletefixitem
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        form:{
          item_name: '',
        },
        tableData: [],
        pageSize: 5,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true,
        type: 'NEW',
        id:''
      }
    },
    components: {
      ftable,
      fixitemDialog
    },
    computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
    methods: {
      getfixitems() {
        this.loading = true
        const qdata = {
          item_name: this.form.item_name,
          pageSize: this.pageSize,
          page: this.currentPage
        }
        getfixitem(qdata)
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
      toEditor(type,id){
         this.type = type
         this.id = id
         this.$refs.fixitemDialog.open()  
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      deletefixitems(id) {
        this.loading = true
        const qdata = {
          fixitemid: id,
        }
        deletefixitem(qdata)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: data.message,
                type: 'success'
              })
              this.getfixitems()
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
        this.getfixitems()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getfixitems()
      }
    },
    created() {
      this.getfixitems()
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
  .fixiteminfo{
    font-size: 1.1em;
    font-family: "等线";
    display: block;
    margin-top: 5px;
  }
</style>
