<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
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
        prop="nickname"
        label="昵称"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="phone"
        label="手机号"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="addtime"
        label="注册日期"
        width="180"
      ></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button>编辑</el-button>
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
      let res = await httpAuth.get("/memberlist", {
        params: {
          page: 1,
          size: 21,
        },
      });
      if (res.code == 200) {
        console.log(res.list);
        this.tableData = res.list ? res.list : [];
      }
    },
  },
};
</script>