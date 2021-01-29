<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" style="margin: 10px 0" @click="addFn"
      >添加</el-button
    >

    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="catename" label="分类名称" width="180">
      </el-table-column>

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
        <el-form-item label="上级菜单">
          <el-select v-model="ruleForm.pid" placeholder>
            <el-option label="顶级分类" :value="0"></el-option>

            <el-option
              v-for="item in pCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="ruleForm.catename"></el-input>
        </el-form-item>

        <el-form-item label="分类图片">
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
  pid: 0,
  status: true,
  catename: "",
  img: "",
};

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      isAdd: true,
      tip: "商品分类",
      ruleForm: {
        ...defaultForm,
      },
      rules: {
        catename: [
          {
            required: true,
            message: "请输入商品分类名称",
            trigger: "blur",
          },
        ],
      },
      pCate: [],
      dialogImgVisible: false,
      dialogImgUrl: "",
      fileList: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    pictureChange(file, fileList) {
      this.ruleForm.img = file.raw;
    },

    pictureCardPreview(file) {
      this.dialogImgUrl = file.url;
      this.dialogImgVisible = true;
    },

    openedFn() {
      this.getTopCate();
    },

    resetFn() {
      this.dialogFormVisible = false;
    },

    closeFn() {
      this.$refs.upload.clearFiles();
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = {
        ...defaultForm,
      };
      this.isAdd = true;
    },

    submitFn() {
      console.log(this.ruleForm);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.ruleForm.status = this.ruleForm.status ? 1 : 2;

          let url = this.isAdd ? "/cateadd" : "/cateedit";

          uploadAuth.post(url, this.ruleForm).then((res) => {
            if (res.code == 200) {
              console.log(res);
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
      let res = await httpAuth.get("/catelist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        console.log(res.list);
        this.tableData = res.list ? res.list : [];
      }
    },

    async getTopCate() {
      let res = await httpAuth.get("/catelist", {
        params: {
          pid: 0,
        },
      });
      if (res.code == 200) {
        console.log(res.list);
        this.pCate = res.list ? res.list : [];
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
          let res = await httpAuth.post("/catedelete", {
            id: row.id,
          });
          if (res.code == 200) {
            console.log(res.list);
            this.tableData = res.list ? res.list : [];
          }
        }
      } catch (error) {}
    },
    
    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/cateinfo", {
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
            { name: "", url: "http://localhost:3000" + this.ruleForm.img },
          ];
        }
      }
    },
  },
};
</script>