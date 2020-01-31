<template>
  <div class="adeditor">
    <el-dialog title="添加规格(SKU/SPU)" :visible="dialogFormVisible">
      <el-form>
        <el-form-item label="参数名">
          <el-select placeholder="参数名(如无选项请配置)" v-model="spec_id">
            <el-option v-for="(el,index) in specList" :key="index" :label="el.spec_name" :value="el.spec_id">
              {{el.spec_name}}-{{el.spec_des}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数值">
          <el-input placeholder="请输入该商品参数属性" v-model="spec_value" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="价格" v-if="this.sort == 'SKU'">
          <el-input placeholder="请输入该商品属性价格" v-model="price" style="width:230px"></el-input>
        </el-form-item>
        <el-form-item align='center'>
          <el-button type="primary" size='medium' @click="add">添加</el-button>
          <el-button type="danger" @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getspec
  } from '@/api/api'
  export default {
    name: 'skuEditor',
    props: {
      type: {
        type: String,
        default: 'NEW'
      },
      sort: {
        type: String,
        default: 'SPU'
      }
    },
    data() {
      return {
        spec_id: '',
        spec_name: '',
        spec_value: '',
        price: '',
        specList: [],
        dialogFormVisible: false
      }
    },
    created() {

    },
    methods: {
      open() {
        this.dialogFormVisible = true
        this.getspecs()
      },
      getspecs() {
        this.loading = true
        const qdata = {
          specName: '',
          pageSize: 100000,
          page: 1
        }
        getspec(qdata)
          .then(data => {
            if (data.code == 200) {
              this.specList = data.info
            } else
              this.$message({
                message: data.message,
                type: 'error'
              })
          })
      },
      add() {
        let index = this.specList.findIndex((el) => {
          return el.spec_id == this.spec_id
        })
        const data = this.sort == 'SPU' ? {
          info: {
            spec_id: this.spec_id,
            spec_name: this.specList[index].spec_name,
            spec_value: this.spec_value
          },
          type: 'SPU'
        } : {
          info: {
            spec_id: this.spec_id,
            spec_name: this.specList[index].spec_name,
            spec_value: this.spec_value,
            price: this.price
          },
          type: 'SKU'
        }
        this.$emit('add', data)
        this.spec_id = ''
        this.spec_name = ''
        this.spec_value =''
        this.price = ''
        this.dialogFormVisible = false
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
