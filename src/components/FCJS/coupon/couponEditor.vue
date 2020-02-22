<template>
  <div class="adeditor">
    <el-form>
      </el-form-item>
      <el-form-item label="优惠类型" >
        <el-radio-group v-model="form.use_type" :disabled = "type == 'CHANGE'">
          <el-radio-button label='0'>全平台通用</el-radio-button>
          <el-radio-button label='1'>指定商品</el-radio-button>
          <el-radio-button label='2'>指定分类</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="指定某商品" v-if="form.use_type == 1">
        <el-input placeholder="点击选择商品" @focus="openshop" style="width:350px;" v-model="shopname" clearable :disabled = "type == 'CHANGE'"></el-input>
      </el-form-item>
      <el-form-item label="指定分类" v-if="form.use_type == 2">
        <el-select v-model="form.sortid" :disabled = "type == 'CHANGE'">
          <el-option v-for="(el,index) in sortList" :key="index" :label='el.sortname' :value="el.sortid">
            {{el.sortname}}/{{el.sortename}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额">
        <el-input placeholder="请输入优惠券金额" v-model="form.amount" style="width:350px" :disabled = "type == 'CHANGE'"></el-input>
      </el-form-item>
      <el-form-item label="门槛(触发金额)">
        <el-input placeholder="请输入优惠券触发金额" v-model="form.min_price" style="width:350px" :disabled = "type == 'CHANGE'"></el-input>
      </el-form-item>
      <el-form-item label="每人限领张数">
        <el-input placeholder="请输入每人限领优惠券张数" v-model="form.per_limit" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="总发行数">
        <el-input placeholder="请输入总发行数" v-model="form.public_count" style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="优惠券说明">
        <el-input placeholder="请输入说明" v-model="form.note" style="width:350px" :disabled = "type == 'CHANGE'"></el-input>
      </el-form-item>
      <el-form-item label="使用时间">
        <el-date-picker v-model="form.date" type="datetimerange" range-separator="至" start-placeholder="开始使用日期"
          end-placeholder="结束使用日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止领取时间">
        <el-date-picker v-model="form.get_date" type="date" placeholder="截止领取时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item align='center'>
        <el-button type="primary" size='medium' v-if="type!='NEW'" @click='change'>更改</el-button>
        <el-button type="primary" size='medium' v-if="type=='NEW'" @click="add">添加</el-button>
        <el-button type="danger">取消</el-button>
      </el-form-item>
    </el-form>
    <chooseshop ref="shopchoose" @shop='changeshop' />
  </div>
</template>

<script>
  import {
    getcouponbyid,
    updatecoupon,
    addcoupon,
    getsort
  } from '@/api/api'
  import {
    mapState,
    mapActions
  } from 'vuex'
  import chooseshop from '../shop/shopChoose'
  export default {
    data() {
      return {
        form: {
          amount: '',
          per_limit: '',
          min_price: '',
          shop_id: '',
          coupon_id: '',
          date: [],
          use_type: '',
          get_date: '',
          public_count: '',
          note: ''
        },
        shopname: '',
        sortList: [],
        type: 'NEW',
        use_type: '0'
      }
    },
    components: {
      chooseshop
    },
    created() {
      this.type = this.$route.query.type
      this.use_type = this.$route.query.use_type
      this.getsorts()
      if (this.type == 'CHANGE') {
        this.getcoupon()
      }
    },
    methods: {
      getsorts() {
        const qdata = {
          sortname: '',
          pageSize: 100000,
          page: 1
        }
        getsort(qdata)
          .then(data => {
            if (data.code == 200) {
              this.sortList = data.info
            } else
              this.$message({
                message: `分类获取失败:${data.message}`,
                type: 'error'
              })
          })
      },
      changeshop(data) {
        this.form.shopid = data.shopid
        this.shopname = data.shopname
      },
      openshop() {
        this.$refs.shopchoose.open()
      },
      getcoupon() {
        const qdata = {
          coupon_id: this.$route.query.id,
          use_type: this.$route.query.use_type
        }
        getcouponbyid(qdata)
          .then(b => {
            let data = b.info[0]
            const a = {
              amount: data.amount,
              shopid: data.shopid,
              per_limit: data.per_limit,
              min_price: data.min_price,
              coupon_id: data.coupon_id,
              note: data.note,
              date:[data.start_time,data.over_time],
              use_type: data.use_type,
              get_date: data.get_date,
              public_count: data.public_count,
              isshow: data.isshow
            }
            this.form = a
            this.shopname = data.shopname
          })
          .catch(err => {
            this.$message({
              message: `获取失败${err}`,
              type: 'error'
            })
          })
      },
      add() {
        addcoupon(this.form).
        then(data => {
          if (data.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({
              name: 'couponManage'
            })
            let tagName = this.current
            this.close({
              tagName
            });
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        })
      },
      ...mapActions('d2admin/page', [
        'close',
      ]),
      change() {
        updatecoupon(this.form).
        then(data => {
          if (data.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$router.push({
              name: 'couponManage'
            })
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }
        })
      },
    }
  }

</script>

<style lang="scss" scoped>
  .adeditor {
    width: calc(100% - 40px);
    padding: 30px 20px;
    min-height: 200px;
    background: white;
  }

  .el-form-item {
    margin-bottom: 45px;
  }

</style>
