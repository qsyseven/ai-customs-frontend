<template>
  <view class="service-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="page-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">联系客服</view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <view class="hero-card">
        <view class="hero-title">客服支持</view>
        <view class="hero-desc">归类咨询、订单发票、权益到账、人工服务进度等问题可通过以下方式联系。</view>
      </view>

      <view class="service-card">
        <view class="service-row">
          <view>
            <view class="service-title">客服电话</view>
            <view class="service-value">{{ serviceInfo.phone }}</view>
          </view>
          <view class="action-btn" @tap="callService">拨打</view>
        </view>
        <view class="service-row">
          <view>
            <view class="service-title">服务时间</view>
            <view class="service-value">{{ serviceInfo.workTime }}</view>
          </view>
        </view>
        <view class="service-row">
          <view>
            <view class="service-title">服务邮箱</view>
            <view class="service-value">{{ serviceInfo.email }}</view>
          </view>
          <view class="action-btn" @tap="copyEmail">复制</view>
        </view>
      </view>

      <view class="service-card">
        <view class="card-title">联系前建议准备</view>
        <view
          v-for="tip in serviceInfo.tips"
          :key="tip"
          class="tip-item"
        >
          {{ tip }}
        </view>
      </view>

      <view class="service-card">
        <view class="card-title">常见问题</view>
        <view
          v-for="item in serviceInfo.faq"
          :key="item[0]"
          class="faq-item"
        >
          <view class="faq-question">{{ item[0] }}</view>
          <view class="faq-answer">{{ item[1] }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getMockServiceInfo } from '../../mock/mineMock'

export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72
      },
      serviceInfo: getMockServiceInfo()
    }
  },

  onLoad() {
    this.setNavMetrics()
  },

  methods: {
    setNavMetrics() {
      const systemInfo = uni.getSystemInfoSync()
      const menuButton = uni.getMenuButtonBoundingClientRect
        ? uni.getMenuButtonBoundingClientRect()
        : null
      const statusBarHeight = systemInfo.statusBarHeight || 20
      const navBarHeight = menuButton ? menuButton.height + 16 : 52
      this.navMetrics = {
        statusBarHeight,
        navBarHeight,
        topShellHeight: statusBarHeight + navBarHeight
      }
    },

    goBack() {
      uni.navigateBack()
    },

    callService() {
      uni.makePhoneCall({
        phoneNumber: this.serviceInfo.phone
      })
    },

    copyEmail() {
      uni.setClipboardData({
        data: this.serviceInfo.email
      })
    }
  }
}
</script>

<style>
.service-page {
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

.page-header {
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

.content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.hero-card,
.service-card {
  margin-bottom: 24rpx;
  padding: 30rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.hero-card {
  background: linear-gradient(135deg, #1e3a8a, #2563eb 56%, #60a5fa);
  color: #ffffff;
  border: none;
}

.hero-title,
.card-title {
  font-size: 34rpx;
  font-weight: 900;
}

.hero-desc {
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.88);
  font-size: 25rpx;
  line-height: 40rpx;
}

.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.service-row:first-child {
  padding-top: 0;
}

.service-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.service-title,
.faq-question {
  color: #111827;
  font-size: 28rpx;
  font-weight: 900;
}

.service-value,
.tip-item,
.faq-answer {
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}

.action-btn {
  height: 56rpx;
  line-height: 56rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
  font-size: 24rpx;
  font-weight: 900;
}

.tip-item {
  padding: 18rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.tip-item:last-child {
  border-bottom: none;
}

.faq-item {
  padding: 22rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.faq-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>
