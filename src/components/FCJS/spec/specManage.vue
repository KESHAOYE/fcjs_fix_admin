<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
    <!-- 查询工具 -->
    <div class="toolkits">
      <el-form :inline="true">
        <el-form-item label="规格名称">
          <el-input placeholder="请输入规格名称(提供中英文模糊搜索)" v-model="specName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getspecs">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="refresh" @click="getspecs">刷新</el-button>
      <el-button type="primary" class="news" @click="toEditor('NEW')">添加新规格</el-button>
    </div>
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-table-column>
      <el-table-column label="规格名" align='center'>
        <template slot-scope="scope">
          {{scope.row.spec_name}}
        </template>
      </el-table-column>
      <el-table-column label="规格说明" align='center'>
        <template slot-scope="scope">
          {{scope.row.spec_des}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditor('CHANGE',scope.row.spec_id)">编辑</el-button>
          <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deletespecs(scope.row.spec_id)'>
            <el-button type="danger" plain slot="reference" style="margin-left:20px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </ftable>
    <specEditor :type="type" :specId="specId" ref="editor" @ok='getspecs()'/>
  </div>
</template>

<script>
  import ftable from '../util/table'
  import specEditor from './specDialog'
  import {
    getspec,
    deletespec
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        specName: '',
        specId: '',
        type: '',
        tableData: [],
        pageSize: 5,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true
      }
    },
    components: {
      ftable,
      specEditor
    },
    computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
    methods: {
      getspecs() {
        this.loading = true
        const qdata = {
          specName: this.specName,
          pageSize: this.pageSize,
          page: this.currentPage
        }
        getspec(qdata)
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
        this.specId = id
        this.type = type
        this.$refs.editor.open()
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      deletespecs(id) {
        this.loading = true
        const qdata = {
          specId: id,
        }
        deletespec(qdata)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: data.message,
                type: 'success'
              })
              this.getspecs()
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
        this.getspecs()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getspecs()
      }
    },
    created() {
      this.getspecs()
    }
  }

</script>

<style lang="scss" scoped>
  .toolkits {
    background: white;
    width: calc(100% - 40px);
    height: 70px;
    padding: 0 20px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    position: relative;
  }
  .news{
    position: absolute;
    right: 15px;
    margin-bottom: 15px;
  }
  .refresh{
    position: absolute;
    right: 150px;
    margin-bottom: 15px;
  }
  .el-form-item{
    margin-bottom:0
  }
</style>
