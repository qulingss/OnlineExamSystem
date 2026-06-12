<template>
  <div class="exam-management-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">试卷管理</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>题库管理</el-breadcrumb-item>
            <el-breadcrumb-item>选择试卷</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getExamInfo"
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
          <i class="el-icon-document-copy"></i>
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
        <div class="stat-icon today-icon">
          <i class="el-icon-date"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.todayExams }}</span>
          <span class="stat-label">今日新增</span>
        </div>
        <div class="stat-trend up" v-if="stats.todayExams > 0">
          <i class="el-icon-top"></i>
          <span>+{{ stats.todayExams }}</span>
        </div>
      </div>
    </div>

    <!-- 试卷列表表格 -->
    <div class="exam-table-container">
      <div class="table-header">
        <h3 class="table-title">
          <i class="el-icon-document-checked table-title-icon"></i>
          试卷列表
        </h3>
        <div class="table-actions">
          <el-button
            type="text"
            icon="el-icon-info"
            @click="showTips"
            class="tips-btn"
          >
            操作说明
          </el-button>
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
          @row-click="handleRowClick"
        >
          <el-table-column
            prop="source"
            label="试卷名称"
            width="180"
            sortable
          >
            <template slot-scope="scope">
              <div class="exam-cell">
                <div class="exam-icon-wrapper">
                  <i class="el-icon-document"></i>
                </div>
                <div class="exam-info">
                  <span class="exam-name">{{ scope.row.source }}</span>
                  <span class="exam-id">ID: {{ scope.row.paperId }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="description"
            label="试卷描述"
            width="220"
          >
            <template slot-scope="scope">
              <div class="description-cell">
                {{ scope.row.description || '暂无描述' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="所属学院/专业"
            width="200"
          >
            <template slot-scope="scope">
              <div class="institute-major-cell">
                <div class="institute-tag">
                  <i class="el-icon-office-building"></i>
                  {{ scope.row.institute }}
                </div>
                <div class="major-tag">
                  <i class="el-icon-suitcase"></i>
                  {{ scope.row.major }}
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
                  {{ scope.row.grade }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="examDate"
            label="考试日期"
            width="120"
            sortable
          >
            <template slot-scope="scope">
              <div class="date-cell">
                <div class="date-icon">
                  <i class="el-icon-date"></i>
                </div>
                <div class="date-text">
                  {{ scope.row.examDate }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="totalTime"
            label="考试时长"
            width="120"
          >
            <template slot-scope="scope">
              <div class="time-cell">
                <div class="time-badge">
                  {{ scope.row.totalTime }}分钟
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="type"
            label="试卷类型"
            width="120"
          >
            <template slot-scope="scope">
              <div class="type-cell">
                <el-tag
                  :type="getExamTypeTagType(scope.row.type)"
                  class="type-tag"
                >
                  {{ scope.row.type }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="tips"
            label="考生提示"
            width="300"
          >
            <template slot-scope="scope">
              <div class="tips-cell">
                <el-tooltip :content="scope.row.tips" placement="top">
                  <div class="tips-content">
                    {{ scope.row.tips | truncate(30) }}
                  </div>
                </el-tooltip>
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
                <el-tooltip content="录入题目" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-edit-outline"
                    size="small"
                    circle
                    @click.stop="add(scope.row.paperId, scope.row.source)"
                    class="add-btn"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="查看详情" placement="top">
                  <el-button
                    type="info"
                    icon="el-icon-view"
                    size="small"
                    circle
                    @click.stop="viewDetails(scope.row)"
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
            <i class="el-icon-document-copy empty-icon"></i>
            <p class="empty-title">暂无试卷数据</p>
            <p class="empty-desc">当前没有试卷记录，请先创建试卷</p>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="$router.push('/exam/create')"
              class="empty-btn"
            >
              创建试卷
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
          :page-sizes="[4, 8, 10, 20]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          background
          class="custom-pagination"
        />
      </div>
    </div>

    <!-- 操作说明弹窗 -->
    <el-dialog
      title="操作说明"
      :visible.sync="dialogVisible"
      width="500px"
      custom-class="tips-dialog"
    >
      <div class="tips-content">
        <div class="tip-item">
          <i class="el-icon-edit-outline tip-icon"></i>
          <div class="tip-text">
            <strong>录入题目：</strong>点击试卷对应的录入按钮，进入题目录入页面
          </div>
        </div>
        <div class="tip-item">
          <i class="el-icon-view tip-icon"></i>
          <div class="tip-text">
            <strong>查看详情：</strong>点击查看按钮可以查看试卷的详细信息
          </div>
        </div>
        <div class="tip-item">
          <i class="el-icon-refresh tip-icon"></i>
          <div class="tip-text">
            <strong>刷新列表：</strong>点击右上角刷新按钮可以获取最新数据
          </div>
        </div>
        <div class="tip-item">
          <i class="el-icon-sort tip-icon"></i>
          <div class="tip-text">
            <strong>排序功能：</strong>点击表头可按照相应字段进行排序
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" size="medium">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      pagination: {
        current: 1,
        total: null,
        size: 4
      },
      loading: false,
      stats: {
        totalExams: 0,
        instituteCount: 0,
        majorCount: 0,
        todayExams: 0
      },
      dialogVisible: false
    }
  },
  filters: {
    truncate(value, length) {
      if (!value) return ''
      if (value.length <= length) return value
      return value.substring(0, length) + '...'
    }
  },
  created() {
    this.getExamInfo()
  },
  methods: {
    getExamInfo() {
      this.loading = true
      this.$axios(`/exams/${this.pagination.current}/${this.pagination.size}`)
        .then(res => {
          const data = (res && res.data && res.data.data) ? res.data.data : {}
          this.pagination = {
            ...data,
            records: Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : [])
          }
          this.updateStats()
        })
        .catch(error => {
          console.error('获取试卷列表失败:', error)
          this.$message.error('获取试卷列表失败，请稍后重试')
        })
        .finally(() => {
          this.loading = false
        })
    },

    updateStats() {
      const records = this.pagination.records || this.pagination.list || []
      this.stats.totalExams = this.pagination.total || 0

      // 使用对象代替 Set 来去重
      const instituteObj = {}
      const majorObj = {}

      records.forEach(item => {
        if (item.institute) instituteObj[item.institute] = true
        if (item.major) majorObj[item.major] = true
      })

      this.stats.instituteCount = Object.keys(instituteObj).length
      this.stats.majorCount = Object.keys(majorObj).length

      // 模拟今日新增（实际项目中应从接口获取）
      this.stats.todayExams = Math.min(2, records.length)
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.getExamInfo()
    },

    handleCurrentChange(val) {
      this.pagination.current = val
      this.getExamInfo()
    },

    add(paperId, source) {
      this.$router.push({
        path: '/addAnswerChildren',
        query: { paperId: paperId, subject: source }
      })
    },

    viewDetails(row) {
      this.$message({
        title: '试卷详情',
        message: `试卷名称：${row.source}\n所属学院：${row.institute}\n所属专业：${row.major}\n考试日期：${row.examDate}`,
        type: 'info',
        duration: 3000
      })
    },

    showTips() {
      this.dialogVisible = true
    },

    handleRowClick(row) {
      // 行点击事件，可扩展
    },

    getExamTypeTagType(type) {
      const typeMap = {
        '期末考试': 'danger',
        '期中考试': 'warning',
        '模拟考试': 'success',
        '随堂测试': 'info'
      }
      return typeMap[type] || 'info'
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

.exam-management-container {
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

      &.today-icon {
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
      .tips-btn {
        color: @primary-color;
        font-weight: 500;

        &:hover {
          color: @primary-light;
        }
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

      .exam-icon-wrapper {
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

      .exam-info {
        display: flex;
        flex-direction: column;

        .exam-name {
          font-weight: 600;
          color: @text-primary;
          line-height: 1.4;
        }

        .exam-id {
          font-size: 12px;
          color: @text-secondary;
          margin-top: 2px;
        }
      }
    }

    .description-cell {
      color: @text-primary;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .institute-major-cell {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .institute-tag,
      .major-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: @text-secondary;

        i {
          color: @info-color;
        }
      }
    }

    .grade-cell {
      .grade-tag {
        background: rgba(@primary-color, 0.1);
        color: @primary-color;
        border: 1px solid rgba(@primary-color, 0.2);
        border-radius: 12px;
        padding: 4px 12px;
        font-weight: 500;
      }
    }

    .date-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .date-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: rgba(@warning-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @warning-color;
          font-size: 16px;
        }
      }

      .date-text {
        color: @text-primary;
        font-weight: 500;
      }
    }

    .time-cell {
      .time-badge {
        display: inline-block;
        padding: 6px 12px;
        background: linear-gradient(135deg, @secondary-color, #34D399);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 70px;
        text-align: center;
      }
    }

    .type-cell {
      .type-tag {
        border-radius: 12px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 500;
        border: none;
      }
    }

    .tips-cell {
      .tips-content {
        color: @text-secondary;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 8px;

      .add-btn {
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

// 操作说明弹窗
.tips-dialog {
  border-radius: 12px;

  /deep/ .el-dialog__header {
    border-bottom: 1px solid @border-color;
    padding-bottom: 20px;

    .el-dialog__title {
      color: @text-primary;
      font-weight: 600;
    }
  }

  /deep/ .el-dialog__body {
    padding: 30px;

    .tips-content {
      .tip-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 20px;
        padding: 16px;
        background: @bg-color;
        border-radius: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .tip-icon {
          color: @primary-color;
          font-size: 18px;
          margin-top: 2px;
        }

        .tip-text {
          color: @text-primary;
          line-height: 1.6;

          strong {
            color: @primary-color;
          }
        }
      }
    }
  }

  /deep/ .el-dialog__footer {
    border-top: 1px solid @border-color;
    padding: 20px;

    .dialog-footer {
      .el-button {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 8px;
        padding: 10px 24px;

        &:hover {
          box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
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
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      gap: 16px;
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
  .exam-management-container {
    padding: 16px;
  }
}
</style>
