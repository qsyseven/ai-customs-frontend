export const MANUAL_FILE_EXTENSIONS = [
  '.xls',
  '.xlsx',
  '.doc',
  '.docx',
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png'
]

export const MANUAL_VIDEO_EXTENSIONS = [
  '.mp4',
  '.mov',
  '.avi'
]

export function getManualDateOptions() {
  return ['今天', '明天', '工作日', '周末']
}

export function getManualTimeOptions() {
  return ['09:00-12:00', '14:00-18:00', '18:00-20:00']
}

export function getManualReplyOptions() {
  return ['优先电话回复', '优先邮箱回复']
}

export function getMockManualProgressList() {
  return [
    {
      id: 'manual_progress_001',
      title: '塑料水杯人工咨询',
      meta: '今天 10:15｜状态：顾问初审中',
      preview: '已提交商品信息、图片资料和产品视频。顾问正在核对商品用途、材质和申报要素。',
      currentStage: '顾问初审',
      percent: 50,
      cancellable: true,
      cancelled: false,
      steps: [
        { name: '提交资料', status: 'done' },
        { name: '顾问初审', status: 'active' },
        { name: '回访沟通', status: 'pending' },
        { name: '结果确认', status: 'pending' }
      ]
    },
    {
      id: 'manual_progress_002',
      title: '电动控制阀人工咨询',
      meta: '2026-06-08 11:30｜状态：已回访',
      preview: '顾问已电话沟通，需补充阀门本体结构图和执行机构参数。',
      currentStage: '回访沟通',
      percent: 75,
      cancellable: false,
      cancelled: false,
      steps: [
        { name: '提交资料', status: 'done' },
        { name: '顾问初审', status: 'done' },
        { name: '回访沟通', status: 'active' },
        { name: '结果确认', status: 'pending' }
      ]
    },
    {
      id: 'manual_progress_003',
      title: '印刷油墨人工咨询',
      meta: '2026-06-05 16:40｜状态：结果已确认',
      preview: '已完成成分比例核对和申报要素整理，归类建议已通过邮箱发送。',
      currentStage: '结果确认',
      percent: 100,
      cancellable: false,
      cancelled: false,
      steps: [
        { name: '提交资料', status: 'done' },
        { name: '顾问初审', status: 'done' },
        { name: '回访沟通', status: 'done' },
        { name: '结果确认', status: 'done' }
      ]
    }
  ]
}
