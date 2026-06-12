<template>
  <div class="message-center-container">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">交流区</h2>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>交流中心</el-breadcrumb-item>
            <el-breadcrumb-item>留言交流</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getMsg"
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
          <i class="el-icon-chat-dot-round"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalMessages }}</span>
          <span class="stat-label">总留言数</span>
        </div>
        <div class="stat-trend stable">
          <i class="el-icon-minus"></i>
          <span>稳定</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon today-icon">
          <i class="el-icon-date"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.todayMessages }}</span>
          <span class="stat-label">今日新增</span>
        </div>
        <div class="stat-trend up" v-if="stats.todayMessages > 0">
          <i class="el-icon-top"></i>
          <span>+{{ stats.todayMessages }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon reply-icon">
          <i class="el-icon-chat-line-square"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalReplies }}</span>
          <span class="stat-label">总回复数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.activeUsers }}</span>
          <span class="stat-label">活跃用户</span>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 留言发布卡片 -->
      <div class="post-card">
        <div class="card-header">
          <div class="card-header-content">
            <i class="el-icon-edit-outline card-icon"></i>
            <h3 class="card-title">发布新留言</h3>
          </div>
          <div class="card-subtitle">
            分享你的想法，与其他同学和老师交流
          </div>
        </div>

        <div class="card-content">
          <el-form :model="formModel" label-position="top" class="post-form">
            <!-- 标题输入 -->
            <div class="form-item">
              <el-form-item label="留言标题" class="form-label">
                <el-input
                  v-model="formModel.title"
                  placeholder="请输入留言标题（最多50字）"
                  clearable
                  size="medium"
                  class="title-input"
                  :maxlength="50"
                  show-word-limit
                >
                  <template #prefix>
                    <i class="el-icon-tickets"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>

            <!-- 内容输入 -->
            <div class="form-item">
              <el-form-item label="留言内容" class="form-label">
                <el-input
                  v-model="formModel.content"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入留言内容（最多500字）"
                  clearable
                  size="medium"
                  class="content-input"
                  :maxlength="500"
                  show-word-limit
                  resize="none"
                >
                  <template #prefix>
                    <i class="el-icon-document"></i>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-form>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <el-button
              type="primary"
              @click="submit()"
              class="submit-btn"
              size="medium"
              icon="el-icon-send"
              :loading="submitting"
            >
              提交留言
            </el-button>
            <el-button
              type="default"
              @click="clearForm"
              class="clear-btn"
              size="medium"
              icon="el-icon-delete"
            >
              清空内容
            </el-button>
          </div>
        </div>
      </div>

      <!-- 留言列表卡片 -->
      <div class="messages-card">
        <div class="card-header">
          <div class="card-header-content">
            <i class="el-icon-chat-line-round card-icon"></i>
            <h3 class="card-title">留言列表</h3>
          </div>
          <div class="card-subtitle">
            共 {{ pagination.total || 0 }} 条留言
          </div>
        </div>

        <div class="card-content">
          <!-- 留言列表 -->
          <div class="messages-list" v-if="msg.length > 0">
            <div
              class="message-item"
              v-for="(data, index) in msg"
              :key="index"
              :class="{ 'hover-active': flag && index === current }"
              @mouseenter="enter(index)"
              @mouseleave="leave(index)"
            >
              <!-- 留言头部 -->
              <div class="msg-header">
                <div class="msg-user">
                  <div class="user-avatar">
                    <i class="el-icon-user-solid"></i>
                  </div>
                  <div class="user-info">
                    <div class="user-name">匿名用户</div>
                    <div class="msg-time">
                      <i class="el-icon-time time-icon"></i>
                      <span>{{ data.time }}</span>
                    </div>
                  </div>
                </div>
                <div class="msg-title-wrapper">
                  <h3 class="msg-title">{{ data.title }}</h3>
                  <div class="msg-id">#{{ data.id }}</div>
                </div>
              </div>

              <!-- 留言内容 -->
              <div class="msg-content">
                <div class="content-text">{{ data.content }}</div>
              </div>

              <!-- 回复区域 -->
              <div class="replies-section" v-if="data.replays && data.replays.length > 0">
                <div class="replies-header">
                  <i class="el-icon-chat-line-square"></i>
                  <span class="replies-title">回复 ({{ data.replays.length }})</span>
                </div>
                <div class="replies-list">
                  <div class="reply-item" v-for="(replayData, index2) in data.replays" :key="index2">
                    <div class="reply-avatar">
                      <i class="el-icon-user"></i>
                    </div>
                    <div class="reply-content">
                      <div class="reply-text">{{ replayData.replay }}</div>
                      <div class="reply-meta">
                        <span class="reply-time">{{ replayData.replayTime }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 回复按钮 -->
              <div class="msg-actions">
                <el-button
                  type="text"
                  @click="replay(data.id)"
                  class="reply-btn"
                  v-show="flag && index === current"
                  icon="el-icon-chat-dot-round"
                  size="small"
                >
                  回复
                </el-button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div class="empty-state" v-if="msg.length === 0">
            <div class="empty-content">
              <i class="el-icon-chat-line-square empty-icon"></i>
              <p class="empty-title">暂无留言</p>
              <p class="empty-desc">快来发布第一条留言吧～</p>
            </div>
          </div>

          <!-- 分页控件 -->
          <div class="pagination-wrapper" v-if="pagination.total > 0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.current"
              :page-sizes="[4, 6, 8, 10]"
              :page-size="pagination.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
              background
              class="custom-pagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: false,
      current: -1,
      formModel: {
        title: "",
        content: ""
      },
      submitting: false,
      pagination: {
        current: 1,
        total: null,
        size: 4
      },
      msg: [],
      stats: {
        totalMessages: 0,
        todayMessages: 0,
        totalReplies: 0,
        activeUsers: 0
      }
    }
  },
  created() {
    this.getMsg()
    this.updateStats()
  },
  methods: {
    getMsg(silent = false) {
      this.$axios(`/messages/${this.pagination.current}/${this.pagination.size}`).then(res => {
        let status = res.data.code
        if (status == 200) {
          const data = res.data.data || {}
          const records = Array.isArray(data.records) ? data.records : (Array.isArray(data.list) ? data.list : [])
          this.msg = records
          this.pagination = { ...data, records }
          this.updateStats()
        }
      }).catch(error => {
        console.error('获取留言失败:', error)
        if (!silent) this.$message.error('获取留言列表失败，请稍后重试')
      })
    },

    updateStats() {
      const records = this.msg || []
      this.stats.totalMessages = this.pagination.total || 0

      // 计算总回复数和今日新增（这里简化处理，实际项目中应从接口获取）
      let totalReplies = 0
      let todayMessages = 0

      records.forEach(item => {
        if (item.replays) {
          totalReplies += item.replays.length
        }
        // 简单模拟今日新增
        if (records.length > 0) {
          todayMessages = Math.min(2, records.length)
        }
      })

      this.stats.totalReplies = totalReplies
      this.stats.todayMessages = todayMessages
      this.stats.activeUsers = Math.min(10, records.length * 2)
    },

    handleSizeChange(val) {
      this.pagination.size = val
      this.getMsg()
    },

    handleCurrentChange(val) {
      this.pagination.current = val
      this.getMsg()
    },

    submit() {
      if (!this.formModel.title.trim() || !this.formModel.content.trim()) {
        this.$message({
          type: 'error',
          message: '留言标题和内容不能为空',
        })
        return
      }

      this.submitting = true
      const date = new Date()
      this.$axios({
        url: "/message",
        method: "post",
        data: {
          title: this.formModel.title.trim(),
          content: this.formModel.content.trim(),
          time: date
        }
      }).then(res => {
        let code = res.data.code
        if (code == 200) {
          this.$message({
            type: "success",
            message: "留言成功"
          })
          this.formModel.title = ""
          this.formModel.content = ""
          this.getMsg(true)
        } else {
          this.$message.error(res.data.message || '留言失败')
        }
      }).catch(error => {
        console.error('提交留言失败:', error)
        const errorMsg = (error.response && error.response.data && error.response.data.message) || error.message
        this.$message.error('留言提交失败：' + errorMsg)
      }).finally(() => {
        this.submitting = false
      })
    },

    clearForm() {
      this.formModel.title = ""
      this.formModel.content = ""
      this.$message.success('表单已清空')
    },

    replay(messageId) {
      this.$prompt('请输入回复内容', '回复留言', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '回复内容不能为空',
        inputPlaceholder: '请输入你的回复',
        inputType: 'textarea',
        inputRows: 3,
        customClass: 'reply-dialog'
      }).then(({ value }) => {
        let date = new Date('2025-12-15 15:00:00')
        this.$axios({
          url: '/replay',
          method: 'post',
          data: {
            replay: value.trim(),
            replayTime: date,
            messageId: messageId
          }
        }).then(res => {
          this.getMsg()
          this.$message({
            type: 'success',
            message: '回复成功'
          });
        }).catch(error => {
          console.error('回复失败:', error)
          this.$message.error('回复失败，请稍后重试')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消回复'
        });
      });
    },

    enter(index) {
      this.flag = true
      this.current = index
    },

    leave() {
      this.flag = false
      this.current = -1
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

.message-center-container {
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

      &.today-icon {
        background: linear-gradient(135deg, @secondary-color, #34D399);
      }

      &.reply-icon {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
      }

      &.active-icon {
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

// 内容包装器
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

// 发布留言卡片
.post-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;

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
    }
  }

  .card-content {
    padding: 30px;

    .form-item {
      margin-bottom: 24px;

      .form-label {
        /deep/ .el-form-item__label {
          font-weight: 600;
          color: @text-primary;
          padding-bottom: 8px;
          display: block;
        }
      }

      .title-input,
      .content-input {
        width: 100%;

        /deep/ .el-input__inner,
        /deep/ .el-textarea__inner {
          border-radius: 8px;
          border: 1px solid @border-color;
          transition: all 0.3s;

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
    }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid @border-color;

      .submit-btn {
        background: linear-gradient(135deg, @primary-color, @primary-light);
        border: none;
        border-radius: 8px;
        padding: 10px 32px;
        font-weight: 500;
        font-size: 15px;

        &:hover {
          box-shadow: 0 4px 12px rgba(@primary-color, 0.3);
        }
      }

      .clear-btn {
        background: linear-gradient(135deg, @warning-color, #FBBF24);
        border: none;
        border-radius: 8px;
        padding: 10px 32px;
        font-weight: 500;
        color: white;

        &:hover {
          box-shadow: 0 4px 12px rgba(@warning-color, 0.3);
        }
      }
    }
  }
}

// 留言列表卡片
.messages-card {
  background: @card-bg;
  border-radius: 12px;
  box-shadow: @shadow-sm;
  overflow: hidden;
  flex: 1;

  .card-header {
    padding: 24px 30px;
    background: linear-gradient(135deg, @secondary-color, #7C3AED);
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
    }
  }

  .card-content {
    padding: 30px;
    min-height: 400px;

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 30px;

      .message-item {
        padding: 24px;
        border-radius: 8px;
        border: 1px solid @border-color;
        background: white;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
          border-color: @primary-light;
          box-shadow: 0 4px 12px rgba(@primary-color, 0.1);

          &.hover-active {
            border-color: @primary-color;
          }
        }

        .msg-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid @border-color;

          .msg-user {
            display: flex;
            align-items: center;
            gap: 12px;

            .user-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, @primary-color, @primary-light);
              display: flex;
              align-items: center;
              justify-content: center;

              i {
                color: white;
                font-size: 20px;
              }
            }

            .user-info {
              .user-name {
                font-weight: 600;
                color: @text-primary;
                margin-bottom: 4px;
              }

              .msg-time {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 13px;
                color: @text-secondary;

                .time-icon {
                  font-size: 12px;
                }
              }
            }
          }

          .msg-title-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;

            .msg-title {
              font-size: 18px;
              font-weight: 600;
              color: @text-primary;
              margin: 0;
              max-width: 400px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .msg-id {
              background: rgba(@primary-color, 0.1);
              color: @primary-color;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
          }
        }

        .msg-content {
          margin-bottom: 20px;

          .content-text {
            color: @text-primary;
            line-height: 1.6;
            font-size: 15px;
            white-space: pre-wrap;
            word-break: break-word;
          }
        }

        .replies-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid @border-color;

          .replies-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;

            i {
              color: @secondary-color;
              font-size: 16px;
            }

            .replies-title {
              font-weight: 600;
              color: @text-primary;
              font-size: 16px;
            }
          }

          .replies-list {
            .reply-item {
              display: flex;
              gap: 12px;
              padding: 16px;
              background: @bg-color;
              border-radius: 8px;
              margin-bottom: 12px;
              border: 1px solid @border-color;

              &:last-child {
                margin-bottom: 0;
              }

              .reply-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(@info-color, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;

                i {
                  color: @info-color;
                  font-size: 16px;
                }
              }

              .reply-content {
                flex: 1;

                .reply-text {
                  color: @text-primary;
                  line-height: 1.5;
                  margin-bottom: 8px;
                  font-size: 14px;
                }

                .reply-meta {
                  .reply-time {
                    font-size: 12px;
                    color: @text-secondary;
                  }
                }
              }
            }
          }
        }

        .msg-actions {
          position: absolute;
          right: 24px;
          bottom: 24px;

          .reply-btn {
            color: @primary-color;
            font-weight: 500;
            padding: 6px 12px;
            border-radius: 6px;

            &:hover {
              background-color: rgba(@primary-color, 0.1);
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
        }
      }
    }

    .pagination-wrapper {
      padding-top: 20px;
      border-top: 1px solid @border-color;
      display: flex;
      justify-content: center;

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
}

// 响应式设计
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .messages-card {
    .card-content {
      .messages-list {
        .message-item {
          .msg-header {
            .msg-title-wrapper {
              .msg-title {
                max-width: 300px;
              }
            }
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
      gap: 16px;
    }
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .post-card,
  .messages-card {
    .card-content {
      padding: 20px;
    }
  }

  .messages-card {
    .card-content {
      .messages-list {
        .message-item {
          padding: 20px;

          .msg-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;

            .msg-title-wrapper {
              .msg-title {
                max-width: 100%;
                white-space: normal;
              }
            }
          }

          .msg-actions {
            position: static;
            margin-top: 16px;
            text-align: right;
          }
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .message-center-container {
    padding: 16px;
  }

  .post-card {
    .card-content {
      .form-actions {
        flex-direction: column;

        .submit-btn,
        .clear-btn {
          width: 100%;
        }
      }
    }
  }
}
</style>

<style>
/* 回复对话框样式 */
.reply-dialog {
  border-radius: 12px;

  .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: #1F2937;
  }

  .el-message-box__message {
    color: #6B7280;
    line-height: 1.5;
  }

  .el-message-box__input {
    .el-textarea__inner {
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      transition: all 0.3s;

      &:focus {
        border-color: #7C3AED;
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
      }
    }
  }

  .el-message-box__btns {
    .el-button {
      border-radius: 8px;
      padding: 10px 24px;

      &.el-button--primary {
        background: linear-gradient(135deg, #7C3AED, #A78BFA);
        border: none;

        &:hover {
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }
      }
    }
  }
}
</style>
