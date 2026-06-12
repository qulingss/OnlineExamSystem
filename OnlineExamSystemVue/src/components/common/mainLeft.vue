<template>
  <div id="left" :class="{ 'collapsed': flag }">
    <!-- 导航栏头部 -->
    <div class="nav-header">
      <div class="logo" @click="toggleCollapse">
        <i class="el-icon-s-platform" v-if="!flag"></i>
        <i class="el-icon-s-management" v-else></i>
      </div>
      <div class="system-name" v-if="!flag">
        考试管理系统
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      :collapse="flag"
      background-color="#1F2937"
      text-color="#FFFFFF"
      active-text-color="#7C3AED"
      router
    >
      <el-submenu v-for="(item,index) in menu" :index='item.index' :key="index">
        <template slot="title">
          <div class="menu-item-wrapper">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title" class="title" v-if="!flag">{{item.title}}</span>
          </div>
        </template>
        <el-menu-item-group v-for="(list,index1) in item.content" :key="index1">
          <el-menu-item
            @click="handleTitle(item.index)"
            :index="list.path"
            v-if="list.item1 != null"
            class="submenu-item"
          >
            <i :class="list.icon" class="submenu-icon"></i>
            <span class="submenu-text">{{list.item1}}</span>
          </el-menu-item>
          <el-menu-item
            @click="handleTitle(item.index)"
            :index="list.path"
            v-if="list.item2 != null"
            class="submenu-item"
          >
            <i :class="list.icon" class="submenu-icon"></i>
            <span class="submenu-text">{{list.item2}}</span>
          </el-menu-item>
          <el-menu-item
            @click="handleTitle(item.index)"
            :index="list.path"
            v-if="list.item3 != null"
            class="submenu-item"
          >
            <i :class="list.icon" class="submenu-icon"></i>
            <span class="submenu-text">{{list.item3}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>

    <!-- 底部折叠按钮 -->
    <div class="nav-footer" v-if="!flag">
      <div class="collapse-btn" @click="toggleCollapse">
        <i class="el-icon-s-fold"></i>
        <span>收起菜单</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "mainLeft",
  data() {
    return {}
  },
  computed: {
    ...mapState(["flag","menu"])
  },
  created() {
    this.addData()
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    //点击标题传递参数给navigator组件
    handleTitle(index) {
      this.bus.$emit('sendIndex',index)
    },
    addData() {
      let role = this.$cookies.get("rb_role")
      if(role == "0") {
        this.menu.push({
          index: '5',
          title: '教师管理',
          icon: 'icon-r-user3',
          content:[
            {item1:'教师管理', path:'/teacherManage', icon:"el-icon-user-solid"},
            {item2: '添加教师', path: '/addTeacher', icon:"el-icon-circle-plus"}
          ],
        })
      }
    },
    toggleCollapse() {
      this.$store.commit("setFlag")
    }
  },
}
</script>

<style lang="less" scoped>
@primary-color: #7C3AED;
@primary-light: #A78BFA;
@text-white: #FFFFFF;
@bg-dark: #1F2937;
@bg-darker: #111827;
@border-color: #374151;

#left {
  width: 260px;
  /* 跟随主容器高度，避免比右侧内容更长；topbar 约 80px */
  height: calc(100vh - 80px);
  min-height: calc(100vh - 80px);
  background: @bg-dark;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: relative;

  &.collapsed {
    width: 64px;

    .nav-header {
      .system-name {
        opacity: 0;
        width: 0;
      }
    }

    .nav-footer {
      display: none;
    }
  }

  // 导航栏头部
  .nav-header {
    padding: 20px 16px;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;

    .logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, @primary-color, @primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;

      i {
        font-size: 20px;
        color: @text-white;
      }
    }

    .system-name {
      font-size: 18px;
      font-weight: 700;
      color: @text-white;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
  }

  // 导航菜单
  .el-menu-vertical-demo {
    flex: 1;
    border-right: none;
    padding: 8px 0;

    &:not(.el-menu--collapse) {
      width: 260px;
    }

    &.el-menu--collapse {
      width: 64px;
    }

    /deep/ .el-submenu__title,
    /deep/ .el-menu-item {
      height: 48px;
      line-height: 48px;
      border-radius: 8px;
      margin: 4px 12px;
      transition: all 0.3s ease;
      border: none;

      &:hover {
        background-color: #374151 !important;
        color: @text-white !important;

        .iconfont,
        .title,
        .submenu-icon,
        .submenu-text {
          color: @text-white !important;
        }
      }

      &.is-active {
        background: linear-gradient(135deg, @primary-color, @primary-light) !important;
        color: @text-white !important;

        .iconfont,
        .title,
        .submenu-icon,
        .submenu-text {
          color: @text-white !important;
        }
      }
    }

    /deep/ .el-submenu__title {
      .iconfont {
        margin-right: 12px;
        font-size: 20px;
        color: #9CA3AF;
        transition: all 0.3s ease;
      }
    }

    /deep/ .el-submenu .el-menu {
      background-color: @bg-darker;

      .el-menu-item {
        &.is-active {
          background: linear-gradient(135deg, @primary-color, @primary-light) !important;
          box-shadow: 0 2px 8px rgba(@primary-color, 0.3);
        }
      }
    }

    .menu-item-wrapper {
      display: flex;
      align-items: center;
      height: 100%;

      .title {
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        color: #FFFFFF;
      }
    }

    .submenu-item {
      display: flex;
      align-items: center;
      height: 100%;

      .submenu-icon {
        margin-right: 12px;
        font-size: 16px;
        color: #9CA3AF;
        transition: all 0.3s ease;
      }

      .submenu-text {
        font-size: 13px;
        font-weight: 400;
        transition: all 0.3s ease;
        color: #FFFFFF;
      }
    }
  }

  // 底部折叠按钮
  .nav-footer {
    padding: 16px;
    border-top: 1px solid @border-color;

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 12px;
      background: @bg-darker;
      border-radius: 8px;
      border: 1px solid @border-color;
      color: @text-white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: @primary-color;
        background: rgba(@primary-color, 0.1);
        transform: translateY(-2px);
      }

      i {
        font-size: 18px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  #left {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 2000;

    &.collapsed {
      transform: translateX(0);
      width: 64px;
    }

    &:not(.collapsed) {
      transform: translateX(0);
      width: 260px;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>

<style>
/* 修复下拉菜单的全局样式 */
.el-menu--popup {
  background-color: #1F2937 !important;
  border: 1px solid #374151;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  padding: 4px !important;
}

.el-menu--popup .el-menu-item {
  color: #9CA3AF !important;
  background-color: transparent !important;
  border-radius: 6px !important;
  margin: 2px 0 !important;
}

.el-menu--popup .el-menu-item:hover {
  background-color: #374151 !important;
  color: white !important;
}

.el-menu--popup .el-menu-item.is-active {
  background: linear-gradient(135deg, #7C3AED, #A78BFA) !important;
  color: white !important;
}
</style>
