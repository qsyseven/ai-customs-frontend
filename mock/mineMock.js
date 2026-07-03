export function getMockMineProfile() {
  return {
    companyName: '广东某进出口企业',
    accountName: '张三',
    accountRole: '主账号',
    status: '已认证',
    levelName: '标准版会员',
    expireAt: '2026-12-31'
  }
}

export function getMockRightsList() {
  return [
    {
      id: 'ai',
      icon: 'AI',
      name: 'AI咨询',
      desc: '单个商品对话咨询',
      value: '28次'
    },
    {
      id: 'batch',
      icon: '表',
      name: '批量AI咨询',
      desc: 'Excel商品清单生成税号',
      value: '5次'
    },
    {
      id: 'manual',
      icon: '人',
      name: '人工咨询',
      desc: '提交资料等待顾问回访',
      value: '2次'
    }
  ]
}

export function getMockPackageInfo() {
  return [
    {
      label: '当前等级',
      value: '标准版会员'
    },
    {
      label: '有效期',
      value: '2026-12-31'
    },
    {
      label: '权益刷新',
      value: '按套餐周期'
    }
  ]
}

export function getMockMineMenus() {
  return [
    {
      id: 'rights',
      group: '会员权益',
      icon: '券',
      title: '当前权益',
      desc: '查看AI咨询、批量AI咨询、人工咨询剩余次数'
    },
    {
      id: 'pricing',
      group: '会员权益',
      icon: '充',
      title: '开通会员',
      desc: '会员套餐、次数包、专项服务'
    },
    {
      id: 'adminRole',
      group: '管理后台',
      icon: '权',
      title: '角色权限管理',
      desc: '维护管理员角色、权限范围和菜单可见性'
    },
    {
      id: 'adminTicket',
      group: '管理后台',
      icon: '工',
      title: '人工处理',
      desc: '处理人工咨询工单、回访和结果确认'
    },
    {
      id: 'adminPayment',
      group: '管理后台',
      icon: '单',
      title: '用户订单管理',
      desc: '管理用户订单、对公转账核验和权益发放'
    },
    {
      id: 'invite',
      group: '账号支持',
      icon: '邀',
      title: '邀请用户管理',
      desc: '查看邀请码、邀请记录和首次充值奖励'
    },
    {
      id: 'members',
      group: '账号支持',
      icon: '员',
      title: '成员管理',
      desc: '管理企业成员账号和使用权限'
    },
    {
      id: 'orders',
      group: '账号支持',
      icon: '票',
      title: '订单与发票',
      desc: '查看订单记录和发票申请'
    },
    {
      id: 'service',
      group: '账号支持',
      icon: '客',
      title: '联系客服',
      desc: '查看服务时间和客服联系方式'
    }
  ]
}

export function getMockInviteSummary() {
  return {
    code: 'YQ-8888-A7',
    total: 5,
    paid: 3,
    discountText: '被邀请用户首次充值可享8折优惠，或额外赠送20% AI咨询次数。'
  }
}

export function getMockInviteUsers() {
  return [
    {
      id: 'invite_1',
      name: '赵六',
      company: '广州跨境电商公司',
      phone: '136****3333',
      status: '已购买',
      registerTime: '2026-06-20',
      product: '标准版会员',
      amount: '999元'
    },
    {
      id: 'invite_2',
      name: '陈七',
      company: '深圳某外贸公司',
      phone: '135****7777',
      status: '已购买',
      registerTime: '2026-06-18',
      product: '人工咨询补充包',
      amount: '299元'
    },
    {
      id: 'invite_3',
      name: '周八',
      company: '佛山五金贸易公司',
      phone: '137****2222',
      status: '已购买',
      registerTime: '2026-06-15',
      product: 'AI咨询补充包',
      amount: '99元'
    },
    {
      id: 'invite_4',
      name: '吴九',
      company: '东莞电子厂',
      phone: '138****9999',
      status: '未购买',
      registerTime: '2026-06-25',
      product: '',
      amount: ''
    }
  ]
}

export function getMockMembers() {
  return [
    {
      id: 'member_owner',
      name: '张三',
      phone: '138****8888',
      role: '主账号',
      status: '使用中',
      joinedAt: '2026-01-15'
    },
    {
      id: 'member_001',
      name: '李四',
      phone: '139****6666',
      role: '子账号',
      status: '使用中',
      joinedAt: '2026-03-20'
    },
    {
      id: 'member_002',
      name: '王五',
      phone: '137****5555',
      role: '子账号',
      status: '使用中',
      joinedAt: '2026-05-10'
    }
  ]
}

export function getMockAdminEntries() {
  return [
    {
      id: 'role',
      title: '角色权限管理',
      desc: '管理员、顾问、财务、普通成员等角色权限',
      status: '可配置',
      metrics: ['角色 4 类', '菜单权限 12 项']
    },
    {
      id: 'ticket',
      title: '人工处理',
      desc: '人工咨询工单、回访沟通、结果确认等流程',
      status: '处理中',
      metrics: ['待处理 3 单', '已完成 18 单']
    },
    {
      id: 'payment',
      title: '用户订单管理',
      desc: '订单查询、对公转账凭证核验、权益发放',
      status: '待核验',
      metrics: ['待核验 2 单', '已支付 24 单']
    },
    {
      id: 'invite',
      title: '邀请用户管理',
      desc: '邀请码、被邀请用户、首次充值奖励记录',
      status: '可查看',
      metrics: ['邀请码 YQ-6688', '已邀请 6 人']
    }
  ]
}

export function getMockServiceInfo() {
  return {
    phone: '400-888-1234',
    workTime: '工作日 09:00-18:00',
    email: 'service@example.com',
    tips: [
      'AI归类建议仅作辅助参考，最终申报以用户复核、最新税则和海关口径为准。',
      '人工咨询提交后，顾问将在服务时间内根据资料完整度进行回访。',
      '订单、发票和权益问题可提供手机号、订单号或企业名称协助查询。'
    ],
    faq: [
      ['发票多久可以开具？', '一般核验通过后1-3个工作日内开具。'],
      ['权益没到账怎么办？', '请先确认支付成功，再联系客服查询。'],
      ['能否开具增值税专用发票？', '可以，请在订单与发票页面提交专票信息。']
    ]
  }
}
