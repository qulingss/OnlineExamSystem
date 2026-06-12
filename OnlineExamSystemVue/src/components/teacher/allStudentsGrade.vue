<template>
  <div class="student-management-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">学生管理</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>学生列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getStudentGrade"
              class="refresh-btn"
              size="medium"
            >
              刷新列表
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total-icon">
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalStudents }}</span>
          <span class="stat-label">总学生数</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon institute-icon">
          <i class="el-icon-office-building"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.instituteCount }}</span>
          <span class="stat-label">学院数量</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon major-icon">
          <i class="el-icon-suitcase"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.majorCount }}</span>
          <span class="stat-label">专业数量</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon grade-icon">
          <i class="el-icon-collection"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.gradeCount }}</span>
          <span class="stat-label">年级数量</span>
        </div>
      </div>
    </div>

    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="card-header">
        <i class="el-icon-search card-icon"></i>
        <h3 class="card-title">学生搜索</h3>
      </div>
      <div class="card-content">
        <el-form :model="condition" label-width="80px" class="search-form">
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="姓名" class="form-item">
                <el-input
                  v-model="condition.name"
                  placeholder="请输入学生姓名"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-user"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="学院" class="form-item">
                <el-input
                  v-model="condition.institute"
                  placeholder="请输入学院名称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-office-building"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="专业" class="form-item">
                <el-input
                  v-model="condition.major"
                  placeholder="请输入专业名称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-suitcase"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="年级" class="form-item">
                <el-input
                  v-model="condition.grade"
                  placeholder="请输入年级"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-collection"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="班级" class="form-item">
                <el-input
                  v-model="condition.clazz"
                  placeholder="请输入班级"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-school"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="联系方式" class="form-item">
                <el-input
                  v-model="condition.tel"
                  placeholder="请输入联系方式"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-phone"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form-actions">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getStudentGrade"
              class="search-btn"
              size="medium"
            >
              查询
            </el-button>
            <el-button
              type="default"
              icon="el-icon-refresh"
              @click="resetSearch"
              class="reset-btn"
              size="medium"
            >
              重置
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 学生列表表格 -->
    <div class="student-table-container">
      <div class="table-header">
        <h3 class="table-title">
          <i class="el-icon-user-solid table-title-icon"></i>
          学生列表
        </h3>
        <div class="table-actions">
          <span class="total-text">共 {{ pagination.total || 0 }} 名学生</span>
        </div>
      </div>

      <div class="table-wrapper">
        <el-table
          :data="(pagination.records || pagination.list || [])"
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-background="rgba(255, 255, 255, 0.8)"
          class="custom-table"
          style="width: 100%"
          :header-cell-style="headerCellStyle"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="studentName"
            label="姓名"
            width="180"
            sortable
            fixed="left"
          >
            <template slot-scope="scope">
              <div class="student-cell">
                <div class="student-avatar-wrapper">
                  <div class="student-avatar">
                    {{ scope.row.studentName ? scope.row.studentName.charAt(0) : '?' }}
                  </div>
                </div>
                <div class="student-info">
                  <span class="student-name">{{ scope.row.studentName }}</span>
                  <span class="student-id">ID: {{ scope.row.studentId || '--' }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="institute"
            label="学院"
            width="200"
          >
            <template slot-scope="scope">
              <div class="institute-cell">
                <div class="institute-icon">
                  <i class="el-icon-office-building"></i>
                </div>
                <div class="institute-name">
                  {{ scope.row.institute || '未分配' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="major"
            label="专业"
            width="220"
          >
            <template slot-scope="scope">
              <div class="major-cell">
                <div class="major-tag">
                  {{ scope.row.major || '未分配' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="grade"
            label="年级"
            width="100"
          >
            <template slot-scope="scope">
              <div class="grade-cell">
                <el-tag class="grade-tag">
                  {{ scope.row.grade || '--' }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="clazz"
            label="班级"
            width="120"
          >
            <template slot-scope="scope">
              <div class="class-cell">
                <div class="class-badge">
                  {{ scope.row.clazz || '未分班' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="sex"
            label="性别"
            width="100"
          >
            <template slot-scope="scope">
              <div class="gender-cell">
                <div :class="['gender-badge', scope.row.sex === '男' ? 'male' : 'female']">
                  <i :class="scope.row.sex === '男' ? 'el-icon-male' : 'el-icon-female'"></i>
                  {{ scope.row.sex || '未知' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="tel"
            label="联系方式"
            width="160"
          >
            <template slot-scope="scope">
              <div class="contact-cell">
                <div class="contact-icon">
                  <i class="el-icon-phone"></i>
                </div>
                <div class="contact-number">
                  {{ scope.row.tel || '未登记' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="140"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <div class="action-buttons">
                <el-tooltip content="查看成绩" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-tickets"
                    size="small"
                    circle
                    @click="checkGrade(scope.row.studentId)"
                    class="grade-btn"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="查看详情" placement="top">
                  <el-button
                    type="info"
                    icon="el-icon-view"
                    size="small"
                    circle
                    @click="viewStudentDetails(scope.row)"
                    class="view-btn"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading && (!((pagination.records || pagination.list) && (pagination.records || pagination.list).length))" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-user empty-icon"></i>
            <p class="empty-title">暂无学生数据</p>
            <p class="empty-desc">当前没有学生记录，请检查查询条件</p>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="resetSearch"
              class="empty-btn"
            >
              重置查询
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[6, 10, 20, 50]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          background
          class="custom-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        current: 1,
        total: null,
        size: 6
      },
      loading: false,
      condition: {
        name: "",
        tel: "",
        grade: "",
        clazz: "",
        major: "",
        institute: ""
      },
      stats: {
        totalStudents: 0,
        instituteCount: 0,
        majorCount: 0,
        gradeCount: 0
      }
    }
  },
  created() {
    this.getStudentGrade()
  },
  methods: {
    async getStudentGrade() {
      this.loading = true

      // 处理查询条件
      const name = this.condition.name.trim() || "@"
      const grade = this.condition.grade.trim() || "@"
      const tel = this.condition.tel.trim() || "@"
      const institute = this.condition.institute.trim() || "@"
      const major = this.condition.major.trim() || "@"
      const clazz = this.condition.clazz.trim() || "@"

      try {
        const response = await this.$axios(
          `/students/${this.pagination.current}/${this.pagination.size}/${name}/${grade}/${tel}/${institute}/${major}/${clazz}`
        )
        const data = (response && response.data && response.data.data) ? response.data.data : {}
        this.pagination = {
          ...data,
          records: Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : [])
        }
        this.updateStats()
      } catch (error) {
        console.error('获取学生列表失败:', error)
        this.$message.error('获取学生列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    updateStats() {
      const records = this.pagination.records || this.pagination.list || []
      this.stats.totalStudents = this.pagination.total || 0

      // 使用对象去重统计
      const instituteObj = {}
      const majorObj = {}
      const gradeObj = {}

      records.forEach(item => {
        if (item.institute) instituteObj[item.institute] = true
        if (item.major) majorObj[item.major] = true
        if (item.grade) gradeObj[item.grade] = true
      })

      this.stats.instituteCount = Object.keys(instituteObj).length
      this.stats.majorCount = Object.keys(majorObj).length
      this.stats.gradeCount = Object.keys(gradeObj).length
    },

    resetSearch() {
      this.condition = {
        name: "",
        tel: "",
        grade: "",
        clazz: "",
        major: "",
        institute: ""
      }
      this.pagination.current = 1
      this.getStudentGrade()
    },

    handleSizeChange(val) {
      this.pagination.size = val
      this.getStudentGrade()
    },

    handleCurrentChange(val) {
      this.pagination.current = val
      this.getStudentGrade()
    },

    checkGrade(studentId) {
      this.$router.push({
        path: "/grade",
        query: { studentId: studentId }
      })
    },

    viewStudentDetails(row) {
      this.$message({
        title: '学生详情',
        message: `姓名：${row.studentName}\n学号：${row.studentId}\n学院：${row.institute}\n专业：${row.major}\n年级：${row.grade}\n班级：${row.clazz}\n性别：${row.sex}\n电话：${row.tel}`,
        type: 'info',
        duration: 3000
      })
    },

    headerCellStyle() {
      return {
        backgroundColor: '#f8f9fa',
        color: '#495057',
        fontWeight: '600',
        fontSize: '14px',
        borderBottom: '2px solid #e9ecef'
      }
    },

    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 === 1 ? 'even-row' : 'odd-row'
    }
  }
}
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

.student-management-container {
  padding: 24px;
  background-color: @bg-color;
  min-height: calc(100vh - 64px);
}

// 页面头部
.page-header {
  margin-bottom: 24px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-left {
      .page-title {
        font-size: 24px;
        font-weight: 700;
        color: @text-primary;
        margin: 0 0 8px 0;
      }

      .breadcrumb {
        /deep/ .el-breadcrumb__inner {
          color: @text-secondary;
          font-size: 13px;

          &.is-link {
            color: @primary-color;
          }
        }
      }
    }

    .header-right {
      .header-actions {
        .refresh-btn {
          background: linear-gradient(135deg, @info-color, #60A5FA);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@info-color, 0.3);
          }
        }
      }
    }
  }
}

// 统计卡片
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .stat-card {
    background: @card-bg;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: @shadow-sm;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: @shadow-md;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 24px;
        color: white;
      }

      &.total-icon {
        background: linear-gradient(135deg, @primary-color, @primary-light);
      }

      &.institute-icon {
        background: linear-gradient(135deg, @secondary-color, #34D399);
      }

      &.major-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
      }

      &.grade-icon {
        background: linear-gradient(135deg, @danger-color, #F87171);
      }
    }

    .stat-info {
      flex: 1;

      .stat-value {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: @text-primary;
        line-height: 1.2;
      }

      .stat-label {
        display: block;
        font-size: 14px;
        color: @text-secondary;
      }
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 600;

      &.up {
        color: @secondary-color;
      }

      &.down {
        color: @danger-color;
      }

      &.stable {
        color: @warning-color;
      }
    }
  }
}

// 搜索卡片
.search-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  margin-bottom: 24px;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, @primary-color, @primary-light);

    .card-icon {
      font-size: 24px;
      color: white;
      margin-right: 12px;
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin: 0;
    }
  }

  .card-content {
    padding: 24px;

    .search-form {
      .form-row {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;

        .form-column {
          flex: 1;
        }
      }

      .search-input {
        /deep/ .el-input__inner {
          border-radius: 8px;
          border: 1px solid @border-color;
          transition: all 0.3s;

          &:focus {
            border-color: @primary-color;
            box-shadow: 0 0 0 2px rgba(@primary-color, 0.1);
          }
        }
      }

      .form-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        padding-top: 16px;
        border-top: 1px solid @border-color;

        .search-btn {
          background: linear-gradient(135deg, @primary-color, @primary-light);
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-weight: 500;

          &:hover {
            box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
          }
        }

        .reset-btn {
          background: linear-gradient(135deg, @info-color, #60A5FA);
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-weight: 500;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@info-color, 0.3);
          }
        }
      }
    }
  }
}

// 学生表格容器
.student-table-container {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid @border-color;

    .table-title {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .table-title-icon {
        color: @primary-color;
        font-size: 20px;
      }
    }

    .table-actions {
      .total-text {
        font-size: 14px;
        color: @text-secondary;
        font-weight: 500;
      }
    }
  }

  .table-wrapper {
    padding: 0;
    min-height: 400px;

    .custom-table {
      /deep/ .el-table__header-wrapper {
        th {
          background-color: #f8f9fa;

          .cell {
            font-weight: 600;
            color: @text-primary;
          }
        }
      }

      /deep/ .el-table__row {
        &.even-row {
          background-color: #fafbfc;
        }

        &:hover {
          background-color: #f5f7fa;
          cursor: pointer;
        }
      }
    }

    .student-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .student-avatar-wrapper {
        .student-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, @primary-color, @primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }
      }

      .student-info {
        display: flex;
        flex-direction: column;

        .student-name {
          font-weight: 600;
          color: @text-primary;
          line-height: 1.4;
        }

        .student-id {
          font-size: 12px;
          color: @text-secondary;
          margin-top: 2px;
        }
      }
    }

    .institute-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .institute-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: rgba(@secondary-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @secondary-color;
          font-size: 16px;
        }
      }

      .institute-name {
        color: @text-primary;
        font-weight: 500;
      }
    }

    .major-cell {
      .major-tag {
        display: inline-block;
        padding: 6px 12px;
        background: rgba(@warning-color, 0.1);
        color: @warning-color;
        border: 1px solid rgba(@warning-color, 0.2);
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
      }
    }

    .grade-cell {
      .grade-tag {
        background: rgba(@primary-color, 0.1);
        color: @primary-color;
        border: 1px solid rgba(@primary-color, 0.2);
        border-radius: 12px;
        padding: 4px 12px;
        font-weight: 600;
      }
    }

    .class-cell {
      .class-badge {
        display: inline-block;
        padding: 6px 12px;
        background: linear-gradient(135deg, @info-color, #60A5FA);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 60px;
        text-align: center;
      }
    }

    .gender-cell {
      .gender-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 60px;
        justify-content: center;

        &.male {
          background: rgba(@info-color, 0.1);
          color: @info-color;
          border: 1px solid rgba(@info-color, 0.2);
        }

        &.female {
          background: rgba(@danger-color, 0.1);
          color: @danger-color;
          border: 1px solid rgba(@danger-color, 0.2);
        }

        i {
          font-size: 14px;
        }
      }
    }

    .contact-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .contact-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: rgba(@primary-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @primary-color;
          font-size: 16px;
        }
      }

      .contact-number {
        color: @text-primary;
        font-weight: 500;
      }
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 8px;

      .grade-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(@primary-color, 0.3);
        }
      }

      .view-btn {
        background: linear-gradient(135deg, @info-color, #60A5FA);
        border: none;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(@info-color, 0.3);
        }
      }
    }

    .empty-state {
      padding: 60px 20px;
      text-align: center;

      .empty-content {
        .empty-icon {
          font-size: 60px;
          color: #dcdfe6;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 18px;
          color: #909399;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .empty-desc {
          font-size: 14px;
          color: #c0c4cc;
          margin-bottom: 24px;
        }

        .empty-btn {
          padding: 10px 24px;
          border-radius: 8px;
        }
      }
    }
  }

  .pagination-wrapper {
    padding: 20px;
    display: flex;
    justify-content: center;
    border-top: 1px solid @border-color;

    .custom-pagination {
      /deep/ .el-pager li {
        border-radius: 6px;
        margin: 0 4px;

        &.active {
          background: linear-gradient(135deg, @primary-color, @primary-light) !important;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-card {
    .card-content {
      .search-form {
        .form-row {
          flex-direction: column;
          gap: 16px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      gap: 16px;
    }
  }

  .student-table-container {
    .table-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .student-management-container {
    padding: 16px;
  }
}
</style>

