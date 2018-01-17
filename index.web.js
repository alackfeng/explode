import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('aftbomb', () => App);

AppRegistry.runApplication('aftbomb', {
	rootTag: document.getElementById('container'),
});

