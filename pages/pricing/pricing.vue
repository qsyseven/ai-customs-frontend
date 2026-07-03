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
          免费体验版 + 标准版会员 + 会员补充包 + 企业顾问版/复杂专项服务，覆盖从试用到日常申报再到复杂事项的全场景需求。
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
        <view
          class="pricing-tab"
          :class="{ active: activeTab === 'special' }"
          @tap="activeTab = 'special'"
        >
          专项服务
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
              {{ getPlanActionText(plan) }}
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

      <block v-else-if="activeTab === 'packs'">
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

      <block v-else>
        <view class="special-card">
          <view class="plan-name">复杂专项服务</view>
          <view class="plan-fit">
            适用于普通AI咨询、批量AI咨询、单次人工咨询无法覆盖的复杂、争议、高风险事项。根据商品数量、资料完整度、判断难度、交付形式、响应时效等因素另行报价。
          </view>
          <view class="special-list">
            <view class="special-row"><view class="special-dot">1</view><view>商品结构复杂，需要结合说明书、图纸、检测报告、工艺资料等进行综合判断。</view></view>
            <view class="special-row"><view class="special-dot">2</view><view>存在多个可能税号，且不同税号之间税率、监管条件或申报要求差异较大。</view></view>
            <view class="special-row"><view class="special-dot">3</view><view>商品涉及历史申报风险，需要结合过往申报记录进行复核。</view></view>
            <view class="special-row"><view class="special-dot">4</view><view>需要形成书面归类复核意见、内部合规说明或申报建议材料。</view></view>
            <view class="special-row"><view class="special-dot">5</view><view>需要对大批量商品进行人工复核、清单整理、商品库建设或税号标准化处理。</view></view>
            <view class="special-row"><view class="special-dot">6</view><view>需要预裁定材料准备、重点商品专项咨询或企业内部培训支持。</view></view>
          </view>
          <view class="primary-btn full" @tap="selectSpecialService">提交专项服务需求</view>
        </view>

        <view class="special-card">
          <view class="plan-name">企业顾问版说明</view>
          <view class="plan-fit">
            企业顾问版不作为普通线上套餐重点展示，主要用于销售跟进、大客户服务和复杂专项服务承接。具体权益、服务范围、响应时效和交付内容根据合同约定执行。
          </view>
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
          <text>{{ selectedPlanType }}</text>
        </view>
        <view class="order-row">
          <text>应付金额</text>
          <text>{{ selectedPlan.price }}</text>
        </view>

        <view class="pay-methods">
          <view
            v-for="method in payMethods"
            :key="method.value"
            class="pay-method"
            :class="{ active: selectedPayMethod === method.value }"
            @tap="selectPayMethod(method.value)"
          >
            <view class="pay-method-title">{{ method.label }}</view>
            <view class="pay-method-desc">{{ method.desc }}</view>
          </view>
        </view>

        <view v-if="selectedPayMethod === 'bank'" class="bank-info">
          <view class="bank-title">对公转账信息</view>
          <view class="bank-row">
            <text>收款户名</text>
            <text>某某科技有限公司</text>
          </view>
          <view class="bank-row">
            <text>收款账号</text>
            <view class="bank-account">
              <text>1100 1234 5678 9012 345</text>
              <text class="bank-copy" @tap.stop="copyBankAccount">复制</text>
            </view>
          </view>
          <view class="bank-row">
            <text>开户银行</text>
            <text>招商银行广州科技园支行</text>
          </view>
          <view class="voucher-btn" @tap="chooseVoucher">
            {{ voucherName ? '重新上传转账凭证' : '上传转账凭证' }}
          </view>
          <view v-if="voucherName" class="voucher-tip">已选择凭证：{{ voucherName }}</view>
        </view>

        <view class="pay-action" @tap="handlePayAction">
          {{ selectedPayMethod === 'bank' ? '提交凭证，等待核验' : '确认支付' }}
        </view>

        <view v-if="payStatus === 'success'" class="pay-success">
          支付成功，权益已发放至当前账号。
        </view>
        <view v-if="payStatus === 'pending'" class="pay-pending">
          凭证已提交，后台正在核验到账情况，核验通过后权益将自动发放。
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
      selectedPlan: null,
      selectedPayMethod: 'wechat',
      voucherName: '',
      payStatus: '',
      payMethods: [
        {
          label: '微信支付',
          value: 'wechat',
          desc: '模拟在线支付，确认后立即发放权益'
        },
        {
          label: '对公转账',
          value: 'bank',
          desc: '上传转账凭证，后台核验后发放权益'
        }
      ]
    }
  },

  computed: {
    selectedPlanType() {
      if (this.activeTab === 'member') {
        return '会员套餐'
      }
      if (this.activeTab === 'special') {
        return '顾问评估'
      }
      return '会员补充包'
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
      this.selectedPayMethod = 'wechat'
      this.voucherName = ''
      this.payStatus = ''
      uni.showToast({
        title: '已生成订单',
        icon: 'none'
      })
    },

    getPlanActionText(plan) {
      if (plan.disabled) {
        return '已默认开通'
      }
      if (plan.id === 'standard_year') {
        return '年付购买'
      }
      if (plan.id === 'standard_month') {
        return '月付购买'
      }
      return '立即开通'
    },

    selectSpecialService() {
      this.activeTab = 'special'
      this.selectedPlan = {
        id: 'special_service',
        name: '复杂专项服务',
        price: '另行报价'
      }
      this.selectedPayMethod = 'bank'
      this.voucherName = ''
      this.payStatus = ''
      uni.showToast({
        title: '已提交顾问评估需求',
        icon: 'none'
      })
    },

    showPlanRule(plan) {
      uni.showModal({
        title: plan.name,
        content: plan.disabled ? '新用户注册后自动获得，30天内有效。' : '权益以页面展示为准，实际开通后可在当前权益中查看剩余次数和有效期。',
        showCancel: false
      })
    },

    selectPayMethod(method) {
      this.selectedPayMethod = method
      this.payStatus = ''
    },

    chooseVoucher() {
      if (!uni.chooseMessageFile) {
        this.voucherName = '对公转账凭证.pdf'
        uni.showToast({
          title: '当前环境使用示例凭证',
          icon: 'none'
        })
        return
      }

      uni.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['jpg', 'jpeg', 'png', 'pdf'],
        success: (res) => {
          const file = res.tempFiles && res.tempFiles[0]
          this.voucherName = file ? file.name : '对公转账凭证.pdf'
          uni.showToast({
            title: '凭证已选择',
            icon: 'none'
          })
        },
        fail: () => {
          this.voucherName = '对公转账凭证.pdf'
          uni.showToast({
            title: '当前环境使用示例凭证',
            icon: 'none'
          })
        }
      })
    },

    copyBankAccount() {
      const account = '1100 1234 5678 9012 345'
      if (uni.setClipboardData) {
        uni.setClipboardData({
          data: account,
          success: () => {
            uni.showToast({
              title: '账号已复制',
              icon: 'none'
            })
          }
        })
        return
      }

      uni.showToast({
        title: '账号已复制',
        icon: 'none'
      })
    },

    handlePayAction() {
      if (!this.selectedPlan) {
        return
      }

      if (this.selectedPayMethod === 'bank' && !this.voucherName) {
        uni.showToast({
          title: '请先上传转账凭证',
          icon: 'none'
        })
        return
      }

      this.payStatus = this.selectedPayMethod === 'bank' ? 'pending' : 'success'
      uni.showToast({
        title: this.payStatus === 'success' ? '支付成功' : '凭证已提交',
        icon: this.payStatus === 'success' ? 'success' : 'none'
      })
    },

    showContactToast() {
      uni.showToast({
        title: '顾问将尽快联系',
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
  padding: 24rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.intro-card,
.plan-card,
.pack-card,
.advisor-card,
.special-card,
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

.special-card {
  margin-bottom: 24rpx;
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

.pay-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 22rpx;
}

.pay-method,
.bank-info,
.pay-success,
.pay-pending {
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
  border-radius: 24rpx;
  padding: 22rpx;
}

.pay-method.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.pay-method-title,
.bank-title {
  color: #111827;
  font-size: 27rpx;
  font-weight: 900;
}

.pay-method-desc,
.rule-item {
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 38rpx;
}

.bank-info {
  margin-top: 18rpx;
  border-style: dashed;
  border-color: #bfdbfe;
}

.bank-row {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eef2f7;
  color: #64748b;
  font-size: 24rpx;
}

.bank-row text:last-child {
  color: #111827;
  font-weight: 900;
  text-align: right;
}

.bank-account {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
  color: #111827;
  font-weight: 900;
  text-align: right;
}

.bank-copy {
  height: 42rpx;
  line-height: 42rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
  font-size: 22rpx;
  font-weight: 900;
  white-space: nowrap;
}

.special-list {
  margin-top: 22rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.special-row {
  display: flex;
  gap: 16rpx;
  color: #334155;
  font-size: 24rpx;
  line-height: 38rpx;
}

.special-dot {
  width: 42rpx;
  height: 42rpx;
  line-height: 42rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  color: #2563eb;
  text-align: center;
  font-size: 22rpx;
  font-weight: 900;
  flex: 0 0 42rpx;
}

.voucher-btn {
  margin-top: 18rpx;
}

.voucher-tip {
  margin-top: 14rpx;
  color: #2563eb;
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pay-action {
  height: 86rpx;
  line-height: 86rpx;
  margin-top: 22rpx;
  border-radius: 24rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  text-align: center;
}

.pay-success,
.pay-pending {
  margin-top: 18rpx;
  font-size: 25rpx;
  line-height: 38rpx;
  font-weight: 800;
}

.pay-success {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #15803d;
}

.pay-pending {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #c76a16;
}
</style>
