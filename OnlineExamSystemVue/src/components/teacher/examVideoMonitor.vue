<!-- 考试监控视频查看页面 -->
<template>
  <div class="video-monitor">
    <div class="header">
      <h2>📹 考试监控视频查看</h2>
      <el-form :inline="true" class="search-form">
        <el-form-item label="考试编号">
          <el-input v-model="examCode" placeholder="请输入考试编号" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadVideos">查询视频</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="loading" class="loading">
      <i class="el-icon-loading"></i> 加载中...
    </div>

    <div v-else-if="videoList.length === 0" class="empty">
      <i class="el-icon-warning"></i>
      <p>暂无监控视频</p>
    </div>

    <div v-else class="video-content">
      <!-- 按学生分组显示 -->
      <div v-for="(studentVideos, studentId) in groupedVideos" :key="studentId" class="student-section">
        <div class="student-header">
          <h3>学生ID: {{ studentId }}</h3>
          <span class="video-count">共 {{ studentVideos.length }} 段视频</span>
        </div>
        
        <div class="video-grid">
          <div v-for="video in studentVideos" :key="video.videoId" class="video-item">
            <div class="video-info">
              <p><strong>视频名称:</strong> {{ video.videoName }}</p>
              <p><strong>录制时间:</strong> {{ video.captureTime }}</p>
              <p><strong>视频时长:</strong> {{ video.duration }} 秒</p>
              <p><strong>上传时间:</strong> {{ video.uploadTime }}</p>
            </div>
            <div class="video-player">
              <video 
                :src="getVideoUrl(video.videoPath)" 
                controls 
                preload="metadata"
                style="width: 100%; max-height: 300px;"
                @error="handleVideoError"
              >
                您的浏览器不支持视频播放
              </video>
            </div>
            <div class="video-actions">
              <el-button size="small" type="primary" @click="playVideo(video)">
                <i class="el-icon-video-play"></i> 播放
              </el-button>
              <el-button size="small" @click="downloadVideo(video)">
                <i class="el-icon-download"></i> 下载
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放对话框 -->
    <el-dialog
      title="视频播放"
      :visible.sync="videoDialogVisible"
      width="70%"
      @close="closeVideoDialog"
    >
      <div class="video-dialog-content">
        <video 
          ref="videoPlayer"
          :src="currentVideoUrl" 
          controls 
          autoplay
          style="width: 100%; max-height: 600px;"
        >
          您的浏览器不支持视频播放
        </video>
        <div class="video-dialog-info" v-if="currentVideo">
          <p><strong>视频名称:</strong> {{ currentVideo.videoName }}</p>
          <p><strong>录制时间:</strong> {{ currentVideo.captureTime }}</p>
          <p><strong>视频时长:</strong> {{ currentVideo.duration }} 秒</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ExamVideoMonitor',
  data() {
    return {
      examCode: '',
      videoList: [],
      loading: false,
      videoDialogVisible: false,
      currentVideo: null,
      currentVideoUrl: '',
    };
  },
  computed: {
    // 按学生ID分组视频
    groupedVideos() {
      const grouped = {};
      this.videoList.forEach(video => {
        const studentId = video.studentId;
        if (!grouped[studentId]) {
          grouped[studentId] = [];
        }
        grouped[studentId].push(video);
      });
      // 按录制时间倒序排列
      Object.keys(grouped).forEach(studentId => {
        grouped[studentId].sort((a, b) => {
          return new Date(b.captureTime) - new Date(a.captureTime);
        });
      });
      return grouped;
    }
  },
  created() {
    // 从路由参数获取考试编号
    if (this.$route.query.examCode) {
      this.examCode = this.$route.query.examCode;
      this.loadVideos();
    }
  },
  methods: {
    // 加载视频列表
    async loadVideos() {
      if (!this.examCode) {
        this.$message.warning('请输入考试编号');
        return;
      }

      this.loading = true;
      try {
        console.log('正在请求视频列表，考试编号:', this.examCode);
        const response = await this.$axios.get(`/exam/video/${this.examCode}`);
        console.log('API响应:', response);
        console.log('响应数据:', response.data);
        
        if (response.data.code === 200) {
          this.videoList = response.data.data || [];
          console.log('视频列表:', this.videoList);
          
          if (this.videoList.length === 0) {
            this.$message({
              message: '该考试暂无监控视频。可能原因：1. 学生还未开始考试 2. 学生未允许摄像头权限 3. 视频还未上传',
              type: 'info',
              duration: 5000
            });
          } else {
            this.$message.success(`加载成功，共 ${this.videoList.length} 段视频`);
          }
        } else {
          console.error('API返回错误:', response.data);
          this.$message.error(response.data.message || '加载失败');
          this.videoList = [];
        }
      } catch (error) {
        console.error('加载视频失败:', error);
        console.error('错误详情:', error.response);
        let errorMsg = '请检查网络连接';
        if (error.response && error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        this.$message.error('加载视频失败: ' + errorMsg);
        this.videoList = [];
      } finally {
        this.loading = false;
      }
    },
    // 获取视频URL
    getVideoUrl(videoPath) {
      // 如果路径已经是完整URL，直接返回
      if (videoPath.startsWith('http')) {
        return videoPath;
      }
      // 使用 /api 前缀，通过代理访问后端
      return `/api${videoPath}`;
    },
    // 播放视频
    playVideo(video) {
      this.currentVideo = video;
      this.currentVideoUrl = this.getVideoUrl(video.videoPath);
      this.videoDialogVisible = true;
    },
    // 关闭视频对话框
    closeVideoDialog() {
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause();
      }
      this.currentVideo = null;
      this.currentVideoUrl = '';
    },
    // 下载视频
    downloadVideo(video) {
      const videoUrl = this.getVideoUrl(video.videoPath);
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = video.videoName || `video_${video.videoId}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 处理视频加载错误
    handleVideoError(event) {
      console.error('视频加载失败:', event);
      this.$message.error('视频加载失败，请检查视频文件是否存在');
    }
  }
};
</script>

<style lang="less" scoped>
.video-monitor {
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

  .video-content {
    .student-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      .student-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;

        h3 {
          margin: 0;
          color: #333;
          font-size: 20px;
        }

        .video-count {
          color: #666;
          font-size: 14px;
        }
      }

      .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;

        .video-item {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
          background: #fafafa;
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transform: translateY(-2px);
          }

          .video-info {
            margin-bottom: 10px;

            p {
              margin: 5px 0;
              font-size: 13px;
              color: #666;

              strong {
                color: #333;
                margin-right: 5px;
              }
            }
          }

          .video-player {
            margin-bottom: 10px;
            border-radius: 4px;
            overflow: hidden;
            background: #000;
          }

          .video-actions {
            display: flex;
            gap: 10px;
          }
        }
      }
    }
  }

  .video-dialog-content {
    .video-dialog-info {
      margin-top: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 4px;

      p {
        margin: 8px 0;
        color: #666;

        strong {
          color: #333;
          margin-right: 8px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .video-content .student-section .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>

