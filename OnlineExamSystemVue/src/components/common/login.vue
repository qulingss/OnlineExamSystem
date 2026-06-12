<template>
  <div class="container">
    <div class="login-box">
      <div class="login-content">
        <div class="login-title">
          <h1>在线考试管理系统</h1>
          <p class="subtitle">Online Examination System</p>
        </div>

        <el-form :label-position="labelPosition" :model="formLabelAlign" class="login-form">
          <el-form-item label="用户名">
            <el-input 
              v-model.number="formLabelAlign.username" 
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input 
              v-model="formLabelAlign.password" 
              placeholder="请输入密码"
              type="password"
              prefix-icon="el-icon-lock"
              @keyup.enter.native="login()"
              clearable>
            </el-input>
          </el-form-item>
          <div class="login-buttons">
            <el-button type="primary" class="login-btn" @click="login()">
              <i class="el-icon-right"></i> 登录
            </el-button>
            <div class="register-link">
              <span>还没有账号？</span>
              <a href="javascript:void(0)" @click="showRegisterTip">立即注册</a>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "login",
    data() {
        return {
            role: 2,
            labelPosition: "left",
            formLabelAlign: {
                username: "",
                password: "",
            },
        };
    },
    methods: {
        //用户登录请求后台处理
        login() {
            if (
                this.formLabelAlign.username == undefined ||
                this.formLabelAlign.username == ""
            ) {
                this.$message("请输入用户名");
                return;
            }
            if (
                !/^\d+$/.test(this.formLabelAlign.username) ||
                this.formLabelAlign.username.toString().length > 10
            ) {
                this.$message("用户名有误");
                return;
            }
            if (this.formLabelAlign.password == "") {
                this.$message("请输入密码");
                return;
            }
            this.$axios({
                url: `/login`,  // service已配置baseURL: '/api'，这里不需要再加/api前缀
                method: "post",
                data: {
                    ...this.formLabelAlign,
                },
            })
                .then((res) => {
                    let resData = res.data.data;
                    if (resData != null) {
                        switch (resData.role) {
                            case "0": //管理员
                                this.$cookies.set("rb_role", "0");
                                this.$cookies.set("cname", resData.adminName);
                                this.$cookies.set("rb_teacher_id", resData.adminId);
                                this.$router.push({ path: "/index" }); //跳转到首页
                                break;
                            case "1": //教师
                                this.$cookies.set("rb_role", "1");
                                this.$cookies.set("cname", resData.teacherName);
                                this.$cookies.set("rb_teacher_id", resData.teacherId);
                                this.$router.push({ path: "/index" }); //跳转到教师用户
                                break;
                            case "2": //学生
                                this.$cookies.set("rb_role", "2");
                                this.$cookies.set("cname", resData.studentName);
                                this.$cookies.set("rb_student_id", resData.studentId);
                                this.$router.push({ path: "/student" });
                                break;
                        }
                    }
                    if (resData == null) {
                        //错误提示
                        this.$message({
                            showClose: true,
                            type: "error",
                            message: "用户名或者密码错误",
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                    if (
                        e.response == undefined ||
                        e.response.data == undefined
                    ) {
                        this.$message({
                            showClose: true,
                            message: e,
                            type: "error",
                            duration: 5000,
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: e.response.data,
                            type: "error",
                            duration: 5000,
                        });
                    }
                });
        },
        clickTag(key) {
            this.role = key;
        },
        showRegisterTip() {
            this.$message({
                message: '请联系管理员进行账号注册',
                type: 'info',
                duration: 3000
            });
        },
    },
    computed: mapState(["userInfo"]),
    mounted() { },
};
</script>

<style lang="less" scoped>

.container {
  height: 100vh;
  overflow: hidden;
  background-image: url("../../assets/img/loginbg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  position: relative;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  pointer-events: none;
}

.login-box {
  width: 420px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
  overflow: visible;
}

.login-content {
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
}

.login-title h1 {
  font-size: 32px;
  color: #303133;
  margin: 0 0 10px 0;
  font-weight: 600;
  letter-spacing: 2px;
}

.login-title .subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
  letter-spacing: 1px;
}

.login-form {
  margin-top: 20px;
}

.login-form .el-form-item {
  margin-bottom: 25px;
}

.login-form .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  padding: 0 0 8px 0;
}

.login-form .el-input__inner {
  height: 45px;
  line-height: 45px;
  border-radius: 6px;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.login-form .el-input {
  position: relative;
  z-index: 1;
}

.login-form .el-form-item {
  position: relative;
  z-index: 1;
}

.login-buttons {
  margin-top: 30px;
}

.login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;
}

.login-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #909399;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
  cursor: pointer;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #66b1ff;
  text-decoration: underline;
}


.remind {
    border-radius: 4px;
    padding: 10px 20px;
    display: flex;
    position: fixed;
    right: 20px;
    bottom: 50%;
    flex-direction: column;
    color: #606266;
    background-color: #fff;
    border-left: 4px solid #409eff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

//.container {
//    margin-bottom: 32px;
//}

.title-icon {
    font-size: 44px;
    margin-right: 10px;
}

.container .el-radio-group {
    margin: 30px 0px;
}

a:link {
    color: #ff962a;
    text-decoration: none;
}

#login {
    font-size: 14px;
    color: #000;
    background-color: #fff;
}

#login .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow-y: auto;
    height: 100%;
    background: url("../../assets/img/77771.jpg") center top / cover no-repeat;
    background-color: #b6bccdd1 !important;
}

#login .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

#login .main-container .top {
    margin-top: 100px;
    font-size: 30px;
    color: #ff962a;
    display: flex;
    justify-content: center;
}

#login .top .icon-kaoshi {
    font-size: 80px;
}

#login .top .title {
    margin-top: 20px;
}

#login .bottom {
    display: flex;
    justify-content: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#login .bottom .title {
    text-align: center;
    font-size: 30px;
}

.bottom .container .title {
    margin: 30px 0px;
}

.bottom .submit .row-login {
    width: 100%;
    margin: 20px 0px 10px 0px;
    padding: 15px 20px;
    background-color: rgb(133, 174, 191);
    border-color: rgb(133, 174, 191);
    color: white
}

.bottom .submit {
    display: flex;
    justify-content: center;
}

.footer {
    margin-top: 50px;
    text-align: center;
}

.footer .msg1 {
    font-size: 18px;
    color: #fff;
    margin-bottom: 15px;
}

.footer .msg2 {
    font-size: 14px;
    color: #e3e3e3;
    margin-top: 70px;
}

.bottom .options {
    margin-bottom: 40px;
    color: #ff962a;
    display: flex;
    justify-content: space-between;
}

.bottom .options>a {
    color: #ff962a;
}

.bottom .options .register span:nth-child(1) {
    color: #8c8c8c;
}
</style>
