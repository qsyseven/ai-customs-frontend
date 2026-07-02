export function getMockBatchResults() {
  return [
    {
      id: 'batch_result_001',
      productName: 'PP塑料水杯',
      matchedCode: '3924.10.xx',
      otherCodes: '3924.90.xx、3926.90.xx',
      note: '需确认是否属于餐具/厨房用具，最终编码以实际商品及最新税则为准。'
    },
    {
      id: 'batch_result_002',
      productName: '电动控制阀',
      matchedCode: '8481.80.xx',
      otherCodes: '8481.90.xx、9032.xx',
      note: '需确认该商品为阀门本体、阀门零件还是自动控制装置。'
    },
    {
      id: 'batch_result_003',
      productName: '印刷油墨',
      matchedCode: '3215.19.xx',
      otherCodes: '3215.11.xx、3208.xx',
      note: '需确认颜色、用途、成分比例及是否属于油墨或涂料范围。'
    }
  ]
}

export function getMockBatchHistory() {
  return [
    {
      id: 'batch_history_001',
      title: '商品清单批量咨询',
      meta: '今天 10:26｜批量咨询',
      preview: '上传商品清单Excel，共32个商品。系统已生成税号辅助建议、其他可能税号及备注说明，可继续下载结果文件。'
    },
    {
      id: 'batch_history_002',
      title: '跨境商品清单初筛',
      meta: '昨天 16:12｜批量咨询',
      preview: '上传企业自有Excel模板，共18个商品。系统已识别商品名称、用途、材质/成分等字段，并完成税号初筛。'
    },
    {
      id: 'batch_history_003',
      title: '五金零部件批量归类',
      meta: '2026-06-08 14:20｜批量咨询',
      preview: '上传五金零部件清单，共45个商品。部分商品备注提示需确认是否为零件、附件或整机组成部分。'
    }
  ]
}
