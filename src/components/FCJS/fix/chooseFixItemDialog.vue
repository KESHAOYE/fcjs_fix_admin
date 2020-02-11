<template>
  <!-- 首页广告管理 -->
  <div class="indexAdManage">
    <el-dialog title="添加/修改维修项目" :visible="dialogFormVisible" :before-close="close">
      <!-- 查询工具 -->
      <div class="toolkits">
        <el-form :inline="true">
          <el-form-item label="项目名称">
            <el-input placeholder="请输入项目名称" v-model="item_name" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getfixitems">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 数据展示 -->
      <ftable v-loading='loading' :data='tableData' center :pageSize='pageSize' :total='count' :pageCount='pageCount'
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
        <el-table-column label="项目名称" align='center'>
          <template slot-scope="scope">
            {{scope.row.item_name}}
          </template>
        </el-table-column>
        <el-table-column label="所属维修品类" align='center'>
          <template slot-scope="scope">
            {{scope.row.sort_name}}
          </template>
        </el-table-column>
        <el-table-column label="项目介绍" align='center'>
          <template slot-scope="scope">
            {{scope.row.item_des}}
          </template>
        </el-table-column>
        <el-table-column label="维修方式" align='center'>
          <template slot-scope="scope">
            {{scope.row.item_method}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align='center'>
          <template slot-scope="scope">
            <el-button type="primary" plain @click="choose(scope)">选择</el-button>
          </template>
        </el-table-column>
      </ftable>
      <el-form>
        <el-form-item label="项目名称">
          <el-input v-model="form.item_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="维修价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="chooses">选择</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import ftable from '../util/table'
  import {
    getfixitem,
  } from '@/api/api'
  import {
    mapState,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        item_name: '',
        form: {
          item_name: '',
          item_id: '',
          price: '',
        },
        tableData: [],
        pageSize: 5,
        currentPage: 1,
        count: 0,
        pageCount: 1,
        loading: true,
        dialogFormVisible: false
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
    methods: {
      open() {
        this.dialogFormVisible = true
        this.getfixitems()
      },
      close() {
        this.dialogFormVisible = false
      },
      getfixitems() {
        this.loading = true
        const qdata = {
          item_name: this.item_name,
          pageSize: this.pageSize,
          page: this.currentPage
        }
        getfixitem(qdata)
          .then(data => {
            if (data.code == 200) {
              this.tableData = data.info
              this.count = data.count
              this.pageCount = Math.floor((parseInt(this.count) + parseInt(this.pageSize) - 1) / parseInt(this
                .pageSize));
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
      },
      choose(scope) {
        this.form.item_name = scope.row.item_name
        this.form.item_id = scope.row.item_id
      },
      chooses() {
        console.log(1);
        this.$emit('choose', {
          item_id: this.form.item_id,
          item_name: this.form.item_name,
          price: this.form.price
        })
        this.form.item_name = ''
        this.form.item_id = ''
        this.form.price = ''
        this.close();
      },
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
    min-height: 80px;
    padding: 0 20px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  .news {
    position: relative;
    //right: 15px;
    margin-bottom: 15px;
  }

  .el-form-item {
    margin-bottom: 0;
    margin-top: 12px;
  }

  .shopinfo {
    font-size: 1.1em;
    font-family: "等线";
    display: block;
    margin-top: 5px;
  }

</style>
