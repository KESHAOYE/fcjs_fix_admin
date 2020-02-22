<template>
    <!-- 首页广告管理 -->
    <div class="indexAdManage">
      <!-- 数据展示 -->
      <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
        <el-table-column label="订单号" align='center'>
          <template slot-scope="scope">
            {{scope.row.order_id}}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align='center'>
          <template slot-scope="scope">
            {{scope.row.order_date|date}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align='center'>
          <template slot-scope="scope">
            <el-button type="primary" plain slot="reference" @click='toEditor(scope.row)'>完成维修</el-button>
          </template>
        </el-table-column>
      </ftable>
    </div>
  </template>
  
  <script>
    import ftable from '../util/table'
    import {
      getwaitfix,
      send
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
          id:''
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
    filters:{
        date(val){
            let d = new Date(val)
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();  
        }
    },
      methods: {
        getfixitems() {
          this.loading = true
          getwaitfix({page: this.currentPage ,pageSize: this.pageSize})
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
        toEditor(id){
           send({orderid: id.order_id})
        .then(data=>{
          if(data.code == 200){
            this.$message({
              message: '发货成功',
              type: 'success'
            })
            this.getfixitems()
          }else{
            this.$message({
              message: '发货失败',
              type: 'error'
            })
          }
        })
        },
        ...mapActions('d2admin/account', [
          'logout'
        ]),
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
  