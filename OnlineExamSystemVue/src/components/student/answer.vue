<!--考生答题界面-->
<template>
    <div id="answer">
        <!--顶部信息栏-->
        <div class="top">
            <ul class="item">
                <li class="item-top">
                    <i class="iconfont icon-menufold icon20" ref="toggle" @click="slider_flag = !slider_flag"></i>
                    <i class="iconfont icon-r-paper" style="font-size: 32px;">
                    </i>
                    {{ examData.type }}-{{ examData.source }}
                </li>
                <li @click="flag = !flag" style="cursor: pointer">
                    <i class="iconfont icon-user icon20"></i>
                    <div class="msg" v-if="flag" @click="flag = !flag">
                        <p>姓名：{{ userInfo.name }}</p>
                        <p>准考证号: {{ userInfo.id }}</p>
                    </div>
                </li>
                <!-- 摄像头监控状态 -->
                <li class="camera-status" style="margin-left: 20px;">
                    <span v-if="cameraActive" style="color: #4caf50;">
                        <span class="recording-dot" v-if="isRecording"></span>
                        📹 {{ isRecording ? '录制中' : '监控中' }}
                    </span>
                    <span v-else style="color: #f44336;">📹 摄像头未开启</span>
                </li>
                <li><i class="iconfont icon-arrLeft icon20"></i></li>
            </ul>
        </div>
        <div class="flexarea">
            <!--左边题目编号区-->
            <transition name="slider-fade">
                <div class="left" v-if="slider_flag">
                    <ul class="l-top">
                        <li>
                            <a href="javascript:;"></a>
                            <span>当前</span>
                        </li>
                        <li>
                            <a href="javascript:;"></a>
                            <span>未答</span>
                        </li>
                        <li>
                            <a href="javascript:;"></a>
                            <span>已答</span>
                        </li>
                        <li>
                            <a href="javascript:;"></a>
                            <span>标记</span>
                        </li>
                    </ul>
                    <div class="l-bottom">
                        <div class="item">
                            <p>选择题部分</p>
                            <ul>
                                <li v-for="(list, index1) in topic[1]" :key="index1">
                                    <a href="javascript:;" @click="change(index1)" :class="{
                        border:
                            index == index1 &&
                            currentType == 1,
                        bg:
                            bg_flag &&
                            topic[1][index1].isClick ==
                            true,
                    }">
                                        <span :class="{
                        mark:
                            topic[1][index1].isMark ==
                            true,
                    }"></span>
                                        {{ index1 + 1 }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="item">
                            <p>填空题部分</p>
                            <ul>
                                <li v-for="(list, index2) in topic[2]" :key="index2">
                                    <a href="javascript:;" @click="fill(index2)" :class="{
                        border:
                            index == index2 &&
                            currentType == 2,
                        bg: fillAnswer[index2][3] == true,
                    }"><span :class="{
                        mark:
                            topic[2][index2].isMark ==
                            true,
                    }"></span>{{ topicCount[0] + index2 + 1 }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="item">
                            <p>判断题部分</p>
                            <ul>
                                <li v-for="(list, index3) in topic[3]" :key="index3">
                                    <a href="javascript:;" @click="judge(index3)" :class="{
                        border:
                            index == index3 &&
                            currentType == 3,
                        bg:
                            bg_flag &&
                            topic[3][index3].isClick ==
                            true,
                    }"><span :class="{
                        mark:
                            topic[3][index3].isMark ==
                            true,
                    }"></span>{{
                        topicCount[0] +
                        topicCount[1] +
                        index3 +
                        1
                    }}</a>
                                </li>
                            </ul>
                        </div>
                        <el-button type="primary" style="width: 100%;font-size: 22px;margin: 25px 0 0 0;"
                            @click="finishExam()"> 结束考试</el-button>
                    </div>
                </div>
            </transition>
            <!--右边选择答题区-->
            <transition name="slider-fade">
                <div class="right">
                    <div class="title">
                        <p style="font-size: 22px;"><i class="iconfont icon-r-edit" style="font-size: 28px;"></i> {{
                        title }}</p>
                        <i class="iconfont icon-right auto-right"></i>
                        <span>全卷共{{
                        topicCount[0] + topicCount[1] + topicCount[2]
                    }}题
                            <span v-if="!isPractice">
                                <i class="iconfont icon-time"></i>倒计时：<b>{{
                        time
                    }}</b>分钟</span>
                        </span>
                    </div>
                    <div class="content">
                        <p class="topic">
                            <span class="number">{{ number }}</span>{{ showQuestion }}
                        </p>
                        <div v-if="currentType == 1">
                            <el-radio-group v-model="radio[index]" @change="getChangeLabel">
                                <el-radio :label="1">{{
                        showAnswer.answerA
                    }}</el-radio>
                                <el-radio :label="2">{{
                        showAnswer.answerB
                    }}</el-radio>
                                <el-radio :label="3">{{
                        showAnswer.answerC
                    }}</el-radio>
                                <el-radio :label="4">{{
                        showAnswer.answerD
                    }}</el-radio>
                            </el-radio-group>
                            <div class="analysis" v-if="isPractice && radio[index] != undefined">
                                <ul>
                                    <li>
                                        <el-tag type="success">正确答案：</el-tag><span class="right">{{
                        reduceAnswer.rightAnswer
                    }}</span>
                                    </li>
                                    <li><el-tag>题目解析：</el-tag></li>
                                    <li>
                                        {{
                            reduceAnswer.analysis == null
                                ? "暂无解析"
                                : reduceAnswer.analysis
                        }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="fill" v-if="currentType == 2">
                            <div v-for="(item, currentIndex) in part" :key="currentIndex">
                                <el-input placeholder="请填在此处" v-model="fillAnswer[index][currentIndex]" clearable
                                    @blur="fillBG">
                                </el-input>
                            </div>
                            <div class="analysis" v-if="isPractice &&
                        fillAnswer[index][0] != undefined
                        ">
                                <ul>
                                    <li>
                                        <el-tag type="success">正确答案：</el-tag><span class="right">{{
                        topic[2][index].answer
                    }}</span>
                                    </li>
                                    <li><el-tag>题目解析：</el-tag></li>
                                    <li>
                                        {{
                            topic[2][index].analysis == null
                                ? "暂无解析"
                                : topic[2][index].analysis
                        }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="judge" v-if="currentType == 3">
                            <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel"
                                v-if="currentType == 3">
                                <el-radio :label="1">正确</el-radio>
                                <el-radio :label="2">错误</el-radio>
                            </el-radio-group>
                            <div class="analysis" v-if="isPractice &&
                        judgeAnswer[index] != undefined
                        ">
                                <ul>
                                    <li>
                                        <el-tag type="success">正确答案：</el-tag><span class="right">{{
                        topic[3][index].answer == "T"
                            ? "正确"
                                            : "错误"
                                            }}</span>
                                    </li>
                                    <li><el-tag>题目解析：</el-tag></li>
                                    <li>
                                        {{
                                        topic[3][index].analysis == null
                                        ? "暂无解析"
                                        : topic[3][index].analysis
                                        }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="operation">
                        <ul class="end">
                            <li @click="previous()" style="font-size: 24px;">
                                <i class="iconfont icon-r-left" style="font-size: 32px;margin-right: 5px;"></i><span>
                                    上一题</span>
                            </li>
                            <li @click="mark()">
                                <span>标记</span>
                            </li>
                            <li @click="next()" style="font-size: 24px;">
                                <span>下一题 </span><i class="iconfont icon-r-right"
                                    style="font-size: 32px;margin-left: 5px;"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            startTime: null, //考试开始时间
            endTime: null, //考试结束时间
            time: null, //考试持续时间
            reduceAnswer: [], //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
            answerScore: 0, //答题总分数
            bg_flag: false, //已答标识符,已答改变背景色
            isFillClick: false, //选择题是否点击标识符
            slider_flag: true, //左侧显示隐藏标识符
            flag: false, //个人信息显示隐藏标识符
            currentType: 1, //当前题型类型  1--选择题  2--填空题  3--判断题
            radio: [], //保存考生所有选择题的选项
            title: "请选择正确的选项",
            index: 0, //全局index
            userInfo: {
                //用户信息
                name: null,
                id: null,
            },
            topicCount: [], //每种类型题目的总数
            score: [], //每种类型分数的总数
            examData: {
                //考试信息
                // source: null,
                // totalScore: null,
            },
            topic: {
                //试卷信息
            },
            showQuestion: [], //当前显示题目信息
            showAnswer: {}, //当前题目对应的答案选项
            number: 1, //题号
            part: null, //填空题的空格数量
            fillAnswer: [[]], //二维数组保存所有填空题答案
            judgeAnswer: [], //保存所有判断题答案
            topic1Answer: [], //学生选择题作答编号,
            rightAnswer: "",
            timer: "",
            // 摄像头相关
            stream: null, // 摄像头流
            mediaRecorder: null, // 录制器
            recordedChunks: [], // 录制的数据块
            cameraActive: false, // 摄像头是否激活
            isRecording: false, // 是否正在录制
            autoRecordTimer: null, // 自动录制定时器
            recordInterval: 30000, // 录制间隔（30秒）
            recordDuration: 5000, // 每次录制时长（5秒）
            // 页面切换监控
            pageSwitchTimer: null, // 页面切换计时器
            switchStartTime: null, // 切换开始时间
            warningCount: 0, // 警告次数
        };
    },
    created() {
        this.getCookies();
        if (!this.isPractice) {
            this.getExamData();
            this.showTime();
            // 非练习模式才开启摄像头监控
            this.initCamera();
            // 初始化页面切换监控
            this.initPageSwitchMonitor();
        } else {
            this.getPracticeExamData();
        }
    },
    methods: {
        finishExam() {
            if (this.isPractice) {
                // 练习交卷
                this.$confirm("结束本次练习？", "友情提示", {
                    confirmButtonText: "立即交卷",
                    cancelButtonText: "继续练习",
                    type: "warning",
                })
                    .then(() => {
                        this.commit();
                    })
                    .catch(() => { });
            } else if (this.time > 0) {
                // 提前交卷
                this.$confirm("考试结束时间未到,是否提前交卷", "友情提示", {
                    confirmButtonText: "提交",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.commit();
                    })
                    .catch(() => { });
            }
        },
        getTime(date) {
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
            // 拼接
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
        getCookies() {
            //获取cookie
            this.userInfo.name = this.$cookies.get("cname");
            this.userInfo.id = this.$cookies.get("rb_student_id");
        },
        calcuScore() {
            //计算答题分数
        },
        getPracticeExamData() {
            //获取当前练习所有信息
            let date = new Date('2025-12-15 10:00:00');
            this.startTime = this.getTime(date);
            let examCode = this.$route.query.examCode; //获取路由传递过来的试卷编号
            this.$axios(`/exam/${examCode}`).then((res) => {
                //通过examCode请求试卷详细信息
                this.examData = { ...res.data.data }; //获取考试详情
                this.index = 0;
                this.$axios(`/practice/${this.examData.source}`).then((res) => {
                    //通过examCode获取练习题目信息（根据科目名称读取所有试题）
                    this.topic = { ...res.data };
                    let reduceAnswer = this.topic[1][this.index];
                    this.reduceAnswer = reduceAnswer;
                    let keys = Object.keys(this.topic); //对象转数组
                    keys.forEach((e) => {
                        let data = this.topic[e];
                        this.topicCount.push(data.length);
                        let currentScore = 0;
                        for (let i = 0; i < data.length; i++) {
                            //循环每种题型,计算出总分
                            currentScore += data[i].score;
                        }
                        this.score.push(currentScore); //把每种题型总分存入score
                    });
                    let len = this.topicCount[1];
                    let father = [];
                    for (let i = 0; i < len; i++) {
                        //根据填空题数量创建二维空数组存放每道题答案
                        let children = [null, null, null, null];
                        father.push(children);
                    }
                    this.fillAnswer = father;
                    let dataInit = this.topic[1];
                    this.number = 1;
                    this.showQuestion = dataInit[0].question;
                    this.showAnswer = dataInit[0];
                });
            });
        },
        getExamData() {
            //获取当前试卷所有信息
            let date = new Date('2025-12-15 10:00:00');
            this.startTime = this.getTime(date);
            let examCode = this.$route.query.examCode; //获取路由传递过来的试卷编号
            this.$axios(`/exam/${examCode}`).then((res) => {
                //通过examCode请求试卷详细信息
                this.examData = { ...res.data.data }; //获取考试详情
                this.index = 0;
                this.time = this.examData.totalTime; //获取分钟数
                let paperId = this.examData.paperId;
                this.$axios(`/paper/${paperId}`).then((res) => {
                    //通过paperId获取试题题目信息
                    this.topic = { ...res.data };
                    let reduceAnswer = this.topic[1][this.index];
                    this.reduceAnswer = reduceAnswer;
                    let keys = Object.keys(this.topic); //对象转数组
                    keys.forEach((e) => {
                        let data = this.topic[e];
                        this.topicCount.push(data.length);
                        let currentScore = 0;
                        for (let i = 0; i < data.length; i++) {
                            //循环每种题型,计算出总分
                            currentScore += data[i].score;
                        }
                        this.score.push(currentScore); //把每种题型总分存入score
                    });
                    let len = this.topicCount[1];
                    let father = [];
                    for (let i = 0; i < len; i++) {
                        //根据填空题数量创建二维空数组存放每道题答案
                        let children = [null, null, null, null];
                        father.push(children);
                    }
                    this.fillAnswer = father;
                    let dataInit = this.topic[1];
                    this.number = 1;
                    this.showQuestion = dataInit[0].question;
                    this.showAnswer = dataInit[0];
                });
            });
        },
        change(index) {
            //选择题
            this.index = index;
            let reduceAnswer = this.topic[1][this.index];
            this.reduceAnswer = reduceAnswer;
            this.isFillClick = true;
            this.currentType = 1;
            let len = this.topic[1].length;
            if (this.index < len) {
                if (this.index <= 0) {
                    this.index = 0;
                }
                console.log(`总长度${len}`);
                console.log(`当前index:${index}`);
                this.title = "请选择正确的选项";
                let Data = this.topic[1];
                // console.log(Data)
                this.showQuestion = Data[this.index].question; //获取题目信息
                this.showAnswer = Data[this.index];
                this.number = this.index + 1;
            } else if (this.index >= len) {
                this.index = 0;
                this.fill(this.index);
            }
        },
        fillBG() {
            //填空题已答题目 如果已答该题目,设置第四个元素为true为标识符
            if (this.fillAnswer[this.index][0] != null) {
                this.fillAnswer[this.index][3] = true;
            }
        },
        fill(index) {
            //填空题
            let len = this.topic[2].length;
            this.currentType = 2;
            this.index = index;
            if (index < len) {
                if (index < 0) {
                    index = this.topic[1].length - 1;
                    this.change(index);
                } else {
                    this.title = "请在横线处填写答案";
                    let Data = this.topic[2];
                    console.log(Data);
                    this.showQuestion = Data[index].question; //获取题目信息
                    let part = this.showQuestion.split("()").length - 1; //根据题目中括号的数量确定填空横线数量
                    this.part = part;
                    this.number = this.topicCount[0] + index + 1;
                }
            } else if (index >= len) {
                this.index = 0;
                this.judge(this.index);
            }
        },
        judge(index) {
            //判断题
            let len = this.topic[3].length;
            this.currentType = 3;
            this.index = index;
            if (this.index < len) {
                if (this.index < 0) {
                    this.index = this.topic[2].length - 1;
                    this.fill(this.index);
                } else {
                    console.log(`总长度${len}`);
                    console.log(`当前index:${this.index}`);
                    this.title = "请作出正确判断";
                    let Data = this.topic[3];
                    console.log(Data);
                    this.showQuestion = Data[index].question; //获取题目信息
                    this.number =
                        this.topicCount[0] + this.topicCount[1] + index + 1;
                }
            } else if (this.index >= len) {
                this.index = 0;
                this.change(this.index);
            }
        },
        getChangeLabel(val) {
            //获取选择题作答选项
            this.radio[this.index] = val; //当前选择的序号
            if (val) {
                let data = this.topic[1];
                this.bg_flag = true;
                data[this.index]["isClick"] = true;
            }
            /* 保存学生答题选项 */
            this.topic1Answer[this.index] = val;
        },
        getJudgeLabel(val) {
            //获取判断题作答选项
            this.judgeAnswer[this.index] = val;
            if (val) {
                let data = this.topic[3];
                this.bg_flag = true;
                data[this.index]["isClick"] = true;
            }
        },
        previous() {
            //上一题
            this.index--;
            switch (this.currentType) {
                case 1:
                    this.change(this.index);
                    break;
                case 2:
                    this.fill(this.index);
                    break;
                case 3:
                    this.judge(this.index);
                    break;
            }
        },
        next() {
            //下一题
            this.index++;
            switch (this.currentType) {
                case 1:
                    this.change(this.index);
                    break;
                case 2:
                    this.fill(this.index);
                    break;
                case 3:
                    this.judge(this.index);
                    break;
            }
        },
        mark() {
            //标记功能
            switch (this.currentType) {
                case 1:
                    this.topic[1][this.index]["isMark"] = true; //选择题标记
                    break;
                case 2:
                    this.topic[2][this.index]["isMark"] = true; //填空题标记
                    break;
                case 3:
                    this.topic[3][this.index]["isMark"] = true; //判断题标记
            }
        },
        commit() {
            //答案提交计算分数
            let topic1Answer = this.topic1Answer;
            let finalScore = 0;
            topic1Answer.forEach((element, index) => {
                //循环每道选择题根据选项计算分数
                let right = null;
                if (element != null) {
                    switch (
                    element //选项1,2,3,4 转换为 "A","B","C","D"
                    ) {
                        case 1:
                            right = "A";
                            break;
                        case 2:
                            right = "B";
                            break;
                        case 3:
                            right = "C";
                            break;
                        case 4:
                            right = "D";
                    }
                    if (right == this.topic[1][index].rightAnswer) {
                        // 当前选项与正确答案对比
                        finalScore += this.topic[1][index].score; // 计算总分数
                    }
                }
            });

            let fillAnswer = this.fillAnswer;
            console.log(this.topic[2])
            fillAnswer.forEach((element, index) => {
                //此处index和 this.index数据不一致，注意
                element.forEach((inner) => {
                    if (this.topic[2][index].answer.includes(inner)) {
                        //判断填空答案是否与数据库一致
                        finalScore += this.topic[2][index].score;
                    }
                });
            });
            let topic3Answer = this.judgeAnswer;
            topic3Answer.forEach((element, index) => {
                let right = null;
                switch (element) {
                    case 1:
                        right = "T";
                        break;
                    case 2:
                        right = "F";
                }
                if (right == this.topic[3][index].answer) {
                    // 当前选项与正确答案对比
                    finalScore += this.topic[3][index].score; // 计算总分数
                }
            });
            // 提交分数到数据库
            let date = new Date('2025-12-15 11:30:00');
            this.endTime = this.getTime(date);
            if (this.isPractice) {
                // 练习，不提交到数据库
                this.$router.push({
                    path: "/studentScore",
                    query: {
                        score: finalScore,
                        startTime: this.startTime,
                        endTime: this.endTime,
                    },
                });
                return;
            }

            let answerDate = this.endTime.substr(0, 10);
            //提交成绩信息
            this.$axios({
                url: "/score",
                method: "post",
                data: {
                    examCode: this.examData.examCode, //考试编号
                    studentId: this.userInfo.id, //学号
                    subject: this.examData.source, //课程名称
                    ptScore: ((finalScore / this.examData.totalScore) * 100 >= 60) ? 1 : 0, //是否及格
                    etScore: finalScore, //答题成绩
                    score: this.examData.totalScore, //试卷总成绩
                    answerDate: answerDate, //答题日期
                },
            }).then((res) => {

                console.log("a006")
                if (res.data.code == 200) {
                    this.$router.push({
                        path: "/studentScore",
                        query: {
                            score: finalScore,
                            startTime: this.startTime,
                            endTime: this.endTime,
                        },
                    });

                    console.log("a007")
                }
            });
        },
        showTime() {
            //倒计时
            this.timer = setInterval(() => {
                this.time -= 1;
                if (this.time == 10) {
                    this.$message({
                        showClose: true,
                        type: "error",
                        message: "考生注意,考试时间还剩10分钟！！！",
                    });
                }

                if (this.time <= 0) {
                    this.$message({
                        showClose: true,
                        type: "error",
                        message: "考试时间到，系统自动提交试卷",
                    });
                    this.commit();
                }
            }, 1000 * 60);
        },
        // ========== 摄像头监控功能 ==========
        async initCamera() {
            try {
                console.log('开始初始化摄像头...');
                // 请求摄像头权限
                this.stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user' // 前置摄像头
                    },
                    audio: false // 不录制音频
                });
                
                console.log('摄像头已成功开启');
                this.cameraActive = true;
                this.$message({
                    type: 'success',
                    message: '摄像头已开启，正在测试录制...'
                });
                
                // 立即录制一次测试视频（2秒）
                console.log('开始录制测试视频（2秒）...');
                setTimeout(() => {
                    this.recordVideo(2000); // 录制2秒
                }, 1000); // 等待1秒后开始录制
                
                // 开始自动录制
                this.startAutoRecord();
            } catch (error) {
                console.error('无法访问摄像头:', error);
                this.cameraActive = false;
                let errorMsg = '无法访问摄像头';
                if (error.name === 'NotAllowedError') {
                    errorMsg = '请允许访问摄像头权限';
                } else if (error.name === 'NotFoundError') {
                    errorMsg = '未找到摄像头设备';
                }
                this.$message({
                    type: 'warning',
                    message: errorMsg + '，考试监控功能将无法使用'
                });
            }
        },
        startAutoRecord() {
            if (!this.stream || this.autoRecordTimer) {
                console.log('无法启动自动录制：stream=' + !!this.stream + ', timer=' + !!this.autoRecordTimer);
                return;
            }
            
            console.log('启动自动录制功能...');
            
            // 注意：测试视频已经在initCamera中录制，这里不再立即录制
            // 设置随机录制间隔（20-40秒之间）
            const randomInterval = Math.floor(Math.random() * 20000) + 20000; // 20-40秒
            console.log('下次自动录制将在', randomInterval / 1000, '秒后');
            
            // 设置定时器，每隔随机时间录制一次
            this.autoRecordTimer = setInterval(() => {
                if (!this.isRecording && this.cameraActive) {
                    console.log('自动录制触发...');
                    this.recordVideo();
                    // 下次录制间隔也随机
                    clearInterval(this.autoRecordTimer);
                    const nextInterval = Math.floor(Math.random() * 20000) + 20000;
                    console.log('下次自动录制将在', nextInterval / 1000, '秒后');
                    this.autoRecordTimer = setInterval(() => {
                        if (!this.isRecording && this.cameraActive) {
                            console.log('自动录制触发...');
                            this.recordVideo();
                        }
                    }, nextInterval);
                }
            }, randomInterval);
        },
        async recordVideo(duration = null) {
            if (!this.stream || this.isRecording) {
                console.log('无法录制：stream=' + !!this.stream + ', isRecording=' + this.isRecording);
                return;
            }

            try {
                console.log('开始录制视频...');
                this.isRecording = true;
                this.recordedChunks = [];
                
                // 创建 MediaRecorder
                const options = {
                    mimeType: 'video/webm;codecs=vp8'
                };
                
                // 检查浏览器是否支持该格式
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    options.mimeType = 'video/webm'; // 降级到通用格式
                    console.log('使用降级格式: video/webm');
                }
                
                console.log('MediaRecorder配置:', options);
                this.mediaRecorder = new MediaRecorder(this.stream, options);

                this.mediaRecorder.ondataavailable = (event) => {
                    console.log('收到录制数据，大小:', event.data ? event.data.size : 0);
                    if (event.data && event.data.size > 0) {
                        this.recordedChunks.push(event.data);
                    }
                };

                this.mediaRecorder.onstop = async () => {
                    console.log('录制停止，数据块数量:', this.recordedChunks.length);
                    this.isRecording = false;
                    
                    if (this.recordedChunks.length === 0) {
                        console.error('录制失败：没有录制到数据');
                        this.$message.error('录制失败：没有录制到数据');
                        return;
                    }

                    // 创建 Blob
                    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                    console.log('视频Blob创建成功，大小:', blob.size, '字节');
                    
                    // 上传视频
                    await this.uploadVideo(blob, duration || 2000);
                };

                // 开始录制
                this.mediaRecorder.start();
                console.log('MediaRecorder已开始录制，状态:', this.mediaRecorder.state);
                
                // 设置录制时长（如果未指定，则随机3-7秒）
                const recordDuration = duration || (Math.floor(Math.random() * 4000) + 3000);
                console.log('将在', recordDuration, '毫秒后停止录制');
                setTimeout(() => {
                    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                        console.log('停止录制，当前状态:', this.mediaRecorder.state);
                        this.mediaRecorder.stop();
                    }
                }, recordDuration);

            } catch (error) {
                console.error('录制失败:', error);
                this.$message.error('录制失败: ' + error.message);
                this.isRecording = false;
            }
        },
        async uploadVideo(blob, duration) {
            try {
                const examCode = this.examData.examCode;
                const studentId = this.userInfo.id;
                const videoDuration = Math.floor(duration / 1000); // 转换为秒

                console.log('准备上传视频...');
                console.log('考试编号:', examCode);
                console.log('学生ID:', studentId);
                console.log('视频大小:', blob.size, '字节');
                console.log('视频时长:', videoDuration, '秒');

                if (!examCode || !studentId) {
                    console.error('考试编号或学生ID为空 - examCode:', examCode, ', studentId:', studentId);
                    this.$message.error('视频上传失败：缺少考试编号或学生ID');
                    return;
                }

                // 创建 FormData
                const formData = new FormData();
                const fileName = `exam_${examCode}_student_${studentId}_${Date.now()}.webm`;
                formData.append('file', blob, fileName);
                formData.append('examCode', examCode);
                formData.append('studentId', studentId);
                formData.append('duration', videoDuration);

                console.log('FormData已创建，开始发送请求...');
                console.log('请求URL: /exam/video/upload');

                // 发送请求到后端
                const response = await this.$axios({
                    url: '/exam/video/upload',
                    method: 'post',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('服务器响应:', response);
                console.log('响应数据:', response.data);

                if (response.data.code === 200) {
                    console.log('✅ 视频上传成功!');
                    console.log('视频信息:', response.data.data);
                    this.$message({
                        type: 'success',
                        message: '视频上传成功！视频ID: ' + (response.data.data.videoId || '未知')
                    });
                } else {
                    console.error('❌ 视频上传失败:', response.data.message);
                    this.$message.error('视频上传失败: ' + (response.data.message || '未知错误'));
                }

            } catch (error) {
                console.error('❌ 上传异常:', error);
                console.error('错误详情:', error.response);
                let errorMsg = '上传失败';
                if (error.response && error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                } else if (error.message) {
                    errorMsg = error.message;
                }
                this.$message.error('视频上传异常: ' + errorMsg);
            }
        },
        stopCamera() {
            // 停止自动录制
            if (this.autoRecordTimer) {
                clearInterval(this.autoRecordTimer);
                this.autoRecordTimer = null;
            }
            
            // 停止录制器
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }
            
            // 关闭摄像头流
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            
            this.cameraActive = false;
            this.isRecording = false;
        },
        // ========== 页面切换监控功能 ==========
        initPageSwitchMonitor() {
            console.log('初始化页面切换监控...');
            
            // 监听页面可见性变化（切换标签页）
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            
            // 监听窗口失焦（切换窗口）
            window.addEventListener('blur', this.handleWindowBlur);
            window.addEventListener('focus', this.handleWindowFocus);
            
            // 监听页面离开（关闭标签页或刷新）
            window.addEventListener('beforeunload', this.handleBeforeUnload);
        },
        removePageSwitchMonitor() {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            window.removeEventListener('blur', this.handleWindowBlur);
            window.removeEventListener('focus', this.handleWindowFocus);
            window.removeEventListener('beforeunload', this.handleBeforeUnload);
            
            if (this.pageSwitchTimer) {
                clearInterval(this.pageSwitchTimer);
                this.pageSwitchTimer = null;
            }
        },
        handleVisibilityChange() {
            if (document.hidden) {
                // 页面隐藏（切换标签页）
                console.log('检测到页面切换（标签页切换）');
                this.recordPageSwitch('tab_switch');
            } else {
                // 页面显示（返回标签页）
                console.log('检测到页面返回');
                this.handlePageReturn();
            }
        },
        handleWindowBlur() {
            // 窗口失焦（切换窗口）
            console.log('检测到窗口失焦');
            this.recordPageSwitch('window_blur');
        },
        handleWindowFocus() {
            // 窗口获得焦点（返回窗口）
            console.log('检测到窗口获得焦点');
            this.handlePageReturn();
        },
        handleBeforeUnload(event) {
            // 页面离开（关闭或刷新）
            console.log('检测到页面离开');
            this.recordPageSwitch('page_leave');
            // 显示确认对话框
            event.preventDefault();
            event.returnValue = '您确定要离开考试页面吗？离开页面将被记录为违规行为！';
            return event.returnValue;
        },
        recordPageSwitch(switchType) {
            if (this.isPractice) {
                return; // 练习模式不记录
            }
            
            const examCode = this.examData.examCode;
            const studentId = this.userInfo.id;
            
            if (!examCode || !studentId) {
                console.error('无法记录页面切换：缺少考试编号或学生ID');
                return;
            }
            
            // 记录切换开始时间
            this.switchStartTime = new Date();
            const switchTime = this.getTime(this.switchStartTime);
            
            // 显示警告
            this.warningCount++;
            this.$message({
                type: 'warning',
                message: `⚠️ 警告：检测到您切换了页面！这是第 ${this.warningCount} 次警告。频繁切换页面可能被视为作弊行为！`,
                duration: 5000,
                showClose: true
            });
            
            // 发送记录到后端
            this.$axios({
                url: '/page/switch/record',
                method: 'post',
                data: {
                    examCode: examCode,
                    studentId: studentId,
                    switchTime: switchTime,
                    switchType: switchType,
                    duration: null, // 离开时长，返回时更新
                    returnTime: null
                }
            }).then(res => {
                if (res.data.code === 200) {
                    console.log('页面切换记录已保存:', res.data.data);
                }
            }).catch(error => {
                console.error('保存页面切换记录失败:', error);
            });
            
            // 开始计时
            if (this.pageSwitchTimer) {
                clearInterval(this.pageSwitchTimer);
            }
            this.pageSwitchTimer = setInterval(() => {
                if (this.switchStartTime) {
                    const duration = Math.floor((new Date() - this.switchStartTime) / 1000);
                    console.log('离开页面时长:', duration, '秒');
                }
            }, 1000);
        },
        handlePageReturn() {
            if (!this.switchStartTime) {
                return;
            }
            
            if (this.isPractice) {
                return; // 练习模式不记录
            }
            
            const returnTime = new Date();
            const duration = Math.floor((returnTime - this.switchStartTime) / 1000);
            const returnTimeStr = this.getTime(returnTime);
            
            console.log('页面返回，离开时长:', duration, '秒');
            
            // 停止计时
            if (this.pageSwitchTimer) {
                clearInterval(this.pageSwitchTimer);
                this.pageSwitchTimer = null;
            }
            
            const examCode = this.examData.examCode;
            const studentId = this.userInfo.id;
            
            // 更新记录到后端
            if (examCode && studentId) {
                this.$axios({
                    url: '/page/switch/record/return',
                    method: 'put',
                    params: {
                        examCode: examCode,
                        studentId: studentId,
                        returnTime: returnTimeStr,
                        duration: duration
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        console.log('返回时间已更新:', res.data.data);
                    } else {
                        console.warn('更新返回时间失败:', res.data.message);
                    }
                }).catch(error => {
                    console.error('更新返回时间失败:', error);
                });
            }
            
            this.switchStartTime = null;
            
            this.$message({
                type: 'info',
                message: `您已返回考试页面，离开时长：${duration} 秒`,
                duration: 3000
            });
        },
    },
    beforeDestroy() {
        // 清除计时器
        clearInterval(this.timer);
        // 关闭摄像头
        this.stopCamera();
        // 移除页面切换监听
        this.removePageSwitchMonitor();
    },
    computed: mapState(["isPractice"]),
};
</script>

<style lang="less">
.iconfont.icon-time {
    color: CornflowerBlue;
    margin: 0px 6px 0px 20px;
}

.analysis {
    margin-top: 20px;

    .right {
        color: #2776df;
        font-size: 18px;
        border: 1px solid #2776df;
        padding: 0px 6px;
        border-radius: 4px;
        margin-left: 20px;
    }

    ul li:nth-child(2) {
        margin: 20px 0px;
    }

    ul li:nth-child(3) {
        padding: 10px;
        background-color: #d3c6c9;
        border-radius: 4px;
    }
}

.analysis span:nth-child(1) {
    font-size: 18px;
}

.mark {
    position: absolute;
    width: 4px;
    height: 4px;
    content: "";
    background-color: red;
    border-radius: 50%;
    top: 0px;
    left: 22px;
}

.border {
    position: relative;
    border: 1px solid #ff90aa !important;
}

.bg {
    background-color: #5188b8 !important;
}

.fill .el-input {
    display: inline-flex;
    width: 150px;
    margin-left: 20px;

    .el-input__inner {
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        padding-left: 20px;
    }
}

.slider-fade-enter-active {
    transition: all 0.3s ease;
}

.slider-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slider-fade-enter,
.slider-fade-leave-to {
    transform: translateX(-100px);
    opacity: 0;
}

.operation .end li:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: CornflowerBlue;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: #fff;
}

.operation .end li {
    cursor: pointer;
    margin: 0 100px;
}

.operation {
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 0px;
    margin-right: 10px;
}

.item-top {
    font-size: 24px;
}

.operation .end {
    display: flex;
    justify-content: center;
    align-items: center;
    color: CornflowerBlue;
}

.content .number {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background-color: CornflowerBlue;
    border-radius: 4px;
    margin-right: 4px;
}

.content {
    padding: 0px 20px;
}

.content .topic {
    padding: 20px 0px;
    padding-top: 30px;
}

.right .content {
    background-color: #fff;
    margin: 10px;
    margin-left: 0px;
    height: 470px;
}

.content .el-radio-group label {
    color: #000;
    margin: 5px 0px;
}

.content .el-radio-group {
    display: flex;
    flex-direction: column;
}

.right .title p {
    margin-left: 20px;
}

.flexarea {
    display: flex;
}

.flexarea .right {
    flex: 1;
}

.auto-right {
    margin-left: auto;
    color: #2776df;
    margin-right: 10px;
}

.right .title {
    margin-right: 10px;
    padding-right: 30px;
    display: flex;
    margin-top: 10px;
    background-color: #fff;
    height: 50px;
    line-height: 50px;
}

.clearfix {
    clear: both;
}

.l-bottom .final {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    background-color: CornflowerBlue;
    width: 240px;
    margin: 20px 0px 20px 10px;
    border-radius: 4px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    margin-top: 22px;
}

#answer .left .item {
    padding: 0px;
    font-size: 16px;
}

.l-bottom {
    border-radius: 4px;
    background-color: #fff;
}

.l-bottom .item p {
    margin-bottom: 15px;
    margin-top: 10px;
    color: #000;
    margin-left: 10px;
    letter-spacing: 2px;
}

.l-bottom .item li {
    width: 15%;
    margin-left: 5px;
    margin-bottom: 10px;
}

.l-bottom .item {
    display: flex;
    flex-direction: column;
}

.l-bottom .item ul {
    width: 100%;
    margin-bottom: -8px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}

.l-bottom .item ul li a {
    position: relative;
    justify-content: center;
    display: inline-flex;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #eee;
    text-align: center;
    color: #000;
    font-size: 16px;
}

.left .l-top {
    display: flex;
    justify-content: space-around;
    padding: 16px 0px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #fff;
}

.left {
    width: 260px;
    height: 100%;
    margin: 10px 10px 0px 10px;
}

.left .l-top li:nth-child(2) a {
    border: 1px solid #eee;
}

.left .l-top li:nth-child(3) a {
    background-color: #5188b8;
    border: none;
}

.left .l-top li:nth-child(4) a {
    position: relative;
    border: 1px solid #eee;
}

.left .l-top li:nth-child(4) a::before {
    width: 4px;
    height: 4px;
    content: " ";
    position: absolute;
    background-color: red;
    border-radius: 50%;
    top: 0px;
    left: 16px;
}

.left .l-top li {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.left .l-top li a {
    display: inline-block;
    padding: 10px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #ff90aa;
}

#answer .top {
    background-color: CornflowerBlue;
}

#answer .item {
    color: #fff;
    display: flex;
    padding: 20px;
    font-size: 20px;
}

#answer .top .item li:nth-child(1) {
    margin-right: 10px;
}

#answer .top .item li:nth-child(3) {
    position: relative;
    margin-left: auto;
}

#answer {
    padding-bottom: 30px;
}

.icon20 {
    font-size: 20px;
    font-weight: bold;
}

.item .msg {
    padding: 10px 15px;
    border-radius: 4px;
    top: 47px;
    right: -30px;
    color: #6c757d;
    position: absolute;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background-color: #fff;
}

.item .msg p {
    font-size: 16px;
    width: 200px;
    text-align: left;
}

/* 摄像头状态样式 */
.camera-status {
    display: flex;
    align-items: center;
    font-size: 14px;
}

.recording-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #f44336;
    border-radius: 50%;
    margin-right: 5px;
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
</style>
