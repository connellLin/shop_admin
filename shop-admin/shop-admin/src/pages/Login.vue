<template>
  <div class="bg">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0"
      class="ruleForm"
    >
      <h2>登录</h2>
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" v-model.number="ruleForm.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="login-btn" type="primary" @click="loginFn"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { http } from "../utils/http";
// import axios from "axios";

export default {
  data() {
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      // 表单数据
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        // 对应字段的验证规则
        username: [
          //  message: 错误提示   trigger:触发 (默认失去焦点进行验证)
          { required: true, message: "管理员账号不能为空", trigger: "blur" }, //验证是否为空
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
          {
            pattern: /^[a-zA-Z]{3,8}$/,
            message: "由长度 3 到 8 个英文字符构成",
            trigger: "blur",
          },
        ],
        password: [
          //   { required: true, message: "请输入活动名称", trigger: "blur" },
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
          { validator: checkPassword, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    loginFn() {
      //   表单提交前的再次验证
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // console.log(valid);
          this.login();
        } else {
          this.$message("用户名或密码不能为空");
          console.log(valid);
          return false;
        }
      });
    },
    login() {
      http.post("/userlogin", this.ruleForm).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          localStorage.setItem("userinfo", JSON.stringify(res.data.list));
          this.$router.replace("/index");
          console.log(res.data.msg);
        } else {
          // 错误出现弹框提示
          this.$message.error(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="" scoped>
.bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
}
.bg h2 {
  color: white;
  text-align: center;
  margin: 20px auto;
}
.bg .ruleForm {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
}
.bg .ruleForm .login-btn {
  width: 100%;
}
</style>