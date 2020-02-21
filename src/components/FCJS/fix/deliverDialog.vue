<template>
  <div>
    <el-dialog title="核验信息" :visible="dialogFormVisible" :before-close="close" width=950px>
      <span class="tips">请按照下列信息检查货品</span>
        <div class="row">机型: {{List[0].model_name}}</div>
        <div class="rows">维修项目: <el-tag v-for="(item,index) in List" :key="index" style="margin-left:10px">{{item.item_name}}</el-tag></div>
        <div class="row">系统评估价格: {{List[0].auto_price}}</div>
        <div class="row">IMEI码: {{List[0].imei}}</div>
      <span class="tips">请验货后将情况反馈给用户</span>
      <div class="row">
        <el-input v-model="man_price" placeholder="人工判定价格"></el-input>
      </div>
      <div class="row">
        <el-input v-model="des" placeholder="原因"></el-input>
      </div>
      <div class="sure">
        <el-button type='primary' plain @click='sends'>确认核验并提醒用户</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getfixorderdetail,
    waitfix
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
    },
    data() {
      return {
        List:[],
        dialogFormVisible: false,
        man_price:'',
        des: ''
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
        getfixorderdetail({orderid: this.id})
          .then(data => {
            if (data.code == 200) {
              this.List = data.info
            } else
              this.$message({
                message: data.message,
                type: 'error'
              })
          })
      },
      sends(){
        waitfix({orderid: this.id,man_price:this.man_price,des:this.des,phonename:this.List[0].model_name})
        .then(data=>{
          if(data.code == 200){
            this.$message({
              message: '核验成功',
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
  .row,.rows{
    height: 35px;
    font-weight: bold;
    font-size: 1.1em;
    color: #ff3333;
  }
  .rows{
    height: 50px !important;
  }
  .sure{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: 100%;
  }
</style>
