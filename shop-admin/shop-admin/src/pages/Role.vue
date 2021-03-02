<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tip }}列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn" style="margin: 10px 0"
      >添加</el-button
    >

    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column
        prop="rolename"
        label="角色名称"
        width="180"
      ></el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success" effect="dark"
            >启用</el-tag
          >
          <el-tag v-else type="success" effect="dark">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="tip + (isAdd ? '添加' : '修改')"
      :visible.sync="dialogFormVisible"
      @opened="openedFn"
      @close="closeFn"
    >
      <el-form
        :model="ruleForm"
        label-width="150px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="ruleForm.rolename"></el-input>
        </el-form-item>

        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            :check-strictly="true"
            node-key="id"
            :props="{
              children: 'children',
              label: 'title',
            }"
          ></el-tree>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFn">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { httpAuth } from "@/utils/http";

let defaultForm = {
  rolename: "",
  menus: "",
  status: true,
};

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      isAdd: true,
      tip: "角色",
      ruleForm: {
        ...defaultForm,
      },
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      treeData: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    resetFn() {
      this.dialogFormVisible = false;
    },

    openedFn() {
      this.getMenus();
    },

    closeFn() {
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = {
        ...defaultForm,
      };
      this.isAdd = true;
    },

    submitFn() {
      this.ruleForm.menus = this.$refs.tree.getCheckedKeys().join(",");
      console.log(this.ruleForm.menus);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = this.isAdd ? "/roleadd" : "/roleedit";
          this.ruleForm.status = this.ruleForm.status ? 1 : 2;
          httpAuth.post(url, this.ruleForm).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.getTableData();
              this.$message.success("提交成功");
            }
          });
        }
      });
    },

    addFn() {
      this.dialogFormVisible = true;
    },

    async getTableData() {
      let res = await httpAuth.get("/rolelist");
      if (res.code == 200) {
        console.log(res.list);
        this.tableData = res.list ? res.list : [];
      }
    },

    async getMenus() {
      let res = await httpAuth.get("/menulist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        console.log(res.list);
        this.treeData = res.list ? res.list : [];
      }
    },

    async deleteFn(row) {
      try {
        let confirm = await this.$confirm(
          "此操作将永久删除该角色, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (confirm == "confirm") {
          let res = await httpAuth.post("/roledelete", {
            id: row.id,
          });
          if (res.code == 200) {
            this.tableData = res.list ? res.list : [];
          }
        }
      } catch (error) {}
    },

    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/roleinfo", {
        params: {
          id,
        },
      });
      console.log(res);
      if (res.code == 200) {
        let status = res.list.status == 1 ? true : false;
        this.ruleForm = {
          ...res.list,
          status,
          id,
        };
        let menus = this.ruleForm.menus.split(",");
        console.log(menus);
        this.$refs.tree.setCheckedKeys(menus);
      }
    },
  },
};
</script>