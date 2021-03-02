<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" style="margin: 10px 0" @click="addFn"
      >添加</el-button
    >

    <specs-table></specs-table>
    <specs-dialog></specs-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import SpecsTable from "./SpecsTable";
import SpecsDialog from "./SpecsDialog";

let { mapState, mapMutations, mapActions } = createNamespacedHelpers("specs");

export default {
  components: {
    SpecsTable,
    SpecsDialog,
  },
  created() {
    this.getTableData();
  },
  methods: {
    ...mapMutations(["setDialogFormVisible"]),
    ...mapActions(["getTableData"]),
    addFn() {
      this.setDialogFormVisible(true);
    },
  },
};
</script>