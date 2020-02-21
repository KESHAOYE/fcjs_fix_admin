<template>
  <div>
    <el-dialog title="发货信息" :visible="dialogFormVisible" :before-close="close" width=950px>
      <span class="tips">请按照下列商品列表配货</span>
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
              <div class="shop_choose">
                <span class="specs">{{item.sku|sku}}</span>
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
      <span class="tips">请按照下列信息发货</span>
      <div v-if="addressinfo != '{}'">
        <div>地址:{{addressinfo.area|address}}{{addressinfo.address}}</div>
        <div>收货人:{{addressinfo.name}}</div>
        <div>电话号码:{{addressinfo.phone}}</div>
      </div>
      <div class="sure">
        <el-button type='primary' plain @click='sends'>确认发货并提醒用户</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getundeliver,
    getorderdetail,
    getordershop,
    send
  } from '@/api/api'
  export default {
    name: 'deliverDialog',
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    filters:{
      sku(val){
        val = val.replace(/"/g, '').replace(/{/g, '').replace(/}/g, '')
        return val
      },
      address(val){
        val = JSON.parse(val)
        let str = ''
        for (let i in val) {
            if (val[i] != null) {
                str += val[i].value
            }
        }
        return str
      }
    },
    data() {
      return {
        shopList: [],
        addressinfo: {},
        dialogFormVisible: false
      }
    },
    created() {
        this.getdeliver()
    },
    methods: {
      open() {
        this.dialogFormVisible = true
        setTimeout(()=>{
          this.getdeliver()
        },0)
      },
      getdeliver() {
        this.loading = true
        getordershop({orderid: this.id})
          .then(data => {
            if (data.code == 200) {
              this.shopList = data.info
            } else
              this.$message({
                message: data.message,
                type: 'error'
              })
          })
        getorderdetail({order_id: this.id})
          .then(data => {
            let {area,address,name,phone} = data.info.baseinfo[0]
            this.addressinfo = {area: area,address: address,name:name,phone:phone}
          })
      },
      sends(){
        send({orderid: this.id,phone: this.addressinfo.phone})
        .then(data=>{
          if(data.code == 200){
            this.$message({
              message: '发货成功',
              type: 'success'
            })
            this.$emit('success')
            this.close()
          }else{
            this.$message({
              message: '发货失败',
              type: 'error'
            })
          }
        })
      },
      close() {
        this.dialogFormVisible = false
      }
    }
  }

</script>

<style lang="scss" scoped>
  .tips {
    font-weight: bolder;
    font-size: 1.2em;
    display: block;
    margin-bottom: 10px;
  }
  .sure{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: 100%;
  }
  .shoplist {
    width: 100%;
    min-height: 250px;
    background: white;
    margin-top: 20px;
    padding: 15px 0;

    .title {
      width: 95%;
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
            flex-flow: row wrap;
            font-size: 0.8em;
            margin-left: 30px;
            justify-content: space-between;

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
