import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 定义全局方法，检查用户是否登录
Vue.prototype.checkLogin = function(backpage, backtype){
	// 获取用户之前缓存在本地数据信息, 如果没有授权过或, 则跳转授权
	var SUID  = uni.getStorageSync('SUID');
	var SRAND = uni.getStorageSync('SRAND');
	var SNAME = uni.getStorageSync('SNAME');
	var SFACE = uni.getStorageSync('SFACE');
	if(SUID == '' || SRAND == '' || SFACE == ''){
		// 检测尚未授权则跳转页面
		uni.redirectTo({url:'../login/login?backpage='+backpage+'&backtype='+backtype});
		uni.showToast({
			title:"请授权登录"
		})
		return false;
	}
	// 已经登录返回数组 [用户 id, 用户随机码, 用户昵称, 用户表情]
	return [SUID, SRAND, SNAME, SFACE];
}

// 与后端交互
var APITOKEN  = 'api2020';
// 这里的IP地址可以填你自己的局域网地址或域名地址
Vue.prototype.apiServer='http://192.168.1.101/index.php?token='+APITOKEN+'&c=';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
