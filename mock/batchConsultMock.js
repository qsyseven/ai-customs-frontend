export function createMockBatchTask(fileName = '商品清单.xlsx') {
  const now = Date.now()

  return {
    id: 'batch_' + now,
    fileName,
    status: 'PROCESSING',
    statusText: '处理中',
    progress: 0,
    totalCount: 36,
    successCount: 0,
    failedCount: 0,
    reviewCount: 0,
    createdAt: now,
    updatedAt: now,
    resultFileName: '',
    errorMessage: ''
  }
}

export function getMockCompletedTask(task) {
  return {
    ...task,
    status: 'COMPLETED',
    statusText: '已完成',
    progress: 100,
    successCount: 31,
    failedCount: 2,
    reviewCount: 3,
    updatedAt: Date.now(),
    resultFileName: '商品清单_归类结果.xlsx'
  }
}

export function getMockFailedTask(task) {
  return {
    ...task,
    status: 'FAILED',
    statusText: '处理失败',
    progress: 100,
    successCount: 0,
    failedCount: task.totalCount || 0,
    reviewCount: 0,
    updatedAt: Date.now(),
    errorMessage: 'Excel 文件字段缺失，请确认包含商品名称、用途、材质、规格型号等列。'
  }
}

export function getMockBatchHistory() {
  return [
    {
      id: 'batch_history_001',
      fileName: '6月进口商品清单.xlsx',
      status: 'COMPLETED',
      statusText: '已完成',
      progress: 100,
      totalCount: 128,
      successCount: 116,
      failedCount: 4,
      reviewCount: 8,
      resultFileName: '6月进口商品清单_归类结果.xlsx',
      createdAt: Date.now() - 1000 * 60 * 60 * 3
    },
    {
      id: 'batch_history_002',
      fileName: '电子产品申报清单.xlsx',
      status: 'PROCESSING',
      statusText: '处理中',
      progress: 62,
      totalCount: 54,
      successCount: 31,
      failedCount: 1,
      reviewCount: 2,
      resultFileName: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 8
    },
    {
      id: 'batch_history_003',
      fileName: '服装类商品清单.xlsx',
      status: 'FAILED',
      statusText: '处理失败',
      progress: 100,
      totalCount: 42,
      successCount: 0,
      failedCount: 42,
      reviewCount: 0,
      resultFileName: '',
      errorMessage: '模板格式不正确，请下载标准模板后重新上传。',
      createdAt: Date.now() - 1000 * 60 * 60 * 24
    }
  ]
}