<template>
	<view>
		white page
	</view>
</template>

<script>
	let loginRes;
	export default {
		data() {
			return {
				
			}
		},
		onLoad:function() {
			// 使用 main.js 定义的全局方法来检查用户是否登录
			loginRes = this.checkLogin('./write/write',2)
			// 无登录则返回空
			if(!loginRes){return;}
		}
	}
</script>

<style>

</style>
