<template>
	<view>
		index page212
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			uni.request({
				// 请求后端：https://192.168...index.php?token=api2020&c=index&m=member
				url: this.apiServer+'index&m=member',
				method: 'GET',
				success: res => {
					console.log('请求成功 = ',JSON.stringify(res));
				},
				fail:(e)=>{
					console.log('请求失败 = ',JSON.stringify(e));
				},
				complete:()=>{}
			});
		},
		methods: {

		}
	}
</script>

<style>
</style>
