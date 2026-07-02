<template>
  <view class="pricing-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="page-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">开通会员</view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <view class="intro-card">
        <view class="intro-title">选择适合的服务套餐</view>
        <view class="intro-desc">
          免费体验版 + 标准版会员 + 会员补充包 + 企业顾问版，覆盖试用、日常申报和复杂事项承接。
        </view>
      </view>

      <view class="pricing-tabs">
        <view
          class="pricing-tab"
          :class="{ active: activeTab === 'member' }"
          @tap="activeTab = 'member'"
        >
          会员套餐
        </view>
        <view
          class="pricing-tab"
          :class="{ active: activeTab === 'packs' }"
          @tap="activeTab = 'packs'"
        >
          会员补充包
        </view>
      </view>

      <block v-if="activeTab === 'member'">
        <view
          v-for="plan in memberPlans"
          :key="plan.id"
          class="plan-card"
        >
          <view class="plan-head">
            <view>
              <view class="plan-name">{{ plan.name }}</view>
              <view class="plan-fit">{{ plan.fit }}</view>
            </view>
            <view class="plan-tag">{{ plan.tag }}</view>
          </view>

          <view class="price-row">
            <view class="price">{{ plan.price }}</view>
            <view class="period">{{ plan.period }}</view>
          </view>

          <view class="feature-list">
            <view
              v-for="feature in plan.features"
              :key="feature[0]"
              class="feature-row"
            >
              <text>{{ feature[0] }}</text>
              <text>{{ feature[1] }}</text>
            </view>
          </view>

          <view class="plan-actions">
            <view class="secondary-btn" @tap="showPlanRule(plan)">权益说明</view>
            <view
              class="primary-btn"
              :class="{ disabled: plan.disabled }"
              @tap="selectPlan(plan)"
            >
              {{ plan.disabled ? '已默认开通' : '立即开通' }}
            </view>
          </view>
        </view>

        <view class="advisor-card">
          <view class="plan-name">企业顾问版 / 复杂专项服务</view>
          <view class="plan-fit">
            不作为普通线上套餐重点展示，主要用于销售跟进、大客户服务和复杂专项服务承接。具体权益、服务范围、响应时效和交付内容根据合同约定执行。
          </view>
          <view class="outline-btn" @tap="showContactToast">联系顾问</view>
        </view>
      </block>

      <block v-else>
        <view
          v-for="pack in supplementPacks"
          :key="pack.id"
          class="pack-card"
        >
          <view class="pack-head">
            <view>
              <view class="pack-name">{{ pack.name }}</view>
              <view class="pack-meta">{{ pack.meta }}</view>
            </view>
            <view class="pack-price">{{ pack.price }}</view>
          </view>
          <view class="pack-rights">权益：{{ pack.rights }}</view>
          <view class="primary-btn full" @tap="selectPlan(pack)">购买</view>
        </view>
      </block>

      <view v-if="selectedPlan" class="order-card">
        <view class="order-title">确认订单</view>
        <view class="order-row">
          <text>购买项目</text>
          <text>{{ selectedPlan.name }}</text>
        </view>
        <view class="order-row">
          <text>购买类型</text>
          <text>{{ activeTab === 'member' ? '会员套餐' : '会员补充包' }}</text>
        </view>
        <view class="order-row">
          <text>应付金额</text>
          <text>{{ selectedPlan.price }}</text>
        </view>

        <view class="pay-box">
          <view class="pay-title">对公转账预留区</view>
          <view class="pay-desc">
            后续接入后端支付/订单接口。当前页面仅展示流程位置：生成订单、上传转账凭证、后台核验到账、权益发放。
          </view>
          <view class="voucher-btn" @tap="chooseVoucher">上传转账凭证</view>
        </view>
      </view>

      <view class="rule-card">
        <view class="rule-title">权益使用说明</view>
        <view class="rule-item">批量AI咨询以Excel处理任务为单位扣减权益，单次最多支持100个商品。</view>
        <view class="rule-item">会员权益按月发放，当月未使用完的权益默认不顺延至下月。</view>
        <view class="rule-item">补充包仅限有效会员购买和使用，优先扣减会员套餐权益，再扣减补充包权益。</view>
        <view class="rule-item">免费体验权益仅限新用户体验使用，不支持折现、转让、延期或重复领取。</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  getMockMemberPlans,
  getMockSupplementPacks
} from '../../mock/orderMock'

export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72
      },
      activeTab: 'member',
      memberPlans: getMockMemberPlans(),
      supplementPacks: getMockSupplementPacks(),
      selectedPlan: null
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

    selectPlan(plan) {
      if (plan.disabled) {
        this.showPlanRule(plan)
        return
      }

      this.selectedPlan = plan
      uni.showToast({
        title: '已生成Mock订单',
        icon: 'none'
      })
    },

    showPlanRule(plan) {
      uni.showModal({
        title: plan.name,
        content: plan.disabled ? '新用户注册后自动获得，30天内有效。' : '当前为前端Mock权益说明，后续接入后端套餐配置接口。',
        showCancel: false
      })
    },

    chooseVoucher() {
      uni.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['jpg', 'jpeg', 'png', 'pdf'],
        success: () => {
          uni.showToast({
            title: '凭证已选择，接口待接入',
            icon: 'none'
          })
        }
      })
    },

    showContactToast() {
      uni.showToast({
        title: '顾问联系入口待接入',
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.pricing-page {
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

.intro-card,
.plan-card,
.pack-card,
.advisor-card,
.order-card,
.rule-card {
  margin-bottom: 24rpx;
  padding: 30rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.intro-card {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  color: #ffffff;
  border: none;
}

.intro-title {
  font-size: 38rpx;
  font-weight: 900;
}

.intro-desc {
  margin-top: 12rpx;
  font-size: 25rpx;
  line-height: 40rpx;
  opacity: 0.92;
}

.pricing-tabs {
  display: flex;
  padding: 8rpx;
  margin-bottom: 24rpx;
  border-radius: 24rpx;
  background: #eaf0f8;
}

.pricing-tab {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 20rpx;
  color: #64748b;
  font-size: 26rpx;
  font-weight: 900;
  text-align: center;
}

.pricing-tab.active {
  background: #2563eb;
  color: #ffffff;
}

.plan-head,
.pack-head {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.plan-name,
.pack-name,
.order-title,
.rule-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
}

.plan-fit,
.pack-meta {
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}

.plan-tag {
  height: 48rpx;
  line-height: 48rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
  font-size: 22rpx;
  font-weight: 900;
  white-space: nowrap;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 14rpx;
  margin: 24rpx 0;
}

.price,
.pack-price {
  color: #2563eb;
  font-size: 44rpx;
  font-weight: 900;
  white-space: nowrap;
}

.period {
  color: #94a3b8;
  font-size: 24rpx;
}

.feature-list {
  border-radius: 22rpx;
  overflow: hidden;
  border: 1rpx solid #e5e7eb;
}

.feature-row,
.order-row {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
  padding: 20rpx 22rpx;
  border-bottom: 1rpx solid #eef2f7;
  color: #64748b;
  font-size: 24rpx;
}

.feature-row:last-child,
.order-row:last-child {
  border-bottom: none;
}

.feature-row text:last-child,
.order-row text:last-child {
  color: #111827;
  font-weight: 900;
  text-align: right;
}

.plan-actions {
  display: flex;
  gap: 18rpx;
  margin-top: 24rpx;
}

.primary-btn,
.secondary-btn,
.outline-btn,
.voucher-btn {
  height: 82rpx;
  line-height: 82rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 900;
  text-align: center;
}

.primary-btn {
  flex: 1;
  background: #2563eb;
  color: #ffffff;
}

.primary-btn.disabled {
  background: #e2e8f0;
  color: #64748b;
}

.primary-btn.full {
  margin-top: 22rpx;
}

.secondary-btn,
.outline-btn,
.voucher-btn {
  padding: 0 28rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
}

.outline-btn {
  margin-top: 22rpx;
  display: inline-block;
}

.pack-rights {
  margin-top: 18rpx;
  color: #334155;
  font-size: 25rpx;
  line-height: 38rpx;
}

.pay-box {
  margin-top: 22rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #f8fafc;
  border: 1rpx dashed #bfdbfe;
}

.pay-title {
  color: #111827;
  font-size: 27rpx;
  font-weight: 900;
}

.pay-desc,
.rule-item {
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 38rpx;
}

.voucher-btn {
  margin-top: 18rpx;
}
</style>
