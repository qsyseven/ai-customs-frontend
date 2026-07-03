<template>
  <view class="mine-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="mine-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view v-if="isDetailMode" class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">{{ headerTitle }}</view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <block v-if="!isDetailMode">
        <view class="profile-card">
          <view class="profile-row">
            <view class="company-avatar">企</view>
            <view class="profile-main">
              <view class="company-name">{{ profile.companyName }}</view>
              <view class="company-sub">
                企业用户｜{{ profile.accountRole }}：{{ profile.accountName }}
              </view>
              <view class="company-sub">账号状态：{{ profile.status }}</view>
            </view>
            <view class="level-badge">{{ profile.levelName }}</view>
          </view>

          <view class="expire-row">
            <text>套餐有效期至 {{ profile.expireAt }}</text>
            <view class="upgrade-btn" @tap="handleMenu('pricing')">升级</view>
          </view>
        </view>

        <view
          v-for="group in groupedMenus"
          :key="group.name"
          class="mine-card"
        >
          <view class="card-title">{{ group.name }}</view>
          <view class="menu-list">
            <view
              v-for="menu in group.items"
              :key="menu.id"
              class="menu-row"
              @tap="handleMenu(menu.id)"
            >
              <view class="menu-left">
                <view class="menu-icon">{{ menu.icon }}</view>
                <view>
                  <view class="menu-title">{{ menu.title }}</view>
                  <view class="menu-desc">{{ menu.desc }}</view>
                </view>
              </view>
              <view class="menu-arrow">›</view>
            </view>
          </view>
        </view>
      </block>

      <block v-else>
        <view class="mine-card">
          <view class="card-head">
            <view>
              <view class="card-title">当前权益</view>
              <view class="card-desc">标准版会员权益明细，仅在下钻页面展示。</view>
            </view>
            <view class="desc-link" @tap="showRightsRule">说明</view>
          </view>

          <view class="rights-list">
            <view
              v-for="right in rightsList"
              :key="right.id"
              class="rights-row"
            >
              <view class="rights-left">
                <view class="rights-icon">{{ right.icon }}</view>
                <view>
                  <view class="rights-name">{{ right.name }}</view>
                  <view class="rights-desc">{{ right.desc }}</view>
                </view>
              </view>
              <view class="rights-value">{{ right.value }}</view>
            </view>
          </view>
        </view>

        <view class="mine-card">
          <view class="card-title">套餐信息</view>
          <view class="package-list">
            <view
              v-for="item in packageInfo"
              :key="item.label"
              class="package-row"
            >
              <view class="package-label">{{ item.label }}</view>
              <view class="package-value">{{ item.value }}</view>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import {
  getMockMineProfile,
  getMockRightsList,
  getMockPackageInfo,
  getMockMineMenus
} from '../../mock/mineMock'

export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72
      },
      pageMode: 'main',
      profile: getMockMineProfile(),
      rightsList: getMockRightsList(),
      packageInfo: getMockPackageInfo(),
      menus: getMockMineMenus()
    }
  },

  computed: {
    isDetailMode() {
      return this.pageMode === 'rights'
    },

    headerTitle() {
      return this.isDetailMode ? '当前权益' : '我的'
    },

    groupedMenus() {
      const groupMap = {}

      this.menus.forEach((item) => {
        if (!groupMap[item.group]) {
          groupMap[item.group] = []
        }
        groupMap[item.group].push(item)
      })

      return Object.keys(groupMap).map(name => ({
        name,
        items: groupMap[name]
      }))
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
      if (this.isDetailMode) {
        this.pageMode = 'main'
      }
    },

    handleMenu(id) {
      if (id === 'rights') {
        this.pageMode = 'rights'
        return
      }

      const routeMap = {
        pricing: '/pages/pricing/pricing',
        adminRole: '/pages/admin/admin?tab=role',
        adminTicket: '/pages/admin/admin?tab=ticket',
        adminPayment: '/pages/admin/admin?tab=payment',
        invite: '/pages/invite/invite',
        members: '/pages/members/members',
        orders: '/pages/orders/orders',
        service: '/pages/service/service'
      }

      if (routeMap[id]) {
        uni.navigateTo({
          url: routeMap[id],
          fail: () => {
            uni.showToast({
              title: '页面暂不可用',
              icon: 'none'
            })
          }
        })
        return
      }

      uni.showToast({
        title: '功能准备中',
        icon: 'none'
      })
    },

    showRightsRule() {
      uni.showModal({
        title: '权益说明',
        content: '权益次数会随套餐周期刷新，使用记录和剩余次数可在当前权益中查看。',
        showCancel: false
      })
    }
  }
}
</script>

<style>
.mine-page {
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

.mine-header {
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

.profile-card {
  padding: 34rpx;
  margin-bottom: 24rpx;
  border-radius: 34rpx;
  background: linear-gradient(135deg, #1e3a8a, #2563eb 56%, #60a5fa);
  color: #ffffff;
  box-shadow: 0 14rpx 32rpx rgba(37, 99, 235, 0.25);
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 22rpx;
}

.company-avatar {
  width: 96rpx;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.18);
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  text-align: center;
  font-size: 34rpx;
  font-weight: 900;
}

.profile-main {
  flex: 1;
  min-width: 0;
}

.company-name {
  font-size: 34rpx;
  font-weight: 900;
  margin-bottom: 10rpx;
}

.company-sub {
  font-size: 24rpx;
  line-height: 36rpx;
  opacity: 0.9;
}

.level-badge {
  height: 52rpx;
  line-height: 52rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  border: 1rpx solid rgba(255, 255, 255, 0.24);
  font-size: 24rpx;
  font-weight: 900;
  white-space: nowrap;
}

.expire-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 28rpx;
  padding: 18rpx 22rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.18);
  font-size: 24rpx;
}

.upgrade-btn {
  height: 52rpx;
  line-height: 52rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #2563eb;
  font-size: 24rpx;
  font-weight: 900;
  white-space: nowrap;
}

.mine-card {
  padding: 30rpx;
  margin-bottom: 24rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 22rpx;
}

.card-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
}

.card-desc {
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
  margin-top: 8rpx;
}

.desc-link {
  height: 50rpx;
  line-height: 50rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
  font-size: 23rpx;
  font-weight: 900;
}

.menu-list {
  margin-top: 18rpx;
}

.menu-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.menu-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 0;
}

.menu-icon,
.rights-icon {
  width: 58rpx;
  height: 58rpx;
  line-height: 58rpx;
  border-radius: 20rpx;
  background: #eff6ff;
  color: #2563eb;
  text-align: center;
  font-size: 24rpx;
  font-weight: 900;
  flex: 0 0 58rpx;
}

.menu-title {
  color: #111827;
  font-size: 28rpx;
  font-weight: 900;
  margin-bottom: 6rpx;
}

.menu-desc {
  color: #94a3b8;
  font-size: 23rpx;
  line-height: 34rpx;
}

.menu-arrow {
  color: #94a3b8;
  font-size: 38rpx;
  font-weight: 400;
}

.rights-list {
  display: flex;
  flex-direction: column;
}

.rights-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.rights-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.rights-left {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.rights-name {
  color: #111827;
  font-size: 28rpx;
  font-weight: 900;
  margin-bottom: 6rpx;
}

.rights-desc {
  color: #64748b;
  font-size: 23rpx;
  line-height: 34rpx;
}

.rights-value {
  color: #2563eb;
  font-size: 30rpx;
  font-weight: 900;
  white-space: nowrap;
}

.package-list {
  margin-top: 18rpx;
}

.package-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18rpx;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.package-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.package-label {
  color: #64748b;
  font-size: 25rpx;
}

.package-value {
  color: #111827;
  font-size: 25rpx;
  font-weight: 900;
}
</style>
