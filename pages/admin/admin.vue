<template>
  <view class="admin-page">
    <view
      class="top-shell"
      :style="{
        height: navMetrics.topShellHeight + 'px',
        paddingTop: navMetrics.statusBarHeight + 'px'
      }"
    >
      <view class="page-header" :style="{ height: navMetrics.navBarHeight + 'px' }">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="header-title">{{ currentTitle }}</view>
      </view>
    </view>

    <scroll-view
      class="content"
      :style="{ top: navMetrics.topShellHeight + 'px' }"
      scroll-y
    >
      <block v-if="activeModule === 'role'">
        <view class="hero-card">
          <view class="hero-title">角色权限管理</view>
          <view class="hero-desc">通过手机号修改用户角色。角色保存后，对应用户登录时只显示授权范围内的功能。</view>
        </view>

        <view class="card">
          <view class="card-title">修改用户角色</view>
          <view class="card-desc">输入已注册用户手机号，选择需要开通的角色权限。</view>

          <view class="form-item">
            <view class="label">用户手机号</view>
            <input class="input" v-model="roleForm.phone" placeholder="例如：13888886666" />
          </view>

          <view class="form-item">
            <view class="label">角色类型</view>
            <picker :range="roleTypes" :value="roleTypeIndex" @change="changeRoleType">
              <view class="picker-input">{{ roleForm.role }}</view>
            </picker>
          </view>

          <view class="primary-btn" @tap="saveUserRole">保存角色权限</view>
          <view v-if="roleSuccessText" class="success-box">{{ roleSuccessText }}</view>
        </view>

        <view class="seg-tabs">
          <view
            v-for="tab in roleViewTabs"
            :key="tab.value"
            class="seg-tab"
            :class="{ active: activeRoleView === tab.value }"
            @tap="activeRoleView = tab.value"
          >
            {{ tab.label }}
          </view>
        </view>

        <view class="card filter-card">
          <view class="two-cols">
            <view>
              <view class="label">搜索</view>
              <input class="input" v-model="roleSearch" :placeholder="roleSearchPlaceholder" />
            </view>
            <view>
              <view class="label">状态</view>
              <picker :range="statusOptions" :value="roleStatusIndex" @change="changeRoleStatus">
                <view class="picker-input">{{ roleStatus }}</view>
              </picker>
            </view>
          </view>
        </view>

        <view class="section-head">
          <view class="section-title">{{ activeRoleLabel }}列表</view>
          <view v-if="activeRoleView !== 'collector'" class="mini-link" @tap="showRoleExplain">说明</view>
        </view>

        <view
          v-for="person in filteredRolePeople"
          :key="person.id"
          class="person-card"
        >
          <view class="top-row">
            <view>
              <view class="item-name">{{ person.name }}</view>
              <view class="item-sub">手机号：{{ person.phone }}｜角色：{{ activeRoleLabel }}</view>
            </view>
            <view class="tag" :class="person.status === '启用中' ? 'blue' : 'gray'">{{ person.status }}</view>
          </view>

          <view
            v-for="row in person.rows"
            :key="row.label"
            class="kv"
          >
            <text>{{ row.label }}</text>
            <text>{{ row.value }}</text>
          </view>

          <view class="actions">
            <view
              v-if="activeRoleView === 'intro'"
              class="light-btn"
              @tap="openInviteDetail(person)"
            >
              查看推荐用户
            </view>
            <view class="ghost-btn" @tap="togglePersonStatus(person)">
              {{ person.status === '启用中' ? '停用' : '启用' }}
            </view>
          </view>
        </view>

        <view v-if="!filteredRolePeople.length" class="empty-tip">暂无符合条件的{{ activeRoleLabel }}</view>
      </block>

      <block v-else-if="activeModule === 'ticket'">
        <view class="hero-card">
          <view class="hero-title">人工处理</view>
          <view class="hero-desc">处理需要人工跟进的咨询申请和对公转账核对。</view>
        </view>

        <view class="seg-tabs">
          <view class="seg-tab" :class="{ active: activeTicketView === 'consult' }" @tap="activeTicketView = 'consult'">人工咨询处理</view>
          <view class="seg-tab" :class="{ active: activeTicketView === 'bank' }" @tap="activeTicketView = 'bank'">对公核对</view>
        </view>

        <block v-if="activeTicketView === 'consult'">
          <view class="stats">
            <view class="stat"><strong>13</strong><span>待处理</span></view>
            <view class="stat"><strong>8</strong><span>已回访</span></view>
            <view class="stat"><strong>21</strong><span>已结束</span></view>
          </view>

          <view class="chip-row">
            <view
              v-for="status in ticketStatuses"
              :key="status"
              class="chip"
              :class="{ active: ticketFilter === status }"
              @tap="ticketFilter = status"
            >
              {{ status }}
            </view>
          </view>

          <view
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            class="person-card"
          >
            <view class="top-row">
              <view>
                <view class="item-name">{{ ticket.title }}</view>
                <view class="item-sub">{{ ticket.company }}｜{{ ticket.time }}</view>
              </view>
              <view class="tag" :class="ticket.statusClass">{{ ticket.status }}</view>
            </view>
            <view class="kv"><text>商品信息</text><text>{{ ticket.product }}</text></view>
            <view class="kv"><text>问题说明</text><text>{{ ticket.question }}</text></view>
            <view class="kv"><text>回访信息</text><text>{{ ticket.callback }}</text></view>
            <view class="file-tags">
              <text v-for="file in ticket.files" :key="file" class="file-tag">{{ file }}</text>
            </view>
            <view class="actions">
              <view class="light-btn" @tap="showTicketDetail(ticket)">查看处理</view>
            </view>
          </view>
        </block>

        <block v-else>
          <view class="card filter-card">
            <view class="two-cols">
              <view>
                <view class="label">搜索</view>
                <input class="input" v-model="bankSearch" placeholder="单位名/手机号/订单号" />
              </view>
              <view>
                <view class="label">状态</view>
                <picker :range="bankStatuses" :value="bankStatusIndex" @change="changeBankStatus">
                  <view class="picker-input">{{ bankStatus }}</view>
                </picker>
              </view>
            </view>
          </view>

          <view
            v-for="order in filteredBankOrders"
            :key="order.id"
            class="person-card"
          >
            <view class="top-row">
              <view>
                <view class="item-name">{{ order.company }}</view>
                <view class="item-sub">{{ order.contact }}｜{{ order.phone }}｜{{ order.orderNo }}</view>
              </view>
              <view class="tag" :class="order.statusClass">{{ order.status }}</view>
            </view>
            <view class="kv"><text>购买内容</text><text>{{ order.product }}</text></view>
            <view class="kv"><text>转账金额</text><text>{{ order.amount }}</text></view>
            <view class="kv"><text>{{ order.extraLabel }}</text><text>{{ order.extraValue }}</text></view>
            <view class="actions">
              <view class="light-btn" @tap="showBankDetail(order)">查看核对</view>
            </view>
          </view>
        </block>
      </block>

      <block v-else-if="activeModule === 'payment'">
        <view class="hero-card">
          <view class="hero-title">用户订单</view>
          <view class="hero-desc">查看用户购买和收款情况，支持按日期统计收入，区分介绍人推荐和自然注册。</view>
        </view>

        <view class="stats">
          <view class="stat"><strong>{{ paidSummary.userCount }}</strong><span>付费客户</span></view>
          <view class="stat"><strong>{{ paidSummary.totalAmount }}元</strong><span>收款金额</span></view>
          <view class="stat"><strong>{{ paidSummary.orderCount }}</strong><span>用户订单</span></view>
        </view>

        <view class="card filter-card">
          <view class="form-item">
            <view class="label">搜索</view>
            <input class="input" v-model="paidSearch" placeholder="单位名/手机号/联系人" />
          </view>
          <view class="form-item">
            <view class="label">来源</view>
            <picker :range="paidSourceOptions" :value="paidSourceIndex" @change="changePaidSource">
              <view class="picker-input">{{ paidSource }}</view>
            </picker>
          </view>
        </view>

        <view
          v-for="paid in filteredPaidOrders"
          :key="paid.id"
          class="person-card"
        >
          <view class="top-row">
            <view>
              <view class="item-name">{{ paid.company }}</view>
              <view class="item-sub">{{ paid.contact }}｜{{ paid.phone }}｜收款时间：{{ paid.date }}</view>
            </view>
            <view class="source-badge" :class="paid.source === '介绍人推荐' ? 'invite' : 'natural'">{{ paid.source }}</view>
          </view>
          <view class="kv"><text>{{ paid.source === '介绍人推荐' ? '介绍人' : '来源' }}</text><text>{{ paid.referrer }}</text></view>
          <view class="kv"><text>购买内容</text><text>{{ paid.product }}</text></view>
          <view class="kv"><text>收款金额</text><text class="money">{{ paid.amount }}元</text></view>
          <view class="actions">
            <view class="light-btn" @tap="showPaidDetail(paid)">查看收款详情</view>
          </view>
        </view>
      </block>

      <block v-else>
        <view class="hero-card">
          <view class="hero-title">邀请用户管理</view>
          <view class="hero-desc">查看邀请码、邀请注册用户以及首次购买情况。</view>
        </view>

        <view class="card">
          <view class="card-title">我的邀请码</view>
          <view class="card-desc">邀请新用户注册，被邀请人首次充值可享优惠。</view>
          <view class="invite-code-box">
            <view>
              <view class="label">邀请码</view>
              <view class="invite-code">{{ inviteCode }}</view>
            </view>
            <view class="light-btn" @tap="copyInviteCode">复制</view>
          </view>
          <view class="stats compact">
            <view class="stat"><strong>5</strong><span>已邀请</span></view>
            <view class="stat"><strong>3</strong><span>已购买</span></view>
          </view>
        </view>

        <view class="section-head">
          <view>
            <view class="section-title">邀请用户列表</view>
            <view class="section-desc">共邀请 5 人，其中 3 人已购买</view>
          </view>
        </view>

        <view
          v-for="invite in inviteUsers"
          :key="invite.id"
          class="invite-row"
        >
          <view class="invite-avatar">{{ invite.name.slice(0, 1) }}</view>
          <view class="invite-info">
            <view class="item-name">
              {{ invite.name }}
              <text class="invite-tag" :class="{ bought: invite.status === '已购买' }">{{ invite.status }}</text>
            </view>
            <view class="item-sub">{{ invite.company }}｜{{ invite.phone }}</view>
            <view class="item-sub">注册时间：{{ invite.registerTime }}{{ invite.product ? '｜购买内容：' + invite.product : '' }}</view>
          </view>
          <view class="invite-amount">{{ invite.amount || '-' }}</view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navMetrics: {
        statusBarHeight: 20,
        navBarHeight: 52,
        topShellHeight: 72
      },
      activeModule: 'role',
      moduleTabs: [
        { label: '角色权限', value: 'role' },
        { label: '人工处理', value: 'ticket' },
        { label: '用户订单', value: 'payment' },
        { label: '邀请用户', value: 'invite' }
      ],
      roleForm: {
        phone: '13888886666',
        role: '介绍人'
      },
      roleTypes: ['介绍人', '收款管理员', '人工处理员'],
      roleSuccessText: '',
      activeRoleView: 'intro',
      roleViewTabs: [
        { label: '介绍人', value: 'intro' },
        { label: '收款管理员', value: 'collector' },
        { label: '人工处理员', value: 'processor' }
      ],
      roleSearch: '',
      roleStatus: '全部',
      statusOptions: ['全部', '启用中', '已停用'],
      rolePeople: {
        intro: [
          {
            id: 'intro_1',
            name: '张三｜广东某进出口企业',
            phone: '138****6666',
            status: '启用中',
            rows: [
              { label: '邀请码', value: '系统自动生成：YQ-6666-B2' },
              { label: '推荐情况', value: '已推荐42人，其中15人已购买' }
            ]
          },
          {
            id: 'intro_2',
            name: '李四｜华南报关服务部',
            phone: '139****8899',
            status: '启用中',
            rows: [
              { label: '邀请码', value: '系统自动生成：YQ-8899-C5' },
              { label: '推荐情况', value: '已推荐28人，其中9人已购买' }
            ]
          },
          {
            id: 'intro_3',
            name: '王五｜跨境电商用户',
            phone: '137****5588',
            status: '已停用',
            rows: [
              { label: '邀请码', value: '系统自动生成：YQ-5588-D1' },
              { label: '推荐情况', value: '已推荐11人，其中3人已购买' }
            ]
          }
        ],
        collector: [
          {
            id: 'collector_1',
            name: '赵六',
            phone: '136****3333',
            status: '启用中',
            rows: [{ label: '开通时间', value: '2026-06-18 09:30' }]
          },
          {
            id: 'collector_2',
            name: '陈七',
            phone: '135****7777',
            status: '启用中',
            rows: [{ label: '开通时间', value: '2026-06-20 14:12' }]
          },
          {
            id: 'collector_3',
            name: '周八',
            phone: '137****2222',
            status: '已停用',
            rows: [{ label: '停用时间', value: '2026-06-25 18:00' }]
          }
        ],
        processor: [
          {
            id: 'processor_1',
            name: '黄九｜咨询顾问',
            phone: '139****0001',
            status: '启用中',
            rows: [
              { label: '可处理', value: '人工咨询申请、对公核对' },
              { label: '处理情况', value: '今日处理6条，待处理4条' }
            ]
          },
          {
            id: 'processor_2',
            name: '吴十｜客服人员',
            phone: '138****0002',
            status: '启用中',
            rows: [
              { label: '可处理', value: '人工咨询申请、对公核对' },
              { label: '处理情况', value: '今日处理3条，待处理7条' }
            ]
          },
          {
            id: 'processor_3',
            name: '郑十一｜值班人员',
            phone: '137****0003',
            status: '已停用',
            rows: [
              { label: '可处理', value: '人工咨询申请、对公核对' },
              { label: '停用时间', value: '2026-06-26 17:30' }
            ]
          }
        ]
      },
      activeTicketView: 'consult',
      ticketFilter: '全部',
      ticketStatuses: ['全部', '待处理', '已回访', '已结束'],
      tickets: [
        {
          id: 'ticket_1',
          title: '塑料水杯人工咨询',
          company: '广东某进出口企业',
          time: '今天 10:15',
          status: '待处理',
          statusClass: 'orange',
          product: 'PP塑料水杯，容量500ml，用于日常饮水。',
          question: '确认税号方向及规范申报要素。',
          callback: '今天 14:00-18:00｜优先电话回复',
          files: ['商品图片.jpg', '视频资料.mp4', '说明书.pdf']
        },
        {
          id: 'ticket_2',
          title: '电动控制阀人工咨询',
          company: '华南机械设备有限公司',
          time: '昨天 16:30',
          status: '已回访',
          statusClass: 'blue',
          product: '工业管道用电动控制阀，24V执行机构。',
          question: '判断属于阀门本体、阀门零件还是自动控制装置。',
          callback: '工作日 09:00-12:00｜优先电话回复',
          files: ['产品说明书.pdf', '结构图.png', '工作视频.mp4']
        },
        {
          id: 'ticket_3',
          title: '印刷油墨申报咨询',
          company: '深圳某印刷材料公司',
          time: '2026-06-20',
          status: '已结束',
          statusClass: 'gray',
          product: '印刷油墨，含树脂、颜料、溶剂。',
          question: '确认颜色、成分比例与申报要素。',
          callback: '邮箱回复｜结果已发送',
          files: ['成分比例表.xlsx', '标签照片.jpg']
        }
      ],
      bankSearch: '',
      bankStatus: '全部',
      bankStatuses: ['全部', '待核对', '已到账', '已驳回'],
      bankOrders: [
        {
          id: 'bank_1',
          company: '广东某进出口企业',
          contact: '张三',
          phone: '138****8888',
          orderNo: 'ORD20260628001',
          status: '待核对',
          statusClass: 'orange',
          product: '标准版会员-年付',
          amount: '9999元',
          extraLabel: '付款户名',
          extraValue: '广东某进出口企业有限公司'
        },
        {
          id: 'bank_2',
          company: '华南机械设备有限公司',
          contact: '李四',
          phone: '139****6666',
          orderNo: 'ORD20260627006',
          status: '待核对',
          statusClass: 'orange',
          product: '人工咨询补充包',
          amount: '299元',
          extraLabel: '付款户名',
          extraValue: '华南机械设备有限公司'
        },
        {
          id: 'bank_3',
          company: '深圳某外贸公司',
          contact: '陈七',
          phone: '135****7777',
          orderNo: 'ORD20260625003',
          status: '已到账',
          statusClass: 'gray',
          product: 'AI咨询补充包',
          amount: '99元',
          extraLabel: '到账时间',
          extraValue: '2026-06-25 16:20'
        },
        {
          id: 'bank_4',
          company: '广州跨境电商公司',
          contact: '赵六',
          phone: '136****3333',
          orderNo: 'ORD20260624002',
          status: '已驳回',
          statusClass: 'red',
          product: '批量AI咨询补充包',
          amount: '199元',
          extraLabel: '驳回原因',
          extraValue: '凭证金额与订单金额不一致'
        }
      ],
      paidSearch: '',
      paidSource: '全部来源',
      paidSourceOptions: ['全部来源', '介绍人推荐', '自然注册'],
      paidOrders: [
        {
          id: 'paid_1',
          company: '广东某进出口企业',
          contact: '张三',
          phone: '138****8888',
          date: '2026-06-28',
          source: '介绍人推荐',
          referrer: '张三｜138****6666｜YQ-6666-B2',
          product: '标准版会员-年付',
          amount: 9999
        },
        {
          id: 'paid_2',
          company: '佛山五金贸易公司',
          contact: '周八',
          phone: '137****2222',
          date: '2026-06-27',
          source: '自然注册',
          referrer: '无介绍人，用户自行注册',
          product: '批量AI咨询补充包',
          amount: 199
        },
        {
          id: 'paid_3',
          company: '深圳某外贸公司',
          contact: '陈七',
          phone: '135****7777',
          date: '2026-06-25',
          source: '自然注册',
          referrer: '无介绍人，用户自行注册',
          product: 'AI咨询补充包',
          amount: 99
        },
        {
          id: 'paid_4',
          company: '华南机械设备有限公司',
          contact: '李四',
          phone: '139****6666',
          date: '2026-06-27',
          source: '介绍人推荐',
          referrer: '李四｜139****8899｜YQ-8899-C5',
          product: '人工咨询补充包',
          amount: 299
        }
      ],
      inviteCode: 'YQ-8888-A7',
      inviteUsers: [
        { id: 'invite_1', name: '赵六', status: '已购买', company: '广州跨境电商公司', phone: '136****3333', registerTime: '2026-06-20', product: '标准版会员', amount: '999元' },
        { id: 'invite_2', name: '陈七', status: '已购买', company: '深圳某外贸公司', phone: '135****7777', registerTime: '2026-06-18', product: '人工咨询补充包', amount: '299元' },
        { id: 'invite_3', name: '周八', status: '已购买', company: '佛山五金贸易公司', phone: '137****2222', registerTime: '2026-06-15', product: 'AI咨询补充包', amount: '99元' },
        { id: 'invite_4', name: '吴九', status: '未购买', company: '东莞电子厂', phone: '138****9999', registerTime: '2026-06-25', product: '', amount: '' }
      ]
    }
  },

  computed: {
    currentTitle() {
      const current = this.moduleTabs.find(item => item.value === this.activeModule)
      return current ? current.label : '管理后台'
    },

    roleTypeIndex() {
      return this.roleTypes.indexOf(this.roleForm.role)
    },

    roleStatusIndex() {
      return this.statusOptions.indexOf(this.roleStatus)
    },

    bankStatusIndex() {
      return this.bankStatuses.indexOf(this.bankStatus)
    },

    paidSourceIndex() {
      return this.paidSourceOptions.indexOf(this.paidSource)
    },

    activeRoleLabel() {
      const map = {
        intro: '介绍人',
        collector: '收款管理员',
        processor: '人工处理员'
      }
      return map[this.activeRoleView]
    },

    roleSearchPlaceholder() {
      return this.activeRoleView === 'intro' ? '介绍人姓名/手机号' : '姓名/手机号'
    },

    filteredRolePeople() {
      const keyword = this.roleSearch.trim()
      return this.rolePeople[this.activeRoleView].filter((person) => {
        const statusMatched = this.roleStatus === '全部' || person.status === this.roleStatus
        const keywordMatched = !keyword || `${person.name}${person.phone}`.includes(keyword)
        return statusMatched && keywordMatched
      })
    },

    filteredTickets() {
      return this.tickets.filter(item => this.ticketFilter === '全部' || item.status === this.ticketFilter)
    },

    filteredBankOrders() {
      const keyword = this.bankSearch.trim()
      return this.bankOrders.filter((item) => {
        const statusMatched = this.bankStatus === '全部' || item.status === this.bankStatus
        const keywordMatched = !keyword || `${item.company}${item.contact}${item.phone}${item.orderNo}`.includes(keyword)
        return statusMatched && keywordMatched
      })
    },

    filteredPaidOrders() {
      const keyword = this.paidSearch.trim()
      return this.paidOrders.filter((item) => {
        const sourceMatched = this.paidSource === '全部来源' || item.source === this.paidSource
        const keywordMatched = !keyword || `${item.company}${item.contact}${item.phone}`.includes(keyword)
        return sourceMatched && keywordMatched
      })
    },

    paidSummary() {
      return {
        userCount: this.filteredPaidOrders.length,
        orderCount: this.filteredPaidOrders.length,
        totalAmount: this.filteredPaidOrders.reduce((sum, item) => sum + item.amount, 0)
      }
    }
  },

  onLoad(options) {
    this.setNavMetrics()
    if (options && options.tab) {
      this.activeModule = options.tab
    }
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

    changeRoleType(event) {
      this.roleForm.role = this.roleTypes[Number(event.detail.value)]
    },

    changeRoleStatus(event) {
      this.roleStatus = this.statusOptions[Number(event.detail.value)]
    },

    changeBankStatus(event) {
      this.bankStatus = this.bankStatuses[Number(event.detail.value)]
    },

    changePaidSource(event) {
      this.paidSource = this.paidSourceOptions[Number(event.detail.value)]
    },

    saveUserRole() {
      if (!this.roleForm.phone.trim()) {
        this.showToast('请输入手机号')
        return
      }
      const code = 'YQ-' + this.roleForm.phone.slice(-4) + '-A7'
      const roleText = this.roleForm.role === '介绍人'
        ? `已将手机号 ${this.roleForm.phone} 的用户设置为介绍人。系统已自动生成邀请码：${code}`
        : `已将手机号 ${this.roleForm.phone} 的用户设置为${this.roleForm.role}。`
      this.roleSuccessText = roleText
      this.showToast('角色权限已保存')
    },

    togglePersonStatus(person) {
      person.status = person.status === '启用中' ? '已停用' : '启用中'
      this.showToast(person.status === '启用中' ? '已启用' : '已停用')
    },

    openInviteDetail(person) {
      uni.showModal({
        title: '推荐用户',
        content: `${person.name}\n${person.rows.map(row => row.value).join('\n')}`,
        showCancel: false
      })
    },

    showRoleExplain() {
      uni.showModal({
        title: '权限说明',
        content: '当前为前端Mock。后续由后端根据用户角色返回可见菜单和可执行操作。',
        showCancel: false
      })
    },

    showTicketDetail(ticket) {
      uni.showModal({
        title: ticket.title,
        content: `${ticket.product}\n${ticket.question}\n${ticket.callback}`,
        showCancel: false
      })
    },

    showBankDetail(order) {
      uni.showModal({
        title: '对公核对',
        content: `${order.company}\n${order.product}\n${order.amount}\n${order.extraLabel}：${order.extraValue}`,
        confirmText: order.status === '待核对' ? '标记到账' : '知道了',
        success: (res) => {
          if (res.confirm && order.status === '待核对') {
            order.status = '已到账'
            order.statusClass = 'gray'
            this.showToast('已标记到账')
          }
        }
      })
    },

    showPaidDetail(paid) {
      uni.showModal({
        title: '收款详情',
        content: `${paid.company}\n${paid.product}\n收款金额：${paid.amount}元\n来源：${paid.source}`,
        showCancel: false
      })
    },

    copyInviteCode() {
      uni.setClipboardData({
        data: this.inviteCode
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
.admin-page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #172033;
}

.top-shell {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 30;
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
.card,
.person-card,
.invite-row {
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
.card-title,
.section-title {
  color: #111827;
  font-size: 32rpx;
  font-weight: 900;
}

.hero-title {
  color: #ffffff;
  font-size: 36rpx;
}

.hero-desc,
.card-desc,
.section-desc {
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 38rpx;
}

.hero-desc {
  color: rgba(255, 255, 255, 0.88);
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

.input,
.picker-input {
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

.primary-btn {
  height: 84rpx;
  line-height: 84rpx;
  margin-top: 26rpx;
  border-radius: 24rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  text-align: center;
}

.success-box {
  margin-top: 20rpx;
  padding: 22rpx;
  border-radius: 20rpx;
  background: #ecfdf5;
  color: #16a34a;
  font-size: 24rpx;
  line-height: 36rpx;
  font-weight: 800;
}

.seg-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.seg-tab {
  flex: 1;
  height: 68rpx;
  line-height: 68rpx;
  border-radius: 22rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  color: #64748b;
  font-size: 24rpx;
  font-weight: 900;
  text-align: center;
}

.seg-tab.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.filter-card {
  padding: 24rpx;
}

.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.section-head,
.top-row,
.actions,
.invite-code-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18rpx;
}

.section-head {
  margin: 4rpx 4rpx 18rpx;
}

.mini-link,
.light-btn,
.ghost-btn {
  height: 56rpx;
  line-height: 56rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  font-size: 23rpx;
  font-weight: 900;
  white-space: nowrap;
}

.mini-link,
.light-btn {
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  color: #2563eb;
}

.ghost-btn {
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
  color: #64748b;
}

.item-name {
  color: #111827;
  font-size: 29rpx;
  font-weight: 900;
}

.item-sub {
  margin-top: 8rpx;
  color: #8a9ab2;
  font-size: 23rpx;
  line-height: 34rpx;
}

.tag,
.source-badge,
.invite-tag {
  height: 46rpx;
  line-height: 46rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 900;
  white-space: nowrap;
}

.tag.blue,
.source-badge.natural {
  background: #eff6ff;
  color: #2563eb;
}

.tag.orange {
  background: #fff7ed;
  color: #d97706;
}

.tag.gray {
  background: #f1f5f9;
  color: #64748b;
}

.tag.red {
  background: #fff1f2;
  color: #e11d48;
}

.source-badge.invite,
.invite-tag.bought {
  background: #ecfdf5;
  color: #16a34a;
}

.invite-tag {
  display: inline-block;
  height: 40rpx;
  line-height: 40rpx;
  margin-left: 8rpx;
  background: #f1f5f9;
  color: #64748b;
}

.kv {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #eef2f7;
  color: #64748b;
  font-size: 24rpx;
}

.kv text:last-child {
  color: #111827;
  font-weight: 900;
  text-align: right;
}

.actions {
  justify-content: flex-end;
  margin-top: 20rpx;
}

.empty-tip {
  padding: 80rpx 20rpx;
  color: #94a3b8;
  font-size: 25rpx;
  text-align: center;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
  margin-bottom: 24rpx;
}

.stats.compact {
  grid-template-columns: repeat(2, 1fr);
  margin-top: 22rpx;
  margin-bottom: 0;
}

.stat {
  padding: 22rpx 10rpx;
  border-radius: 22rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  text-align: center;
}

.stat strong {
  display: block;
  color: #2563eb;
  font-size: 34rpx;
  font-weight: 900;
}

.stat span {
  color: #64748b;
  font-size: 22rpx;
}

.chip-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.chip {
  flex: 1;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  color: #64748b;
  font-size: 23rpx;
  font-weight: 900;
  text-align: center;
}

.chip.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.file-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 18rpx;
}

.file-tag {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
  color: #64748b;
  font-size: 22rpx;
  font-weight: 800;
}

.money {
  color: #2563eb !important;
}

.invite-code {
  margin-top: 8rpx;
  color: #2563eb;
  font-size: 42rpx;
  font-weight: 900;
}

.invite-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
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
  flex: 0 0 66rpx;
}

.invite-info {
  flex: 1;
  min-width: 0;
}

.invite-amount {
  color: #2563eb;
  font-size: 26rpx;
  font-weight: 900;
  white-space: nowrap;
}
</style>
