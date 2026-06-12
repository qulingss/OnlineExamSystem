<template>
  <div class="student-management-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">学生管理</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生管理</el-breadcrumb-item>
            <el-breadcrumb-item>学生列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addStudent"
              class="add-btn"
              size="medium"
            >
              新增学生
            </el-button>
            <el-button
              type="default"
              icon="el-icon-refresh"
              @click="getStudentGrade"
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
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalStudents }}</span>
          <span class="stat-label">总学生数</span>
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
        <div class="stat-icon grade-icon">
          <i class="el-icon-collection"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.gradeCount }}</span>
          <span class="stat-label">年级数量</span>
        </div>
      </div>
    </div>

    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="card-header">
        <i class="el-icon-search card-icon"></i>
        <h3 class="card-title">学生搜索</h3>
      </div>
      <div class="card-content">
        <el-form :model="condition" label-width="80px" class="search-form">
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="姓名" class="form-item">
                <el-input
                  v-model="condition.name"
                  placeholder="请输入学生姓名"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-user"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="学院" class="form-item">
                <el-input
                  v-model="condition.institute"
                  placeholder="请输入学院名称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-office-building"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="专业" class="form-item">
                <el-input
                  v-model="condition.major"
                  placeholder="请输入专业名称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
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
              <el-form-item label="年级" class="form-item">
                <el-input
                  v-model="condition.grade"
                  placeholder="请输入年级"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-collection"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="班级" class="form-item">
                <el-input
                  v-model="condition.clazz"
                  placeholder="请输入班级"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-school"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="联系方式" class="form-item">
                <el-input
                  v-model="condition.tel"
                  placeholder="请输入联系方式"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="getStudentGrade"
                >
                  <template #prefix>
                    <i class="el-icon-phone"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form-actions">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getStudentGrade"
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

    <!-- 学生列表表格 -->
    <div class="student-table-container">
      <div class="table-header">
        <h3 class="table-title">
          <i class="el-icon-user-solid table-title-icon"></i>
          学生列表
        </h3>
        <div class="table-actions">
          <span class="total-text">共 {{ pagination.total || 0 }} 名学生</span>
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
            prop="studentId"
            label="学生ID"
            width="120"
            sortable
          >
            <template slot-scope="scope">
              <div class="student-id-cell">
                <div class="id-badge">
                  #{{ scope.row.studentId }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="studentName"
            label="姓名"
            width="120"
            sortable
          >
            <template slot-scope="scope">
              <div class="student-cell">
                <div class="student-avatar">
                  {{ scope.row.studentName ? scope.row.studentName.charAt(0) : '?' }}
                </div>
                <div class="student-name">
                  {{ scope.row.studentName }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="institute"
            label="学院"
            width="120"
          >
            <template slot-scope="scope">
              <div class="institute-cell">
                <el-tag class="institute-tag">
                  {{ scope.row.institute || '未分配' }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="major"
            label="专业"
            width="140"
          >
            <template slot-scope="scope">
              <div class="major-cell">
                <el-tag type="info" class="major-tag">
                  {{ scope.row.major || '未分配' }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="grade"
            label="年级"
            width="200"
          >
            <template slot-scope="scope">
              <div class="grade-cell">
                <div class="grade-badge">
                  {{ scope.row.grade || '--' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="clazz"
            label="班级"
            width="100"
          >
            <template slot-scope="scope">
              <div class="class-cell">
                <div class="class-badge">
                  {{ scope.row.clazz || '未分班' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="sex"
            label="性别"
            width="120"
          >
            <template slot-scope="scope">
              <div class="gender-cell">
                <div :class="['gender-badge', scope.row.sex === '男' ? 'male' : 'female']">
                  <i :class="scope.row.sex === '男' ? 'el-icon-male' : 'el-icon-female'"></i>
                  {{ scope.row.sex || '未知' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="tel"
            label="联系方式"
            width="240"
          >
            <template slot-scope="scope">
              <div class="contact-cell">
                <div class="contact-icon">
                  <i class="el-icon-phone"></i>
                </div>
                <div class="contact-number">
                  {{ scope.row.tel || '未登记' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="260"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <div class="action-buttons">
                <el-tooltip content="编辑学生信息" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="checkGrade(scope.row.studentId)"
                    class="edit-btn"
                    size="small"
                  >
                    编辑
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除学生" placement="top">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteById(scope.row.studentId)"
                    class="delete-btn"
                    size="small"
                  >
                    删除
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading && (!((pagination.records || pagination.list) && (pagination.records || pagination.list).length))" class="empty-state">
          <div class="empty-content">
            <i class="el-icon-user empty-icon"></i>
            <p class="empty-title">暂无学生数据</p>
            <p class="empty-desc">当前没有学生记录，点击上方按钮新增学生</p>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addStudent"
              class="empty-btn"
            >
              新增学生
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

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑学生信息"
      :visible.sync="dialogVisible"
      width="600px"
      custom-class="edit-dialog"
      :before-close="handleClose"
    >
      <div class="dialog-content">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          :rules="formRules"
          class="edit-form"
        >
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="姓名" prop="studentName">
                <el-input
                  v-model="form.studentName"
                  placeholder="请输入学生姓名"
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
              <el-form-item label="学院" prop="institute">
                <el-input
                  v-model="form.institute"
                  placeholder="请输入学院"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-office-building"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-column">
              <el-form-item label="专业" prop="major">
                <el-input
                  v-model="form.major"
                  placeholder="请输入专业"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-suitcase"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="年级" prop="grade">
                <el-input
                  v-model="form.grade"
                  placeholder="请输入年级"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-collection"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-column">
              <el-form-item label="班级" prop="clazz">
                <el-input
                  v-model="form.clazz"
                  placeholder="请输入班级"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-school"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="性别" prop="sex">
                <el-select
                  v-model="form.sex"
                  placeholder="请选择性别"
                  size="medium"
                  class="form-select"
                >
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="联系方式" prop="tel">
                <el-input
                  v-model="form.tel"
                  placeholder="请输入联系方式"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-phone"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          class="cancel-btn"
          size="medium"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submit"
          class="confirm-btn"
          size="medium"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        current: 1,
        total: null,
        size: 6,
        records: [] // 添加初始records属性
      },
      loading: false,
      dialogVisible: false,
      form: {},
      condition: {
        name: "",
        tel: "",
        grade: "",
        clazz: "",
        major: "",
        institute: ""
      },
      stats: {
        totalStudents: 0,
        instituteCount: 0,
        majorCount: 0,
        gradeCount: 0
      },
      formRules: {
        studentName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' }
        ],
        institute: [
          { required: true, message: '请输入学院', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入专业', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStudentGrade()
  },
  methods: {
    async getStudentGrade() {
      this.loading = true

      const name = this.condition.name.trim() || "@"
      const grade = this.condition.grade.trim() || "@"
      const tel = this.condition.tel.trim() || "@"
      const institute = this.condition.institute.trim() || "@"
      const major = this.condition.major.trim() || "@"
      const clazz = this.condition.clazz.trim() || "@"

      try {
        let teacherId = this.$route.params.teacherId; // 优先从URL参数获取teacherId
        console.log('URL teacherId:', teacherId);
        
        // 获取当前用户角色：0=管理员，1=教师，2=学生
        const userRole = this.$cookies && (this.$cookies.get && this.$cookies.get("rb_role"));
        console.log('用户角色:', userRole);
        
        // 只有当用户是教师(role="1")时，才使用teacherId
        if (!teacherId && userRole === "1") {
          // 教师端：从登录cookie获取
          const cookieId = this.$cookies && (this.$cookies.get && this.$cookies.get("rb_teacher_id"));
          console.log('Cookie teacherId:', cookieId);
          // 只有当cookieId是有效数字时才使用教师端
          if (cookieId && !isNaN(parseInt(cookieId)) && parseInt(cookieId) > 0) {
            teacherId = cookieId;
            console.log('使用Cookie中的teacherId:', teacherId);
          }
        }
        
        let response;
        
        // 只有教师(role="1")才调用教师端接口，管理员和学生都调用管理员接口
        if (teacherId && !isNaN(parseInt(teacherId)) && parseInt(teacherId) > 0 && userRole === "1") {
          // 教师端：调用教师专属接口
          console.log('调用教师端接口, teacherId:', teacherId);
          response = await this.$axios({
            url: '/teacher/students',
            method: 'GET',
            params: {
              teacherId: parseInt(teacherId),
              current: this.pagination.current,
              size: this.pagination.size,
              name, grade, tel, institute, major, clazz
            }
          })
        } else {
          // 管理员端/学生端：调用管理员专属接口
          console.log('调用管理员端接口 (role=' + userRole + ')');
          response = await this.$axios({
            url: `/students/${this.pagination.current}/${this.pagination.size}/${name}/${grade}/${tel}/${institute}/${major}/${clazz}`,
            method: 'GET'
          })
        }
        
        console.log('请求完成，准备处理响应');
        const data = (response && response.data && response.data.data) ? response.data.data : {}
        console.log('学生数据响应:', data)
        this.pagination = {
          current: this.pagination.current,
          size: this.pagination.size,
          total: data.total || 0,
          records: Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : []),
          list: Array.isArray(data.list) ? data.list : (Array.isArray(data.records) ? data.records : [])
        }
        this.updateStats()
      } catch (error) {
        console.error('获取学生列表失败:', error)
        this.$message.error('获取学生列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    updateStats() {
      const records = this.pagination.records || this.pagination.list || []
      this.stats.totalStudents = this.pagination.total || 0

      const instituteObj = {}
      const majorObj = {}
      const gradeObj = {}

      records.forEach(item => {
        if (item.institute) instituteObj[item.institute] = true
        if (item.major) majorObj[item.major] = true
        if (item.grade) gradeObj[item.grade] = true
      })

      this.stats.instituteCount = Object.keys(instituteObj).length
      this.stats.majorCount = Object.keys(majorObj).length
      this.stats.gradeCount = Object.keys(gradeObj).length
    },

    resetSearch() {
      this.condition = {
        name: "",
        tel: "",
        grade: "",
        clazz: "",
        major: "",
        institute: ""
      }
      this.pagination.current = 1
      this.getStudentGrade()
    },

    handleSizeChange(val) {
      this.pagination.size = val
      this.getStudentGrade()
    },

    handleCurrentChange(val) {
      this.pagination.current = val
      this.getStudentGrade()
    },

    addStudent() {
      this.form = {
        studentName: "",
        institute: "",
        major: "",
        grade: "",
        clazz: "",
        sex: "",
        tel: ""
      }
      this.dialogVisible = true
    },

    async checkGrade(studentId) {
      try {
        const response = await this.$axios(`/student/${studentId}`)
        this.form = response.data.data
        this.dialogVisible = true
      } catch (error) {
        console.error('获取学生信息失败:', error)
        this.$message.error('获取学生信息失败，请稍后重试')
      }
    },

    deleteById(studentId) {
      this.$confirm("确定删除当前学生吗？删除后无法恢复", "警告", {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-dialog'
      }).then(() => {
        this.$axios({
          url: `/student/${studentId}`,
          method: 'delete'
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getStudentGrade()
        }).catch(error => {
          console.error('删除失败:', error)
          this.$message.error('删除失败，请稍后重试')
        })
      }).catch(() => {})
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('请填写完整的表单信息')
          return
        }

        this.dialogVisible = false
        this.$axios({
          url: '/student',
          method: 'put',
          data: {
            ...this.form
          }
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          }
          this.getStudentGrade()
        }).catch(error => {
          console.error('更新失败:', error)
          this.$message.error('更新失败，请稍后重试')
        })
      })
    },

    handleClose(done) {
      this.$confirm('确认关闭？当前编辑的内容将不会被保存。')
        .then(_ => {
          done()
        }).catch(_ => {})
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

.student-management-container {
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
        gap: 12px;

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

// 学生表格容器
.student-table-container {
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

    .student-id-cell {
      .id-badge {
        display: inline-block;
        padding: 6px 12px;
        background: linear-gradient(135deg, @primary-color, @primary-light);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 60px;
        text-align: center;
      }
    }

    .student-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .student-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, @secondary-color, #34D399);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 14px;
      }

      .student-name {
        font-weight: 600;
        color: @text-primary;
      }
    }

    .institute-cell {
      .institute-tag {
        background: rgba(@secondary-color, 0.1);
        color: @secondary-color;
        border: 1px solid rgba(@secondary-color, 0.2);
        border-radius: 12px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 500;
      }
    }

    .major-cell {
      .major-tag {
        background: rgba(@warning-color, 0.1);
        color: @warning-color;
        border: 1px solid rgba(@warning-color, 0.2);
        border-radius: 12px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 500;
      }
    }

    .grade-cell {
      .grade-badge {
        display: inline-block;
        padding: 6px 12px;
        background: linear-gradient(135deg, @info-color, #60A5FA);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 60px;
        text-align: center;
      }
    }

    .class-cell {
      .class-badge {
        display: inline-block;
        padding: 6px 12px;
        background: linear-gradient(135deg, @warning-color, #FBBF24);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 60px;
        text-align: center;
      }
    }

    .gender-cell {
      .gender-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        min-width: 60px;
        justify-content: center;

        &.male {
          background: rgba(@info-color, 0.1);
          color: @info-color;
          border: 1px solid rgba(@info-color, 0.2);
        }

        &.female {
          background: rgba(@danger-color, 0.1);
          color: @danger-color;
          border: 1px solid rgba(@danger-color, 0.2);
        }

        i {
          font-size: 14px;
        }
      }
    }

    .contact-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .contact-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: rgba(@primary-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @primary-color;
          font-size: 16px;
        }
      }

      .contact-number {
        color: @text-primary;
        font-weight: 500;
      }
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 12px;

      .edit-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 6px;
        padding: 6px 16px;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(@primary-color, 0.3);
        }
      }

      .delete-btn {
        background: linear-gradient(135deg, @danger-color, #F87171);
        border: none;
        border-radius: 6px;
        padding: 6px 16px;

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

// 编辑对话框
.edit-dialog {
  border-radius: 12px;

  /deep/ .el-dialog__header {
    border-bottom: 1px solid @border-color;
    padding-bottom: 20px;

    .el-dialog__title {
      color: @text-primary;
      font-weight: 600;
      font-size: 20px;
    }
  }

  /deep/ .el-dialog__body {
    padding: 30px;

    .dialog-content {
      .edit-form {
        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;

          .form-column {
            flex: 1;

            &.full-width {
              flex: 2;
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

            &:focus {
              border-color: @primary-color;
              box-shadow: 0 0 0 2px rgba(@primary-color, 0.1);
            }
          }
        }
      }
    }
  }

  /deep/ .el-dialog__footer {
    border-top: 1px solid @border-color;
    padding: 20px;

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      .cancel-btn {
        background: linear-gradient(135deg, @text-secondary, #9CA3AF);
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        color: white;
        font-weight: 500;

        &:hover {
          box-shadow: 0 4px 12px rgba(@text-secondary, 0.3);
        }
      }

      .confirm-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-weight: 500;

        &:hover {
          box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
        }
      }
    }
  }
}

// 删除确认对话框
.delete-confirm-dialog {
  /deep/ .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: @danger-color;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
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

  .student-table-container {
    .table-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .table-wrapper {
      .action-buttons {
        flex-direction: column;
        gap: 8px;

        .edit-btn,
        .delete-btn {
          width: 100%;
        }
      }
    }
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .edit-dialog {
    /deep/ .el-dialog__body {
      .dialog-content {
        .edit-form {
          .form-row {
            flex-direction: column;
            gap: 16px;
          }
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .student-management-container {
    padding: 16px;
  }
}
</style>












