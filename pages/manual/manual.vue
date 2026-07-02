<template>
  <view class="manual-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="manual-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">{{ headerTitle }}</view>
        <view
          v-if="!isProgressMode"
          class="progress-entry"
          :style="{ right: navMetrics.capsuleSafeRight + 'px' }"
          @tap="openProgress"
        >
          服务进度
        </view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <block v-if="!isProgressMode">
        <view class="manual-hero">
          <view class="manual-hero-title">人工咨询</view>
          <view class="manual-hero-desc">
            请优先提交商品信息和资料，顾问初步查看后会按预留电话回访。
          </view>
        </view>

        <view class="step-card">
          <view class="step-line"></view>
          <view class="step-list">
            <view
              v-for="step in flowSteps"
              :key="step.no"
              class="step-item"
            >
              <view class="step-dot">{{ step.no }}</view>
              <view class="step-text">{{ step.text }}</view>
            </view>
          </view>
        </view>

        <view class="manual-card core-card">
          <view class="core-title-line">
            <view class="core-icon">□</view>
            <view>
              <view class="core-title">提交商品信息</view>
              <view class="core-sub">文字或文件均可提交，留下电话后等待顾问回访。</view>
            </view>
          </view>

          <view class="form-block">
            <view class="form-item">
              <view class="manual-label">商品信息描述</view>
              <textarea
                class="manual-textarea"
                v-model="form.productInfo"
                placeholder="请描述商品名称、用途、材质/成分、规格型号、结构组成等信息"
              ></textarea>
            </view>

            <view class="form-item">
              <view class="manual-label">咨询问题</view>
              <textarea
                class="manual-textarea"
                v-model="form.question"
                placeholder="请填写希望人工顾问重点解答的问题，例如税号判断、申报要素、归类风险等"
              ></textarea>
            </view>

            <view class="form-item">
              <view class="manual-label">上传文件</view>
              <view class="manual-upload" @tap="chooseMaterialFile">
                <view class="upload-icon">＋</view>
                <view class="upload-main">上传商品资料</view>
                <view class="upload-sub">支持Excel、Word、PDF、图片等资料</view>
              </view>
              <view v-if="materialFileName" class="file-tip">
                已选择文件：{{ materialFileName }}
              </view>
            </view>

            <view class="form-item">
              <view class="manual-label">产品视频上传</view>
              <view class="manual-upload" @tap="chooseVideoFile">
                <view class="upload-icon">＋</view>
                <view class="upload-main">上传产品视频</view>
                <view class="upload-sub">支持MP4、MOV、AVI等常见视频格式</view>
              </view>
              <view v-if="videoFileName" class="file-tip">
                已选择视频：{{ videoFileName }}
              </view>
            </view>

            <view class="compact-grid">
              <view class="form-item">
                <view class="manual-label">联系人</view>
                <input class="manual-input" v-model="form.contactName" placeholder="姓名" />
              </view>
              <view class="form-item">
                <view class="manual-label">联系电话</view>
                <input class="manual-input" v-model="form.phone" placeholder="手机号/座机" />
              </view>
            </view>

            <view class="form-item">
              <view class="manual-label">邮箱</view>
              <input
                class="manual-input"
                v-model="form.email"
                placeholder="用于接收人工回复或补充材料通知"
              />
            </view>

            <view class="compact-grid">
              <view class="form-item">
                <view class="manual-label">方便回访日期</view>
                <picker :range="dateOptions" @change="handleDateChange">
                  <view class="manual-picker">{{ form.callbackDate }}</view>
                </picker>
              </view>
              <view class="form-item">
                <view class="manual-label">方便回访时间段</view>
                <picker :range="timeOptions" @change="handleTimeChange">
                  <view class="manual-picker">{{ form.callbackTime }}</view>
                </picker>
              </view>
            </view>

            <view class="form-item">
              <view class="manual-label">优先回复方式</view>
              <picker :range="replyOptions" @change="handleReplyChange">
                <view class="manual-picker">{{ form.replyMethod }}</view>
              </picker>
            </view>

            <view class="manual-submit" @tap="submitManualConsult">
              提交人工咨询
            </view>

            <view v-if="submitted" class="status-card">
              <view class="status-title">已提交，等待顾问回访</view>
              <view class="status-desc">
                顾问将根据商品信息、上传资料和产品视频进行初步核对，并按用户选择的优先方式联系。
              </view>
              <view class="status-flow">
                <view class="status-row">
                  <view class="status-check">✓</view>
                  <view>商品信息已接收</view>
                </view>
                <view class="status-row">
                  <view class="status-check">✓</view>
                  <view>联系方式和优先回复方式已记录</view>
                </view>
                <view class="status-row">
                  <view class="status-check">✓</view>
                  <view>进入人工咨询待处理队列</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="phone-card">
          <view class="phone-head">
            <view>
              <view class="phone-title">客服电话</view>
              <view class="phone-num">400-888-1234</view>
            </view>
            <view class="phone-btn" @tap="callService">拨打</view>
          </view>
          <view class="phone-desc">
            服务时间：工作日 09:00-18:00。电话咨询作为辅助入口，复杂问题建议优先提交资料。
          </view>
        </view>
      </block>

      <view v-else class="progress-list">
        <view
          v-for="item in progressList"
          :key="item.id"
          class="progress-card"
        >
          <view class="progress-title">{{ item.title }}</view>
          <view class="progress-meta">{{ item.meta }}</view>
          <view class="progress-preview">{{ item.preview }}</view>
          <view class="progress-head">
            <text>当前阶段：{{ item.currentStage }}</text>
            <text class="progress-percent">{{ item.percent }}%</text>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: item.percent + '%' }"></view>
          </view>
          <view class="progress-steps">
            <view
              v-for="step in item.steps"
              :key="step.name"
              class="progress-step"
              :class="step.status"
            >
              {{ step.name }}
            </view>
          </view>
          <view
            v-if="item.cancellable"
            class="cancel-btn"
            @tap="cancelConsult(item)"
          >
            取消咨询
          </view>
          <view v-if="item.cancelled" class="cancelled-text">
            该人工咨询已取消
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  MANUAL_FILE_EXTENSIONS,
  MANUAL_VIDEO_EXTENSIONS,
  getManualDateOptions,
  getManualTimeOptions,
  getManualReplyOptions,
  getMockManualProgressList
} from '../../mock/manualMock'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

export default {
  data() {
    const dateOptions = getManualDateOptions()
    const timeOptions = getManualTimeOptions()
    const replyOptions = getManualReplyOptions()

    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72,
        capsuleSafeRight: 24
      },
      pageMode: 'form',
      dateOptions,
      timeOptions,
      replyOptions,
      materialFileName: '',
      videoFileName: '',
      submitted: false,
      progressList: [],
      form: {
        productInfo: '',
        question: '',
        contactName: '',
        phone: '',
        email: '',
        callbackDate: dateOptions[0],
        callbackTime: timeOptions[0],
        replyMethod: replyOptions[0]
      },
      flowSteps: [
        { no: 1, text: '提交资料' },
        { no: 2, text: '顾问初审' },
        { no: 3, text: '回访沟通' },
        { no: 4, text: '结果确认' }
      ]
    }
  },

  computed: {
    isProgressMode() {
      return this.pageMode === 'progress'
    },

    headerTitle() {
      return this.isProgressMode ? '服务进度' : '人工咨询'
    }
  },

  onLoad() {
    this.setNavMetrics()
    this.progressList = getMockManualProgressList()
  },

  methods: {
    setNavMetrics() {
      const systemInfo = uni.getSystemInfoSync()
      const menuButton = uni.getMenuButtonBoundingClientRect
        ? uni.getMenuButtonBoundingClientRect()
        : null

      const statusBarHeight = systemInfo.statusBarHeight || 20
      const navBarHeight = menuButton ? menuButton.height + 16 : 52
      const capsuleSafeRight = menuButton
        ? systemInfo.windowWidth - menuButton.left + 16
        : 24

      this.navMetrics = {
        statusBarHeight,
        navBarHeight,
        topShellHeight: statusBarHeight + navBarHeight,
        capsuleSafeRight
      }
    },

    goBack() {
      if (this.isProgressMode) {
        this.pageMode = 'form'
        return
      }

      const pages = getCurrentPages()

      if (pages.length > 1) {
        uni.navigateBack()
        return
      }

      uni.switchTab({
        url: '/pages/index/index'
      })
    },

    openProgress() {
      this.pageMode = 'progress'
    },

    handleDateChange(event) {
      this.form.callbackDate = this.dateOptions[event.detail.value]
    },

    handleTimeChange(event) {
      this.form.callbackTime = this.timeOptions[event.detail.value]
    },

    handleReplyChange(event) {
      this.form.replyMethod = this.replyOptions[event.detail.value]
    },

    chooseMaterialFile() {
      this.chooseLocalFile({
        extensions: MANUAL_FILE_EXTENSIONS,
        maxSize: MAX_FILE_SIZE,
        sizeError: '文件不能超过20MB',
        typeError: '仅支持Excel、Word、PDF、图片资料',
        success: (fileName) => {
          this.materialFileName = fileName
        },
        fallbackName: '商品资料.pdf'
      })
    },

    chooseVideoFile() {
      this.chooseLocalFile({
        extensions: MANUAL_VIDEO_EXTENSIONS,
        maxSize: MAX_VIDEO_SIZE,
        sizeError: '视频不能超过100MB',
        typeError: '仅支持MP4、MOV、AVI视频',
        success: (fileName) => {
          this.videoFileName = fileName
        },
        fallbackName: '产品视频.mp4'
      })
    },

    chooseLocalFile(config) {
      if (uni.chooseFile) {
        uni.chooseFile({
          count: 1,
          extension: config.extensions,
          success: (res) => {
            const file = res.tempFiles && res.tempFiles[0]
            this.handleSelectedFile(file, config)
          },
          fail: () => {
            uni.showToast({
              title: '未选择文件',
              icon: 'none'
            })
          }
        })
        return
      }

      config.success(config.fallbackName)
      uni.showToast({
        title: '当前环境使用示例文件',
        icon: 'none'
      })
    },

    handleSelectedFile(file, config) {
      if (!file || !file.name) {
        return
      }

      const fileName = file.name
      const lowerName = fileName.toLowerCase()
      const validExtension = config.extensions.some(ext => lowerName.endsWith(ext))

      if (!validExtension) {
        uni.showToast({
          title: config.typeError,
          icon: 'none'
        })
        return
      }

      if (file.size && file.size > config.maxSize) {
        uni.showToast({
          title: config.sizeError,
          icon: 'none'
        })
        return
      }

      config.success(fileName)
    },

    submitManualConsult() {
      if (!this.form.productInfo.trim() && !this.materialFileName) {
        uni.showToast({
          title: '请填写商品信息或上传资料',
          icon: 'none'
        })
        return
      }

      if (!this.form.question.trim()) {
        uni.showToast({
          title: '请填写咨询问题',
          icon: 'none'
        })
        return
      }

      if (!this.form.contactName.trim()) {
        uni.showToast({
          title: '请填写联系人',
          icon: 'none'
        })
        return
      }

      if (!this.form.phone.trim()) {
        uni.showToast({
          title: '请填写联系电话',
          icon: 'none'
        })
        return
      }

      this.submitted = true
      uni.showToast({
        title: '提交成功',
        icon: 'success'
      })
    },

    callService() {
      uni.makePhoneCall({
        phoneNumber: '4008881234',
        fail: () => {
          uni.showToast({
            title: '当前环境暂不支持拨号',
            icon: 'none'
          })
        }
      })
    },

    cancelConsult(item) {
      item.cancellable = false
      item.meta = '今天 10:15｜状态：已取消'
      item.currentStage = '已取消'
      item.percent = 0
      item.cancelled = true
      item.steps = item.steps.map(step => ({
        ...step,
        status: 'pending'
      }))
      uni.showToast({
        title: '已取消咨询',
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.manual-page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #172033;
}

.top-shell {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 20;
  background: #ffffff;
  border-bottom: 1rpx solid #e5e7eb;
  box-sizing: border-box;
}

.manual-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #172033;
  font-size: 28rpx;
  font-weight: 900;
}

.header-title {
  color: #111827;
  font-size: 34rpx;
  font-weight: 900;
}

.progress-entry {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 58rpx;
  line-height: 58rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
  font-size: 24rpx;
  font-weight: 900;
}

.content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 34rpx 24rpx 20rpx;
  box-sizing: border-box;
}

.manual-hero {
  padding: 8rpx 8rpx 24rpx;
}

.manual-hero-title {
  color: #111827;
  font-size: 40rpx;
  font-weight: 900;
  margin-bottom: 10rpx;
}

.manual-hero-desc {
  color: #64748b;
  font-size: 26rpx;
  line-height: 40rpx;
}

.step-card,
.manual-card,
.phone-card,
.progress-card {
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  border-radius: 30rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.step-card {
  position: relative;
  padding: 34rpx 18rpx;
}

.step-list {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.step-item {
  flex: 1;
  text-align: center;
}

.step-dot {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  margin: 0 auto 14rpx;
  border-radius: 999rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 900;
}

.step-text {
  color: #334155;
  font-size: 23rpx;
  font-weight: 900;
  line-height: 32rpx;
}

.step-line {
  position: absolute;
  left: 88rpx;
  right: 88rpx;
  top: 64rpx;
  height: 4rpx;
  background: #dbeafe;
}

.core-card {
  border-color: #bfdbfe;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
  box-shadow: 0 14rpx 34rpx rgba(37, 99, 235, 0.12);
}

.core-title-line {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 22rpx;
}

.core-icon {
  width: 74rpx;
  height: 74rpx;
  line-height: 74rpx;
  border-radius: 26rpx;
  background: #2563eb;
  color: #ffffff;
  text-align: center;
  font-size: 28rpx;
  font-weight: 900;
  box-shadow: 0 10rpx 22rpx rgba(37, 99, 235, 0.22);
}

.core-title {
  color: #111827;
  font-size: 32rpx;
  font-weight: 900;
  margin-bottom: 6rpx;
}

.core-sub {
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}

.form-block {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.form-item {
  min-width: 0;
}

.manual-label {
  color: #334155;
  font-size: 25rpx;
  font-weight: 900;
  margin-bottom: 10rpx;
}

.manual-input,
.manual-picker,
.manual-textarea {
  width: 100%;
  border: 1rpx solid #e5e7eb;
  border-radius: 22rpx;
  background: #ffffff;
  color: #111827;
  font-size: 26rpx;
  box-sizing: border-box;
}

.manual-input,
.manual-picker {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 22rpx;
}

.manual-picker {
  color: #475569;
}

.manual-textarea {
  height: 200rpx;
  padding: 18rpx 22rpx;
  line-height: 40rpx;
}

.compact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
}

.manual-upload {
  padding: 38rpx 20rpx;
  border: 3rpx dashed #93c5fd;
  border-radius: 26rpx;
  background: #f8fbff;
  text-align: center;
}

.upload-icon {
  width: 76rpx;
  height: 76rpx;
  line-height: 76rpx;
  margin: 0 auto 14rpx;
  border-radius: 24rpx;
  background: #eff6ff;
  color: #2563eb;
  font-size: 34rpx;
  font-weight: 500;
}

.upload-main {
  color: #111827;
  font-size: 27rpx;
  font-weight: 900;
  margin-bottom: 6rpx;
}

.upload-sub {
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}

.file-tip {
  margin-top: 14rpx;
  padding: 16rpx 20rpx;
  border-radius: 20rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #1d4ed8;
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.manual-submit {
  height: 92rpx;
  line-height: 92rpx;
  border-radius: 26rpx;
  background: #2563eb;
  color: #ffffff;
  text-align: center;
  font-size: 30rpx;
  font-weight: 900;
  box-shadow: 0 10rpx 22rpx rgba(37, 99, 235, 0.18);
}

.status-card {
  padding: 24rpx;
  border-radius: 26rpx;
  background: #f0fdf4;
  border: 1rpx solid #bbf7d0;
}

.status-title {
  color: #15803d;
  font-size: 28rpx;
  font-weight: 900;
  margin-bottom: 10rpx;
}

.status-desc,
.status-row {
  color: #475569;
  font-size: 24rpx;
  line-height: 36rpx;
}

.status-flow {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 18rpx;
}

.status-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.status-check {
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  border-radius: 999rpx;
  background: #16a34a;
  color: #ffffff;
  text-align: center;
  font-size: 20rpx;
  flex: 0 0 32rpx;
}

.phone-card {
  opacity: 0.9;
}

.phone-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.phone-title {
  color: #334155;
  font-size: 27rpx;
  font-weight: 900;
  margin-bottom: 6rpx;
}

.phone-num {
  color: #16a34a;
  font-size: 28rpx;
  font-weight: 900;
}

.phone-btn {
  height: 62rpx;
  line-height: 62rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #ecfdf5;
  color: #16a34a;
  font-size: 24rpx;
  font-weight: 900;
}

.phone-desc {
  color: #94a3b8;
  font-size: 24rpx;
  line-height: 36rpx;
  margin-top: 8rpx;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 20rpx;
}

.progress-card {
  margin-bottom: 0;
}

.progress-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
  margin-bottom: 10rpx;
}

.progress-meta {
  color: #94a3b8;
  font-size: 24rpx;
  margin-bottom: 16rpx;
}

.progress-preview {
  color: #475569;
  font-size: 25rpx;
  line-height: 40rpx;
}

.progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22rpx 0 12rpx;
  color: #64748b;
  font-size: 24rpx;
  font-weight: 900;
}

.progress-percent {
  color: #2563eb;
}

.progress-bar {
  height: 16rpx;
  border-radius: 999rpx;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.progress-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
  margin-top: 18rpx;
}

.progress-step {
  color: #94a3b8;
  font-size: 22rpx;
  font-weight: 800;
  text-align: center;
}

.progress-step.done {
  color: #16a34a;
}

.progress-step.active {
  color: #2563eb;
}

.cancel-btn {
  height: 72rpx;
  line-height: 72rpx;
  margin-top: 24rpx;
  border-radius: 22rpx;
  background: #fff1f2;
  border: 1rpx solid #fecaca;
  color: #e11d48;
  text-align: center;
  font-size: 25rpx;
  font-weight: 900;
}

.cancelled-text {
  margin-top: 24rpx;
  color: #e11d48;
  font-size: 25rpx;
  font-weight: 900;
}
</style>
