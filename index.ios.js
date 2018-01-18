import { AppRegistry } from 'react-native';

global.Buffer = global.Buffer || require('buffer').Buffer;

import App from './js/ClientApp';

AppRegistry.registerComponent('aftbomb', () => App);
