<template>
  <view class="ai-page" :class="{ 'attach-open': attachPanelOpen }">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="ai-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="header-left">
          <view class="history-btn" @tap="handleHistory">历史</view>
          <view class="new-chat-btn" @tap="startNewChat">+</view>
        </view>

        <view class="header-title">AI咨询</view>

        <view
          class="batch-entry"
          :style="{ right: navMetrics.capsuleSafeRight + 'px' }"
          @tap="goBatch"
        >
          批量
        </view>
      </view>
    </view>

    <scroll-view
      class="chat-scroll"
      :style="{
        top: navMetrics.topShellHeight + 'px'
      }"
      scroll-y
      :scroll-into-view="scrollTarget"
      scroll-with-animation
    >
      <view class="chat-date">今天 09:41</view>

      <view
        v-for="message in messages"
        :id="'msg-' + message.id"
        :key="message.id"
        class="message-row"
        :class="{ user: message.role === 'user' }"
      >
        <view v-if="message.role === 'ai'" class="avatar">AI</view>

        <view class="bubble" :class="message.role">
          <text v-if="message.type === 'text'" class="bubble-text">{{ message.content }}</text>

          <view v-if="message.type === 'basic-form'" class="result-block">
            <view class="block-title">基础字段识别</view>
            <view class="block-desc">
              已根据商品描述先识别出较确定的基础字段，未提到或仍需确认的字段请继续补充。
            </view>

            <view class="section-title">已识别基础字段</view>
            <view class="field-list">
              <view
                v-for="item in basicField.recognizedFields"
                :key="item.label"
                class="field-row"
              >
                <text class="field-key">{{ item.label }}</text>
                <text class="field-value">{{ item.value }}</text>
              </view>
            </view>

            <view class="section-title">待补充基础字段</view>
            <view
              v-for="field in basicField.pendingFields"
              :key="field.key"
              class="form-card"
            >
              <view class="form-label">{{ field.label }}</view>
              <view class="form-tip">{{ field.tip }}</view>
              <input
                class="form-input"
                v-model="basicForm[field.key]"
                :placeholder="field.placeholder"
              />
              <view class="demo-fill" @tap="fillBasicDemo(field)">填入示例</view>
            </view>

            <view class="action-row">
              <view class="light-btn" @tap="skipBasicSupplement">暂不补充</view>
              <view class="blue-btn" @tap="submitBasicSupplement">提交基础信息</view>
            </view>
          </view>

          <view v-if="message.type === 'hs4-result'" class="result-block">
            <view class="block-title">可能的4位税号</view>
            <view
              v-for="candidate in hs4Result.candidates"
              :key="candidate.code"
              class="code-card"
            >
              <view class="code-head">
                <view>
                  <text class="code">{{ candidate.code }}</text>
                  <text class="code-name">{{ candidate.name }}</text>
                </view>
                <text class="tag">{{ candidate.confidence }}</text>
              </view>
              <view class="code-reason">{{ candidate.reason }}</view>
            </view>

            <view class="section-title">推理依据来源</view>
            <view
              v-for="basis in hs4Result.basisRefs"
              :key="basis"
              class="list-line"
            >
              {{ basis }}
            </view>

            <view class="section-title">规范申报目录检索</view>
            <view class="notice-card">{{ hs4Result.declarationSearchText }}</view>
          </view>

          <view v-if="message.type === 'special-form'" class="result-block">
            <view class="block-title">待补充特殊字段</view>
            <view class="block-desc">
              规范申报目录中存在尚未补充的特殊字段。请继续补充以下信息，用于进一步判断8位或10位税号。
            </view>

            <view
              v-for="field in specialField.pendingFields"
              :key="field.key"
              class="form-card"
            >
              <view class="form-label">{{ field.label }}</view>
              <view class="form-tip">{{ field.tip }}</view>
              <input
                class="form-input"
                v-model="specialForm[field.key]"
                :placeholder="field.placeholder"
              />
              <view class="demo-fill" @tap="fillSpecialDemo(field)">填入示例</view>
            </view>

            <view class="action-row">
              <view class="light-btn" @tap="skipSpecialSupplement">暂不补充</view>
              <view class="blue-btn" @tap="submitSpecialSupplement">提交特殊信息</view>
            </view>
          </view>

          <view v-if="message.type === 'final-result'" class="result-block">
            <view class="block-title">最终辅助建议</view>
            <view class="final-code-card">
              <view class="final-label">推荐税号方向</view>
              <view class="final-code">{{ finalResult.recommendedCode }}</view>
              <view class="final-name">{{ finalResult.recommendedName }}</view>
            </view>

            <view class="section-title">推荐归类结果</view>
            <view class="notice-card">{{ finalResult.classificationSummary }}</view>

            <view class="section-title">最终字段整理</view>
            <view class="field-list">
              <view
                v-for="item in finalResult.fieldSummary"
                :key="item.label"
                class="field-row"
              >
                <text class="field-key">{{ item.label }}</text>
                <text class="field-value">{{ item.value }}</text>
              </view>
            </view>

            <view class="section-title">商品特征识别</view>
            <view
              v-for="item in finalResult.featureSummary"
              :key="item"
              class="list-line"
            >
              {{ item }}
            </view>

            <view class="section-title">归类推理过程</view>
            <view
              v-for="item in finalResult.reasoningProcess"
              :key="item"
              class="list-line"
            >
              {{ item }}
            </view>

            <view class="section-title">依据引用</view>
            <view
              v-for="item in finalResult.basisRefs"
              :key="item"
              class="list-line"
            >
              {{ item }}
            </view>

            <view class="section-title">候选税号比较</view>
            <view
              v-for="item in finalResult.candidates"
              :key="item.code"
              class="compare-card"
            >
              <view class="compare-code">{{ item.code }} {{ item.name }}</view>
              <view class="compare-text">{{ item.compare }}</view>
            </view>

            <view class="section-title">易错风险提示</view>
            <view
              v-for="item in finalResult.riskTips"
              :key="item"
              class="risk-line"
            >
              {{ item }}
            </view>

            <view class="section-title">信息缺口与补充建议</view>
            <view
              v-for="item in finalResult.missingSuggestions"
              :key="item"
              class="list-line"
            >
              {{ item }}
            </view>

            <view class="section-title">申报要素建议</view>
            <view class="field-list">
              <view
                v-for="item in finalResult.declarationElements"
                :key="item.label"
                class="field-row"
              >
                <text class="field-key">{{ item.label }}</text>
                <text class="field-value">{{ item.value }}</text>
              </view>
            </view>

            <view class="disclaimer">
              以上结果为辅助建议，最终归类结果由用户结合实际货物、最新税则和海关口径复核确认。
            </view>
          </view>
        </view>
      </view>

      <view id="chat-bottom" class="bottom-anchor"></view>
    </scroll-view>

    <view class="composer-shell">
      <view v-if="selectedFileName" class="file-tip">
        <text class="file-name">{{ selectedFileLabel }}：{{ selectedFileName }}</text>
        <text class="file-remove" @tap="clearFile">移除</text>
      </view>

      <view v-if="attachPanelOpen" class="attach-panel">
        <view class="attach-option" @tap="chooseAttachment('image')">
          <view class="attach-icon">🖼</view>
          <view class="attach-label">图片</view>
        </view>
        <view class="attach-option" @tap="chooseAttachment('pdf')">
          <view class="attach-icon">📄</view>
          <view class="attach-label">PDF</view>
        </view>
        <view class="attach-option" @tap="chooseAttachment('word')">
          <view class="attach-icon">📝</view>
          <view class="attach-label">Word</view>
        </view>
      </view>

      <view class="example-list">
        <view class="example-chip" @tap="useExample('商品是塑料水杯，PP材质，容量500ml，用于日常饮水。')">
          塑料水杯
        </view>
        <view class="example-chip" @tap="useExample('不锈钢保温杯，容量500ml，用于盛装饮品，带塑料杯盖。')">
          不锈钢保温杯
        </view>
        <view class="example-chip" @tap="useExample('女式针织上衣，棉95%、氨纶5%，日常穿着用，零售包装。')">
          女式针织上衣
        </view>
      </view>

      <view class="input-area">
        <view class="attach-btn" @tap="toggleAttachPanel">+</view>
        <textarea
          class="chat-input"
          v-model="inputText"
          auto-height
          maxlength="500"
          placeholder="请输入商品咨询内容..."
        />
        <view class="send-btn" @tap="handleSend">发送</view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getAiWelcomeMessage,
  getBasicFieldMock,
  getHs4Mock,
  getSpecialFieldMock,
  getFinalResultMock
} from '../../mock/aiMock'

export default {
  data() {
    return {
      messageId: 1,
      stage: 'input',
      scrollTarget: 'chat-bottom',
      inputText: '商品是塑料水杯，PP材质，容量500ml，用于日常饮水。',
      selectedFileName: '',
      selectedFileLabel: '',
      attachPanelOpen: false,
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 44,
        topShellHeight: 64,
        capsuleSafeRight: 92
      },
      messages: [],
      basicField: getBasicFieldMock(),
      hs4Result: getHs4Mock(),
      specialField: getSpecialFieldMock(),
      finalResult: getFinalResultMock(),
      basicForm: {
        structure: '',
        principle: '',
        status: '',
        isPart: '',
        proposedHs: ''
      },
      specialForm: {
        brand: '',
        model: '',
        insulation: '',
        materialRatio: ''
      }
    }
  },

  onLoad() {
    this.setNavMetrics()
    this.initConversation()
  },

  onShow() {
    this.loadSelectedHistory()
  },

  methods: {
    setNavMetrics() {
      const systemInfo = uni.getSystemInfoSync()
      const menuButton = uni.getMenuButtonBoundingClientRect
        ? uni.getMenuButtonBoundingClientRect()
        : null

      const statusBarHeight = systemInfo.statusBarHeight || 20
      const navBarHeight = menuButton ? menuButton.height + 16 : 44
      const topShellHeight = statusBarHeight + navBarHeight
      const capsuleSafeRight = menuButton
        ? systemInfo.windowWidth - menuButton.left + 8
        : 92

      this.navMetrics = {
        statusBarHeight,
        navBarHeight,
        topShellHeight,
        capsuleSafeRight
      }
    },

    initConversation() {
      this.messages = []
      this.stage = 'input'
      this.inputText = '商品是塑料水杯，PP材质，容量500ml，用于日常饮水。'
      this.clearFile()
      this.addAiText(getAiWelcomeMessage())
    },

    addAiText(content) {
      this.messages.push({
        id: this.messageId++,
        role: 'ai',
        type: 'text',
        content
      })
      this.scrollToBottom()
    },

    addAiCard(type) {
      this.messages.push({
        id: this.messageId++,
        role: 'ai',
        type
      })
      this.scrollToBottom()
    },

    addUserText(content) {
      this.messages.push({
        id: this.messageId++,
        role: 'user',
        type: 'text',
        content
      })
      this.scrollToBottom()
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTarget = ''
        setTimeout(() => {
          this.scrollTarget = 'chat-bottom'
        }, 30)
      })
    },

    handleSend() {
      const content = this.inputText.trim()

      if (!content) {
        uni.showToast({
          title: '请输入商品咨询内容',
          icon: 'none'
        })
        return
      }

      this.addUserText(content)
      this.inputText = ''

      if (this.selectedFileName) {
        this.addAiText(`已收到${this.selectedFileLabel}附件：${this.selectedFileName}。系统会结合附件内容和商品描述一起整理归类线索。`)
      }

      if (this.stage === 'input' || this.stage === 'done') {
        this.stage = 'basic'
        this.addAiCard('basic-form')
        return
      }

      this.addAiText('当前已有咨询流程正在进行，请先按页面提示补充字段。')
    },

    fillBasicDemo(field) {
      this.basicForm[field.key] = field.demo
    },

    fillSpecialDemo(field) {
      this.specialForm[field.key] = field.demo
    },

    skipBasicSupplement() {
      this.addUserText('暂不补充基础字段，继续生成初步税号方向。')
      this.stage = 'special'
      this.addAiCard('hs4-result')
      this.addAiCard('special-form')
    },

    submitBasicSupplement() {
      const summary = this.basicField.pendingFields
        .map(field => `${field.label}：${this.basicForm[field.key] || '未补充'}`)
        .join('；')

      this.addUserText(`已补充基础字段：${summary}`)
      this.stage = 'special'
      this.addAiCard('hs4-result')
      this.addAiCard('special-form')
    },

    skipSpecialSupplement() {
      this.addUserText('暂不补充特殊字段，按当前信息生成辅助建议。')
      this.stage = 'done'
      this.addAiCard('final-result')
    },

    submitSpecialSupplement() {
      const summary = this.specialField.pendingFields
        .map(field => `${field.label}：${this.specialForm[field.key] || '未补充'}`)
        .join('；')

      this.addUserText(`已补充特殊字段：${summary}`)
      this.stage = 'done'
      this.addAiCard('final-result')
    },

    toggleAttachPanel() {
      this.attachPanelOpen = !this.attachPanelOpen
    },

    chooseAttachment(type) {
      if (!uni.chooseMessageFile) {
        uni.showToast({
          title: '当前环境暂不支持选择文件',
          icon: 'none'
        })
        return
      }

      const configMap = {
        image: {
          label: '图片',
          type: 'image',
          extension: ['jpg', 'jpeg', 'png', 'webp'],
          maxSize: 10 * 1024 * 1024
        },
        pdf: {
          label: 'PDF',
          type: 'file',
          extension: ['pdf'],
          maxSize: 20 * 1024 * 1024
        },
        word: {
          label: 'Word',
          type: 'file',
          extension: ['doc', 'docx'],
          maxSize: 20 * 1024 * 1024
        }
      }
      const config = configMap[type]

      uni.chooseMessageFile({
        count: 1,
        type: config.type,
        extension: config.extension,
        success: (res) => {
          const file = res.tempFiles && res.tempFiles[0]
          if (file) {
            if (!this.validateAttachmentFile(file, config)) {
              return
            }

            this.selectedFileName = file.name
            this.selectedFileLabel = config.label
            this.attachPanelOpen = false
          }
        }
      })
    },

    validateAttachmentFile(file, config) {
      const fileName = file.name || file.path || ''
      const ext = this.getFileExtension(fileName)
      const allowText = config.extension.map(item => `.${item}`).join('、')

      if (!config.extension.includes(ext)) {
        uni.showToast({
          title: `仅支持${config.label}格式：${allowText}`,
          icon: 'none'
        })
        return false
      }

      if (file.size && file.size > config.maxSize) {
        uni.showToast({
          title: `${config.label}大小不能超过${Math.floor(config.maxSize / 1024 / 1024)}MB`,
          icon: 'none'
        })
        return false
      }

      return true
    },

    getFileExtension(fileName) {
      const cleanName = String(fileName).split('?')[0].toLowerCase()
      const dotIndex = cleanName.lastIndexOf('.')

      if (dotIndex === -1) {
        return ''
      }

      return cleanName.slice(dotIndex + 1)
    },

    clearFile() {
      this.selectedFileName = ''
      this.selectedFileLabel = ''
      this.attachPanelOpen = false
    },

    useExample(text) {
      this.inputText = text
    },

    handleHistory() {
      uni.navigateTo({
        url: '/pages/history/history'
      })
    },

    loadSelectedHistory() {
      const history = uni.getStorageSync('mock_history_conversation')

      if (!history) {
        return
      }

      uni.removeStorageSync('mock_history_conversation')
      this.inputText = history.preview || ''
      this.stage = 'input'
      this.addAiText(`已载入历史对话：${history.title}。你可以直接发送继续咨询，或修改输入内容后重新咨询。`)
    },

    startNewChat() {
      this.initConversation()
    },

    goBatch() {
      uni.switchTab({
        url: '/pages/batch/batch'
      })
    }
  }
}
</script>

<style>
.ai-page {
  min-height: 100vh;
  background: #f8fafc;
  color: #172033;
  box-sizing: border-box;
}

.top-shell {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1rpx solid #e5e7eb;
  box-sizing: border-box;
}

.ai-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-sizing: border-box;
}

.header-left {
  position: absolute;
  left: 28rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8rpx;
}

.history-btn {
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid #cbd5e1;
  color: #334155;
  font-size: 26rpx;
  font-weight: 800;
}

.new-chat-btn {
  width: 60rpx;
  height: 60rpx;
  line-height: 56rpx;
  text-align: center;
  border-radius: 999rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2f6bff;
  font-size: 38rpx;
  font-weight: 500;
}

.header-title {
  color: #111827;
  font-size: 34rpx;
  font-weight: 900;
}

.batch-entry {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 25rpx;
  font-weight: 900;
}

.chat-scroll {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 210rpx;
  padding: 24rpx 24rpx 12rpx;
  background: #f1f5f9;
  box-sizing: border-box;
}

.ai-page.attach-open .chat-scroll {
  bottom: 384rpx;
}

.chat-date {
  text-align: center;
  color: #94a3b8;
  font-size: 22rpx;
  margin-bottom: 20rpx;
}

.message-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 22rpx;
}

.message-row.user {
  justify-content: flex-end;
}

.avatar {
  width: 62rpx;
  height: 62rpx;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #2f6bff, #55b6ff);
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14rpx;
  flex-shrink: 0;
}

.bubble {
  max-width: 600rpx;
  border-radius: 24rpx;
  padding: 22rpx;
  box-sizing: border-box;
  font-size: 27rpx;
  line-height: 42rpx;
}

.bubble.ai {
  background: #ffffff;
  color: #334155;
  border: 1rpx solid #e5eaf2;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.bubble.user {
  background: #2f6bff;
  color: #ffffff;
}

.bubble-text {
  white-space: pre-wrap;
}

.result-block {
  width: 100%;
}

.block-title {
  font-size: 32rpx;
  font-weight: 900;
  color: #172033;
  margin-bottom: 12rpx;
}

.block-desc {
  color: #8290a6;
  font-size: 25rpx;
  line-height: 40rpx;
  margin-bottom: 18rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 900;
  color: #172033;
  margin: 24rpx 0 14rpx;
}

.field-list {
  border-radius: 22rpx;
  overflow: hidden;
  border: 1rpx solid #e5eaf2;
  background: #f8fafc;
}

.field-row {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  padding: 18rpx 20rpx;
  border-bottom: 1rpx solid #e5eaf2;
}

.field-row:last-child {
  border-bottom: none;
}

.field-key {
  width: 180rpx;
  flex-shrink: 0;
  color: #64748b;
  font-size: 24rpx;
}

.field-value {
  flex: 1;
  text-align: right;
  color: #172033;
  font-size: 24rpx;
  font-weight: 700;
}

.form-card {
  padding: 20rpx;
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #e5eaf2;
  margin-bottom: 16rpx;
}

.form-label {
  color: #172033;
  font-size: 27rpx;
  font-weight: 900;
  margin-bottom: 8rpx;
}

.form-tip {
  color: #8290a6;
  font-size: 23rpx;
  line-height: 34rpx;
  margin-bottom: 14rpx;
}

.form-input {
  width: 100%;
  height: 76rpx;
  border-radius: 20rpx;
  background: #ffffff;
  border: 1rpx solid #e5eaf2;
  padding: 0 20rpx;
  color: #172033;
  font-size: 26rpx;
  box-sizing: border-box;
}

.demo-fill {
  margin-top: 10rpx;
  color: #2f6bff;
  font-size: 23rpx;
  font-weight: 700;
}

.action-row {
  display: flex;
  gap: 16rpx;
  margin-top: 22rpx;
}

.light-btn,
.blue-btn {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
  text-align: center;
  border-radius: 22rpx;
  font-size: 26rpx;
  font-weight: 800;
}

.light-btn {
  background: #f1f5f9;
  color: #64748b;
}

.blue-btn {
  background: #2f6bff;
  color: #ffffff;
}

.code-card,
.compare-card,
.notice-card {
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #e5eaf2;
  padding: 18rpx;
  margin-bottom: 14rpx;
}

.code-head {
  display: flex;
  justify-content: space-between;
  gap: 14rpx;
  align-items: flex-start;
  margin-bottom: 10rpx;
}

.code {
  color: #2f6bff;
  font-size: 30rpx;
  font-weight: 900;
  margin-right: 10rpx;
}

.code-name {
  color: #172033;
  font-size: 25rpx;
  font-weight: 800;
}

.tag {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  color: #2f6bff;
  font-size: 22rpx;
  font-weight: 800;
  flex-shrink: 0;
}

.code-reason,
.compare-text,
.notice-card,
.list-line,
.risk-line,
.disclaimer {
  color: #64748b;
  font-size: 24rpx;
  line-height: 38rpx;
}

.list-line {
  padding: 14rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.list-line:last-child {
  border-bottom: none;
}

.risk-line {
  padding: 16rpx 18rpx;
  border-radius: 18rpx;
  background: #fff7ed;
  color: #c76a16;
  margin-bottom: 12rpx;
}

.final-code-card {
  padding: 24rpx;
  border-radius: 26rpx;
  background: linear-gradient(135deg, #2f6bff, #55b6ff);
  color: #ffffff;
  margin-bottom: 22rpx;
}

.final-label {
  font-size: 23rpx;
  opacity: 0.86;
  margin-bottom: 8rpx;
}

.final-code {
  font-size: 42rpx;
  font-weight: 900;
  margin-bottom: 6rpx;
}

.final-name {
  font-size: 25rpx;
  opacity: 0.92;
}

.compare-code {
  color: #172033;
  font-size: 26rpx;
  font-weight: 900;
  margin-bottom: 8rpx;
}

.disclaimer {
  margin-top: 22rpx;
  padding: 18rpx;
  border-radius: 20rpx;
  background: #f8fafc;
  color: #8290a6;
}

.bottom-anchor {
  height: 20rpx;
}

.composer-shell {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  padding: 18rpx 24rpx;
  background: #ffffff;
  border-top: 1rpx solid #e5e7eb;
  box-sizing: border-box;
}

.file-tip {
  margin-bottom: 14rpx;
  padding: 14rpx 18rpx;
  border-radius: 20rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
}

.file-name {
  flex: 1;
  color: #2f6bff;
  font-size: 24rpx;
}

.file-remove {
  color: #ef4444;
  font-size: 24rpx;
  font-weight: 800;
}

.attach-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 18rpx;
}

.attach-option {
  height: 136rpx;
  border-radius: 28rpx;
  background: #ffffff;
  color: #334155;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.08);
}

.attach-icon {
  font-size: 44rpx;
  line-height: 1;
  margin-bottom: 12rpx;
}

.attach-label {
  color: #334155;
  font-size: 26rpx;
  font-weight: 900;
}

.example-list {
  display: flex;
  gap: 12rpx;
  padding: 0 0 14rpx;
  overflow-x: auto;
  box-sizing: border-box;
}

.example-chip {
  flex-shrink: 0;
  padding: 14rpx 18rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid #e5eaf2;
  color: #8290a6;
  font-size: 23rpx;
}

.input-area {
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  border-radius: 34rpx;
  padding: 14rpx 16rpx;
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
  box-sizing: border-box;
}

.attach-btn {
  width: 68rpx;
  height: 68rpx;
  line-height: 62rpx;
  text-align: center;
  border-radius: 22rpx;
  background: #ffffff;
  border: 1rpx solid #cbd5e1;
  color: #334155;
  font-size: 42rpx;
  font-weight: 300;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  min-height: 68rpx;
  max-height: 180rpx;
  padding: 16rpx 0;
  border-radius: 0;
  background: transparent;
  border: none;
  color: #172033;
  font-size: 26rpx;
  line-height: 36rpx;
  box-sizing: border-box;
}

.send-btn {
  width: 104rpx;
  height: 68rpx;
  line-height: 68rpx;
  text-align: center;
  border-radius: 24rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 25rpx;
  font-weight: 900;
  flex-shrink: 0;
}
</style>
