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
