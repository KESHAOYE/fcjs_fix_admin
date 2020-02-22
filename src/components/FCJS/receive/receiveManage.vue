<template>
    <!-- 首页广告管理 -->
    <div class="indexAdManage">
      <!-- 查询工具 -->
      <div class="toolkits">
        <el-button type="primary" class="news" @click="toEditor('NEW')">添加收款账号</el-button>
      </div>
      <!-- 数据展示 -->
      <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-table-column>
        <el-table-column label="银行名" align='center'>
          <template slot-scope="scope">
            {{scope.row.receive_name}}
          </template>
        </el-table-column>
        <el-table-column label="银行英文名" align='center'>
          <template slot-scope="scope">
            {{scope.row.receive_ename}}
          </template>
        </el-table-column>
        <el-table-column prop="overdue" label='收款账号' align='center'>
          <template slot-scope="scope">
            {{scope.row.receive_account}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align='center'>
          <template slot-scope="scope">
            <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
              title="确定删除吗(不显示)？" @onConfirm='deletereceives(scope.row.receive_id)'>
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
      getreceive,
      deletereceive
    } from '@/api/api'
    import { mapState, mapActions } from 'vuex'
    export default {
      data() {
        return {
          sortname: '',
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
        isshow(val) {
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
        getsorts() {
          this.loading = true
          const qdata = {
            pageSize: this.pageSize,
            page: this.currentPage
          }
          getreceive(qdata)
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
              ...mapActions('d2admin/page', [
            'close',
          ]),
        toEditor(type){
          this.$router.push({name:'receiveEditor',query:{type:type}})
        },
        
        deletereceives(id) {
          this.loading = true
          const qdata = {
            receive_id: id,
          }
          deletereceive(qdata)
            .then(data => {
              if (data.code == 200) {
                this.$message({
                  message: data.message,
                  type: 'success'
                })
                this.getsorts()
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
          this.getsorts()
        },
        handleSizeChange(el) {
          this.pageSize = el;
          this.getsorts()
        }
      },
      created() {
        this.getsorts()
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
  