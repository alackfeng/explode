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
