const BASE_URL = 'http://127.0.0.1:3000'

function normalizeErrorResponse(res) {
  const data = res.data || {}

  let message = data.message || data.error || '请求失败'

  if (Array.isArray(message)) {
    message = message.join('；')
  }

  return {
    statusCode: res.statusCode,
    code: data.code || data.errorCode || '',
    message,
    detail: data.detail || data.details || null,
    raw: data
  }
}

function request(options) {
  const token = uni.getStorageSync('token')

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...(options.header || {})
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }

        const errorInfo = normalizeErrorResponse(res)

        // 这里不要只 reject 原始 res，要把后端业务错误结构传给页面
        reject(errorInfo)
      },
      fail(error) {
        reject({
          statusCode: 0,
          code: 'NETWORK_ERROR',
          message: '后端服务连接失败',
          detail: null,
          raw: error
        })
      }
    })
  })
}

export default request