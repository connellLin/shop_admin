<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" style="margin: 10px 0">添加</el-button>

    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="title"
        label="活动名称"
        width="180"
      ></el-table-column>

      <el-table-column label="状态" width="180">
        <el-button type="success" plain>启用</el-button>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button>编辑</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { httpAuth } from "@/utils/http";

export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      let res = await httpAuth.get("/secklist", {
        params: {},
      });
      if (res.code == 200) {
        console.log(res.list);
        this.tableData = res.list ? res.list : [];
      }
    },
  },
};
</script>