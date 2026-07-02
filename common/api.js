import request from './request'

export function devLogin(data) {
  return request({
    url: '/auth/dev-login',
    method: 'POST',
    data
  })
}

export function getCurrentUser() {
  return request({
    url: '/auth/me',
    method: 'GET'
  })
}
export function createAiConsultation(data = {}) {
  return request({
    url: '/ai-consultations',
    method: 'POST',
    data
  })
}

export function sendAiConsultationMessage(sessionId, data) {
  return request({
    url: `/ai-consultations/${sessionId}/messages`,
    method: 'POST',
    data
  })
}