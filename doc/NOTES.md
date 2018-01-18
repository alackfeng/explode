#构建全平台app

## 操作日志

#### 开发环境

*	10.13.2 (17C88)
*	MacBook Pro (15-inch, 2016)
*	android studio
*	xcode
*	node|npm|...
*	react|react-native
*	react-native-cli: 2.0.1

####

##### 增加导航功能，react-navigation. 增加国际化支持，i18n。 增加ICON支持

```sh
npm install --save react-redux redux ###react-navigation
npm install --save-dev file-loader
npm install --save react-native-vector-icons react-native-i18n
npm install --save styled-components
npm install --save animated lodash

npm install --save redux-persist redux-thunk redux-logger redux-saga

npm install --save git+https://github.com/react-community/react-navigation.git#d5618ebd41ec1ac53cb40301d0f71610fbbb7172
npm install --save path-to-regexp

```

##### 导航列表 -
两部分：
1. 引导导航 StackNavigator
	* Splash 第一次启动时引导说明
		A. 已经认证过，直接跳转到主导航。 
		B. 可点击进入Login页面。
		C. 可点击进入Register页面。
		D. 可跳过，直接进入主导航（浏览模式）

	* Login 登录页面
		A. 完成用户登录认证（本地钱包认证，不需要连接网络？）。
		B. 成功后跳转到主导航
		C. 可跳转到Register页面
		D. 也可跳过，直接进入主导航（浏览模式）

	* Register 注册页面
		A. 检测网络连接性，
		B. 验证账号密码有效性，账号是否注册过，私钥派生的公钥是否注册过账号
		C. 注册账号并保存在本地

	* Welcome 用于第三方进入，通过link - path
		aftbomb://welcome,，并显示信息是否已登录

	* Main 进入主导航

2. 主导航

	* Home 首页|资讯 (预留)

	* ICO  资产积分发行 (预留)

	* ASSET 资产管理（资产列表|转账操作等）
		A. 用户拥有资产列表
		B. 资产相关信息说明
		C. 转账交易等

	* User 用户中心(我的相关)
		A. 用户基本信息显示
		B. 节点连接性管理
		C. 更改密码
		D. 账号相关操作历史
		E. 消息通知中心
		F. 账号密码的失效验证

3. 顶部设计（搜索、设置等）

#### 20180117 -: 

##### first init explode project

```sh
# 构建ios&android工程
react-native init aftbomb
mv aftbomb explode
# 通过android studio 或 react-native 编译测试android
react-native run-android --device
# 通过xcode 或 react-native 编译测试ios
react-native run-ios 

```

##### 增加开发者签名，xcode编译测试OK

##### 修改index.js to index.android.js, android编译测试OK

```sh
#拆分index.js，根据不同平台调用不同的index入口 
```

##### 增加index.ios.js， ios编译测试OK

```sh
#拆分index.js，根据不同平台调用不同的index入口 
```

##### 增加web支持，编译测试OK

```sh
#增加web支持，通过react-native-web替换react-native构建

npm install --save react react-dom react-native-web
npm install --save-dev webpack webpack-dev-server
npm install --save-dev babel-loader url-loader babel-preset-react babel-preset-es2015
npm install --save-dev babel-cli babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-0
npm install --save-dev babel-plugin-transform-react-remove-prop-types babel-plugin-transform-react-constant-elements babel-plugin-transform-react-inline-elements babel-plugin-array-includes

```
