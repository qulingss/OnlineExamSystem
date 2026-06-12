<template>
  <header id="topbar">
    <!-- 修改密码对话框 -->
    <el-dialog
      :append-to-body="true"
      title="修改密码"
      :visible.sync="dialogVisible"
      width="400px"
      custom-class="reset-password-dialog"
    >
      <el-form
        ref="ruleForm2"
        label-width="100px"
        class="reset-password-form"
      >
        <el-form-item label="旧密码" prop="pass">
          <el-input
            type="password"
            v-model="oldPsw"
            placeholder="请输入当前密码"
            autocomplete="off"
            size="medium"
            class="password-input"
          >
            <template #prefix>
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="newPsw"
            placeholder="请输入新密码"
            autocomplete="off"
            size="medium"
            class="password-input"
          >
            <template #prefix>
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="confirmNewPsw"
            placeholder="请再次输入新密码"
            autocomplete="off"
            size="medium"
            class="password-input"
          >
            <template #prefix>
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button
                  @click="dialogVisible = false"
                  class="cancel-btn"
                  size="medium"
                >
                    取消
                </el-button>
                <el-button
                  type="primary"
                  @click="resetPsw"
                  class="confirm-btn"
                  size="medium"
                >
                    确定
                </el-button>
            </span>
    </el-dialog>

    <div class="topbar-container">
      <div class="topbar-left">
        <div class="logo">
          <img src="../../assets/img/考试.png" alt="系统logo" class="logo-img">
        </div>
        <div class="system-info">
          <h1 class="system-title">在线考试系统</h1>
          <p class="welcome-text">欢迎回来，{{ user.userName || '管理员' }}</p>
        </div>
      </div>

      <div class="topbar-right">
        <div class="user-info" @click="showSetting">
          <div class="user-avatar">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ user.userName || '管理员' }}</div>
            <div class="user-role">{{ getRoleName() }}</div>
          </div>
          <i class="el-icon-arrow-down user-arrow" :class="{ 'rotate': login_flag }"></i>
        </div>

        <transition name="fade">
          <div class="user-menu" v-show="login_flag" ref="userMenu">
            <ul>
              <li>
                <a @click="showPasswordDialog" href="javascript:;">
                  <i class="el-icon-lock"></i>
                  <span>修改密码</span>
                </a>
              </li>
              <li class="logout-item" @click="exit">
                <a href="javascript:;">
                  <i class="el-icon-switch-button"></i>
                  <span>退出登录</span>
                </a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      login_flag: false,
      user: {
        userName: null,
        userId: null,
      },
      dialogVisible: false,
      oldPsw: "",
      newPsw: "",
      confirmNewPsw: "",
      role: 0,
    };
  },
  created() {
    this.getUserInfo();
    this.role = this.$cookies.get("rb_role");

    // 点击页面其他地方关闭用户菜单
    document.addEventListener('click', this.closeMenuOnClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeMenuOnClickOutside);
  },
  computed: {
    ...mapState(["flag", "menu"]),
  },
  methods: {
    resetPsw() {
      if (!this.oldPsw) {
        this.$message.warning('请输入旧密码');
        return;
      }
      if (!this.newPsw) {
        this.$message.warning('请输入新密码');
        return;
      }
      if (this.confirmNewPsw !== this.newPsw) {
        this.$message.error('两次输入的新密码不一致');
        return;
      }
      if (this.newPsw.length < 6) {
        this.$message.warning('新密码长度不能少于6位');
        return;
      }

      this.$axios(
        `/admin/resetPsw/${this.user.userId}/${this.oldPsw}/${this.newPsw}`
      ).then((res) => {
        let status = res.data.code;
        if (status == 200) {
          if (res.data.data !== true) {
            this.$message.error(res.data.data);
          } else {
            this.$message({
              message: '密码修改成功',
              type: 'success',
              duration: 2000
            });
            this.dialogVisible = false;
            this.oldPsw = "";
            this.newPsw = "";
            this.confirmNewPsw = "";
          }
        }
      }).catch(error => {
        console.error('修改密码失败:', error);
        this.$message.error('修改密码失败，请稍后重试');
      });
    },

    showPasswordDialog() {
      this.dialogVisible = true;
      this.login_flag = false;
    },

    showSetting(event) {
      event.stopPropagation();
      this.login_flag = !this.login_flag;
    },

    closeMenuOnClickOutside(event) {
      const userInfo = this.$el.querySelector('.user-info');
      const userMenu = this.$refs.userMenu;

      if (userInfo && !userInfo.contains(event.target) &&
        userMenu && !userMenu.contains(event.target)) {
        this.login_flag = false;
      }
    },

    ...mapMutations(["toggle"]),

    getUserInfo() {
      let userName = this.$cookies.get("cname");
      let userId = this.$cookies.get("rb_teacher_id") || this.$cookies.get("rb_student_id");
      this.user.userName = userName;
      this.user.userId = userId;
    },

    getRoleName() {
      const roleMap = {
        0: '超级管理员',
        1: '教师',
        2: '学生'
      };
      return roleMap[this.role] || '用户';
    },

    exit() {
      this.login_flag = false;

      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'logout-confirm-dialog'
      }).then(() => {
        let role = this.$cookies.get("rb_role");

        // 清除所有cookies
        this.$cookies.remove("cname");
        this.$cookies.remove("rb_teacher_id");
        this.$cookies.remove("rb_student_id");
        this.$cookies.remove("rb_role");
        this.$cookies.remove("rb_token");
        this.$cookies.remove("rb_role");

        if (role == 0) {
          this.menu.pop();
        }

        this.$router.push({ path: "/" });

        this.$message({
          message: '已安全退出',
          type: 'success',
          duration: 1500
        });
      }).catch(() => {});
    }
  },
};
</script>

<style lang="less" scoped>
@primary-color: #7C3AED;
@primary-light: #A78BFA;
@secondary-color: #10B981;
@danger-color: #EF4444;
@text-primary: #1F2937;
@text-white: #FFFFFF;
@text-light: #9CA3AF;
@bg-dark: #1F2937;
@bg-darker: #111827;
@border-color: #374151;
@shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
@shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
@shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

#topbar {
  background: linear-gradient(135deg, @primary-color, @primary-light);
  height: 80px;
  color: @text-white;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  position: relative;
  z-index: 1000;
}

.topbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;

  .logo {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .logo-img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
  }

  .system-info {
    .system-title {
      font-size: 24px;
      font-weight: 700;
      color: @text-white;
      margin: 0 0 4px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .welcome-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-weight: 400;
    }
  }
}

.topbar-right {
  position: relative;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 200px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, @text-white, @text-light);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid @text-white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      i {
        font-size: 24px;
        color: @primary-color;
      }
    }

    .user-details {
      flex: 1;
      min-width: 0;

      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: @text-white;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 8px;
        border-radius: 10px;
        display: inline-block;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }

    .user-arrow {
      font-size: 16px;
      color: @text-white;
      transition: transform 0.3s ease;

      &.rotate {
        transform: rotate(180deg);
      }
    }
  }

  .user-menu {
    position: absolute;
    top: 80px;
    right: 0;
    background: @text-white;
    border-radius: 12px;
    box-shadow: @shadow-lg;
    min-width: 200px;
    z-index: 1000;
    border: 1px solid @border-color;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      top: -8px;
      right: 20px;
      width: 16px;
      height: 16px;
      background: @text-white;
      transform: rotate(45deg);
      border-top: 1px solid @border-color;
      border-left: 1px solid @border-color;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 8px 0;

      li {
        margin: 0;

        a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: @text-primary;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;

          i {
            font-size: 18px;
            color: @primary-color;
          }

          &:hover {
            background: #f8f9fa;
            color: @primary-color;

            i {
              color: @primary-light;
            }
          }
        }

        &.logout-item {
          border-top: 1px solid #f0f0f0;
          margin-top: 4px;

          a:hover {
            color: @danger-color;

            i {
              color: @danger-color;
            }
          }
        }
      }
    }
  }
}

// 过渡动画
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
  transform-origin: top center;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<style>
/* 修改密码对话框样式 */
.reset-password-dialog {
  border-radius: 12px;

  .el-dialog__header {
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 20px;

    .el-dialog__title {
      color: #1F2937;
      font-weight: 600;
      font-size: 20px;
    }
  }

  .el-dialog__body {
    padding: 30px;

    .reset-password-form {
      .password-input {
        .el-input__inner {
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          transition: all 0.3s;

          &:focus {
            border-color: #7C3AED;
            box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
          }
        }

        .el-input__prefix {
          .el-icon-lock {
            color: #9CA3AF;
          }
        }
      }
    }
  }

  .el-dialog__footer {
    border-top: 1px solid #E5E7EB;
    padding: 20px;

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      .cancel-btn {
        background: #F3F4F6;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        color: #6B7280;
        font-weight: 500;

        &:hover {
          background: #E5E7EB;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }

      .confirm-btn {
        background: linear-gradient(135deg, #7C3AED, #A78BFA);
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: 500;
        color: white;

        &:hover {
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }
      }
    }
  }
}

/* 退出确认对话框样式 */
.logout-confirm-dialog {
  .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: #EF4444;
  }
}
</style>
