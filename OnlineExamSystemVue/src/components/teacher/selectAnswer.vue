<template>
  <div class="question-management-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">题库管理</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>题库管理</el-breadcrumb-item>
            <el-breadcrumb-item>题目列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="$router.push('/addAnswer')"
              class="add-btn"
            >
              新增题目
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="card-header">
        <i class="el-icon-search card-icon"></i>
        <h3 class="card-title">题目搜索</h3>
      </div>
      <div class="card-content">
        <el-form :model="searchForm" label-width="100px" class="search-form">
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="试卷名称" class="form-item">
                <el-input
                  v-model="searchForm.subject"
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
              <el-form-item label="所属章节" class="form-item">
                <el-input
                  v-model="searchForm.section"
                  placeholder="请输入章节名称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-folder"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="题目内容" class="form-item">
                <el-input
                  v-model="searchForm.question"
                  placeholder="请输入题目关键词"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-question"></i>
                  </template>
                </el-input>
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
        </el-form>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total-icon">
          <i class="el-icon-s-management"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalQuestions }}</span>
          <span class="stat-label">总题目数</span>
        </div>
        <div class="stat-trend up">
          <i class="el-icon-top"></i>
          <span>+{{ stats.todayAdded }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon choice-icon">
          <i class="el-icon-circle-check"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.choiceCount }}</span>
          <span class="stat-label">选择题</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon fill-icon">
          <i class="el-icon-edit"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.fillCount }}</span>
          <span class="stat-label">填空题</span>
        </div>
        <div class="stat-trend up">
          <i class="el-icon-top"></i>
          <span>+2</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon judge-icon">
          <i class="el-icon-question"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.judgeCount }}</span>
          <span class="stat-label">判断题</span>
        </div>
        <div class="stat-trend down">
          <i class="el-icon-bottom"></i>
          <span>-1</span>
        </div>
      </div>
    </div>

    <!-- 题目列表表格 -->
    <div class="question-table-container">
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
            prop="subject"
            label="试卷名称"
            width="200"
            sortable
          >
            <template slot-scope="scope">
              <div class="subject-cell">
                <div class="subject-icon-wrapper">
                  <i class="el-icon-document"></i>
                </div>
                <div class="subject-info">
                  <span class="subject-name">{{ scope.row.subject }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="question"
            label="题目内容"
            min-width="300"
          >
            <template slot-scope="scope">
              <div class="question-cell">
                <div class="question-content">
                  {{ scope.row.question }}
                </div>
                <div class="question-id">
                  题目ID: {{ scope.row.questionId }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="section"
            label="所属章节"
            width="150"
          >
            <template slot-scope="scope">
              <el-tag type="info" class="section-tag">
                {{ scope.row.section || '未分类' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="type"
            label="题目类型"
            width="120"
            :filters="typeFilters"
            :filter-method="filterType"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <div class="type-cell">
                <el-tag
                  :type="getTypeTagType(scope.row.type)"
                  class="type-tag"
                >
                  <i :class="getTypeIcon(scope.row.type)"></i>
                  {{ scope.row.type }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="score"
            label="试题分数"
            width="100"
            sortable
          >
            <template slot-scope="scope">
              <div class="score-cell">
                <div class="score-badge">
                  {{ scope.row.score }}分
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="level"
            label="难度等级"
            width="120"
            :filters="levelFilters"
            :filter-method="filterLevel"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <div class="level-cell">
                <div :class="['level-badge', getLevelClass(scope.row.level)]">
                  {{ scope.row.level }}
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
              <div class="action-buttons">
                <el-tooltip content="编辑题目" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    circle
                    @click="toEdit(scope.row.type, scope.row.questionId)"
                    class="edit-btn"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading && (!((pagination.records || pagination.list) && (pagination.records || pagination.list).length))" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-s-management empty-icon"></i>
            <p class="empty-title">暂无题目数据</p>
            <p class="empty-desc">当前没有题目记录，点击上方按钮新增题目</p>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="$router.push('/addAnswer')"
              class="empty-btn"
            >
              新增题目
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
        total: 0,
        size: 6
      },
      loading: false,
      searchForm: {
        subject: "",
        section: "",
        question: ""
      },
      stats: {
        totalQuestions: 0,
        todayAdded: 0,
        choiceCount: 0,
        fillCount: 0,
        judgeCount: 0
      },
      typeFilters: [
        { text: '选择题', value: '选择题' },
        { text: '填空题', value: '填空题' },
        { text: '判断题', value: '判断题' }
      ],
      levelFilters: [
        { text: '简单', value: '简单' },
        { text: '中等', value: '中等' },
        { text: '困难', value: '困难' }
      ]
    };
  },
  created() {
    this.getAnswerInfo();
  },
  methods: {
    toEdit(type, id) {
      this.$router.push({
        path: '/editAnswerChildren',
        query: { type: type, questionId: id }
      });
    },

    async getAnswerInfo(size, current) {
      this.loading = true;

      if (typeof size === 'number' && !isNaN(size)) {
        this.pagination.size = size;
      }
      if (typeof current === 'number' && !isNaN(current)) {
        this.pagination.current = current;
      } else {
        this.pagination.current = 1;
      }

      let subject = this.searchForm.subject;
      if (subject.trim() === "") {
        subject = "@";
      }

      let section = this.searchForm.section;
      if (section.trim() === "") {
        section = "@";
      }

      let question = this.searchForm.question;
      if (question.trim() === "") {
        question = "@";
      }

      try {
        const response = await this.$axios(
          `/answers/${this.pagination.current}/${this.pagination.size}/${subject}/${section}/${question}`
        );
        const data = (response && response.data && response.data.data) ? response.data.data : {};
        this.pagination = {
          ...data,
          records: Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : [])
        };
        this.updateStats();
      } catch (error) {
        console.error('获取题目列表失败:', error);
        this.$message.error('获取题目列表失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },

    updateStats() {
      const records = this.pagination.records || this.pagination.list || [];
      this.stats.totalQuestions = this.pagination.total || 0;

      // 统计各类型题目数量
      this.stats.choiceCount = records.filter(item => item.type === '选择题').length;
      this.stats.fillCount = records.filter(item => item.type === '填空题').length;
      this.stats.judgeCount = records.filter(item => item.type === '判断题').length;

      // 模拟今日新增（实际项目中应从接口获取）
      this.stats.todayAdded = Math.min(3, records.length);
    },

    handleSearch() {
      this.pagination.current = 1;
      this.getAnswerInfo();
    },

    resetSearch() {
      this.searchForm = {
        subject: "",
        section: "",
        question: ""
      };
      this.handleSearch();
    },

    handleSizeChange(val) {
      this.getAnswerInfo(val);
    },

    handleCurrentChange(val) {
      this.getAnswerInfo(undefined, val);
    },

    getTypeTagType(type) {
      const typeMap = {
        '选择题': 'success',
        '填空题': 'warning',
        '判断题': 'info'
      };
      return typeMap[type] || 'info';
    },

    getTypeIcon(type) {
      const iconMap = {
        '选择题': 'el-icon-circle-check',
        '填空题': 'el-icon-edit',
        '判断题': 'el-icon-question'
      };
      return iconMap[type] || 'el-icon-question';
    },

    getLevelClass(level) {
      const levelMap = {
        '简单': 'easy',
        '中等': 'medium',
        '困难': 'hard'
      };
      return levelMap[level] || 'easy';
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
    },

    filterType(value, row) {
      return row.type === value;
    },

    filterLevel(value, row) {
      return row.level === value;
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

.question-management-container {
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
        .add-btn {
          background: linear-gradient(135deg, @primary-color, @primary-light);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;

          &:hover {
            box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
          }
        }
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

      &.choice-icon {
        background: linear-gradient(135deg, @secondary-color, #34D399);
      }

      &.fill-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
      }

      &.judge-icon {
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

// 题目表格容器
.question-table-container {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;

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
        }
      }
    }

    .subject-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .subject-icon-wrapper {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: linear-gradient(135deg, @primary-color, @primary-light);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: white;
          font-size: 18px;
        }
      }

      .subject-info {
        .subject-name {
          font-weight: 600;
          color: @text-primary;
          line-height: 1.4;
        }
      }
    }

    .question-cell {
      .question-content {
        color: @text-primary;
        line-height: 1.5;
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .question-id {
        font-size: 12px;
        color: @text-secondary;
      }
    }

    .section-tag {
      border-radius: 12px;
      padding: 4px 12px;
      font-size: 12px;
    }

    .type-tag {
      border-radius: 12px;
      padding: 4px 12px;
      font-size: 12px;

      i {
        margin-right: 4px;
      }
    }

    .score-cell {
      .score-badge {
        display: inline-block;
        padding: 4px 12px;
        background: linear-gradient(135deg, @warning-color, #FBBF24);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 50px;
        text-align: center;
      }
    }

    .level-cell {
      .level-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;

        &.easy {
          background: rgba(@secondary-color, 0.1);
          color: @secondary-color;
          border: 1px solid rgba(@secondary-color, 0.2);
        }

        &.medium {
          background: rgba(@warning-color, 0.1);
          color: @warning-color;
          border: 1px solid rgba(@warning-color, 0.2);
        }

        &.hard {
          background: rgba(@danger-color, 0.1);
          color: @danger-color;
          border: 1px solid rgba(@danger-color, 0.2);
        }
      }
    }

    .action-buttons {
      .edit-btn {
        background: linear-gradient(135deg, #10B981, #34D399);
        border: none;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(#10B981, 0.3);
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
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      gap: 16px;
    }
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

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .question-management-container {
    padding: 16px;
  }
}
</style>
