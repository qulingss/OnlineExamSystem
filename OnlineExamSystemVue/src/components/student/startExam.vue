<template>
  <div id="myExam" class="exam-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">试卷练习</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>考试管理</el-breadcrumb-item>
            <el-breadcrumb-item>试卷练习</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="refreshPage"
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
          <i class="el-icon-document"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalExams }}</span>
          <span class="stat-label">总试卷数</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon available-icon">
          <i class="el-icon-notebook-2"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.availableExams }}</span>
          <span class="stat-label">可练习试卷</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon time-icon">
          <i class="el-icon-time"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.avgTime }}分</span>
          <span class="stat-label">平均时长</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon score-icon">
          <i class="el-icon-star-off"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.avgScore }}分</span>
          <span class="stat-label">平均分数</span>
        </div>
      </div>
    </div>

    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="card-header">
        <i class="el-icon-search card-icon"></i>
        <h3 class="card-title">试卷搜索</h3>
      </div>
      <div class="card-content">
        <div class="search-form">
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="试卷名称" class="form-item">
                <el-input
                  v-model="key"
                  placeholder="请输入试卷名称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-document"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="练习时间" class="form-item">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="medium"
                  class="date-picker"
                  @change="handleDateChange"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="试卷状态" class="form-item">
                <el-select
                  v-model="examStatus"
                  placeholder="请选择试卷状态"
                  clearable
                  size="medium"
                  class="status-select"
                >
                  <el-option label="全部" value="all"></el-option>
                  <el-option label="可练习" value="available"></el-option>
                  <el-option label="已截止" value="expired"></el-option>
                  <el-option label="未开始" value="upcoming"></el-option>
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

    <!-- 试卷列表表格 -->
    <div class="exam-table-container">
      <div class="table-header">
        <h3 class="table-title">
          <i class="el-icon-document table-title-icon"></i>
          练习列表
        </h3>
        <div class="table-actions">
          <span class="total-text">共 {{ pagination.total || 0 }} 份试卷</span>
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
            prop="source"
            label="试卷名称"
            min-width="200"
            sortable
          >
            <template slot-scope="scope">
              <div class="exam-cell">
                <div class="exam-icon">
                  <i class="el-icon-document"></i>
                </div>
                <div class="exam-info">
                  <div class="exam-name">{{ scope.row.source }}</div>
                  <div class="exam-desc">{{ scope.row.description }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="examDate"
            label="练习时间"
            width="180"
            sortable
            align="center"
          >
            <template slot-scope="scope">
              <div class="date-cell">
                <div class="date-icon">
                  <i class="el-icon-date"></i>
                </div>
                <div class="date-text">
                  {{ formatDate(scope.row.examDate) }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="totalTime"
            label="考试时长"
            width="120"
            align="center"
            sortable
          >
            <template slot-scope="scope">
              <div class="time-cell">
                <div class="time-icon">
                  <i class="el-icon-time"></i>
                </div>
                <div class="time-text">{{ scope.row.totalTime || 0 }}分钟</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="totalScore"
            label="试卷总分"
            width="120"
            align="center"
            sortable
          >
            <template slot-scope="scope">
              <div class="score-cell">
                <div class="score-icon">
                  <i class="el-icon-s-data"></i>
                </div>
                <div class="score-text">{{ scope.row.totalScore || 0 }}分</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="试卷状态"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <div class="status-cell">
                <div :class="['status-badge', getExamStatus(scope.row.examDate)]">
                  {{ getStatusText(scope.row.examDate) }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="120"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="getExamStatus(scope.row.examDate) === 'available' ? '开始练习' : '暂不可用'"
                placement="top"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="toExamMsg(scope.row)"
                  class="practice-btn"
                  size="small"
                  :disabled="getExamStatus(scope.row.examDate) !== 'available'"
                  :loading="loadingExam === scope.row.examCode"
                >
                  {{ loadingExam === scope.row.examCode ? '加载中' : '练习' }}
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading && (!((pagination.records || pagination.list) && (pagination.records || pagination.list).length))" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-document empty-icon"></i>
            <p class="empty-title">暂无试卷数据</p>
            <p class="empty-desc">当前筛选条件下没有找到相关试卷</p>
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
      loading: false,
      loadingExam: null,
      key: null,
      dateRange: null,
      examStatus: 'all',
      pagination: {
        current: 1,
        total: null,
        size: 6
      },
      stats: {
        totalExams: 0,
        availableExams: 0,
        avgTime: 0,
        avgScore: 0
      }
    }
  },
  created() {
    this.getExamInfo();
    this.loading = true;
  },
  methods: {
    // 获取当前所有考试信息
    getExamInfo() {
      this.$axios(`/exams/${this.pagination.current}/${this.pagination.size}`)
        .then(res => {
          const data = (res && res.data && res.data.data) ? res.data.data : {};
          this.pagination = {
            ...data,
            records: Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : [])
          };
          this.updateStats();
        })
        .catch(error => {
          console.error('获取试卷列表失败:', error);
          this.$message.error('获取试卷列表失败，请稍后重试');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 更新统计信息
    updateStats() {
      const records = this.pagination.records || this.pagination.list || [];
      this.stats.totalExams = this.pagination.total || 0;

      const availableExams = records.filter(item => this.getExamStatus(item.examDate) === 'available').length;
      const totalTime = records.reduce((sum, item) => sum + (item.totalTime || 0), 0);
      const totalScore = records.reduce((sum, item) => sum + (item.totalScore || 0), 0);

      this.stats.availableExams = availableExams;
      this.stats.avgTime = records.length > 0 ? Math.round(totalTime / records.length) : 0;
      this.stats.avgScore = records.length > 0 ? Math.round(totalScore / records.length) : 0;
    },

    // 改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getExamInfo();
    },

    // 改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getExamInfo();
    },

    // 搜索试卷
    search() {
      if (!this.key) {
        this.getExamInfo();
        return;
      }

      this.loading = true;
      this.$axios('/exams')
        .then(res => {
          if (res.data.code == 200) {
            let allExam = res.data.data;
            let newPage = allExam.filter(item => {
              return item.source && item.source.includes(this.key);
            });
            this.pagination.records = newPage;
            this.pagination.total = newPage.length;
            this.pagination.current = 1;
            this.updateStats();
          }
        })
        .catch(error => {
          console.error('搜索试卷失败:', error);
          this.$message.error('搜索试卷失败，请稍后重试');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 处理搜索
    handleSearch() {
      this.search();
    },

    // 重置搜索
    resetSearch() {
      this.key = null;
      this.dateRange = null;
      this.examStatus = 'all';
      this.getExamInfo();
      this.$message.success('已重置搜索条件');
    },

    // 处理日期变化
    handleDateChange() {
      // 可以在这里添加日期筛选逻辑
    },

    // 跳转到试卷详情页
    toExamMsg(exam) {
      this.loadingExam = exam.examCode;

      if (exam.examDate > this.formatDateNow()) {
        this.$message({
          message: "时间未到",
          type: "error",
        });
        this.loadingExam = null;
        return;
      }

      setTimeout(() => {
        this.$router.push({
          path: '/examMsg',
          query: { examCode: exam.examCode }
        });
        this.loadingExam = null;
      }, 500);
    },

    // 获取当前日期
    formatDateNow() {
      return "2025-12-15";
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      return dateString.substr(0, 10);
    },

    // 获取试卷状态
    getExamStatus(examDate) {
      if (!examDate) return 'unknown';
      const examTime = new Date(examDate).getTime();
      const now = new Date().getTime();

      if (examTime > now) {
        return 'upcoming';
      } else {
        // 对于练习模式，我们可以允许今天及以前的考试都可以练习
        // 但为了与正式考试保持一致，我们只允许今天的考试练习
        const today = new Date().toISOString().split('T')[0];
        const examDateStr = new Date(examDate).toISOString().split('T')[0];
        if (examDateStr === today) {
          return 'available';
        } else {
          return 'expired';
        }
      }
    },

    // 获取状态文本
    getStatusText(examDate) {
      const status = this.getExamStatus(examDate);
      const statusMap = {
        'available': '可练习',
        'upcoming': '未开始',
        'expired': '已过期',
        'unknown': '未知'
      };
      return statusMap[status] || '未知';
    },

    // 刷新页面
    refreshPage() {
      this.getExamInfo();
      this.$message.success('列表已刷新');
    },

    // 表头样式
    headerCellStyle() {
      return {
        backgroundColor: '#f8f9fa',
        color: '#495057',
        fontWeight: '600',
        fontSize: '14px',
        borderBottom: '2px solid #e9ecef'
      };
    },

    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 === 1 ? 'even-row' : 'odd-row';
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

.exam-container {
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

      &.available-icon {
        background: linear-gradient(135deg, @secondary-color, #34D399);
      }

      &.time-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
      }

      &.score-icon {
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

      .search-input,
      .date-picker,
      .status-select {
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

// 试卷表格容器
.exam-table-container {
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

    .exam-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .exam-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: rgba(@primary-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @primary-color;
          font-size: 20px;
        }
      }

      .exam-info {
        .exam-name {
          font-weight: 600;
          color: @text-primary;
          margin-bottom: 4px;
        }

        .exam-desc {
          font-size: 12px;
          color: @text-secondary;
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
        background: rgba(@secondary-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @secondary-color;
          font-size: 18px;
        }
      }

      .date-text {
        font-weight: 500;
        color: @text-primary;
      }
    }

    .time-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;

      .time-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(@warning-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @warning-color;
          font-size: 18px;
        }
      }

      .time-text {
        font-weight: 500;
        color: @text-primary;
      }
    }

    .score-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;

      .score-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(@info-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @info-color;
          font-size: 18px;
        }
      }

      .score-text {
        font-weight: 500;
        color: @text-primary;
      }
    }

    .status-cell {
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 80px;
        justify-content: center;

        &.available {
          background: rgba(@secondary-color, 0.1);
          color: @secondary-color;
          border: 1px solid rgba(@secondary-color, 0.2);
        }

        &.upcoming {
          background: rgba(@warning-color, 0.1);
          color: @warning-color;
          border: 1px solid rgba(@warning-color, 0.2);
        }

        &.unknown {
          background: rgba(@text-secondary, 0.1);
          color: @text-secondary;
          border: 1px solid rgba(@text-secondary, 0.2);
        }
      }
    }

    .action-buttons {
      .practice-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 6px;
        padding: 6px 12px;

        &:hover:not(:disabled) {
          box-shadow: 0 2px 8px rgba(@primary-color, 0.3);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

  .exam-table-container {
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
  .exam-container {
    padding: 16px;
  }
}
</style>

