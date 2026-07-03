<template>
  <view class="batch-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="batch-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">{{ headerTitle }}</view>
        <view
          v-if="!isHistoryMode"
          class="batch-history-toggle"
          :style="{ right: navMetrics.capsuleSafeRight + 'px' }"
          @tap="openHistory"
        >
          历史
        </view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <block v-if="!isHistoryMode">
        <view class="intro-block">
          <view class="intro-title">批量咨询</view>
          <view class="intro-desc">
            上传商品Excel清单，系统批量生成税号辅助建议，并返回可下载的结果文件。
          </view>
        </view>

        <view class="process-card">
          <view class="flow-line"></view>
          <view class="flow-list">
            <view
              v-for="step in flowSteps"
              :key="step.no"
              class="flow-item"
            >
              <view class="flow-dot">{{ step.no }}</view>
              <view class="flow-text">{{ step.text }}</view>
            </view>
          </view>
        </view>

        <view class="batch-card">
          <view class="batch-card-head">
            <view class="card-title">上传商品清单</view>
            <view class="template-link" @tap="downloadTemplate">下载模板</view>
          </view>

          <view class="card-desc">
            支持平台Excel模板，也支持企业自有Excel模板。系统会自动识别商品信息字段并进行匹配。
          </view>

          <view class="template-fields">
            <view class="template-fields-title">模板建议字段</view>
            <view class="field-chips">
              <view
                v-for="field in templateFields"
                :key="field"
                class="field-chip"
              >
                {{ field }}
              </view>
            </view>
          </view>

          <view class="upload-zone" @tap="chooseExcelFile">
            <view class="upload-icon">XLS</view>
            <view class="upload-main">选择Excel文件</view>
            <view class="upload-sub">支持 .xls / .xlsx，可上传模板文件或企业自有商品清单</view>
          </view>

          <view v-if="selectedFileName" class="file-name">
            已选择Excel：{{ selectedFileName }}
          </view>

          <view class="primary-btn" @tap="generateBatchResult">
            生成批量税号结果
          </view>
        </view>

        <view v-if="resultVisible" class="batch-card">
          <view class="result-head">
            <view class="card-title">生成结果预览</view>
            <view class="result-status">已完成</view>
          </view>

          <view class="card-desc result-desc">
            系统已在原Excel字段后追加：最匹配税号、其他可能的税号、备注。
          </view>

          <view class="result-summary">
            <view
              v-for="item in resultSummary"
              :key="item.label"
              class="result-pill"
            >
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </view>
          </view>

          <view class="result-list">
            <view
              v-for="item in resultList"
              :key="item.id"
              class="result-item"
            >
              <view class="product-name">{{ item.productName }}</view>
              <view class="kv-row">
                <text>最匹配税号</text>
                <text>{{ item.matchedCode }}</text>
              </view>
              <view class="kv-row">
                <text>其他可能税号</text>
                <text>{{ item.otherCodes }}</text>
              </view>
              <view class="kv-row">
                <text>备注</text>
                <text class="note-text">{{ item.note }}</text>
              </view>
            </view>
          </view>

          <view class="primary-btn" @tap="downloadResult">
            下载生成后的Excel结果
          </view>
        </view>
      </block>

      <view v-else class="batch-history-list">
        <view
          v-for="item in historyList"
          :key="item.id"
          class="batch-history-card"
        >
          <view class="batch-history-title">{{ item.title }}</view>
          <view class="batch-history-meta">{{ item.meta }}</view>
          <view class="batch-history-preview">{{ item.preview }}</view>
          <view class="batch-history-status">
            <text>处理状态</text>
            <text>已完成</text>
          </view>
          <view class="history-download-btn" @tap="downloadHistoryResult(item)">
            下载结果文件
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  getMockBatchResults,
  getMockBatchHistory
} from '../../mock/batchMock'

const MAX_EXCEL_SIZE = 10 * 1024 * 1024
const EXCEL_EXTENSIONS = ['.xls', '.xlsx']

export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72,
        capsuleSafeRight: 24
      },
      selectedFileName: '',
      resultVisible: false,
      pageMode: 'main',
      resultList: [],
      historyList: [],
      templateFields: [
        '商品名称',
        '用途',
        '材质/成分',
        '规格型号',
        '品牌',
        '申报要素备注'
      ],
      flowSteps: [
        { no: 1, text: '下载/准备模板' },
        { no: 2, text: '上传Excel清单' },
        { no: 3, text: '生成并下载结果' }
      ]
    }
  },

  computed: {
    isHistoryMode() {
      return this.pageMode === 'history'
    },

    headerTitle() {
      return this.isHistoryMode ? '批量咨询历史' : '批量AI咨询'
    },

    resultSummary() {
      const total = this.resultList.length
      const riskCount = this.resultList.filter(item => String(item.note || '').includes('风险') || String(item.note || '').includes('确认')).length
      return [
        { label: '商品数', value: total },
        { label: '已匹配', value: total },
        { label: '需复核', value: riskCount }
      ]
    }
  },

  onLoad() {
    this.setNavMetrics()
    this.resultList = getMockBatchResults()
    this.historyList = getMockBatchHistory()
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
      if (this.isHistoryMode) {
        this.pageMode = 'main'
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

    openHistory() {
      this.pageMode = 'history'
    },

    downloadTemplate() {
      uni.showToast({
        title: '模板下载准备中',
        icon: 'none'
      })
    },

    chooseExcelFile() {
      if (uni.chooseFile) {
        uni.chooseFile({
          count: 1,
          extension: EXCEL_EXTENSIONS,
          success: (res) => {
            const file = res.tempFiles && res.tempFiles[0]
            this.handleSelectedFile(file)
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

      this.selectedFileName = '商品批量AI咨询清单.xlsx'
      uni.showToast({
        title: '当前环境使用示例文件',
        icon: 'none'
      })
    },

    handleSelectedFile(file) {
      if (!file || !file.name) {
        return
      }

      const fileName = file.name
      const lowerName = fileName.toLowerCase()
      const validExtension = EXCEL_EXTENSIONS.some(ext => lowerName.endsWith(ext))

      if (!validExtension) {
        uni.showToast({
          title: '仅支持 .xls / .xlsx 文件',
          icon: 'none'
        })
        return
      }

      if (file.size && file.size > MAX_EXCEL_SIZE) {
        uni.showToast({
          title: '文件不能超过10MB',
          icon: 'none'
        })
        return
      }

      this.selectedFileName = fileName
    },

    generateBatchResult() {
      if (!this.selectedFileName) {
        uni.showToast({
          title: '请先上传Excel清单',
          icon: 'none'
        })
        return
      }

      this.resultVisible = true

      uni.showToast({
        title: '已生成批量结果',
        icon: 'success'
      })
    },

    downloadResult() {
      uni.showToast({
        title: '结果文件准备中',
        icon: 'none'
      })
    },

    downloadHistoryResult() {
      uni.showToast({
        title: '历史结果文件准备中',
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.batch-page {
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

.batch-header {
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

.batch-history-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 58rpx;
  line-height: 58rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid #d7e0ee;
  color: #172033;
  font-size: 26rpx;
  font-weight: 900;
}

.content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 34rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.intro-block {
  margin-bottom: 28rpx;
}

.intro-title {
  color: #111827;
  font-size: 40rpx;
  font-weight: 900;
  margin-bottom: 12rpx;
}

.intro-desc {
  color: #64748b;
  font-size: 26rpx;
  line-height: 40rpx;
}

.batch-card,
.process-card {
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  border-radius: 30rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.process-card {
  position: relative;
  padding: 34rpx 28rpx;
}

.batch-card-head,
.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.card-title {
  color: #111827;
  font-size: 32rpx;
  font-weight: 900;
}

.card-desc {
  color: #64748b;
  font-size: 25rpx;
  line-height: 40rpx;
  margin-top: 12rpx;
}

.template-fields {
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: 24rpx;
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
}

.template-fields-title {
  color: #475569;
  font-size: 24rpx;
  font-weight: 900;
  margin-bottom: 12rpx;
}

.field-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.field-chip {
  padding: 9rpx 14rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid #e2e8f0;
  color: #475569;
  font-size: 22rpx;
  font-weight: 800;
}

.template-link {
  flex-shrink: 0;
  color: #2563eb;
  font-size: 25rpx;
  font-weight: 900;
  border: 1rpx solid #bfdbfe;
  border-radius: 999rpx;
  background: #eff6ff;
  padding: 12rpx 22rpx;
}

.flow-list {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.flow-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.flow-dot {
  width: 64rpx;
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  border-radius: 999rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  margin-bottom: 18rpx;
}

.flow-text {
  color: #172033;
  font-size: 25rpx;
  font-weight: 900;
  line-height: 34rpx;
}

.flow-line {
  position: absolute;
  left: 110rpx;
  right: 110rpx;
  top: 66rpx;
  height: 4rpx;
  background: #dbeafe;
}

.upload-zone {
  margin-top: 24rpx;
  padding: 54rpx 24rpx;
  border: 3rpx dashed #bfdbfe;
  border-radius: 28rpx;
  background: #f8fbff;
  text-align: center;
}

.upload-icon {
  width: 86rpx;
  height: 86rpx;
  line-height: 86rpx;
  margin: 0 auto 18rpx;
  border-radius: 22rpx;
  background: #eff6ff;
  color: #2563eb;
  font-size: 26rpx;
  font-weight: 900;
}

.upload-main {
  color: #172033;
  font-size: 30rpx;
  font-weight: 900;
  margin-bottom: 10rpx;
}

.upload-sub {
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}

.file-name {
  margin-top: 18rpx;
  padding: 18rpx 20rpx;
  border-radius: 20rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #1d4ed8;
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.primary-btn {
  height: 88rpx;
  line-height: 88rpx;
  margin-top: 24rpx;
  border-radius: 26rpx;
  background: #2563eb;
  color: #ffffff;
  text-align: center;
  font-size: 30rpx;
  font-weight: 900;
}

.result-status {
  flex-shrink: 0;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: #f0fdf4;
  border: 1rpx solid #bbf7d0;
  color: #16a34a;
  font-size: 23rpx;
  font-weight: 900;
}

.result-desc {
  margin-bottom: 18rpx;
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
  margin-bottom: 18rpx;
}

.result-pill {
  padding: 18rpx 10rpx;
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
  text-align: center;
}

.result-pill strong {
  display: block;
  color: #111827;
  font-size: 34rpx;
  font-weight: 900;
}

.result-pill span {
  color: #64748b;
  font-size: 22rpx;
}

.result-list {
  border: 1rpx solid #e5e7eb;
  border-radius: 24rpx;
  overflow: hidden;
}

.result-item {
  padding: 24rpx;
  border-bottom: 1rpx solid #e5e7eb;
}

.result-item:last-child {
  border-bottom: none;
}

.product-name {
  color: #111827;
  font-size: 29rpx;
  font-weight: 900;
  margin-bottom: 14rpx;
}

.kv-row {
  display: grid;
  grid-template-columns: 170rpx 1fr;
  gap: 12rpx;
  color: #172033;
  font-size: 24rpx;
  line-height: 36rpx;
  margin-bottom: 8rpx;
}

.kv-row text:first-child {
  color: #64748b;
}

.note-text {
  color: #b45309;
}

.batch-history-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 20rpx;
}

.batch-history-card {
  padding: 30rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.batch-history-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
  margin-bottom: 12rpx;
}

.batch-history-meta {
  color: #94a3b8;
  font-size: 25rpx;
  margin-bottom: 20rpx;
}

.batch-history-preview {
  color: #172033;
  font-size: 27rpx;
  line-height: 44rpx;
}

.batch-history-status {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
  margin-top: 18rpx;
  padding: 16rpx 18rpx;
  border-radius: 20rpx;
  background: #f0fdf4;
  color: #16a34a;
  font-size: 24rpx;
  font-weight: 900;
}

.history-download-btn {
  display: inline-block;
  height: 70rpx;
  line-height: 70rpx;
  margin-top: 26rpx;
  padding: 0 22rpx;
  border-radius: 22rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
  font-size: 26rpx;
  font-weight: 900;
}

</style>
