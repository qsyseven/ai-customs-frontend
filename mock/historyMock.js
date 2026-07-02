export function getMockHistoryConversations() {
  return [
    {
      id: 'history_001',
      productName: '不锈钢保温杯',
      title: '不锈钢保温杯归类咨询',
      timeText: '今天 09:41',
      timeType: 'today',
      status: '已生成建议',
      recommendedCode: '9617.0000',
      preview: '不锈钢保温杯，容量500ml，用于盛装饮品，带塑料杯盖。系统建议优先关注真空保温器皿方向。',
      tags: ['AI咨询', '待复核', '9617方向'],
      lastMessage: '系统已生成基础字段、特殊字段和最终辅助建议。'
    },
    {
      id: 'history_002',
      productName: '塑料水杯',
      title: '塑料水杯归类咨询',
      timeText: '昨天 15:20',
      timeType: 'yesterday',
      status: '字段待补充',
      recommendedCode: '3924方向',
      preview: '商品是塑料水杯，PP材质，容量500ml，用于日常饮水。系统提示需补充品牌、型号和成分含量。',
      tags: ['AI咨询', '字段待补充', '3924方向'],
      lastMessage: '已识别材质和用途，仍需补充规范申报要素。'
    },
    {
      id: 'history_003',
      productName: '蓝牙无线耳机',
      title: '蓝牙无线耳机归类咨询',
      timeText: '近7天',
      timeType: 'week',
      status: '已生成建议',
      recommendedCode: '8518方向',
      preview: '蓝牙无线耳机，内置锂电池，用于手机音频播放。系统建议关注音频设备及无线通信功能差异。',
      tags: ['AI咨询', '电子产品', '8518方向'],
      lastMessage: '系统提示需关注是否带麦克风、是否成套零售包装。'
    },
    {
      id: 'history_004',
      productName: '女式针织上衣',
      title: '女式针织上衣归类咨询',
      timeText: '近7天',
      timeType: 'week',
      status: '已生成建议',
      recommendedCode: '6110方向',
      preview: '女式针织上衣，棉95%、氨纶5%，日常穿着用，零售包装。系统建议关注针织服装材质和性别属性。',
      tags: ['AI咨询', '服装', '6110方向'],
      lastMessage: '已整理品名、材质、用途和包装状态。'
    }
  ]
}
