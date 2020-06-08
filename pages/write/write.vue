<template>
    <view class="wrap">
        <view class="write_title">
            <input type="text" v-model="title" placeholder="请输入标题" />
        </view>
        <!-- 内容展示区 -->
        <view class="artList">
            <block v-for="(item, index) in artList" :key="index">
                <view class="item" v-if="item.type == 'image'"><image :src="item.content" :data-index="index" mode="widthFix" @tap="removeImg" /></view>
                <view class="item" v-if="item.type == 'text'">
                    <textarea placeholder="" v-model="artList[index].content" />
                    <view :data-index="index" class="deleteText" @tap="deleteText">删除</view>
                </view>
            </block>
        </view>
        <!-- 输入区 -->
        <form @submit="submit">
            <view class="inputArea">
                <view class="addImg" @tap="addImg">+图片</view>
                <view class="addText">
                    <textarea name="artText" maxlength="-1" v-model="inputContent" placeholder="请输入文本" />
                    <button type="primary" form-type="submit">添加</button>
                </view>
            </view>
        </form>
        <!-- 选择分类 -->
        <view class="art-cate">
            <view>文章分类</view>
            <view class="">
                <picker mode="selector" :range="caties" @change="cateChange">
                    <view>{{caties[currentCateIndex]}}</view>
                </picker>
            </view>
        </view>
        <!-- 提交按钮 -->
        <view class="submitNow" v-if="artList.length > 0">发布文章</view>
    </view>
</template>
<script>
	let _self, loginRes;
	// let signModel = require('../../commons/sign.js');
	export default {
		data() {
			return {
				title : '',
				artList : [],
				inputContent : "",
				needUploadImg : [],
				uploadIndex : 0,
				//分类
				caties : ['点击选择'],
				currentCateIndex : 0,
				catiesFromApi : [],
				// 记录真实选择的api接口数据的分类id
				sedCateIndex  : 0
			}
		},
		onLoad:function() {
			// 使用 main.js 定义的全局方法来检查用户是否登录
			loginRes = this.checkLogin('./write/write',2)
			// signModel.sign(this.apiServer);
			_self = this;
			// 无登录则返回空
			if(!loginRes){return false;}
			// 加载文章分类
			uni.request({
				url: this.apiServer+'category&m=index',
				method: 'GET',
				success: res => {
					if(res.data.status == 'ok'){
						// 把数据格式整理为 picker 支持的格式 ['分类名', ...]
						let categories = res.data.data;
						for(let k in categories){
							_self.caties.push(categories[k]);
						}
						// 记录分类信息
						_self.catiesFromApi = categories;
					}
				}
			});
		},
		methods:{
			cateChange : function(e){
				// 拿到分类序号
				let sedIndex = e.detail.value;
				this.currentCateIndex = sedIndex;
				// 获取选择的分类名称
				if(sedIndex < 1){return ;}
				let cateName = this.caties[sedIndex];
				for(let k in this.catiesFromApi){
					if(cateName == this.catiesFromApi[k]){
						this.sedCateIndex = k;
						break;
					}
				}
				console.log('sendindex = ', sedIndex)
				this.currentCateIndex = sedIndex;
			},
			removeImg : function(e){
				let index = e.currentTarget.dataset.index;
				uni.showModal({
					content:"确定要删除此图片吗",
					title:'提示',
					success(e) {
						if (e.confirm) {
							_self.artList.splice(index, 1);
						}
					}
				});
			},
			deleteText : function(e){
				var index = e.currentTarget.dataset.index;
				uni.showModal({
					content:"确定要删除吗",
					title:'提示',
					success(e) {
						if (e.confirm) {
							_self.artList.splice(index, 1);
						}
					}
				});
			},
			submit : function(res){
				console.log('submit = ',this.artList)
				var content = res.detail.value.artText;
				if(content.length < 1){uni.showToast({title:"请输入内容",icon:'none'}); return ;}
				this.artList.push({"type":"text", "content" : content});
				this.inputContent = '';
			},
			addImg : function(){
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: function(res) {
						_self.artList.push({"type":"image", "content" : res.tempFilePaths[0]})
					}
				})
			}
		}
	}
</script>

<style>

</style>
