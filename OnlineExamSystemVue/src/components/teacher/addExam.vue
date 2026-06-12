<template>
  <div class="add-exam-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">添加考试</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/selectExam' }">考试管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加考试</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="$router.push('/selectExam')"
            class="back-btn"
          >
            返回列表
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表单卡片 -->
    <div class="form-card">
      <div class="card-header">
        <div class="card-icon">
          <i class="el-icon-s-opportunity"></i>
        </div>
        <div class="card-title">
          <h3>创建新考试</h3>
          <p>填写考试相关信息，创建新的考试试卷</p>
        </div>
      </div>

      <div class="card-content">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="120px"
          label-position="top"
          class="exam-form"
        >
          <!-- 第一行：课程选择和试卷名称 -->
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="所属课程" prop="courseId" class="form-item">
                <el-select
                  v-model="form.courseId"
                  placeholder="请选择课程"
                  @change="handleCourseChange"
                  class="course-select"
                  size="medium"
                >
                  <el-option
                    v-for="course in teacherCourses"
                    :key="course.courseId"
                    :label="course.courseName + ' (' + course.courseCode + ')'"
                    :value="course.courseId"
                  >
                    <div class="course-option">
                      <div class="course-name">{{ course.courseName }}</div>
                      <div class="course-code">{{ course.courseCode }}</div>
                    </div>
                  </el-option>
                </el-select>
                <div class="form-hint">
                  <i class="el-icon-info hint-icon"></i>
                  只能选择您教授的课程
                </div>
              </el-form-item>
            </div>

            <div class="form-column">
              <el-form-item label="试卷名称" prop="source" class="form-item">
                <el-input
                  v-model="form.source"
                  placeholder="请输入试卷名称"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-edit"></i>
                  </template>
                </el-input>
                <div class="form-hint">
                  建议使用"课程名称 + 考试类型"的格式
                </div>
              </el-form-item>
            </div>
          </div>

          <!-- 第二行：学院和专业 -->
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="所属学院" prop="institute" class="form-item">
                <el-input
                  v-model="form.institute"
                  placeholder="请输入所属学院"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-office-building"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>

            <div class="form-column">
              <el-form-item label="所属专业" prop="major" class="form-item">
                <el-input
                  v-model="form.major"
                  placeholder="请输入所属专业"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-reading"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <!-- 第三行：年级和开始时间 -->
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="年级" prop="grade" class="form-item">
                <el-input
                  v-model="form.grade"
                  placeholder="请输入年级"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-user"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>

            <div class="form-column">
              <el-form-item label="开始时间" prop="examDate" class="form-item">
                <el-date-picker
                  v-model="form.examDate"
                  type="datetime"
                  placeholder="选择考试开始时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="date-picker"
                  size="medium"
                >
                  <template #prefix>
                    <i class="el-icon-date"></i>
                  </template>
                </el-date-picker>
                <div class="form-hint">
                  请选择考试的具体开始时间（精确到时分秒）
                </div>
              </el-form-item>
            </div>
          </div>

          <!-- 第四行：持续时间和考试类型 -->
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="持续时间" prop="totalTime" class="form-item">
                <div class="time-input-wrapper">
                  <el-input-number
                    v-model="form.totalTime"
                    :min="1"
                    :max="300"
                    placeholder="分钟"
                    size="medium"
                    class="time-input"
                  />
                  <span class="time-unit">分钟</span>
                </div>
                <div class="form-hint">
                  建议考试时长在60-180分钟之间
                </div>
              </el-form-item>
            </div>

            <div class="form-column">
              <el-form-item label="考试类型" prop="type" class="form-item">
                <el-select
                  v-model="form.type"
                  placeholder="请选择考试类型"
                  size="medium"
                  class="type-select"
                >
                  <el-option label="期末考试" value="期末考试" />
                  <el-option label="期中考试" value="期中考试" />
                  <el-option label="模拟考试" value="模拟考试" />
                  <el-option label="随堂测验" value="随堂测验" />
                  <el-option label="单元测试" value="单元测试" />
                  <el-option label="补考" value="补考" />
                  <el-option label="练习测试" value="练习测试" />
                </el-select>
              </el-form-item>
            </div>
          </div>

          <!-- 第五行：试卷描述 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="试卷描述" prop="description" class="form-item">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入试卷描述，包括考试范围、重点内容等"
                  maxlength="300"
                  show-word-limit
                  class="description-textarea"
                />
                <div class="form-hint">
                  简要描述考试内容和要求，最多300字
                </div>
              </el-form-item>
            </div>
          </div>

          <!-- 第六行：考生提示 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="考生提示" prop="tips" class="form-item">
                <el-input
                  v-model="form.tips"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入考生提示信息，如注意事项、考试规则等"
                  maxlength="500"
                  show-word-limit
                  class="tips-textarea"
                />
                <div class="form-hint">
                  填写考试注意事项和规则，最多500字
                </div>
              </el-form-item>
            </div>
          </div>

          <!-- 表单操作按钮 -->
          <div class="form-actions">
            <el-button
              type="primary"
              icon="el-icon-check"
              @click="onSubmit()"
              :loading="submitting"
              class="submit-btn"
              size="medium"
            >
              立即创建
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-close"
              @click="cancel()"
              class="cancel-btn"
              size="medium"
            >
              取消
            </el-button>
            <el-button
              type="default"
              icon="el-icon-refresh"
              @click="resetForm"
              class="reset-btn"
              size="medium"
            >
              重置
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        courseId: null,
        source: null,
        description: null,
        institute: null,
        major: null,
        grade: null,
        examDate: null,
        totalTime: null,
        totalScore: null,
        type: null,
        tips: null,
        paperId: null,
      },
      teacherCourses: [],
      submitting: false,
      rules: {
        courseId: [
          { required: true, message: '请选择所属课程', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请输入试卷名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入试卷描述', trigger: 'blur' },
          { max: 300, message: '长度不能超过 300 个字符', trigger: 'blur' }
        ],
        institute: [
          { required: true, message: '请输入所属学院', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入所属专业', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' }
        ],
        examDate: [
          { required: true, message: '请选择考试开始时间', trigger: 'blur' }
        ],
        totalTime: [
          { required: true, message: '请输入考试时长', trigger: 'blur' },
          { type: 'number', min: 1, max: 300, message: '时长应在1-300分钟之间', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入考试类型', trigger: 'blur' }
        ],
        tips: [
          { required: true, message: '请输入考生提示', trigger: 'blur' },
          { max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.loadTeacherCourses();
  },
  methods: {
    formatTime(date) {
      if (!date) return '';
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day =
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10
          ? "0" + date.getMinutes()
          : date.getMinutes();
      let seconds =
        date.getSeconds() < 10
          ? "0" + date.getSeconds()
          : date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },

    loadTeacherCourses() {
      this.$axios.get('/teacher/courses').then((res) => {
        if (res.data.code === 200) {
          this.teacherCourses = res.data.data || [];
          if (this.teacherCourses.length === 0) {
            this.$message.warning('您目前没有教授的课程，无法创建考试');
          }
        }
      }).catch((error) => {
        this.$message.error('加载课程列表失败');
      });
    },

    handleCourseChange(courseId) {
      const course = this.teacherCourses.find(c => c.courseId === courseId);
      if (course) {
        this.form.source = course.courseName + '考试';
        this.form.institute = course.institute || '';
        this.form.major = course.major || '';
        this.form.grade = course.grade || '';
      }
    },

    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('请检查表单填写是否正确');
          return;
        }

        this.submitting = true;

        this.$axios(`/examManagePaperId`).then((res) => {
          let paperId;
          if (res.data.data && res.data.data.paperId) {
            paperId = res.data.data.paperId + 1;
          } else {
            paperId = 1000;
          }

          this.form.paperId = paperId;

          let examData = { ...this.form };
          if (examData.examDate && typeof examData.examDate === 'object') {
            const date = new Date(examData.examDate);
            examData.examDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
          } else if (typeof examData.examDate === 'string' && examData.examDate.length > 19) {
            examData.examDate = examData.examDate.substring(0, 19);
          }

          this.$axios({
            url: "/exam",
            method: "post",
            data: examData,
          }).then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "考试创建成功",
                type: "success",
                duration: 2000,
                showClose: true
              });

              setTimeout(() => {
                this.$router.push({ path: "/selectExam" });
              }, 1500);
            } else {
              this.$message.error(res.data.message || '创建失败');
            }
          }).catch((error) => {
            console.error('创建考试失败:', error);
            this.$message.error('创建考试失败，请稍后重试');
          }).finally(() => {
            this.submitting = false;
          });
        }).catch((error) => {
          console.error('获取试卷ID失败:', error);
          this.$message.error('系统错误，请稍后重试');
          this.submitting = false;
        });
      });
    },

    cancel() {
      this.$confirm('确定要取消吗？未保存的信息将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$router.push({ path: "/selectExam" });
      }).catch(() => {});
    },

    resetForm() {
      this.$confirm('确定要重置表单吗？所有已填信息将被清空', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.form = {
          courseId: null,
          source: null,
          description: null,
          institute: null,
          major: null,
          grade: null,
          examDate: null,
          totalTime: null,
          totalScore: null,
          type: null,
          tips: null,
          paperId: null,
        };
        this.$message.success('表单已重置');
      }).catch(() => {});
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

.add-exam-container {
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
    align-items: center;

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
      .back-btn {
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

// 表单卡片
.form-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-md;
  overflow: hidden;
  margin-bottom: 24px;

  .card-header {
    display: flex;
    align-items: center;
    padding: 24px;
    background: linear-gradient(135deg, @primary-color, @primary-light);

    .card-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;

      i {
        font-size: 28px;
        color: white;
      }
    }

    .card-title {
      h3 {
        font-size: 20px;
        font-weight: 600;
        color: white;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
      }
    }
  }

  .card-content {
    padding: 32px;

    .exam-form {
      .form-row {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        .form-column {
          flex: 1;

          &.full-width {
            flex: 100%;
          }
        }
      }

      .form-item {
        margin-bottom: 0;

        .label-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          .required-mark {
            color: @danger-color;
            margin-right: 4px;
            font-size: 16px;
          }

          .label-text {
            font-size: 14px;
            font-weight: 600;
            color: @text-primary;
          }
        }

        /deep/ .el-form-item__content {
          line-height: normal;
        }

        .course-select,
        .form-input,
        .date-picker,
        .type-select {
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

        .course-select {
          /deep/ .el-select-dropdown__item {
            padding: 12px 20px;

            .course-option {
              .course-name {
                font-weight: 500;
                color: @text-primary;
                margin-bottom: 4px;
              }

              .course-code {
                font-size: 12px;
                color: @text-secondary;
              }
            }
          }
        }

        .time-input-wrapper {
          display: flex;
          align-items: center;

          .time-input {
            flex: 1;

            /deep/ .el-input__inner {
              border-radius: 8px;
              border: 1px solid @border-color;
              text-align: center;
            }
          }

          .time-unit {
            margin-left: 12px;
            color: @text-secondary;
            font-size: 14px;
          }
        }

        .description-textarea,
        .tips-textarea {
          /deep/ .el-textarea__inner {
            border-radius: 8px;
            border: 1px solid @border-color;
            transition: all 0.3s;

            &:focus {
              border-color: @primary-color;
              box-shadow: 0 0 0 2px rgba(@primary-color, 0.1);
            }
          }
        }

        .form-hint {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: @text-secondary;

          .hint-icon {
            margin-right: 6px;
            font-size: 14px;
          }
        }
      }

      .form-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 40px;
        padding-top: 24px;
        border-top: 1px solid @border-color;

        .submit-btn {
          background: linear-gradient(135deg, @primary-color, @primary-light);
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-weight: 500;
          min-width: 140px;

          &:hover {
            box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
          }

          &:active {
            transform: translateY(1px);
          }
        }

        .cancel-btn {
          background: linear-gradient(135deg, @danger-color, #F87171);
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-weight: 500;
          min-width: 140px;

          &:hover {
            box-shadow: 0 4px 12px rgba(@danger-color, 0.3);
          }

          &:active {
            transform: translateY(1px);
          }
        }

        .reset-btn {
          background: linear-gradient(135deg, @info-color, #60A5FA);
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-weight: 500;
          min-width: 140px;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@info-color, 0.3);
          }

          &:active {
            transform: translateY(1px);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .form-row {
    flex-direction: column !important;
    gap: 16px !important;
  }

  .form-column {
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  .add-exam-container {
    padding: 16px;
  }

  .page-header {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .header-right {
      width: 100%;

      .back-btn {
        width: 100%;
      }
    }
  }

  .card-content {
    padding: 20px !important;
  }

  .form-actions {
    flex-direction: column !important;

    .submit-btn,
    .cancel-btn,
    .reset-btn {
      width: 100% !important;
    }
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    text-align: center;

    .card-icon {
      margin-right: 0 !important;
      margin-bottom: 12px;
    }
  }
}
</style>
