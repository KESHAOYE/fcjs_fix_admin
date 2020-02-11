<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
    <!-- 查询工具 -->
    <div class="toolkits">
      <el-form :inline="true">
        <el-form-item label="是否过期">
          <el-select placeholder="" v-model="isover" size='small'>
            <el-option label="全部" value="0"></el-option>
            <el-option label="未过期" value="1"></el-option>
            <el-option label="已过期" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getads">查询</el-button>
        </el-form-item>
      </el-form>
     <el-button type="primary" class="news" @click="toEditor('NEW')">添加新推荐</el-button>
    </div>
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <el-table-column label="广告位" align='center'>
        <template slot-scope="scope">
          {{scope.row.adid|adid}}
        </template>
      </el-table-column>
      <el-table-column label='广告图片' align='center'>
        <template slot-scope="scope">
          <el-image :src='scope.row.adimg|adimg' alt="" style="width: 125px; height: 110px;"
            :preview-src-list='scope.row.adimg|adimgs' />
        </template>
      </el-table-column>
      <el-table-column prop="shopname" label='商品名称' align='center'>
      </el-table-column>
      <el-table-column prop="res" label='商品描述' align='center'>
      </el-table-column>
      <el-table-column prop="startdue" label='开始时间' align='center'>
        <template slot-scope="scope">
          {{scope.row.startdue|date}}
        </template>
      </el-table-column>
      <el-table-column prop="overdue" label='过期时间' align='center'>
        <template slot-scope="scope">
          {{scope.row.overdue|date}}
        </template>
      </el-table-column>
      <el-table-column prop="overdue" label='是否显示' align='center'>
        <template slot-scope="scope">
          {{scope.row.isshow|isshow}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditor('CHANGE',scope.row.id)">编辑</el-button>
          <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deleteads(scope.row.id)'>
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
    getad,
    deletead
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        adid: '2',
        isover: '0',
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
      isshow(val) {
        return {
          1: '是',
          0: '否'
        } [val]
      },
      date(val) {
        let reg = new RegExp(/^\d+-\d+-\d+/)
        return reg.exec(val)[0]
      }
    },
    computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
    methods: {
            ...mapActions('d2admin/page', [
		  'close',
		]),
      getads() {
        this.loading = true
        const qdata = {
          adid: this.adid,
          isover: this.isover,
          pageSize: this.pageSize,
          page: this.currentPage
        }
        getad(qdata)
          .then(data => {
            if (data.code == 200) {
              this.tableData = data.info
              this.count = data.count
              this.pageCount = Math.floor(this.count / this.pageSize) + 1
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
        this.$router.push({name:'adEditor',query:{id,id,type:type}})
        let tagName = this.current
    this.close({tagName});
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      deleteads(id) {
        this.loading = true
        const qdata = {
          id: id,
          phone:this.info.phone
        }
        deletead(qdata)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: data.message,
                type: 'success'
              })
              this.getads()
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
        this.getads()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getads()
      }
    },
    created() {
      this.getads()
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
