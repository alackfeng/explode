#构建全平台app - FAQ.

## 操作日志


##### FAQ

```sh
Q1. Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'
A1. 因为webpack 2中不允许混用import和module.exports ,
解决办法就是统一改成ES6的方式编写即可.
```

```sh
Q2. warning.js?6327:33 Warning: React does not recognize the `headerMode` prop on a DOM element
A2. StackNavigator({}, {headerMode: 'none'})
```

```sh
Q3. Uncaught (in promise) Unsupported platform . @createNavigationContainer.js
A3.
```

```sh
Q4. Unable to resolve module `stream` from `/Users/assetfun/source/code/aftradeapp/node_modules/cipher-base/index.js`
A4. ----不使用了，npm install stream --save，直接把react-native-stream改成stream
npm install --save react-native-stream
mv node_modules/react-native-stream node_modules/stream
```

```sh
Q5. Can't find variable: Buffer
A5. npm install --save buffer
var Buffer = require('buffer').Buffer;
if(typeof global !== 'undefined') {
global.Buffer = require('buffer').Buffer; // TODO just use global Buffer
}
npm install --save assetfunjs-ws assetfunjs

global.Buffer = global.Buffer || require('buffer').Buffer;
/Users/assetfun/source/code/aftradeapp/node_modules/create-hash/make-hash.js
```

```sh
Q6. undefined is not an object (evaluating 'superCtor.prototype')
A6. ----不使用了，npm install stream --save，直接把react-native-stream改成stream
```

```sh
Q7. redux-saga Uncaught ReferenceError: regeneratorRuntime is not defined
A7. npm install --save-dev babel-polyfill
import 'regenerator-runtime/runtime'; ----- sagas/index.js 加入
```

```sh
Q8. Could not find com.android.tools.build:gradle:3.0.1
A8. 增加google()到android/build.gradle 支持3.0.1
```

```sh
Q9. Cannot find entry file index.js in any of the roots
A9.
vi android/app/build.gradle =>
project.ext.react = [
entryFile: "index.android.js"
]
vi android/app/src/main/java/com/aftbomb/MainApplication.java =>
protected String getJSMainModuleName() {
return "index.android";
}
```

```sh
Q10. React Native unable to load script from assets index.android.bundle

A10. mkdir -p android/app/src/main/assets;

react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest
```

```sh
Q11. react-native-i18n module is not correctly linked
A11. web.package.js => entry : { vendor: { 'react-native-i18n' } }
```


```sh
Q12. the module `MaterialIcons` could not be found within the package
A12. https://github.com/oblador/react-native-vector-icons/issues/626
rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json
```


```sh
Q13. Could not find "store" in either the context or props of "Connect(App)"
A13. 
```

```sh
Q14. Uncaught TypeError: __WEBPACK_IMPORTED_MODULE_0_path_to_regexp___default.a.compile is not a function
A14. npm install --save path-to-regexp
```


```sh
Q15. No bundle URL present.
Make sure you're running a packager server or have included a .jsbundle file in your application bundle.
A15. 多半是环境问题，如使用网络代理
```


```sh
Q16. Can't find variable: self
A16. 
npm install --save isomorphic-fetch es6-promise
react-native不需要支持这个，注释掉即可
```


```sh
Q17. redux-persist/createPersistoid: error serializing state TypeError: Converting circular structure to JSON
A17. 不使用persist，只通过cached
```

```sh
Q18. Overflow during conversion: "18761827272590623000"
A18. 
```


```sh

Q19. react-native-elements 导入后提示，
Module parse failed: Unexpected token (12:11) You may need an appropriate loader to handle this file type
A19. 在webpack.config.js增加相应的库导入 
```

```sh
Q20. ./node_modules/react-native-elements/src/buttons/Button.js
Module not found: Error: Can't resolve 'expo' in '/Users/assetfun/source/code/explode/node_modules/react-native-elements/src/buttons'
A20. View //require('expo').LinearGradient
vi /Users/assetfun/source/code/explode/node_modules/react-native-elements/src/buttons/Button.js
```

```sh
Q21. Your browser does not support window.crypto
/Users/assetfun/source/code/aftradeapp/node_modules/secure-random/lib/secure-random.js
A21. 


/Users/assetfun/source/code/explode/node_modules/secure-random/lib/secure-random.js =>

----------
    var crypto = window.crypto || window.msCrypto
    if (!crypto) { 
      //  粗旷的实现，在ios|android上使用
      return normalRandom(count, options);  //throw new Error("Your browser does not support window.crypto.")
    }
    else
      return browserRandom(count, options)

----------
function normalRandom(count, options) {
  
  var nativeArr = new Array(count);
  for (var i = 0; i < count; i++) {
    nativeArr[i] = Math.floor(Math.random() * 256);
  }

  switch (options.type) {
    case 'Array':
      return [].slice.call(nativeArr)
    case 'Buffer':
      try { var b = new Buffer(1) } catch(e) { throw new Error('Buffer not supported in this environment. Use Node.js or Browserify for browser support.')}
      return new Buffer(nativeArr)
    case 'Uint8Array':
      return nativeArr
    default:
      throw new Error(options.type + " is unsupported.")
  }

}

```

```sh
Q22. The above error occurred in the <ReactNativeModal> component, Uncaught TypeError: Cannot read property 'addListener' of undefined
A22.     


    /Users/assetfun/source/aftapp/explode-app/node_modules/react-native-modal/src/index.js

    if(DeviceEventEmitter)
      DeviceEventEmitter.addListener('didUpdateDimensions', this._handleDimensionsUpdate);
```


```sh
Q23. React Native version mismatch. JavaScript version: 0.52.0 Native version: 0.50.4
A23. yarn add react-native@0.52.0
```

```sh
Q24. Cannot find module 'metro-bundler/src/blacklist'
A24. metro-bundler改成metro
```

```sh
Q25. Metro Bundler has encountered an internal error, please check your terminal error output for more details
A25. 降低NODE版本到8
brew install node@8
brew switch node@8 8.9.3_1
brew unlink node
brew link node@8
echo 'export PATH="/usr/local/opt/node@8/bin:$PATH"' >> ~/.bash_profile
```

```sh
Q26. Unable to start activity ComponentInfo{com.aftbomb/com.aftbomb.MainActivity}: java.lang.UnsupportedOperationException: Can't convert value at index 35 to color: type=0x1
A26. vi /Users/assetfun/source/aftapp/explode-app/android/app/src/main/res/values/colors.xml =>
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary_dark"></color>
</resources>
```

```sh
Q27. 01:22:43.077 [ERROR] [org.gradle.api.Project] ERROR: D:\Android\wlApp\android\app\build\intermediates\res\merged\release\drawable-hdpi\node_modules_reactnavigation_src_views_assets_backicon.png uncompiled PNG file passed as argument. Must be compiled first into .flat file.
A27. vi /Users/assetfun/source/aftapp/explode-app/android/gradle.properties => 
android.enableAapt2=false
```

```sh
Q28. A valid provisioning profile for this executable was not found.
A28. rm ~/Library/MobileDevice/Provisioning\ Profiles/*

```

```sh
Q29. Unhandled JS Exception: undefined is not an object (evaluating 's.PropTypes..., stack:
A29. vi /Users/assetfun/source/aftapp/explode-app/node_modules/react-native-smart-barcode/Barcode.js => 
import PropTypes from 'prop-types'

```




