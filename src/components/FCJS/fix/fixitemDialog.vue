<template>
  <div>
    <el-dialog title="添加/修改维修项目" :visible="dialogFormVisible" :before-close="close">
      <el-form>
        <el-form-item label="项目所属分类">
          <el-select v-model="form.sort_id">
            <el-option :label="item.sort_name" :value="item.sort_id" v-for="(item,index) in sortList" :key="index">{{item.sort_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input placeholder="请输入该项目名称" v-model="form.item_name" style="width:230px"></el-input>
        </el-form-item>
        <el-form-item label="故障描述">
          <el-input placeholder="请输入故障描述" v-model="form.item_des" style="width:230px"></el-input>
        </el-form-item>
        <el-form-item label="维修方式">
          <el-input placeholder="请输入维修方式" v-model="form.item_method" style="width:230px"></el-input>
        </el-form-item>
        <el-form-item align='center'>
          <el-button type="primary" size='medium' v-if="type != 'CHANGE'" @click="add">添加</el-button>
          <el-button type="primary" size='medium' v-if="type == 'CHANGE'" @click="change">修改</el-button>
          <el-button type="danger" @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getfixitembyid,
    addfixitem,
    updatefixitem,
    getfixitemsort
  } from '@/api/api'
  export default {
    name: 'fixitemDialog',
    props: {
      type: {
        type: String,
        default: 'NEW'
      },
      id:{
          type:String,
          default:''
      }
    },
    data() {
      return {
        form: {
          item_id: '',
          sort_id:'',
          item_name: '',
          item_des: '',
          item_method:''
        },
        sortList:[],
        dialogFormVisible: false
      }
    },
    created() {
        if (this.type == 'CHANGE') {
          this.getfixitems()
        }
    },
    methods: {
      open() {
        this.dialogFormVisible = true
        this.getfixitemsorts()
        if (this.type == 'CHANGE') {
          this.getfixitems()
        }
      },
      getfixitems() {
        this.loading = true
        const qdata = {
          item_id: this.id,
        }
        getfixitembyid(qdata)
          .then(data => {
            if (data.code == 200) {
              this.form = data.info[0]
            } else
              this.$message({
                message: data.message,
                type: 'error'
              })
          })
      },
      getfixitemsorts() {
        const qdata = {
          sort_name: '',
          pageSize: 100000,
          page: 1
        }
        console.log(1);
        getfixitemsort(qdata)
          .then(data => {
            if (data.code == 200) {
              this.sortList = data.info
            } else
              this.$message({
                message: data.message,
                type: 'error'
              })
          })
      },
      close() {
        this.dialogFormVisible = false
      },
      add() {
        const data = {
            sort_id:this.form.sort_id,
          item_name: this.form.item_name,
          item_des: this.form.item_des,
          item_method: this.form.item_method
        }
        addfixitem(data)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '添加失败',
                type: 'error'
              })
            }
          })
        this.form.item_id =
        this.form.item_name = ''
        this.form.item_des = ''
        this.dialogFormVisible = false
      },
      change() {
        const data = {
          item_id: this.form.item_id,
          sort_id:this.form.sort_id,
          item_name: this.form.item_name,
          item_des: this.form.item_des,
          item_method: this.form.item_method
        }
        updatefixitem(data)
          .then(data => {
            if (data.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '修改失败',
                type: 'error'
              })
            }
          })
        this.form.item_id =
        this.form.item_name = ''
        this.form.item_des = ''
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
