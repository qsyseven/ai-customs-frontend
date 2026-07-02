<template>
  <view class="history-page">
    <scroll-view class="content" scroll-y>
      <view class="filter-card">
        <view class="filter-item">
          <view class="filter-label">时间筛选</view>
          <picker
            mode="selector"
            :range="timeOptions"
            range-key="label"
            :value="currentTimeIndex"
            @change="handleTimeChange"
          >
            <view class="picker-box">
              <text>{{ currentTimeLabel }}</text>
              <text class="picker-arrow">⌄</text>
            </view>
          </picker>
        </view>

        <view class="filter-item">
          <view class="filter-label">商品名称搜索</view>
          <input
            class="search-input"
            v-model="keyword"
            placeholder="搜索商品名称，如：水杯、油墨、控制阀"
          />
        </view>
      </view>

      <view class="history-list">
        <view
          v-for="item in filteredList"
          :key="item.id"
          class="history-card"
          @tap="openConversation(item)"
        >
          <view class="history-title">{{ item.title }}</view>
          <view class="history-meta">{{ item.timeText }} ｜ AI咨询</view>
          <view class="history-preview">{{ item.preview }}</view>
        </view>
      </view>

      <view v-if="!filteredList.length" class="empty-box">
        暂无符合条件的历史对话
      </view>

      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script>
import { getMockHistoryConversations } from '../../mock/historyMock'

export default {
  data() {
    return {
      currentTimeIndex: 0,
      keyword: '',
      timeOptions: [
        { label: '全部时间', value: 'all' },
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '近7天', value: 'week' }
      ],
      histories: []
    }
  },

  computed: {
    currentTimeValue() {
      return this.timeOptions[this.currentTimeIndex]?.value || 'all'
    },

    currentTimeLabel() {
      return this.timeOptions[this.currentTimeIndex]?.label || '全部时间'
    },

    filteredList() {
      const keyword = this.keyword.trim().toLowerCase()
      const timeValue = this.currentTimeValue

      return this.histories.filter(item => {
        const matchTime = timeValue === 'all' || item.timeType === timeValue
        const matchKeyword = !keyword ||
          item.productName.toLowerCase().includes(keyword) ||
          item.title.toLowerCase().includes(keyword) ||
          item.preview.toLowerCase().includes(keyword)

        return matchTime && matchKeyword
      })
    }
  },

  onLoad() {
    this.histories = getMockHistoryConversations()
  },

  methods: {
    handleTimeChange(event) {
      this.currentTimeIndex = Number(event.detail.value)
    },

    openConversation(item) {
      uni.setStorageSync('mock_history_conversation', item)
      uni.showToast({
        title: '已选择历史对话',
        icon: 'none'
      })

      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    }
  }
}
</script>

<style>
.history-page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #172033;
}

.content {
  height: 100vh;
  padding: 34rpx 24rpx 120rpx;
  box-sizing: border-box;
}

.filter-card,
.history-card {
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  border-radius: 30rpx;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.filter-card {
  padding: 26rpx;
  margin-bottom: 24rpx;
}

.filter-item {
  margin-bottom: 22rpx;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.filter-label {
  color: #172033;
  font-size: 28rpx;
  font-weight: 900;
  margin-bottom: 14rpx;
}

.picker-box,
.search-input {
  width: 100%;
  height: 72rpx;
  padding: 0 24rpx;
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
  color: #172033;
  font-size: 26rpx;
  box-sizing: border-box;
}

.picker-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-arrow {
  color: #172033;
  font-size: 34rpx;
  line-height: 1;
}

.history-list {
  display: grid;
  gap: 20rpx;
}

.history-card {
  padding: 30rpx 28rpx;
}

.history-title {
  color: #111827;
  font-size: 30rpx;
  font-weight: 900;
  margin-bottom: 8rpx;
}

.history-meta {
  color: #94a3b8;
  font-size: 25rpx;
  margin-bottom: 18rpx;
}

.history-preview {
  color: #172033;
  font-size: 27rpx;
  line-height: 42rpx;
}

.empty-box {
  padding: 100rpx 20rpx;
  color: #94a3b8;
  text-align: center;
  font-size: 26rpx;
}

.bottom-space {
  height: 60rpx;
}
</style>
