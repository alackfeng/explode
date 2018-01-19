import { AppRegistry } from 'react-native';

//global.self = global;
//require('es6-promise').polyfill();
global.Buffer = global.Buffer || require('buffer').Buffer;

import App from './js/ClientApp';

AppRegistry.registerComponent('aftbomb', () => App);
