import { AppRegistry } from 'react-native';
import App from "./js/ClientApp";

AppRegistry.registerComponent('aftbomb', () => App);

AppRegistry.runApplication('aftbomb', {
	rootTag: document.getElementById('container'),
});

