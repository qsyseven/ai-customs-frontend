<template>
  <view class="invite-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="page-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">邀请用户管理</view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <view class="invite-card hero-card">
        <view class="hero-title">我的邀请码</view>
        <view class="hero-desc">{{ summary.discountText }}</view>
        <view class="code-box">
          <view>
            <view class="code-label">邀请码</view>
            <view class="invite-code">{{ summary.code }}</view>
          </view>
          <view class="copy-btn" @tap="copyInviteCode">复制</view>
        </view>
      </view>

      <view class="stats">
        <view class="stat">
          <strong>{{ summary.total }}</strong>
          <span>已邀请</span>
        </view>
        <view class="stat">
          <strong>{{ summary.paid }}</strong>
          <span>已购买</span>
        </view>
      </view>

      <view class="invite-card">
        <view class="section-head">
          <view>
            <view class="card-title">邀请用户列表</view>
            <view class="card-desc">共邀请 {{ summary.total }} 人，其中 {{ summary.paid }} 人已购买。</view>
          </view>
        </view>

        <view
          v-for="user in users"
          :key="user.id"
          class="invite-row"
        >
          <view class="invite-avatar">{{ user.name.slice(0, 1) }}</view>
          <view class="invite-main">
            <view class="invite-name">
              {{ user.name }}
              <text class="status-tag" :class="{ paid: user.status === '已购买' }">{{ user.status }}</text>
            </view>
            <view class="invite-meta">{{ user.company }}｜{{ user.phone }}</view>
            <view class="invite-meta">
              注册时间：{{ user.registerTime }}{{ user.product ? '｜购买内容：' + user.product : '' }}
            </view>
          </view>
          <view class="amount">{{ user.amount || '-' }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  getMockInviteSummary,
  getMockInviteUsers
} from '../../mock/mineMock'

export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72
      },
      summary: getMockInviteSummary(),
      users: getMockInviteUsers()
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

    copyInviteCode() {
      uni.setClipboardData({
        data: this.summary.code
      })
    }
  }
}
</script>

<style>
.invite-page {
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
  padding: 24rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.invite-card,
.stat {
  margin-bottom: 24rpx;
  padding: 30rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.hero-card {
  background: linear-gradient(135deg, #1e3a8a, #2563eb 56%, #60a5fa);
  border: none;
  color: #ffffff;
}

.hero-title {
  font-size: 38rpx;
  font-weight: 900;
}

.hero-desc {
  margin-top: 12rpx;
  font-size: 25rpx;
  line-height: 40rpx;
  opacity: 0.9;
}

.code-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
  margin-top: 28rpx;
  padding: 22rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.14);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.code-label {
  font-size: 23rpx;
  opacity: 0.85;
}

.invite-code {
  margin-top: 8rpx;
  font-size: 42rpx;
  font-weight: 900;
}

.copy-btn {
  height: 58rpx;
  line-height: 58rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #2563eb;
  font-size: 24rpx;
  font-weight: 900;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  color: #2563eb;
  font-size: 38rpx;
  font-weight: 900;
}

.stat span,
.card-desc,
.invite-meta {
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}

.card-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
}

.card-desc {
  margin-top: 8rpx;
}

.invite-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.invite-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.invite-avatar {
  width: 66rpx;
  height: 66rpx;
  line-height: 66rpx;
  border-radius: 22rpx;
  background: #eff6ff;
  color: #2563eb;
  text-align: center;
  font-size: 26rpx;
  font-weight: 900;
}

.invite-main {
  flex: 1;
  min-width: 0;
}

.invite-name {
  color: #111827;
  font-size: 28rpx;
  font-weight: 900;
}

.status-tag {
  display: inline-block;
  height: 40rpx;
  line-height: 40rpx;
  margin-left: 8rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
  color: #64748b;
  font-size: 20rpx;
  font-weight: 900;
}

.status-tag.paid {
  background: #ecfdf5;
  color: #16a34a;
}

.amount {
  color: #2563eb;
  font-size: 26rpx;
  font-weight: 900;
  white-space: nowrap;
}
</style>
