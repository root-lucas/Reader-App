<template>
	<view>
		
	</view>
</template>

<script>
	let _self;
	export default {
		data() {
			return {
				
			}
		},
		onLoad: function(options){
			console.log("options = ",options)
			_self = this
			
			// 条件编译（app）,授权微信号作为第三方登录该 app 的代码
			// #ifdef APP-PLUS
			uni.login({
				success: (res) => {
					// 如: 请求获取到微信用户登录授权的信息，如头像，微信昵称
					uni.getUserInfo({
						// provider: 'weixin',
						success:function(info){
							console.log('请求登录授权成功的用户全部信息 = ', JSON.stringify(info))
							
							// 将用户登录授权的信息保存至后端数据库
							uni.request({
								url:_self.apiServer+'member&m=login',
								method:'POST',
								header: {"content-type" : "application/x-www-form-urlencoded"},
								data:{
									openid: info.userInfo.openId,
									name: info.userInfo.nickName,
									face: info.userInfo.avatarUrl,
								},
								success:res=>{
									// 前面保存成功后再从后端数据库读取信息
									console.log("成功获取后端数据库信息 = ", JSON.stringify(res))
									res = res.data;
									// 登录成功 记录会员信息到本地缓存
									if(res.status == 'ok'){
										uni.showToast({title:"登录成功"});
										// 将数据库的授权信息缓存到本地，避免每次都需要重新授权
										uni.setStorageSync('SUID' , res.data.u_id + '');
										uni.setStorageSync('SRAND', res.data.u_random + '');
										uni.setStorageSync('SNAME', res.data.u_name + '');
										uni.setStorageSync('SFACE', res.data.u_face + '');
										// 跳转
										if(options.backtype == 1){
											uni.redirectTo({url:options.backpage});
										}else{
											uni.switchTab({url:options.backpage});
										}
									}else{
										uni.showToast({title:res.data});
									}
								},
								fail:(e)=>{
									console.log("获取后端数据库信息失败 = ",JSON.stringify(e))
									uni.showToast({title:"微信登录授权失败"});
								}
							})
						},
						fail:()=>{
							uni.showToast({title:"微信登录授权失败",icon:"none"});
							// uni.hideLoading();
						}
					})
				},
				fail: (e) => {
					uni.showToast({title:"微信登录授权失败",icon:"none"})
				}
			})
			// #endif
		}
	}
</script>

<style>

</style>
