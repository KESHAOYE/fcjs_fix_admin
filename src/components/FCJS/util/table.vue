<template>
  <div class="el-page-table">
      <el-table
          :data="data"
          :height="height"
          :max-height="maxHeight"
          :stripe="stripe"
          :border="border"
          style="width: 100%"
      >
          <slot></slot>
      </el-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              :layout="layout"
              :page-count="pageCount"
              background
              style="background: white;
               border-top: 1px solid #f2f2f2;
               height: 50px;
               display:flex;
               flex-flow:row nowrap;
               align-items:center;
              "
              >
      </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'ElPageTable',
  props: {
    data: {
      default() {
        return [];
      },
      type: Array
    },
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: {
      default() {
        return true;
      },
      type: Boolean
    },
    border: {
      default() {
        return true;
      },
      type: Boolean
    },
    currentPage: {
      default() {
        return 1;
      },
      type: Number
    },
    pageCount: {
      default() {
          return 1;
      },
      type: Number
    }, 
    pageSizes: {
      default() {
        return [5,10, 20, 30, 40];
      },
      type: Array
    },
    pageSize: {
      default() {
        return 10;
      },
      type: Number
    },
    layout: {
      default() {
        return 'total, sizes, prev, pager, next, jumper';
      },
      type: String
    },
    total: {
      default() {
        return 0;
      },
      type: Number
    }
  },
  data: function() {
    return {
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', val);
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val);
    }
  },
  mounted() {

  }
};
</script>