<template>
  <!-- 品牌管理 -->
  <div class="indexAdManage">
    <!-- 查询工具 -->
    <div class="toolkits">
      <el-form :inline="true">
        <el-form-item label="品牌名称">
          <el-input placeholder="请输入品牌名称(提供中英文模糊搜索)" v-model="brandname" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否提供维修">
          <el-select placeholder="" v-model="isfix" size='small'>
            <el-option label="全部" value="0"></el-option>
            <el-option label="提供维修" value="1"></el-option>
            <el-option label="不提供维修" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getbrands">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="news" @click="toEditor('NEW')">添加新分类</el-button>
    </div>
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <el-table-column label='品牌LOGO' align='center'>
        <template slot-scope="scope">
          <el-image :src='scope.row.brandimg|adimg' alt="" style="width: 80px; height: 80px;"
            :preview-src-list='scope.row.brandimg|adimgs' />
        </template>
      </el-table-column>
      <el-table-column label="品牌名" align='center'>
        <template slot-scope="scope">
          {{scope.row.brandname}}
        </template>
      </el-table-column>
      <el-table-column label="品牌英文名" align='center'>
        <template slot-scope="scope">
          {{scope.row.brandename}}
        </template>
      </el-table-column>
      <el-table-column prop="overdue" label='是否提供维修' align='center'>
        <template slot-scope="scope">
          {{scope.row.isfix|isfix}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditor('CHANGE',scope.row.brandid)">编辑</el-button>
          <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deleteads(scope.row.brandid)'>
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
    getbrand,
    deletebrand
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        brandname: '',
        isfix: '0',
        tableData: [],
        pageSize: 5,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true
      }
    },
    components: {
      ftable
    },
    filters: {
      adid(val) {
        return {
          1: '首页轮播图',
          2: '商品推荐'
        } [val]
      },
      adimg(val) {
        return `http://localhost:3000${val}`
      },
      adimgs(val) {
        return [`http://localhost:3000${val}`]
      },
      isfix(val) {
        return {
          1: '是',
          0: '否'
        } [val]
      },
    },
    computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
    methods: {
      getbrands() {
        this.loading = true
        const qdata = {
          brandname: this.brandname,
          isfix: this.isfix,
          pageSize: this.pageSize,
          page: this.currentPage
        }
        getbrand(qdata)
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
        this.$router.push({name:'brandEditor',query:{id,id,type:type}})
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      deleteads(id) {
        this.loading = true
        const qdata = {
          brandid: id,
        }
        deletebrand(qdata)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: data.message,
                type: 'success'
              })
              this.getbrands()
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
              if (data.code == 601) {
                this.logout({
                  confirm: false
                })
                this.loading = false
              }
              this.loading = false
            }
          })
      },
      handleCurrentChange(el) {
        this.currentPage = el
        this.getbrands()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getbrands()
      }
    },
    created() {
      this.getbrands()
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
  .el-form-item{
    margin-bottom:0
  }
</style>
