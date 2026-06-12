<template>
  <div class="score-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">我的成绩单</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>成绩单</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="default"
              icon="el-icon-refresh"
              @click="getScore"
              class="refresh-btn"
              size="medium"
            >
              刷新成绩
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total-icon">
          <i class="el-icon-notebook-2"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalExams }}</span>
          <span class="stat-label">总考试次数</span>
        </div>
        <div class="stat-trend" :class="getExamTrend">
          <i :class="getExamIcon"></i>
          <span>{{ getExamText }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pass-icon">
          <i class="el-icon-success"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ passRate }}%</span>
          <span class="stat-label">平均通过率</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon score-icon">
          <i class="el-icon-star-off"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ averageScore }}</span>
          <span class="stat-label">平均分数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon grade-icon">
          <i class="el-icon-medal"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ excellentCount }}</span>
          <span class="stat-label">优秀成绩数</span>
        </div>
      </div>
    </div>

    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="card-header">
        <i class="el-icon-search card-icon"></i>
        <h3 class="card-title">成绩筛选</h3>
      </div>
      <div class="card-content">
        <div class="search-form">
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="考试结果" class="form-item">
                <el-radio-group v-model="activeFilter" size="medium" @change="handleFilterChange" class="radio-group">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="passed">仅及格</el-radio-button>
                  <el-radio-button label="failed">仅不及格</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="课程筛选" class="form-item">
                <el-select
                  v-model="selectedSubject"
                  placeholder="请选择课程"
                  clearable
                  size="medium"
                  class="search-input"
                  @change="handleSubjectChange"
                >
                  <el-option
                    v-for="subject in subjectList"
                    :key="subject"
                    :label="subject"
                    :value="subject"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="form-actions">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
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
        </div>
      </div>
    </div>

    <!-- 成绩列表表格 -->
    <div class="score-table-container">
      <div class="table-header">
        <h3 class="table-title">
          <i class="el-icon-document table-title-icon"></i>
          成绩列表
        </h3>
        <div class="table-actions">
          <span class="total-text">共 {{ filteredScore.length }} 条成绩记录</span>
        </div>
      </div>

      <div class="table-wrapper">
        <el-table
          :data="filteredScore"
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-background="rgba(255, 255, 255, 0.8)"
          class="custom-table"
          style="width: 100%"
          :header-cell-style="headerCellStyle"
          :row-class-name="tableRowClassName"
          @sort-change="handleSortChange"
        >
          <el-table-column
            prop="answerDate"
            label="考试日期"
            sortable="custom"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <div class="date-cell">
                <div class="date-icon">
                  <i class="el-icon-date"></i>
                </div>
                <div class="date-info">
                  <div class="date-text">{{ formatDate(scope.row.answerDate) }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="subject"
            label="课程名称"
            min-width="200"
            align="center"
          >
            <template slot-scope="scope">
              <div class="subject-cell">
                <div class="subject-icon" :style="{ background: getSubjectColor(scope.row.subject) }">
                  <i :class="getSubjectIcon(scope.row.subject)"></i>
                </div>
                <div class="subject-info">
                  <div class="subject-name">{{ scope.row.subject }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="etScore"
            label="考试分数"
            sortable="custom"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <div class="score-cell">
                <div class="score-progress">
                  <el-progress
                    :percentage="getScorePercentage(scope.row.etScore)"
                    :color="getScoreColor(scope.row.etScore)"
                    :show-text="false"
                    :stroke-width="8"
                    class="score-progress-bar"
                  />
                </div>
                <div class="score-value">
                  <span class="score-number">{{ scope.row.etScore }}</span>
                  <span class="score-total">/100</span>
                </div>
                <div class="score-grade">
                  {{ getGrade(scope.row.etScore) }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="考试结果"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <div class="result-cell">
                <div :class="['result-badge', scope.row.ptScore == 1 ? 'passed' : 'failed']">
                  <i :class="scope.row.ptScore == 1 ? 'el-icon-success' : 'el-icon-error'" class="result-icon"></i>
                  <span class="result-text">{{ scope.row.ptScore == 1 ? "通过" : "未通过" }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="详情"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip content="查看考试详情" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-view"
                  @click="viewExamDetail(scope.row)"
                  class="detail-btn"
                  size="small"
                >
                  详情
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading && filteredScore.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-document empty-icon"></i>
            <p class="empty-title">暂无成绩数据</p>
            <p class="empty-desc">当前没有找到相关成绩记录</p>
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
  name: 'StudentScore',
  data() {
    return {
      pagination: {
        current: 1,
        total: 0,
        size: 10
      },
      loading: false,
      score: [],
      activeFilter: 'all',
      selectedSubject: '',
      subjectList: [],
      sortParams: {
        prop: '',
        order: ''
      },
      lastExamCount: 0
    }
  },
  computed: {
    filteredScore() {
      let filtered = this.score;

      if (this.activeFilter === 'passed') {
        filtered = filtered.filter(item => item.ptScore == 1);
      } else if (this.activeFilter === 'failed') {
        filtered = filtered.filter(item => item.ptScore != 1);
      }

      if (this.selectedSubject) {
        filtered = filtered.filter(item => item.subject === this.selectedSubject);
      }

      if (this.sortParams.prop) {
        filtered.sort((a, b) => {
          const aVal = a[this.sortParams.prop];
          const bVal = b[this.sortParams.prop];

          if (this.sortParams.order === 'ascending') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      return filtered;
    },
    totalExams() {
      return this.score.length;
    },
    passRate() {
      if (this.score.length === 0) return 0;
      const passed = this.score.filter(item => item.ptScore == 1).length;
      return Math.round((passed / this.score.length) * 100);
    },
    averageScore() {
      if (this.score.length === 0) return 0;
      const total = this.score.reduce((sum, item) => sum + parseInt(item.etScore || 0), 0);
      return Math.round(total / this.score.length);
    },
    excellentCount() {
      return this.score.filter(item => parseInt(item.etScore || 0) >= 90).length;
    },
    getExamTrend() {
      if (this.score.length > this.lastExamCount) return 'up';
      if (this.score.length < this.lastExamCount) return 'down';
      return 'stable';
    },
    getExamIcon() {
      if (this.getExamTrend === 'up') return 'el-icon-top';
      if (this.getExamTrend === 'down') return 'el-icon-bottom';
      return 'el-icon-minus';
    },
    getExamText() {
      if (this.getExamTrend === 'up') return '增加';
      if (this.getExamTrend === 'down') return '减少';
      return '稳定';
    }
  },
  created() {
    this.getScore();
  },
  methods: {
    async getScore() {
      this.loading = true;
      try {
        const studentId = this.$cookies.get("rb_student_id");
        const response = await this.$axios(
          `/score/${this.pagination.current}/${this.pagination.size}/${studentId}`
        );

        if (response.data.code === 200) {
          const data = response.data.data || {};
          const records = Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : []);
          this.score = records;
          this.pagination = { ...data, records };
          this.lastExamCount = this.score.length;
          this.generateSubjectList();
        }
      } catch (error) {
        console.error('获取成绩失败:', error);
        this.$message.error('获取成绩数据失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },

    generateSubjectList() {
      const subjects = this.score.map(item => item.subject);
      this.subjectList = [...new Set(subjects)];
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },

    getSubjectIcon(subject) {
      const iconMap = {
        '数学': 'el-icon-s-data',
        '语文': 'el-icon-edit',
        '英语': 'el-icon-reading',
        '物理': 'el-icon-s-promotion',
        '化学': 'el-icon-s-flag',
        '生物': 'el-icon-s-opportunity',
        '历史': 'el-icon-time',
        '地理': 'el-icon-location'
      };

      for (const [key, icon] of Object.entries(iconMap)) {
        if (subject.includes(key)) {
          return icon;
        }
      }

      return 'el-icon-notebook-2';
    },

    getSubjectColor(subject) {
      const colorMap = {
        '数学': 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
        '语文': 'linear-gradient(135deg, #4ECDC4, #44A08D)',
        '英语': 'linear-gradient(135deg, #FFD166, #FFB347)',
        '物理': 'linear-gradient(135deg, #06D6A0, #118AB2)',
        '化学': 'linear-gradient(135deg, #EF476F, #FF6B6B)',
        '生物': 'linear-gradient(135deg, #7209B7, #560BAD)',
        '历史': 'linear-gradient(135deg, #F3722C, #F8961E)',
        '地理': 'linear-gradient(135deg, #277DA1, #577590)'
      };

      for (const [key, color] of Object.entries(colorMap)) {
        if (subject.includes(key)) {
          return color;
        }
      }

      return 'linear-gradient(135deg, #7C3AED, #A78BFA)';
    },

    getScorePercentage(score) {
      return Math.min(Math.max(parseInt(score) || 0, 0), 100);
    },

    getScoreColor(score) {
      const numScore = parseInt(score) || 0;
      if (numScore >= 90) return '#10B981';
      if (numScore >= 80) return '#3B82F6';
      if (numScore >= 70) return '#F59E0B';
      if (numScore >= 60) return '#EF4444';
      return '#F59E0B';
    },

    getGrade(score) {
      const numScore = parseInt(score) || 0;
      if (numScore >= 90) return '优秀';
      if (numScore >= 80) return '良好';
      if (numScore >= 70) return '中等';
      if (numScore >= 60) return '及格';
      return '不及格';
    },

    handleSizeChange(val) {
      this.pagination.size = val;
      this.getScore();
    },

    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getScore();
    },

    handleFilterChange() {
      // 筛选逻辑已在计算属性中处理
    },

    handleSubjectChange() {
      // 筛选逻辑已在计算属性中处理
    },

    handleSearch() {
      this.$message.success('已应用筛选条件');
    },

    resetSearch() {
      this.activeFilter = 'all';
      this.selectedSubject = '';
      this.$message.success('已重置筛选条件');
    },

    handleSortChange({ column, prop, order }) {
      this.sortParams = { prop, order };
    },

    viewExamDetail(record) {
      this.$message({
        message: '查看考试详情：' + record.subject,
        type: 'info'
      });
    },

    headerCellStyle() {
      return {
        backgroundColor: '#f8f9fa',
        color: '#495057',
        fontWeight: '600',
        fontSize: '14px',
        borderBottom: '2px solid #e9ecef'
      };
    },

    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 === 1 ? 'even-row' : 'odd-row';
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

.score-container {
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

      &.pass-icon {
        background: linear-gradient(135deg, @secondary-color, #34D399);
      }

      &.score-icon {
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

      .radio-group {
        /deep/ .el-radio-button__inner {
          border-radius: 6px;
          border: 1px solid @border-color;
          transition: all 0.3s;

          &:hover {
            color: @primary-color;
          }
        }

        /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: linear-gradient(135deg, @primary-color, @primary-light);
          border-color: @primary-color;
          box-shadow: none;
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

// 成绩表格容器
.score-table-container {
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

    .date-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;

      .date-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(@primary-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @primary-color;
          font-size: 18px;
        }
      }

      .date-info {
        .date-text {
          font-weight: 500;
          color: @text-primary;
        }
      }
    }

    .subject-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;

      .subject-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: white;
          font-size: 20px;
        }
      }

      .subject-info {
        .subject-name {
          font-weight: 600;
          color: @text-primary;
        }
      }
    }

    .score-cell {
      .score-progress {
        margin-bottom: 8px;

        .score-progress-bar {
          /deep/ .el-progress-bar__outer {
            border-radius: 10px;
            background-color: #f0f0f0;
          }

          /deep/ .el-progress-bar__inner {
            border-radius: 10px;
            transition: all 0.3s ease;
          }
        }
      }

      .score-value {
        display: flex;
        justify-content: center;
        align-items: baseline;
        margin-bottom: 4px;

        .score-number {
          font-size: 20px;
          font-weight: 700;
          color: @text-primary;
        }

        .score-total {
          font-size: 12px;
          color: @text-secondary;
          margin-left: 2px;
        }
      }

      .score-grade {
        font-size: 12px;
        color: @text-secondary;
        font-weight: 500;
        text-align: center;
      }
    }

    .result-cell {
      .result-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 80px;
        justify-content: center;

        &.passed {
          background: rgba(@secondary-color, 0.1);
          color: @secondary-color;
          border: 1px solid rgba(@secondary-color, 0.2);
        }

        &.failed {
          background: rgba(@danger-color, 0.1);
          color: @danger-color;
          border: 1px solid rgba(@danger-color, 0.2);
        }

        i {
          font-size: 16px;
        }
      }
    }

    .action-buttons {
      .detail-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 6px;
        padding: 6px 12px;

        &:hover {
          box-shadow: 0 2px 8px rgba(@primary-color, 0.3);
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

      .header-right {
        .header-actions {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }

  .score-table-container {
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
  .score-container {
    padding: 16px;
  }
}
</style>
