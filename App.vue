<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
page {
  background: #f5f7fb;
  color: #172033;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page {
  min-height: 100vh;
  background: #f5f7fb;
  padding: 24rpx;
  box-sizing: border-box;
}

.hero-card {
  border-radius: 36rpx;
  padding: 34rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #2f6bff, #55b6ff);
  box-shadow: 0 20rpx 44rpx rgba(47, 107, 255, 0.18);
}

.hero-title {
  font-size: 40rpx;
  font-weight: 900;
}

.hero-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  line-height: 1.6;
  opacity: 0.92;
}

.white-card {
  margin-top: 24rpx;
  padding: 30rpx;
  border-radius: 32rpx;
  background: #ffffff;
  border: 1px solid #e5eaf2;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.04);
}

.card-title {
  font-size: 32rpx;
  font-weight: 900;
  color: #172033;
}

.card-desc {
  margin-top: 10rpx;
  font-size: 26rpx;
  line-height: 1.6;
  color: #8290a6;
}

.feature-list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.feature-row {
  padding: 22rpx;
  border-radius: 24rpx;
  background: #f8fafc;
  border: 1px solid #e5eaf2;
}

.feature-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #172033;
}

.feature-desc {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #8290a6;
  line-height: 1.5;
}
</style>
