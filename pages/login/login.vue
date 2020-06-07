<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">使用微信登录</button>
		<!-- #endif -->
	</view>
</template>

<script>
	let _self, pageOptions, session_key, openid;;
	export default {
		data() {
			return {
				
			}
		},
		methods:{
			// 微信小程序端使用微信授权登录
			// #ifdef MP-WEIXIN
			getUserInfo:function(info){
				info = info.mp.detail.userInfo;
				uni.request({
					url: _self.apiServer+'member&m=login',
					method: 'POST',
					header: {'content-type' : "application/x-www-form-urlencoded"},
					data: {
						openid : openid,
						name   : info.nickName,
						face   : info.avatarUrl,
					},
					success:(res)=>{
						// console.log('res = ',res);
						res = res.data;
						// 登录成功 记录会员信息到本地
						if(res.status == 'ok'){
							uni.showToast({title:"登录成功"});
							uni.setStorageSync('SUID' , res.data.u_id + '');
							uni.setStorageSync('SRAND', res.data.u_random + '');
							uni.setStorageSync('SNAME', res.data.u_name + '');
							uni.setStorageSync('SFACE', res.data.u_face + '');
							// 跳转
							if(pageOptions.backtype == 1){
								// navigateTo, redirectTo 只能打开非 tabBar 页面
								uni.redirectTo({url:pageOptions.backpage});
							}else{
								// switchTab 只能打开 tabBar 页面。
								uni.switchTab({url:pageOptions.backpage});
							}
						}else{
							uni.showToast({title:res.data});
						}
					},
					fail:(e)=>{
						console.log(JSON.stringify(e));
					}
				})
			},
			// #endif
		},
		onLoad: function(options){
			_self = this;
			pageOptions = options;
			
			// 微信小程序端使用微信授权登录
			// #ifdef MP-WEIXIN
			// 调用 微信 login 获取 code
			uni.login({
				success: (res) => {
					// console.log('调用微信login= ', res)
					uni.request({
						// 微信API手册：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
						url:_self.apiServer+'member&m=codeToSession&code='+res.code,
						success: (sessions) => {
							// console.log('sessions = ', sessions)
							// 获取 unionId
							session_key = sessions.data.session_key;
							openid      = sessions.data.openid;
						},
					});
				}
			});
			// #endif
			
			// 条件编译（app）,授权微信号作为第三方登录该 app 的代码
			// app 端使用微信授权登录
			// #ifdef APP-PLUS
			uni.login({
				success: (res) => {
					// 如: 请求获取到微信用户登录授权的信息，如头像，微信昵称
					uni.getUserInfo({
						provider: 'weixin',  // 不填依旧默认是微信
						success:function(info){
							console.log('请求登录授权成功的用户全部信息 = ', JSON.stringify(info))
							
							// 将用户登录授权的信息保存至后端数据库
							uni.request({
								// login是member控制器的方法
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
