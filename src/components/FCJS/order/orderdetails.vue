<template>
  <div class="orderdetail">
    <div class="order_type">
      <div class="now_type">
        <span class="order_id" v-if='baseinfo[0]'>{{baseinfo[0].order_id}}</span>
        <span class="status">
          <i v-if='nowstate.now_state == 7' class="el-icon-check"></i>
          <i v-if='nowstate.now_state != 7' class="el-icon-loading"></i>
          {{nowstate.now_state|state}}
        </span>
        <span class="order_time">{{nowstate.createTime|datewithtime}}</span>
      </div>
      <div class="type_detail">
        <el-steps :active="state.length-1" align-center finish-status="success" process-status='wait'>
          <el-step v-for='(item,index) in state' :title="item.now_state|state" :key="index">
            <i slot="icon" class="el-icon-loading"></i>
            <span slot="description">{{item.createTime|datewithtime}}</span>
          </el-step>
        </el-steps>
      </div>
    </div>
    <div class="express_detail" v-if='nowstate.now_state >= 5 && nowstate.now_state!=41 && nowstate.now_state!=42'>
      <div class="shop_express">
        <div class="shop_express_info">
          <div class="express_row">
            <span class="express_title">送货方式</span>
            <span class="express_content">商家发货</span>
          </div>
          <div class="express_row">
            <span class="express_title">承运快递</span>
            <span class="express_content">京东快递</span>
          </div>
          <div class="express_row">
            <span class="express_title">快递单号</span>
            <span class="express_content">TEST00000001</span>
          </div>
        </div>
      </div>
      <div class="express">
        <el-timeline>
          <el-timeline-item timestamp="2019/4/2" placement="top" type="success">
            <span class="express_info_detail">已发货</span>
          </el-timeline-item>
          <el-timeline-item timestamp="2019/4/3" placement="top">
            <span class="express_info_detail">您的订单在京东【福州分拨中心】分拣完成</span>
          </el-timeline-item>
          <el-timeline-item timestamp="2019/4/4" placement="top">
            <span class="express_info_detail">订单已收货</span>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div class="shoplist">
      <div class="title">
        <span>订单清单</span>
        <hr>
      </div>
      <div class="shoplist_content">
        <div class="shoplist_items" v-for='(item,index) in shopList' :key="index">
          <el-image style="width:90px;height:90px;" :src='item.path'></el-image>
          <div class="shop_info">
            <span class="shop_name">{{item.shopname}}</span>
            <div class="shop_choose" v-if="type == 0">
              <span class="specs">{{item.sku|sku}}</span>
            </div>
            <div class="shop_choose" v-if="type == 1">
              <div class="specs" v-for="(items,index) in item.sku" :key="index">项目：{{items.item_name}}</div>
            </div>
          </div>
          <div class="shop_price">
            <span class="price">{{item.price}}</span>
          </div>
          <div class="shop_count">
            <span class="scount">{{item.count}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order_info" v-if='baseinfo[0]'>
      <div class="man_info">
        <span class="info_title">收货人信息</span>
        <div class="detail_info">
          <div class="detail_info_row">
            <span class="detail_title">收货人:</span>
            <span class="detail_content">{{baseinfo[0].name}}</span>
          </div>
          <div class="detail_info_row">
            <span class="detail_title">收货电话:</span>
            <span class="detail_content">{{baseinfo[0].phone}}</span>
          </div>
          <div class="detail_info_row">
            <span class="detail_title">收货地址:</span>
            <span class="detail_content">{{baseinfo[0].area|area}}{{baseinfo[0].address}}</span>
          </div>
        </div>
      </div>
      <div class="pay_info">
        <span class="info_title">支付信息</span>
        <div class="detail_info">
          <div class="detail_info">
            <div class="detail_info_row">
              <span class="detail_title">付款方式:</span>
              <span class="detail_content">在线支付-{{payinfo[0].receive_name}}</span>
            </div>
            <div class="detail_info_row">
              <span class="detail_title">付款时间:</span>
              <span class="detail_content">{{payinfo[0].pay_bdate|datewithtime}}</span>
            </div>
            <div class="detail_info_row">
              <span class="detail_title">商品金额:</span>
              <span class="detail_content price">{{baseinfo[0].order_money}}</span>
            </div>
            <div class="detail_info_row">
              <span class="detail_title">优惠金额:</span>
              <span class="detail_content price">-{{baseinfo[0].order_money-payinfo[0].count}}</span>
            </div>
            <div class="detail_info_row">
              <span class="detail_title">实付金额:</span>
              <span class="detail_content price">{{payinfo[0].count}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getorderdetail,
    getordershop,
    getfixorderitem
  } from '@/api/api'
  export default {
    name: "orderdetail",
    data() {
      return {
        state: [],
        baseinfo: [],
        payinfo: [],
        nowstate: [],
        shopList: [],
        type: this.$route.query.type | 0
      }
    },
    methods: {
      get() {
        if (this.type == 0) {
          getordershop({
              'orderid': this.$route.query.orderid
            })
            .then(data => {
              this.shopList = data.info
            })
        } else {
          getfixorderitem({
              'orderid': this.$route.query.orderid
            })
            .then(data => {
              this.shopList = data.info
            })
        }
        getorderdetail({
            'order_id': this.$route.query.orderid
          })
          .then(data => {
            this.state = data.info.state
            this.baseinfo = data.info.baseinfo
            this.payinfo = data.info.payinfo
            this.nowstate = this.state[this.state.length - 1]
          })
      }
    },
    filters: {
      datewithtime(val) {
        let d = new Date(val)
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d
          .getMinutes() + ':' + d.getSeconds();
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
      },
      area(val) {
        val = JSON.parse(val)
        let str = ''
        for (let i in val) {
          if (val[i] != null) {
            str += val[i].value
          }
        }
        return str
      },

      orderstate(val) {
        return {
          0: '普通商品订单',
          1: '维修订单'
        } [val]
      },
      sku(val) {
        val = val.replace(/"/g, '').replace(/{/g, '').replace(/}/g, '')
        return val
      }
    },
    watch: {
      '$route'(val) {
        this.get()
      }
    },
    mounted() {
      this.get()
    },
  }

</script>

<style lang="scss" scoped>
  .order_type {
    width: 100%;
    height: 250px;
    background: white;
    border-top: 4px solid #00303c;
    margin-top: 20px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .now_type {
      width: 30%;
      height: 200px;
      border-right: 1px solid #d2d2d2;
      display: flex;
      flex-flow: column nowrap;

      .order_id {
        color: #c2c2c2;
        font-family: "等线";
        font-size: 0.8em;
        width: 90%;
        margin: 0 auto;
        text-align: center;
      }

      .order_id::before {
        content: "订单号:";
        position: relative;
        color: #c2c2c2;
        font-family: "等线";
      }

      .status {
        font-weight: bolder;
        color: #00303c;
        font-size: 2em;
        font-family: "等线";
        margin-top: 45px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;

        i {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 2px solid #00303c;
          font-size: 0.7em;
          margin-right: 10px;
          display: block;
          line-height: 35px;
          text-align: center;
        }
      }

      .order_time {
        color: #c2c2c2;
        font-size: 0.8em;
        margin-top: 30px;
        text-align: center;
      }

      .order_time::before {
        content: "时间:";
        color: #c2c2c2;
        font-size: 0.8em;
      }
    }

    .type_detail {
      width: 60%;
      height: 200px;
      margin-left: 5%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;

      .el-steps--horizontal {
        width: 100%;
      }
    }
  }

  .express_detail {
    width: 100%;
    height: 300px;
    background: white;
    margin-top: 30px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .shop_express {
      width: 30%;
      height: 200px;
      border-right: 1px solid #d2d2d2;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-around;
      align-items: center;

      .shop_img {
        width: 90px;
        height: 90px;
        border: 1px solid #d2d2d2;

        img {
          width: 90px;
          height: 90px;
        }
      }

      .shop_express_info {
        height: 120px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;

        .express_row {
          display: flex;

          .express_title {
            font-size: 1em;
            font-family: "等线";
            color: #c2c2c2;
          }

          .express_content {
            font-size: 1em;
            font-family: "等线";
            margin-left: 8px;
            color: #3b3b3b;
            letter-spacing: 1px;
          }
        }
      }
    }

    .express {
      width: 60%;
      height: 230px;
      overflow: auto;
      padding: 0 5%;
      text-align: left;
      margin-top: 85px;
    }
  }

  .order_info {
    width: 100%;
    height: 250px;
    background: white;
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .man_info {
      min-width: 50%;
      height: 200px;
    }

    .pay_info {
      height: 200px;
      border-left: 1px solid #d2d2d2;

      .price::before {
        content: "￥";
      }
    }

    .info_title {
      font-size: 1.2em;
      color: #000;
      text-align: left;
      width: 90%;
      display: block;
      margin-left: 30px;
      font-weight: bolder;
    }

    .detail_info {
      margin-top: 10px;
      display: flex;
      flex-flow: column nowrap;
      align-items: flex-start;

      .detail_info_row {
        width: 400px;
        text-align: left;
        margin-left: 30px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: 5px;
        letter-spacing: 1px;

        .detail_content {
          margin-left: 5px;
        }
      }
    }
  }

  .el-timeline-item__wrapper {
    padding-left: 45px;
  }

  .shoplist {
    width: 100%;
    min-height: 250px;
    background: white;
    margin-top: 20px;
    padding: 15px 0;

    .title {
      width: 95%;
      height: 40px;
      margin: auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: flex-start;
      border-bottom: 1px solid #f2f2f2;
      margin-bottom: 5px;

      span {
        font-size: 1.3em;
        margin-top: 5px;
        font-family: "\7B49\7EBF";
      }
    }

    .shoplist_content {
      width: calc(100% - 80px);
      display: flex;
      flex-flow: column wrap;
      align-items: center;

      .shoplist_items {
        width: 100%;
        min-height: 150px;
        margin-left: 3%;
        border-bottom: 1px solid #f2f2f2;
        padding: 15px 0;
        background: #fcfcfc;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        .el-image {
          width: 150px !important;
          height: 150px !important;
          margin-left: 25px;
        }

        .shop_info {
          width: 500px;
          height: 150px;
          display: flex;
          flex-flow: column wrap;

          .shop_name {
            width: 430px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            word-wrap: break-word;
            word-break: break-all;
            -webkit-line-clamp: 3;
            margin-left: 30px;
            text-align: left;
            margin-top: 25px;
          }

          .shop_choose {
            margin-top: 25px;
            display: flex;
            flex-flow: column wrap;
            font-size: 0.8em;
            margin-left: 30px;
            justify-content: space-between;
            align-items: flex-start;

            .specs {
              font-weight: bolder;

              .data {
                font-weight: normal;
              }
            }
          }
        }

        .shop_price {
          width: auto;
          flex: 1;
          height: 125px;
          padding-top: 25px;
          color: rgb(255, 68, 68);
          font-size: 1.3em;
          font-weight: bolder;

          .price::before {
            content: "￥";
            position: relative;
          }
        }

        .shop_count {
          width: auto;
          flex: 1;
          height: 120px;
          font-size: 1.1em;
          padding-top: 30px;

          .scount::before {
            content: "x";
            position: relative;
          }
        }

      }

    }

  }

</style>
