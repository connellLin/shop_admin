<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tip }}列表</el-breadcrumb-item>
    </el-breadcrumb>

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

      <el-table-column label="注册日期" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime | formatDate() }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="tip + '修改'"
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
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            :show-password="true"
            @focus="tips"
            @blur="clearTips"
          ></el-input>
          <span ref="tip"></span>
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
  uid: "",
  nickname: "",
  phone: "",
  password: "",
  status: true,
};

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      tip: "会员",
      ruleForm: {
        ...defaultForm,
      },
      rules: {
        password: [
          {
            required: false,
            message: "不填写则不修改密码",
            trigger: "change",
          },
        ],
      },
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
          size: 17,
        },
      });
      if (res.code == 200) {
        console.log(res.list);
        this.tableData = res.list ? res.list : [];
      }
    },
    resetFn() {
      this.dialogFormVisible = false;
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
    tips() {
      this.$refs.tip.innerHTML = "不填写则不修改密码";
    },
    clearTips() {
      this.$refs.tip.innerHTML = "";
    },

    submitFn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.ruleForm.status = this.ruleForm.status ? 1 : 2;
          httpAuth.post("/memberedit", this.ruleForm).then((res) => {
            if (res.code == 200) {
              console.log(res);
              this.dialogFormVisible = false;
              this.getTableData();
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },

    async editFn(uid) {
      console.log(uid);
      this.dialogFormVisible = true;
      let res = await httpAuth.get("/memberinfo", {
        params: {
          uid,
        },
      });
      console.log(res);
      if (res.code == 200) {
        let status = res.list.status == 1 ? true : false;
        this.ruleForm = {
          ...res.list,
          status,
          uid,
        };
      }
    },
  },
  filters: {
    formatDate: function (val) {
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
  },
};
</script>