<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tip }}列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" style="margin: 10px 0" @click="addFn"
      >添加</el-button
    >

    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column
        prop="title"
        label="轮播图名称"
        width="180"
      ></el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success" effect="dark"
            >启用</el-tag
          >
          <el-tag v-else type="danger" effect="dark">禁用</el-tag>
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
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="轮播图图片">
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="pictureCardPreview"
            :on-change="pictureChange"
            :file-list="fileList"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogImgVisible" append-to-body>
            <img width="100%" :src="dialogImgUrl" alt="the Picture" />
          </el-dialog>
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
import { httpAuth, uploadAuth } from "@/utils/http";

let defaultForm = {
  status: true,
  title: "",
  img: "",
};

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      tip: "轮播图",
      isAdd: true,
      ruleForm: {
        ...defaultForm,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入轮播图标题",
            trigger: "blur",
          },
        ],
      },
      dialogImgVisible: false,
      dialogImgUrl: "",
      fileList: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    pictureCardPreview(file) {
      this.dialogImgVisible = true;
      this.dialogImgUrl = file.url;
    },
    pictureChange(file) {
      this.ruleForm.img = file.raw;
    },
    addFn() {
      this.dialogFormVisible = true;
    },
    openedFn() {
      this.getTableData();
    },
    closeFn() {
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = {
        ...defaultForm,
      };
    },
    resetFn() {
      this.dialogFormVisible = false;
    },

    submitFn() {
      console.log(this.ruleForm);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.ruleForm.status = this.ruleForm.status ? 1 : 2;
          let url = this.isAdd ? "/banneradd" : "/banneredit";
          uploadAuth.post(url, this.ruleForm).then((res) => {
            if (res.code == 200) {
              console.log(res);
              this.dialogFormVisible = false;
              this.getTableData();
              this.$message.success("提交成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },

    async getTableData() {
      let res = await httpAuth.get("/bannerlist", {
        params: {},
      });
      if (res.code == 200) {
        console.log(res.list);
        this.tableData = res.list ? res.list : [];
      }
    },

    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/bannerinfo", {
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
        if (this.ruleForm.img) {
          this.fileList = [
            {
              name: "",
              url: "http://localhost:3000" + this.ruleForm.img,
            },
          ];
        }
      }
    },

    async deleteFn(row) {
      try {
        let confirm = await this.$confirm(
          `此操作将永久删除该${this.tip}, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (confirm == "confirm") {
          let res = await httpAuth.post("/bannerdelete", {
            id: row.id,
          });
          if (res.code == 200) {
            console.log(res.list);
            this.tableData = res.list ? res.list : [];
            this.$message.success("删除成功");
          } else {
            this.$message.error("删除失败");
          }
        }
      } catch (error) {}
    },
  },
};
</script>