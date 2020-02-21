<template>
  <div class="myorder">
    <div class="person_head">
      <span>订单列表</span>
    </div>
    <div class="order_detail">
      <div class="order_tool">
        <div class="order_search">
          <el-input size="small" placeholder="订单编号" v-model="ordersearch"></el-input>
          <span class="search el-icon-search"></span>
        </div>
      </div>
      <div class="order_screen">
        <span class="order_detail_title">订单详情</span>
        <span class="order_man_title">收货人</span>
        <span class="order_price_title">金额</span>
        <span class="order_state_title">订单状态</span>
        <span class="order_control_title">操作</span>
      </div>
      <div class="order_detail_items">
        <div class="null" v-if='orderInfo.length <= 0'>暂无订单</div>
        <div class="order_detail_item" v-for='(item,index) in orderInfo' :key="index">
          <div class="order_detail_head">
            <span class="order_time">
              {{item.order_date|datewithtime}}
            </span>
            <span class="order_id">
              订单号:{{item.order_id}}
            </span>
          </div>
          <div class="order_detail_body">
            <div class="order_detail_info">
              <img :src="item.shopimg" alt="" srcset="">
              <span>{{item.shopname}}</span>
              <div class="shop_count">{{item.itemcount}}</div>
            </div>
            <div class="order_detail_man">
              <span class="order_name">
                <i class="el-icon-user"></i>
                {{item.name}}
              </span>
            </div>
            <div class="order_detail_price">
              <span class="order_price">
                <i class="el-icon-trophy"></i>
                {{item.order_money}}
              </span>
            </div>
            <div class="order_detail_state">
              {{item.order_state|state}}
            </div>
            <div class="order_detail_control">
              <span @click="todetail(item)">订单详情</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="警告" :visible.sync="dialogVisible" width="30%">
      <span>是否要删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认删除</el-button>
      </span>
    </el-dialog>
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :pageCount='pageCount'
      v-if='orderInfo.length > 0'>
    </el-pagination>
  </div>
</template>

<script>
  import {
    getcenterorderinfo
  } from '@/api/api'
  export default {
    name: "myorder",
    data() {
      return {
        activeType: "all",
        ordersearch: "",
        dialogVisible: false,
        orderInfo: [],
        pageSize: 5,
        currentPage: 1,
        pageCount: 1,
        load: ''
      }
    },
    filters: {
      datewithtime(val) {
        let reg = new RegExp(/^\d+-\d+-\d+[T]\d+:\d+/)
        return reg.exec(val)[0].replace('T', ' ')
      },

      state(val) {
        return {
          1: '待付款',
          2: '待维修',
          3: '维修中',
          41: '待商家发货',
          42: '待用户发货(维修)',
          5: '待收货',
          6: '待评价',
          7: '已完成',
          8: '售后退货中',
          9: '售后换货中',
          10: '售后维修中',
          11: '售后完成',
        } [val]
      }
    },
    methods: {
      todetail(item) {
        this.$router.push({
          name: "orderdetails",
          query: {
            orderid: item.order_id
          }
        })
      },
      handleCurrentChange() {
        this.getorder()
      },
      getorder() {
        getcenterorderinfo({
            userid: 'all',
            page: this.currentPage,
            pageSize: 3,
            type: '>0'
          })
          .then(data => {
            this.orderInfo = data.info
            this.pageCount = Math.ceil(data.count / this.pageSize)
            this.load.close()
          })
      },
      handleCurrentChange(el) {
        this.currentPage = el
        this.getorder()
      },
    },
    mounted() {
      this.load = this.$loading({
        lock: true,
        text: '获取订单中..',
      });
      setTimeout(() => {
        this.getorder()
      }, 1000)
      this.activeType = this.$route.query.activetype ? this.$route.query.activetype : "all";
    }
  }

</script>

<style lang="scss">
  .person_head {
    width: 100%;
    height: 50px;
    background: white;
    text-align: left;
    line-height: 50px;
    margin-top: 20px;
    border-radius: 5px;
    font-size: 1.3em;
    font-family: "等线";
    font-weight: bolder;

    span {
      margin-left: 25px;
    }
  }

  .myorder {
    width: 100%;
    min-height: 50px;

    .order_detail {
      width: 100%;
      min-height: 200px;
      background: white;
      margin-top: 30px;
      border-radius: 5px;

      .order_tool {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 50px;

        .screen {
          width: 95%;
          height: 50px;
          line-height: 50px;
          font-size: 0.9em;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          margin: auto;
          margin-left: 30px;

          .screen_item {
            cursor: pointer;
            font-family: "等线";
            font-weight: bold;
          }

          .screen_item:hover {
            color: red;
            transition: .1s;
          }

          .active {
            color: red;
          }
        }
      }

      .order_search {
        width: 200px;
        height: 50px;
        margin-right: 80px;
        line-height: 50px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;

        .search {
          width: 40px;
          min-height: 30px;
          height: 30px;
          margin-left: 0;
          line-height: 30px;
          position: relative;
          left: -1px;
          top: 50%;
          margin-top: -16.5px;
          border: 1px solid #d2d2d2;
          cursor: pointer;
          background: #d2d2d2;
          text-align: center;
        }
      }
    }

    .order_screen {
      width: 95%;
      height: 40px;
      background: #f2f2f2;
      margin: 15px 25px;
      line-height: 40px;
      display: flex;

      span {
        font-size: 0.8em;
        flex: 1;
        text-align: center;
      }

      .order_detail_title {
        width: 580px;
        text-align: center;
        flex: none;
      }
    }

    .order_detail_items {
      width: 95%;
      /* min-height: 155px; */
      margin-left: 25px;
      margin-top: 20px;

      .order_detail_item {
        margin-top: 25px;
        border: 1px solid #d9d9d9;
      }

      .order_detail_head {
        width: 100%;
        height: 30px;
        background: #f9f9f9;
        line-height: 30px;
        text-align: left;

        .order_time {
          font-size: 0.9em;
          margin-left: 20px;
          color: #a5a5a5;
        }

        .order_id {
          font-size: 0.9em;
          margin-left: 30px;
          color: #b2b2b2;
        }
      }

      .order_detail_body {
        width: 100%;
        min-height: 125px;
        display: flex;
        flex-flow: row nowrap;

        .order_detail_info {
          width: 580px;
          min-height: 125px;
          border-right: 1px solid #d9d9d9;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;

          img {
            width: 80px;
            height: 80px;
            margin-left: 30px;
            border: 1px solid #d2d2d2;
          }

          span {
            width: 250px;
            display: -webkit-box;
            font-size: 0.8em;
            text-align: left;
            margin-left: 10px;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .shop_count {
            margin-left: 30px;
            font-size: 0.8em;
            color: #c2c2c2;
          }

          .shop_count::before {
            content: "x"
          }
        }

        .order_detail_man,
        .order_detail_price,
        .order_detail_state,
        .order_detail_control {
          flex: 1;
          min-height: 125px;
          border-right: 1px solid #d9d9d9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9em;
          text-align: center;
        }

        .order_detail_control {
          border: 0;
          display: flex;
          flex-flow: column nowrap;
          align-items: center;

          span {
            cursor: pointer;
            color: #0084ff;
          }
        }
      }
    }
  }

  .el-pagination {
    padding: 20px 0;
    background: white;
  }

</style>
