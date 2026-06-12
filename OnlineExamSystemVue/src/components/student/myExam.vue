<template>
  <div class="exam-center-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">考试中心</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生中心</el-breadcrumb-item>
            <el-breadcrumb-item>考试列表</el-breadcrumb-item>
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
              :loading="loading"
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
          <span class="stat-label">总考试数</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon available-icon">
          <i class="el-icon-circle-check"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.availableExams }}</span>
          <span class="stat-label">可参加</span>
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
      <div class="stat-card">
        <div class="stat-icon upcoming-icon">
          <i class="el-icon-timer"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.upcomingExams }}</span>
          <span class="stat-label">即将开始</span>
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
              <el-input
                v-model="key"
                placeholder="请输入试卷名称搜索..."
                clearable
                size="medium"
                class="search-input"
                @keyup.enter="search"
                @clear="getExamInfo"
              >
                <template #prefix>
                  <i class="el-icon-document"></i>
                </template>
              </el-input>
            </div>
            <div class="form-actions">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="search"
                class="search-btn"
                :loading="searchLoading"
                size="medium"
              >
                搜索
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

          <div class="filter-tags">
            <div class="filter-title">
              <i class="el-icon-filter"></i>
              筛选条件
            </div>
            <el-radio-group v-model="activeFilter" size="medium" @change="handleFilterChange">
              <el-radio-button label="all">全部试卷</el-radio-button>
              <el-radio-button label="available">可参加</el-radio-button>
              <el-radio-button label="upcoming">即将开始</el-radio-button>
              <el-radio-button label="expired">已过期</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 试卷列表卡片 -->
    <div class="exams-table-container">
      <div class="table-header">
        <h3 class="table-title">
          <i class="el-icon-tickets table-title-icon"></i>
          试卷列表
        </h3>
        <div class="table-actions">
          <span class="total-text">共 {{ displayedPapers.length }} 份试卷</span>
        </div>
      </div>

      <div class="table-wrapper">
        <el-row :gutter="24" class="exams-grid">
          <el-col
            v-for="(item, index) in displayedPapers"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="6"
            class="exam-col"
          >
            <div
              class="exam-card"
              :class="{'disabled-card': !isAvailable(item)}"
              @click="handleCardClick(item)"
            >
              <!-- 试卷状态标签 -->
              <div class="exam-status" :class="getPaperStatus(item)">
                {{ getStatusText(item) }}
              </div>

              <!-- 试卷信息 -->
              <div class="exam-content">
                <div class="exam-header">
                  <div class="exam-icon-wrapper">
                    <i class="el-icon-document"></i>
                  </div>
                  <div class="exam-info">
                    <h3 class="exam-title">{{ item.source }}</h3>
                    <div class="exam-code">
                      ID: {{ item.examCode }}
                    </div>
                  </div>
                </div>

                <div class="exam-desc">
                  {{ item.description || '暂无描述' }}
                </div>

                <div class="exam-meta">
                  <div class="meta-item">
                    <div class="meta-icon">
                      <i class="el-icon-date"></i>
                    </div>
                    <div class="meta-content">
                      <div class="meta-label">考试时间</div>
                      <div class="meta-value">{{ formatDate(item.examDate) }}</div>
                    </div>
                  </div>

                  <div class="meta-item">
                    <div class="meta-icon">
                      <i class="el-icon-time"></i>
                    </div>
                    <div class="meta-content">
                      <div class="meta-label">考试时长</div>
                      <div class="meta-value">{{ item.totalTime || 0 }}分钟</div>
                    </div>
                  </div>

                  <div class="meta-item">
                    <div class="meta-icon">
                      <i class="el-icon-star-off"></i>
                    </div>
                    <div class="meta-content">
                      <div class="meta-label">试卷总分</div>
                      <div class="meta-value">{{ item.totalScore || 0 }}分</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 开始考试按钮 -->
              <div class="exam-action">
                <el-button
                  type="primary"
                  :class="getButtonClass(item)"
                  :disabled="!isAvailable(item)"
                  @click.stop="toExamMsg(item)"
                  class="exam-btn"
                  size="medium"
                  icon="el-icon-edit-outline"
                >
                  {{ getButtonText(item) }}
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <div v-if="!loading && displayedPapers.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-document-copy empty-icon"></i>
            <p class="empty-title">暂无试卷</p>
            <p class="empty-desc">当前没有可用的考试试卷</p>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getExamInfo"
              class="empty-btn"
            >
              刷新列表
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="filteredPapers.length > pagination.size">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[6, 12, 24, 36]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredPapers.length"
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
      searchLoading: false,
      key: '',
      allPapers: [],
      pagination: {
        current: 1,
        total: 0,
        size: 6
      },
      activeFilter: 'all',
      todayDate: '2025-12-15',
      stats: {
        totalExams: 0,
        availableExams: 0,
        todayExams: 0,
        upcomingExams: 0
      }
    }
  },
  computed: {
    filteredPapers() {
      let filtered = this.allPapers;

      if (this.key) {
        const keyword = this.key.toLowerCase();
        filtered = filtered.filter(item =>
          item.source && item.source.toLowerCase().includes(keyword)
        );
      }

      if (this.activeFilter !== 'all') {
        switch (this.activeFilter) {
          case 'available':
            filtered = filtered.filter(item => this.isAvailable(item));
            break;
          case 'upcoming':
            filtered = filtered.filter(item => this.isUpcoming(item));
            break;
          case 'expired':
            filtered = filtered.filter(item => this.isExpired(item));
            break;
        }
      }

      return filtered;
    },

    displayedPapers() {
      const start = (this.pagination.current - 1) * this.pagination.size;
      const end = start + this.pagination.size;
      return this.filteredPapers.slice(start, end);
    }
  },
  created() {
    this.getExamInfo();
  },
  methods: {
    async getExamInfo() {
      this.loading = true;
      try {
        // 获取完整试卷列表，前端做分页与筛选，确保“全部试卷”稳定显示
        const response = await this.$axios('/exams');
        if (response.data && response.data.code === 200) {
          const payload = response.data.data;
          let records = [];
          if (Array.isArray(payload)) {
            records = payload;
          } else if (payload && (Array.isArray(payload.records) || Array.isArray(payload.list))) {
            records = Array.isArray(payload.records) ? payload.records : payload.list;
          }

          this.allPapers = Array.isArray(records) ? records : [];
          // 统一使用前端分页，重置到第一页
          this.pagination.current = 1;
          this.updateStats();
        }
      } catch (error) {
        console.error('获取试卷列表失败:', error);
        this.$message.error('获取试卷数据失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },

    updateStats() {
      this.stats.totalExams = this.allPapers.length;
      this.stats.availableExams = this.allPapers.filter(item => this.isAvailable(item)).length;
      this.stats.upcomingExams = this.allPapers.filter(item => this.isUpcoming(item)).length;

      // 模拟今日新增（实际项目中应从接口获取）
      const today = this.formatDateNow();
      this.stats.todayExams = this.allPapers.filter(item =>
        item.examDate && item.examDate.startsWith(today)
      ).length;
    },

    async search() {
      this.searchLoading = true;
      try {
        const response = await this.$axios('/exams');
        if (response.data.code === 200) {
          let allExam = response.data.data;
          let newPage = allExam.filter(item => {
            return item.source.includes(this.key);
          });
          this.allPapers = newPage;
          this.pagination.current = 1;
          this.updateStats();
        }
      } catch (error) {
        console.error('搜索失败:', error);
        this.$message.error('搜索失败，请稍后重试');
      } finally {
        this.searchLoading = false;
      }
    },

    resetSearch() {
      this.key = '';
      this.activeFilter = 'all';
      this.pagination.current = 1;
      this.getExamInfo();
    },

    handleSizeChange(val) {
      this.pagination.size = val;
      this.pagination.current = 1;
    },

    handleCurrentChange(val) {
      this.pagination.current = val;
    },

    handleFilterChange() {
      this.pagination.current = 1;
    },

    handleCardClick(exam) {
      if (this.isExpired(exam)) {
        return;
      }
      this.toExamMsg(exam);
    },

    toExamMsg(exam) {
      if (!this.isAvailable(exam)) {
        this.$message({
          message: "考试时间未到",
          type: "error",
        });
        return;
      }
      this.$router.push({
        path: "/examMsg",
        query: { examCode: exam.examCode },
      });
    },

    // ========== 考试状态判断 ==========
    extractDateStr(dateLike) {
      if (!dateLike) return '';
      const s = String(dateLike);
      return s.length >= 10 ? s.substr(0, 10) : s;
    },

    hasTimePart(dateLike) {
      if (!dateLike) return false;
      const s = String(dateLike);
      return s.length > 10; // 简单判断：含时间部分（yyyy-MM-dd HH:mm:ss）
    },

    isAvailable(exam) {
      if (!exam || !exam.examDate) return false;
      const todayStr = this.formatDateNow();
      // 若有具体时间，则以时间窗口判断；否则按整日可参加（当天）
      if (this.hasTimePart(exam.examDate) && exam.totalTime) {
        const start = new Date(exam.examDate);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + Number(exam.totalTime));
        const now = new Date();
        return now >= start && now <= end;
      }
      return this.extractDateStr(exam.examDate) === todayStr;
    },

    isUpcoming(exam) {
      if (!exam || !exam.examDate) return false;
      const todayStr = this.formatDateNow();
      if (this.hasTimePart(exam.examDate)) {
        const now = new Date();
        const start = new Date(exam.examDate);
        return now < start;
      }
      return this.extractDateStr(exam.examDate) > todayStr;
    },

    isExpired(exam) {
      if (!exam || !exam.examDate) return false;
      const todayStr = this.formatDateNow();
      if (this.hasTimePart(exam.examDate) && exam.totalTime) {
        const start = new Date(exam.examDate);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + Number(exam.totalTime));
        const now = new Date();
        return now > end;
      }
      return this.extractDateStr(exam.examDate) < todayStr;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const d = new Date(dateString);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${day} ${hh}:${mm}`;
    },

    formatDateNow() {
      // 返回当前日期，格式为YYYY-MM-DD
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    getPaperStatus(exam) {
      if (this.isAvailable(exam)) return 'available';
      if (this.isUpcoming(exam)) return 'upcoming';
      if (this.isExpired(exam)) return 'expired';
      return 'unknown';
    },

    getStatusText(exam) {
      const status = this.getPaperStatus(exam);
      const statusMap = {
        'available': '可参加',
        'upcoming': '即将开始',
        'expired': '已过期',
        'unknown': '未知状态'
      };
      return statusMap[status] || '未知状态';
    },

    getButtonClass(exam) {
      const status = this.getPaperStatus(exam);
      return {
        'available-btn': status === 'available',
        'disabled-btn': status !== 'available'
      };
    },

    getButtonText(exam) {
      const status = this.getPaperStatus(exam);
      const textMap = {
        'available': '开始考试',
        'upcoming': '等待开始',
        'expired': '已结束',
        'unknown': '查看详情'
      };
      return textMap[status] || '查看详情';
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

.exam-center-container {
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

      &.available-icon {
        background: linear-gradient(135deg, @secondary-color, #34D399);
      }

      &.today-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
      }

      &.upcoming-icon {
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

// 搜索卡片
.search-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  margin-bottom: 0;
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
        gap: 16px;
        margin-bottom: 24px;

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
        gap: 12px;

        .search-btn {
          background: linear-gradient(135deg, @primary-color, @primary-light);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;

          &:hover {
            box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
          }
        }

        .reset-btn {
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

      .filter-tags {
        padding-top: 20px;
        border-top: 1px solid @border-color;

        .filter-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: @text-primary;
          margin-bottom: 16px;
          font-size: 16px;

          i {
            color: @primary-color;
          }
        }

        /deep/ .el-radio-group {
          .el-radio-button {
            &:first-child .el-radio-button__inner {
              border-radius: 20px 0 0 20px;
            }

            &:last-child .el-radio-button__inner {
              border-radius: 0 20px 20px 0;
            }

            .el-radio-button__inner {
              border: 1px solid @border-color;
              transition: all 0.3s;

              &:hover {
                color: @primary-color;
              }
            }

            &.is-active {
              .el-radio-button__inner {
                background: linear-gradient(135deg, @primary-color, @primary-light);
                border-color: @primary-color;
                color: white;
                box-shadow: 0 2px 8px rgba(@primary-color, 0.2);
              }
            }
          }
        }
      }
    }
  }
}

// 试卷列表容器
.exams-table-container {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;
  flex: 1;

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
    padding: 30px;
    min-height: 400px;

    .exams-grid {
      .exam-col {
        margin-bottom: 24px;
        animation: fadeInUp 0.5s ease-out;
        animation-fill-mode: both;

        &:nth-child(1) { animation-delay: 0.1s; }
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.3s; }
        &:nth-child(4) { animation-delay: 0.4s; }
        &:nth-child(5) { animation-delay: 0.5s; }
        &:nth-child(6) { animation-delay: 0.6s; }

        .exam-card {
          background: white;
          border-radius: 12px;
          border: 1px solid @border-color;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          cursor: pointer;

          &:hover {
            transform: translateY(-4px);
            box-shadow: @shadow-md;
            border-color: @primary-color;

            &.disabled-card {
              transform: none;
              box-shadow: @shadow-sm;
              border-color: @border-color;
            }
          }

          &.disabled-card {
            cursor: not-allowed;
            opacity: 0.7;

            .exam-btn {
              background: linear-gradient(135deg, #D1D5DB, #9CA3AF);
              cursor: not-allowed;

              &:hover {
                transform: none;
                box-shadow: none;
              }
            }
          }

          .exam-status {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            z-index: 2;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

            &.available {
              background: linear-gradient(135deg, @secondary-color, #34D399);
              color: white;
            }

            &.upcoming {
              background: linear-gradient(135deg, @warning-color, #FBBF24);
              color: white;
            }

            &.expired {
              background: linear-gradient(135deg, @danger-color, #F87171);
              color: white;
            }
          }

          .exam-content {
            padding: 24px;
            flex: 1;

            .exam-header {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              margin-bottom: 16px;

              .exam-icon-wrapper {
                width: 48px;
                height: 48px;
                border-radius: 8px;
                background: linear-gradient(135deg, @primary-color, @primary-light);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;

                i {
                  color: white;
                  font-size: 24px;
                }
              }

              .exam-info {
                flex: 1;
                min-width: 0;

                .exam-title {
                  font-size: 18px;
                  font-weight: 600;
                  color: @text-primary;
                  margin: 0 0 4px 0;
                  line-height: 1.4;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }

                .exam-code {
                  font-size: 12px;
                  color: @text-secondary;
                }
              }
            }

            .exam-desc {
              color: @text-secondary;
              font-size: 14px;
              line-height: 1.5;
              margin-bottom: 20px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              min-height: 42px;
            }

            .exam-meta {
              .meta-item {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
                padding: 12px;
                background: @bg-color;
                border-radius: 8px;
                border: 1px solid @border-color;

                &:last-child {
                  margin-bottom: 0;
                }

                .meta-icon {
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  background: rgba(@primary-color, 0.1);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;

                  i {
                    color: @primary-color;
                    font-size: 16px;
                  }
                }

                .meta-content {
                  flex: 1;
                  min-width: 0;

                  .meta-label {
                    font-size: 12px;
                    color: @text-secondary;
                    margin-bottom: 2px;
                  }

                  .meta-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: @text-primary;
                  }
                }
              }
            }
          }

          .exam-action {
            padding: 20px;
            border-top: 1px solid @border-color;
            background: @bg-color;

            .exam-btn {
              width: 100%;
              background: linear-gradient(135deg, @primary-color, @primary-light);
              border: none;
              border-radius: 8px;
              padding: 12px;
              font-weight: 500;
              transition: all 0.3s;

              &:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
              }

              &.disabled-btn {
                background: linear-gradient(135deg, #D1D5DB, #9CA3AF);
                cursor: not-allowed;

                &:hover {
                  transform: none;
                  box-shadow: none;
                }
              }
            }
          }
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

  .exams-table-container {
    .table-wrapper {
      padding: 20px;

      .exams-grid {
        .exam-col {
          margin-bottom: 16px;
        }
      }
    }
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .exam-center-container {
    padding: 16px;
  }
}
</style>

