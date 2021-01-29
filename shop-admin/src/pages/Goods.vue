<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
        prop="firstcatename"
        label="一级分类"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="secondcatename"
        label="二级分类"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="goodsname"
        label="商品名称"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="price"
        label="销售价"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="market_price"
        label="市场价"
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

    <div class="pagination">
      <el-pagination
        @current-change="currentChangeFn"
        background
        :current-page="page"
        :page-size="size"
        layout="prev,pager,next"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog
      :title="tip + (isAdd ? '添加' : '修改')"
      :visible.sync="dialogFormVisible"
      @opened="openedFn"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="ruleForm" label-width="150px" ref="ruleForm">
        <el-form-item label="一级分类">
          <el-select v-model="ruleForm.first_cateid" @change="changeFirstFn">
            <el-option
              v-for="item in firstCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="ruleForm.second_cateid">
            <el-option
              v-for="item in secondCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="ruleForm.goodsname"></el-input>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="pictureCardPreview"
            :on-change="pictureChange"
            ref="upload"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <el-dialog :visible.sync="dialogImgVisible" append-to-body>
            <img width="100%" :src="dialogImgUrl" alt="~" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="商品规格">
          <el-select v-model="ruleForm.specsid" @change="changeSpecsFn">
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品规格值">
          <el-select v-model="ruleForm.specsattr" multiple>
            <el-option
              v-for="item in attrsList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="销售价">
          <el-input v-model="ruleForm.price" type="number"></el-input>
        </el-form-item>

        <el-form-item label="市场价">
          <el-input v-model="ruleForm.market_price" type="number"></el-input>
        </el-form-item>

        <el-form-item label="是否热卖">
          <el-radio :label="1" v-model="ruleForm.ishot">是</el-radio>
          <el-radio :label="2" v-model="ruleForm.ishot">否</el-radio>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio :label="1" v-model="ruleForm.isnew">是</el-radio>
          <el-radio :label="2" v-model="ruleForm.isnew">否</el-radio>
        </el-form-item>

        <el-form-item label="上架状态">
          <el-radio :label="1" v-model="ruleForm.status">是</el-radio>
          <el-radio :label="2" v-model="ruleForm.status">否</el-radio>
        </el-form-item>

        <el-form-item label="商品描述">
          <div id="container"></div>
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
import axios from "axios";
import E from "wangeditor";

let defaultForm = {
  first_cateid: "",
  second_cateid: "",
  goodsname: "",
  price: "",
  market_price: "",
  img: "",
  description: "",
  specsid: "",
  specsattr: [],
  isnew: 1,
  ishot: 1,
  status: 1,
};

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      isAdd: true,
      tip: "商品",
      ruleForm: {
        ...defaultForm,
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入管理员名称",
            trigger: "blur",
          },
        ],
      },
      firstCate: [],
      secondCate: [],
      specsList: [],
      attrsList: [],
      page: 1,
      size: 8,
      total: 10,
      dialogImgVisible: false,
      dialogImgUrl: "",
      fileList: [],
      isDefault: true,
    };
  },
  created() {
    this.getAll();
  },
  beforeDestroy() {
    this.editor.destroy();
    this.editor = null;
  },
  methods: {
    pictureChange(file, fileList) {
      this.ruleForm.img = file.raw;
    },
    pictureCardPreview(file) {
      this.dialogImgUrl = file.url;
      this.dialogImgVisible = true;
    },
    currentChangeFn(page) {
      this.page = page;
      this.getAll();
    },
    resetFn() {
      this.dialogFormVisible = false;
    },
    openFn() {
      console.log(document.querySelector("#container"));
    },
    openedFn() {
      this.editor = new E("#container");
      this.editor.create();
      this.editor.txt.html(this.ruleForm.description);
      this.getFirstCate();
      this.getSpecsList();
    },
    closeFn() {
      this.$refs.ruleForm.clearValidate();
      this.secondCate = [];
      this.attrsList = [];
      this.fileList = [];
      this.editor.txt.clear();
      this.editor.destroy();
      this.editor = null;
      this.ruleForm = {
        ...defaultForm,
      };
      this.isAdd = true;
    },
    submitFn() {
      console.log(this.editor.txt.html());
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = this.isAdd ? "/goodsadd" : "/goodsedit";
          let ruleForm = {
            ...this.ruleForm,
          };
          ruleForm.specsattr = ruleForm.specsattr.join(",");
          ruleForm.description = this.editor.txt.html();
          uploadAuth.post(url, ruleForm).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.getAll();
              this.$message.success("提交成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    addFn() {
      this.dialogFormVisible = true;
    },
    getTableData() {
      return httpAuth.get("/goodslist", {
        params: {
          page: this.page,
          size: this.size,
        },
      });
    },
    getTotal() {
      return httpAuth.get("/goodscount");
    },
    getAll() {
      axios.all([this.getTableData(), this.getTotal()]).then(
        axios.spread((res1, res2) => {
          console.log(res1, res2);
          if ((res1.code = 200)) {
            this.tableData = res1.list ? res1.list : [];
          }
          if (res2.code == 200) {
            this.total = res2.list ? res2.list[0].total : 0;
          }
        })
      );
    },
    async getFirstCate() {
      let res = await httpAuth.get("/catelist", {
        params: {
          pid: 0,
        },
      });
      if (res.code == 200) {
        this.firstCate = res.list ? res.list : [];
      }
    },
    async changeFirstFn(pid) {
      if (this.isDefault) {
        this.ruleForm.second_cateid = "";
      }
      let res = await httpAuth.get("/catelist", {
        params: {
          pid,
        },
      });
      if (res.code == 200) {
        this.secondCate = res.list ? res.list : [];
      }
      this.isDefault = true;
    },
    async getSpecsList() {
      let res = await httpAuth.get("/specslist");
      console.log(res);
      if (res.code == 200) {
        this.specsList = res.list;
      }
    },
    changeSpecsFn(id) {
      this.ruleForm.specsattr = [];
      this.specsList.map((item) => {
        if (item.id == id) {
          this.attrsList = item.attrs;
        }
      });
      console.log(this.attrsList);
    },
    async deleteFn(row) {
      console.log(row);
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
          let res = await httpAuth.post("/goodsdelete", {
            id: row.id,
          });
          if (res.code == 200) {
            console.log(res.list);
            this.page = 1;
            this.getAll();
            // let max = res.list.every((item) => row.id > item.id);
            // if (res.list.length % this.size == 0 && this.page > 1 && max) {
            //   this.page--;
            //   this.total = res.list.length;
            //   this.tableData = res.list.slice(-this.size);
            // } else {
            //   this.total = res.list.length;
            //   this.tableData = res.list.slice(
            //     this.size * (this.page - 1),
            //     this.size * this.page
            //   );
            // }
          }
        }
      } catch (error) {}
    },
    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/goodsinfo", {
        params: {
          id,
        },
      });
      console.log(res);
      if (res.code == 200) {
        let specsattr = res.list.specsattr.split(",");
        this.ruleForm = {
          ...res.list,
          specsattr,
          id,
        };
        if (this.editor) {
          this.editor.txt.html(this.ruleForm.description);
        }
        this.isDefault = false;
        this.changeFirstFn(this.ruleForm.first_cateid);
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
  },
};
</script>

<style lang="">
.pagination {
  text-align: center;
}
</style>