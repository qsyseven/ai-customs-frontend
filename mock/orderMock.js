export function getMockMemberPlans() {
  return [
    {
      id: 'free',
      name: '免费体验版',
      fit: '新用户注册默认权益',
      price: '0元',
      period: '30天内有效',
      tag: '默认开通',
      disabled: true,
      features: [
        ['AI咨询', '5次'],
        ['批量AI咨询', '1次，单次最多10个商品'],
        ['人工咨询', '0次']
      ]
    },
    {
      id: 'standard_month',
      name: '标准版会员-月付',
      fit: '有稳定进出口业务的企业、外贸公司、跨境电商和报关服务机构',
      price: '999元',
      period: '1个月',
      tag: '推荐',
      disabled: false,
      features: [
        ['AI咨询', '100次/月'],
        ['批量AI咨询', '10次/月，单次最多100个商品'],
        ['人工咨询', '2次/月'],
        ['权益发放', '按月发放，当月有效']
      ]
    },
    {
      id: 'standard_year',
      name: '标准版会员-年付',
      fit: '适合长期稳定使用，按月发放权益',
      price: '9999元',
      period: '12个月',
      tag: '年付',
      disabled: false,
      features: [
        ['AI咨询', '1200次/年，按月发放'],
        ['批量AI咨询', '120次/年，按月发放'],
        ['人工咨询', '24次/年，按月发放'],
        ['子账号', '最多2个子账号共享权益']
      ]
    }
  ]
}

export function getMockSupplementPacks() {
  return [
    {
      id: 'ai_pack',
      name: 'AI咨询补充包',
      price: '99元',
      meta: '适用对象：标准版会员｜有效期180天｜每次限1个商品，最多10轮对话或24小时内有效',
      rights: 'AI咨询10次'
    },
    {
      id: 'batch_pack',
      name: '批量AI咨询补充包',
      price: '199元',
      meta: '适用对象：标准版会员｜有效期180天｜每次按一个Excel处理任务扣减1次',
      rights: '批量AI咨询3次｜单次商品上限100个'
    },
    {
      id: 'manual_pack',
      name: '人工咨询补充包',
      price: '299元',
      meta: '适用对象：标准版会员｜有效期180天｜服务时长30分钟内',
      rights: '人工咨询1次｜不含书面意见、批量复核等专项服务'
    }
  ]
}

export function getMockOrders() {
  return [
    {
      id: 'order_001',
      title: '标准版会员-月付',
      orderNo: 'ORD20260620001',
      time: '2026-06-20 14:32',
      type: '会员套餐',
      amount: '999元',
      payMethod: '微信支付',
      status: '已支付',
      rightsStatus: '已发放',
      invoiceStatus: '未开票'
    },
    {
      id: 'order_002',
      title: 'AI咨询补充包',
      orderNo: 'ORD20260618002',
      time: '2026-06-18 09:15',
      type: '会员补充包',
      amount: '99元',
      payMethod: '对公转账',
      status: '待核验',
      rightsStatus: '待发放',
      invoiceStatus: '不可开票'
    },
    {
      id: 'order_003',
      title: '批量AI咨询补充包',
      orderNo: 'ORD20260522003',
      time: '2026-05-22 16:48',
      type: '会员补充包',
      amount: '199元',
      payMethod: '微信支付',
      status: '已支付',
      rightsStatus: '已发放',
      invoiceStatus: '已开票'
    }
  ]
}

export function getMockInvoices() {
  return [
    {
      id: 'invoice_001',
      type: '电子普通发票',
      title: '广东某进出口企业',
      amount: '999元',
      orderTitle: '标准版会员-月付',
      status: '已开票',
      time: '2026-06-21 10:20',
      email: 'finance@example.com'
    },
    {
      id: 'invoice_002',
      type: '增值税专用发票',
      title: '广东某进出口企业',
      amount: '199元',
      orderTitle: '批量AI咨询补充包',
      status: '待审核',
      time: '2026-05-23 09:00',
      email: 'finance@example.com'
    }
  ]
}

export function getMockInvoiceForm(orderTitle = '标准版会员-月付（999元）') {
  return {
    orderTitle,
    type: '电子普通发票',
    title: '广东某进出口企业',
    taxNo: '',
    email: '',
    bankName: '',
    bankAccount: '',
    address: ''
  }
}
