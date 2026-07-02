<template>
	<view class="login-page">
		<view class="login-logo">
			<view class="login-logo-icon">AI</view>
			<view class="login-title">AI商品归类与规范申报</view>
			<view class="login-subtitle">智能辅助 · 高效归类 · 精准申报</view>
		</view>

		<view class="login-form">
			<view class="form-item">
				<view class="form-label">账号名</view>
				<input v-model="form.account" class="form-input" placeholder="请输入您的账号名" />
			</view>

			<view class="form-item">
				<view class="form-label">单位名</view>
				<input v-model="form.company" class="form-input" placeholder="请输入您的单位名称" />
			</view>

			<view class="form-grid">
				<view class="form-item">
					<view class="form-label">省份</view>
					<picker :range="provinceOptions" @change="handleProvinceChange">
						<view class="form-picker">{{ form.province || '请选择省份' }}</view>
					</picker>
				</view>

				<view class="form-item">
					<view class="form-label">行业</view>
					<picker :range="industryOptions" @change="handleIndustryChange">
						<view class="form-picker">{{ form.industry || '请选择行业' }}</view>
					</picker>
				</view>
			</view>

			<view class="form-item">
				<view class="form-label">邀请码（选填）</view>
				<input v-model="form.inviteCode" class="form-input" placeholder="如有邀请码可输入，享受费用减免" />
				<view v-if="showInviteHint" class="invite-hint">
					邀请码有效，首次充值可享优惠或额外赠送 AI 咨询次数。
				</view>
			</view>

			<view class="login-action">
				<button class="login-btn" @click="handleLogin">登录</button>
			</view>

			<view class="login-tip">
				登录即表示同意《用户协议》和《隐私政策》
			</view>
		</view>
	</view>
</template>

<script>
	import { devLogin } from '../../common/api'
	export default {
		onLoad() {
		  const token = uni.getStorageSync('token')
		  const userInfo = uni.getStorageSync('mock_user')
		
		  if (token && userInfo) {
		    uni.switchTab({
		      url: '/pages/index/index'
		    })
		  }
		},

		data() {
			return {
				form: {
					account: '',
					company: '',
					province: '',
					industry: '',
					inviteCode: ''
				},
				provinceOptions: ['福建省', '广东省', '浙江省', '江苏省', '上海市', '北京市', '山东省'],
				industryOptions: ['进出口企业', '外贸公司', '跨境电商', '报关服务机构', '制造企业', '其他']
			}
		},

		computed: {
			showInviteHint() {
				return this.form.inviteCode && this.form.inviteCode.length >= 4
			}
		},

		methods: {
			handleProvinceChange(event) {
				this.form.province = this.provinceOptions[event.detail.value]
			},

			handleIndustryChange(event) {
				this.form.industry = this.industryOptions[event.detail.value]
			},

			async handleLogin() {
			  if (!this.form.account) {
			    uni.showToast({
			      title: '请输入账号名',
			      icon: 'none'
			    })
			    return
			  }
			
			  if (!this.form.company) {
			    uni.showToast({
			      title: '请输入单位名',
			      icon: 'none'
			    })
			    return
			  }
			
			  try {
			    uni.showLoading({
			      title: '登录中'
			    })
			
			    const loginResult = await devLogin({
			      openid: `dev_${this.form.account}`,
			      nickname: this.form.account
			    })
			
			    uni.hideLoading()
			
			    const token = loginResult.accessToken || loginResult.token
			
			    if (!token) {
			      uni.showToast({
			        title: '登录接口未返回 token',
			        icon: 'none'
			      })
			      return
			    }
			
			    const userInfo = {
			      account: this.form.account,
			      company: this.form.company,
			      province: this.form.province || '福建省',
			      industry: this.form.industry || '进出口企业',
			      inviteCode: this.form.inviteCode,
			      loginTime: Date.now()
			    }
			
			    uni.setStorageSync('token', token)
			    uni.setStorageSync('mock_user', userInfo)
			
			    uni.switchTab({
			      url: '/pages/index/index'
			    })
			  } catch (error) {
			    uni.hideLoading()
			    console.error('登录失败', error)
			  }
			}
		}
	}
</script>

<style>
	.login-page {
		min-height: 100vh;
		padding: 130rpx 40rpx 40rpx;
		background: #ffffff;
		box-sizing: border-box;
	}

	.login-logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 58rpx;
	}

	.login-logo-icon {
		width: 128rpx;
		height: 128rpx;
		margin: 0 auto 28rpx;
		border-radius: 40rpx;
		background: linear-gradient(135deg, #2563eb, #60a5fa);
		color: #ffffff;
		font-size: 40rpx;
		font-weight: 900;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 20rpx 48rpx rgba(37, 99, 235, 0.22);
	}

	.login-title {
		font-size: 40rpx;
		font-weight: 900;
		color: #111827;
	}

	.login-subtitle {
		margin-top: 12rpx;
		font-size: 26rpx;
		color: #64748b;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 28rpx;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20rpx;
	}

	.form-label {
		margin-bottom: 12rpx;
		font-size: 26rpx;
		font-weight: 800;
		color: #334155;
	}

	.form-input,
	.form-picker {
		height: 96rpx;
		padding: 0 28rpx;
		border-radius: 28rpx;
		background: #f8fafc;
		border: 1px solid #e5e7eb;
		color: #111827;
		font-size: 28rpx;
		box-sizing: border-box;
	}

	.form-picker {
		display: flex;
		align-items: center;
		color: #64748b;
	}

	.invite-hint {
		margin-top: 12rpx;
		padding: 18rpx 22rpx;
		border-radius: 22rpx;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #15803d;
		font-size: 24rpx;
		line-height: 1.5;
	}

	.login-action {
		margin-top: 44rpx;
		width: 100%;
	}

	.login-btn {
		width: 100%;
		height: 92rpx;
		padding: 0;
		border-radius: 24rpx;
		background: #2563eb;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 900;
		line-height: 92rpx;
		box-shadow: 0 22rpx 48rpx rgba(37, 99, 235, 0.22);
	}

	.login-btn::after {
		border: none;
	}

	.login-tip {
		margin-top: 12rpx;
		text-align: center;
		font-size: 24rpx;
		color: #94a3b8;
	}
</style>