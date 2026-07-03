export function getMockHistoryConversations() {
  return [
    {
      id: 'history_001',
      productName: '塑料水杯',
      title: '塑料水杯归类咨询',
      timeText: '今天 10:26',
      timeType: 'today',
      status: '已生成建议',
      recommendedCode: '3924方向',
      preview: '商品是塑料水杯，PP材质，容量500ml，用于日常饮水。系统建议优先关注3924方向。',
      tags: ['AI咨询', '待复核', '3924方向'],
      lastMessage: '系统已生成基础字段、特殊字段和最终辅助建议。'
    },
    {
      id: 'history_002',
      productName: '印刷油墨',
      title: '印刷油墨归类咨询',
      timeText: '昨天 16:12',
      timeType: 'yesterday',
      status: '已生成建议',
      recommendedCode: '3215方向',
      preview: '印刷油墨，含树脂、颜料、溶剂，用于纸张印刷。系统提示需确认颜色、用途和成分比例。',
      tags: ['AI咨询', '待复核', '3215方向'],
      lastMessage: '系统已整理颜色、用途、成分比例等规范申报要素。'
    },
    {
      id: 'history_003',
      productName: '电动控制阀',
      title: '电动控制阀归类咨询',
      timeText: '近7天',
      timeType: 'week',
      status: '已生成建议',
      recommendedCode: '8481方向',
      preview: '工业管道用电动控制阀，24V执行机构。系统提示需区分阀门本体、阀门零件或自动控制装置。',
      tags: ['AI咨询', '待复核', '8481方向'],
      lastMessage: '系统已提示需补充执行机构与阀体是否一体报验。'
    }
  ]
}
