<template>
  <div class="exam-management-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">考试管理</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>考试管理</el-breadcrumb-item>
            <el-breadcrumb-item>考试查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="$router.push('/addExam')"
              class="add-btn"
            >
              添加考试
            </el-button>
            <div class="search-box">
              <el-input
                v-model="searchText"
                placeholder="搜索试卷名称、专业、学院..."
                clearable
                @clear="handleSearchClear"
                @keyup.enter="handleSearch"
                size="medium"
                class="search-input"
              >
                <template #prefix>
                  <i class="el-icon-search"></i>
                </template>
              </el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
                class="search-btn"
              >
                搜索
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon exam-icon">
          <i class="el-icon-s-opportunity"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalExams }}</span>
          <span class="stat-label">总考试数</span>
        </div>
        <div class="stat-trend up">
          <i class="el-icon-top"></i>
          <span>+{{ stats.todayAdded }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active-icon">
          <i class="el-icon-time"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.activeExams }}</span>
          <span class="stat-label">进行中</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon student-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalStudents }}</span>
          <span class="stat-label">参与学生</span>
        </div>
        <div class="stat-trend up">
          <i class="el-icon-top"></i>
          <span>+{{ stats.newStudents }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon score-icon">
          <i class="el-icon-data-line"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.avgScore }}分</span>
          <span class="stat-label">平均分</span>
        </div>
        <div class="stat-trend down">
          <i class="el-icon-bottom"></i>
          <span>-2%</span>
        </div>
      </div>
    </div>

    <!-- 考试列表表格 -->
    <div class="exam-table-container">
      <div class="table-wrapper">
        <el-table
          :data="filteredExams"
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
            width="220"
            sortable
          >
            <template slot-scope="scope">
              <div class="exam-name-cell">
                <div class="exam-icon-wrapper">
                  <i class="el-icon-s-opportunity"></i>
                </div>
                <div class="exam-name-info">
                  <span class="exam-name">{{ scope.row.source }}</span>
                  <span class="exam-code">编码: {{ scope.row.examCode }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="description"
            label="试卷描述"
            width="240"
          >
            <template slot-scope="scope">
              <div class="description-cell">
                {{ scope.row.description || '无描述' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="所属信息"
            width="200"
          >
            <template slot-scope="scope">
              <div class="institute-cell">
                <div class="institute-info">
                  <span class="institute-name">{{ scope.row.institute }}</span>
                  <span class="major-grade">{{ scope.row.major }} / {{ scope.row.grade }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="考试信息"
            width="180"
          >
            <template slot-scope="scope">
              <div class="exam-info-cell">
                <div class="exam-date">
                  <i class="el-icon-date"></i>
                  <span>{{ formatDate(scope.row.examDate) }}</span>
                </div>
                <div class="exam-duration">
                  <i class="el-icon-time"></i>
                  <span>{{ scope.row.totalTime }}分钟</span>
                </div>
                <div class="exam-score">
                  <i class="el-icon-star-on"></i>
                  <span>{{ scope.row.totalScore }}分</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="type"
            label="试卷类型"
            width="120"
            :filters="typeFilters"
            :filter-method="filterType"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="getTypeTagType(scope.row.type)"
                class="type-tag"
              >
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="tips"
            label="考生提示"
            width="160"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div class="tips-cell">
                {{ scope.row.tips || '无提示' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="状态"
            width="100"
            fixed="right"
          >
            <template slot-scope="scope">
              <div class="status-cell">
                <div :class="['status-badge', getExamStatus(scope.row)]">
                  {{ getStatusText(scope.row) }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="320"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <div class="action-buttons">
                <el-tooltip content="试题详情" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-document"
                    size="small"
                    circle
                    @click="getExamDetail(scope.row.examCode, scope.row.paperId)"
                    class="detail-btn"
                  ></el-button>
                </el-tooltip>

                <el-tooltip content="监控视频" placement="top">
                  <el-button
                    type="info"
                    icon="el-icon-video-camera"
                    size="small"
                    circle
                    @click="viewVideos(scope.row.examCode)"
                    class="video-btn"
                  ></el-button>
                </el-tooltip>

                <el-tooltip content="切换记录" placement="top">
                  <el-button
                    type="warning"
                    icon="el-icon-refresh"
                    size="small"
                    circle
                    @click="viewPageSwitch(scope.row.examCode)"
                    class="switch-btn"
                  ></el-button>
                </el-tooltip>

                <el-tooltip content="编辑考试" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    circle
                    @click="edit(scope.row.examCode)"
                    class="edit-btn"
                  ></el-button>
                </el-tooltip>

                <el-tooltip content="删除考试" placement="top">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    circle
                    @click="deleteRecord(scope.row.examCode)"
                    class="delete-btn"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading && filteredExams.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-s-management empty-icon"></i>
            <p class="empty-title">暂无考试数据</p>
            <p class="empty-desc">当前没有考试记录，点击上方按钮添加新考试</p>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="$router.push('/addExam')"
              class="empty-btn"
            >
              添加考试
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
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          background
          class="custom-pagination"
        />
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑考试信息"
      :visible.sync="dialogVisible"
      width="600px"
      class="edit-dialog"
      :before-close="handleClose"
    >
      <div class="dialog-content">
        <el-form
          ref="editForm"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="edit-form"
        >
          <div class="form-row">
            <el-form-item label="试卷名称" prop="source">
              <el-input
                v-model="form.source"
                placeholder="请输入试卷名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="试卷类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择试卷类型"
                style="width: 100%"
              >
                <el-option label="期末考试" value="期末考试" />
                <el-option label="期中考试" value="期中考试" />
                <el-option label="模拟考试" value="模拟考试" />
                <el-option label="练习测试" value="练习测试" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="试卷描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="2"
              placeholder="请输入试卷描述"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <div class="form-row">
            <el-form-item label="所属学院" prop="institute">
              <el-input
                v-model="form.institute"
                placeholder="请输入所属学院"
                clearable
              />
            </el-form-item>
            <el-form-item label="所属专业" prop="major">
              <el-input
                v-model="form.major"
                placeholder="请输入所属专业"
                clearable
              />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="年级" prop="grade">
              <el-input
                v-model="form.grade"
                placeholder="请输入年级"
                clearable
              />
            </el-form-item>
            <el-form-item label="开始时间" prop="examDate">
              <el-date-picker
                v-model="form.examDate"
                type="datetime"
                placeholder="选择考试开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="持续时间" prop="totalTime">
              <el-input-number
                v-model="form.totalTime"
                :min="1"
                :max="480"
                placeholder="分钟"
                style="width: 100%"
              />
              <span class="unit">分钟</span>
            </el-form-item>
            <el-form-item label="总分" prop="totalScore">
              <el-input-number
                v-model="form.totalScore"
                :min="1"
                :max="200"
                placeholder="总分"
                style="width: 100%"
              />
              <span class="unit">分</span>
            </el-form-item>
          </div>

          <el-form-item label="考生提示" prop="tips">
            <el-input
              v-model="form.tips"
              type="textarea"
              :rows="3"
              placeholder="请输入考生提示信息"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="cancel-btn">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitEdit"
          :loading="submitting"
          class="submit-btn"
        >
          确定保存
        </el-button>
      </div>
    </el-dialog>

    <!-- 试卷详情对话框 -->
    <el-dialog
      :title="`试卷详情 - ${examData.source}`"
      :visible.sync="showExamDetail"
      width="800px"
      class="exam-detail-dialog"
    >
      <div class="exam-detail-content">
        <!-- 试卷基本信息 -->
        <div class="exam-base-info">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">试卷编码:</span>
              <span class="info-value">{{ examDetailCode }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">试卷ID:</span>
              <span class="info-value">{{ examDetailPaperId }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">开始时间:</span>
              <span class="info-value">{{ formatDate(examData.examDate) }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">总时长:</span>
              <span class="info-value">{{ examData.totalTime }}分钟</span>
            </div>
            <div class="info-item">
              <span class="info-label">总分:</span>
              <span class="info-value">{{ examData.totalScore }}分</span>
            </div>
            <div class="info-item">
              <span class="info-label">类型:</span>
              <el-tag :type="getTypeTagType(examData.type)" size="small">
                {{ examData.type }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 题目统计 -->
        <div class="exam-stats">
          <div class="stat-item">
            <div class="stat-icon choice-icon">
              <i class="el-icon-circle-check"></i>
            </div>
            <div class="stat-content">
              <span class="stat-count">{{ topicCount[0] || 0 }}题</span>
              <span class="stat-label">选择题</span>
              <span class="stat-score">{{ score[0] || 0 }}分</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon fill-icon">
              <i class="el-icon-edit"></i>
            </div>
            <div class="stat-content">
              <span class="stat-count">{{ topicCount[1] || 0 }}题</span>
              <span class="stat-label">填空题</span>
              <span class="stat-score">{{ score[1] || 0 }}分</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon judge-icon">
              <i class="el-icon-question"></i>
            </div>
            <div class="stat-content">
              <span class="stat-count">{{ topicCount[2] || 0 }}题</span>
              <span class="stat-label">判断题</span>
              <span class="stat-score">{{ score[2] || 0 }}分</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon total-icon">
              <i class="el-icon-s-data"></i>
            </div>
            <div class="stat-content">
              <span class="stat-count">{{ totalQuestions }}题</span>
              <span class="stat-label">总计</span>
              <span class="stat-score">{{ totalScore }}分</span>
            </div>
          </div>
        </div>

        <!-- 题目列表 -->
        <div class="question-list">
          <el-collapse v-model="activeCollapse" class="question-collapse">
            <!-- 选择题 -->
            <el-collapse-item name="1" v-if="topic[1] && topic[1].length">
              <template slot="title">
                <div class="collapse-header">
                  <div class="collapse-title">
                    <i class="el-icon-circle-check"></i>
                    <span>选择题 ({{ topicCount[0] }}题，共{{ score[0] }}分)</span>
                  </div>
                  <el-tag type="primary" size="small">单选</el-tag>
                </div>
              </template>
              <div class="question-items">
                <div
                  v-for="(question, index) in topic[1]"
                  :key="question.questionId"
                  class="question-item"
                >
                  <div class="question-header">
                    <span class="question-index">{{ index + 1 }}.</span>
                    <span class="question-content">{{ question.question }}</span>
                    <span class="question-score">{{ question.score }}分</span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="deleteQuestion(1, question.questionId)"
                      class="delete-question-btn"
                    >
                      移除
                    </el-button>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 填空题 -->
            <el-collapse-item name="2" v-if="topic[2] && topic[2].length">
              <template slot="title">
                <div class="collapse-header">
                  <div class="collapse-title">
                    <i class="el-icon-edit"></i>
                    <span>填空题 ({{ topicCount[1] }}题，共{{ score[1] }}分)</span>
                  </div>
                  <el-tag type="success" size="small">填空</el-tag>
                </div>
              </template>
              <div class="question-items">
                <div
                  v-for="(question, index) in topic[2]"
                  :key="question.questionId"
                  class="question-item"
                >
                  <div class="question-header">
                    <span class="question-index">{{ totalQuestionsStart[1] + index + 1 }}.</span>
                    <span class="question-content">{{ question.question }}</span>
                    <span class="question-score">{{ question.score }}分</span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="deleteQuestion(2, question.questionId)"
                      class="delete-question-btn"
                    >
                      移除
                    </el-button>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 判断题 -->
            <el-collapse-item name="3" v-if="topic[3] && topic[3].length">
              <template slot="title">
                <div class="collapse-header">
                  <div class="collapse-title">
                    <i class="el-icon-question"></i>
                    <span>判断题 ({{ topicCount[2] }}题，共{{ score[2] }}分)</span>
                  </div>
                  <el-tag type="warning" size="small">判断</el-tag>
                </div>
              </template>
              <div class="question-items">
                <div
                  v-for="(question, index) in topic[3]"
                  :key="question.questionId"
                  class="question-item"
                >
                  <div class="question-header">
                    <span class="question-index">{{ totalQuestionsStart[2] + index + 1 }}.</span>
                    <span class="question-content">{{ question.question }}</span>
                    <span class="question-score">{{ question.score }}分</span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="deleteQuestion(3, question.questionId)"
                      class="delete-question-btn"
                    >
                      移除
                    </el-button>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showExamDetail = false" class="close-btn">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        current: 1,
        total: 0,
        size: 10
      },
      loading: false,
      searchText: '',
      stats: {
        totalExams: 0,
        todayAdded: 0,
        activeExams: 0,
        totalStudents: 0,
        newStudents: 0,
        avgScore: 0
      },
      form: {},
      rules: {
        source: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入试卷描述', trigger: 'blur' }],
        institute: [{ required: true, message: '请输入所属学院', trigger: 'blur' }],
        major: [{ required: true, message: '请输入所属专业', trigger: 'blur' }],
        grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
        examDate: [{ required: true, message: '请选择考试开始时间', trigger: 'blur' }],
        totalTime: [{ required: true, message: '请输入考试时长', trigger: 'blur' }],
        type: [{ required: true, message: '请选择试卷类型', trigger: 'change' }],
        tips: [{ required: true, message: '请输入考生提示', trigger: 'blur' }]
      },
      dialogVisible: false,
      submitting: false,
      showExamDetail: false,
      activeCollapse: ['1', '2', '3'],
      topicCount: [],
      score: [],
      examData: {},
      topic: {},
      examDetailCode: "",
      examDetailPaperId: "",
      typeFilters: [
        { text: '期末考试', value: '期末考试' },
        { text: '期中考试', value: '期中考试' },
        { text: '模拟考试', value: '模拟考试' },
        { text: '练习测试', value: '练习测试' }
      ]
    };
  },
  computed: {
    filteredExams() {
      // 后端分页返回 PageInfo，其中列表字段为 list；兼容 records
      const exams = this.pagination.records || this.pagination.list || [];
      if (!this.searchText.trim()) return exams;

      const search = this.searchText.toLowerCase();
      return exams.filter(exam =>
        (exam.source && exam.source.toLowerCase().includes(search)) ||
        (exam.major && exam.major.toLowerCase().includes(search)) ||
        (exam.institute && exam.institute.toLowerCase().includes(search)) ||
        (exam.description && exam.description.toLowerCase().includes(search))
      );
    },
    totalQuestions() {
      return this.topicCount.reduce((sum, count) => sum + (count || 0), 0);
    },
    totalScore() {
      return this.score.reduce((sum, score) => sum + (score || 0), 0);
    },
    totalQuestionsStart() {
      return [
        0,
        this.topicCount[0] || 0,
        (this.topicCount[0] || 0) + (this.topicCount[1] || 0)
      ];
    }
  },
  created() {
    this.getExamInfo();
  },
  methods: {
    async getExamInfo(silent = false) {
      this.loading = true;
      try {
        // 固定每页10条，不使用 pagination.size
        const currentPage = this.pagination.current || 1;
        const pageSize = 10;
        const response = await this.$axios(`/exams/${currentPage}/${pageSize}`);
        if (response.data.code === 200) {
          const page = response.data.data || {};
          // 兼容 PageInfo：把 list 映射到 records
          this.pagination = {
            current: page.pageNum || 1,
            total: page.total || 0,
            size: pageSize,  // 固定为10
            records: Array.isArray(page.records) ? page.records : (Array.isArray(page.list) ? page.list : [])
          };
          this.updateStats();
        }
      } catch (error) {
        console.error('获取考试列表失败:', error);
        if (!silent) this.$message.error('获取考试列表失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },

    updateStats() {
      const exams = this.pagination.records || this.pagination.list || [];
      this.stats.totalExams = this.pagination.total || 0;
      this.stats.todayAdded = exams.filter(exam => {
        const examDate = new Date(exam.examDate);
        const today = new Date();
        return examDate.toDateString() === today.toDateString();
      }).length;
      this.stats.activeExams = exams.filter(exam => {
        const examDate = new Date(exam.examDate);
        const today = new Date();
        return examDate >= today;
      }).length;
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

    getTypeTagType(type) {
      const typeMap = {
        '期末考试': 'danger',
        '期中考试': 'warning',
        '模拟考试': 'success',
        '练习测试': 'info'
      };
      return typeMap[type] || 'info';
    },

    getExamStatus(exam) {
      const examDate = new Date(exam.examDate);
      const today = new Date();
      if (examDate < today) return 'expired';
      if (examDate.toDateString() === today.toDateString()) return 'active';
      return 'upcoming';
    },

    getStatusText(exam) {
      const status = this.getExamStatus(exam);
      const statusMap = {
        'expired': '已结束',
        'active': '进行中',
        'upcoming': '未开始'
      };
      return statusMap[status] || '未知';
    },

    handleSizeChange(val) {
      this.pagination.size = val;
      this.pagination.current = 1;
      console.log('=== 分页变更 (size) ===', {
        current: this.pagination.current,
        size: this.pagination.size
      });
      this.getExamInfo();
    },

    handleCurrentChange(val) {
      this.pagination.current = val;
      console.log('=== 分页变更 (current) ===', {
        current: this.pagination.current,
        size: this.pagination.size
      });
      this.getExamInfo();
    },

    handleSearch() {
      // 搜索逻辑已在计算属性中处理
    },

    handleSearchClear() {
      this.searchText = '';
    },

    async edit(examCode) {
      this.dialogVisible = true;
      try {
        const response = await this.$axios(`/exam/${examCode}`);
        if (response.data.code === 200) {
          this.form = response.data.data;
        }
      } catch (error) {
        console.error('获取考试详情失败:', error);
        this.$message.error('获取考试详情失败');
      }
    },

    submitEdit() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;

        this.submitting = true;
        try {
          const response = await this.$axios({
            url: "/exam",
            method: "put",
            data: this.form
          });

          if (response.data.code === 200) {
            this.$message.success('考试信息更新成功');
            this.dialogVisible = false;
            // 静默刷新，避免紧随成功提示后又出现失败提示
            this.getExamInfo(true);
          }
        } catch (error) {
          console.error('更新考试失败:', error);
          this.$message.error('更新考试失败');
        } finally {
          this.submitting = false;
        }
      });
    },

    handleClose(done) {
      this.$confirm('确认关闭？未保存的修改将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done();
      }).catch(() => {
      });
    },

    deleteRecord(examCode) {
      this.$confirm('确定删除该考试吗？此操作不可逆！', '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        center: true
      }).then(async () => {
        try {
          const response = await this.$axios({
            url: `/exam/${examCode}`,
            method: "delete"
          });

          if (response.data.code === 200) {
            this.$message.success('删除成功');
            // 静默刷新，避免偶发网络错误导致紧跟一个失败提示
            this.getExamInfo(true);
          }
        } catch (error) {
          console.error('删除失败:', error);
          this.$message.error('删除失败');
        }
      }).catch(() => {
      });
    },

    async getExamDetail(examCode, paperId) {
      this.examDetailCode = examCode;
      this.examDetailPaperId = paperId;
      this.topicCount = [];
      this.score = [];
      this.examData = {};
      this.topic = {};

      this.showExamDetail = true;

      try {
        const examResponse = await this.$axios(`/exam/${examCode}`);
        if (examResponse.data.code === 200) {
          this.examData = {...examResponse.data.data};

          const paperResponse = await this.$axios(`/paper/${paperId}`);
          if (paperResponse.data) {
            this.topic = {...paperResponse.data};
            const keys = Object.keys(this.topic);
            keys.forEach(key => {
              const data = this.topic[key];
              this.topicCount.push(data.length);
              const currentScore = data.reduce((sum, item) => sum + (item.score || 0), 0);
              this.score.push(currentScore);
            });
          }
        }
      } catch (error) {
        console.error('获取试卷详情失败:', error);
        this.$message.error('获取试卷详情失败');
      }
    },

    async deleteQuestion(type, questionId) {
      try {
        await this.$confirm("确认从试卷中移除该试题？", "提示", {
          confirmButtonText: "确定移除",
          cancelButtonText: "取消",
          type: "warning"
        });

        const response = await this.$axios(`/paper/delete/${this.examDetailPaperId}/${type}/${questionId}`);
        if (response.data.code === 200) {
          this.$message.success('试题移除成功');
          this.getExamDetail(this.examDetailCode, this.examDetailPaperId);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('移除试题失败:', error);
          this.$message.error('移除试题失败');
        }
      }
    },

    viewVideos(examCode) {
      this.$router.push({
        path: '/examVideoMonitor',
        query: {examCode: examCode}
      });
    },

    viewPageSwitch(examCode) {
      this.$router.push({
        path: '/pageSwitchMonitor',
        query: {examCode: examCode}
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

    tableRowClassName({row, rowIndex}) {
      return rowIndex % 2 === 1 ? 'even-row' : 'odd-row';
    },

    filterType(value, row) {
      return row.type === value;
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
        display: flex;
        gap: 16px;
        align-items: center;

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

        .search-box {
          display: flex;
          gap: 8px;
          align-items: center;

          .search-input {
            width: 300px;

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

          .search-btn {
            border-radius: 8px;
            padding: 10px 20px;
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

      &.exam-icon {
        background: linear-gradient(135deg, @primary-color, @primary-light);
      }

      &.active-icon {
        background: linear-gradient(135deg, @secondary-color, #34D399);
      }

      &.student-icon {
        background: linear-gradient(135deg, @info-color, #60A5FA);
      }

      &.score-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
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

// 考试表格容器
.exam-table-container {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;

  .table-wrapper {
    padding: 20px;
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

    .exam-name-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .exam-icon-wrapper {
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

      .exam-name-info {
        display: flex;
        flex-direction: column;

        .exam-name {
          font-weight: 600;
          color: @text-primary;
          margin-bottom: 2px;
        }

        .exam-code {
          font-size: 12px;
          color: @text-secondary;
        }
      }
    }

    .institute-cell {
      .institute-info {
        display: flex;
        flex-direction: column;

        .institute-name {
          font-weight: 500;
          color: @text-primary;
          margin-bottom: 4px;
        }

        .major-grade {
          font-size: 12px;
          color: @text-secondary;
        }
      }
    }

    .exam-info-cell {
      > div {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
        font-size: 13px;

        i {
          color: @text-secondary;
          font-size: 14px;
        }

        span {
          color: @text-primary;
        }
      }
    }

    .type-tag {
      border-radius: 12px;
      padding: 4px 12px;
      font-size: 12px;
    }

    .tips-cell {
      font-size: 13px;
      color: @text-secondary;
      line-height: 1.4;
    }

    .status-cell {
      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;

        &.expired {
          background: rgba(@danger-color, 0.1);
          color: @danger-color;
          border: 1px solid rgba(@danger-color, 0.2);
        }

        &.active {
          background: rgba(@secondary-color, 0.1);
          color: @secondary-color;
          border: 1px solid rgba(@secondary-color, 0.2);
        }

        &.upcoming {
          background: rgba(@warning-color, 0.1);
          color: @warning-color;
          border: 1px solid rgba(@warning-color, 0.2);
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;

      .detail-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(@primary-color, 0.3);
        }
      }

      .video-btn {
        background: linear-gradient(135deg, @info-color, #60A5FA);
        border: none;
      }

      .switch-btn {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
        border: none;
      }

      .edit-btn {
        background: linear-gradient(135deg, #10B981, #34D399);
        border: none;
      }

      .delete-btn {
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(@danger-color, 0.3);
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
    padding: 12px 20px 20px;
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

// 编辑对话框
.edit-dialog {
  /deep/ .el-dialog {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
      background: linear-gradient(135deg, @primary-color, @primary-light);
      padding: 20px;

      .el-dialog__title {
        color: white;
        font-size: 18px;
        font-weight: 600;
      }

      .el-dialog__headerbtn {
        .el-dialog__close {
          color: white;
        }
      }
    }
  }

  .dialog-content {
    padding: 20px;

    .edit-form {
      .form-row {
        display: flex;
        gap: 20px;

        .el-form-item {
          flex: 1;
        }
      }

      .unit {
        margin-left: 8px;
        color: @text-secondary;
        font-size: 14px;
      }
    }
  }

  .dialog-footer {
    padding: 16px 20px;
    border-top: 1px solid @border-color;

    .cancel-btn {
      padding: 10px 24px;
      border-radius: 8px;
    }

    .submit-btn {
      background: linear-gradient(135deg, @primary-color, @primary-light);
      border: none;
      padding: 10px 24px;
      border-radius: 8px;

      &:hover {
        box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
      }
    }
  }
}

// 试卷详情对话框
.exam-detail-dialog {
  /deep/ .el-dialog {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
      background: linear-gradient(135deg, @primary-color, @primary-light);
      padding: 20px;

      .el-dialog__title {
        color: white;
        font-size: 18px;
        font-weight: 600;
      }
    }
  }

  .exam-detail-content {
    padding: 20px;

    .exam-base-info {
      background: @bg-color;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;

      .info-row {
        display: flex;
        gap: 24px;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .info-label {
            color: @text-secondary;
            font-size: 14px;
          }

          .info-value {
            color: @text-primary;
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
    }

    .exam-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      .stat-item {
        background: @card-bg;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid @border-color;

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            font-size: 20px;
            color: white;
          }

          &.choice-icon {
            background: linear-gradient(135deg, @primary-color, @primary-light);
          }

          &.fill-icon {
            background: linear-gradient(135deg, @secondary-color, #34D399);
          }

          &.judge-icon {
            background: linear-gradient(135deg, @warning-color, #FBBF24);
          }

          &.total-icon {
            background: linear-gradient(135deg, @info-color, #60A5FA);
          }
        }

        .stat-content {
          display: flex;
          flex-direction: column;

          .stat-count {
            font-size: 16px;
            font-weight: 700;
            color: @text-primary;
            line-height: 1.2;
          }

          .stat-label {
            font-size: 12px;
            color: @text-secondary;
            margin: 2px 0;
          }

          .stat-score {
            font-size: 14px;
            color: @primary-color;
            font-weight: 600;
          }
        }
      }
    }

    .question-list {
      .question-collapse {
        /deep/ .el-collapse-item__header {
          background-color: @bg-color;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          color: @text-primary;

          .collapse-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .collapse-title {
              display: flex;
              align-items: center;
              gap: 8px;

              i {
                font-size: 18px;
              }
            }
          }
        }

        /deep/ .el-collapse-item__wrap {
          background-color: @card-bg;
        }

        /deep/ .el-collapse-item__content {
          padding: 0;
        }

        .question-items {
          padding: 16px;

          .question-item {
            padding: 12px 0;
            border-bottom: 1px solid @border-color;

            &:last-child {
              border-bottom: none;
            }

            .question-header {
              display: flex;
              align-items: flex-start;
              gap: 8px;

              .question-index {
                color: @primary-color;
                font-weight: 600;
                min-width: 24px;
              }

              .question-content {
                flex: 1;
                color: @text-primary;
                line-height: 1.5;
              }

              .question-score {
                color: @warning-color;
                font-weight: 600;
                margin-right: 12px;
              }

              .delete-question-btn {
                color: @danger-color;
                padding: 0;
                height: auto;
              }
            }
          }
        }
      }
    }
  }

  .dialog-footer {
    padding: 16px 20px;
    border-top: 1px solid @border-color;

    .close-btn {
      padding: 10px 24px;
      border-radius: 8px;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .exam-stats {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      gap: 16px;
    }

    .header-actions {
      flex-direction: column;
      width: 100%;

      .search-box {
        width: 100%;

        .search-input {
          width: 100% !important;
        }
      }
    }
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .exam-stats {
    grid-template-columns: 1fr !important;
  }

  .edit-dialog {
    width: 90% !important;

    .form-row {
      flex-direction: column !important;
      gap: 0 !important;
    }
  }
}

@media (max-width: 640px) {
  .exam-management-container {
    padding: 16px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
