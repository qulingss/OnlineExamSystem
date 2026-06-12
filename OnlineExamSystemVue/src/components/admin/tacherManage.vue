<template>
  <div class="teacher-management-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">教师管理</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>教师管理</el-breadcrumb-item>
            <el-breadcrumb-item>教师列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addTeacher"
              class="add-btn"
              size="medium"
            >
              新增教师
            </el-button>
            <el-button
              type="default"
              icon="el-icon-refresh"
              @click="getTeacherInfo"
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
          <span class="stat-value">{{ stats.totalTeachers }}</span>
          <span class="stat-label">总教师数</span>
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
        <div class="stat-icon type-icon">
          <i class="el-icon-medal"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.typeCount }}</span>
          <span class="stat-label">职称数量</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gender-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.genderCount }}</span>
          <span class="stat-label">性别分布</span>
        </div>
      </div>
    </div>

    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="card-header">
        <i class="el-icon-search card-icon"></i>
        <h3 class="card-title">教师搜索</h3>
      </div>
      <div class="card-content">
        <el-form :model="searchForm" label-width="80px" class="search-form">
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="姓名" class="form-item">
                <el-input
                  v-model="searchForm.teacherName"
                  placeholder="请输入教师姓名"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
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
                  v-model="searchForm.institute"
                  placeholder="请输入学院名称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-office-building"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="职称" class="form-item">
                <el-input
                  v-model="searchForm.type"
                  placeholder="请输入职称"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-medal"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form-row">
            <div class="form-column">
              <el-form-item label="性别" class="form-item">
                <el-input
                  v-model="searchForm.sex"
                  placeholder="请输入性别"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-female"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="联系方式" class="form-item">
                <el-input
                  v-model="searchForm.tel"
                  placeholder="请输入联系方式"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-phone"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-column">
              <el-form-item label="邮箱" class="form-item">
                <el-input
                  v-model="searchForm.email"
                  placeholder="请输入邮箱"
                  clearable
                  size="medium"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <i class="el-icon-message"></i>
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

    <!-- 教师列表表格 -->
    <div class="teacher-table-container">
      <div class="table-header">
        <h3 class="table-title">
          <i class="el-icon-user-solid table-title-icon"></i>
          教师列表
        </h3>
        <div class="table-actions">
          <span class="total-text">共 {{ pagination.total || 0 }} 名教师</span>
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
            prop="teacherId"
            label="教师ID"
            width="120"
            sortable
          >
            <template slot-scope="scope">
              <div class="teacher-id-cell">
                <div class="id-badge">
                  #{{ scope.row.teacherId }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="teacherName"
            label="姓名"
            width="120"
            sortable
          >
            <template slot-scope="scope">
              <div class="teacher-cell">
                <div class="teacher-avatar">
                  {{ scope.row.teacherName ? scope.row.teacherName.charAt(0) : '?' }}
                </div>
                <div class="teacher-name">
                  {{ scope.row.teacherName }}
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
            prop="email"
            label="邮箱"
            width="240"
          >
            <template slot-scope="scope">
              <div class="email-cell">
                <div class="email-icon">
                  <i class="el-icon-message"></i>
                </div>
                <div class="email-text">
                  {{ scope.row.email || '未设置' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="type"
            label="职称"
            width="200"
          >
            <template slot-scope="scope">
              <div class="type-cell">
                <div class="type-badge">
                  {{ scope.row.type || '--' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="cardId"
            label="身份证号"
            width="240"
          >
            <template slot-scope="scope">
              <div class="cardid-cell">
                <div class="cardid-icon">
                  <i class="el-icon-document"></i>
                </div>
                <div class="cardid-text">
                  {{ scope.row.cardId || '未登记' }}
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
                <el-tooltip content="编辑教师信息" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="checkGrade(scope.row.teacherId)"
                    class="edit-btn"
                    size="small"
                  >
                    编辑
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除教师" placement="top">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteById(scope.row.teacherId)"
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
            <p class="empty-title">暂无教师数据</p>
            <p class="empty-desc">当前没有教师记录，点击上方按钮新增教师</p>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addTeacher"
              class="empty-btn"
            >
              新增教师
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
      title="编辑教师信息"
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
              <el-form-item label="姓名" prop="teacherName">
                <el-input
                  v-model="form.teacherName"
                  placeholder="请输入教师姓名"
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
            <div class="form-column">
              <el-form-item label="职称" prop="type">
                <el-select
                  v-model="form.type"
                  placeholder="请选择职称"
                  size="medium"
                  class="form-select"
                >
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

          <div class="form-row">
            <div class="form-column">
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
            <div class="form-column">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入邮箱"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-message"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="密码" prop="pwd">
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
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="身份证号" prop="cardId">
                <el-input
                  v-model="form.cardId"
                  placeholder="请输入身份证号码"
                  size="medium"
                  class="form-input"
                >
                  <template #prefix>
                    <i class="el-icon-document"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          
          <!-- 课程选择部分 -->
          <div class="form-row">
            <div class="form-column full-width">
              <el-form-item label="教授课程">
                <el-select
                  v-model="selectedCourses"
                  multiple
                  placeholder="请选择教师教授的课程"
                  size="medium"
                  class="form-input"
                >
                  <el-option
                    v-for="course in courses"
                    :key="course.courseId"
                    :label="`${course.courseCode} - ${course.courseName}`"
                    :value="course.courseId"
                  ></el-option>
                </el-select>
                <div class="form-hint">
                  <span>提示：</span>
                  请选择该教师教授的课程，可多选
                </div>
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
      pagination: {
        current: 1,
        total: null,
        size: 6
      },
      loading: false,
      dialogVisible: false,
      form: {},
      searchForm: {
        teacherName: "",
        institute: "",
        type: "",
        sex: "",
        tel: "",
        email: ""
      },
      stats: {
        totalTeachers: 0,
        instituteCount: 0,
        typeCount: 0,
        genderCount: 0
      },
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
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
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
    };
  },
  created() {
    this.getTeacherInfo();
    this.getAllCourses(); // 获取所有课程
  },
  methods: {
    // 获取所有课程
    getAllCourses() {
      this.$axios(`/courses`)  // 移除/api前缀，因为service实例已经配置了baseURL
        .then(res => {
          this.courses = res.data.data;
        })
        .catch(error => {
          console.error('获取课程列表失败:', error);
          this.$message.error('获取课程列表失败，请稍后重试');
        });
    },
    async getTeacherInfo() {
      this.loading = true;
      try {
        const response = await this.$axios(`/teachers/${this.pagination.current}/${this.pagination.size}`)
        const data = (response && response.data && response.data.data) ? response.data.data : {}
        this.pagination = {
          ...data,
          records: Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : [])
        }
        this.updateStats();
      } catch (error) {
        console.error('获取教师列表失败:', error);
        this.$message.error('获取教师列表失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    updateStats() {
      const records = this.pagination.records || this.pagination.list || []
      this.stats.totalTeachers = this.pagination.total || 0

      const instituteObj = {};
      const typeObj = {};
      const genderObj = {};

      records.forEach(item => {
        if (item.institute) instituteObj[item.institute] = true;
        if (item.type) typeObj[item.type] = true;
        if (item.sex) genderObj[item.sex] = true;
      });

      this.stats.instituteCount = Object.keys(instituteObj).length;
      this.stats.typeCount = Object.keys(typeObj).length;
      this.stats.genderCount = Object.keys(genderObj).length;
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getTeacherInfo();
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getTeacherInfo();
    },
    handleSearch() {
      this.pagination.current = 1;
      this.getTeacherInfo();
    },
    resetSearch() {
      this.searchForm = {
        teacherName: "",
        institute: "",
        type: "",
        sex: "",
        tel: "",
        email: ""
      };
      this.pagination.current = 1;
      this.getTeacherInfo();
    },
    addTeacher() {
      this.$router.push({ path: '/addTeacher' });
    },
    checkGrade(teacherId) {
      this.dialogVisible = true;
      // 清空之前的选择
      this.selectedCourses = [];
      // 获取教师信息
      this.$axios(`/teacher/${teacherId}`)
        .then(res => {
          this.form = res.data.data;
          // 获取教师已选课程
          return this.$axios(`/teacher/courses/${teacherId}`);
        })
        .then(res => {
          // 设置已选课程
          if (res.data.code === 200 && res.data.data) {
            this.selectedCourses = res.data.data.map(course => course.courseId);
          }
        })
        .catch(error => {
          console.error('获取教师信息失败:', error);
          this.$message.error('获取教师信息失败，请稍后重试');
        });
    },
    deleteById(teacherId) {
      this.$confirm("确定删除当前教师吗？删除后无法恢复", "警告", {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-dialog'
      })
        .then(() => {
          this.$axios({
            url: `/teacher/${teacherId}`,
            method: 'delete',
          })
            .then(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getTeacherInfo()
            })
            .catch(error => {
              console.error('删除失败:', error)
              this.$message.error('删除失败，请稍后重试')
            })
        })
        .catch(() => {})
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$axios({
          url: '/teacher',
          method: 'put',
          data: {
            ...this.form
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              // 更新成功后，更新课程关联
              const teacherId = this.form.teacherId;
              // 先删除所有现有关联
              return this.$axios({
                url: `/teacher/courses/${teacherId}`,
                method: 'delete'
              });
            } else {
              throw new Error(res.data.msg || '更新失败');
            }
          })
          .then(() => {
            // 重新添加所有选择的课程关联
            const teacherId = this.form.teacherId;
            if (this.selectedCourses.length > 0) {
              const coursePromises = this.selectedCourses.map(courseId => {
                return this.$axios({
                  url: '/teacher/course',
                  method: 'post',
                  data: {
                    teacherId,
                    courseId
                  }
                });
              });
              return Promise.all(coursePromises);
            }
            return Promise.resolve();
          })
          .then(() => {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getTeacherInfo();
          })
          .catch(error => {
            console.error('更新失败:', error);
            this.$message.error('更新失败，请稍后重试');
          });
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？当前编辑的内容将不会被保存。')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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

.teacher-management-container {
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

      &.type-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
      }

      &.gender-icon {
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

// 教师表格容器
.teacher-table-container {
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

    .teacher-id-cell {
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

    .teacher-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .teacher-avatar {
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

      .teacher-name {
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

    .email-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .email-icon {
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

      .email-text {
        color: @text-primary;
        font-weight: 500;
        word-break: break-all;
      }
    }

    .type-cell {
      .type-badge {
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

    .cardid-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .cardid-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: rgba(@info-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: @info-color;
          font-size: 16px;
        }
      }

      .cardid-text {
        color: @text-primary;
        font-weight: 500;
        word-break: break-all;
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

  .teacher-table-container {
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
  .teacher-management-container {
    padding: 16px;
  }
}
</style>




