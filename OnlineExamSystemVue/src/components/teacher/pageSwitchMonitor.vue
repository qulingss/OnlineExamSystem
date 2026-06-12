<!-- 页面切换记录查看页面 -->
<template>
  <div class="page-switch-monitor">
    <div class="header">
      <h2>⚠️ 页面切换记录查看</h2>
      <el-form :inline="true" class="search-form">
        <el-form-item label="考试编号">
          <el-input v-model="examCode" placeholder="请输入考试编号" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadRecords">查询记录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="loading" class="loading">
      <i class="el-icon-loading"></i> 加载中...
    </div>

    <div v-else-if="recordList.length === 0" class="empty">
      <i class="el-icon-warning"></i>
      <p>暂无页面切换记录</p>
    </div>

    <div v-else class="record-content">
      <!-- 统计信息 -->
      <div class="statistics">
        <el-card>
          <div class="stat-item">
            <span class="label">总切换次数：</span>
            <span class="value">{{ recordList.length }}</span>
          </div>
          <div class="stat-item">
            <span class="label">涉及学生数：</span>
            <span class="value">{{ studentCount }}</span>
          </div>
        </el-card>
      </div>

      <!-- 按学生分组显示 -->
      <div v-for="(studentRecords, studentId) in groupedRecords" :key="studentId" class="student-section">
        <div class="student-header">
          <h3>学生ID: {{ studentId }}</h3>
          <span class="record-count">共 {{ studentRecords.length }} 次切换</span>
          <el-tag type="warning" v-if="studentRecords.length >= 3">
            频繁切换（{{ studentRecords.length }}次）
          </el-tag>
        </div>
        
        <el-table :data="studentRecords" border style="width: 100%">
          <el-table-column prop="switchTime" label="切换时间" width="180"></el-table-column>
          <el-table-column prop="switchType" label="切换类型" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.switchType === 'tab_switch'" type="info">切换标签页</el-tag>
              <el-tag v-else-if="scope.row.switchType === 'window_blur'" type="warning">窗口失焦</el-tag>
              <el-tag v-else-if="scope.row.switchType === 'page_leave'" type="danger">离开页面</el-tag>
              <el-tag v-else>{{ scope.row.switchType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="离开时长（秒）" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.duration">{{ scope.row.duration }} 秒</span>
              <span v-else style="color: #999;">未返回</span>
            </template>
          </el-table-column>
          <el-table-column prop="returnTime" label="返回时间" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.returnTime">{{ scope.row.returnTime }}</span>
              <span v-else style="color: #999;">未返回</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageSwitchMonitor',
  data() {
    return {
      examCode: '',
      recordList: [],
      loading: false
    };
  },
  computed: {
    // 按学生ID分组记录
    groupedRecords() {
      const grouped = {};
      this.recordList.forEach(record => {
        const studentId = record.studentId;
        if (!grouped[studentId]) {
          grouped[studentId] = [];
        }
        grouped[studentId].push(record);
      });
      // 按切换时间倒序排列
      Object.keys(grouped).forEach(studentId => {
        grouped[studentId].sort((a, b) => {
          return new Date(b.switchTime) - new Date(a.switchTime);
        });
      });
      return grouped;
    },
    // 统计学生数量
    studentCount() {
      return Object.keys(this.groupedRecords).length;
    }
  },
  created() {
    // 从路由参数获取考试编号
    if (this.$route.query.examCode) {
      this.examCode = this.$route.query.examCode;
      this.loadRecords();
    }
  },
  methods: {
    // 加载记录列表
    async loadRecords() {
      if (!this.examCode) {
        this.$message.warning('请输入考试编号');
        return;
      }

      this.loading = true;
      try {
        console.log('正在请求页面切换记录，考试编号:', this.examCode);
        const response = await this.$axios.get(`/page/switch/record/${this.examCode}`);
        console.log('API响应:', response);
        console.log('响应数据:', response.data);
        
        if (response.data.code === 200) {
          this.recordList = response.data.data || [];
          console.log('记录列表:', this.recordList);
          
          if (this.recordList.length === 0) {
            this.$message({
              message: '该考试暂无页面切换记录',
              type: 'info',
              duration: 3000
            });
          } else {
            this.$message.success(`加载成功，共 ${this.recordList.length} 条记录`);
          }
        } else {
          console.error('API返回错误:', response.data);
          this.$message.error(response.data.message || '加载失败');
          this.recordList = [];
        }
      } catch (error) {
        console.error('加载记录失败:', error);
        console.error('错误详情:', error.response);
        let errorMsg = '请检查网络连接';
        if (error.response && error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        this.$message.error('加载记录失败: ' + errorMsg);
        this.recordList = [];
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.page-switch-monitor {
  padding: 20px 40px;
  background-color: #f5f5f5;
  min-height: 100vh;

  .header {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 24px;
    }

    .search-form {
      margin-top: 10px;
    }
  }

  .loading {
    text-align: center;
    padding: 40px;
    font-size: 18px;
    color: #666;

    i {
      font-size: 24px;
      margin-right: 10px;
    }
  }

  .empty {
    text-align: center;
    padding: 60px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    i {
      font-size: 48px;
      color: #ccc;
      margin-bottom: 20px;
    }

    p {
      font-size: 18px;
      color: #999;
    }
  }

  .statistics {
    margin-bottom: 20px;

    .el-card {
      .stat-item {
        display: inline-block;
        margin-right: 30px;
        font-size: 16px;

        .label {
          color: #666;
        }

        .value {
          color: #e6a23c;
          font-weight: bold;
          font-size: 20px;
          margin-left: 10px;
        }
      }
    }
  }

  .record-content {
    .student-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      .student-header {
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;

        h3 {
          margin: 0 20px 0 0;
          color: #333;
          font-size: 20px;
        }

        .record-count {
          color: #666;
          font-size: 14px;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>

