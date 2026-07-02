<template>
  <view class="members-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="page-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">成员管理</view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <view class="profile-card">
        <view class="company-avatar">企</view>
        <view class="profile-main">
          <view class="company-name">{{ profile.companyName }}</view>
          <view class="company-sub">
            主账号：{{ profile.accountName }}｜{{ profile.levelName }}
          </view>
          <view class="company-sub">有效期至 {{ profile.expireAt }}</view>
        </view>
      </view>

      <view class="members-card">
        <view class="card-head">
          <view>
            <view class="card-title">成员列表</view>
            <view class="card-desc">已添加 {{ members.length }} / 3 个成员（含主账号）</view>
          </view>
          <view class="add-btn" @tap="showAddPanel = true">+ 添加成员</view>
        </view>

        <view
          v-for="member in members"
          :key="member.id"
          class="member-row"
        >
          <view class="member-avatar">{{ member.name.slice(0, 1) }}</view>
          <view class="member-info">
            <view class="member-name">
              {{ member.name }}
              <text class="member-tag" :class="{ owner: member.role === '主账号' }">
                {{ member.role }}
              </text>
            </view>
            <view class="member-meta">{{ member.phone }}｜{{ member.joinedAt }} 加入</view>
          </view>
          <view
            v-if="member.role === '主账号'"
            class="member-status"
          >
            {{ member.status }}
          </view>
          <view
            v-else
            class="remove-btn"
            @tap="removeMember(member)"
          >
            移除
          </view>
        </view>
      </view>

      <view class="members-card">
        <view class="card-title">权益共享说明</view>
        <view class="rule-item">所有子账号共享主账号的会员套餐权益和补充包权益。</view>
        <view class="rule-item">子账号使用权益时，统一从主账号的剩余权益中扣减。</view>
        <view class="rule-item">子账号仅可使用AI咨询、批量AI咨询和人工咨询功能，不可单独购买补充包或升级套餐。</view>
        <view class="rule-item">主账号可随时移除子账号，移除后该子账号立即失去权益访问权限。</view>
        <view class="rule-item">标准版会员最多可添加 2 个子账号（共 3 个账号使用）。</view>
      </view>
    </scroll-view>

    <view v-if="showAddPanel" class="panel-mask" @tap="showAddPanel = false">
      <view class="add-panel" @tap.stop>
        <view class="panel-head">
          <view class="panel-title">添加成员</view>
          <view class="close-btn" @tap="showAddPanel = false">×</view>
        </view>
        <view class="panel-desc">添加后，该成员可通过手机号登录并使用主账号权益。</view>

        <view class="form-item">
          <view class="label">成员姓名</view>
          <input class="input" v-model="newMember.name" placeholder="请输入成员姓名" />
        </view>
        <view class="form-item">
          <view class="label">手机号</view>
          <input class="input" v-model="newMember.phone" placeholder="请输入成员手机号" />
        </view>

        <view class="primary-btn" @tap="addMember">确认添加</view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getMockMineProfile,
  getMockMembers
} from '../../mock/mineMock'

export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72
      },
      profile: getMockMineProfile(),
      members: getMockMembers(),
      showAddPanel: false,
      newMember: {
        name: '',
        phone: ''
      }
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

    addMember() {
      if (!this.newMember.name.trim()) {
        this.showToast('请输入成员姓名')
        return
      }
      if (!this.newMember.phone.trim()) {
        this.showToast('请输入手机号')
        return
      }
      if (this.members.length >= 3) {
        this.showToast('标准版会员最多3个账号')
        return
      }

      this.members.push({
        id: 'member_' + Date.now(),
        name: this.newMember.name,
        phone: this.newMember.phone,
        role: '子账号',
        status: '使用中',
        joinedAt: '刚刚'
      })
      this.newMember = { name: '', phone: '' }
      this.showAddPanel = false
      this.showToast('添加成功')
    },

    removeMember(member) {
      uni.showModal({
        title: '移除成员',
        content: `确定要移除${member.name}吗？移除后该账号将立即失去权益访问权限。`,
        success: (res) => {
          if (res.confirm) {
            this.members = this.members.filter(item => item.id !== member.id)
            this.showToast('已移除')
          }
        }
      })
    },

    showToast(title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.members-page {
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

.profile-card,
.members-card {
  margin-bottom: 24rpx;
  padding: 30rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 22rpx;
  background: linear-gradient(135deg, #1e3a8a, #2563eb 56%, #60a5fa);
  color: #ffffff;
  border: none;
}

.company-avatar {
  width: 96rpx;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.18);
  text-align: center;
  font-size: 34rpx;
  font-weight: 900;
}

.profile-main {
  flex: 1;
}

.company-name {
  font-size: 34rpx;
  font-weight: 900;
}

.company-sub {
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 34rpx;
  opacity: 0.9;
}

.card-head,
.member-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.card-title,
.panel-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
}

.card-desc,
.member-meta,
.panel-desc,
.rule-item {
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}

.add-btn {
  height: 54rpx;
  line-height: 54rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 23rpx;
  font-weight: 900;
  white-space: nowrap;
}

.member-row {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.member-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.member-avatar {
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

.member-info {
  flex: 1;
}

.member-name {
  color: #111827;
  font-size: 28rpx;
  font-weight: 900;
}

.member-tag {
  margin-left: 8rpx;
  padding: 5rpx 12rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
  color: #64748b;
  font-size: 20rpx;
}

.member-tag.owner {
  background: #eff6ff;
  color: #2563eb;
}

.member-status,
.remove-btn {
  height: 48rpx;
  line-height: 48rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 900;
}

.member-status {
  background: #ecfdf5;
  color: #16a34a;
}

.remove-btn {
  background: #fff1f2;
  color: #e11d48;
}

.panel-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 40;
  background: rgba(15, 23, 42, 0.38);
  display: flex;
  align-items: flex-end;
}

.add-panel {
  width: 100%;
  padding: 30rpx;
  border-radius: 30rpx 30rpx 0 0;
  background: #ffffff;
  box-sizing: border-box;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  color: #64748b;
  font-size: 42rpx;
}

.form-item {
  margin-top: 22rpx;
}

.label {
  margin-bottom: 10rpx;
  color: #334155;
  font-size: 25rpx;
  font-weight: 900;
}

.input {
  width: 100%;
  height: 82rpx;
  padding: 0 22rpx;
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
  color: #172033;
  font-size: 26rpx;
  box-sizing: border-box;
}

.primary-btn {
  height: 86rpx;
  line-height: 86rpx;
  margin-top: 28rpx;
  border-radius: 24rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  text-align: center;
}
</style>
