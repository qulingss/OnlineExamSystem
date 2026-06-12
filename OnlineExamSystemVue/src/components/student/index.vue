<template>
  <div class="student-layout">
    <!-- 顶部导航栏 -->
    <header class="main-header">
      <div class="header-container">
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <i class="el-icon-s-platform"></i>
            </div>
            <div class="logo-text">
              <h1 class="logo-title">在线考试系统</h1>
              <p class="logo-subtitle">学生端</p>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav-section">
          <div class="nav-container">
            <div
              v-for="item in navItems"
              :key="item.key"
              class="nav-item"
              :class="{ 'active': activeNav === item.key }"
              @click="handleNavClick(item)"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-label">{{ item.label }}</span>
            </div>
          </div>
        </nav>

        <!-- 用户区域 -->
        <div class="user-section">
          <div
            class="user-profile"
            @mouseenter="showUserMenu = true"
            @mouseleave="showUserMenu = false"
          >
            <div class="user-avatar">
              <div class="avatar-circle">
                <span class="avatar-text">{{ getInitial(user.userName) }}</span>
              </div>
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.userName || '学生' }}</span>
              <span class="user-role">学生</span>
            </div>
            <i class="el-icon-arrow-down arrow-icon" :class="{ 'rotated': showUserMenu }"></i>

            <!-- 用户菜单 -->
            <transition name="slide-fade">
              <div
                v-if="showUserMenu"
                class="user-menu"
                @mouseenter="showUserMenu = true"
                @mouseleave="showUserMenu = false"
              >
                <div class="menu-header">
                  <div class="menu-avatar">
                    <div class="menu-avatar-circle">
                      <span class="menu-avatar-text">{{ getInitial(user.userName) }}</span>
                    </div>
                  </div>
                  <div class="menu-user-info">
                    <h3 class="menu-user-name">{{ user.userName || '学生' }}</h3>
                    <p class="menu-user-id">学号: {{ user.studentId || '未知' }}</p>
                  </div>
                </div>

                <div class="menu-divider"></div>

                <div class="menu-items">
                  <div class="menu-item" @click="showUserProfile">
                    <i class="el-icon-user"></i>
                    <span>个人中心</span>
                    <i class="el-icon-right arrow-right"></i>
                  </div>
                  <div class="menu-item" @click="showSettings">
                    <i class="el-icon-setting"></i>
                    <span>系统设置</span>
                    <i class="el-icon-right arrow-right"></i>
                  </div>
                  <div class="menu-item" @click="manage">
                    <i class="el-icon-key"></i>
                    <span>修改密码</span>
                    <i class="el-icon-right arrow-right"></i>
                  </div>
                </div>

                <div class="menu-divider"></div>

                <div class="menu-footer">
                  <div class="menu-item logout-item" @click="exit">
                    <i class="el-icon-switch-button"></i>
                    <span>退出登录</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="content-container">
        <div class="content-wrapper">
          <router-view @pageTitleChange="updatePageTitle"></router-view>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="footer-logo">
              <i class="el-icon-s-platform"></i>
            </div>
            <div class="footer-brand-info">
              <h3 class="footer-brand-title">在线考试系统</h3>
              <p class="footer-brand-desc">智慧教育，成就未来</p>
            </div>
          </div>

          <div class="footer-links">
            <div class="link-column">
              <h4 class="link-title">学习中心</h4>
              <a href="javascript:;" @click="navigateTo('exam')" class="link-item">考试中心</a>
              <a href="javascript:;" @click="navigateTo('practice')" class="link-item">试卷练习</a>
              <a href="javascript:;" @click="navigateTo('score')" class="link-item">成绩查询</a>
            </div>

            <div class="link-column">
              <h4 class="link-title">资源中心</h4>
              <a href="javascript:;" class="link-item">学习资料</a>
              <a href="javascript:;" class="link-item">考试大纲</a>
              <a href="javascript:;" class="link-item">模拟试题</a>
            </div>

            <div class="link-column">
              <h4 class="link-title">帮助中心</h4>
              <a href="javascript:;" class="link-item">操作指南</a>
              <a href="javascript:;" class="link-item">常见问题</a>
              <a href="javascript:;" class="link-item">联系我们</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'StudentLayout',
  data() {
    return {
      showUserMenu: false,
      activeNav: 'exam',
      currentPageTitle: '考试中心',
      user: {
        userName: '',
        studentId: ''
      },
      navItems: [
        {
          key: 'exam',
          label: '考试中心',
          icon: 'el-icon-s-opportunity',
          path: '/student',
          action: () => {
            let isPractice = false;
            this.$store.commit("practice", isPractice);
            this.$router.push({ path: "/student" });
          }
        },
        {
          key: 'practice',
          label: '试卷练习',
          icon: 'el-icon-edit',
          path: '/startExam',
          action: () => {
            let isPractice = true;
            this.$store.commit("practice", isPractice);
            this.$router.push({ path: "/startExam" });
          }
        },
        {
          key: 'score',
          label: '我的成绩',
          icon: 'el-icon-data-line',
          path: '/scoreTable',
          action: () => {
            this.$router.push({ path: "/scoreTable" });
          }
        },
        {
          key: 'message',
          label: '消息中心',
          icon: 'el-icon-chat-line-round',
          path: '/message',
          action: () => {
            this.$router.push({ path: "/message" });
          }
        },
        {
          key: 'selectCourse',
          label: '课程选择',
          icon: 'el-icon-collection',
          path: '/selectCourse',
          action: () => {
            this.$router.push({ path: "/selectCourse" });
          }
        }
      ]
    };
  },

  created() {
    this.userInfo();
    this.determineActiveNav();
    this.checkStudentCourses();
  },
  watch: {
    '$route'(to) {
      this.determineActiveNav();
    }
  },
  computed: {
    ...mapState(["isPractice"])
  },
  methods: {
    getInitial(name) {
      if (!name) return 'S';
      return name.charAt(0).toUpperCase();
    },

    userInfo() {
      let studentName = this.$cookies.get("cname");
      let studentId = this.$cookies.get("rb_student_id");
      this.user.userName = studentName || '学生';
      this.user.studentId = studentId || '未知';
    },

    determineActiveNav() {
      const routeName = this.$route.name;
      if (routeName === 'student') this.activeNav = 'exam';
      else if (routeName === 'startExam' && this.isPractice) this.activeNav = 'practice';
      else if (routeName === 'scoreTable') this.activeNav = 'score';
      else if (routeName === 'message') this.activeNav = 'message';
      else if (routeName === 'selectCourse') this.activeNav = 'selectCourse';
      else this.activeNav = '';
    },

    handleNavClick(item) {
      this.activeNav = item.key;
      this.currentPageTitle = item.label;
      item.action();
    },

    navigateTo(navKey) {
      const item = this.navItems.find(i => i.key === navKey);
      if (item) {
        this.handleNavClick(item);
      }
    },

    updatePageTitle(title) {
      if (title) {
        this.currentPageTitle = title;
      }
    },

    refreshPage() {
      this.$message.success('页面已刷新');
      this.$router.go(0);
    },

    showUserProfile() {
      this.$message.info('个人中心功能开发中');
      this.showUserMenu = false;
    },

    showSettings() {
      this.$message.info('系统设置功能开发中');
      this.showUserMenu = false;
    },

    exit() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'logout-confirm-dialog'
      }).then(() => {
        const cookies = ['cname', 'cid', 'rb_token', 'rb_role'];
        cookies.forEach(cookie => this.$cookies.remove(cookie));

        this.$router.push({ path: "/" });

        this.$message({
          type: 'success',
          message: '已退出登录'
        });
      }).catch(() => {
        this.showUserMenu = false;
      });
    },

    manage() {
      this.showUserMenu = false;
      this.$router.push({ path: "/manager" });
    },

    // 检查学生是否已选课程，如果没有选课程则跳转到选课页面
    async checkStudentCourses() {
      // 如果当前已经在选课页面，不需要检查
      if (this.$route.path === '/selectCourse' || this.$route.name === 'selectCourse') {
        return;
      }

      try {
        const res = await this.$axios.get('/student/courses');
        if (res.data.code === 200) {
          const courses = res.data.data || [];
          // 如果没有选任何课程，跳转到选课页面
          if (courses.length === 0) {
            this.$message({
              message: '您还没有选择任何课程，请先选课',
              type: 'warning',
              duration: 3000
            });
            // 延迟一下再跳转，让用户看到提示
            setTimeout(() => {
              this.$router.push({ path: '/selectCourse' });
            }, 500);
          }
        }
      } catch (error) {
        // 如果请求失败，不阻止用户正常使用系统
        console.error('检查学生课程失败:', error);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@primary-color: #7C3AED;
@primary-light: #A78BFA;
@secondary-color: #10B981;
@danger-color: #EF4444;
@warning-color: #F59E0B;
@info-color: #3B82F6;
@text-primary: #1F2937;
@text-secondary: #6B7280;
@border-color: #E5E7EB;
@bg-color: #F9FAFB;
@card-bg: #FFFFFF;
@shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
@shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
@shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

.student-layout {
  min-height: 100vh;
  background-color: @bg-color;
  display: flex;
  flex-direction: column;
}

.main-header {
  background: linear-gradient(135deg, @primary-color, @primary-light);
  box-shadow: @shadow-md;
  position: sticky;
  top: 0;
  z-index: 1000;

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 70px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
}

.logo-section {
  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 24px;
        color: white;
      }
    }

    .logo-text {
      .logo-title {
        font-size: 20px;
        font-weight: 700;
        color: white;
        margin: 0;
        line-height: 1.2;
      }

      .logo-subtitle {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        margin: 2px 0 0 0;
        letter-spacing: 0.5px;
      }
    }
  }
}

.nav-section {
  flex: 1;
  display: flex;
  justify-content: center;

  .nav-container {
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 4px;

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      &.active {
        color: white;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));

        .nav-icon {
          background: white;
          color: @primary-color;
        }
      }

      .nav-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
        font-size: 16px;
      }

      .nav-label {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
      }
    }
  }
}

.user-section {
  position: relative;

  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: rgba(255, 255, 255, 0.1);

      .arrow-icon {
        color: white;
      }
    }

    .user-avatar {
      .avatar-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, white, #f0f0f0);
        display: flex;
        align-items: center;
        justify-content: center;
        color: @primary-color;
        font-weight: 700;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;

      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: white;
      }

      .user-role {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .arrow-icon {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;

      &.rotated {
        transform: rotate(180deg);
        color: white;
      }
    }

    .user-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 280px;
      background-color: @card-bg;
      border-radius: 12px;
      box-shadow: @shadow-lg;
      overflow: hidden;
      z-index: 1000;

      .menu-header {
        padding: 20px;
        background: linear-gradient(135deg, @primary-color, @primary-light);

        .menu-avatar {
          margin-bottom: 12px;

          .menu-avatar-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 24px;
            margin: 0 auto;
          }
        }

        .menu-user-info {
          text-align: center;

          .menu-user-name {
            color: white;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 4px 0;
          }

          .menu-user-id {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
          }
        }
      }

      .menu-divider {
        height: 1px;
        background-color: @border-color;
        margin: 0;
      }

      .menu-items {
        padding: 12px 0;

        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: @text-primary;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 12px;

          &:hover {
            background-color: @bg-color;
            color: @primary-color;

            .arrow-right {
              transform: translateX(3px);
            }
          }

          i:first-child {
            width: 20px;
            text-align: center;
            color: @text-secondary;
          }

          span {
            flex: 1;
            font-size: 14px;
          }

          .arrow-right {
            font-size: 12px;
            color: @primary-color;
            transition: transform 0.2s ease;
          }
        }
      }

      .menu-footer {
        padding: 8px 0;

        .logout-item {
          color: @danger-color;

          &:hover {
            background-color: rgba(@danger-color, 0.05);
            color: @danger-color;

            i:first-child {
              color: @danger-color;
            }
          }

          i:first-child {
            color: @danger-color;
          }
        }
      }
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.main-content {
  flex: 1;
  padding: 2rem;

  .content-container {
    max-width: 1400px;
    margin: 0 auto;

    .content-wrapper {
      background-color: @card-bg;
      border-radius: 12px;
      box-shadow: @shadow-sm;
      overflow: hidden;
      min-height: 500px;
    }
  }
}

.main-footer {
  background-color: @card-bg;
  border-top: 1px solid @border-color;
  padding: 2.5rem 0 1.5rem;
  margin-top: auto;

  .footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .footer-main {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    .footer-brand {
      flex: 0 0 300px;

      .footer-logo {
        margin-bottom: 12px;

        i {
          font-size: 32px;
          color: @primary-color;
        }
      }

      .footer-brand-info {
        .footer-brand-title {
          font-size: 20px;
          font-weight: 700;
          color: @text-primary;
          margin: 0 0 4px 0;
        }

        .footer-brand-desc {
          font-size: 14px;
          color: @text-secondary;
          margin: 0;
        }
      }
    }

    .footer-links {
      display: flex;
      gap: 3rem;

      .link-column {
        .link-title {
          font-size: 16px;
          font-weight: 600;
          color: @text-primary;
          margin: 0 0 16px 0;
        }

        .link-item {
          display: block;
          color: @text-secondary;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 8px;
          transition: color 0.3s ease;
          cursor: pointer;

          &:hover {
            color: @primary-color;
          }
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .nav-section .nav-container .nav-item .nav-label {
    display: none;
  }

  .nav-section .nav-container .nav-item {
    padding: 8px 12px;
  }
}

@media (max-width: 768px) {
  .main-header .header-container {
    padding: 0 1rem;
  }

  .logo-section .logo-wrapper .logo-text .logo-subtitle {
    display: none;
  }

  .main-content {
    padding: 1rem;
  }

  .footer-main {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 2rem !important;
  }
}

@media (max-width: 640px) {
  .user-section .user-profile .user-info {
    display: none;
  }

  .nav-section .nav-container {
    gap: 2px;
  }

  .footer-links {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

<style>
/* 退出确认对话框样式 */
.logout-confirm-dialog {
  .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: #EF4444;
  }
}
</style>