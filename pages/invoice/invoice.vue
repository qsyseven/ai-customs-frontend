<template>
  <view class="page">
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">‹</view>
      <view class="nav-title">发票申请</view>
      <view class="nav-placeholder"></view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="white-card">
        <view class="section-title">开票信息</view>

        <view class="type-row">
          <view
            class="type-item"
            :class="{ active: form.invoiceType === '电子普通发票' }"
            @tap="form.invoiceType = '电子普通发票'"
          >
            电子普通发票
          </view>

          <view
            class="type-item"
            :class="{ active: form.invoiceType === '增值税专用发票' }"
            @tap="form.invoiceType = '增值税专用发票'"
          >
            增值税专用发票
          </view>
        </view>

        <view class="form-item">
          <view class="form-label">发票抬头</view>
          <input class="form-input" v-model="form.title" placeholder="请输入企业名称" />
        </view>

        <view class="form-item">
          <view class="form-label">纳税人识别号</view>
          <input class="form-input" v-model="form.taxNo" placeholder="请输入税号" />
        </view>

        <view class="form-item">
          <view class="form-label">开票金额</view>
          <input class="form-input" v-model="form.amount" type="number" placeholder="请输入金额" />
        </view>

        <view class="form-item">
          <view class="form-label">接收邮箱</view>
          <input class="form-input" v-model="form.email" placeholder="请输入邮箱" />
        </view>

        <view
          v-if="form.invoiceType === '增值税专用发票'"
          class="special-fields"
        >
          <view class="form-item">
            <view class="form-label">注册地址</view>
            <input class="form-input" v-model="form.address" placeholder="请输入注册地址" />
          </view>

          <view class="form-item">
            <view class="form-label">开户银行</view>
            <input class="form-input" v-model="form.bankName" placeholder="请输入开户银行" />
          </view>

          <view class="form-item">
            <view class="form-label">银行账号</view>
            <input class="form-input" v-model="form.bankAccount" placeholder="请输入银行账号" />
          </view>
        </view>

        <view class="primary-btn" @tap="handleSubmit">
          提交发票申请
        </view>
      </view>

      <view class="white-card">
        <view class="section-title">发票记录</view>

        <view
          v-for="invoice in invoices"
          :key="invoice.id"
          class="invoice-item"
        >
          <view>
            <view class="invoice-title">{{ invoice.title }}</view>
            <view class="invoice-meta">
              {{ invoice.invoiceType }} ｜ ¥{{ invoice.amount }}
            </view>
            <view class="invoice-time">{{ formatTime(invoice.createdAt) }}</view>
          </view>

          <view class="status-tag" :class="'status-' + invoice.status">
            {{ invoice.statusText }}
          </view>
        </view>
      </view>

      <view class="tip-card">
        发票申请提交后将进入财务审核，开票状态可在订单与发票中查看。
      </view>

      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script>
import { getMockInvoices } from '../../mock/orderMock'
import { ensureLogin } from '../../common/auth'
export default {
  data() {
    return {
      form: {
        invoiceType: '电子普通发票',
        title: '福建某进出口贸易有限公司',
        taxNo: '',
        amount: '',
        email: '',
        address: '',
        bankName: '',
        bankAccount: ''
      },
      invoices: []
    }
  },
  onShow() {
    ensureLogin()
  },

  onLoad() {
    this.invoices = getMockInvoices()
  },

  methods: {
    goBack() {
      uni.navigateBack()
    },

    handleSubmit() {
      if (!this.form.title.trim()) {
        uni.showToast({
          title: '请输入发票抬头',
          icon: 'none'
        })
        return
      }

      if (!this.form.taxNo.trim()) {
        uni.showToast({
          title: '请输入纳税人识别号',
          icon: 'none'
        })
        return
      }

      if (!this.form.amount) {
        uni.showToast({
          title: '请输入开票金额',
          icon: 'none'
        })
        return
      }

      if (!this.form.email.trim()) {
        uni.showToast({
          title: '请输入接收邮箱',
          icon: 'none'
        })
        return
      }

      const invoice = {
        id: 'invoice_' + Date.now(),
        orderNo: 'MOCK',
        title: this.form.title,
        amount: Number(this.form.amount),
        invoiceType: this.form.invoiceType,
        status: 'PENDING',
        statusText: '待开票',
        createdAt: Date.now()
      }

      this.invoices = [invoice, ...this.invoices]

      uni.showToast({
        title: '提交成功',
        icon: 'success'
      })

      this.form.amount = ''
      this.form.email = ''
    },

    formatTime(time) {
      const date = new Date(time)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${month}-${day} ${hour}:${minute}`
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #172033;
}

.nav-bar {
  height: 112rpx;
  padding: 36rpx 28rpx 16rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.back-btn,
.nav-placeholder {
  width: 60rpx;
  font-size: 48rpx;
  color: #64748b;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 800;
}

.content {
  height: calc(100vh - 112rpx);
  padding: 24rpx;
  box-sizing: border-box;
}

.white-card,
.tip-card {
  border-radius: 28rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-sizing: border-box;
}

.white-card {
  background: #ffffff;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.05);
}

.section-title {
  font-size: 30rpx;
  font-weight: 800;
  margin-bottom: 24rpx;
}

.type-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.type-item {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
  text-align: center;
  border-radius: 22rpx;
  background: #f8fafc;
  color: #64748b;
  font-size: 25rpx;
  font-weight: 700;
}

.type-item.active {
  background: #2f6bff;
  color: #ffffff;
}

.form-item {
  margin-bottom: 22rpx;
}

.form-label {
  font-size: 25rpx;
  font-weight: 700;
  color: #475569;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  height: 82rpx;
  padding: 0 22rpx;
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #e5eaf2;
  color: #172033;
  font-size: 26rpx;
  box-sizing: border-box;
}

.primary-btn {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 26rpx;
  background: #2f6bff;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  padding: 22rpx;
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #edf1f7;
  margin-bottom: 16rpx;
}

.invoice-title {
  font-size: 28rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
}

.invoice-meta,
.invoice-time {
  font-size: 23rpx;
  color: #94a3b8;
  margin-bottom: 4rpx;
}

.status-tag {
  height: 46rpx;
  line-height: 46rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 800;
  flex-shrink: 0;
}

.status-PENDING {
  background: #fff7ed;
  color: #f59e0b;
}

.status-COMPLETED {
  background: #ecfdf5;
  color: #16a34a;
}

.tip-card {
  background: #fff7ed;
  color: #c76a16;
  font-size: 24rpx;
  line-height: 38rpx;
}

.bottom-space {
  height: 60rpx;
}
</style>
