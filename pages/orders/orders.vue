<template>
  <view class="orders-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="page-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">{{ headerTitle }}</view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <block v-if="pageMode === 'list'">
        <view class="tabs">
          <view
            class="tab"
            :class="{ active: activeTab === 'order' }"
            @tap="activeTab = 'order'"
          >
            订单记录
          </view>
          <view
            class="tab"
            :class="{ active: activeTab === 'invoice' }"
            @tap="activeTab = 'invoice'"
          >
            发票管理
          </view>
        </view>

        <block v-if="activeTab === 'order'">
          <view
            v-for="order in orders"
            :key="order.id"
            class="order-card"
          >
            <view class="card-head">
              <view>
                <view class="card-title">{{ order.title }}</view>
                <view class="card-meta">{{ order.time }}｜订单号：{{ order.orderNo }}</view>
              </view>
              <view class="status-tag" :class="{ pending: order.status !== '已支付' }">
                {{ order.status }}
              </view>
            </view>

            <view class="info-row">
              <text>购买类型</text>
              <text>{{ order.type }}</text>
            </view>
            <view class="info-row">
              <text>支付方式</text>
              <text>{{ order.payMethod }}</text>
            </view>
            <view class="info-row">
              <text>权益发放</text>
              <text>{{ order.rightsStatus }}</text>
            </view>
            <view class="info-row">
              <text>订单金额</text>
              <text>{{ order.amount }}</text>
            </view>

            <view class="actions">
              <view class="secondary-btn" @tap="openOrderDetail(order)">查看详情</view>
              <view
                v-if="order.status === '已支付' && order.invoiceStatus !== '已开票'"
                class="primary-btn"
                @tap="openApplyInvoice(order)"
              >
                申请开票
              </view>
            </view>
          </view>
        </block>

        <block v-else>
          <view
            v-for="invoice in invoices"
            :key="invoice.id"
            class="order-card"
          >
            <view class="card-head">
              <view>
                <view class="card-title">{{ invoice.type }}</view>
                <view class="card-meta">{{ invoice.time }}｜关联订单：{{ invoice.orderTitle }}</view>
              </view>
              <view class="status-tag" :class="{ pending: invoice.status !== '已开票' }">
                {{ invoice.status }}
              </view>
            </view>

            <view class="info-row">
              <text>发票抬头</text>
              <text>{{ invoice.title }}</text>
            </view>
            <view class="info-row">
              <text>开票金额</text>
              <text>{{ invoice.amount }}</text>
            </view>
            <view class="info-row">
              <text>接收邮箱</text>
              <text>{{ invoice.email }}</text>
            </view>

            <view class="actions">
              <view
                class="secondary-btn"
                @tap="openInvoiceProgress(invoice)"
              >
                查看进度
              </view>
              <view
                class="secondary-btn"
                @tap="openSendInvoiceEmail(invoice)"
              >
                发送发票至邮箱
              </view>
            </view>
          </view>
        </block>
      </block>

      <block v-else-if="pageMode === 'detail'">
        <view class="order-card">
          <view class="card-title">{{ selectedOrder.title }}</view>
          <view class="card-meta">{{ selectedOrder.time }}｜订单号：{{ selectedOrder.orderNo }}</view>

          <view class="detail-list">
            <view class="info-row">
              <text>购买项目</text>
              <text>{{ selectedOrder.title }}</text>
            </view>
            <view class="info-row">
              <text>购买类型</text>
              <text>{{ selectedOrder.type }}</text>
            </view>
            <view class="info-row">
              <text>订单金额</text>
              <text>{{ selectedOrder.amount }}</text>
            </view>
            <view class="info-row">
              <text>支付方式</text>
              <text>{{ selectedOrder.payMethod }}</text>
            </view>
            <view class="info-row">
              <text>订单状态</text>
              <text>{{ selectedOrder.status }}</text>
            </view>
            <view class="info-row">
              <text>权益发放</text>
              <text>{{ selectedOrder.rightsStatus }}</text>
            </view>
            <view class="info-row">
              <text>发票状态</text>
              <text>{{ selectedOrder.invoiceStatus }}</text>
            </view>
          </view>
        </view>

        <view class="order-card">
          <view class="card-title">权益明细</view>
          <view class="rights-row">
            <text>AI咨询</text>
            <text>100次/月</text>
          </view>
          <view class="rights-row">
            <text>批量AI咨询</text>
            <text>10次/月</text>
          </view>
          <view class="rights-row">
            <text>人工咨询</text>
            <text>2次/月</text>
          </view>
        </view>
      </block>

      <block v-else-if="pageMode === 'invoiceProgress'">
        <view class="order-card">
          <view class="card-title">发票进度</view>
          <view class="card-meta">{{ selectedInvoice.orderTitle }}｜{{ selectedInvoice.amount }}</view>

          <view class="progress-list">
            <view
              v-for="step in invoiceProgressSteps"
              :key="step.name"
              class="progress-step"
              :class="step.status"
            >
              <view class="progress-dot">{{ step.status === 'done' ? '✓' : step.no }}</view>
              <view class="progress-main">
                <view class="progress-name">{{ step.name }}</view>
                <view class="progress-desc">{{ step.desc }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="order-card">
          <view class="card-title">开票信息</view>
          <view class="info-row">
            <text>发票抬头</text>
            <text>{{ selectedInvoice.title }}</text>
          </view>
          <view class="info-row">
            <text>发票类型</text>
            <text>{{ selectedInvoice.type }}</text>
          </view>
          <view class="info-row">
            <text>接收邮箱</text>
            <text>{{ selectedInvoice.email }}</text>
          </view>
          <view class="info-row">
            <text>当前状态</text>
            <text>{{ selectedInvoice.status }}</text>
          </view>
        </view>
      </block>

      <block v-else-if="pageMode === 'sendEmail'">
        <view class="order-card">
          <view class="card-title">发送发票至邮箱</view>
          <view class="card-meta">请确认接收邮箱，系统将发送电子发票文件。</view>

          <view class="form-item">
            <view class="label">接收邮箱</view>
            <input class="input" v-model="emailForm.email" placeholder="请输入接收邮箱地址" />
          </view>
          <view class="form-item">
            <view class="label">再次确认邮箱</view>
            <input class="input" v-model="emailForm.confirmEmail" placeholder="请再次输入邮箱地址" />
          </view>

          <view class="primary-btn submit" @tap="submitSendInvoiceEmail">确认发送</view>
          <view v-if="emailSent" class="success-card">
            发送申请已提交，电子发票将发送至 {{ emailForm.email }}。
          </view>
        </view>
      </block>

      <block v-else-if="pageMode === 'applyInvoice'">
        <view class="order-card">
          <view class="card-title">申请开票</view>
          <view class="card-meta">请选择需要开票的订单并填写发票信息。</view>

          <view class="form-item">
            <view class="label">关联订单</view>
            <view class="readonly-input">{{ invoiceForm.orderTitle }}</view>
          </view>

          <view class="form-item">
            <view class="label">发票类型</view>
            <picker
              :range="invoiceTypes"
              :value="invoiceTypeIndex"
              @change="changeInvoiceType"
            >
              <view class="picker-input">{{ invoiceForm.type }}</view>
            </picker>
          </view>

          <view class="form-item">
            <view class="label">发票抬头</view>
            <input class="input" v-model="invoiceForm.title" placeholder="请输入发票抬头" />
          </view>

          <view class="form-item">
            <view class="label">纳税人识别号</view>
            <input class="input" v-model="invoiceForm.taxNo" placeholder="请输入纳税人识别号" />
          </view>

          <view class="form-item">
            <view class="label">接收邮箱</view>
            <input class="input" v-model="invoiceForm.email" placeholder="用于接收电子发票" />
          </view>

          <block v-if="invoiceForm.type === '增值税专用发票'">
            <view class="form-item">
              <view class="label">开户银行</view>
              <input class="input" v-model="invoiceForm.bankName" placeholder="请输入开户银行" />
            </view>
            <view class="form-item">
              <view class="label">银行账号</view>
              <input class="input" v-model="invoiceForm.bankAccount" placeholder="请输入银行账号" />
            </view>
            <view class="form-item">
              <view class="label">注册地址</view>
              <input class="input" v-model="invoiceForm.address" placeholder="请输入注册地址" />
            </view>
            <view class="form-item">
              <view class="label">企业注册电话</view>
              <input class="input" v-model="invoiceForm.phone" placeholder="请输入企业注册电话" />
            </view>
          </block>

          <view class="primary-btn submit" @tap="submitInvoice">提交发票申请</view>
        </view>

        <view class="tip-card">
          电子普通发票一般1-3个工作日内开具并发送至邮箱；增值税专用发票需额外审核。
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import {
  getMockOrders,
  getMockInvoices,
  getMockInvoiceForm
} from '../../mock/orderMock'

export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72
      },
      pageMode: 'list',
      activeTab: 'order',
      orders: getMockOrders(),
      invoices: getMockInvoices(),
      selectedOrder: null,
      selectedInvoice: null,
      emailForm: {
        email: '',
        confirmEmail: ''
      },
      emailSent: false,
      invoiceTypes: ['电子普通发票', '增值税专用发票'],
      invoiceForm: {
        ...getMockInvoiceForm(),
        phone: ''
      }
    }
  },

  computed: {
    headerTitle() {
      if (this.pageMode === 'detail') {
        return '订单详情'
      }
      if (this.pageMode === 'applyInvoice') {
        return '申请开票'
      }
      if (this.pageMode === 'invoiceProgress') {
        return '发票进度'
      }
      if (this.pageMode === 'sendEmail') {
        return '发送发票'
      }
      return '订单与发票'
    },

    invoiceTypeIndex() {
      return this.invoiceTypes.indexOf(this.invoiceForm.type)
    },

    invoiceProgressSteps() {
      const status = this.selectedInvoice ? this.selectedInvoice.status : ''
      const opened = status === '已开票'
      return [
        {
          no: 1,
          name: '提交申请',
          desc: '开票信息已提交，等待系统校验。',
          status: 'done'
        },
        {
          no: 2,
          name: '财务审核',
          desc: opened ? '发票信息已审核通过。' : '正在核对订单、抬头和税号信息。',
          status: opened ? 'done' : 'active'
        },
        {
          no: 3,
          name: '发票开具',
          desc: opened ? '电子发票已开具。' : '审核通过后进入开票环节。',
          status: opened ? 'done' : 'pending'
        },
        {
          no: 4,
          name: '发送邮箱',
          desc: opened ? '可重新发送至指定邮箱。' : '开票后可发送到接收邮箱。',
          status: opened ? 'active' : 'pending'
        }
      ]
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
      if (this.pageMode !== 'list') {
        this.pageMode = 'list'
        return
      }

      uni.navigateBack()
    },

    openOrderDetail(order) {
      this.selectedOrder = order
      this.pageMode = 'detail'
    },

    openApplyInvoice(order) {
      this.invoiceForm = {
        ...getMockInvoiceForm(`${order.title}（${order.amount}）`),
        phone: ''
      }
      this.pageMode = 'applyInvoice'
    },

    openInvoiceProgress(invoice) {
      this.selectedInvoice = invoice
      this.pageMode = 'invoiceProgress'
    },

    openSendInvoiceEmail(invoice) {
      this.selectedInvoice = invoice
      this.emailForm = {
        email: invoice.email,
        confirmEmail: ''
      }
      this.emailSent = false
      this.pageMode = 'sendEmail'
    },

    changeInvoiceType(event) {
      this.invoiceForm.type = this.invoiceTypes[Number(event.detail.value)]
    },

    submitInvoice() {
      if (!this.invoiceForm.title.trim()) {
        this.showToast('请输入发票抬头')
        return
      }

      if (!this.invoiceForm.taxNo.trim()) {
        this.showToast('请输入纳税人识别号')
        return
      }

      if (!this.invoiceForm.email.trim()) {
        this.showToast('请输入接收邮箱')
        return
      }

      if (this.invoiceForm.type === '增值税专用发票') {
        if (!this.invoiceForm.bankName.trim() || !this.invoiceForm.bankAccount.trim() || !this.invoiceForm.address.trim() || !String(this.invoiceForm.phone || '').trim()) {
          this.showToast('请补充专票信息')
          return
        }
      }

      this.invoices = [
        {
          id: 'invoice_' + Date.now(),
          type: this.invoiceForm.type,
          title: this.invoiceForm.title,
          amount: '待确认',
          orderTitle: this.invoiceForm.orderTitle,
          status: '待审核',
          time: '刚刚',
          email: this.invoiceForm.email
        },
        ...this.invoices
      ]

      this.activeTab = 'invoice'
      this.pageMode = 'list'
      this.showToast('发票申请已提交')
    },

    submitSendInvoiceEmail() {
      if (!this.emailForm.email.trim()) {
        this.showToast('请输入接收邮箱')
        return
      }

      if (this.emailForm.email.trim() !== this.emailForm.confirmEmail.trim()) {
        this.showToast('两次输入的邮箱不一致')
        return
      }

      this.emailSent = true
      this.showToast('发票已发送至邮箱')
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
.orders-page {
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

.tabs {
  display: flex;
  padding: 8rpx;
  margin-bottom: 24rpx;
  border-radius: 24rpx;
  background: #eaf0f8;
}

.tab {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 20rpx;
  color: #64748b;
  font-size: 26rpx;
  font-weight: 900;
  text-align: center;
}

.tab.active {
  background: #2563eb;
  color: #ffffff;
}

.order-card,
.tip-card,
.success-card {
  margin-bottom: 24rpx;
  padding: 30rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18rpx;
  margin-bottom: 18rpx;
}

.card-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
}

.card-meta {
  margin-top: 8rpx;
  color: #8a9ab2;
  font-size: 24rpx;
  line-height: 34rpx;
}

.status-tag {
  height: 48rpx;
  line-height: 48rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #ecfdf5;
  color: #16a34a;
  font-size: 22rpx;
  font-weight: 900;
  white-space: nowrap;
}

.status-tag.pending {
  background: #fff7ed;
  color: #d97706;
}

.info-row,
.rights-row {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #eef2f7;
  color: #64748b;
  font-size: 24rpx;
}

.info-row text:last-child,
.rights-row text:last-child {
  color: #111827;
  font-weight: 900;
  text-align: right;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 22rpx;
}

.primary-btn,
.secondary-btn {
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 22rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 900;
  text-align: center;
}

.primary-btn {
  background: #2563eb;
  color: #ffffff;
}

.secondary-btn {
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
}

.detail-list {
  margin-top: 20rpx;
}

.form-item {
  margin-top: 24rpx;
}

.label {
  margin-bottom: 12rpx;
  color: #334155;
  font-size: 26rpx;
  font-weight: 900;
}

.input,
.picker-input,
.readonly-input {
  height: 82rpx;
  line-height: 82rpx;
  padding: 0 22rpx;
  border-radius: 22rpx;
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
  color: #172033;
  font-size: 26rpx;
  box-sizing: border-box;
}

.readonly-input {
  color: #64748b;
}

.submit {
  height: 86rpx;
  line-height: 86rpx;
  margin-top: 28rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
}

.tip-card {
  color: #c76a16;
  background: #fff7ed;
  font-size: 24rpx;
  line-height: 38rpx;
}

.success-card {
  margin-top: 22rpx;
  margin-bottom: 0;
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #15803d;
  font-size: 24rpx;
  line-height: 38rpx;
  font-weight: 800;
}

.progress-list {
  margin-top: 24rpx;
}

.progress-step {
  display: flex;
  gap: 18rpx;
  padding-bottom: 26rpx;
  color: #94a3b8;
}

.progress-step:last-child {
  padding-bottom: 0;
}

.progress-dot {
  width: 52rpx;
  height: 52rpx;
  line-height: 52rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
  color: #64748b;
  text-align: center;
  font-size: 24rpx;
  font-weight: 900;
  flex: 0 0 52rpx;
}

.progress-step.done .progress-dot {
  background: #16a34a;
  color: #ffffff;
}

.progress-step.active .progress-dot {
  background: #2563eb;
  color: #ffffff;
}

.progress-main {
  flex: 1;
  min-width: 0;
}

.progress-name {
  color: #111827;
  font-size: 28rpx;
  font-weight: 900;
}

.progress-desc {
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
}
</style>
