<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
    <!-- 查询工具 -->
    <div class="toolkits">
      <el-form :inline="true">
        <el-form-item label="优惠券类型">
          <el-select v-model="coupon_sort">
            <el-option label="全部" value='all'>全部</el-option>
              <el-option label="全平台无门槛" value='0'>全平台</el-option>
              <el-option label="仅限某商品" value=1></el-option>
              <el-option label="仅限某分类" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getcoupons">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="news" @click="toEditor('NEW')">添加新优惠券</el-button>
    </div>
    <!-- 数据展示 -->
    <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-table-column>
      <el-table-column label="名称" align='center'>
        <template slot-scope="scope">
          {{scope.row.note}}
        </template>
      </el-table-column>
      <el-table-column label="金额" align='center'>
        <template slot-scope="scope">
          {{scope.row.amount}}
        </template>
      </el-table-column>
      <el-table-column  label='使用门槛' align='center'>
        <template slot-scope="scope">
          {{scope.row.min_price}}
        </template>
      </el-table-column>
      <el-table-column  label='开始使用时间' align='center'>
        <template slot-scope="scope">
          {{scope.row.start_time|date}}
        </template>
      </el-table-column>
      <el-table-column  label='结束使用时间' align='center'>
        <template slot-scope="scope">
          {{scope.row.over_time|date}}
        </template>
      </el-table-column>
      <el-table-column  label='截止领取时间' align='center'>
        <template slot-scope="scope">
          {{scope.row.get_date|date}}
        </template>
      </el-table-column>
      <el-table-column  label='发行数量' align='center'>
        <template slot-scope="scope">
          {{scope.row.public_count}}
        </template>
      </el-table-column>
      <el-table-column  label='已领取数量' align='center'>
        <template slot-scope="scope">
          {{scope.row.receive_count}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align='center' fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditor('CHANGE',scope.row.coupon_id,scope.row.use_type)">编辑</el-button>
          <el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
            title="确定删除吗(不显示)？" @onConfirm='deletecoupons(scope.row.coupon_id)'>
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
    getcoupon,
    deletecoupon
  } from '@/api/api'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        coupon_sort: 'all',
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
      getcoupons() {
        this.loading = true
        const qdata = {
          sort: this.coupon_sort,
          pageSize: this.pageSize,
          page: this.currentPage
        }
        getcoupon(qdata)
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
      toEditor(type,id,use_type){
        this.$router.push({name:'couponEditor',query:{id,id,type:type,use_type:use_type}})
      },
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      deletecoupons(id) {
        this.loading = true
        const qdata = {
          coupon_id: id,
        }
        deletecoupon(qdata)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: data.message,
                type: 'success'
              })
              this.getcoupons()
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
        this.getcoupons()
      },
      handleSizeChange(el) {
        this.pageSize = el;
        this.getcoupons()
      }
    },
    created() {
      this.getcoupons()
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
