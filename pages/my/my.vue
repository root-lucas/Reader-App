<template>
	<view>
		hello my page
	</view>
</template>

<script>
	let loginRes
	export default {
		data() {
			return {
				
			}
		},
		onLoad:function() {
			// 使用 main.js 定义的全局方法来检查用户是否登录
			loginRes = this.checkLogin('./my/my',2)
			// console.log('loginRes = ',loginRes)
			// 尚未登陆则跳转至login.vue
			if(!loginRes){return;}
		}
	}
</script>

<style>

</style>
