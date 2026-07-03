export function createMockManualTicket(form, files = []) {
  const now = Date.now()

  return {
    id: 'manual_' + now,
    ticketNo: 'RG' + now,
    status: 'SUBMITTED',
    statusText: '已提交',
    productName: form.productName || '未填写商品名称',
    question: form.question || '未填写咨询问题',
    contactName: form.contactName || '',
    contactPhone: form.contactPhone || '',
    contactWechat: form.contactWechat || '',
    files,
    createdAt: now,
    updatedAt: now,
    serviceType: '人工归类咨询',
    expectedReply: '预计 1 个工作日内顾问初步查看资料',
    advisorRemark: ''
  }
}

export function getMockManualHistory() {
  return [
    {
      id: 'manual_history_001',
      ticketNo: 'RG20260629001',
      status: 'COMPLETED',
      statusText: '已完成',
      productName: '塑料水杯',
      question: '请确认塑料水杯适用税号方向，并整理规范申报要素。',
      contactName: '张先生',
      contactPhone: '138****8888',
      contactWechat: 'zhang_test',
      files: [
        { name: '商品图片.jpg', type: 'image' },
        { name: '产品说明书.pdf', type: 'pdf' }
      ],
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      updatedAt: Date.now() - 1000 * 60 * 60 * 18,
      serviceType: '人工归类咨询',
      expectedReply: '已完成',
      advisorRemark: '顾问已完成初步归类思路说明，建议结合材质、用途、容量和是否属于餐具/厨房用具方向进一步复核。'
    },
    {
      id: 'manual_history_002',
      ticketNo: 'RG20260628002',
      status: 'IN_REVIEW',
      statusText: '顾问初审',
      productName: '电动控制阀',
      question: '请判断该商品属于阀门本体、阀门零件还是自动控制装置，并提示申报风险。',
      contactName: '李女士',
      contactPhone: '139****6666',
      contactWechat: 'li_test',
      files: [
        { name: '商品清单.xlsx', type: 'excel' }
      ],
      createdAt: Date.now() - 1000 * 60 * 60 * 7,
      updatedAt: Date.now() - 1000 * 60 * 60 * 5,
      serviceType: '人工归类咨询',
      expectedReply: '顾问正在查看资料',
      advisorRemark: ''
    }
  ]
}

export function getManualStatusSteps(status) {
  const steps = [
    {
      key: 'SUBMITTED',
      title: '提交资料',
      desc: '用户已提交人工咨询资料'
    },
    {
      key: 'IN_REVIEW',
      title: '顾问初审',
      desc: '顾问查看商品信息和附件资料'
    },
    {
      key: 'CALLING',
      title: '回访沟通',
      desc: '顾问通过电话或微信沟通补充信息'
    },
    {
      key: 'COMPLETED',
      title: '结果确认',
      desc: '顾问完成归类思路和申报要素提示'
    }
  ]

  const order = steps.map(item => item.key)
  const activeIndex = order.indexOf(status)

  return steps.map((item, index) => ({
    ...item,
    active: activeIndex >= index,
    current: activeIndex === index
  }))
}
