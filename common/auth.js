export function ensureLogin() {
  const token = uni.getStorageSync('token')
  const user = uni.getStorageSync('mock_user')

  if (token && user) {
    return true
  }

  uni.reLaunch({
    url: '/pages/login/login'
  })

  return false
}