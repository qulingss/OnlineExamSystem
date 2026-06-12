<template>
  <div class="student-add-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">添加学生</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/studentManage' }">学生管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加学生</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="default"
              icon="el-icon-arrow-left"
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

    <div class="content-grid">
      <!-- 添加学生卡片 -->
      <div class="add-card">
        <div class="card-header">
          <div class="card-header-content">
            <i class="el-icon-user card-icon"></i>
            <h3 class="card-title">学生信息填写</h3>
          </div>
          <div class="card-subtitle">
            请填写学生详细信息，带 <span class="required">*</span> 号为必填项
          </div>
        </div>

        <div class="card-content">
          <el-form
            ref="formRef"
            :model="form"
            :rules="formRules"
            label-width="120px"
            class="add-form"
            label-position="top"
          >
            <div class="form-section">
              <div class="section-title">
                <i class="el-icon-user"></i>
                基本信息
              </div>
              <div class="form-row">
                <div class="form-column">
                  <el-form-item label="姓名" prop="studentName" class="form-item">
                    <el-input
                      v-model="form.studentName"
                      placeholder="请输入学生姓名"
                      size="medium"
                      class="form-input"
                      clearable
                    >
                      <template #prefix>
                        <i class="el-icon-user"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="form-column">
                  <el-form-item label="性别" prop="sex" class="form-item">
                    <el-select
                      v-model="form.sex"
                      placeholder="请选择性别"
                      size="medium"
                      class="form-select"
                      clearable
                    >
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-title">
                <i class="el-icon-school"></i>
                学校信息
              </div>
              <div class="form-row">
                <div class="form-column">
                  <el-form-item label="学院" prop="institute" class="form-item">
                    <el-input
                      v-model="form.institute"
                      placeholder="请输入学院名称"
                      size="medium"
                      class="form-input"
                      clearable
                    >
                      <template #prefix>
                        <i class="el-icon-office-building"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="form-column">
                  <el-form-item label="专业" prop="major" class="form-item">
                    <el-input
                      v-model="form.major"
                      placeholder="请输入专业名称"
                      size="medium"
                      class="form-input"
                      clearable
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
                  <el-form-item label="年级" prop="grade" class="form-item">
                    <el-select
                      v-model="form.grade"
                      placeholder="请选择年级"
                      size="medium"
                      class="form-select"
                      clearable
                    >
                      <el-option v-for="year in gradeOptions" :key="year" :label="year" :value="year"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-column">
                  <el-form-item label="班级" prop="clazz" class="form-item">
                    <el-input
                      v-model="form.clazz"
                      placeholder="请输入班级，如：1班"
                      size="medium"
                      class="form-input"
                      clearable
                    >
                      <template #prefix>
                        <i class="el-icon-school"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-title">
                <i class="el-icon-phone"></i>
                联系信息
              </div>
              <div class="form-row">
                <div class="form-column">
                  <el-form-item label="电话号码" prop="tel" class="form-item">
                    <el-input
                      v-model="form.tel"
                      placeholder="请输入手机号码"
                      size="medium"
                      class="form-input"
                      clearable
                      maxlength="11"
                    >
                      <template #prefix>
                        <i class="el-icon-mobile-phone"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="form-column">
                  <el-form-item label="邮箱" prop="email" class="form-item">
                    <el-input
                      v-model="form.email"
                      placeholder="请输入邮箱地址"
                      size="medium"
                      class="form-input"
                      clearable
                    >
                      <template #prefix>
                        <i class="el-icon-message"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-title">
                <i class="el-icon-lock"></i>
                账号信息
              </div>
              <div class="form-row">
                <div class="form-column">
                  <el-form-item label="身份证号" prop="cardId" class="form-item">
                    <el-input
                      v-model="form.cardId"
                      placeholder="请输入身份证号码"
                      size="medium"
                      class="form-input"
                      clearable
                      maxlength="18"
                    >
                      <template #prefix>
                        <i class="el-icon-credit-card"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="form-column">
                  <el-form-item label="密码" prop="pwd" class="form-item">
                    <el-input
                      v-model="form.pwd"
                      type="password"
                      placeholder="请输入登录密码"
                      size="medium"
                      class="form-input"
                      clearable
                      show-password
                    >
                      <template #prefix>
                        <i class="el-icon-lock"></i>
                      </template>
                    </el-input>
                    <div class="password-tips">
                      密码建议包含字母、数字和特殊字符，长度至少8位
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>

            <!-- 隐藏字段 -->
            <el-input v-model="form.role" type="hidden"></el-input>

            <div class="form-actions">
              <el-button
                type="primary"
                icon="el-icon-check"
                @click="onSubmit"
                class="submit-btn"
                size="medium"
                :loading="loading"
              >
                立即创建
              </el-button>
              <el-button
                type="default"
                icon="el-icon-close"
                @click="resetForm"
                class="reset-btn"
                size="medium"
              >
                清空表单
              </el-button>
              <el-button
                type="info"
                icon="el-icon-arrow-left"
                @click="cancel"
                class="cancel-btn"
                size="medium"
              >
                取消返回
              </el-button>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="tips-card">
        <div class="tips-header">
          <i class="el-icon-info tips-icon"></i>
          <h4 class="tips-title">填写说明</h4>
        </div>
        <div class="tips-content">
          <div class="tip-item">
            <i class="el-icon-check tip-icon"></i>
            <span class="tip-text">请确保所有必填项（带 * 号）都已填写</span>
          </div>
          <div class="tip-item">
            <i class="el-icon-check tip-icon"></i>
            <span class="tip-text">身份证号码和电话号码需符合格式要求</span>
          </div>
          <div class="tip-item">
            <i class="el-icon-check tip-icon"></i>
            <span class="tip-text">密码需包含字母、数字，长度至少8位</span>
          </div>
          <div class="tip-item">
            <i class="el-icon-check tip-icon"></i>
            <span class="tip-text">填写完成后请仔细核对信息</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证规则
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码格式'))
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱地址'))
      } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }

    const validateCardId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号码'))
      } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        callback(new Error('请输入正确的身份证号码格式'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }

    return {
      form: {
        studentName: '',
        grade: '',
        major: '',
        clazz: '',
        institute: '',
        tel: '',
        email: '',
        pwd: '',
        cardId: '',
        sex: '',
        role: 2
      },
      loading: false,
      gradeOptions: ['2025', '2024', '2023', '2022', '2021', '2020'],
      formRules: {
        studentName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        institute: [
          { required: true, message: '请输入学院名称', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入专业名称', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        clazz: [
          { required: true, message: '请输入班级', trigger: 'blur' }
        ],
        tel: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        pwd: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        cardId: [
          { required: true, validator: validateCardId, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loading = true

          this.$axios({
            url: '/student',
            method: 'post',
            data: {
              ...this.form
            }
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: '学生信息添加成功',
                type: 'success',
                duration: 3000
              })

              // 延迟跳转，让用户看到成功消息
              setTimeout(() => {
                this.$router.push({ path: '/studentManage' })
              }, 1500)
            } else {
              this.$message({
                message: res.data.message || '添加失败，请重试',
                type: 'error'
              })
            }
          }).catch(error => {
            console.error('添加学生失败:', error)
            this.$message({
              message: '添加失败，请检查网络连接或稍后重试',
              type: 'error'
            })
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.$message({
            message: '请检查表单填写是否正确',
            type: 'warning'
          })
        }
      })
    },

    resetForm() {
      this.$confirm('确定要清空所有表单内容吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.formRef.resetFields()
        this.$message({
          message: '表单已清空',
          type: 'success'
        })
      }).catch(() => {})
    },

    cancel() {
      this.$confirm('确定要取消添加吗？所有未保存的内容将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/studentManage' })
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

.student-add-container {
  padding: 24px;
  background-color: @bg-color;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// 页面头部
.page-header {
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
        .back-btn {
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

// 添加学生卡片
  .content-grid {
    display: grid;
    grid-template-columns: 2.2fr 1fr;
    gap: 20px;
    align-items: start;
  }

  .add-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-md;
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

      .required {
        color: @danger-color;
        font-weight: bold;
      }
    }
  }

      .card-content {
        padding: 24px 28px;

    .add-form {
        .form-section {
          margin-bottom: 24px;
          padding-bottom: 16px;
        border-bottom: 1px solid @border-color;

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

          .section-title {
            font-size: 17px;
          font-weight: 600;
          color: @primary-color;
            margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      .form-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .form-column {
          flex: 1;
        }
      }

      .form-item {
        /deep/ .el-form-item__label {
          font-weight: 600;
          color: @text-primary;
          padding-bottom: 6px;

          &::before {
            color: @danger-color;
            margin-right: 4px;
          }
        }
      }

      .form-input,
      .form-select {
        width: 100%;

        /deep/ .el-input__inner {
          border-radius: 8px;
          border: 1px solid @border-color;
          transition: all 0.3s;
          height: 40px;

          &:focus {
            border-color: @primary-color;
            box-shadow: 0 0 0 2px rgba(@primary-color, 0.1);
          }
        }

        /deep/ .el-input__prefix {
          display: flex;
          align-items: center;
          color: @text-secondary;
        }
      }

      .password-tips {
        font-size: 12px;
        color: @text-secondary;
        margin-top: 4px;
      }

      .form-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid @border-color;

        .submit-btn {
          background: linear-gradient(135deg, @primary-color, @primary-light);
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-weight: 500;
          font-size: 15px;

          &:hover {
            box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
          }

          &:active {
            transform: translateY(1px);
          }
        }

        .reset-btn {
          background: linear-gradient(135deg, @warning-color, #FBBF24);
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-weight: 500;
          font-size: 15px;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@warning-color, 0.3);
          }
        }

        .cancel-btn {
          background: linear-gradient(135deg, @info-color, #60A5FA);
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-weight: 500;
          font-size: 15px;
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(@info-color, 0.3);
          }
        }
      }
    }
  }
}

// 提示卡片
.tips-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;

  .tips-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: rgba(@secondary-color, 0.1);
    border-bottom: 1px solid rgba(@secondary-color, 0.2);

    .tips-icon {
      color: @secondary-color;
      font-size: 20px;
      margin-right: 12px;
    }

    .tips-title {
      font-size: 16px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
    }
  }

  .tips-content {
    padding: 20px;

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .tip-icon {
        color: @secondary-color;
        font-size: 16px;
        margin-top: 2px;
        flex-shrink: 0;
      }

      .tip-text {
        color: @text-secondary;
        line-height: 1.5;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      gap: 16px;
    }
  }

  .add-card {
    .card-content {
      padding: 20px;

      .add-form {
        .form-row {
          flex-direction: column;
          gap: 16px;
        }

        .form-actions {
          flex-direction: column;
          gap: 12px;

          .submit-btn,
          .reset-btn,
          .cancel-btn {
            width: 100%;
          }
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .student-add-container {
    padding: 16px;
  }
}
</style>
