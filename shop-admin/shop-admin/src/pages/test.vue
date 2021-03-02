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
        label="活动名称"
        width="180"
      ></el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="succcess" effect="dark"
            >启 用</el-tag
          >
          <el-tag v-else type="danger" effect="dark">禁 用</el-tag>
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
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="el-icon-time"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="一级分类">
          <el-select
            v-model="ruleForm.first_cateid"
            @change="changeFirstFn"
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in firstCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select
            v-model="ruleForm.second_cateid"
            placeholder="请选择分类"
            @change="changeSecondFn"
          >
            <el-option
              v-for="item in secondCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="ruleForm.goodsid" placeholder="请选择商品">
            <el-option
              v-for="item in goods"
              :key="item.goodsname"
              :label="item.goodsname"
              :value="item.goodsname"
            ></el-option>
          </el-select>
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
  first_cateid: "",
  second_cateid: "",
  goodsid: "",
};

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      tip: "限时秒杀",
      isAdd: true,
      isDefault: true,
      ruleForm: {
        ...defaultForm,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "blur",
          },
        ],
      },
      firstCate: [],
      secondCate: [],
      goods: [],
      dateTime: [],
      isDefault: true,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    openedFn() {
      this.getTableData();
      this.getFirstCate();
    },
    closeFn() {
      this.$refs.ruleForm.clearValidate();
      this.secondCate = [];
      this.ruleForm = {
        ...defaultForm,
      };
      this.isAdd = true;
    },
    addFn() {
      this.dialogFormVisible = true;
    },
    resetFn() {
      this.dialogFormVisible = false;
    },

    async getTableData() {
      let res = await httpAuth.get("/secklist", {
        params: {},
      });
      if (res.code == 200) {
        console.log(res.list);
        this.tableData = res.list ? res.list : [];
      }
    },

    async getFirstCate() {
      let res = await httpAuth.get("/catelist", {
        params: { pid: 0 },
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
        params: { pid },
      });
      if (res.code == 200) {
        this.secondCate = res.list ? res.list : [];
      }
      this.isDefault = true;
    },
    async changeSecondFn(pid) {
      if (this.isDefault) {
        this.ruleForm.goodsid = "";
      }
      let res = await httpAuth.get("/goodslist", {
        params: { pid },
      });
      if (res.code == 200) {
        this.goods = res.list ? res.list : [];
      }
      this.isDefault = true;
    },

    submitFn() {
      console.log(this.ruleForm);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.ruleForm.status = this.ruleForm.status ? 1 : 2;
          let btStamp = this.timeStamp(this.dateTime[0]);
          let etStamp = this.timeStamp(this.dateTime[1]);
          this.dateTime = [btStamp, etStamp];
          console.log(this.dateTime);
          let url = this.isAdd ? "/seckadd" : "/seckedit";
          httpAuth.post(url, this.ruleForm, this.dateTime).then((res) => {
            if (res.code == 200) {
              console.log(res);
              this.dialogFormVisible = false;
              this.getTableData();
              this.$message.success("提交成功");
            } else {
              this.$message.error(res.msg);
              console.log(res);
            }
          });
        }
      });
    },

    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/seckinfo", {
        params: {
          id,
        },
      });
      console.log(res);
      if (res.code == 200) {
        let status = res.list.status == 1 ? true : false;
        let beginTime = this.formatDate(res.list.begintime);
        let endTime = this.formatDate(res.list.endtime);
        this.dateTime = [beginTime, endTime];
        let dTime = this.dateTime;
        this.ruleForm = {
          ...res.list,
          status,
          id,
          dTime,
        };
        console.log(dTime);
      }
    },

    async deleteFn(row) {
      try {
        let confirm = await this.$confirm(
          `此操作将永久删除该活动名称，是否继续？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (confirm == "confirm") {
          let res = await httpAuth.post("/seckdelete", {
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

    formatDate(val) {
      val = Number(val);
      let date = new Date(val);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return `${y}-${MM}-${d} ${h}:${m}:${s}`;
    },

    timeStamp(val) {
      let date = new Date(val);
      let stamp = date.getTime();
      return stamp;
    },
  },
};
</script>
