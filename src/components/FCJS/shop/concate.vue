<template>
  <div>
    <el-dialog title="组合/库存设置" :visible="dialogFormVisible" :before-close="close">
      <el-form>
        <el-form-item v-for="(el,index) in sku" :key="index" :label="el.specName" v-if="type == 'NEW'">
          <el-radio-group v-model="result[index]" @change="pushsku">
            <el-radio :label="els.skuId" border v-for="(els,indexs) in el.value" :key='indexs'>{{els.specValue}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="stock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="type == 'NEW'" @click="add">添加</el-button>
          <el-button type="primary" v-if="type == 'ADD'" @click="update">修改库存</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addsku,
    getskustock,
    updatesku
  } from '@/api/api'
  export default {
    name: 'skuEditor',
    props: {
      type: {
        type: String,
        //NEW CHANGE ADD
        default: 'NEW'
      },
      value: {
        default: () => {
          return []
        },
        type: Array
      },
      id: {
        default: '',
        type: String
      },
      ids: {
        default: 0,
        type: Number
      }
    },
    data() {
      return {
        result: [],
        stock: '',
        sku: [],
        dialogFormVisible: false
      }
    },
    created() {

      this.sku = []
      this.value.forEach(el => {
        let indexs = this.sku.findIndex(et => {
          return et.specId == el.spec_id
        })
        if (indexs != -1) {
          const data = {
            specValue: el.value[0].spec_value,
            price: el.value[0].price,
            skuId: el.value[0].skuId
          }
          this.sku[indexs].value.push(data)
        } else {
          const data = {
            specId: el.spec_id,
            specName: el.spec_name,
            value: [{
              specValue: el.value[0].spec_value,
              price: el.value[0].price,
              skuId: el.value[0].skuId
            }]
          }
          let n = this.sku.push(data)
          this.result[n - 1] = ''
        }
      })
    },
    methods: {
      pushsku() {
        console.log(this.result);
      },
      getskustocks() {
        getskustock({
            id: this.ids
          })
          .then(data => {
            this.stock = data.info[0].stock
          })
      },
      open() {
        this.dialogFormVisible = true
        if (this.type != 'NEW') {
          this.getskustocks()
        }
        this.sku = []
        this.value.forEach(el => {
          let indexs = this.sku.findIndex(et => {
            return et.specId == el.spec_id
          })
          if (indexs != -1) {
            const data = {
              specValue: el.value[0].spec_value,
              price: el.value[0].price,
              skuId: el.value[0].skuId
            }
            this.sku[indexs].value.push(data)
          } else {
            const data = {
              specId: el.spec_id,
              specName: el.spec_name,
              value: [{
                specValue: el.value[0].spec_value,
                price: el.value[0].price,
                skuId: el.value[0].skuId
              }]
            }
            let n = this.sku.push(data)
            this.result[n - 1] = ''
          }
        })
      },
      close() {
        this.dialogFormVisible = false
      },
      add() {
        const data = {
          shopid: this.id,
          sku: this.result,
          stock: this.stock
        }
        addsku(data)
        .then(data=>{
            this.$message({
                message: '添加成功',
                type: 'success'
            })
            this.$emit('ok')
            this.dialogFormVisible = false
        })
        .catch(err=>{
            this.$message({
                message: '添加失败',
                type: 'error'
            })
            this.dialogFormVisible = false
        })
      },
      update(){
          const data = {
            id: this.ids,
            stock: this.stock
          }
        updatesku(data)
        .then(data=>{
            this.$message({
                message: '更新成功',
                type: 'success'
            })
            this.$emit('ok')
            this.dialogFormVisible = false
        })
        .catch(err=>{
            this.$message({
                message: '更新失败',
                type: 'error'
            })
            this.dialogFormVisible = false
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  .adeditor {
    width: calc(100% - 40px);
    padding: 30px 20px;
    min-height: 300px;
    background: white;
  }

  .el-form-item {
    margin-bottom: 25px;
  }

</style>
