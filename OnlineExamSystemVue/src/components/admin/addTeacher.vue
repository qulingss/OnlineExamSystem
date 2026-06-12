<template>
  <div class="teacher-add-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">添加教师</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/teacherManage' }">教师管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加教师</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="default"
              icon="el-icon-back"
              @click="cancel"
              class="back-btn"
              size="medium"
            >
              返回列表
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加教师卡片 -->
    <div class="add-teacher-card">
      <div class="card-header">
        <div class="header-icon">
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="header-info">
          <h3 class="card-title">新增教师信息</h3>
          <p class="card-description">请填写教师的基本信息，带 * 的字段为必填项</p>
        </div>
      </div>

      <div class="card-content">
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="100px"
          class="teacher-form"
          label-position="top"
        >
          <!-- 第一行：姓名和学院 -->
          <div class="form-row">
            <div class="form-column">
              <el-form-item prop="teacherName" class="form-item">
                <div class="form-item-label">
                  <span class="required">*</span>
                  姓名
                </div>
                <el-input
                  v-model="form.teacherName"
                  placeholder="请输入教师姓名"
                  size="medium"
                  class="form-input"
                  clearable
                >
                  <template #prefix>
                    <i class="el-icon-user"></i>
                  </template>
                </el-input>
                <div class="form-tips">请填写真实姓名</div>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item prop="institute" class="form-item">
                <div class="form-item-label">
                  <span class="required">*</span>
                  学院
                </div>
                <el-input
                  v-model="form.institute"
                  placeholder="请输入所属学院"
                  size="medium"
                  class="form-input"
                  clearable
                >
                  <template #prefix>
                    <i class="el-icon-office-building"></i>
                  </template>
                </el-input>
                <div class="form-tips">如：计算机学院、经管学院等</div>
              </el-form-item>
            </div>
          </div>

          <!-- 第二行：性别和职称 -->
          <div class="form-row">
            <div class="form-column">
              <el-form-item prop="sex" class="form-item">
                <div class="form-item-label">
                  <span class="required">*</span>
                  性别
                </div>
                <el-select
                  v-model="form.sex"
                  placeholder="请选择性别"
                  size="medium"
                  class="form-select"
                >
                  <template #prefix>
                    <i class="el-icon-female"></i>
                  </template>
                  <el-option label="男" value="男">
                    <div class="option-content">
                      <i class="el-icon-male male-icon"></i>
                      <span>男</span>
                    </div>
                  </el-option>
                  <el-option label="女" value="女">
                    <div class="option-content">
                      <i class="el-icon-female female-icon"></i>
                      <span>女</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item prop="type" class="form-item">
                <div class="form-item-label">
                  <span class="required">*</span>
                  职称
                </div>
                <el-select
                  v-model="form.type"
                  placeholder="请选择职称"
                  size="medium"
                  class="form-select"
                >
                  <template #prefix>
                    <i class="el-icon-medal"></i>
                  </template>
                  <el-option label="教授" value="教授"></el-option>
                  <el-option label="副教授" value="副教授"></el-option>
                  <el-option label="讲师" value="讲师"></el-option>
                  <el-option label="助教" value="助教"></el-option>
                  <el-option label="研究员" value="研究员"></el-option>
                  <el-option label="副研究员" value="副研究员"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <!-- 第三行：电话号码和身份证号 -->
          <div class="form-row">
            <div class="form-column">
              <el-form-item prop="tel" class="form-item">
                <div class="form-item-label">
                  <span class="required">*</span>
                  电话号码
                </div>
                <el-input
                  v-model="form.tel"
                  placeholder="请输入11位手机号码"
                  size="medium"
                  class="form-input"
                  clearable
                  maxlength="11"
                  show-word-limit
                >
                  <template #prefix>
                    <i class="el-icon-phone"></i>
                  </template>
                </el-input>
                <div class="form-tips">请输入11位有效的手机号码</div>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item prop="cardId" class="form-item">
                <div class="form-item-label">
                  <span class="required">*</span>
                  身份证号
                </div>
                <el-input
                  v-model="form.cardId"
                  placeholder="请输入18位身份证号码"
                  size="medium"
                  class="form-input"
                  clearable
                  maxlength="18"
                  show-word-limit
                >
                  <template #prefix>
                    <i class="el-icon-document"></i>
                  </template>
                </el-input>
                <div class="form-tips">请输入18位有效的身份证号码</div>
              </el-form-item>
            </div>
          </div>

          <!-- 第四行：密码 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item prop="pwd" class="form-item">
                <div class="form-item-label">
                  <span class="required">*</span>
                  密码
                </div>
                <el-input
                  v-model="form.pwd"
                  placeholder="请输入登录密码"
                  size="medium"
                  class="form-input"
                  show-password
                  type="password"
                >
                  <template #prefix>
                    <i class="el-icon-lock"></i>
                  </template>
                </el-input>
                <div class="form-tips">建议使用字母、数字和符号的组合</div>
              </el-form-item>
            </div>
          </div>

          <!-- 第五行：教授课程 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item class="form-item">
                <div class="form-item-label">
                  教授课程（可多选）
                </div>
                <el-select
                  v-model="selectedCourses"
                  multiple
                  placeholder="请选择教师教授的课程"
                  size="medium"
                  class="form-select"
                  style="width: 100%"
                >
                  <template #prefix>
                    <i class="el-icon-collection-tag"></i>
                  </template>
                  <el-option
                    v-for="course in courses"
                    :key="course.courseId"
                    :label="course.courseName"
                    :value="course.courseId"
                  >
                    <div class="option-content">
                      <span class="course-code">{{ course.courseCode }}</span>
                      <span class="course-name">{{ course.courseName }}</span>
                    </div>
                  </el-option>
                </el-select>
                <div class="form-tips">请选择该教师教授的课程，可多选</div>
              </el-form-item>
            </div>
          </div>

          <!-- 第六行：备注信息 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item class="form-item">
                <div class="form-item-label">备注信息</div>
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="可填写教师的特殊说明或备注信息"
                  maxlength="200"
                  show-word-limit
                  class="form-textarea"
                />
              </el-form-item>
            </div>
          </div>

          <!-- 表单操作按钮 -->
          <div class="form-actions">
            <div class="form-actions-left">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="onSubmit"
                class="submit-btn"
                size="medium"
                :loading="loading"
              >
                立即创建
              </el-button>
              <el-button
                type="default"
                icon="el-icon-refresh-left"
                @click="resetForm"
                class="reset-btn"
                size="medium"
              >
                重置表单
              </el-button>
            </div>
            <div class="form-actions-right">
              <el-button
                type="danger"
                icon="el-icon-close"
                @click="cancel"
                class="cancel-btn"
                size="medium"
              >
                取消返回
              </el-button>
            </div>
          </div>
        </el-form>
      </div>

      <!-- 表单提示信息 -->
      <div class="form-tips-card">
        <div class="tips-header">
          <i class="el-icon-info tips-icon"></i>
          <span class="tips-title">填写说明</span>
        </div>
        <div class="tips-content">
          <ul class="tips-list">
            <li>请确保所有带 <span class="required-tip">*</span> 的信息都已正确填写</li>
            <li>手机号码必须为11位有效数字</li>
            <li>身份证号码必须为18位有效证件号</li>
            <li>密码是教师登录系统的凭证，请妥善设置</li>
            <li>添加后可在教师管理页面查看和编辑教师信息</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    // 身份证验证
    const validateCardId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号码'))
      } else if (!/^\d{17}[\dXx]$/.test(value)) {
        callback(new Error('请输入正确的18位身份证号码'))
      } else {
        callback()
      }
    }

    return {
      form: {
        teacherName: "",
        institute: "",
        sex: "",
        tel: "",
        pwd: "",
        cardId: "",
        type: "",
        remark: "",
        role: 2
      },
      loading: false,
      formRules: {
        teacherName: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名长度为2-10个字符', trigger: 'blur' }
        ],
        institute: [
          { required: true, message: '请输入所属学院', trigger: 'blur' },
          { min: 2, max: 20, message: '学院名称长度为2-20个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        tel: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
        ],
        cardId: [
          { required: true, validator: validateCardId, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择职称', trigger: 'change' }
        ]
      },
      courses: [], // 所有课程列表
      selectedCourses: [] // 选择的课程
    }
  },
  created() {
    // 获取所有课程
    this.getAllCourses()
  },
  methods: {
    // 获取所有课程
    getAllCourses() {
      this.$axios(`/courses`)  // 移除/api前缀，因为service实例已经配置了baseURL
        .then(res => {
          this.courses = res.data.data
        })
        .catch(error => {
          console.error('获取课程列表失败:', error)
          this.$message.error('获取课程列表失败，请稍后重试')
        })
    },
    // 提交表单
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('请检查表单填写是否完整')
          return
        }

        this.loading = true

        this.$axios({
          url: '/teacher',  // 已在axios配置中设置baseURL为/api
          method: 'post',
          data: {
            ...this.form
          }
        }).then(res => {
          if(res.data.code == 200) {
            // 添加教师成功后，添加课程关联
            const teacherId = res.data.data.teacherId
            if (this.selectedCourses.length > 0) {
              const coursePromises = this.selectedCourses.map(courseId => {
                return this.$axios({
                  url: '/teacher/course',  // 已在axios配置中设置baseURL为/api
                  method: 'post',
                  data: {
                    teacherId,
                    courseId
                  }
                })
              })
              
              Promise.all(coursePromises)
                .then(() => {
                  this.$message.success('教师信息和课程关联添加成功')
                  this.loading = false
                  this.dialogVisible = false
                  this.$emit('teacher-added')
                  this.$router.push('/teacherManage')
                })
                .catch(error => {
                  console.error('添加课程关联失败:', error)
                  this.$message.error('教师信息添加成功，但课程关联失败，请稍后手动添加')
                  this.loading = false
                })
            } else {
              this.$message.success('教师信息添加成功')
              this.loading = false
              this.dialogVisible = false
              this.$emit('teacher-added')
              this.$router.push('/teacherManage')
            }
          } else {
            this.$message.error(res.data.message || '添加教师失败')
            this.loading = false
          }
        }).catch(error => {
          console.error('添加教师失败:', error)
          this.$message.error('添加教师失败，请稍后重试')
          this.loading = false
        })
      })
    },

    // 重置表单
    resetForm() {
      this.$refs.form.resetFields()
      this.form.remark = ""
      this.$message({
        message: '表单已重置',
        type: 'info',
        duration: 1500
      })
    },

    // 取消返回
    cancel() {
      this.$confirm('确定要返回教师列表吗？当前填写的内容将不会被保存。', '提示', {
        confirmButtonText: '确定返回',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'cancel-confirm-dialog'
      }).then(() => {
        this.$router.push({path: '/teacherManage'})
      }).catch(() => {})
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

.teacher-add-container {
  padding: 24px;
  background-color: @bg-color;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
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
            cursor: pointer;

            &:hover {
              color: @primary-light;
            }
          }
        }
      }
    }

    .header-right {
      .header-actions {
        .back-btn {
          background: linear-gradient(135deg, @info-color, #60A5FA);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@info-color, 0.3);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

// 添加教师卡片
.add-teacher-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-md;
  overflow: hidden;
  margin: 0 auto 24px;
  width: 100%;
  max-width: 1200px;

  .card-header {
    display: flex;
    align-items: center;
    padding: 24px;
    background: linear-gradient(135deg, @primary-color, @primary-light);
    gap: 16px;

    .header-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 28px;
        color: white;
      }
    }

    .header-info {
      flex: 1;

      .card-title {
        font-size: 20px;
        font-weight: 600;
        color: white;
        margin: 0 0 8px 0;
      }

      .card-description {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
      }
    }
  }

  .card-content {
    padding: 40px;

    .teacher-form {
      .form-row {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-bottom: 30px;

        .form-column {
          flex: 1 1 320px;
          min-width: 280px;

          &.full-width {
            flex: 1 1 100%;
          }
        }
      }

      .form-item {
        margin-bottom: 0;

        .form-item-label {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: @text-primary;
          margin-bottom: 8px;
          font-size: 14px;

          .required {
            color: @danger-color;
            margin-right: 4px;
            font-size: 16px;
          }
        }

        .form-tips {
          font-size: 12px;
          color: @text-secondary;
          margin-top: 6px;
          line-height: 1.4;
        }

        .form-input,
        .form-select {
          width: 100%;

          /deep/ .el-input__inner {
            border-radius: 8px;
            border: 1px solid @border-color;
            padding: 10px 12px 10px 40px;
            font-size: 14px;
            transition: all 0.3s;
            height: 40px;
            line-height: 20px;

            &:focus {
              border-color: @primary-color;
              box-shadow: 0 0 0 3px rgba(@primary-color, 0.1);
            }
          }

          /deep/ .el-input__prefix {
            left: 12px;
            display: flex;
            align-items: center;

            i {
              color: @text-secondary;
            }
          }
        }

        .form-select {
          /deep/ .el-input__inner {
            padding-left: 40px;
          }
        }

        .form-textarea {
          /deep/ .el-textarea__inner {
            border-radius: 8px;
            border: 1px solid @border-color;
            padding: 12px;
            font-size: 14px;
            transition: all 0.3s;
            resize: vertical;
            min-height: 80px;

            &:focus {
              border-color: @primary-color;
              box-shadow: 0 0 0 3px rgba(@primary-color, 0.1);
            }
          }
        }
      }

      .option-content {
        display: flex;
        align-items: center;
        gap: 8px;

        .male-icon {
          color: @info-color;
        }

        .female-icon {
          color: @danger-color;
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid @border-color;

      .form-actions-left {
        display: flex;
        gap: 16px;
      }

      .form-actions-right {
        .cancel-btn {
          background: linear-gradient(135deg, @danger-color, #F87171);
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-weight: 500;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@danger-color, 0.3);
            transform: translateY(-2px);
          }
        }
      }

      .submit-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-weight: 500;

        &:hover {
          box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
          transform: translateY(-2px);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;

          &:hover {
            transform: none;
            box-shadow: none;
          }
        }
      }

      .reset-btn {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-weight: 500;
        color: white;

        &:hover {
          box-shadow: 0 4px 12px rgba(@warning-color, 0.3);
          transform: translateY(-2px);
        }
      }
    }
  }
}

// 表单提示卡片
.form-tips-card {
  background: linear-gradient(135deg, rgba(@secondary-color, 0.05), rgba(@info-color, 0.05));
  border-radius: 12px;
  margin: 0 24px 24px 24px;
  border: 1px solid rgba(@secondary-color, 0.1);
  overflow: hidden;

  .tips-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, @secondary-color, #34D399);
    gap: 12px;

    .tips-icon {
      font-size: 20px;
      color: white;
    }

    .tips-title {
      font-size: 16px;
      font-weight: 600;
      color: white;
    }
  }

  .tips-content {
    padding: 20px;

    .tips-list {
      margin: 0;
      padding-left: 20px;

      li {
        color: @text-primary;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 1.6;

        &:last-child {
          margin-bottom: 0;
        }

        .required-tip {
          color: @danger-color;
          font-weight: bold;
        }
      }
    }
  }
}

// 取消确认对话框
.cancel-confirm-dialog {
  border-radius: 12px;

  /deep/ .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: @warning-color;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .add-teacher-card {
    .card-content {
      padding: 28px;

      .teacher-form {
        .form-row {
          flex-direction: column;
          gap: 20px;
        }

        .form-actions {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;

          .form-actions-left,
          .form-actions-right {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;

      .header-right {
        .header-actions {
          display: flex;
          justify-content: center;
        }
      }
    }
  }

  .add-teacher-card {
    .card-content {
      padding: 20px;

      .teacher-form {
        .form-row {
          flex-direction: column;
          gap: 20px;
        }

        .form-actions {
          flex-direction: column;
          gap: 20px;

          .form-actions-left,
          .form-actions-right {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .teacher-add-container {
    padding: 16px;
  }

  .add-teacher-card {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
}

// 表单验证样式
/deep/ .el-form-item {
  margin-bottom: 0;

  &.is-error {
    .el-input__inner,
    .el-textarea__inner {
      border-color: @danger-color;

      &:focus {
        box-shadow: 0 0 0 3px rgba(@danger-color, 0.1);
      }
    }
  }

  .el-form-item__error {
    color: @danger-color;
    font-size: 12px;
    margin-top: 4px;
  }
}

// 加载动画
.submit-btn {
  .el-icon-loading {
    animation: rotating 2s linear infinite;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

          <!-- 其他表单字段 -->
          
          <!-- 教授课程 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="教授课程" class="form-item">
                <div class="form-item-label">
                  教授课程（可多选）
                </div>
                <el-select
                  v-model="selectedCourses"
                  multiple
                  placeholder="请选择教师教授的课程"
                  size="medium"
                  class="form-select"
                  style="width: 100%"
                >
                  <template #prefix>
                    <i class="el-icon-collection-tag"></i>
                  </template>
                  <el-option
                    v-for="course in courses"
                    :key="course.courseId"
                    :label="course.courseName"
                    :value="course.courseId"
                  >
                    <div class="option-content">
                      <span class="course-code">{{ course.courseCode }}</span>
                      <span class="course-name">{{ course.courseName }}</span>
                    </div>
                  </el-option>
                </el-select>
                <div class="form-tips">请选择该教师教授的课程，可多选</div>
              </el-form-item>
            </div>
          </div>

          <!-- 备注 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="备注" class="form-item">
                <div class="form-item-label">备注信息</div>
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="可填写教师的特殊说明或备注信息"
                  maxlength="200"
                  show-word-limit
                  class="form-textarea"
                />
              </el-form-item>
            </div>
          </div>

          <!-- 表单操作按钮 -->
          <div class="form-actions">
            <div class="form-actions-left">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="onSubmit"
                class="submit-btn"
                size="medium"
                :loading="loading"
              >
                立即创建
              </el-button>
              <el-button
                type="default"
                icon="el-icon-refresh-left"
                @click="resetForm"
                class="reset-btn"
                size="medium"
              >
                重置表单
              </el-button>
            </div>
            <div class="form-actions-right">
              <el-button
                type="danger"
                icon="el-icon-close"
                @click="cancel"
                class="cancel-btn"
                size="medium"
              >
                取消返回
              </el-button>
            </div>
          </div>
        </el-form>
      </div>

      <!-- 表单提示信息 -->
      <div class="form-tips-card">
        <div class="tips-header">
          <i class="el-icon-info tips-icon"></i>
          <span class="tips-title">填写说明</span>
        </div>
        <div class="tips-content">
          <ul class="tips-list">
            <li>请确保所有带 <span class="required-tip">*</span> 的信息都已正确填写</li>
            <li>手机号码必须为11位有效数字</li>
            <li>身份证号码必须为18位有效证件号</li>
            <li>密码是教师登录系统的凭证，请妥善设置</li>
            <li>添加后可在教师管理页面查看和编辑教师信息</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    // 身份证验证
    const validateCardId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号码'))
      } else if (!/^\d{17}[\dXx]$/.test(value)) {
        callback(new Error('请输入正确的18位身份证号码'))
      } else {
        callback()
      }
    }

    return {
      form: {
        teacherName: "",
        institute: "",
        sex: "",
        tel: "",
        pwd: "",
        cardId: "",
        type: "",
        remark: "",
        role: 2
      },
      loading: false,
      formRules: {
        teacherName: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名长度为2-10个字符', trigger: 'blur' }
        ],
        institute: [
          { required: true, message: '请输入所属学院', trigger: 'blur' },
          { min: 2, max: 20, message: '学院名称长度为2-20个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        tel: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
        ],
        cardId: [
          { required: true, validator: validateCardId, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择职称', trigger: 'change' }
        ]
      },
      courses: [], // 所有课程列表
      selectedCourses: [] // 选择的课程
    }
  },
  created() {
    // 获取所有课程
    this.getAllCourses()
  },
  methods: {
    // 获取所有课程
    getAllCourses() {
      this.$axios(`/courses`)  // 移除/api前缀，因为service实例已经配置了baseURL
        .then(res => {
          this.courses = res.data.data
        })
        .catch(error => {
          console.error('获取课程列表失败:', error)
          this.$message.error('获取课程列表失败，请稍后重试')
        })
    },
    // 提交表单
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('请检查表单填写是否完整')
          return
        }

        this.loading = true

        this.$axios({
          url: '/teacher',  // 已在axios配置中设置baseURL为/api
          method: 'post',
          data: {
            ...this.form
          }
        }).then(res => {
          if(res.data.code == 200) {
            // 添加教师成功后，添加课程关联
            const teacherId = res.data.data.teacherId
            if (this.selectedCourses.length > 0) {
              const coursePromises = this.selectedCourses.map(courseId => {
                return this.$axios({
                  url: '/teacher/course',  // 已在axios配置中设置baseURL为/api
                  method: 'post',
                  data: {
                    teacherId,
                    courseId
                  }
                })
              })
              
              Promise.all(coursePromises)
                .then(() => {
                  this.$message.success('教师信息和课程关联添加成功')
                  this.loading = false
                  this.dialogVisible = false
                  this.$emit('teacher-added')
                  this.$router.push('/teacherManage')
                })
                .catch(error => {
                  console.error('添加课程关联失败:', error)
                  this.$message.error('教师信息添加成功，但课程关联失败，请稍后手动添加')
                  this.loading = false
                })
            } else {
              this.$message.success('教师信息添加成功')
              this.loading = false
              this.dialogVisible = false
              this.$emit('teacher-added')
              this.$router.push('/teacherManage')
            }
          } else {
            this.$message.error(res.data.message || '添加教师失败')
            this.loading = false
          }
        }).catch(error => {
          console.error('添加教师失败:', error)
          this.$message.error('添加教师失败，请稍后重试')
          this.loading = false
        })
      })
    },

    // 重置表单
    resetForm() {
      this.$refs.form.resetFields()
      this.form.remark = ""
      this.$message({
        message: '表单已重置',
        type: 'info',
        duration: 1500
      })
    },

    // 取消返回
    cancel() {
      this.$confirm('确定要返回教师列表吗？当前填写的内容将不会被保存。', '提示', {
        confirmButtonText: '确定返回',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'cancel-confirm-dialog'
      }).then(() => {
        this.$router.push({path: '/teacherManage'})
      }).catch(() => {})
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

.teacher-add-container {
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
            cursor: pointer;

            &:hover {
              color: @primary-light;
            }
          }
        }
      }
    }

    .header-right {
      .header-actions {
        .back-btn {
          background: linear-gradient(135deg, @info-color, #60A5FA);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@info-color, 0.3);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

// 添加教师卡片
.add-teacher-card {
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
    gap: 16px;

    .header-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 28px;
        color: white;
      }
    }

    .header-info {
      flex: 1;

      .card-title {
        font-size: 20px;
        font-weight: 600;
        color: white;
        margin: 0 0 8px 0;
      }

      .card-description {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
      }
    }
  }

  .card-content {
    padding: 40px;

    .teacher-form {
      .form-row {
        display: flex;
        gap: 30px;
        margin-bottom: 30px;

        .form-column {
          flex: 1;
          min-width: 0;

          &.full-width {
            flex: 2;
          }
        }
      }

      .form-item {
        margin-bottom: 0;

        .form-item-label {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: @text-primary;
          margin-bottom: 8px;
          font-size: 14px;

          .required {
            color: @danger-color;
            margin-right: 4px;
            font-size: 16px;
          }
        }

        .form-tips {
          font-size: 12px;
          color: @text-secondary;
          margin-top: 6px;
          line-height: 1.4;
        }

        .form-input,
        .form-select {
          width: 100%;

          /deep/ .el-input__inner {
            border-radius: 8px;
            border: 1px solid @border-color;
            padding: 10px 12px 10px 40px;
            font-size: 14px;
            transition: all 0.3s;
            height: 40px;
            line-height: 20px;

            &:focus {
              border-color: @primary-color;
              box-shadow: 0 0 0 3px rgba(@primary-color, 0.1);
            }
          }

          /deep/ .el-input__prefix {
            left: 12px;
            display: flex;
            align-items: center;

            i {
              color: @text-secondary;
            }
          }
        }

        .form-select {
          /deep/ .el-input__inner {
            padding-left: 40px;
          }
        }

        .form-textarea {
          /deep/ .el-textarea__inner {
            border-radius: 8px;
            border: 1px solid @border-color;
            padding: 12px;
            font-size: 14px;
            transition: all 0.3s;
            resize: vertical;
            min-height: 80px;

            &:focus {
              border-color: @primary-color;
              box-shadow: 0 0 0 3px rgba(@primary-color, 0.1);
            }
          }
        }
      }

      .option-content {
        display: flex;
        align-items: center;
        gap: 8px;

        .male-icon {
          color: @info-color;
        }

        .female-icon {
          color: @danger-color;
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid @border-color;

      .form-actions-left {
        display: flex;
        gap: 16px;
      }

      .form-actions-right {
        .cancel-btn {
          background: linear-gradient(135deg, @danger-color, #F87171);
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-weight: 500;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@danger-color, 0.3);
            transform: translateY(-2px);
          }
        }
      }

      .submit-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-weight: 500;

        &:hover {
          box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
          transform: translateY(-2px);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;

          &:hover {
            transform: none;
            box-shadow: none;
          }
        }
      }

      .reset-btn {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-weight: 500;
        color: white;

        &:hover {
          box-shadow: 0 4px 12px rgba(@warning-color, 0.3);
          transform: translateY(-2px);
        }
      }
    }
  }
}

// 表单提示卡片
.form-tips-card {
  background: linear-gradient(135deg, rgba(@secondary-color, 0.05), rgba(@info-color, 0.05));
  border-radius: 12px;
  margin: 0 24px 24px 24px;
  border: 1px solid rgba(@secondary-color, 0.1);
  overflow: hidden;

  .tips-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, @secondary-color, #34D399);
    gap: 12px;

    .tips-icon {
      font-size: 20px;
      color: white;
    }

    .tips-title {
      font-size: 16px;
      font-weight: 600;
      color: white;
    }
  }

  .tips-content {
    padding: 20px;

    .tips-list {
      margin: 0;
      padding-left: 20px;

      li {
        color: @text-primary;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 1.6;

        &:last-child {
          margin-bottom: 0;
        }

        .required-tip {
          color: @danger-color;
          font-weight: bold;
        }
      }
    }
  }
}

// 取消确认对话框
.cancel-confirm-dialog {
  border-radius: 12px;

  /deep/ .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: @warning-color;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;

      .header-right {
        .header-actions {
          display: flex;
          justify-content: center;
        }
      }
    }
  }

  .add-teacher-card {
    .card-content {
      padding: 20px;

      .teacher-form {
        .form-row {
          flex-direction: column;
          gap: 20px;
        }

        .form-actions {
          flex-direction: column;
          gap: 20px;

          .form-actions-left,
          .form-actions-right {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .teacher-add-container {
    padding: 16px;
  }

  .add-teacher-card {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
}

// 表单验证样式
/deep/ .el-form-item {
  margin-bottom: 0;

  &.is-error {
    .el-input__inner,
    .el-textarea__inner {
      border-color: @danger-color;

      &:focus {
        box-shadow: 0 0 0 3px rgba(@danger-color, 0.1);
      }
    }
  }

  .el-form-item__error {
    color: @danger-color;
    font-size: 12px;
    margin-top: 4px;
  }
}

// 加载动画
.submit-btn {
  .el-icon-loading {
    animation: rotating 2s linear infinite;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>