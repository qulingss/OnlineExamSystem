<template>
  <div class="course-selection-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">课程选择</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生中心</el-breadcrumb-item>
            <el-breadcrumb-item>课程选择</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="default"
              icon="el-icon-refresh"
              @click="refreshData"
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
          <i class="el-icon-collection"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalCourses }}</span>
          <span class="stat-label">可选课程</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon selected-icon">
          <i class="el-icon-check"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.selectedCount }}</span>
          <span class="stat-label">已选课程</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon credit-icon">
          <i class="el-icon-coin"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalCredits }}分</span>
          <span class="stat-label">总学分</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teacher-icon">
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.teacherCount }}</span>
          <span class="stat-label">可选教师</span>
        </div>
      </div>
    </div>

    <!-- 警告提示 -->
    <div v-if="selectedCourses.length === 0" class="warning-card">
      <div class="warning-header">
        <i class="el-icon-warning warning-icon"></i>
        <h3 class="warning-title">温馨提示</h3>
      </div>
      <div class="warning-content">
        <p>您还没有选择任何课程，请至少选择一门课程才能参加考试。</p>
        <p>请从下方可选课程列表中选择您要学习的课程。</p>
      </div>
    </div>

    <!-- 已选课程卡片 -->
    <div class="selected-courses-card">
      <div class="card-header">
        <div class="card-header-content">
          <i class="el-icon-collection card-icon"></i>
          <h3 class="card-title">已选课程</h3>
        </div>
        <div class="card-subtitle">
          当前已选 {{ selectedCourses.length }} 门课程，总计 {{ stats.totalCredits }} 学分
        </div>
      </div>

      <div class="card-content">
        <div v-if="selectedCourses.length > 0" class="table-wrapper">
          <el-table
            :data="selectedCourses"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="custom-table"
            style="width: 100%"
            :header-cell-style="headerCellStyle"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              prop="courseName"
              label="课程名称"
              width="180"
            >
              <template slot-scope="scope">
                <div class="course-cell">
                  <div class="course-icon-wrapper">
                    <i class="el-icon-reading"></i>
                  </div>
                  <div class="course-info">
                    <span class="course-name">{{ scope.row.courseName }}</span>
                    <span class="course-code">代码: {{ scope.row.courseCode }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="courseCode"
              label="课程代码"
              width="120"
            >
              <template slot-scope="scope">
                <div class="code-badge">
                  {{ scope.row.courseCode }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="credits"
              label="学分"
              width="80"
              sortable
            >
              <template slot-scope="scope">
                <div class="credit-cell">
                  <div class="credit-badge">
                    {{ scope.row.credits }}分
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="institute"
              label="所属学院"
              width="150"
            >
              <template slot-scope="scope">
                <div class="institute-cell">
                  <el-tag class="institute-tag">
                    {{ scope.row.institute }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="description"
              label="课程描述"
            >
              <template slot-scope="scope">
                <div class="description-cell">
                  {{ scope.row.description || '暂无描述' }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <div class="action-buttons">
                  <el-tooltip content="退课" placement="top">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      circle
                      @click="dropCourse(scope.row.courseId)"
                      class="drop-btn"
                    ></el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else class="empty-state">
          <div class="empty-content">
            <i class="el-icon-collection empty-icon"></i>
            <p class="empty-title">暂无已选课程</p>
            <p class="empty-desc">当前还没有选择任何课程，请从下方选择课程</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 可选课程卡片 -->
    <div class="available-courses-card">
      <div class="card-header">
        <div class="card-header-content">
          <i class="el-icon-tickets card-icon"></i>
          <h3 class="card-title">可选课程</h3>
        </div>
        <div class="card-subtitle">
          请选择课程和对应教师，然后点击选课按钮
        </div>
      </div>

      <div class="card-content">
        <div class="table-wrapper">
          <el-table
            :data="availableCourses"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="custom-table"
            style="width: 100%"
            :header-cell-style="headerCellStyle"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              prop="courseName"
              label="课程名称"
              width="180"
            >
              <template slot-scope="scope">
                <div class="course-cell">
                  <div class="course-icon-wrapper">
                    <i class="el-icon-reading"></i>
                  </div>
                  <div class="course-info">
                    <span class="course-name">{{ scope.row.courseName }}</span>
                    <span class="course-code">代码: {{ scope.row.courseCode }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="courseCode"
              label="课程代码"
              width="120"
            >
              <template slot-scope="scope">
                <div class="code-badge">
                  {{ scope.row.courseCode }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="credits"
              label="学分"
              width="80"
              sortable
            >
              <template slot-scope="scope">
                <div class="credit-cell">
                  <div class="credit-badge">
                    {{ scope.row.credits }}分
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="institute"
              label="所属学院"
              width="150"
            >
              <template slot-scope="scope">
                <div class="institute-cell">
                  <el-tag class="institute-tag">
                    {{ scope.row.institute }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="description"
              label="课程描述"
            >
              <template slot-scope="scope">
                <div class="description-cell">
                  {{ scope.row.description || '暂无描述' }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="选择教师"
              width="220"
            >
              <template slot-scope="scope">
                <div class="teacher-select-cell">
                  <el-select
                    v-model="selectedTeachers[scope.row.courseId]"
                    placeholder="请选择教师"
                    @change="handleTeacherChange(scope.row.courseId, $event)"
                    size="medium"
                    class="teacher-select"
                    clearable
                  >
                    <el-option
                      v-for="teacher in courseTeachers[scope.row.courseId] || []"
                      :key="teacher.teacherId"
                      :label="teacher.teacherName + ' (' + teacher.institute + ')'"
                      :value="teacher.teacherId">
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <div class="action-buttons">
                  <el-tooltip
                    :content="!selectedTeachers[scope.row.courseId] ? '请先选择教师' : '选择课程'"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus"
                      size="small"
                      circle
                      @click="selectCourse(scope.row)"
                      :disabled="!selectedTeachers[scope.row.courseId]"
                      class="select-btn"
                      :class="{ 'disabled': !selectedTeachers[scope.row.courseId] }"
                    ></el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-if="availableCourses.length === 0 && !loading" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-tickets empty-icon"></i>
            <p class="empty-title">暂无可选课程</p>
            <p class="empty-desc">所有课程都已选择，或者当前没有开放选课</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentSelectCourse',
  data() {
    return {
      loading: false,
      allCourses: [],
      selectedCourses: [],
      availableCourses: [],
      courseTeachers: {},
      selectedTeachers: {},
      stats: {
        totalCourses: 0,
        selectedCount: 0,
        totalCredits: 0,
        teacherCount: 0
      }
    }
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    async refreshData() {
      this.loading = true;
      await this.loadSelectedCourses();
      await this.loadAllCourses();
      this.updateStats();
      this.loading = false;
    },

    // 加载已选课程
    async loadSelectedCourses() {
      try {
        const res = await this.$axios.get('/student/courses');
        if (res.data.code === 200) {
          this.selectedCourses = res.data.data || [];
        }
      } catch (error) {
        console.error('加载已选课程失败:', error);
        this.$message.error('加载已选课程失败');
      }
    },

    // 加载所有课程
    async loadAllCourses() {
      try {
        const res = await this.$axios.get('/courses');
        if (res.data.code === 200) {
          this.allCourses = res.data.data || [];
          this.filterAvailableCourses();

          // 为每个课程加载教师列表
          const promises = this.allCourses.map(course =>
            this.loadTeachersForCourse(course.courseId)
          );
          await Promise.all(promises);
        }
      } catch (error) {
        console.error('加载课程列表失败:', error);
        this.$message.error('加载课程列表失败');
      }
    },

    // 过滤可选课程（排除已选课程）
    filterAvailableCourses() {
      const selectedCourseIds = this.selectedCourses.map(c => c.courseId);
      this.availableCourses = this.allCourses.filter(
        course => !selectedCourseIds.includes(course.courseId)
      );
    },

    // 加载某个课程的教师列表
    async loadTeachersForCourse(courseId) {
      try {
        const res = await this.$axios.get(`/course/${courseId}/teachers`);
        if (res.data.code === 200) {
          this.$set(this.courseTeachers, courseId, res.data.data || []);
        }
      } catch (error) {
        console.error(`加载课程 ${courseId} 的教师列表失败`, error);
      }
    },

    // 更新统计信息
    updateStats() {
      this.stats.totalCourses = this.allCourses.length;
      this.stats.selectedCount = this.selectedCourses.length;
      this.stats.totalCredits = this.selectedCourses.reduce((total, course) =>
        total + (parseFloat(course.credits) || 0), 0
      );

      // 计算总教师数
      let teacherCount = 0;
      Object.values(this.courseTeachers).forEach(teachers => {
        teacherCount += teachers.length;
      });
      this.stats.teacherCount = teacherCount;
    },

    // 教师选择变化
    handleTeacherChange(courseId, teacherId) {
      this.$set(this.selectedTeachers, courseId, teacherId);
    },

    // 选课
    async selectCourse(course) {
      const teacherId = this.selectedTeachers[course.courseId];
      if (!teacherId) {
        this.$message.warning('请先选择教师');
        return;
      }

      try {
        const res = await this.$axios.post('/student/course', {
          courseId: course.courseId,
          teacherId: teacherId
        });

        if (res.data.code === 200) {
          this.$message.success('选课成功');
          // 重新加载数据
          await this.loadSelectedCourses();
          this.filterAvailableCourses();
          this.updateStats();
          // 清除选择
          this.$delete(this.selectedTeachers, course.courseId);

          // 如果这是第一门课程，提示学生
          if (this.selectedCourses.length === 1) {
            this.$message({
              message: '恭喜！您已成功选择第一门课程，现在可以参加考试了',
              type: 'success',
              duration: 3000
            });
          }
        } else {
          this.$message.error(res.data.message || '选课失败');
        }
      } catch (error) {
        // 修改这里：将可选链操作符改为传统条件判断
        const errorMsg = (error.response && error.response.data && error.response.data.message) || error.message;
        this.$message.error('选课失败：' + errorMsg);
      }
    },

    // 退课
    async dropCourse(courseId) {
      try {
        await this.$confirm('确定要退选该课程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'delete-confirm-dialog'
        });

        const res = await this.$axios.delete(`/student/course/${courseId}`);
        if (res.data.code === 200) {
          this.$message.success('退课成功');
          // 重新加载数据
          await this.loadSelectedCourses();
          this.filterAvailableCourses();
          this.updateStats();
        } else {
          this.$message.error(res.data.message || '退课失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          // 修改这里：将可选链操作符改为传统条件判断
          const errorMsg = (error.response && error.response.data && error.response.data.message) || error.message;
          this.$message.error('退课失败：' + errorMsg);
        }
      }
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

.course-selection-container {
  padding: 24px;
  background-color: @bg-color;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// 页面头部
.page-header {
  margin-bottom: 0;

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
  margin-bottom: 0;

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

      &.selected-icon {
        background: linear-gradient(135deg, @secondary-color, #7C3AED);
      }

      &.credit-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
      }

      &.teacher-icon {
        background: linear-gradient(135deg, @info-color, #60A5FA);
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
        color: #7C3AED;
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

// 警告卡片
.warning-card {
  background: linear-gradient(135deg, rgba(@warning-color, 0.1), rgba(#FBBF24, 0.05));
  border: 1px solid rgba(@warning-color, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;

  .warning-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .warning-icon {
      font-size: 24px;
      color: @warning-color;
    }

    .warning-title {
      font-size: 18px;
      font-weight: 600;
      color: @warning-color;
      margin: 0;
    }
  }

  .warning-content {
    color: @text-primary;
    line-height: 1.6;

    p {
      margin: 4px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 课程卡片通用样式
.selected-courses-card,
.available-courses-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;
  flex: 1;

  .card-header {
    padding: 24px 30px;
    background: linear-gradient(135deg, @primary-color, @primary-light);
    color: white;

    .card-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .card-icon {
        font-size: 28px;
      }

      .card-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
      }
    }

    .card-subtitle {
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .card-content {
    padding: 30px;
    min-height: 300px;

    .table-wrapper {
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
          }
        }
      }

      .course-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        .course-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: linear-gradient(135deg, @primary-color, @primary-light);
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            color: white;
            font-size: 20px;
          }
        }

        .course-info {
          display: flex;
          flex-direction: column;

          .course-name {
            font-weight: 600;
            color: @text-primary;
            line-height: 1.4;
          }

          .course-code {
            font-size: 12px;
            color: @text-secondary;
            margin-top: 2px;
          }
        }
      }

      .code-badge {
        display: inline-block;
        padding: 6px 12px;
        background: linear-gradient(135deg, @secondary-color, #7C3AED);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 60px;
        text-align: center;
      }

      .credit-cell {
        .credit-badge {
          display: inline-block;
          padding: 6px 12px;
          background: linear-gradient(135deg, @warning-color, #FBBF24);
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          min-width: 50px;
          text-align: center;
        }
      }

      .institute-cell {
        .institute-tag {
          background: rgba(@info-color, 0.1);
          color: @info-color;
          border: 1px solid rgba(@info-color, 0.2);
          border-radius: 12px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 500;
        }
      }

      .description-cell {
        color: @text-secondary;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .teacher-select-cell {
        .teacher-select {
          width: 100%;

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
      }

      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 8px;

        .select-btn {
          background: linear-gradient(135deg, @primary-color, @primary-light);
          border: none;

          &:hover:not(.disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(@primary-color, 0.3);
          }

          &.disabled {
            background: linear-gradient(135deg, #D1D5DB, #9CA3AF);
            cursor: not-allowed;
          }
        }

        .drop-btn {
          background: linear-gradient(135deg, @danger-color, #F87171);
          border: none;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(@danger-color, 0.3);
          }
        }
      }
    }

    .empty-state {
      padding: 40px 20px;
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
        }
      }
    }
  }
}

// 已选课程卡片特定样式
.selected-courses-card {
  .card-header {
    background: linear-gradient(135deg, #7C3AED, #7C3AED);
  }
}

// 可选课程卡片特定样式
.available-courses-card {
  .card-header {
    background: linear-gradient(135deg, @secondary-color, #60A5FA);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      gap: 16px;
    }
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .selected-courses-card,
  .available-courses-card {
    .card-content {
      padding: 20px;
    }
  }
}

@media (max-width: 640px) {
  .course-selection-container {
    padding: 16px;
  }
}
</style>

<style>
/* 删除确认对话框样式 */
.delete-confirm-dialog {
  /deep/ .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: #EF4444;
  }
}
</style>
