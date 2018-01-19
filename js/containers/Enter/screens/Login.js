import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  menu: {
  	margin: 10,
  	padding: 10
  }
});

class Login extends Component {
	render() {

		const { navigation } = this.props;
		return (
			<View style={styles.container} >
				<Text style={styles.welcome} >Welcome to Aftrade Enter</Text>
				<Button style={styles.menu} title="Enter to Main Page" 
					onPress={() => navigation.navigate('Home')}
				/>
				<Button style={styles.menu} title="Enter to Draw Page" 
					onPress={() => navigation.navigate('Draw')}
				/>
			</View>
		);
	}
}

export const LoginScreen = Login;