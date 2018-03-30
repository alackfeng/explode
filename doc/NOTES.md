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



#### 1.1.2版本更新说明

1. 优化登录和注册页面框光标为白色，增强辨识度
2. 修复中英文国际化部分翻译
3. 美化转账安全提示页面
4. 优化收款二维码功能提示
5. 优化加载器提示
6. 交易二次确认增加费用提示



####
#### 20180317

###### 1. 增加ListItem中的titleContainer样式设置，用于NodeItem组件
vi /Users/assetfun/source/aftapp/explode-app/node_modules/react-native-elements/src/list/ListItem.js =>
<View style={[styles.titleSubtitleContainer, titleWrapStyle && titleWrapStyle]}>

####

#### 20180306 -: 
##### 1. 增加密码强度较验，密码中必须包含大小写字母&数字&常见特殊字符，建议至少15个字符，最多63个字符。

#### 20180305 -: 
##### 1. BUG：修复注册时获取不到账号余额数据 
##### 2. BUG：修复交易历史时间显示问题，分时天年


####



```sh

##### IOS打包
1. 生成jsbundle
mkdir -p ./ios/bundle;
react-native bundle --entry-file ./index.ios.js --bundle-output ./ios/bundle/index.ios.jsbundle --platform ios --assets-dest ./ios/bundle --dev false
2. 将之前打包好的jsbundle和assets拖入xcode工程下面, 注意一定要选择 Create folder references：
3. Xcode -> Product -> Scheme -> release
3. Xcode -> Product -> Archive
 
or: react-native run-ios --configuration Release

4. 转化成.ipa
mkdir -p ~/Desktop/aftbomb-dist; mkdir -p ~/Desktop/aftbomb-dist/Payload;
cp -rf ./ios/build/Build/Products/Release-iphonesimulator/aftbomb.app ~/Desktop/aftbomb-dist/Payload/aftbomb.app
cd ~/Desktop/aftbomb-dist
zip -r aftbomb.ipa Payload

5. other:
vi /Users/assetfun/source/aftapp/explode-app/node_modules/react-native-modal/src/index.js => 
  
  if(DeviceEventEmitter)
      DeviceEventEmitter.addListener('didUpdateDimensions', this._handleDimensionsUpdate);

vi /Users/assetfun/source/code/explode/node_modules/react-native-elements/src/buttons/Button.js =>
// expo

```

#### 20180222 -: 
##### 优化引导页界面

####

#### 20180221 -: 
##### 
##### react-native-splash-screen解决启动白屏现象

```sh
1. 准备icon and launch images, 通过网址生成图标： https://apetools.webprofusion.com/app/#/tools/imagegorilla
 icon: 1024*1024.png  背景设纯白之类
 launch： 2048*2048　.png  不合适的再修改 
2. 添加到app中，
3. 安装 https://github.com/crazycodeboy/react-native-splash-screen/blob/master/README.zh.md
yarn add react-native-splash-screen
react-native link react-native-splash-screen
4. 
```

####

#### 20180208 -: 
##### 增加gulp boilerplate 支持编译
npm install --save-dev gulp run-sequence shelljs lodash.assign lodash.isequal yargs fs-extra

#### 20180207 -: 
##### 登录注册流程优化，可正常使用
##### 解锁流程优化，

#### 20180206 -: 
##### 记录几个问题：
```sh
1. APP启动加载慢会死掉，但再打开是已经加载的。可能跟数据或渲染有关
2. APP锁屏时或断开连接，如何再次连接呢 ？ 区块节点切换屏幕会死掉无响应(CPU,内存高涨,why?)

```sh
		Apis.reset(connectUrl, true); /去掉注释的内容（init_promise），内存、CPU不再高涨
  	/*.init_promise
  	.then(()=> {
  		console.log("++++++[Node.js]::updateConnect - apis::reset - ", this);

  	});*/
```

3. 内存过高，有100M大小，不知正常不？？？
4. 余额变动时实时更新？？？是否延用原来的
5. 

```


#### 20180201 -: 
##### 节点连接功能梳理：
```sh
1. APP启动时自动 
	初始化节点配置: this.props.dispatch(initConnect([], null))
	监听连接状态：Apis.setRpcConnectionStatusCallback(this.updateRpcConnectionStatusCallback.bind(this));
	尝试连接节点：willTransitionTo(null, null, nodeTransition);
	刷新节点延迟：
2. 

```

#### 20180130 -: 
##### APP启动加载store初始化数据，如私钥等
##### 钱包管理数据结构整理

```sh
1. 锁存在于内存中，而不是持久化上，
2. faucet_address 可通过WalletDb去取配置，at users.box.js
3. 
ChainStore.getAccountRefsOfKey(pubkey), 获取KEY -> get_key_references
```
##### 增强安全性，如锁校验等


#### 20180129 -: 
##### 二次确认问题汇总：
```sh
1. 是否都要经过二次确认
{response: {type: 'second_confirm', transaction: tr, extra: extra}, error: null}
{response: {type: 'origin_confirm', transaction: tr, extra: extra}, error: null}

2. 二次确认时，delay等待支持，并接收confirm or cancel。confirm继续broadcase(),否则退出
3. 每次启动APP把私钥相当信息加载到内存中用于签名验证
4. 提案的流程暂时未处理，有点复杂，
5. 增强交易对话框与saga流程的交互性，包括打开对话框、展示流程信息、关闭对话框、超时关闭等
```


#### 20180127 -: 
##### 新增资产管理页面用于测试，
##### 尝试统一交易处理流程，解决打包交易与私钥管理，互相交互问题


#### 20180126 -: 

##### 注册功能优化：通过模式对话框展示流程调用成功或错误信息

#### 20180125 -: 

##### 模式对话框使用 TransactionConfirmModal.js
npm install --save react-native-modal


```sh
##### path.resolve(process.cwd(), 'node_modules', 'react-native-modal'),
##### path.resolve(process.cwd(), 'node_modules', 'react-native-animatable'),

vi /Users/assetfun/source/code/explode/node_modules/react-native-modal/src/index.js ====>>>>
    if( Platform.OS === 'android' || Platform.OS === 'ios') {
      DeviceEventEmitter.addListener('didUpdateDimensions', this._handleDimensionsUpdate);
    }
<<<====
```

#### 20180124 -: 

##### 节点连接管理功能，包括界面和库调用

##### 搜索框，
npm install --save react-native-search-bar
npm install --save react-native-material-design-searchbar


#### 20180123 -: 

##### 优化登录注册页面，
##### 


#### 20180122 -: 

##### 优化splash显示问题
##### 编写登录页面react-native-elements, 用户中心路由 




#### 20180121 -: 
##### 优化导航样式,增加重置NavigationActions,是否允许在标签之间进行滑动
##### 测试loadingAnimation
##### Splash启动页实现Swiper侧滑展示钱包功能说明

```sh
npm install --save react-swipeable-views react-motion
npm install --save react-swipeable-views-native
npm install --save react-native-elements
```

#### 20180120 -: 

##### 优化登录注册流程
*	注册通过注册服务商成功返回
##### 区块节点连接管理


#### 20180119 -: 

##### 增加login|register流程，saga

##### 增加redux-saga流程控制支持，解决几个问题
*	action->store处理过程中，可插入同时控制同步或异步的多次操作
*	action->store过程中saga可触发另一个action,并等待另一个action完成，再继续处理原action任务


#### 20180118 -: 

##### 增加区块基础库支持，包括 assetfunjs assetfunjs-ws库，可以调用注册账号成功

```sh
npm install --save git+https://github.com/alackfeng/assetfunjs.git

### npm install --save assetfunjs assetfunjs-ws

### 参考FAQ。 Q4 stream |  Q5 buffer
npm install --save react-native-stream
mv node_modules/react-native-stream node_modules/stream

global.Buffer = global.Buffer || require('buffer').Buffer;
/Users/assetfun/source/code/aftradeapp/node_modules/create-hash/make-hash.js

```

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
