
<template>
  <div class="add">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><i class="el-icon-circle-plus"></i>添加试题</span>
        <section class="append">
          <ul>
            <li>
              <span>题目类型:</span>
              <el-select v-model="optionValue" placeholder="请选择题型" class="w150">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '选择题'">
              <span>所属章节：</span>
              <el-input placeholder="请输入对应章节" v-model="postChange.section" class="w150" clearable>
              </el-input>
            </li>
            <li v-if="optionValue == '填空题'">
              <span>所属章节：</span>
              <el-input placeholder="请输入对应章节" v-model="postFill.section" class="w150" clearable>
              </el-input>
            </li>
            <li v-if="optionValue == '判断题'">
              <span>所属章节：</span>
              <el-input placeholder="请输入对应章节" v-model="postJudge.section" class="w150" clearable>
              </el-input>
            </li>
            <li v-if="optionValue == '选择题'">
              <span>难度等级:</span>
              <el-select v-model="postChange.level" placeholder="选择难度等级" class="w150">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '填空题'">
              <span>难度等级:</span>
              <el-select v-model="postFill.level" placeholder="选择难度等级" class="w150">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '判断题'">
              <span>难度等级:</span>
              <el-select v-model="postJudge.level" placeholder="选择难度等级" class="w150">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '选择题'">
              <span>正确选项:</span>
              <el-select v-model="postChange.rightAnswer" placeholder="选择正确答案" class="w150">
                <el-option v-for="item in rights" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <!-- 新增：智能出题数量输入 -->
            <li>
              <span>生成数量:</span>
              <el-input
                v-model="aiGenerateCount"
                placeholder="请输入生成题目数量"
                class="w150"
                type="number"
                min="1"
                max="20"
              ></el-input>
            </li>

            <!-- 新增：智能出题按钮 -->
            <li>
              <el-button
                type="success"
                icon="el-icon-magic-stick"
                @click="generateByAI"
                :loading="aiLoading"
              >
                AI智能生成
              </el-button>
            </li>
          </ul>
          <!-- 新增：知识点输入（单独一行） -->
          <div class="knowledge-point-row">
            <span class="knowledge-point-label">考察知识点:</span>
            <el-input
              v-model="aiKnowledgePoint"
              placeholder="请输入考察的知识点（可选，例如：TCP/IP协议、数据库设计、算法复杂度等）"
              class="knowledge-point-input"
              clearable
            ></el-input>
          </div>
          <!-- 选择题部分 -->
          <div class="change" v-if="optionValue == '选择题'">
            <div class="title">
              <el-tag>题目:</el-tag><span>在下面的输入框中输入题目,形如--DNS
                服务器和DHCP服务器的作用是（）</span>
              <el-input type="textarea" rows="4" v-model="postChange.question" placeholder="请输入题目内容" resize="none"
                        class="answer">
              </el-input>
            </div>
            <div class="options">
              <ul>
                <li>
                  <el-tag type="success">A</el-tag>
                  <el-input placeholder="请输入选项A的内容" v-model="postChange.answerA" clearable="">
                  </el-input>
                </li>
                <li>
                  <el-tag type="success">B</el-tag>
                  <el-input placeholder="请输入选项B的内容" v-model="postChange.answerB" clearable="">
                  </el-input>
                </li>
                <li>
                  <el-tag type="success">C</el-tag>
                  <el-input placeholder="请输入选项C的内容" v-model="postChange.answerC" clearable="">
                  </el-input>
                </li>
                <li>
                  <el-tag type="success">D</el-tag>
                  <el-input placeholder="请输入选项D的内容" v-model="postChange.answerD" clearable="">
                  </el-input>
                </li>
              </ul>
            </div>
            <div class="title">
              <el-tag>解析:</el-tag><span>在下面的输入框中输入题目解析</span>
              <el-input type="textarea" rows="4" v-model="postChange.analysis" placeholder="请输入答案解析" resize="none"
                        class="answer">
              </el-input>
            </div>
            <div class="submit">
              <el-button type="primary" @click="changeSubmit()">立即添加</el-button>
            </div>
          </div>
          <!-- 填空题部分 -->
          <div class="change fill" v-if="optionValue == '填空题'">
            <div class="title">
              <el-tag>题目:</el-tag><span>输入题目,形如--从计算机网络系统组成的角度看，计算机网络可以分为()和()。注意需要考生答题部分一定要用括号（英文半角）括起来。</span>
              <el-input type="textarea" rows="4" v-model="postFill.question" placeholder="请输入题目内容" resize="none"
                        class="answer">
              </el-input>
            </div>
            <div class="fillAnswer">
              <el-tag>正确答案:</el-tag>
              <el-input v-model="postFill.answer" placeholder="输入答案，多个答案用英文逗号分隔"></el-input>
            </div>
            <div class="title analysis">
              <el-tag type="success">解析:</el-tag><span>下方输入框中输入答案解析</span>
              <el-input type="textarea" rows="4" v-model="postFill.analysis" placeholder="请输入答案解析" resize="none"
                        class="answer">
              </el-input>
            </div>
            <div class="submit">
              <el-button type="primary" @click="fillSubmit()">立即添加</el-button>
            </div>
          </div>
          <!-- 判断题 -->
          <div class="change judge" v-if="optionValue == '判断题'">
            <div class="title">
              <el-tag>题目:</el-tag><span>在下面的输入框中输入题目</span>
              <el-input type="textarea" rows="4" v-model="postJudge.question" placeholder="请输入题目内容" resize="none"
                        class="answer">
              </el-input>
            </div>
            <div class="judgeAnswer">
              <el-radio v-model="postJudge.answer" label="T">正确</el-radio>
              <el-radio v-model="postJudge.answer" label="F">错误</el-radio>
            </div>
            <div class="title">
              <el-tag>解析:</el-tag><span>在下面的输入框中输入题目解析</span>
              <el-input type="textarea" rows="4" v-model="postJudge.analysis" placeholder="请输入答案解析" resize="none"
                        class="answer">
              </el-input>
            </div>
            <div class="submit">
              <el-button type="primary" @click="judgeSubmit()">立即添加</el-button>
            </div>
          </div>
        </section>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><i class="iconfont icon-daoru-tianchong"></i>在线组卷</span>
        <div class="box">
          <ul>
            <li>
              <span>给《{{ subject }}》试卷按给定数量随机设置题目：</span>
            </li>
            <hr>
            <li>
              <span>选择题数量：</span>
              <el-input type="text" v-model="changeNumber"></el-input>
            </li>
            <li>
              <span>填空题数量：</span>
              <el-input type="text" v-model="fillNumber"></el-input>
            </li>
            <li>
              <span>判断题数量：</span>
              <el-input type="text" v-model="judgeNumber"></el-input>
            </li>
            <hr>
            <li>
              <el-button type="primary" style="font-size: 18px;" @click="create()">
                <i class="iconfont icon-r-yes" style="font-size: 24px;"></i>
                立即组卷
              </el-button>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- AI生成题目预览对话框 -->
    <el-dialog
      title="AI生成题目预览"
      :visible.sync="previewDialogVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="preview-container">
        <div class="preview-header">
          <el-checkbox 
            :indeterminate="isIndeterminate" 
            v-model="checkAll" 
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <span class="preview-count">共生成 {{ previewQuestions.length }} 道题目</span>
        </div>
        
        <div class="preview-content">
          <div 
            v-for="(question, index) in previewQuestions" 
            :key="index" 
            class="preview-question-item"
            :class="{ 'editing': question.editing }"
          >
            <div class="question-header">
              <el-checkbox v-model="question.selected" @change="handleSelectionChange">
                题目 {{ index + 1 }}
              </el-checkbox>
              <div class="question-actions">
                <el-button 
                  size="mini" 
                  type="primary" 
                  @click="editQuestion(index)"
                  v-if="!question.editing"
                >
                  编辑
                </el-button>
                <el-button 
                  size="mini" 
                  type="success" 
                  @click="saveEdit(index)"
                  v-if="question.editing"
                >
                  保存
                </el-button>
                <el-button 
                  size="mini" 
                  @click="cancelEdit(index)"
                  v-if="question.editing"
                >
                  取消
                </el-button>
                <el-button 
                  size="mini" 
                  type="danger" 
                  @click="deleteQuestion(index)"
                >
                  删除
                </el-button>
              </div>
            </div>

            <!-- 选择题预览 -->
            <div v-if="currentQuestionType === 'multi'" class="question-content">
              <div v-if="!question.editing">
                <p><strong>题目：</strong>{{ question.question }}</p>
                <p><strong>A：</strong>{{ question.answerA }}</p>
                <p><strong>B：</strong>{{ question.answerB }}</p>
                <p><strong>C：</strong>{{ question.answerC }}</p>
                <p><strong>D：</strong>{{ question.answerD }}</p>
                <p><strong>正确答案：</strong>{{ question.rightAnswer }}</p>
                <p v-if="question.analysis"><strong>解析：</strong>{{ question.analysis }}</p>
                <p><strong>难度：</strong>{{ question.level }} | <strong>章节：</strong>{{ question.section || '无' }}</p>
              </div>
              <div v-else class="edit-form">
                <el-form label-width="100px">
                  <el-form-item label="题目">
                    <el-input v-model="question.question" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                  <el-form-item label="选项A">
                    <el-input v-model="question.answerA"></el-input>
                  </el-form-item>
                  <el-form-item label="选项B">
                    <el-input v-model="question.answerB"></el-input>
                  </el-form-item>
                  <el-form-item label="选项C">
                    <el-input v-model="question.answerC"></el-input>
                  </el-form-item>
                  <el-form-item label="选项D">
                    <el-input v-model="question.answerD"></el-input>
                  </el-form-item>
                  <el-form-item label="正确答案">
                    <el-select v-model="question.rightAnswer">
                      <el-option label="A" value="A"></el-option>
                      <el-option label="B" value="B"></el-option>
                      <el-option label="C" value="C"></el-option>
                      <el-option label="D" value="D"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="解析">
                    <el-input v-model="question.analysis" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                  <el-form-item label="难度">
                    <el-input v-model="question.level"></el-input>
                  </el-form-item>
                  <el-form-item label="章节">
                    <el-input v-model="question.section"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <!-- 填空题预览 -->
            <div v-if="currentQuestionType === 'fill'" class="question-content">
              <div v-if="!question.editing">
                <p><strong>题目：</strong>{{ question.question }}</p>
                <p><strong>正确答案：</strong>{{ question.answer }}</p>
                <p v-if="question.analysis"><strong>解析：</strong>{{ question.analysis }}</p>
                <p><strong>难度：</strong>{{ question.level }} | <strong>章节：</strong>{{ question.section || '无' }}</p>
              </div>
              <div v-else class="edit-form">
                <el-form label-width="100px">
                  <el-form-item label="题目">
                    <el-input v-model="question.question" type="textarea" :rows="3"></el-input>
                  </el-form-item>
                  <el-form-item label="正确答案">
                    <el-input v-model="question.answer"></el-input>
                  </el-form-item>
                  <el-form-item label="解析">
                    <el-input v-model="question.analysis" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                  <el-form-item label="难度">
                    <el-input v-model="question.level"></el-input>
                  </el-form-item>
                  <el-form-item label="章节">
                    <el-input v-model="question.section"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <!-- 判断题预览 -->
            <div v-if="currentQuestionType === 'judge'" class="question-content">
              <div v-if="!question.editing">
                <p><strong>题目：</strong>{{ question.question }}</p>
                <p><strong>正确答案：</strong>{{ question.answer === '1' || question.answer === 'T' ? '正确' : '错误' }}</p>
                <p v-if="question.analysis"><strong>解析：</strong>{{ question.analysis }}</p>
                <p><strong>难度：</strong>{{ question.level }} | <strong>章节：</strong>{{ question.section || '无' }}</p>
              </div>
              <div v-else class="edit-form">
                <el-form label-width="100px">
                  <el-form-item label="题目">
                    <el-input v-model="question.question" type="textarea" :rows="3"></el-input>
                  </el-form-item>
                  <el-form-item label="正确答案">
                    <el-radio-group v-model="question.answer">
                      <el-radio label="1">正确</el-radio>
                      <el-radio label="0">错误</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="解析">
                    <el-input v-model="question.analysis" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                  <el-form-item label="难度">
                    <el-input v-model="question.level"></el-input>
                  </el-form-item>
                  <el-form-item label="章节">
                    <el-input v-model="question.section"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSelectedQuestions" :loading="aiLoading">
          保存选中的题目 ({{ selectedCount }})
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aiGenerateCount: 1, // 默认生成1道题
      aiKnowledgePoint: "", // 知识点
      aiLoading: false, // 加载状态
      previewDialogVisible: false, // 预览对话框显示状态
      previewQuestions: [], // 预览的题目列表
      currentQuestionType: "", // 当前题目类型
      editingIndex: -1, // 正在编辑的题目索引
      changeNumber: null, //选择题出题数量
      fillNumber: null, //填空题出题数量
      judgeNumber: null, //判断题出题数量
      activeName: "first", //活动选项卡
      options: [
        //题库类型
        {
          value: "选择题",
          label: "选择题",
        },
        {
          value: "填空题",
          label: "填空题",
        },
        {
          value: "判断题",
          label: "判断题",
        },
      ],
      levels: [
        //难度等级
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "4",
          label: "4",
        },
        {
          value: "5",
          label: "5",
        },
      ],
      rights: [
        //正确答案
        {
          value: "A",
          label: "A",
        },
        {
          value: "B",
          label: "B",
        },
        {
          value: "C",
          label: "C",
        },
        {
          value: "D",
          label: "D",
        },
      ],
      paperId: null,
      optionValue: "选择题", //题型选中值
      subject: "", //试卷名称用来接收路由参数
      postChange: {
        //选择题提交内容
        subject: "", //试卷名称
        level: "", //难度等级选中值
        rightAnswer: "", //正确答案选中值
        section: "", //对应章节
        question: "", //题目
        analysis: "", //解析
        answerA: "",
        answerB: "",
        answerC: "",
        answerD: "",
      },
      postFill: {
        //填空题提交内容
        subject: "", //试卷名称
        level: "", //难度等级选中值
        answer: "", //正确答案
        section: "", //对应章节
        question: "", //题目
        analysis: "", //解析
      },
      postJudge: {
        //判断题提交内容
        subject: "", //试卷名称
        level: "", //难度等级选中值
        answer: "", //正确答案
        section: "", //对应章节
        question: "", //题目
        analysis: "", //解析
      },
      postPaper: {
        //考试管理表对应字段
        paperId: null,
        questionType: null, // 试卷类型 1--选择题  2--填空题   3--判断题
        questionId: null,
      },
    };
  },
  created() {
    this.getParams();
  },
  methods: {
    generateByAI() {
      // 校验参数
      if (!this.aiGenerateCount || this.aiGenerateCount < 1) {
        this.$message.error("请输入有效的生成数量（至少1道）");
        return;
      }
      if (!this.optionValue) {
        this.$message.error("请先选择题型");
        return;
      }
      // 根据题型获取对应参数（章节、难度）
      let section, level;
      switch (this.optionValue) {
        case "选择题":
          section = this.postChange.section;
          level = this.postChange.level;
          break;
        case "填空题":
          section = this.postFill.section;
          level = this.postFill.level;
          break;
        case "判断题":
          section = this.postJudge.section;
          level = this.postJudge.level;
          break;
      }
      // 参数映射（前端题型 -> 后端接口参数）
      const questionTypeMap = {
        "选择题": "multi",
        "填空题": "fill",
        "判断题": "judge"
      };
      // 显示加载状态
      this.aiLoading = true;
      // 调用后端AI生成预览接口（不保存）
      this.$axios({
        url: "/ai/generate/preview", // 后端AI生成预览接口地址
        method: "post",
        timeout: 120000, // AI生成接口单独设置120秒超时
        data: {
          subject: this.subject, // 科目（从路由参数获取）
          questionType: questionTypeMap[this.optionValue], // 转换题型格式
          count: this.aiGenerateCount, // 生成数量
          level: level || "3", // 难度默认3级
          section: section || "", // 章节（可选）
          knowledgePoint: this.aiKnowledgePoint || "" // 知识点（可选）
        }
      }).then((res) => {
        this.aiLoading = false;
        if (res.data.code === 200) {
          // 保存生成的题目到预览列表
          this.previewQuestions = res.data.data || [];
          this.currentQuestionType = questionTypeMap[this.optionValue];
          // 为每个题目添加选中标记和编辑状态
          this.previewQuestions = this.previewQuestions.map((q, index) => ({
            ...q,
            selected: true, // 默认选中
            editing: false, // 编辑状态
            originalIndex: index // 原始索引
          }));
          // 显示预览对话框
          this.previewDialogVisible = true;
        } else {
          this.$message.error("生成失败：" + (res.data.message || res.data.data || "未知错误"));
        }
      }).catch((err) => {
        this.aiLoading = false;
        let errorMsg = err.message || "接口调用失败";
        if (err.response && err.response.data && err.response.data.message) {
          errorMsg = err.response.data.message;
        }
        this.$message.error("生成失败：" + errorMsg);
      });
    },
    create() {
      this.$axios({
        url: "/item",
        method: "post",
        data: {
          changeNumber: this.changeNumber,
          fillNumber: this.fillNumber,
          judgeNumber: this.judgeNumber,
          paperId: this.paperId,
          subject: this.subject,
        },
      }).then((res) => {
        let data = res.data;
        if (data.code == 200) {
          setTimeout(() => {
            this.$router.push({ path: "/selectAnswer" });
          }, 1000);
          this.$message({
            message: data.message,
            type: "success",
          });
        } else if (data.code == 400) {
          this.$message({
            message: data.message,
            type: "error",
          });
        }
      });
    },
    getParams() {
      let subject = this.$route.query.subject; //获取试卷名称
      let paperId = this.$route.query.paperId; //获取paperId
      this.paperId = paperId;
      this.subject = subject;
      this.postPaper.paperId = paperId;
    },
    changeSubmit() {
      //选择题题库提交
      this.postChange.subject = this.subject;
      this.$axios({
        //提交数据到选择题题库表
        url: "/MultiQuestion",
        method: "post",
        data: {
          ...this.postChange,
        },
      })
        .then((res) => {
          //添加成功显示提示
          let status = res.data.code;
          if (status == 200) {
            this.$message({
              message: "已添加到题库",
              type: "success",
            });
            this.postChange = {
              //选择题提交内容
              subject: "", //试卷名称
              level: "", //难度等级选中值
              rightAnswer: "", //正确答案选中值
              section: "", //对应章节
              question: "", //题目
              analysis: "", //解析
              answerA: "",
              answerB: "",
              answerC: "",
              answerD: "",
            };
          }
        })
        .then(() => {
          this.$axios(`/multiQuestionId`).then((res) => {
            //获取当前题目的questionId
            let questionId = res.data.data.questionId;
            this.postPaper.questionId = questionId;
            this.postPaper.questionType = 1;
            this.$axios({
              url: "/paperManage",
              method: "Post",
              data: {
                ...this.postPaper,
              },
            });
          });
        });
    },
    fillSubmit() {
      //填空题提交
      this.postFill.subject = this.subject;
      this.$axios({
        url: "/fillQuestion",
        method: "post",
        data: {
          ...this.postFill,
        },
      })
        .then((res) => {
          let status = res.data.code;
          if (status == 200) {
            this.$message({
              message: "已添加到题库",
              type: "success",
            });
            this.postFill = {
              //填空题提交内容
              subject: "", //试卷名称
              level: "", //难度等级选中值
              answer: "", //正确答案
              section: "", //对应章节
              question: "", //题目
              analysis: "", //解析
            };
          }
        })
        .then(() => {
          this.$axios(`/fillQuestionId`).then((res) => {
            //获取当前题目的questionId
            let questionId = res.data.data.questionId;
            this.postPaper.questionId = questionId;
            this.postPaper.questionType = 2;
            this.$axios({
              url: "/paperManage",
              method: "Post",
              data: {
                ...this.postPaper,
              },
            });
          });
        });
    },
    judgeSubmit() {
      //判断题提交
      this.postJudge.subject = this.subject;
      this.$axios({
        url: "/judgeQuestion",
        method: "post",
        data: {
          ...this.postJudge,
        },
      })
        .then((res) => {
          let status = res.data.code;
          if (status == 200) {
            this.$message({
              message: "已添加到题库",
              type: "success",
            });
            this.postJudge = {
              //判断题提交内容
              subject: "", //试卷名称
              level: "", //难度等级选中值
              answer: "", //正确答案
              section: "", //对应章节
              question: "", //题目
              analysis: "", //解析
            };
          }
        })
        .then(() => {
          this.$axios(`/judgeQuestionId`).then((res) => {
            //获取当前题目的questionId
            let questionId = res.data.data.questionId;
            this.postPaper.questionId = questionId;
            this.postPaper.questionType = 3;
            this.$axios({
              url: "/paperManage",
              method: "Post",
              data: {
                ...this.postPaper,
              },
            });
          });
        });
    },
    // 预览对话框相关方法
    handleCheckAllChange(val) {
      this.previewQuestions.forEach(question => {
        question.selected = val;
      });
    },
    handleSelectionChange() {
      // 处理单个选择变化
    },
    editQuestion(index) {
      // 保存原始数据用于取消编辑
      this.previewQuestions[index]._originalData = JSON.parse(JSON.stringify(this.previewQuestions[index]));
      this.previewQuestions[index].editing = true;
      this.editingIndex = index;
    },
    saveEdit(index) {
      this.previewQuestions[index].editing = false;
      this.editingIndex = -1;
      this.$message.success("修改已保存");
    },
    cancelEdit(index) {
      // 恢复原始数据
      if (this.previewQuestions[index]._originalData) {
        const original = this.previewQuestions[index]._originalData;
        Object.keys(original).forEach(key => {
          if (key !== 'editing' && key !== 'selected' && key !== '_originalData') {
            this.previewQuestions[index][key] = original[key];
          }
        });
      }
      this.previewQuestions[index].editing = false;
      this.editingIndex = -1;
    },
    deleteQuestion(index) {
      this.$confirm("确定要删除这道题目吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.previewQuestions.splice(index, 1);
        this.$message.success("已删除");
      }).catch(() => {});
    },
    saveSelectedQuestions() {
      const selectedQuestions = this.previewQuestions.filter(q => q.selected);
      if (selectedQuestions.length === 0) {
        this.$message.warning("请至少选择一道题目");
        return;
      }

      // 移除临时字段，并确保数据格式正确
      const questionsToSave = selectedQuestions.map(q => {
        const { selected, editing, originalIndex, _originalData, ...question } = q;
        // 确保subject字段存在
        question.subject = this.subject || question.subject;
        
        // 确保必要字段存在
        if (!question.level) {
          question.level = "3"; // 默认难度
        }
        if (!question.section) {
          question.section = "";
        }
        if (!question.score) {
          question.score = 2; // 默认分值
        }
        
        // 判断题答案格式统一（确保是"1"或"0"）
        if (this.currentQuestionType === "judge" && question.answer) {
          const answer = String(question.answer).trim();
          if (answer === "T" || answer === "对" || answer === "正确" || answer === "true" || answer === "True") {
            question.answer = "1";
          } else if (answer === "F" || answer === "错" || answer === "错误" || answer === "false" || answer === "False") {
            question.answer = "0";
          }
          // 如果已经是"1"或"0"，保持不变
        }
        
        return question;
      });

      this.aiLoading = true;
      this.$axios({
        url: "/ai/batchSave",
        method: "post",
        data: {
          questionType: this.currentQuestionType,
          questions: questionsToSave
        }
      }).then((res) => {
        this.aiLoading = false;
        if (res.data.code === 200) {
          this.$message.success(res.data.message || "保存成功");
          this.previewDialogVisible = false;
          this.previewQuestions = [];
          this.aiGenerateCount = 1;
          this.aiKnowledgePoint = ""; // 清空知识点
          // 可选：询问是否跳转到题目列表
          this.$confirm("题目已保存，是否前往题目列表查看？", "提示", {
            confirmButtonText: "前往查看",
            cancelButtonText: "继续添加",
            type: "info"
          }).then(() => {
            this.$router.push({ path: "/selectAnswer" });
          }).catch(() => {});
        } else {
          this.$message.error("保存失败：" + (res.data.message || "未知错误"));
        }
      }).catch((err) => {
        this.aiLoading = false;
        let errorMsg = err.message || "接口调用失败";
        if (err.response && err.response.data && err.response.data.message) {
          errorMsg = err.response.data.message;
        }
        this.$message.error("保存失败：" + errorMsg);
      });
    },
  },
  computed: {
    checkAll() {
      return this.previewQuestions.length > 0 && this.previewQuestions.every(q => q.selected);
    },
    isIndeterminate() {
      const selectedCount = this.previewQuestions.filter(q => q.selected).length;
      return selectedCount > 0 && selectedCount < this.previewQuestions.length;
    },
    selectedCount() {
      return this.previewQuestions.filter(q => q.selected).length;
    }
  },
};
</script>
<style lang="less" scoped>
.add {
  .append {
    ul {
      li {
        margin-right: 20px;
        display: flex;
        align-items: center;
      }
      .w150 {
        width: 150px;
        margin-left: 10px;
      }
      .w200 {
        width: 200px;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.add {
  margin: 0px 40px;

  .box {
    padding: 0px 20px;

    ul li {
      margin: 10px 0px;
      display: flex;
      align-items: center;

      .el-input {
        width: 6%;
      }

      .w150 {
        margin-left: 20px;
        width: 7%;
      }
    }
  }

  .el-icon-circle-plus {
    margin-right: 10px;
  }

  .icon-daoru-tianchong {
    margin-right: 10px;
  }

  .append {
    margin: 0px 20px;

    ul {
      display: flex;
      align-items: center;

      li {
        margin-right: 20px;
      }
    }

    .change {
      margin-top: 20px;
      padding: 20px 16px;
      background-color: #e7f6f6;
      border-radius: 4px;

      .title {
        padding-left: 6px;
        color: #2f4f4f;

        span:nth-child(1) {
          margin-right: 6px;
        }

        .answer {
          margin: 20px 0px 20px 8px;
        }

        .el-textarea {
          width: 98% !important;
        }
      }

      .options {
        ul {
          display: flex;
          flex-direction: column;
        }

        ul li {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 98%;
          margin: 10px 0px;

          span {
            margin-right: 20px;
          }
        }
      }

      .submit {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .fill {
      .fillAnswer {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin-right: 6px;
        }

        .el-input {
          width: 91% !important;
        }
      }

      .analysis {
        margin-top: 20px;
        margin-left: 5px;
      }
    }

    .judge {
      .judgeAnswer {
        margin-left: 20px;
        margin-bottom: 20px;
      }
    }

    .w150 {
      width: 150px;
      margin-left: 10px;
    }

    .w200 {
      width: 200px;
      margin-left: 10px;
    }

    /* 知识点输入行样式 */
    .knowledge-point-row {
      display: flex;
      align-items: center;
      margin-top: 15px;
      margin-bottom: 10px;
      padding: 10px 0;
    }

    .knowledge-point-label {
      min-width: 100px;
      font-size: 14px;
      color: #606266;
      margin-right: 10px;
      font-weight: 500;
    }

    .knowledge-point-input {
      flex: 1;
      max-width: 600px;
    }

    li:nth-child(2) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.preview-container {
  max-height: 600px;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.preview-count {
  color: #606266;
  font-size: 14px;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-question-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 15px;
  background-color: #fafafa;
  transition: all 0.3s;
}

.preview-question-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.preview-question-item.editing {
  border-color: #409eff;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.question-actions {
  display: flex;
  gap: 10px;
}

.question-content {
  padding: 10px 0;
}

.question-content p {
  margin: 8px 0;
  line-height: 1.6;
  color: #606266;
}

.question-content strong {
  color: #303133;
  margin-right: 8px;
}

.edit-form {
  padding: 10px 0;
}

.edit-form .el-form-item {
  margin-bottom: 15px;
}
</style>
